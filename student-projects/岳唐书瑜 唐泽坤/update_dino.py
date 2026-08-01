# -*- coding: utf-8 -*-
import sys

filepath = r'C:\Users\candy\WorkBuddy\2026-07-11-20-43-15\dino-words.html'

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

changes = []

# ── 1. Replace dino animation CSS: remove drop-shadow, make animation more lively ──
old = """  animation: dinoFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.15));
}
@keyframes dinoFloat {
  0%,100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}"""
new = """  animation: dinoBounce 3s ease-in-out infinite;
}
@keyframes dinoBounce {
  0%,100% { transform: translateY(0) rotate(-3deg) scale(1); }
  25% { transform: translateY(-8px) rotate(2deg) scale(1.02); }
  50% { transform: translateY(-15px) rotate(-1deg) scale(1); }
  75% { transform: translateY(-8px) rotate(3deg) scale(1.02); }
}"""
assert old in html, "FAIL 1: dino animation CSS not found"
html = html.replace(old, new, 1)
changes.append("1. Replaced dino animation (removed drop-shadow, added bouncy animation)")

# ── 2. Add map + detail CSS before .welcome-actions ──
map_css = """/* ============ 打卡地图 ============ */
.streak-map-section { margin: 20px 0; animation: titleSlide 0.8s ease 0.3s both; }
.streak-map-title { font-size: 16px; font-weight: 700; color: var(--text-1); margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 10px; }
.streak-badge { background: linear-gradient(135deg, var(--candy-orange), var(--candy-pink)); color: #fff; font-size: 13px; padding: 3px 12px; border-radius: 14px; font-weight: 700; }
.streak-map { display: flex; flex-direction: column; align-items: center; }
.map-row { display: flex; align-items: center; justify-content: center; }
.map-row.reverse { flex-direction: row-reverse; }
.map-node { width: 56px; height: 56px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: default; transition: all 0.3s; position: relative; z-index: 2; flex-shrink: 0; }
.map-node .node-icon { font-size: 15px; font-weight: 800; line-height: 1; }
.map-node .node-label { font-size: 8px; margin-top: 2px; line-height: 1; white-space: nowrap; }
.map-node.completed { background: linear-gradient(135deg, var(--candy-green), var(--candy-blue)); color: #fff; cursor: pointer; box-shadow: 0 3px 10px rgba(76,175,80,0.3); }
.map-node.completed:hover { transform: scale(1.15); box-shadow: 0 5px 15px rgba(76,175,80,0.4); }
.map-node.current { background: linear-gradient(135deg, var(--candy-orange), var(--candy-yellow)); color: #fff; animation: nodePulse 1.5s ease-in-out infinite; box-shadow: 0 3px 12px rgba(255,152,0,0.4); }
@keyframes nodePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 5px 18px rgba(255,152,0,0.5); } }
.map-node.locked { background: var(--bg-2); color: var(--text-3); opacity: 0.4; }
.map-connector { width: 28px; height: 4px; background: var(--bg-2); flex-shrink: 0; border-radius: 2px; }
.map-connector.completed { background: linear-gradient(90deg, var(--candy-green), var(--candy-blue)); }
.map-row-separator { width: 4px; height: 18px; background: var(--bg-2); border-radius: 2px; }
.map-row-separator.completed { background: linear-gradient(180deg, var(--candy-green), var(--candy-blue)); }
.extra-banner { background: linear-gradient(135deg, rgba(255,152,0,0.1), rgba(255,193,7,0.1)); border: 2px solid var(--candy-orange); border-radius: 14px; padding: 10px 16px; text-align: center; font-size: 14px; color: var(--candy-orange); font-weight: 600; margin-bottom: 16px; }
/* ============ 日期详情弹窗 ============ */
.detail-word { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--border); }
.detail-word .dw-en { font-weight: 600; color: var(--text-1); font-size: 15px; }
.detail-word .dw-zh { color: var(--text-2); font-size: 14px; }
.detail-word.error { background: rgba(244,67,54,0.05); border-radius: 8px; }
.detail-word.error .dw-en { color: var(--candy-pink); }
.detail-list { max-height: 200px; overflow-y: auto; border-radius: 10px; }
.detail-list .empty { text-align: center; color: var(--text-3); padding: 16px; font-size: 14px; }
.welcome-actions {"""
old = ".welcome-actions {"
assert old in html, "FAIL 2: .welcome-actions not found"
html = html.replace(old, map_css, 1)
changes.append("2. Added map + detail CSS")

