import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ===================== 基础配置 =====================
const ARENA = 60;            // 竞技场半径
const EYE = 1.7;            // 视点高度
const PLAYER_R = 0.45;      // 玩家碰撞半径
const GRAVITY = 22;
const WALK = 6.2, RUN = 10.5, JUMP = 8.0;
const FIRE_RATE = 0.095;    // 每发间隔(秒)
const MAG = 30, RELOAD = 1.5, DMG = 34;
const ENEMY_HP = 100, ENEMY_SPD = 3.2, ENEMY_ATK = 9, ATK_RANGE = 2.2;

// ===================== 渲染器 =====================
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x9fb6cf, 45, 140);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 1000);
camera.position.set(0, EYE, 0);
scene.add(camera);

// ===================== 天空（渐变球） =====================
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    top: { value: new THREE.Color(0x143a72) },
    bottom: { value: new THREE.Color(0xc7d8ec) },
    offset: { value: 40 }, exponent: { value: 0.6 }
  },
  vertexShader: `varying vec3 vP; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vP=w.xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform float offset; uniform float exponent; varying vec3 vP;
    void main(){ float h = normalize(vP + vec3(0.0, offset, 0.0)).y; float t = pow(max(h,0.0), exponent); gl_FragColor = vec4(mix(bottom, top, t), 1.0); }`
});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), skyMat));

// ===================== 光照 =====================
scene.add(new THREE.HemisphereLight(0xbcd4ff, 0x4a5a3a, 0.85));
const sun = new THREE.DirectionalLight(0xfff2d8, 2.2);
sun.position.set(40, 70, 30);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1; sun.shadow.camera.far = 220;
const sc = 75;
sun.shadow.camera.left = -sc; sun.shadow.camera.right = sc;
sun.shadow.camera.top = sc; sun.shadow.camera.bottom = -sc;
sun.shadow.bias = -0.0004;
scene.add(sun);

// ===================== 地面 =====================
function makeGroundTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#5b6b4a'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    x.fillStyle = Math.random() > 0.5 ? 'rgba(70,84,56,0.6)' : 'rgba(110,124,86,0.5)';
    x.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  x.strokeStyle = 'rgba(30,38,24,0.5)'; x.lineWidth = 3;
  for (let i = 0; i <= 512; i += 64) {
    x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 512); x.stroke();
    x.beginPath(); x.moveTo(0, i); x.lineTo(512, i); x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(40, 40);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial({ map: makeGroundTexture(), roughness: 0.95, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
scene.add(ground);

// ===================== 障碍物 / 掩体 =====================
const obstacles = []; // {minX,maxX,minZ,maxZ}
const colliderMeshes = []; // 用于子弹射线检测的实体

function addBox(w, h, d, x, z, color, rotY = 0) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05 })
  );
  mesh.position.set(x, h / 2, z); mesh.rotation.y = rotY;
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh); colliderMeshes.push(mesh);
  // AABB（忽略旋转，按包围盒估算）
  const hw = Math.max(Math.abs(Math.cos(rotY)) * w / 2 + Math.abs(Math.sin(rotY)) * d / 2, 0.1);
  const hd = Math.max(Math.abs(Math.sin(rotY)) * w / 2 + Math.abs(Math.cos(rotY)) * d / 2, 0.1);
  obstacles.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
  return mesh;
}

// 边界墙
const wallH = 6;
addBox(ARENA * 2 + 4, wallH, 2, 0, -ARENA, 0x3a4250);
addBox(ARENA * 2 + 4, wallH, 2, 0, ARENA, 0x3a4250);
addBox(2, wallH, ARENA * 2 + 4, -ARENA, 0, 0x3a4250);
addBox(2, wallH, ARENA * 2 + 4, ARENA, 0, 0x3a4250);

