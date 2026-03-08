// ═══════════════════════════════════════════════════════════════
//  JAPANESE SMART TRAINER v3  —  app.js
//  Scoring: Remember=+5 | Forgot=-2 | MCQ-correct=+3 | MCQ-wrong=-5
// ═══════════════════════════════════════════════════════════════

const SK = 'jst_v3';

var allWords         = [];
var progress         = null;
var currentMode      = 'study';

// Study
var studyQueue       = [];
var studyIndex       = 0;
var studyExpanded    = {};

// Exam
var examWords        = [];
var examIndex        = 0;
var examStimType     = '';   // 'jp'|'en'|'te'|'sound'
var examSessionScore = 0;

// ── Floating kanji chars ──────────────────────────────────────
var KANJI = ['水','火','木','山','川','日','月','花','愛','心','力','夢','空','海','光','星','猫','犬','学','食'];
function initBgKanji() {
  var c = document.getElementById('bgKanji');
  for (var i = 0; i < 10; i++) spawnKanji(c, i * 2.5);
}
function spawnKanji(c, delay) {
  var el = document.createElement('div');
  el.className = 'bk';
  el.textContent = KANJI[Math.floor(Math.random() * KANJI.length)];
  el.style.left             = (Math.random() * 100) + 'vw';
  el.style.fontSize         = (50 + Math.random() * 70) + 'px';
  el.style.animationDuration= (18 + Math.random() * 18) + 's';
  el.style.animationDelay   = delay + 's';
  el.style.color = ['var(--primary)','var(--secondary)','var(--accent)','var(--purple)'][Math.floor(Math.random()*4)];
  c.appendChild(el);
  el.addEventListener('animationend', function() {
    el.textContent = KANJI[Math.floor(Math.random() * KANJI.length)];
    el.style.left  = (Math.random() * 100) + 'vw';
    el.style.animationDelay = '0s';
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
    el.style.animationDuration = (18 + Math.random() * 18) + 's';
  });
}

// ── Card mouse-tilt (desktop) ─────────────────────────────────
function initTilt(wrap, card) {
  wrap.addEventListener('mousemove', function(e) {
    var r  = wrap.getBoundingClientRect();
    var x  = (e.clientX - r.left) / r.width  - 0.5;
    var y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = 'perspective(1200px) rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) scale(1.018)';
    card.style.transition = 'transform .1s ease';
  });
  wrap.addEventListener('mouseleave', function() {
    card.style.transform = '';
    card.style.transition = 'transform .45s ease';
  });
}

// ── INIT ─────────────────────────────────────────────────────
async function init() {
  initBgKanji();
  try {
    var res = await fetch('words.json');
    if (!res.ok) throw new Error('HTTP ' + res.status + ' — Cannot load words.json');
    var data = await res.json();
    allWords = data.words;
    loadProgress();
    mergeNewWords();
    updateHeaderScore();
    buildStudyQueue();
    renderStudyMode();
  } catch(e) {
    document.getElementById('mainArea').innerHTML =
      '<div class="err"><div style="font-size:48px;margin-bottom:10px;">⚠️</div>' +
      '<strong>Cannot load words.json</strong><pre>' + e.message + '</pre>' +
      '<p style="margin-top:10px;">Run: <code>npx serve .</code></p>' +
      '<p>Open: <code>http://localhost:3000</code></p></div>';
  }
}

// ── PERSISTENCE ──────────────────────────────────────────────
function loadProgress() {
  try {
    var r = localStorage.getItem(SK);
    if (r) { progress = JSON.parse(r); return; }
  } catch(e) {}
  progress = { user:'local_user', total_score:0, last_exam_word_ids:[], words:[] };
}
function saveProgress() { localStorage.setItem(SK, JSON.stringify(progress)); }

function mergeNewWords() {
  var changed = false;
  allWords.forEach(function(w) {
    if (!progress.words.find(function(p){ return p.word_id === w.id; })) {
      progress.words.push({ word_id:w.id, score:0, correct_count:0, wrong_count:0, status:'new', weight:5, last_seen:'' });
      changed = true;
    }
  });
  if (changed) saveProgress();
}

function getP(id) { return progress.words.find(function(p){ return p.word_id === id; }) || null; }
function todayStr() { return new Date().toISOString().split('T')[0]; }