# ── 3. Update DEFAULT_DATA: add dayRecords and todayCheckedIn ──
old = "  lastStudyTs: null,\n};"
new = "  lastStudyTs: null,\n  todayCheckedIn: false,\n  dayRecords: [],\n};"
assert old in html, "FAIL 3: DEFAULT_DATA end not found"
html = html.replace(old, new, 1)
changes.append("3. Added dayRecords + todayCheckedIn to DEFAULT_DATA")

# ── 4. Update dailyReset: reset todayCheckedIn on new day ──
old = """function dailyReset() {
  const d = Store.data;
  const today = todayStr();
  if (d.todayLearnDate !== today) {
    // 新的一天，清空今日学习记录
    d.todayLearned = [];
    d.todayLearnDate = today;
  }
  Store.save();
}"""
new = """function dailyReset() {
  const d = Store.data;
  const today = todayStr();
  if (d.todayLearnDate !== today) {
    // 新的一天，清空今日学习记录
    d.todayLearned = [];
    d.todayLearnDate = today;
    d.todayCheckedIn = false;
  }
  Store.save();
}"""
assert old in html, "FAIL 4: dailyReset not found"
html = html.replace(old, new, 1)
changes.append("4. Updated dailyReset to reset todayCheckedIn")

# ── 5. Redesign Homepage HTML ──
old = """    <div class="welcome-page">
      <div class="welcome-dino-wrap" id="welcomeDino"></div>
      <div class="welcome-dino-shadow"></div>
      <div class="welcome-title">恐龙背单词</div>
      <div class="welcome-subtitle">和你的小恐龙一起征服英语世界！</div>
      <div class="welcome-stats-card">
        <div class="stat-bar">
          <div class="stat-bar-label"><span>📚 今日进度</span><span id="learnProgressText">0 / 50</span></div>
          <div class="stat-bar-track"><div class="stat-bar-fill progress" id="learnProgressBar" style="width:0%"></div></div>
        </div>
        <div class="welcome-stats-row">
          <div class="welcome-stat"><div class="num" id="totalLearned">0</div><div class="label">📖 已学单词</div></div>
          <div class="welcome-stat"><div class="num" id="levelNum">1</div><div class="label">⭐ 等级</div></div>
          <div class="welcome-stat"><div class="num" id="streakNum">0</div><div class="label">🔥 连续打卡</div></div>
        </div>
      </div>
      <div class="welcome-actions">
        <button class="btn-big btn-learn" id="btnStartLearn" onclick="Pages.show('learn')">📖 开始背单词</button>
        <button class="btn-big btn-quiz" id="btnStartQuiz" onclick="Quiz.start()">🧪 记忆考核</button>
      </div>
      <div id="quizLockInfo" style="text-align:center; color:var(--text-3); font-size:13px; margin-top:10px;"></div>
    </div>"""
new = """    <div class="welcome-page">
      <div class="welcome-dino-wrap" id="welcomeDino"></div>
      <div class="welcome-dino-shadow"></div>
      <div class="welcome-title">恐龙背单词</div>
      <div class="welcome-subtitle">和你的小恐龙一起征服英语世界！</div>
      <div class="streak-map-section">
        <div class="streak-map-title">
          🗺️ 恐龙进化之路
          <span class="streak-badge">🔥 连续 <span id="streakNum">0</span> 天</span>
        </div>
        <div class="streak-map" id="streakMap"></div>
      </div>
    </div>"""