// 掩体（箱子、柱、矮墙）
const crateMat = 0x8a6a40, wallMat = 0x6b7480, pillarMat = 0x55606e;
const layout = [
  [4, 4, 4, -12, -10, crateMat], [4, 4, 4, 12, 8, crateMat],
  [4, 4, 4, -18, 16, crateMat], [4, 4, 4, 20, -16, crateMat],
  [6, 3, 1.5, 0, -22, wallMat, 0.3], [6, 3, 1.5, -25, 0, wallMat, 1.2],
  [6, 3, 1.5, 25, 4, wallMat, -0.6], [6, 3, 1.5, 6, 26, wallMat, 0.2],
  [3, 7, 3, -30, -28, pillarMat], [3, 7, 3, 30, 28, pillarMat],
  [3, 7, 3, 32, -30, pillarMat], [3, 7, 3, -32, 30, pillarMat],
];
for (const [w, h, d, x, z, c, r] of layout) addBox(w, h, d, x, z, c, r || 0);

// ===================== 第一人称枪械 =====================
const gun = new THREE.Group();
const metalDark = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.45, metalness: 0.9 });
const metalMid = new THREE.MeshStandardMaterial({ color: 0x3a3f47, roughness: 0.5, metalness: 0.85 });
const accent = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.6, metalness: 0.7 });
const gripMat = new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.7, metalness: 0.3 });

function part(geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = false; gun.add(m); return m;
}
// 机匣
part(new THREE.BoxGeometry(0.09, 0.11, 0.42), metalMid, 0, 0, -0.05);
// 枪管
part(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 16), metalDark, 0, 0.01, -0.42, Math.PI / 2, 0, 0);
// 护木
part(new THREE.BoxGeometry(0.07, 0.07, 0.3), accent, 0, -0.02, -0.32);
// 枪托
part(new THREE.BoxGeometry(0.06, 0.1, 0.18), metalDark, 0, 0.0, 0.22);
// 握把
part(new THREE.BoxGeometry(0.05, 0.16, 0.07), gripMat, 0, -0.13, 0.04, 0, 0, 0.25);
// 弹匣
part(new THREE.BoxGeometry(0.05, 0.2, 0.08), accent, 0, -0.16, -0.05, 0, 0, 0.12);
// 瞄准镜/导轨
part(new THREE.BoxGeometry(0.03, 0.03, 0.34), metalDark, 0, 0.08, -0.05);
// 橙色识别块
part(new THREE.BoxGeometry(0.02, 0.02, 0.06), new THREE.MeshStandardMaterial({ color: 0xff7a18, emissive: 0x652800, roughness: 0.5 }), 0.05, 0.04, -0.2);

const gunBase = new THREE.Vector3(0.18, -0.20, -0.42);
gun.position.copy(gunBase);
gun.rotation.y = 0.04;
camera.add(gun);

// 枪口空物体（用于火光/弹道起点）
const muzzle = new THREE.Object3D();
muzzle.position.set(0, 0.01, -0.7);
gun.add(muzzle);

// 枪口火光精灵
const flashTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 60);
  g.addColorStop(0, 'rgba(255,255,210,1)'); g.addColorStop(0.4, 'rgba(255,180,60,0.9)');
  g.addColorStop(1, 'rgba(255,120,0,0)');
  x.fillStyle = g; x.beginPath(); x.arc(64, 64, 60, 0, Math.PI * 2); x.fill();
  return new THREE.CanvasTexture(c);
})();
const muzzleFlash = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, color: 0xffd070, blending: THREE.AdditiveBlending, depthTest: false, transparent: true }));
muzzleFlash.scale.set(0.5, 0.5, 0.5); muzzleFlash.visible = false;
muzzle.add(muzzleFlash);
const flashLight = new THREE.PointLight(0xffaa44, 0, 6, 2);
muzzle.add(flashLight);

// ===================== 后坐力 / 摆动状态 =====================
let recoil = 0;            // 当前后坐力量
let gunKick = 0;           // 枪身后退
let chScale = 1;           // 准星扩散
const bob = { t: 0, amt: 0 };

// ===================== 敌人 =====================
const enemies = [];
const enemyGeoCache = null;
const tmpV = new THREE.Vector3();