// ── SCORING ──────────────────────────────────────────────────
// result: 'correct_no_reveal'(+5) | 'forgot'(-2) | 'correct_options'(+3) | 'wrong_options'(-5)
var SCORES = { correct_no_reveal:+5, forgot:-2, correct_options:+3, wrong_options:-5 };
function applyScore(wordId, result) {
  var p = getP(wordId); if (!p) return 0;
  p.last_seen = todayStr();
  var delta = SCORES[result] || 0;
  if (result === 'correct_no_reveal') { p.correct_count++; p.weight = Math.max(1, p.weight-1); }
  else if (result === 'correct_options') { p.correct_count++; }
  else { p.wrong_count++; p.weight += 2; }
  p.score              += delta;
  progress.total_score += delta;
  examSessionScore     += delta;
  p.status = p.score >= 10 ? 'strong' : 'learning';
  saveProgress();
  updateHeaderScore();
  return delta;
}

// ── STUDY QUEUE — weakest first ───────────────────────────────
function buildStudyQueue() {
  studyQueue = allWords.slice().sort(function(a, b) {
    return (getP(a.id)?.score || 0) - (getP(b.id)?.score || 0);
  });
  studyIndex = 0;
}

// ── EXAM WORDS ────────────────────────────────────────────────
function buildExamWords(count) {
  count = count || Math.min(10, allWords.length);
  var last = new Set(progress.last_exam_word_ids);
  var bk = { n:[], w:[], l:[], s:[] };
  allWords.forEach(function(w) {
    if (last.has(w.id)) return;
    var p = getP(w.id); if (!p) return;
    if      (p.status === 'new' || p.score === 0) bk.n.push(w);
    else if (p.score < 0)                         bk.w.push(w);
    else if (p.score <= 4)                        bk.l.push(w);
    else                                          bk.s.push(w);
  });
  function pick(arr, n) { return arr.slice().sort(function(){ return Math.random()-.5; }).slice(0, n); }
  var sel = [].concat(
    pick(bk.n, Math.round(count*.35)), pick(bk.w, Math.round(count*.35)),
    pick(bk.l, Math.round(count*.15)), pick(bk.s, Math.round(count*.05))
  );
  if (sel.length < count) {
    var ids = new Set(sel.map(function(w){ return w.id; }));
    sel = sel.concat(pick(allWords.filter(function(w){ return !last.has(w.id) && !ids.has(w.id); }), count - sel.length));
  }
  return sel.length ? sel.sort(function(){ return Math.random()-.5; }) : allWords.slice(0, count);
}

// ── MODE SWITCH ───────────────────────────────────────────────
function switchMode(m) {
  currentMode = m;
  document.getElementById('btnStudy').classList.toggle('active', m === 'study');
  document.getElementById('btnExam') .classList.toggle('active', m === 'exam');
  if (m === 'study') { buildStudyQueue(); renderStudyMode(); }
  else startExam();
}

// ═══════════════════════════════════════════════════════════════
//  STUDY MODE
// ═══════════════════════════════════════════════════════════════
function renderStudyMode() {
  document.getElementById('navBar').style.display = 'flex';
  renderStudyCard();
  updateNavBar();
}

function studyNav(dir) {
  var n = studyIndex + dir;
  if (n < 0 || n >= studyQueue.length) return;
  studyIndex = n;
  renderStudyCard();
  updateNavBar();
}

function updateNavBar() {
  document.getElementById('navInfo').textContent = (studyIndex+1) + ' / ' + studyQueue.length;
  document.getElementById('btnPrev').disabled = studyIndex === 0;
  document.getElementById('btnNext').disabled = studyIndex === studyQueue.length - 1;
}

function toggleStudyExpand(id) {
  studyExpanded[id] = !studyExpanded[id];
  renderStudyCard();
}

function renderStudyCard() {
  var word = studyQueue[studyIndex];
  if (!word) { document.getElementById('mainArea').innerHTML = '<div class="empty">📭 No words loaded.</div>'; return; }
  document.getElementById('mainArea').innerHTML = buildStudyCardHTML(word, getP(word.id), studyExpanded[word.id]||false);
  var wrap = document.getElementById('sw_'+word.id);
  var card = wrap && wrap.querySelector('.study-card');
  if (wrap && card) initTilt(wrap, card);
}