assert old in html, "FAIL 5: Homepage HTML not found"
html = html.replace(old, new, 1)
changes.append("5. Redesigned homepage (removed stats/buttons, added map)")

# ── 6. Add extra learning banner to learn page ──
old = """  <div class="page" id="page-learn">
    <button class="back-btn" onclick="Pages.show('home')">← 返回首页</button>"""
new = """  <div class="page" id="page-learn">
    <button class="back-btn" onclick="Pages.show('home')">← 返回首页</button>
    <div id="learnExtraBanner" class="extra-banner" style="display:none;">🎉 今日已打卡完成！当前为额外学习模式，不会增加连续打卡天数</div>"""
assert old in html, "FAIL 6: Learn page header not found"
html = html.replace(old, new, 1)
changes.append("6. Added extra learning banner")

# ── 7. Add day detail modal HTML ──
old = """<!-- ============ 弹窗 · 庆祝 ============ -->"""
new = """<!-- ============ 弹窗 · 日期详情 ============ -->
<div class="modal-overlay" id="modal-day-detail">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title" id="detailDay">第 1 天</span>
      <button class="close-btn" onclick="closeModal('modal-day-detail')">×</button>
    </div>
    <div style="padding:16px;">
      <div style="display:flex; gap:12px; margin-bottom:16px;">
        <div style="flex:1; text-align:center; background:var(--bg-2); border-radius:12px; padding:12px;">
          <div style="font-size:24px; font-weight:800; color:var(--candy-green);" id="detailWordCount">0</div>
          <div style="font-size:12px; color:var(--text-3);">📖 背诵单词</div>
        </div>
        <div style="flex:1; text-align:center; background:var(--bg-2); border-radius:12px; padding:12px;">
          <div style="font-size:14px; font-weight:600; color:var(--text-2);" id="detailDate">--</div>
          <div style="font-size:12px; color:var(--text-3);">📅 日期</div>
        </div>
      </div>
      <div style="font-size:14px; font-weight:700; color:var(--text-1); margin-bottom:8px;">📖 当日背诵单词</div>
      <div class="detail-list" id="detailWordList"></div>
      <div style="font-size:14px; font-weight:700; color:var(--candy-pink); margin:12px 0 8px;">❌ 当日错题</div>
      <div class="detail-list" id="detailErrorList"></div>
    </div>
  </div>
</div>

<!-- ============ 弹窗 · 庆祝 ============ -->"""
assert old in html, "FAIL 7: Celebrate modal comment not found"
html = html.replace(old, new, 1)
changes.append("7. Added day detail modal HTML")

# ── 8. Update Learn.init() ──
old = """  init() {
    const d = Store.data;
    // 如果当前批次已完成，自动生成新批次
    if (d.todayLearned.length >= d.dailyGoal) {
      d.todayLearned = [];
      this.queue = [];
      this.index = 0;
      Store.save();
    }
    // 选取今日单词
    if (this.queue.length === 0 || d.todayLearned.length === 0) {
      // 排除已学过的
      const learnedSet = new Set(d.todayLearned);
      const available = WORD_BANK.map((_, i) => i).filter(i => !learnedSet.has(i));
      const shuffled = shuffle(available);
      this.queue = shuffled.slice(0, d.dailyGoal - d.todayLearned.length);
      this.index = 0;
    }
    this.showWord();
  },"""
new = """  init() {
    const d = Store.data;
    // 显示/隐藏额外学习提示
    const banner = document.getElementById('learnExtraBanner');
    if (banner) banner.style.display = d.todayCheckedIn ? 'block' : 'none';
    // 生成队列
    if (this.queue.length === 0 || this.index >= this.queue.length) {
      const learnedSet = new Set(d.todayLearned);
      const available = WORD_BANK.map((_, i) => i).filter(i => !learnedSet.has(i));
      const shuffled = shuffle(available);
      if (d.todayCheckedIn) {
        // 额外学习模式：选一批新词
        this.queue = shuffled.slice(0, d.dailyGoal);
      } else {
        const remaining = d.dailyGoal - d.todayLearned.length;
        this.queue = shuffled.slice(0, remaining);
      }
      this.index = 0;
    }
    this.showWord();
  },"""