function makeEnemy() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x9b2d2d, roughness: 0.6, metalness: 0.1 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xd8a07a, roughness: 0.7 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.8 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.7, 6, 12), bodyMat);
  torso.position.y = 1.1; torso.castShadow = true; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), headMat);
  head.position.y = 1.78; head.castShadow = true; g.add(head);
  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.6, 4, 8), legMat);
  legL.position.set(-0.16, 0.5, 0); legL.castShadow = true; g.add(legL);
  const legR = legL.clone(); legR.position.x = 0.16; g.add(legR);
  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.55, 4, 8), bodyMat);
  armL.position.set(-0.42, 1.15, 0); armL.rotation.z = 0.3; g.add(armL);
  const armR = armL.clone(); armR.position.x = 0.42; armR.rotation.z = -0.3; g.add(armR);

  // 头顶血条（精灵）
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x111111, depthTest: false }));
  bg.scale.set(0.9, 0.12, 1); bg.position.y = 2.2; g.add(bg);
  const fg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x36d24a, depthTest: false }));
  fg.scale.set(0.86, 0.08, 1); fg.position.set(0, 2.2, 0.001); g.add(fg);
  g.userData.fg = fg;

  // 出生点：竞技场边缘随机
  const a = Math.random() * Math.PI * 2;
  const r = ARENA - 6 - Math.random() * 8;
  g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
  scene.add(g);

  const e = { group: g, hp: ENEMY_HP, alive: true, atkCd: 0, hitR: 0.55 };
  // 记录可被射线命中的部位
  g.traverse(o => { if (o.isMesh) { o.userData.enemy = e; } });
  enemies.push(e);
  return e;
}

function killEnemy(e) {
  e.alive = false;
  // 死亡粒子
  spawnBurst(e.group.position.clone().setY(1.1), 0xff5544, 18);
  scene.remove(e.group);
  const i = enemies.indexOf(e); if (i >= 0) enemies.splice(i, 1);
  kills++; updateHUD();
  enemyCount = Math.max(0, enemyCount - 1);
  playSound('death');
  scheduleSpawn();
}

// ===================== 粒子特效 =====================
const sparks = [];
function spawnBurst(pos, color, n = 12) {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(n * 3);
  const vel = [];
  for (let i = 0; i < n; i++) {
    arr[i * 3] = pos.x; arr[i * 3 + 1] = pos.y; arr[i * 3 + 2] = pos.z;
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5).normalize();
    vel.push(dir.multiplyScalar(3 + Math.random() * 4));
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const mat = new THREE.PointsMaterial({ color, size: 0.14, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat); scene.add(pts);
  sparks.push({ pts, vel, life: 0.6, max: 0.6 });
}
function updateSparks(dt) {
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i]; s.life -= dt;
    const p = s.pts.geometry.attributes.position;
    for (let j = 0; j < s.vel.length; j++) {
      s.vel[j].y -= GRAVITY * dt;
      p.array[j * 3] += s.vel[j].x * dt;
      p.array[j * 3 + 1] += s.vel[j].y * dt;
      p.array[j * 3 + 2] += s.vel[j].z * dt;
    }
    p.needsUpdate = true;
    s.pts.material.opacity = Math.max(0, s.life / s.max);
    if (s.life <= 0) { scene.remove(s.pts); s.pts.geometry.dispose(); s.pts.material.dispose(); sparks.splice(i, 1); }
  }
}

// ===================== 弹道曳光 =====================
const tracers = [];
function spawnTracer(from, to) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
  const mat = new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const line = new THREE.Line(geo, mat); scene.add(line);
  tracers.push({ line, life: 0.06, max: 0.06 });
}
function updateTracers(dt) {
  for (let i = tracers.length - 1; i >= 0; i--) {
    const t = tracers[i]; t.life -= dt;
    t.line.material.opacity = Math.max(0, t.life / t.max) * 0.9;
    if (t.life <= 0) { scene.remove(t.line); t.line.geometry.dispose(); t.line.material.dispose(); tracers.splice(i, 1); }
  }
}