function buildStudyCardHTML(word, p, exp) {
  var sc  = {new:'s-new',learning:'s-learning',strong:'s-strong'}[p.status] || 's-new';
  var sl  = {new:'🆕 New',learning:'📈 Learning',strong:'⭐ Strong'}[p.status] || 'New';
  var clr = p.score <= 0 ? 'var(--red)' : p.score <= 4 ? 'var(--yellow)' : 'var(--green)';
  var bar = Math.min(100, Math.max(0, (p.score/10)*100));
  var ss  = (word.example_sentences||[]);

  var h =
    '<div class="s-card-wrap" id="sw_'+word.id+'">' +
    '<div class="study-card">' +
      '<div class="word-kanji" onclick="speak(\''+esc(word.japanese_word)+'\')">'+word.japanese_word+'</div>' +
      '<div class="word-reading"><span class="hiragana">'+word.hiragana+'</span><span class="romaji">'+word.romaji+'</span></div>' +
      '<button class="snd-btn" onclick="speak(\''+esc(word.japanese_word)+'\')">🔊 Listen</button>' +
      '<div class="meanings"><span class="tag-en">'+word.english_meaning+'</span><span class="tag-te">'+word.telugu_meaning+'</span></div>' +
      '<div class="te-pron">📢 '+word.telugu_pronunciation+'</div>' +
      '<div class="prog-row"><span class="sbadge '+sc+'">'+sl+'</span><span class="sc-tag">Score: '+p.score+' &nbsp;✅'+p.correct_count+' ❌'+p.wrong_count+'</span></div>' +
      '<div class="sc-bar-w"><div class="sc-bar-f" style="width:'+bar+'%;background:'+clr+';"></div></div>' +
      '<div class="divider"></div>' +
      '<div class="sec-lbl">📝 Example Sentences</div>' +
      ss.slice(0,3).map(exHTML).join('');

  if (!exp) {
    h += '<button class="exp-btn" onclick="toggleStudyExpand('+word.id+')">▼ Show letter breakdown, all sentences & notes</button>';
  } else {
    if (ss.length > 3) h += ss.slice(3).map(exHTML).join('');
    h += '<div class="divider"></div>';
    if (word.letter_breakdown && word.letter_breakdown.length) {
      h += '<div class="sec-lbl">🔤 Letter Breakdown</div><div class="ltr-grid">' +
        word.letter_breakdown.map(function(l){
          return '<div class="ltr-box"><span class="ltr-jp">'+l.letter+'</span><span class="ltr-te">'+l.telugu_sound+'</span></div>';
        }).join('') + '</div>';
    }
    if (word.description) {
      h += '<div class="divider"></div><div class="sec-lbl">💡 Notes</div><div class="desc">'+word.description+'</div>';
    }
    h += '<button class="exp-btn" onclick="toggleStudyExpand('+word.id+')">▲ Collapse</button>';
  }
  return h + '</div></div>';
}

function exHTML(s) {
  var bk = (s.word_breakdown && s.word_breakdown.length)
    ? '<div class="bk-wrap"><table class="bk-tbl"><thead><tr><th>Word</th><th>English</th><th>Telugu</th></tr></thead><tbody>' +
        s.word_breakdown.map(function(w){ return '<tr><td>'+w.word+'</td><td>'+w.meaning_en+'</td><td>'+w.meaning_te+'</td></tr>'; }).join('') +
      '</tbody></table></div>' : '';
  return '<div class="ex-card">' +
    '<div class="ex-jp">'+s.sentence+'</div>' +
    '<div class="ex-rom">'+s.romaji+'</div>' +
    '<div class="ex-te">📢 '+s.telugu_pronunciation+'</div>' +
    '<div class="ex-row"><span class="ex-en">🇺🇸 '+s.english_meaning+'</span><span class="ex-te2">🇮🇳 '+s.telugu_meaning+'</span></div>' +
    '<div class="ex-foot">' +
      (bk ? '<button class="smr-btn" onclick="toggleBD(this)">▼ Word breakdown</button>' : '<span></span>') +
      '<button class="ex-snd" onclick="speak(\''+esc(s.sentence)+'\')">🔊</button>' +
    '</div>' + bk + '</div>';
}

function toggleBD(btn) {
  var bw = btn.closest('.ex-card').querySelector('.bk-wrap');
  if (!bw) return;
  var show = bw.style.display === 'block';
  bw.style.display = show ? 'none' : 'block';
  btn.textContent  = show ? '▼ Word breakdown' : '▲ Hide breakdown';
}

// ═══════════════════════════════════════════════════════════════
//  EXAM MODE
// ═══════════════════════════════════════════════════════════════
function startExam() {
  examWords        = buildExamWords();
  examIndex        = 0;
  examSessionScore = 0;
  document.getElementById('navBar').style.display = 'none';
  renderExamQuestion();
}