assert old in html, "FAIL 8: Learn.init() not found"
html = html.replace(old, new, 1)
changes.append("8. Updated Learn.init() (no auto-reset, extra learning support)")

# ── 9. Update Learn.showWord() progress display ──
old = """    const learned = d.todayLearned.length;
    const total = d.dailyGoal;
    document.getElementById('learnBar').style.width = (learned / total * 100) + '%';
    document.getElementById('learnCount').textContent = '第 ' + (learned + 1) + ' / ' + total + ' 词';"""
new = """    const learned = d.todayLearned.length;
    const total = d.dailyGoal;
    if (d.todayCheckedIn) {
      document.getElementById('learnBar').style.width = '100%';
      document.getElementById('learnCount').textContent = '额外学习 · 第 ' + (this.index + 1) + ' 词';
    } else {
      document.getElementById('learnBar').style.width = (learned / total * 100) + '%';
      document.getElementById('learnCount').textContent = '第 ' + (learned + 1) + ' / ' + total + ' 词';
    }"""
assert old in html, "FAIL 9: Learn.showWord() progress not found"
html = html.replace(old, new, 1)
changes.append("9. Updated Learn.showWord() progress display")

# ── 10. Update Learn.complete() ──
old = """  complete() {
    const d = Store.data;
    // 归档为昨日词库(供考核使用)
    d.yesterdayBank = [...new Set([...d.yesterdayBank, ...d.todayLearned])];
    d.lastCompleteDate = todayStr();
    d.streak++;
    // 成长值 +5
    Pet.addGrowth(5);
    // 复活打卡进度
    if (d.petDead) {
      d.revivalStreak++;
    }
    Store.save();
    // 显示完成动画 (浅色=撒花, 深色=烟花)
    Pages.show('home');
    CompletionAnim.show('🌱 成长值 +5');
  },"""
new = """  complete() {
    const d = Store.data;
    // 归档为昨日词库(供考核使用)
    d.yesterdayBank = [...new Set([...d.yesterdayBank, ...d.todayLearned])];
    if (!d.todayCheckedIn) {
      // 首次完成今日打卡
      d.todayCheckedIn = true;
      d.lastCompleteDate = todayStr();
      d.streak++;
      // 记录当日数据
      d.dayRecords.push({
        date: todayStr(),
        day: d.streak,
        wordCount: d.todayLearned.length,
        words: [...d.todayLearned],
        errors: [...d.normalErrors.map(e => e.idx), ...d.keyErrors.map(e => e.idx)]
      });
      // 成长值 +5
      Pet.addGrowth(5);
      // 复活打卡进度
      if (d.petDead) d.revivalStreak++;
      Store.save();
      // 显示完成动画
      Pages.show('home');
      CompletionAnim.show('🌱 成长值 +5 · 🔥 连续打卡 ' + d.streak + ' 天');
    } else {
      // 额外学习完成 — 简单提示
      Store.save();
      Pages.show('home');
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--card-bg);border:3px solid var(--candy-green);border-radius:20px;padding:20px 40px;font-size:18px;font-weight:700;color:var(--candy-green);z-index:99999;box-shadow:0 8px 30px rgba(0,0,0,0.2);';
      toast.textContent = '🎉 本批额外学习完成！';
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2000);
    }
  },"""
assert old in html, "FAIL 10: Learn.complete() not found"
html = html.replace(old, new, 1)
changes.append("10. Updated Learn.complete() (day record, streak, extra learning)")