// ===================== 音效（WebAudio 合成） =====================
let audioCtx = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playSound(type) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  if (type === 'shoot') {
    const len = audioCtx.sampleRate * 0.14;
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = audioCtx.createBufferSource(); src.buffer = buf;
    const flt = audioCtx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 1800;
    const g = audioCtx.createGain(); g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    src.connect(flt); flt.connect(g); g.connect(audioCtx.destination); src.start(t); src.stop(t + 0.14);
  } else if (type === 'hit') {
    const o = audioCtx.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(880, t);
    const g = audioCtx.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.08);
  } else if (type === 'death') {
    const o = audioCtx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.25);
    const g = audioCtx.createGain(); g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.25);
  } else if (type === 'pain') {
    const o = audioCtx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.15);
    const g = audioCtx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.15);
  }
}

// ===================== 控制器 / 输入 =====================
const controls = new PointerLockControls(camera, renderer.domElement);
const keys = {};
let firing = false;
let fireTimer = 0;
let ammo = MAG;
let reloading = false, reloadTimer = 0;
let health = 100, kills = 0, enemyCount = 0;
let running = false, gameOver = false;

addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyR' && !reloading && ammo < MAG && running && !gameOver) startReload();
});
addEventListener('keyup', e => { keys[e.code] = false; });
renderer.domElement.addEventListener('mousedown', e => { if (e.button === 0 && running && !gameOver) firing = true; });
addEventListener('mouseup', e => { if (e.button === 0) firing = false; });
renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

const blocker = document.getElementById('blocker');
const gameoverEl = document.getElementById('gameover');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const hud = document.getElementById('hud');

function startGame() {
  initAudio();
  blocker.style.display = 'none';
  gameoverEl.style.display = 'none';
  hud.style.display = 'block';
  running = true; gameOver = false;
  controls.lock();
}
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => { resetGame(); startGame(); });

controls.addEventListener('lock', () => { if (!gameOver) blocker.style.display = 'none'; });
controls.addEventListener('unlock', () => {
  if (running && !gameOver) { blocker.style.display = 'flex'; document.getElementById('panel-tip').textContent = '已暂停 — 点击继续'; }
});

// ===================== 换弹 =====================
function startReload() {
  reloading = true; reloadTimer = RELOAD;
  document.getElementById('ammo').classList.add('reloading');
}

// ===================== 射击 =====================
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

function shoot() {
  if (ammo <= 0) { startReload(); return; }
  ammo--; updateHUD();
  firing && (fireTimer = FIRE_RATE);
  recoil = Math.min(recoil + 1, 6);
  gunKick = 0.06;

  // 枪口火光
  muzzleFlash.visible = true;
  muzzleFlash.material.opacity = 1;
  muzzleFlash.material.rotation = Math.random() * Math.PI;
  muzzleFlash.scale.setScalar(0.45 + Math.random() * 0.2);
  flashLight.intensity = 6;
  chScale = 1.5;
  playSound('shoot');

  // 射线检测（敌人 + 障碍）
  raycaster.setFromCamera(center, camera);
  const targets = colliderMeshes.concat(enemies.flatMap(e => e.group.children));
  const hits = raycaster.intersectObjects(targets, false);
  const muzzleWorld = new THREE.Vector3(); muzzle.getWorldPosition(muzzleWorld);

  if (hits.length > 0) {
    const h = hits[0];
    spawnTracer(muzzleWorld, h.point);
    if (h.object.userData.enemy) {
      const e = h.object.userData.enemy;
      const headshot = h.object.geometry.type === 'SphereGeometry';
      e.hp -= headshot ? DMG * 2 : DMG;
      spawnBurst(h.point, 0xff3030, 8);
      flashHitmarker();
      playSound('hit');
      if (e.hp <= 0) killEnemy(e); else updateEnemyBar(e);
    } else {
      spawnBurst(h.point, 0xcccccc, 5); // 打在墙上
    }
  } else {
    const end = raycaster.ray.at(120, new THREE.Vector3());
    spawnTracer(muzzleWorld, end);
  }
}