function renderExamQuestion() {
  if (examIndex >= examWords.length) { renderExamComplete(); return; }

  var word = examWords[examIndex];
  var p    = getP(word.id);

  // ── Pick ONE stimulus type ────────────────────────────────
  var pool = ['jp','en','te'];
  if (p && p.score >= 3) pool.push('sound');
  examStimType = pool[Math.floor(Math.random() * pool.length)];

  var pct      = Math.round((examIndex / examWords.length) * 100);
  var sb       = {new:'s-new',learning:'s-learning',strong:'s-strong'}[p?.status||'new'] || 's-new';
  var promptTxt = '';
  var frontInner = '';

  if (examStimType === 'jp') {
    // ── JP: show all 4 fields on front face ──────────────────
    promptTxt  = 'What does this mean?';
    frontInner =
      '<div class="q-kanji">'+word.japanese_word+'</div>' +
      '<div class="q-hira">'+word.hiragana+'</div>' +
      '<div class="q-rom">'+word.romaji+'</div>' +
      '<div class="q-tepron">📢 '+word.telugu_pronunciation+'</div>' +
      '<button class="snd-btn" onclick="speak(\''+esc(word.japanese_word)+'\')" style="margin:10px auto 0;">🔊 Listen</button>';
  } else if (examStimType === 'en') {
    promptTxt  = 'What is the Japanese word?';
    frontInner = '<div class="q-single">'+word.english_meaning+'</div>';
  } else if (examStimType === 'te') {
    promptTxt  = 'What is the Japanese word?';
    frontInner = '<div class="q-single q-te">'+word.telugu_meaning+'</div>';
  } else {
    promptTxt  = 'What word did you hear?';
    frontInner =
      '<div style="font-size:64px;margin-bottom:12px;">🔊</div>' +
      '<button class="snd-btn" onclick="speak(\''+esc(word.japanese_word)+'\')" style="margin:0 auto;">▶ Play Again</button>';
    setTimeout(function(){ speak(word.japanese_word); }, 450);
  }

  document.getElementById('mainArea').innerHTML =
    // Progress header
    '<div class="ex-header">' +
      '<div class="ex-meta">' +
        '<span>Question '+(examIndex+1)+' of '+examWords.length+'</span>' +
        '<span class="sbadge '+sb+'">'+(p?.status||'new')+'</span>' +
      '</div>' +
      '<div class="ex-pbar"><div class="ex-pfill" style="width:'+pct+'%"></div></div>' +
    '</div>' +

    // 3D flip card
    '<div class="flip-scene" id="flipScene">' +
      '<div class="flip-card" id="flipCard">' +
        '<div class="flip-face flip-front" id="flipFront">' +
          '<div class="q-label">'+promptTxt+'</div>' +
          frontInner +
        '</div>' +
        '<div class="flip-face flip-back" id="flipBack"></div>' +
      '</div>' +
    '</div>' +

    // Action buttons
    '<div class="exam-btns" id="examBtns">' +
      '<div class="btn-row">' +
        '<button class="ebtn eg" onclick="examRemember()">✅ I Remember</button>' +
        '<button class="ebtn er" onclick="examForgot()">❌ I Forgot</button>' +
      '</div>' +
      '<button class="ebtn eb" onclick="examMCQ()">📋 MCQ Options</button>' +
      '<div class="score-hint">' +
        '<span class="sh-g">Remember → +5</span>' +
        '<span class="sh-r">Forgot → −2</span>' +
        '<span class="sh-b">MCQ ✅ → +3 &nbsp;/&nbsp; ❌ → −5</span>' +
      '</div>' +
    '</div>';
}

// ── Flip helpers ──────────────────────────────────────────────
function flipToAnswer(word, isWrong) {
  var back = document.getElementById('flipBack');
  if (!back) return;
  back.className = 'flip-face flip-back' + (isWrong ? ' wrong-back' : '');
  back.innerHTML =
    '<div class="ans-kanji">'+word.japanese_word+'</div>' +
    '<div class="ans-hira">'+word.hiragana+' &nbsp;•&nbsp; '+word.romaji+'</div>' +
    '<button class="snd-btn" onclick="speak(\''+esc(word.japanese_word)+'\')" style="margin:8px auto;">🔊 Listen</button>' +
    '<div class="ans-means"><span class="tag-en">'+word.english_meaning+'</span><span class="tag-te">'+word.telugu_meaning+'</span></div>' +
    '<div class="ans-pron">📢 '+word.telugu_pronunciation+'</div>';

  // Flip
  setTimeout(function(){
    var fc = document.getElementById('flipCard');
    if (fc) fc.classList.add('flipped');
  }, 60);
}