# ── 11. Update Pages.refreshHome() ──
old = """  refreshHome() {
    // 每次回首页时重新检查日期(防止跨天)
    dailyReset();
    const d = Store.data;
    const learned = d.todayLearned.length;
    const goal = d.dailyGoal;
    document.getElementById('learnProgressText').textContent = learned + ' / ' + goal;
    document.getElementById('learnProgressBar').style.width = (learned/goal*100) + '%';
    document.getElementById('totalLearned').textContent = d.totalLearned;
    document.getElementById('levelNum').textContent = Math.floor(d.totalLearned / 50) + 1;
    const streakEl = document.getElementById('streakNum');
    if (streakEl) streakEl.textContent = d.streak;

    // 更新欢迎页恐龙图片
    const dinoWrap = document.getElementById('welcomeDino');
    if (dinoWrap) {
      const imgPath = DINO_IMG.get(d.petStage, d.petDead);
      const filter = d.petDead ? 'filter:grayscale(1);opacity:0.5;' : '';
      dinoWrap.innerHTML = '<img src="' + imgPath + '" style="' + filter + '">';
    }

    // 考核按钮状态 - 随时可考，不受限
    const btnQuiz = document.getElementById('btnStartQuiz');
    const lockInfo = document.getElementById('quizLockInfo');
    const hasKey = d.keyErrors.length > 0;
    const hasNormal = d.normalErrors.length > 0;
    const hasYesterday = d.yesterdayBank.length > 0;
    if (hasKey || hasNormal || hasYesterday) {
      btnQuiz.disabled = false;
      const parts = [];
      if (hasKey) parts.push('重点错题 ' + d.keyErrors.length);
      if (hasNormal) parts.push('普通错题 ' + d.normalErrors.length);
      if (hasYesterday) parts.push('昨日新词 ' + d.yesterdayBank.length);
      lockInfo.textContent = '🔥 考核词库已就绪（' + parts.join(' · ') + '）';
      lockInfo.style.color = 'var(--candy-green)';
    } else {
      btnQuiz.disabled = true;
      lockInfo.textContent = '请先背诵一些单词，之后就可以来考核啦~';
      lockInfo.style.color = 'var(--text-3)';
    }

    // 开始学习按钮
    const btnLearn = document.getElementById('btnStartLearn');
    if (learned >= goal) {
      btnLearn.textContent = '📖 继续学习 (已背' + learned + '词)';
    } else {
      btnLearn.textContent = '📖 继续背单词 (' + (goal - learned) + '词)';
    }
    btnLearn.disabled = false;

    Pet.update();
  }"""
new = """  refreshHome() {
    // 每次回首页时重新检查日期(防止跨天)
    dailyReset();
    const d = Store.data;

    // 更新连续打卡天数
    const streakEl = document.getElementById('streakNum');
    if (streakEl) streakEl.textContent = d.streak;

    // 更新欢迎页恐龙图片
    const dinoWrap = document.getElementById('welcomeDino');
    if (dinoWrap) {
      const imgPath = DINO_IMG.get(d.petStage, d.petDead);
      const filter = d.petDead ? 'filter:grayscale(1);opacity:0.5;' : '';
      dinoWrap.innerHTML = '<img src="' + imgPath + '" style="' + filter + '">';
    }

    // 渲染打卡地图
    DayMap.render();

    Pet.update();
  }"""
assert old in html, "FAIL 11: Pages.refreshHome() not found"
html = html.replace(old, new, 1)
changes.append("11. Updated Pages.refreshHome() (simplified, added DayMap.render)")

