/* ============================================================
 *  晋楹记 · 单页 3D 应用
 *  - 五个模块（闯关/古建/藏品/社区/我的）共用一个页面
 *  - 顶部标签切换：每个场景是“接收容器的工厂函数”，返回 {dispose}
 *  - 共享本地存档 localStorage，数据互通
 * ============================================================ */
(function () {
  'use strict';

  /* ---------------- 共享存档（五个模块只读同一份） ---------------- */
  const SAVE_KEY = 'jinyingji_save_v1';
  function loadState() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; } }
  function saveState() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }
  let state = loadState();
  if (!state) state = {};
  const DEFAULTS = { inventory: {}, woodchips: 5, built: [], clearedLevels: {}, settings: {}, lastSign: '', freeWorks: [], sign: { name: '', cls: '' } };
  for (const k in DEFAULTS) if (state[k] === undefined) state[k] = DEFAULTS[k];
  if (!state.inventory) state.inventory = {};
  if (!state.clearedLevels) state.clearedLevels = {};
  if (!state.built) state.built = [];
  const ctx = { get state() { return state; }, saveState };

  /* ---------------- 全局音频系统：背景音乐(BGM) + 音效(SFX)，增益分离、设置持久化 ----------------
   * 项目全程离线自包含，背景音乐用 Web Audio 程序合成一段古筝五声音阶循环曲《雅致茶音》；
   * BGM 与 SFX 各自独立增益节点，互不干扰，清晰度互不影响。
   */
  const AudioSys = (function () {
    let ctxA = null, master = null, bgmGain = null, sfxGain = null;
    let bgmTimer = null, bgmRunning = false, step = 0, nextTime = 0;
    const KEY = 'jinyingji_audio_v1';
    let settings = { bgmOn: true, sfxOn: true, bgmVol: 0.6, sfxVol: 0.85 };
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === 'object') settings = Object.assign({}, settings, s); } catch (e) {}

    function ensure() {
      if (ctxA) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      ctxA = new AC();
      master = ctxA.createGain(); master.gain.value = 1; master.connect(ctxA.destination);
      bgmGain = ctxA.createGain(); bgmGain.gain.value = settings.bgmOn ? settings.bgmVol : 0; bgmGain.connect(master);
      sfxGain = ctxA.createGain(); sfxGain.gain.value = settings.sfxOn ? settings.sfxVol : 0; sfxGain.connect(master);
    }
    function resume() { ensure(); if (ctxA.state === 'suspended') ctxA.resume(); }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (e) {} }

    /* 音效：咔嗒 / 咬合（经 sfxGain，音量由音效滑块控制） */
    function playClick() {
      if (!settings.sfxOn) return; resume();
      const t = ctxA.currentTime;
      const osc = ctxA.createOscillator(), g = ctxA.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(1300, t); osc.frequency.exponentialRampToValueAtTime(420, t + 0.08);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(g); g.connect(sfxGain); osc.start(t); osc.stop(t + 0.13);
    }

    /* 古筝拨弦音色：基频三角波 + 八度泛音，短促指数衰减 */
    function pluck(freq, time, dur, vol) {
      const o1 = ctxA.createOscillator(), o2 = ctxA.createOscillator(), g = ctxA.createGain();
      o1.type = 'triangle'; o1.frequency.value = freq;
      o2.type = 'sine'; o2.frequency.value = freq * 2.01;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(vol, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      o1.connect(g); o2.connect(g); g.connect(bgmGain);
      o1.start(time); o2.start(time); o1.stop(time + dur + 0.05); o2.stop(time + dur + 0.05);
    }

    /* 《雅致茶音》古筝五声音阶循环曲（宫商角徵羽，G 调） */
    const SCALE = [196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 587.33]; // G3..D5
    const MELODY = [0, 2, 4, 3, 5, 4, 2, 0, 1, 3, 5, 4, 6, 5, 3, 1, 2, 4, 6, 5, 7, 6, 4, 2, 0, 2, 3, 5, 4, 2, 1, 0];
    const BEAT = 0.42; // 每拍秒数
    function scheduleBgm() {
      if (!bgmRunning || !ctxA) return;
      while (nextTime < ctxA.currentTime + 0.7) {
        const idx = MELODY[step % MELODY.length];
        const f = SCALE[idx];
        pluck(f, nextTime, 0.9, 0.5);                                   // 主旋律
        if (step % 2 === 0) pluck(SCALE[0] / 2, nextTime, 1.5, 0.3);    // 低音根音铺底
        if (step % 4 === 2) pluck(SCALE[(idx + 2) % SCALE.length], nextTime + BEAT * 0.5, 0.7, 0.26); // 轻和声
        nextTime += BEAT; step++;
      }
    }
    function startBgm() {
      resume();
      if (!settings.bgmOn) return;
      if (bgmRunning) return;
      bgmRunning = true; nextTime = ctxA.currentTime + 0.12; step = 0;
      bgmTimer = setInterval(scheduleBgm, 160);
    }
    function stopBgm() { bgmRunning = false; if (bgmTimer) clearInterval(bgmTimer); bgmTimer = null; }

    function setBgmOn(v) { settings.bgmOn = !!v; save(); if (bgmGain) bgmGain.gain.value = settings.bgmOn ? settings.bgmVol : 0; if (settings.bgmOn) startBgm(); else stopBgm(); }
    function setSfxOn(v) { settings.sfxOn = !!v; save(); if (sfxGain) sfxGain.gain.value = settings.sfxOn ? settings.sfxVol : 0; }
    function setBgmVol(v) { settings.bgmVol = Math.max(0, Math.min(1, v)); save(); if (settings.bgmOn && bgmGain) bgmGain.gain.value = settings.bgmVol; }
    function setSfxVol(v) { settings.sfxVol = Math.max(0, Math.min(1, v)); save(); if (settings.sfxOn && sfxGain) sfxGain.gain.value = settings.sfxVol; }
    function getSettings() { return { bgmOn: settings.bgmOn, sfxOn: settings.sfxOn, bgmVol: settings.bgmVol, sfxVol: settings.sfxVol }; }
    function toggleBgm() { setBgmOn(!settings.bgmOn); return settings.bgmOn; }
    function toggleSfx() { setSfxOn(!settings.sfxOn); return settings.sfxOn; }
    return { resume, playClick, startBgm, stopBgm, setBgmOn, setSfxOn, setBgmVol, setSfxVol, getSettings, toggleBgm, toggleSfx };
  })();
  window.AudioSys = AudioSys; // 供设置面板 / 其他模块共享

  /* ---------------- 渲染器色彩空间兼容（新版 / 旧版 Three.js） ---------------- */
  function outColor(renderer) {
    if (THREE.SRGBColorSpace !== undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  }

  /* ---------------- 共享知识卡弹窗（答题后 / 拼完古建后，点空白处关闭） ---------------- */
  let _kcardEl = null;
  function ensureKCard() {
    if (_kcardEl) return _kcardEl;
    const ov = document.createElement('div');
    ov.id = 'kcard-overlay';
    ov.innerHTML =
      '<div class="kcard" id="kcard-box">' +
        '<div class="kcard-tag" id="kcard-tag"></div>' +
        '<div class="kcard-title" id="kcard-title"></div>' +
        '<div class="kcard-sub" id="kcard-sub"></div>' +
        '<div class="kcard-body" id="kcard-body"></div>' +
        '<div class="kcard-points" id="kcard-points"></div>' +
        '<div class="kcard-hint">点击空白处继续 ▾</div>' +
      '</div>';
    document.body.appendChild(ov);
    // 只在遮罩空白处点击时关闭；点击卡片本身不关闭，方便阅读
    ov.addEventListener('click', function (e) { if (e.target === ov) hideKCard(); });
    _kcardEl = ov;
    return ov;
  }
  function hideKCard() {
    if (!_kcardEl) return;
    _kcardEl.classList.remove('show');
    setTimeout(function () { if (_kcardEl) _kcardEl.style.display = 'none'; }, 260);
  }
  function showKnowledgeCard(o) {
    o = o || {};
    const ov = ensureKCard();
    const tag = ov.querySelector('#kcard-tag');
    tag.textContent = o.tag || ''; tag.style.display = o.tag ? 'inline-block' : 'none';
    ov.querySelector('#kcard-title').textContent = o.title || '';
    const sub = ov.querySelector('#kcard-sub');
    sub.textContent = o.subtitle || ''; sub.style.display = o.subtitle ? 'block' : 'none';
    const body = ov.querySelector('#kcard-body');
    body.innerHTML = o.body || ''; body.style.display = o.body ? 'block' : 'none';
    const pts = ov.querySelector('#kcard-points');
    if (o.points && o.points.length) {
      pts.innerHTML = o.points.map(function (p) { return '<div class="kcard-pt"><b>' + p.k + '</b>' + p.v + '</div>'; }).join('');
      pts.style.display = 'block';
    } else { pts.innerHTML = ''; pts.style.display = 'none'; }
    ov.style.display = 'flex';
    void ov.offsetWidth;           // 强制回流以触发进入动画
    ov.classList.add('show');
  }
  window.showKnowledgeCard = showKnowledgeCard;

  /* ============================================================
   *  模块一：闯关区 —— 木作工坊（答题掉件飞入收纳架）
   * ============================================================ */
  function sceneChallenge(container, ctx) {
    const state = ctx.state;
    const saveState = ctx.saveState;
    function invTotal() { return Object.values(state.inventory).reduce((a, b) => a + b, 0); }

    container.innerHTML = `
      <div id="loading">晋楹记 · 正在搭建闯关工坊…</div>
      <div class="hud" id="hud-left">闯关区 · 答题掉件</div>
      <div class="hud" id="hud-right">答对知识点，掉落专属榫卯构件</div>
      <div id="resbar">🪵 零件 <b id="r-parts">0</b> ｜ 🪵 木屑 <b id="r-chip">0</b> ｜ 🏛️ 已建 <b id="r-built">0</b></div>
      <div id="panel"></div>
      <div id="reward"></div>`;
    if (typeof THREE === 'undefined') { container.querySelector('#loading').textContent = '加载失败：未找到同目录下的 three.min.js'; return { dispose() {} }; }

    const W = () => container.clientWidth || window.innerWidth;
    const H = () => container.clientHeight || window.innerHeight;
    const COLOR_ZHU = 0x9B1A1A, COLOR_WOOD = 0xD2B48C, COLOR_WOOD2 = 0xC9A06A;
    let scene, camera, renderer, clock, dougong, shelf = [], flyPieces = [];
    let disposed = false, rafId = 0; const winL = [];
    const addWin = (t, f) => { window.addEventListener(t, f); winL.push([t, f]); };

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); }

    // 简化斗拱模型
    function makeDougong() {
      const g = new THREE.Group();
      const m = new THREE.MeshStandardMaterial({ color: COLOR_WOOD, roughness: .7 });
      const dou = new THREE.Mesh(new THREE.BoxGeometry(.7, .3, .7), m); g.add(dou);
      const g1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, .22, .34), m); g1.position.y = .26; g.add(g1);
      const g2 = new THREE.Mesh(new THREE.BoxGeometry(.34, .22, 1.5), m); g2.position.y = .26; g.add(g2);
      const d2 = new THREE.Mesh(new THREE.BoxGeometry(.5, .24, .5), m); d2.position.y = .49; g.add(d2);
      const g3 = new THREE.Mesh(new THREE.BoxGeometry(1.2, .2, .28), m); g3.position.y = .72; g.add(g3);
      g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      return g;
    }

    // 掉件：从面板前方飞向右侧收纳架
    function dropPiece(color) {
      const m = new THREE.MeshStandardMaterial({ color: color || 0xc0884a, roughness: .6, emissive: 0x2E8B57, emissiveIntensity: .4 });
      const cube = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), m);
      cube.castShadow = true; cube.position.set(0, 3.2, 3); scene.add(cube);
      const slot = shelf.length;
      const target = new THREE.Vector3(4.0 + (slot % 5) * 0.5, 0.5 + Math.floor(slot / 5) % 3 * 0.9, -1 + (slot % 5) * 0.05);
      flyPieces.push({ mesh: cube, from: cube.position.clone(), to: target, t: 0, dur: 0.9, spin: Math.random() * 6 });
      shelf.push(cube);
    }
    function updateFly(dt) {
      for (let i = flyPieces.length - 1; i >= 0; i--) {
        const f = flyPieces[i]; f.t += dt; const p = Math.min(f.t / f.dur, 1); const e = 1 - Math.pow(1 - p, 3);
        f.mesh.position.lerpVectors(f.from, f.to, e);
        f.mesh.position.y += Math.sin(p * Math.PI) * 1.2;
        f.mesh.rotation.y = f.spin * e; f.mesh.rotation.x = f.spin * .5 * e;
        if (p >= 1) { f.mesh.material.emissiveIntensity = 0; flyPieces.splice(i, 1); }
      }
    }

    function initScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x5a1f1a);
      scene.fog = new THREE.Fog(0x5a1f1a, 16, 42);
      camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100);
      camera.position.set(0, 2.6, 10); camera.lookAt(0, 1.4, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W(), H()); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      outColor(renderer);
      container.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xffe6c0, 0x3a1810, 0.85));
      const dir = new THREE.DirectionalLight(0xfff0d8, 1.0); dir.position.set(6, 10, 7); dir.castShadow = true;
      dir.shadow.mapSize.set(1024, 1024);
      dir.shadow.camera.left = -12; dir.shadow.camera.right = 12; dir.shadow.camera.top = 12; dir.shadow.camera.bottom = -12;
      scene.add(dir);
      const p = new THREE.PointLight(0xffb060, 0.6, 40); p.position.set(0, 6, 4); scene.add(p);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x8a5326, roughness: 1 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01; floor.receiveShadow = true; scene.add(floor);
      dougong = makeDougong(); dougong.position.set(0, 3.4, -3); dougong.scale.setScalar(1.4); scene.add(dougong);
      const rack = new THREE.Group(); const rmat = new THREE.MeshStandardMaterial({ color: COLOR_WOOD2, roughness: .85 });
      for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(3.4, .12, .7), rmat); b.position.set(0, i * 0.9, 0); b.castShadow = true; b.receiveShadow = true; rack.add(b); }
      [-1.6, 1.6].forEach(x => { const s = new THREE.Mesh(new THREE.BoxGeometry(.14, 2.0, .6), rmat); s.position.set(x, 0.9, 0); s.castShadow = true; rack.add(s); });
      rack.position.set(4.7, 0.2, -1); rack.rotation.y = -0.5; scene.add(rack);
      clock = new THREE.Clock();
      addWin('resize', onResize);
    }

    function animate() {
      if (disposed) return; rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      if (dougong) dougong.rotation.y += dt * 0.35;
      updateFly(dt);
      renderer.render(scene, camera);
    }

    /* ---- 答题逻辑（HTML 面板） ---- */
    const panel = container.querySelector('#panel');
    let curLevel = null, qIndex = 0, correctCount = 0, wrongCount = 0;

    function renderLevels() {
      curLevel = null;
      let h = `<h2>闯关区</h2><div class="sub">分层关卡：基础试炼 → 朝代专题 → 建筑Boss。答对即掉落该题精准绑定的榫卯构件。</div>`;
      h += `<div class="lv-list">`;
      LEVELS.forEach(L => {
        const done = state.clearedLevels[L.id];
        const groupTag = L.group === 'boss' ? 'Boss关' : (L.group === 'basic' ? '基础' : (L.group === 'tang' ? '唐构' : (L.group === 'liaojin' ? '辽金' : '晋商')));
        h += `<div class="lv-card ${done ? 'done' : ''}" onclick="startLevel('${L.id}')">
          <div class="n">${L.name}</div>
          <div class="s">${L.subtitle || ''}</div>
          <span class="badge">${done ? '✅ 已通关' : groupTag + ' · ' + L.questions.length + '题'}</span>
        </div>`;
      });
      h += `</div>`;
      panel.innerHTML = h;
    }
    window.renderLevels = renderLevels;

    window.startLevel = function (id) { curLevel = LEVELS.find(L => L.id === id); qIndex = 0; correctCount = 0; renderQuestion(); };

    function renderQuestion() {
      wrongCount = 0;
      const L = curLevel, q = L.questions[qIndex];
      let h = `<div class="q-prog">${L.name} ｜ 第 ${qIndex + 1}/${L.questions.length} 题</div>`;
      h += `<div class="q-text">${q.q}</div>`;
      q.options.forEach((op, i) => { h += `<button class="opt" data-i="${i}" onclick="answer(${i})">${op}</button>`; });
      h += `<div class="explain" id="explain"></div>`;
      const isLast = qIndex === L.questions.length - 1;
      const nextLabel = isLast ? '🏛️ 完成本关 · 去拼古建' : '下一题';
      h += `<div class="row"><button class="btn ghost" onclick="renderLevels()">返回关卡</button><button class="btn skip" id="skipBtn" style="display:none" onclick="skipQuestion()">跳过本题 ▶</button><button class="btn qing" id="nextBtn" style="display:none" onclick="nextQ()">${nextLabel}</button></div>`;
      panel.innerHTML = h;
    }

    window.answer = function (i) {
      const L = curLevel, q = L.questions[qIndex];
      const opts = [...panel.querySelectorAll('.opt')];
      opts.forEach(o => o.disabled = true);
      const ex = document.getElementById('explain');
      if (i === q.answer) {
        opts[i].classList.add('correct'); correctCount++;
        const pid = q.reward;
        state.inventory[pid] = (state.inventory[pid] || 0) + 1; saveState(); refreshRes();
        const col = (typeof PARTS !== 'undefined' && PARTS[pid]) ? PARTS[pid].color : '#c0884a';
        dropPiece(new THREE.Color(col).getHex());
        showReward('＋' + ((PARTS && PARTS[pid]) ? PARTS[pid].name : '榫卯件'));
        if (q.explain) { ex.textContent = '📖 ' + q.explain; ex.style.display = 'block'; }
        document.getElementById('nextBtn').style.display = 'inline-block';

        // 弹出「相关题目知识卡」——点空白处关闭后继续
        const pts = [];
        pts.push({ k: '获得榫卯：', v: ((PARTS && PARTS[q.reward]) ? PARTS[q.reward].name + '　' + (PARTS[q.reward].desc || '') : '榫卯件') });
        showKnowledgeCard({
          tag: '📖 ' + L.name,
          title: '答对了！',
          subtitle: q.q,
          body: '<b>正确答案：</b>' + q.options[q.answer] + (q.explain ? '<br><br>' + q.explain : ''),
          points: pts
        });
      } else {
        // 答错：累计错误次数，未达 3 次允许重试，达到 3 次自动显示「跳过本题」
        wrongCount++;
        opts[i].classList.add('wrong');
        if (wrongCount < 3) {
          // 重新启用其余选项供重试（被点错的选项保持禁用并标红）
          opts.forEach((o, idx) => { if (idx !== i) o.disabled = false; });
          ex.textContent = '📖 ' + (q.explain || '') + ' （答错，可再试一次 · 已错 ' + wrongCount + '/3）';
          ex.style.display = 'block';
        } else {
          // 连续答错 3 次：揭示正确答案并弹出「跳过本题」按钮，避免卡关
          opts[q.answer].classList.add('correct');
          if (q.explain) { ex.textContent = '📖 ' + q.explain + ' （已错 3 次，可点「跳过本题」继续）'; ex.style.display = 'block'; }
          else { ex.textContent = '正确答案：' + q.options[q.answer] + ' （已错 3 次，可点「跳过本题」继续）'; ex.style.display = 'block'; }
          const skipBtn = document.getElementById('skipBtn');
          if (skipBtn) skipBtn.style.display = 'inline-block';
          document.getElementById('nextBtn').style.display = 'inline-block';
        }
      }
    };

    window.nextQ = function () { if (qIndex < curLevel.questions.length - 1) { qIndex++; renderQuestion(); } else finishLevel(); };

    // 跳过本题：不掉落奖励榫卯，直接继续后续流程
    window.skipQuestion = function () {
      hideKCard();
      if (qIndex < curLevel.questions.length - 1) { qIndex++; renderQuestion(); } else finishLevel();
    };

    function finishLevel() {
      const L = curLevel;
      if (!state.clearedLevels[L.id]) state.clearedLevels[L.id] = true;
      if (L.unlockReward) state.inventory[L.unlockReward] = (state.inventory[L.unlockReward] || 0) + 2;
      saveState(); refreshRes();
      let h = `<h2>本关通关！</h2><div class="sub">${L.name}</div>`;
      h += `<div class="q-text">答对 ${correctCount} / ${L.questions.length} 题，掉落的榫卯件已飞入右侧收纳架，可到「古建区」拼装。</div>`;
      if (L.unlockText) h += `<div class="explain" style="display:block">🎁 ${L.unlockText}</div>`;
      h += `<div class="row"><button class="btn ghost" onclick="renderLevels()">返回关卡</button><button class="btn zhu" onclick="startLevel('${L.id}')">再答一次</button></div>`;
      h += `<button class="btn qing" style="display:block;width:100%;margin-top:6px;font-size:16px;padding:14px 22px" onclick="window.mount('build')">🏛️ 去拼古建 ▶</button>`;
      panel.innerHTML = h;
    }

    const rewardEl = container.querySelector('#reward');
    function showReward(text) {
      rewardEl.textContent = text; rewardEl.style.display = 'block'; rewardEl.style.opacity = '1';
      clearTimeout(showReward._t);
      let o = 1; const fade = () => { o -= 0.04; rewardEl.style.opacity = o; rewardEl.style.transform = `translate(-50%,${-50 - (1 - o) * 60}%)`;
        if (o > 0) requestAnimationFrame(fade); else rewardEl.style.display = 'none'; };
      showReward._t = setTimeout(fade, 500);
    }

    function refreshRes() {
      document.getElementById('r-parts').textContent = invTotal();
      document.getElementById('r-chip').textContent = state.woodchips || 0;
      document.getElementById('r-built').textContent = (state.built || []).length;
    }

    try { initScene(); refreshRes(); renderLevels(); container.querySelector('#loading').style.display = 'none'; animate(); }
    catch (err) { const l = container.querySelector('#loading'); if (l) l.textContent = '加载失败：' + err.message; console.error(err); }

    return {
      dispose() {
        disposed = true; cancelAnimationFrame(rafId);
        winL.forEach(([t, f]) => window.removeEventListener(t, f));
        delete window.startLevel; delete window.answer; delete window.nextQ; delete window.renderLevels;
        if (renderer) { renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
      }
    };
  }

  /* ============================================================
   *  模块二：古建区 —— 斗拱拖拽吸附拼装（关卡数据驱动）
   * ============================================================ */
  function sceneBuild(container, ctx) {
    container.innerHTML = `
      <div id="loading">晋楹记 · 正在搭建古建工坊…</div>
      <div class="hud" id="hud-left">古建区</div>
      <div class="hud" id="hud-right">拖专属榫卯 → 中心发光点位 → 自动组装</div>
      <div class="hud" id="hud-prog">第 1 / 7 关</div>
      <div id="desc"><b>拼装说明：</b>把专属榫卯拖到场景中心的发光咬合点位，松手即触发榫卯咬合，整栋建筑由中心向外逐层自动组装成型。</div>
      <div id="hint"></div>
      <div id="next-wrap"><button id="next-btn">下一关</button></div>
      <button id="reset-btn">重玩本关</button>
      <button id="skip-build-btn" class="btn skip" style="display:none">跳过本关拼装 ▶</button>
      <div id="lock-msg" style="display:none"><div class="lock-box"><div class="lock-t">🔒 <span id="lock-txt"></span></div><button id="lock-go" class="btn zhu" onclick="mount('challenge')">去闯关区答题解锁</button></div></div>`;
    if (typeof THREE === 'undefined') { container.querySelector('#loading').textContent = '加载失败：未找到同目录下的 three.min.js'; return { dispose() {} }; }

    const state = ctx.state;        // 共享存档（关卡解锁判定 + 记录已拼建筑）
    const saveState = ctx.saveState;
    let locked = false;             // 当前关卡是否因未通关对应闯关关而锁定
    const W = () => container.clientWidth || window.innerWidth;
    const H = () => container.clientHeight || window.innerHeight;

    /* ---- 关卡数据（数据驱动核心） ----
       每关字段：
         name          关卡名（左上角显示）
         building      建筑名
         description   拼装说明文字
         tip           右上角操作提示
         columnColor   柱子/岩壁颜色
         rock          是否岩壁（true 用不规则长方体代替圆柱）
         tenon         拖动构件类型：'dougong' 斗拱 | 'dovetail' 燕尾榫梁枋 | 'straight' 长直榫横梁
         sequential    是否按顺序解锁（多构件关卡用）
         targets       各构件吸附目标数组 {x,y,z,rx,ry,rz}
         tolerance     吸附容忍度（默认 0.15）
         nextButtonText 下一关按钮文字 */
    const levels = [
      { name: '晋祠圣母殿', building: '晋祠圣母殿', unlock: 'basic', bid: 'jinci', part: 'muzhu',
        tenon: 'dougong', columnColor: 0xC9A06A, foot: 4.4, tiers: 1, temple: true, roofColor: 0x9B1A1A,
        description: '把专属榫卯「基础木柱」拖到中心的发光咬合点位，触发咬合，圣母殿由中心向外逐层拔地而起。',
        tip: '拖拽榫卯到中心发光点位', nextButtonText: '前往佛光寺' },
      { name: '佛光寺东大殿', building: '佛光寺', unlock: 'boss_foguang', bid: 'foguang', part: 'core_foguang',
        tenon: 'dovetail', columnColor: 0x5C3317, foot: 5.0, tiers: 1, temple: true, roofColor: 0x8B1A1A,
        description: '将「佛光寺东大殿核心主件」嵌入中心点位，七间庑殿大殿随之由中心向外层层展开。',
        tip: '拖拽核心主件到中心点位', nextButtonText: '前往应县木塔' },
      { name: '应县木塔', building: '应县木塔', unlock: 'boss_muta', bid: 'muta', part: 'core_muta',
        tenon: 'dougong', columnColor: 0x8B1A1A, foot: 3.6, tiers: 3, roofColor: 0x7a2d24,
        description: '把「应县木塔核心主件」放进中心点位，五层木塔由塔心向外一圈圈组装成形。',
        tip: '拖拽核心主件到中心点位', nextButtonText: '前往悬空寺' },
      { name: '浑源悬空寺', building: '悬空寺', unlock: 'boss_xuankong', bid: 'xuankong', part: 'core_xuankong',
        tenon: 'straight', columnColor: 0x696969, foot: 4.0, tiers: 2, rock: true, roofColor: 0x6b4a2a,
        description: '将「悬空寺核心主件」卡入中心点位，悬臂楼阁贴着岩壁由内向外拼出。',
        tip: '拖拽核心主件到中心点位', nextButtonText: '前往平遥' },
      { name: '平遥民居院落', building: '平遥民居院落', unlock: 'jinshang', bid: 'pingyao', part: 'geshan',
        tenon: 'dovetail', columnColor: 0x5C3317, foot: 4.8, tiers: 1, roofColor: 0x9B1A1A,
        description: '把「格扇榫」嵌入中心点位，明清院落由中轴向外展开厢房与屋面。',
        tip: '拖拽格扇榫到中心点位', nextButtonText: '前往乔家大院' },
      { name: '乔家大院', building: '乔家大院', unlock: 'boss_qiao', bid: 'qiao', part: 'core_qiao',
        tenon: 'dougong', columnColor: 0xBFA748, foot: 4.6, tiers: 2, roofColor: 0x8a2b22,
        description: '将「乔家大院核心主件」落入中心点位，「双喜」院落由中心轴线向两翼铺开。',
        tip: '拖拽核心主件到中心点位', nextButtonText: '前往南禅寺' },
      { name: '南禅寺', building: '南禅寺', unlock: 'boss_nanchai', bid: 'nanchai', part: 'core_nanchai',
        tenon: 'straight', columnColor: 0x868068, foot: 3.8, tiers: 1, temple: true, roofColor: 0x9B1A1A,
        description: '把「南禅寺大殿核心主件」嵌进中心点位，最古老的木构由中心向外静静落成。',
        tip: '拖拽核心主件到中心点位', nextButtonText: '恭喜通关' }
    ];
    const COLOR_ZHU = 0x9B1A1A, COLOR_QING = 0x2E8B57, COLOR_WOOD = 0xD2B48C, COLOR_GROUND = 0xC9A876;
    const CAP_HALF = 0.15, COL_HALF = 1.10, TENON_OFF = 0.45;
    const ROT_TOL = THREE.MathUtils.degToRad(10);

    let scene, camera, renderer, clock, ground;
    let building = null;        // 本关整栋古建（多层，逐层组装）
    let piece = null;           // 本关可拖拽的“专属榫卯”
    let snapMarker = null;      // 中心咬合点位标记（发光圆环 + 光柱）
    let dragPiece = null;       // 正在拖拽的构件
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    let dragging = false;
    const SNAP_Y = 2.4;         // 中心咬合点位高度
    const SNAP_TOL = 2.0;       // 中心落点容差（放宽，易命中）
    let camCenter = { x: 0, y: 1.4, z: 0 };
    let current = 0;
    let failCount = 0;        // 拼装失败（未咬合）次数，达阈值显示「跳过」
    let tween = null, rotate = null, assembly = null;
    let disposed = false, rafId = 0; const winL = [];
    const addWin = (t, f) => { window.addEventListener(t, f); winL.push([t, f]); };

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); }

    function initScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(COLOR_WOOD);
      scene.fog = new THREE.Fog(COLOR_WOOD, 16, 36);
      camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W(), H()); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      outColor(renderer);
      container.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xfff2dc, 0x6b4a2a, 0.75));
      const dir = new THREE.DirectionalLight(0xffffff, 0.95); dir.position.set(5, 9, 6); dir.castShadow = true;
      dir.shadow.mapSize.set(1024, 1024);
      dir.shadow.camera.left = -8; dir.shadow.camera.right = 8; dir.shadow.camera.top = 8; dir.shadow.camera.bottom = -8;
      dir.shadow.camera.near = 1; dir.shadow.camera.far = 30; scene.add(dir);
      ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: COLOR_GROUND, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      clock = new THREE.Clock();
      addWin('resize', onResize);
    }

    /* ---- 程序化生成整栋古建（多层，初始全隐藏，供“由中心向外逐层”组装） ----
       层级顺序（即从中心到外围、由下到上）：台基 → 中心柱 → 周圈柱列 → 斗拱 → 梁枋 → (逐层向上) → 屋顶 → 脊饰 → (岩壁)
       每关由 foot(占地)/tiers(层数)/temple(脊饰)/rock(岩壁)/columnColor/roofColor 参数化。 */
    function buildFull(L) {
      const root = new THREE.Group();
      const wood = new THREE.MeshStandardMaterial({ color: L.columnColor, roughness: 0.8 });
      const roofMat = new THREE.MeshStandardMaterial({ color: L.roofColor || COLOR_ZHU, roughness: 0.7 });
      const stone = new THREE.MeshStandardMaterial({ color: 0xc9b48a, roughness: 1 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xd4a017, metalness: 0.3, roughness: 0.4 });
      const layers = [];
      const addLayer = (g) => { g.visible = false; g.scale.setScalar(0.02); root.add(g); layers.push(g); return g; };
      const foot = L.foot || 4.4;
      const tiers = L.tiers || 1;
      const storyH = 1.9;
      const baseTop = 0.7;

      // L0 台基（中心）
      const base = new THREE.Group();
      const plat = new THREE.Mesh(new THREE.BoxGeometry(foot, 0.4, foot), stone); plat.position.y = 0.2; base.add(plat);
      const plat2 = new THREE.Mesh(new THREE.BoxGeometry(foot * 0.72, 0.3, foot * 0.72), stone); plat2.position.y = 0.55; base.add(plat2);
      addLayer(base);

      // L1 中心柱（贯穿各层，顶到咬合点位下方以接榫卯）
      const core = new THREE.Group();
      const chTop = SNAP_Y - 0.45, chH = chTop - baseTop;
      const ccol = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, chH, 24), wood); ccol.position.y = baseTop + chH / 2; core.add(ccol);
      const ccap = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 1.0), wood); ccap.position.y = chTop + 0.15; core.add(ccap);
      addLayer(core);

      // L2.. 周圈柱列 + 斗拱 + 梁枋（按 tiers 逐层向外/向上）
      for (let t = 0; t < tiers; t++) {
        const y0 = baseTop + t * storyH;
        const ring = new THREE.Group();
        const R = foot / 2 - 0.6;
        const corners = [[-R, -R], [R, -R], [-R, R], [R, R]];
        corners.forEach(p => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, storyH * 0.92, 18), wood); c.position.set(p[0], y0 + storyH * 0.46, p[1]); ring.add(c); });
        addLayer(ring);
        const bracket = new THREE.Group();
        const mkB = (x, z, s) => {
          const b = new THREE.Group();
          const a = new THREE.Mesh(new THREE.BoxGeometry(1.0 * s, 0.2, 0.28 * s), wood); b.add(a);
          const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.28 * s, 0.2, 1.0 * s), wood); b.add(c2);
          const tp = new THREE.Mesh(new THREE.BoxGeometry(0.46 * s, 0.18, 0.46 * s), wood); tp.position.y = 0.2; b.add(tp);
          b.position.set(x, y0 + storyH, z); return b;
        };
        bracket.add(mkB(0, 0, 1.15)); corners.forEach(p => bracket.add(mkB(p[0], p[1], 0.95)));
        addLayer(bracket);
        const beams = new THREE.Group();
        const by = y0 + storyH + 0.15;
        const bx = new THREE.Mesh(new THREE.BoxGeometry(foot - 0.4, 0.26, 0.32), wood); bx.position.y = by; beams.add(bx);
        const bz = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.26, foot - 0.4), wood); bz.position.y = by; beams.add(bz);
        addLayer(beams);
      }

      // 屋顶（顶层，庑殿/歇山意象：四坡锥 + 檐口）
      const roof = new THREE.Group();
      const topY = baseTop + tiers * storyH + 0.15;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(foot * 0.8, 1.5, 4), roofMat); cone.position.y = topY + 0.75; cone.rotation.y = Math.PI / 4; roof.add(cone);
      const eave = new THREE.Mesh(new THREE.BoxGeometry(foot * 1.06, 0.12, foot * 1.06), roofMat); eave.position.y = topY; roof.add(eave);
      addLayer(roof);

      // 脊饰（殿阁/塔加宝顶）
      if (L.temple || tiers > 1) {
        const orn = new THREE.Group();
        const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.7, 12), gold); sp.position.y = topY + 1.6; orn.add(sp);
        addLayer(orn);
      }

      // 悬空寺：岩壁依附一侧
      if (L.rock) {
        const cliff = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: L.columnColor, roughness: 0.98 });
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.4, 1.6), mat); b1.position.set(-foot / 2 - 0.4, 2.0, 0); cliff.add(b1);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.2, 1.2), mat); b2.position.set(-foot / 2 - 0.1, 3.6, 0.2); cliff.add(b2);
        addLayer(cliff);
      }

      root.userData.layers = layers;
      root.userData.topY = topY + 1.9;
      root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      return root;
    }

    /* ---- 中心咬合点位标记：发光圆环 + 竖直光柱，呼吸闪烁 ---- */
    function createSnapMarker() {
      const g = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({ color: COLOR_QING, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.07, 12, 36), ringMat); ring.rotation.x = Math.PI / 2; ring.position.y = SNAP_Y; g.add(ring);
      const beamMat = new THREE.MeshBasicMaterial({ color: COLOR_QING, transparent: true, opacity: 0.16 });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, SNAP_Y, 16, 1, true), beamMat); beam.position.y = SNAP_Y / 2; g.add(beam);
      scene.add(g);
      return { group: g, ring, beam };
    }

    /* ---- 创建可拖拽的“专属榫卯”（按 tenon 造型，染成本关核心件颜色） ---- */
    function createPiece(type, colorHex) {
      const g = new THREE.Group();
      const M = new THREE.MeshStandardMaterial({ color: colorHex != null ? colorHex : COLOR_WOOD, roughness: 0.72, metalness: 0.05, emissive: 0x000000 });
      if (type === 'dougong') {
        const dou = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.30, 0.70), M); g.add(dou);
        const gong1 = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.22, 0.34), M); gong1.position.y = 0.26; g.add(gong1);
        const gong2 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 1.50), M); gong2.position.y = 0.26; g.add(gong2);
        const dou2 = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.24, 0.50), M); dou2.position.y = 0.49; g.add(dou2);
        const gong3 = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.20, 0.28), M); gong3.position.y = 0.72; g.add(gong3);
        const tenon = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.30, 0.26), M); tenon.position.y = -0.30; g.add(tenon);
      } else if (type === 'dovetail') {
        // 梁枋 + 燕尾榫（上宽下窄）
        const beam = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.34, 0.5), M); beam.position.y = 0.18; g.add(beam);
        const shape = new THREE.Shape();
        shape.moveTo(-0.17, 0.225); shape.lineTo(0.17, 0.225); shape.lineTo(0.09, -0.225); shape.lineTo(-0.09, -0.225); shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.26, bevelEnabled: false });
        geo.translate(0, 0, -0.13);
        const tenon = new THREE.Mesh(geo, M); tenon.position.y = -0.225; g.add(tenon); // 顶面 y=0，底面 y=-0.45
      } else { // straight 长直榫横梁
        const beam = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.30, 0.4), M); beam.position.y = 0.16; g.add(beam);
        const tenon = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.45, 0.20), M); tenon.position.y = -0.225; g.add(tenon); // 底面 y=-0.45
      }
      g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      g.userData.mat = M;
      return g;
    }

    function setPointer(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    function onPointerDown(e) {
      if (locked || !piece || piece.solved) return;
      setPointer(e); raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(piece.group, true);
      if (hit.length > 0) { dragging = true; dragPiece = piece; renderer.domElement.style.cursor = 'grabbing'; AudioSys.resume(); }
    }
    function onPointerMove(e) {
      if (!dragging || !dragPiece) return; setPointer(e); raycaster.setFromCamera(pointer, camera);
      const pt = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane, pt)) {
        // 磁吸：接近中心时轻轻吸向中心，降低拼合难度、手感更顺
        const d = Math.hypot(pt.x, pt.z);
        if (d < SNAP_TOL * 1.6) { const k = 0.4; pt.x += (0 - pt.x) * k; pt.z += (0 - pt.z) * k; }
        dragPiece.group.position.x = pt.x; dragPiece.group.position.z = pt.z; dragPiece.group.position.y = SNAP_Y;
      }
    }
    function onPointerUp() {
      if (!dragging || !dragPiece) return; dragging = false; renderer.domElement.style.cursor = 'default'; const p = dragPiece; dragPiece = null; evaluateSnap(p);
    }
    function onWheel(e) { if (!piece || piece.solved) return; piece.group.rotation.y += (e.deltaY > 0 ? -0.09 : 0.09); }

    function normAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
    function evaluateSnap(p) {
      const dist = Math.hypot(p.group.position.x, p.group.position.z);
      // 落点位置为主判定（拖到中心发光点位即咬合）；旋转仅作宽松校验，
      // 因为咬合动画会把榫卯旋转归零飞向中心，无需用户精确摆正。
      const ry = Math.abs(normAngle(p.group.rotation.y));
      if (dist < SNAP_TOL && ry < Math.PI / 2) snapSuccess(p); else snapFail(p);
    }

    function updateTween(dt) {
      if (!tween) return; tween.t += dt; const pp = Math.min(tween.t / tween.dur, 1); const e = 1 - Math.pow(1 - pp, 3);
      tween.group.position.lerpVectors(tween.fromPos, tween.toPos, e);
      tween.group.rotation.y = tween.fromRot + (tween.toRot - tween.fromRot) * e;
      if (pp >= 1) { const cb = tween.onDone; tween = null; if (cb) cb(); }
    }
    function startTween(grp, fp, tp, fr, tr, dur, onDone) { tween = { group: grp, fromPos: fp, toPos: tp, fromRot: fr, toRot: tr, t: 0, dur, onDone }; }
    function snapSuccess(p) {
      p.solved = true; AudioSys.playClick(); failCount = 0;
      const sb = container.querySelector('#skip-build-btn'); if (sb) sb.style.display = 'none';
      p.mat.emissive.setHex(COLOR_QING); p.mat.emissiveIntensity = 0.6;
      if (snapMarker) { snapMarker.ring.material.color.setHex(COLOR_QING); snapMarker.ring.scale.setScalar(1.7); }
      startTween(p.group, p.group.position.clone(), new THREE.Vector3(0, SNAP_Y, 0), p.group.rotation.y, 0, 0.4, () => { startAssembly(); });
    }
    function snapFail(p) {
      p.mat.emissive.setHex(COLOR_ZHU); p.mat.emissiveIntensity = 0.6; showHint('bad', '再往中心发光圆环拖一点就好～');
      setTimeout(() => { if (!p.solved) { p.mat.emissive.setHex(0x000000); p.mat.emissiveIntensity = 0; } }, 380);
      startTween(p.group, p.group.position.clone(), p.startPos.clone(), p.group.rotation.y, p.startRot.y, 0.40, null);
      failCount++;
      if (failCount >= 3) {
        const sb = container.querySelector('#skip-build-btn'); if (sb) sb.style.display = 'inline-block';
        showHint('bad', '已失败 3 次，可点「跳过本关拼装」直接继续');
      }
    }
    function startCameraRotate() {
      const cx = camera.position.x - camCenter.x, cz = camera.position.z - camCenter.z, r = Math.hypot(cx, cz);
      rotate = { active: true, t: 0, dur: 6.0, r, h: camera.position.y, cx: camCenter.x, cz: camCenter.z, startAng: Math.atan2(cz, cx) };
    }
    function updateRotate(dt) {
      if (!rotate || !rotate.active) return; rotate.t += dt; const pp = Math.min(rotate.t / rotate.dur, 1);
      const ang = rotate.startAng + pp * Math.PI * 2;
      camera.position.set(rotate.cx + rotate.r * Math.cos(ang), rotate.h, rotate.cz + rotate.r * Math.sin(ang));
      camera.lookAt(camCenter.x, camCenter.y, camCenter.z);
      if (pp >= 1) { rotate.active = false; showNextButton(); }
    }

    /* ---- 整栋建筑“由中心向外逐层”自动组装 ---- */
    function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
    function startAssembly() {
      if (!building) return;
      assembly = { i: 0, t: 0, gap: 0.22 };
      if (snapMarker) snapMarker.group.visible = false;
    }
    function updateAssembly(dt) {
      if (!assembly || !building) return;
      assembly.t += dt;
      if (assembly.t >= assembly.gap && assembly.i < building.userData.layers.length) {
        const ly = building.userData.layers[assembly.i];
        ly.visible = true; ly.userData.g = 0; assembly.i++; assembly.t = 0;
        AudioSys.playClick();
      }
      let allDone = true;
      building.userData.layers.forEach(ly => {
        if (!ly.visible) return;
        if (ly.userData.g == null) ly.userData.g = 0;
        if (ly.userData.g < 1) { ly.userData.g = Math.min(1, ly.userData.g + dt / 0.5); ly.scale.setScalar(0.02 + 0.98 * easeOut(ly.userData.g)); allDone = false; }
      });
      if (assembly.i >= building.userData.layers.length && allDone) { assembly = null; onAssembled(); }
    }
    function onAssembled() {
      startCameraRotate();
      showNextButton();
      // 弹出「这座古建的知识卡」——点空白处关闭后继续
      const L = levels[current];
      const B = (typeof BUILDINGS !== 'undefined') ? BUILDINGS.find(function (b) { return b.id === L.bid; }) : null;
      if (B) {
        const pts = (B.layers || []).filter(function (ly) { return ly.popup; }).slice(0, 4)
          .map(function (ly) { return { k: ly.popup.title + '：', v: ly.popup.text }; });
        const sub = [B.city, (B.region ? B.region + '地区' : ''), (B.stars ? '★'.repeat(B.stars) : '')].filter(Boolean).join(' · ');
        showKnowledgeCard({
          tag: '🏛️ 古建知识卡',
          title: B.name,
          subtitle: sub,
          body: B.doc || B.desc || '',
          points: pts
        });
      } else {
        showKnowledgeCard({ tag: '🏛️ 古建知识卡', title: L.building, body: '恭喜！' + L.building + ' 组装完成。' });
      }
    }

    const hintEl = container.querySelector('#hint');
    function showHint(kind, text) { hintEl.textContent = text; hintEl.className = kind; clearTimeout(showHint._t); showHint._t = setTimeout(() => { hintEl.className = ''; }, 1600); }
    const nextWrap = container.querySelector('#next-wrap');
    const nextBtn = container.querySelector('#next-btn');
    // 拼好一座古建后写入存档（藏品馆 / 我的 会读取 state.built 展示）
    function recordBuilt(L) {
      if (!L.bid) return;
      const arr = state.built || (state.built = []);
      if (!arr.some(b => (b.id || b) === L.bid)) {
        arr.push({ id: L.bid, name: L.building, building: L.building });
        if (typeof saveState === 'function') saveState();
      }
    }
    function showNextButton() { recordBuilt(levels[current]); nextWrap.style.display = 'block'; }

    // 跳过本关拼装：隐藏榫卯与咬合点位，直接触发整栋建筑自动组装成型，避免卡关
    function skipBuild() {
      const sb = container.querySelector('#skip-build-btn'); if (sb) sb.style.display = 'none';
      failCount = 0;
      if (piece) piece.solved = true; // 防止跳过后被误拖拽
      if (building) {
        if (snapMarker) snapMarker.group.visible = false;
        if (piece && piece.group) piece.group.visible = false;
        startAssembly();
      } else {
        recordBuilt(levels[current]); showNextButton();
      }
    }

    nextBtn.addEventListener('click', () => { nextWrap.style.display = 'none'; loadLevel((current + 1) % levels.length); });
    container.querySelector('#reset-btn').addEventListener('click', () => loadLevel(current));
    container.querySelector('#skip-build-btn').addEventListener('click', skipBuild);

    function loadLevel(i) {
      current = i; const L = levels[i];
      // 1. 清除上一关动态物体
      if (building) { scene.remove(building); disposeGroup(building); building = null; }
      if (piece) { scene.remove(piece.group); disposeGroup(piece.group); piece = null; }
      if (snapMarker) { scene.remove(snapMarker.group); snapMarker = null; }
      tween = null; rotate = null; assembly = null; dragging = false; dragPiece = null;
      nextWrap.style.display = 'none'; hintEl.className = '';
      failCount = 0; const sbLoad = container.querySelector('#skip-build-btn'); if (sbLoad) sbLoad.style.display = 'none';

      // 2. 程序化生成整栋古建（多层，初始全隐藏）
      building = buildFull(L); scene.add(building);

      // 3. 专属榫卯（按本关 tenon 造型 + 核心件颜色）
      const partId = L.part;
      const partInfo = (typeof PARTS !== 'undefined' && PARTS[partId]) ? PARTS[partId] : null;
      const partColor = partInfo ? parseInt(partInfo.color.slice(1), 16) : COLOR_WOOD;
      const g = createPiece(L.tenon, partColor);
      const foot = L.foot || 4.4;
      const start = new THREE.Vector3(2.6, SNAP_Y, 1.6);
      g.position.copy(start); g.rotation.y = 0.25;
      scene.add(g);
      piece = { group: g, mat: g.userData.mat, solved: false, startPos: start.clone(), startRot: new THREE.Euler(0, 0.4, 0) };

      // 4. 中心咬合点位标记（发光圆环 + 光柱）
      snapMarker = createSnapMarker();

      // 5. 关卡解锁判定：需在闯关区完成对应关卡后才能拼装
      locked = !!(L.unlock && !state.clearedLevels[L.unlock]);
      if (locked) {
        piece.group.visible = false; if (snapMarker) snapMarker.group.visible = false;
        const reqL = (typeof LEVELS !== 'undefined') ? LEVELS.find(x => x.id === L.unlock) : null;
        container.querySelector('#lock-txt').textContent = '需在闯关区完成「' + (reqL ? reqL.name : L.unlock) + '」后解锁';
        container.querySelector('#lock-msg').style.display = 'flex';
      } else {
        container.querySelector('#lock-msg').style.display = 'none';
      }

      // 6. 拖拽平面（固定中心高度）
      dragPlane.constant = -SNAP_Y;

      // 7. HUD / 相机
      const owned = partInfo ? (state.inventory[partId] || 0) : 0;
      const partName = partInfo ? partInfo.name : '榫卯';
      const topY = building.userData.topY || (SNAP_Y + 2);
      const dist = topY * 0.95 + 4.5;
      camCenter = { x: 0, y: topY * 0.45, z: 0 };
      camera.position.set(foot * 0.35 + dist * 0.5, topY * 0.58 + 2.2, dist);
      camera.lookAt(camCenter.x, camCenter.y, camCenter.z);
      container.querySelector('#hud-left').textContent = L.name;
      container.querySelector('#hud-right').textContent = '拖专属榫卯 → 中心发光点位 → 自动组装';
      container.querySelector('#hud-prog').textContent = `第 ${i + 1} / ${levels.length} 关`;
      container.querySelector('#desc').innerHTML = `<b>拼装说明：</b>把专属榫卯「${partName}」<b>拖到场景中心的发光咬合点位</b>，松手即触发榫卯咬合，整栋建筑由中心向外逐层自动组装成型。${owned ? `（你已拥有 ${owned} 个）` : ''}`;
      nextBtn.textContent = L.nextButtonText;
    }
    function disposeGroup(g) { g.traverse(o => { if (o.isMesh) { o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); } }); }

    function animate() {
      if (disposed) return; rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05); updateTween(dt); updateAssembly(dt); updateRotate(dt);
      if (snapMarker && snapMarker.group.visible) {
        const ph = Math.sin(performance.now() * 0.004) * 0.5 + 0.5;
        snapMarker.ring.scale.setScalar(1 + 0.14 * ph);
        snapMarker.ring.material.opacity = 0.45 + 0.4 * ph;
      }
      renderer.render(scene, camera);
    }

    const el = () => renderer.domElement;
    function bindInteraction() {
      el().addEventListener('pointerdown', onPointerDown);
      el().addEventListener('pointermove', onPointerMove);
      addWin('pointerup', onPointerUp);
      el().addEventListener('wheel', onWheel, { passive: true });
    }

    try { initScene(); bindInteraction(); loadLevel(0); container.querySelector('#loading').style.display = 'none'; animate(); }
    catch (err) { const l = container.querySelector('#loading'); if (l) l.textContent = '加载失败：' + err.message; console.error(err); }

    return {
      dispose() {
        disposed = true; cancelAnimationFrame(rafId);
        winL.forEach(([t, f]) => window.removeEventListener(t, f));
        if (renderer) { renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
      }
    };
  }
  /* ============================================================
   *  模块三：藏品馆 —— 3D 展厅（可环绕旋转的已复刻古建）
   * ============================================================ */
  function sceneMuseum(container, ctx) {
    const state = ctx.state;
    const builtIds = new Set((state.built || []).map(b => b.id || b));
    container.innerHTML = `
      <div id="loading">晋楹记 · 正在布置藏品展厅…</div>
      <div class="hud" id="hud-left">藏品馆 · 古建陈列</div>
      <div class="hud" id="hud-right">拖拽环绕 · 滚轮缩放 · 点击展台看详情</div>
      <div id="tip">已复刻的古建立于展台，灰影为尚未收录</div>
      <div id="card"><span class="close" onclick="document.getElementById('card').style.display='none'">✕</span>
        <h3 id="c-name"></h3><div class="city" id="c-city"></div><div class="doc" id="c-doc"></div></div>`;
    if (typeof THREE === 'undefined') { container.querySelector('#loading').textContent = '加载失败：未找到同目录下的 three.min.js'; return { dispose() {} }; }

    const W = () => container.clientWidth || window.innerWidth, H = () => container.clientHeight || window.innerHeight;
    const COLOR_WOOD = 0xC9A06A, COLOR_ROOF = 0x7a2d24, COLOR_STONE = 0xa89878;
    let scene, camera, renderer, clock, pedestals = [];
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let camA = 0.5, camB = 0.35, camR = 14, camTargetY = 1.4;
    let dragging = false, lastX = 0, lastY = 0, moved = 0;
    let disposed = false, rafId = 0; const winL = [];
    const addWin = (t, f) => { window.addEventListener(t, f); winL.push([t, f]); };

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); }

    function buildModel(B, unlocked) {
      const g = new THREE.Group();
      const woodMat = unlocked ? new THREE.MeshStandardMaterial({ color: COLOR_WOOD, roughness: .5, metalness: .05, emissive: 0x5a3010, emissiveIntensity: .42 }) : new THREE.MeshStandardMaterial({ color: 0x6b6258, roughness: 1, transparent: true, opacity: .4 });
      const roofMat = unlocked ? new THREE.MeshStandardMaterial({ color: COLOR_ROOF, roughness: .5, emissive: COLOR_ROOF, emissiveIntensity: .28 }) : new THREE.MeshStandardMaterial({ color: 0x554e46, roughness: 1, transparent: true, opacity: .4 });
      function pillarHall(floors, w) { w = w || 2.2; for (let f = 0; f < floors; f++) { const y = f * 1.15; const body = new THREE.Mesh(new THREE.BoxGeometry(w, .8, w * 0.7), woodMat); body.position.y = y + 0.4; g.add(body); const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.95, .55, 4), roofMat); roof.rotation.y = Math.PI / 4; roof.position.y = y + 0.95; g.add(roof); w *= 0.82; } }
      if (B.id === 'muta') pillarHall(5, 2.6);
      else if (B.id === 'qiao' || B.id === 'pingyao') { for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, .7, 1.0), woodMat); body.position.set(-0.7 + c * 1.4, 0.35, -0.7 + r * 1.4); g.add(body); const roof = new THREE.Mesh(new THREE.ConeGeometry(0.95, .45, 4), roofMat); roof.rotation.y = Math.PI / 4; roof.position.set(-0.7 + c * 1.4, 0.85, -0.7 + r * 1.4); g.add(roof); } }
      else if (B.id === 'shuangta') { [-0.8, 0.8].forEach(x => { for (let f = 0; f < 4; f++) { let w = 1.0 * Math.pow(.85, f); const b = new THREE.Mesh(new THREE.BoxGeometry(w, .5, w), woodMat); b.position.set(x, f * .55 + .25, 0); g.add(b); } }); }
      else if (B.id === 'xuankong') { for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, .6, 1.0), woodMat); b.position.set(i * 0.5 - 0.5, i * 0.7 + 0.3, 0); g.add(b); const roof = new THREE.Mesh(new THREE.ConeGeometry(1.0, .4, 4), roofMat); roof.rotation.y = Math.PI / 4; roof.position.set(i * 0.5 - 0.5, i * 0.7 + 0.75, 0); g.add(roof); } }
      else pillarHall(1, 2.6);
      g.traverse(o => { if (o.isMesh) { o.castShadow = unlocked; o.receiveShadow = true; } });
      if (unlocked) {
        const halo = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.09, 12, 36), new THREE.MeshBasicMaterial({ color: 0xE8B04B, transparent: true, opacity: .9 }));
        halo.rotation.x = Math.PI / 2; halo.position.y = 0.05; g.add(halo);
      }
      return g;
    }

    function updateCamera() {
      camB = Math.max(0.08, Math.min(1.2, camB));
      camera.position.set(Math.cos(camA) * Math.cos(camB) * camR, Math.sin(camB) * camR + 1.0, Math.sin(camA) * Math.cos(camB) * camR);
      camera.lookAt(0, camTargetY, 0);
    }

    function initScene() {
      scene = new THREE.Scene(); scene.background = new THREE.Color(0x3a1512); scene.fog = new THREE.Fog(0x3a1512, 20, 55);
      camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 200);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W(), H()); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; outColor(renderer);
      container.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xffe6c0, 0x2a1008, 0.8));
      const dir = new THREE.DirectionalLight(0xfff0d8, 1.0); dir.position.set(8, 14, 8); dir.castShadow = true;
      dir.shadow.mapSize.set(2048, 2048); dir.shadow.camera.left = -20; dir.shadow.camera.right = 20; dir.shadow.camera.top = 20; dir.shadow.camera.bottom = -20; dir.shadow.camera.far = 60; scene.add(dir);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x5a3320, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
      const carpet = new THREE.Mesh(new THREE.PlaneGeometry(6, 70), new THREE.MeshStandardMaterial({ color: 0x8f2019, roughness: .9 })); carpet.rotation.x = -Math.PI / 2; carpet.position.y = 0.01; carpet.receiveShadow = true; scene.add(carpet);
      const list = (typeof BUILDINGS !== 'undefined') ? BUILDINGS : [];
      const n = list.length, spacing = 6.5, startZ = -(n - 1) * spacing / 2;
      list.forEach((B, i) => {
        const unlocked = builtIds.has(B.id);
        const z = startZ + i * spacing; const ped = new THREE.Group(); ped.position.set(0, 0, z);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.7, 24), unlocked ? new THREE.MeshStandardMaterial({ color: COLOR_STONE, roughness: .8, emissive: 0x3a2417, emissiveIntensity: .3 }) : new THREE.MeshStandardMaterial({ color: COLOR_STONE, roughness: .95 }));
        base.position.y = 0.35; base.castShadow = true; base.receiveShadow = true; ped.add(base);
        const model = buildModel(B, unlocked); model.position.y = 0.7; model.scale.setScalar(0.9); ped.add(model); scene.add(ped);
        pedestals.push({ group: ped, model, building: B, unlocked, baseY: 0.7 });
      });
      camR = Math.max(14, n * 1.6); clock = new THREE.Clock(); updateCamera(); bindControls(); addWin('resize', onResize);
    }

    function bindControls() {
      const dom = renderer.domElement;
      dom.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; moved = 0; });
      addWin('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy); camA -= dx * 0.005; camB += dy * 0.005; updateCamera(); });
      addWin('pointerup', e => { if (dragging && moved < 6) pick(e); dragging = false; });
      dom.addEventListener('wheel', e => { camR += e.deltaY * 0.012; camR = Math.max(7, Math.min(40, camR)); updateCamera(); }, { passive: true });
    }
    function pick(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      for (const P of pedestals) { if (raycaster.intersectObject(P.group, true).length) { showCard(P.building, P.unlocked); return; } }
    }
    function showCard(B, unlocked) {
      document.getElementById('c-name').textContent = B.name + (unlocked ? '' : '（未收录）');
      document.getElementById('c-city').textContent = B.city + ' · ' + '★'.repeat(B.stars) + '☆'.repeat(5 - B.stars);
      document.getElementById('c-doc').textContent = unlocked ? (B.doc || B.desc) : ('前往闯关区收集零件、在古建区复刻此建筑后即可收录展出。' + (B.desc || ''));
      document.getElementById('card').style.display = 'block'; document.getElementById('tip').style.display = 'none';
    }

    function animate() {
      if (disposed) return; rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta(), t = clock.elapsedTime;
      pedestals.forEach((P, i) => { if (P.unlocked) { P.model.rotation.y += dt * 0.5; P.model.position.y = P.baseY + Math.sin(t * 1.2 + i) * 0.06; } });
      renderer.render(scene, camera);
    }

    try { initScene(); container.querySelector('#loading').style.display = 'none'; animate(); }
    catch (err) { const l = container.querySelector('#loading'); if (l) l.textContent = '加载失败：' + err.message; console.error(err); }

    return {
      dispose() {
        disposed = true; cancelAnimationFrame(rafId);
        winL.forEach(([t, f]) => window.removeEventListener(t, f));
        if (renderer) { renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
      }
    };
  }

  /* ============================================================
   *  模块四：社区 —— 3D 环形回廊（作品画屏轮播）
   * ============================================================ */
  function sceneCommunity(container, ctx) {
    const state = ctx.state;
    const demo = [
      { title: '重檐叠翠·应县木塔', author: '榫卯少年', building: '应县木塔', likes: 128, hue: 0x9B1A1A },
      { title: '唐风大殿·佛光寺', author: '梁上君子', building: '佛光寺东大殿', likes: 96, hue: 0xC9A06A },
      { title: '我的第一座·双塔', author: '初入门径', building: '永祚寺双塔', likes: 54, hue: 0x2E8B57 },
      { title: '悬空奇构', author: '凌云工', building: '悬空寺', likes: 73, hue: 0xd4a853 },
      { title: '晋商双喜院', author: '祁县小匠', building: '乔家大院', likes: 61, hue: 0xb5342c }
    ];
    const userWorks = (state.freeWorks || []).map((w, i) => ({ title: w.title || ('自由拼装作品 ' + (i + 1)), author: '我', building: '创意自由拼装', likes: w.likes || 0, hue: 0x2E8B57, mine: true }));
    const works = [...userWorks, ...demo];

    container.innerHTML = `
      <div id="loading">晋楹记 · 正在布置作品回廊…</div>
      <div class="hud" id="hud-left">社区 · 匠作回廊</div>
      <div class="hud" id="hud-right">拖拽旋转 · 或用两侧按钮翻看作品</div>
      <div id="bar">
        <button class="cbtn" onclick="rotateTo(-1)">‹ 上一件</button>
        <div class="info"><div class="t" id="w-title">—</div><div class="m" id="w-meta"></div></div>
        <button class="cbtn like" onclick="likeCur()">♥ 赞 <span id="w-like">0</span></button>
        <button class="cbtn" onclick="rotateTo(1)">下一件 ›</button>
      </div>`;
    if (typeof THREE === 'undefined') { container.querySelector('#loading').textContent = '加载失败：未找到同目录下的 three.min.js'; return { dispose() {} }; }

    const W = () => container.clientWidth || window.innerWidth, H = () => container.clientHeight || window.innerHeight;
    let scene, camera, renderer, clock, ring;
    const R = 6.5; let targetAngle = 0, curIndex = 0;
    let dragging = false, lastX = 0, moved = 0;
    let disposed = false, rafId = 0; const winL = [];
    const addWin = (t, f) => { window.addEventListener(t, f); winL.push([t, f]); };

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); }

    function makeFrame(w) {
      const g = new THREE.Group();
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xC9A06A, roughness: .6 });
      const outer = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.6, 0.18), frameMat); g.add(outer);
      const canvas = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.0), new THREE.MeshStandardMaterial({ color: 0xF2E3C6, roughness: .9 })); canvas.position.z = 0.11; g.add(canvas);
      const silh = new THREE.Group(); silh.position.z = 0.13;
      const m = new THREE.MeshStandardMaterial({ color: w.hue, roughness: .7 });
      const layers = w.building.indexOf('木塔') >= 0 ? 5 : (w.building.indexOf('院') >= 0 ? 2 : 1);
      let ww = 1.6;
      for (let f = 0; f < layers; f++) { const b = new THREE.Mesh(new THREE.BoxGeometry(ww, 0.42, 0.06), m); b.position.y = -0.9 + f * 0.55; silh.add(b); const roof = new THREE.Mesh(new THREE.ConeGeometry(ww * 0.7, 0.3, 4), m); roof.rotation.y = Math.PI / 4; roof.position.y = -0.65 + f * 0.55; silh.add(roof); ww *= 0.82; }
      g.add(silh);
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x8f2019, roughness: .5 })); plaque.position.set(0, 2.1, 0.12); g.add(plaque);
      return g;
    }

    function initScene() {
      scene = new THREE.Scene(); scene.background = new THREE.Color(0x2a0f0d); scene.fog = new THREE.Fog(0x2a0f0d, 14, 40);
      camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 120); camera.position.set(0, 1.5, 13); camera.lookAt(0, 1.2, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W(), H()); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); outColor(renderer);
      container.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xffe6c0, 0x2a1008, 0.9));
      const p = new THREE.PointLight(0xffd090, 1.1, 60); p.position.set(0, 6, 6); scene.add(p);
      const p2 = new THREE.PointLight(0x8f2019, 0.8, 50); p2.position.set(0, 3, -8); scene.add(p2);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 48), new THREE.MeshStandardMaterial({ color: 0x4a201a, roughness: 1 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
      ring = new THREE.Group(); scene.add(ring);
      works.forEach((w, i) => { const ang = (i / works.length) * Math.PI * 2; const frame = makeFrame(w); frame.position.set(Math.sin(ang) * R, 1.4, Math.cos(ang) * R); frame.lookAt(0, 1.4, 0); frame.userData = { index: i }; ring.add(frame); });
      clock = new THREE.Clock(); bindControls(); updateInfo(); addWin('resize', onResize);
    }

    function bindControls() {
      const dom = renderer.domElement;
      dom.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; moved = 0; });
      addWin('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); targetAngle += dx * 0.006; });
      addWin('pointerup', () => { dragging = false; snap(); });
    }
    function snap() { const step = Math.PI * 2 / works.length; curIndex = ((Math.round(-targetAngle / step)) % works.length + works.length) % works.length; targetAngle = -curIndex * step; updateInfo(); }
    window.rotateTo = function (d) { curIndex = ((curIndex + d) % works.length + works.length) % works.length; const step = Math.PI * 2 / works.length; targetAngle = -curIndex * step; updateInfo(); };
    window.likeCur = function () { works[curIndex].likes++; updateInfo(); };
    function updateInfo() { const w = works[curIndex]; document.getElementById('w-title').textContent = w.title; document.getElementById('w-meta').textContent = w.author + ' · ' + w.building; document.getElementById('w-like').textContent = w.likes; }

    function animate() {
      if (disposed) return; rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta(); if (!dragging) targetAngle -= dt * 0.05;
      ring.rotation.y += (targetAngle - ring.rotation.y) * Math.min(1, dt * 6);
      ring.children.forEach(f => { const wp = new THREE.Vector3(); f.getWorldPosition(wp); const s = wp.z > R * 0.55 ? 1.12 : 0.92; f.scale.lerp(new THREE.Vector3(s, s, s), Math.min(1, dt * 6)); });
      renderer.render(scene, camera);
    }

    try { initScene(); container.querySelector('#loading').style.display = 'none'; animate(); }
    catch (err) { const l = container.querySelector('#loading'); if (l) l.textContent = '加载失败：' + err.message; console.error(err); }

    return {
      dispose() {
        disposed = true; cancelAnimationFrame(rafId);
        winL.forEach(([t, f]) => window.removeEventListener(t, f));
        delete window.rotateTo; delete window.likeCur;
        if (renderer) { renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
      }
    };
  }

  /* ============================================================
   *  模块五：我的 —— 3D 数据殿堂（战绩石柱 + 功德碑）
   * ============================================================ */
  function sceneProfile(container, ctx) {
    const state = ctx.state;
    const partsTotal = Object.values(state.inventory || {}).reduce((a, b) => a + b, 0);
    const builtCnt = (state.built || []).length;
    const lvCnt = Object.keys(state.clearedLevels || {}).length;
    const chip = state.woodchips || 0;
    const totalLevels = (typeof LEVELS !== 'undefined') ? LEVELS.length : 9;
    const totalBuild = (typeof BUILDINGS !== 'undefined') ? BUILDINGS.length : 7;
    const name = (state.sign && state.sign.name) || '匠人';
    const score = partsTotal + builtCnt * 5 + lvCnt * 3;
    const rank = score >= 60 ? '大匠师' : (score >= 35 ? '匠师' : (score >= 15 ? '匠人' : '学徒'));
    const stats = [
      { label: '零件', val: partsTotal, max: 40, color: 0xC9A06A },
      { label: '古建', val: builtCnt, max: totalBuild, color: 0x9B1A1A },
      { label: '关卡', val: lvCnt, max: totalLevels, color: 0x2E8B57 },
      { label: '木屑', val: chip, max: 20, color: 0xd4a853 }
    ];

    container.innerHTML = `
      <div id="loading">晋楹记 · 正在铸造功德碑…</div>
      <div class="hud" id="hud-left">我的 · 匠作殿堂</div>
      <div class="hud" id="hud-right">拖拽环视 · 石柱越高，成就越丰</div>
      <div id="report">
        <h3 id="rp-name">匠人</h3>
        <div class="st"><span>🪵 榫卯零件</span><b id="rp-parts">0</b></div>
        <div class="st"><span>🏛️ 复刻古建</span><b id="rp-built">0</b></div>
        <div class="st"><span>📜 通关关卡</span><b id="rp-lv">0</b></div>
        <div class="st"><span>🪵 剩余木屑</span><b id="rp-chip">0</b></div>
        <div class="st"><span>🏅 匠作等级</span><b id="rp-rank">学徒</b></div>
        <div class="tip" id="rp-tip"></div>
        <div class="ach-title">已解锁成就</div>
        <div class="ach-list" id="rp-ach"></div>
        <button class="cbtn" onclick="exportReport()">导出学习报告</button>
      </div>`;
    if (typeof THREE === 'undefined') { container.querySelector('#loading').textContent = '加载失败：未找到同目录下的 three.min.js'; return { dispose() {} }; }

    const W = () => container.clientWidth || window.innerWidth, H = () => container.clientHeight || window.innerHeight;
    let scene, camera, renderer, clock, pillars = [];
    let camA = 0.4, camB = 0.28, camR = 13;
    let dragging = false, lastX = 0, lastY = 0;
    let disposed = false, rafId = 0; const winL = [];
    const addWin = (t, f) => { window.addEventListener(t, f); winL.push([t, f]); };

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); }
    function updateCamera() { camB = Math.max(0.08, Math.min(1.0, camB)); camera.position.set(Math.cos(camA) * Math.cos(camB) * camR, Math.sin(camB) * camR + 2, Math.sin(camA) * Math.cos(camB) * camR); camera.lookAt(0, 1.8, 0); }

    function initScene() {
      scene = new THREE.Scene(); scene.background = new THREE.Color(0x241a2e); scene.fog = new THREE.Fog(0x241a2e, 18, 48);
      camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 120);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W(), H()); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; outColor(renderer);
      container.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xd8c8ff, 0x1a1020, 0.8));
      const dir = new THREE.DirectionalLight(0xfff0d8, 1.0); dir.position.set(6, 14, 8); dir.castShadow = true; dir.shadow.mapSize.set(1024, 1024); scene.add(dir);
      const p = new THREE.PointLight(0xffcf80, 1.0, 50); p.position.set(0, 7, 4); scene.add(p);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshStandardMaterial({ color: 0x2f2440, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
      const stele = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x8f2019, roughness: .7 })); body.position.y = 1.8; body.castShadow = true; stele.add(body);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.4, 0.7), new THREE.MeshStandardMaterial({ color: 0xC9A06A, roughness: .6 })); cap.position.y = 3.5; stele.add(cap);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.5, 24), new THREE.MeshStandardMaterial({ color: 0xa89878, roughness: .95 })); base.position.y = 0.25; base.castShadow = true; stele.add(base); scene.add(stele);
      const n = stats.length;
      stats.forEach((s, i) => {
        const ang = (i / n) * Math.PI * 2; const ratio = Math.max(0.08, Math.min(1, s.val / s.max)); const h = 0.6 + ratio * 4.2;
        const pil = new THREE.Mesh(new THREE.BoxGeometry(1.0, h, 1.0), new THREE.MeshStandardMaterial({ color: s.color, roughness: .6, emissive: s.color, emissiveIntensity: .12 }));
        pil.position.set(Math.sin(ang) * 5, h / 2, Math.cos(ang) * 5); pil.castShadow = true; pil.receiveShadow = true;
        const capM = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.25, 1.3), new THREE.MeshStandardMaterial({ color: 0xa89878, roughness: .9 })); capM.position.set(Math.sin(ang) * 5, 0.12, Math.cos(ang) * 5); scene.add(capM);
        scene.add(pil); pillars.push({ mesh: pil, targetH: h });
        pil.scale.y = 0.02; pil.position.y = 0.02 * h / 2;
      });
      clock = new THREE.Clock(); updateCamera(); bindControls(); addWin('resize', onResize);
    }

    function bindControls() {
      const dom = renderer.domElement;
      dom.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
      addWin('pointermove', e => { if (!dragging) return; camA -= (e.clientX - lastX) * 0.005; camB += (e.clientY - lastY) * 0.005; lastX = e.clientX; lastY = e.clientY; updateCamera(); });
      addWin('pointerup', () => dragging = false);
      dom.addEventListener('wheel', e => { camR += e.deltaY * 0.01; camR = Math.max(8, Math.min(28, camR)); updateCamera(); }, { passive: true });
    }

    function animate() {
      if (disposed) return; rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      pillars.forEach(p => { p.mesh.scale.y += (1 - p.mesh.scale.y) * Math.min(1, dt * 3); p.mesh.position.y = p.targetH / 2 * p.mesh.scale.y; });
      if (!dragging) { camA += dt * 0.06; updateCamera(); }
      renderer.render(scene, camera);
    }

    function fillReport() {
      document.getElementById('rp-name').textContent = name + ' 的匠作档案';
      document.getElementById('rp-parts').textContent = partsTotal;
      document.getElementById('rp-built').textContent = builtCnt + ' / ' + totalBuild;
      document.getElementById('rp-lv').textContent = lvCnt + ' / ' + totalLevels;
      document.getElementById('rp-chip').textContent = chip;
      document.getElementById('rp-rank').textContent = rank;
      document.getElementById('rp-tip').textContent = builtCnt === 0 ? '还没复刻任何古建，去闯关区答题攒零件，再到古建区拼装吧！' : ('已复刻 ' + builtCnt + ' 座山西古建，继续冲击「大匠师」！');
      const ach = (state.built || []).map(b => b.name || b.building || b.id || b);
      document.getElementById('rp-ach').innerHTML = ach.length
        ? ach.map(n => `<span class="ach">🏛️ ${n}</span>`).join('')
        : '<span class="ach dim">尚未复刻任何古建</span>';
    }
    window.exportReport = function () {
      const lines = ['晋楹记 · 学习报告', '匠人：' + name, '匠作等级：' + rank, '榫卯零件：' + partsTotal, '复刻古建：' + builtCnt + ' / ' + totalBuild, '通关关卡：' + lvCnt + ' / ' + totalLevels, '剩余木屑：' + chip, '导出时间：' + new Date().toLocaleString()];
      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '晋楹记_学习报告.txt'; a.click();
    };

    try { initScene(); fillReport(); container.querySelector('#loading').style.display = 'none'; animate(); }
    catch (err) { const l = container.querySelector('#loading'); if (l) l.textContent = '加载失败：' + err.message; console.error(err); }

    return {
      dispose() {
        disposed = true; cancelAnimationFrame(rafId);
        winL.forEach(([t, f]) => window.removeEventListener(t, f));
        delete window.exportReport;
        if (renderer) { renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
      }
    };
  }

  /* ============================================================
   *  控制器：顶部标签切换（单页，本页内装卸场景）
   * ============================================================ */
  const SCENES = { challenge: sceneChallenge, build: sceneBuild, museum: sceneMuseum, community: sceneCommunity, profile: sceneProfile };
  let view = null, current = null, currentDispose = null;

  function mount(name) {
    if (currentDispose) { try { currentDispose.dispose(); } catch (e) { console.error(e); } currentDispose = null; }
    view.innerHTML = '';
    current = name;
    document.querySelectorAll('#topnav button').forEach(b => b.classList.toggle('active', b.dataset.v === name));
    const factory = SCENES[name];
    if (!factory) return;
    currentDispose = factory(view, ctx);
  }
  window.mount = mount; // 供各场景内联 onclick 跳转（如“去拼古建”）

  function initApp() {
    view = document.getElementById('view');
    document.querySelectorAll('#topnav button').forEach(b => b.addEventListener('click', () => mount(b.dataset.v)));
    const valid = { challenge: 1, build: 1, museum: 1, community: 1, profile: 1 };
    const fromHash = (location.hash || '').replace('#', '');
    mount(valid[fromHash] ? fromHash : 'challenge');
    window.addEventListener('hashchange', () => { const h = (location.hash || '').replace('#', ''); if (valid[h]) mount(h); });

    setupAudioUI();

    // 首次用户交互启动背景音乐（满足浏览器自动播放策略：需用户手势才能出声）
    const kick = function () {
      AudioSys.resume();
      if (AudioSys.getSettings().bgmOn) AudioSys.startBgm();
      document.removeEventListener('pointerdown', kick);
      document.removeEventListener('keydown', kick);
    };
    document.addEventListener('pointerdown', kick);
    document.addEventListener('keydown', kick);
  }

  /* ---------------- 设置面板（背景音乐 / 音效 开关与音量，设置持久化） ---------------- */
  function setupAudioUI() {
    const panel = document.getElementById('settings-panel');
    const openBtn = document.getElementById('btn-settings');
    const closeBtn = document.getElementById('settings-close');
    const bgmToggle = document.getElementById('bgm-toggle');
    const sfxToggle = document.getElementById('sfx-toggle');
    const bgmVol = document.getElementById('bgm-vol');
    const sfxVol = document.getElementById('sfx-vol');
    const bgmVal = document.getElementById('bgm-vol-val');
    const sfxVal = document.getElementById('sfx-vol-val');

    function paintToggle(btn, on) { btn.dataset.on = on ? 'true' : 'false'; btn.textContent = on ? '开' : '关'; btn.classList.toggle('off', !on); }

    const s0 = AudioSys.getSettings();
    paintToggle(bgmToggle, s0.bgmOn); paintToggle(sfxToggle, s0.sfxOn);
    bgmVol.value = Math.round(s0.bgmVol * 100); bgmVal.textContent = bgmVol.value + '%';
    sfxVol.value = Math.round(s0.sfxVol * 100); sfxVal.textContent = sfxVol.value + '%';

    function openSettings() { panel.classList.add('show'); }
    function closeSettings() { panel.classList.remove('show'); }
    openBtn.addEventListener('click', function (e) { e.stopPropagation(); openSettings(); });
    closeBtn.addEventListener('click', closeSettings);
    panel.addEventListener('click', function (e) { if (e.target === panel) closeSettings(); });

    bgmToggle.addEventListener('click', function () { AudioSys.toggleBgm(); paintToggle(bgmToggle, AudioSys.getSettings().bgmOn); });
    sfxToggle.addEventListener('click', function () { AudioSys.toggleSfx(); paintToggle(sfxToggle, AudioSys.getSettings().sfxOn); AudioSys.playClick(); });
    bgmVol.addEventListener('input', function () { const v = +bgmVol.value; bgmVal.textContent = v + '%'; AudioSys.setBgmVol(v / 100); });
    sfxVol.addEventListener('input', function () { const v = +sfxVol.value; sfxVal.textContent = v + '%'; AudioSys.setSfxVol(v / 100); });

    // 清空游玩记录：二次点击确认，避免误触；确认后清掉本地存档并刷新界面
    const clearBtn = document.getElementById('clear-save-btn');
    let clearArmed = false, clearTimer = null;
    clearBtn.addEventListener('click', function () {
      if (!clearArmed) {
        clearArmed = true;
        clearBtn.classList.add('confirm');
        clearBtn.textContent = '⚠ 确认清空？再次点击';
        AudioSys.playClick();
        clearTimer = setTimeout(function () {
          clearArmed = false; clearBtn.classList.remove('confirm'); clearBtn.textContent = '清空游玩记录';
        }, 3000);
        return;
      }
      clearTimeout(clearTimer); clearArmed = false;
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      location.reload();
    });
  }

  if (document.readyState !== 'loading') initApp();
  else document.addEventListener('DOMContentLoaded', initApp);
})();