// ── I REMEMBER: flip → confirm ────────────────────────────────
function examRemember() {
  var word = examWords[examIndex];
  flipToAnswer(word, false);
  document.getElementById('examBtns').innerHTML =
    '<div class="confirm-area">' +
      '<div class="confirm-hint">Did you actually remember it correctly?</div>' +
      '<div class="btn-row">' +
        '<button class="ebtn eg" onclick="examConfirm(true)">✅ Yes! I was right (+5)</button>' +
        '<button class="ebtn er" onclick="examConfirm(false)">❌ No, I was wrong (−2)</button>' +
      '</div>' +
    '</div>';
}

function examConfirm(wasRight) {
  var word  = examWords[examIndex];
  var delta = applyScore(word.id, wasRight ? 'correct_no_reveal' : 'forgot');
  screenFlash(wasRight);
  showToast(delta);
  if (wasRight) spawnConfetti();
  setTimeout(examNext, 950);
}

// ── I FORGOT: score −2, flip, next ────────────────────────────
function examForgot() {
  var word  = examWords[examIndex];
  var delta = applyScore(word.id, 'forgot');
  flipToAnswer(word, true);
  showToast(delta);
  screenFlash(false);
  document.getElementById('examBtns').innerHTML =
    '<div class="confirm-area">' +
      '<div class="confirm-hint wrong">Study this one! Score −2</div>' +
      '<button class="ebtn egh" style="margin-top:8px;" onclick="examNext()">→ Next Word</button>' +
    '</div>';
}

// ── MCQ: show 4 options, NO answer shown first ─────────────────
function examMCQ() {
  var word = examWords[examIndex];
  document.getElementById('examBtns').style.display = 'none';

  var dist = allWords.filter(function(w){ return w.id !== word.id; })
                     .sort(function(){ return Math.random()-.5; }).slice(0, 3);
  var opts = dist.concat([word]).sort(function(){ return Math.random()-.5; });

  // If JP was shown → test the meaning → options = EN+TE
  // If EN/TE/sound shown → test JP word → options = kanji + romaji
  var testMeaning = (examStimType === 'jp');

  var grid = opts.map(function(opt) {
    var label = testMeaning
      ? '<span class="mopt-en">'+opt.english_meaning+'</span><span class="mopt-te">'+opt.telugu_meaning+'</span>'
      : '<span class="mopt-jp">'+opt.japanese_word+'</span><span class="mopt-rom">'+opt.romaji+'</span>';
    return '<button class="mopt" id="mo_'+opt.id+'" onclick="pickMCQ('+opt.id+','+word.id+')">'+label+'</button>';
  }).join('');

  var mcqDiv = document.createElement('div');
  mcqDiv.className = 'mcq-area';
  mcqDiv.innerHTML = '<div class="mcq-label">Choose the correct answer:</div><div class="mcq-grid">'+grid+'</div>';
  document.getElementById('mainArea').appendChild(mcqDiv);
}

function pickMCQ(selectedId, correctId) {
  // Disable all
  document.querySelectorAll('.mopt').forEach(function(b){ b.style.pointerEvents='none'; });
  // Highlight
  document.querySelectorAll('.mopt').forEach(function(btn){
    var id = parseInt(btn.id.replace('mo_',''));
    if (id === correctId)                    btn.classList.add('c');
    if (id === selectedId && id !== correctId) btn.classList.add('w');
  });

  var correct = selectedId === correctId;
  var word    = examWords[examIndex];
  var result  = correct ? 'correct_options' : 'wrong_options';
  var delta   = applyScore(word.id, result);

  showToast(delta);
  screenFlash(correct);
  if (correct) spawnConfetti();
  flipToAnswer(word, !correct);
  setTimeout(examNext, 1600);
}

function examNext() {
  examIndex++;
  renderExamQuestion();
}