function updateEnemyBar(e) {
  const ratio = Math.max(0, e.hp / ENEMY_HP);
  e.group.userData.fg.scale.x = 0.86 * ratio;
  e.group.userData.fg.position.x = -0.43 * (1 - ratio);
  e.group.userData.fg.material.color.setHSL(ratio * 0.33, 0.8, 0.5);
}

// ===================== HUD =====================
function updateHUD() {
  document.getElementById('health-fill').style.width = Math.max(0, health) + '%';
  const ammoEl = document.getElementById('ammo');
  ammoEl.textContent = reloading ? '换弹中…' : `${ammo} / ${MAG}`;
  document.getElementById('score').textContent = `击杀 ${kills}`;
  document.getElementById('enemies').textContent = `剩余敌人 ${enemyCount}`;
}

let hitmarkerTimer = 0;
function flashHitmarker() {
  const el = document.getElementById('hitmarker');
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}
let damageTimer = 0;
function takeDamage(amt) {
  health -= amt; if (health < 0) health = 0;
  updateHUD();
  damageTimer = 0.25;
  playSound('pain');
  if (health <= 0) endGame();
}
const dmgOverlay = document.getElementById('damage-overlay');

// ===================== 敌人生成调度 =====================
let spawnCd = 0;
const MAX_ENEMIES = 12;
function scheduleSpawn() { /* 由 update 中的计时器补充 */ }
function trySpawn() {
  if (enemyCount < MAX_ENEMIES && running && !gameOver) {
    makeEnemy(); enemyCount++; updateHUD();
  }
}

// ===================== 结束 / 重置 =====================
function endGame() {
  gameOver = true; running = false; firing = false;
  controls.unlock();
  document.getElementById('final-score').textContent = `击杀 ${kills}`;
  gameoverEl.style.display = 'flex';
}
function resetGame() {
  for (const e of [...enemies]) { scene.remove(e.group); }
  enemies.length = 0;
  health = 100; ammo = MAG; reloading = false; reloadTimer = 0;
  kills = 0; enemyCount = 0; spawnCd = 0;
  camera.position.set(0, EYE, 0);
  document.getElementById('ammo').classList.remove('reloading');
  updateHUD();
  for (let i = 0; i < 4; i++) trySpawn();
}

// ===================== 碰撞解算 =====================
function resolveCollision(pos, r) {
  for (const o of obstacles) {
    if (pos.x > o.minX - r && pos.x < o.maxX + r && pos.z > o.minZ - r && pos.z < o.maxZ + r) {
      // 推到最近的边
      const dl = pos.x - (o.minX - r), dr = (o.maxX + r) - pos.x;
      const db = pos.z - (o.minZ - r), df = (o.maxZ + r) - pos.z;
      const m = Math.min(dl, dr, db, df);
      if (m === dl) pos.x = o.minX - r;
      else if (m === dr) pos.x = o.maxX + r;
      else if (m === db) pos.z = o.minZ - r;
      else pos.z = o.maxZ + r;
    }
  }
  // 边界兜底
  const lim = ARENA - r;
  pos.x = Math.max(-lim, Math.min(lim, pos.x));
  pos.z = Math.max(-lim, Math.min(lim, pos.z));
}