# ── 12. Add DayMap module before Learn module ──
old = "};\n\n// ============ 背单词模块 ============"
new = """};

// ============ 打卡地图模块 ============
const DayMap = {
  render() {
    const d = Store.data;
    const container = document.getElementById('streakMap');
    if (!container) return;

    const completed = d.dayRecords.length;
    const todayDone = d.todayCheckedIn;
    const totalNodes = Math.max(completed + (todayDone ? 5 : 6), 10);
    const perRow = 5;

    var html = '';
    for (var i = 0; i < totalNodes; i++) {
      var row = Math.floor(i / perRow);
      var posInRow = i % perRow;
      var isEvenRow = row % 2 === 0;

      // Row start
      if (posInRow === 0) {
        if (row > 0) {
          var sepDone = (i - 1) < completed || ((i - 1) === completed && todayDone);
          html += '<div class="map-row-separator' + (sepDone ? ' completed' : '') + '"></div>';
        }
        html += '<div class="map-row' + (isEvenRow ? '' : ' reverse') + '">';
      }

      // Connector before node (except first in row)
      if (posInRow > 0) {
        var prevIdx = i - 1;
        var connDone = prevIdx < completed || (prevIdx === completed && todayDone);
        html += '<div class="map-connector' + (connDone ? ' completed' : '') + '"></div>';
      }

      // Determine node state
      var state, label, icon, clickable = false;
      if (i < completed) {
        state = 'completed';
        label = 'Day ' + (i + 1);
        icon = String(i + 1);
        clickable = true;
      } else if (i === completed && !todayDone) {
        state = 'current';
        label = '今天';
        icon = '\\uD83C\\uDFAF';
      } else {
        state = 'locked';
        label = '';
        icon = '\\uD83D\\uDD12';
      }

      html += '<div class="map-node ' + state + '"' +
              (clickable ? ' onclick="DayMap.showDetail(' + i + ')"' : '') + '>' +
              '<div class="node-icon">' + icon + '</div>' +
              (label ? '<div class="node-label">' + label + '</div>' : '') +
              '</div>';

      // Row end
      if (posInRow === perRow - 1 || i === totalNodes - 1) {
        html += '</div>';
      }
    }

    container.innerHTML = html;
  },

  showDetail(dayIndex) {
    const d = Store.data;
    const record = d.dayRecords[dayIndex];
    if (!record) return;

    document.getElementById('detailDay').textContent = '\\u7B2C ' + record.day + ' \\u5929';
    document.getElementById('detailDate').textContent = record.date;
    document.getElementById('detailWordCount').textContent = record.wordCount;

    // Word list
    var wordHtml = '';
    record.words.forEach(function(idx) {
      var w = WORD_BANK[idx];
      if (w) {
        wordHtml += '<div class="detail-word"><span class="dw-en">' + w.w + '</span><span class="dw-zh">' + w.m + '</span></div>';
      }
    });
    document.getElementById('detailWordList').innerHTML = wordHtml || '<p class="empty">\\u6682\\u65E0\\u5355\\u8BCD</p>';

    // Error list
    var errorHtml = '';
    if (record.errors && record.errors.length > 0) {
      var uniqueErrors = [];
      var seen = {};
      record.errors.forEach(function(idx) {
        if (!seen[idx]) { seen[idx] = true; uniqueErrors.push(idx); }
      });
      uniqueErrors.forEach(function(idx) {
        var w = WORD_BANK[idx];
        if (w) {
          errorHtml += '<div class="detail-word error"><span class="dw-en">' + w.w + '</span><span class="dw-zh">' + w.m + '</span></div>';
        }
      });
    }
    document.getElementById('detailErrorList').innerHTML = errorHtml || '<p class="empty">\\u5F53\\u5929\\u65E0\\u9519\\u9898 \\u2728</p>';

    openModal('modal-day-detail');
  }
};

// ============ 背单词模块 ============"""
assert old in html, "FAIL 12: Learn module marker not found"
html = html.replace(old, new, 1)
changes.append("12. Added DayMap module")

# ── 13. Update startNewBatch (safe-ify) ──
old = """  startNewBatch() {
    const d = Store.data;
    d.todayLearned = [];
    this.queue = [];
    this.index = 0;
    Store.save();
    Pages.show('learn');
    this.init();
  }"""
new = """  startNewBatch() {
    // 已打卡后继续学习：不清空 todayLearned（保留打卡记录）
    this.queue = [];
    this.index = 0;
    Pages.show('learn');
    this.init();
  }"""
assert old in html, "FAIL 13: startNewBatch not found"
html = html.replace(old, new, 1)
changes.append("13. Updated startNewBatch (no longer resets todayLearned)")

# ── Write output ──
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)

print("All " + str(len(changes)) + " changes applied!")
for c in changes:
    print("  + " + c)