// ── EXAM COMPLETE ─────────────────────────────────────────────
function renderExamComplete() {
  progress.last_exam_word_ids = examWords.map(function(w){ return w.id; });
  saveProgress();
  spawnConfetti(); spawnConfetti(); spawnConfetti();

  var total  = allWords.length;
  var strong = progress.words.filter(function(p){ return p.status==='strong'; }).length;
  var newW   = progress.words.filter(function(p){ return p.status==='new';    }).length;
  var learn  = total - strong - newW;

  document.getElementById('mainArea').innerHTML =
    '<div class="complete">' +
      '<span class="c-icon">🏆</span>' +
      '<div class="c-title">Exam Complete!</div>' +
      '<div class="c-sub">'+examWords.length+' words &nbsp;·&nbsp; Session: <strong style="color:var(--yellow);">'+(examSessionScore>=0?'+':'')+examSessionScore+'</strong></div>' +
      '<div class="stats-g">' +
        '<div class="stat-box"><span class="stat-val" style="color:var(--green);">'+strong+'</span><span class="stat-lbl">Strong ⭐</span></div>' +
        '<div class="stat-box"><span class="stat-val" style="color:var(--accent);">'+learn+ '</span><span class="stat-lbl">Learning 📈</span></div>' +
        '<div class="stat-box"><span class="stat-val" style="color:var(--purple);">'+newW+  '</span><span class="stat-lbl">New 🆕</span></div>' +
      '</div>' +
      '<button class="big-btn" onclick="startExam()">🔄 New Exam</button>' +
      '<button class="big-btn ghost" onclick="switchMode(\'study\')">📚 Study Mode</button>' +
    '</div>';
  document.getElementById('navBar').style.display = 'none';
  updateHeaderScore();
}

// ── SCREEN FLASH ─────────────────────────────────────────────
function screenFlash(good) {
  var ov = document.getElementById('flashOv');
  ov.className = good ? 'flash-g' : 'flash-r';
  setTimeout(function(){ ov.className = ''; }, 350);
}

// ── CONFETTI ─────────────────────────────────────────────────
var COLORS = ['#e63946','#2a9d8f','#e9c46a','#457b9d','#f4a261','#9b59b6','#fff','#ff6b6b','#4ecdc4'];
function spawnConfetti() {
  for (var i = 0; i < 28; i++) {
    (function(){
      var el = document.createElement('div');
      el.className = 'conf';
      el.style.left              = (Math.random()*100)+'vw';
      el.style.background        = COLORS[Math.floor(Math.random()*COLORS.length)];
      el.style.animationDuration = (.8+Math.random()*.9)+'s';
      el.style.animationDelay    = (Math.random()*.4)+'s';
      el.style.borderRadius      = Math.random()>.5?'50%':'3px';
      el.style.width  = (7+Math.random()*8)+'px';
      el.style.height = el.style.width;
      el.style.transform = 'rotate('+Math.floor(Math.random()*360)+'deg)';
      document.body.appendChild(el);
      setTimeout(function(){ el.remove(); }, 2000);
    })();
  }
}

// ── HEADER SCORE ─────────────────────────────────────────────
function updateHeaderScore() {
  var pill = document.getElementById('scorePill');
  pill.textContent = '⭐ ' + progress.total_score;
  pill.classList.add('bump');
  setTimeout(function(){ pill.classList.remove('bump'); }, 350);
}

// ── SOUND ────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP'; u.rate = 0.85;
  var v = window.speechSynthesis.getVoices().filter(function(v){ return v.lang.startsWith('ja'); });
  if (v.length) u.voice = v[0];
  window.speechSynthesis.speak(u);
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(delta) {
  document.querySelectorAll('.toast').forEach(function(t){ t.remove(); });
  var el = document.createElement('div');
  el.className = 'toast ' + (delta >= 0 ? 'pos' : 'neg');
  el.textContent = delta >= 0 ? '+'+delta : String(delta);
  document.body.appendChild(el);
  setTimeout(function(){ el.remove(); }, 1800);
}

// ── SWIPE ────────────────────────────────────────────────────
var tx=0, ty=0;
document.addEventListener('touchstart', function(e){ tx=e.changedTouches[0].screenX; ty=e.changedTouches[0].screenY; },{passive:true});
document.addEventListener('touchend',   function(e){
  if (currentMode!=='study') return;
  var dx=e.changedTouches[0].screenX-tx, dy=e.changedTouches[0].screenY-ty;
  if (Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>45){ if(dx<0)studyNav(1);else studyNav(-1); }
},{passive:true});

// ── ESCAPE ───────────────────────────────────────────────────
function esc(s){ return (s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }

// ── BOOT ─────────────────────────────────────────────────────
init();