// ===================== 主循环 =====================
const clock = new THREE.Clock();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
const moveDir = new THREE.Vector3();
let velocityY = 0, onGround = true;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (running && !gameOver) {
    // --- 移动方向 ---
    camera.getWorldDirection(forward); forward.y = 0; forward.normalize();
    right.crossVectors(forward, up).normalize();
    moveDir.set(0, 0, 0);
    if (keys['KeyW']) moveDir.add(forward);
    if (keys['KeyS']) moveDir.sub(forward);
    if (keys['KeyD']) moveDir.add(right);
    if (keys['KeyA']) moveDir.sub(right);
    const sprint = keys['ShiftLeft'] || keys['ShiftRight'];
    const speed = sprint ? RUN : WALK;
    const moving = moveDir.lengthSq() > 0;
    if (moving) moveDir.normalize().multiplyScalar(speed * dt);

    // 水平位置
    const np = camera.position.clone();
    np.x += moveDir.x; np.z += moveDir.z;
    resolveCollision(np, PLAYER_R);
    camera.position.x = np.x; camera.position.z = np.z;

    // 垂直（跳跃/重力）
    if ((keys['Space']) && onGround) { velocityY = JUMP; onGround = false; }
    velocityY -= GRAVITY * dt;
    camera.position.y += velocityY * dt;
    if (camera.position.y <= EYE) { camera.position.y = EYE; velocityY = 0; onGround = true; }

    // 移动摆动
    bob.amt = THREE.MathUtils.lerp(bob.amt, moving ? 1 : 0, dt * 8);
    bob.t += dt * (sprint ? 14 : 9) * (moving ? 1 : 0);

    // --- 射击 ---
    fireTimer -= dt;
    if (firing && !reloading && fireTimer <= 0 && ammo > 0) shoot();
    if (reloading) {
      reloadTimer -= dt;
      if (reloadTimer <= 0) { reloading = false; ammo = MAG; document.getElementById('ammo').classList.remove('reloading'); updateHUD(); }
    }

    // --- 敌人 AI ---
    spawnCd -= dt;
    if (spawnCd <= 0) { spawnCd = 1.8; trySpawn(); }
    const playerPos = camera.position;
    for (const e of enemies) {
      if (!e.alive) continue;
      const ep = e.group.position;
      tmpV.set(playerPos.x - ep.x, 0, playerPos.z - ep.z);
      const dist = tmpV.length();
      if (dist > ATK_RANGE) {
        tmpV.normalize();
        ep.x += tmpV.x * ENEMY_SPD * dt; ep.z += tmpV.z * ENEMY_SPD * dt;
        resolveCollision(ep, e.hitR);
        // 朝向玩家并做行走摆动
        e.group.rotation.y = Math.atan2(tmpV.x, tmpV.z);
        e.group.position.y = Math.abs(Math.sin(performance.now() * 0.006 + ep.x)) * 0.06;
      } else {
        e.atkCd -= dt;
        if (e.atkCd <= 0) { e.atkCd = 1.0; takeDamage(ENEMY_ATK); }
      }
    }

    // --- 后坐力 / 枪身动画 ---
    recoil = THREE.MathUtils.lerp(recoil, 0, dt * 10);
    gunKick = THREE.MathUtils.lerp(gunKick, 0, dt * 12);
    const bobX = Math.cos(bob.t) * 0.012 * bob.amt;
    const bobY = Math.abs(Math.sin(bob.t)) * 0.018 * bob.amt;
    gun.position.set(
      gunBase.x + bobX,
      gunBase.y + bobY - gunKick * 0.3,
      gunBase.z + gunKick
    );
    gun.rotation.x = -recoil * 0.012 - gunKick * 0.4;
    gun.rotation.z = bobX * 0.5;

    // 准星随开火/移动扩散
    const moveSpread = bob.amt * 0.12;
    chScale = THREE.MathUtils.lerp(chScale, 1 + moveSpread, dt * 12);
    document.getElementById('crosshair').style.transform = `translate(-50%,-50%) scale(${chScale.toFixed(3)})`;

    // 火光淡出
    if (muzzleFlash.visible) {
      muzzleFlash.material.opacity = Math.max(0, muzzleFlash.material.opacity - dt * 18);
      if (muzzleFlash.material.opacity <= 0) muzzleFlash.visible = false;
    }
    flashLight.intensity = Math.max(0, flashLight.intensity - dt * 40);

    if (damageTimer > 0) { damageTimer -= dt; dmgOverlay.style.opacity = Math.min(0.9, damageTimer * 3.6); }
    else dmgOverlay.style.opacity = 0;
  }

  updateSparks(dt);
  updateTracers(dt);
  composer.render();
}

// ===================== 后期处理（泛光） =====================
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.7, 0.85);
composer.addPass(bloom);
composer.addPass(new OutputPass());

addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

updateHUD();
// 预生成敌人（供开始前的场景预览；不依赖 running 状态）
for (let i = 0; i < 4; i++) { makeEnemy(); enemyCount++; }
updateHUD();
animate();
