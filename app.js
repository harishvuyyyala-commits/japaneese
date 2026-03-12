// JAPANESE VOCABULARY TRAINER PRO - app.js

const SK = 'jpvocab_pro';
var allWords = [];
var progress = null;
var currentMode = 'study';

// Study
var studyQueue = [];
var studyIndex = 0;
var studyExpanded = {};
var currentFolder = null;

// Exam
var examWords = [];
var examIndex = 0;
var examStimType = 'jp'; // jp, en, te, sound
var examSessionScore = 0;
var examConfidenceMode = null; // 'remembered' or 'forgot'
var examWrongAnswers = [];
var examConfidenceErrors = [];
var examRepeatQueue = [];

// Floating kanji chars
var KANJI = ['語','学','習','試','験','単','力','強','記','憶','音','声','文','字','意','味','練','読','書','聞'];

function initBgKanji() {
    var c = document.getElementById('bgKanji');
    for (var i = 0; i < 10; i++) spawnKanji(c, i * 2.5);
}

function spawnKanji(c, delay) {
    var el = document.createElement('div');
    el.className = 'bk';
    el.textContent = KANJI[Math.floor(Math.random() * KANJI.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (50 + Math.random() * 70) + 'px';
    el.style.animationDuration = (18 + Math.random() * 18) + 's';
    el.style.animationDelay = delay + 's';
    el.style.color = ['var(--primary)','var(--secondary)','var(--accent)','var(--purple)'][Math.floor(Math.random()*4)];
    c.appendChild(el);
    el.addEventListener('animationend', function() {
        el.textContent = KANJI[Math.floor(Math.random() * KANJI.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDelay = '0s';
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = '';
        el.style.animationDuration = (18 + Math.random() * 18) + 's';
    });
}

// Card mouse-tilt (desktop)
function initTilt(wrap, card) {
    wrap.addEventListener('mousemove', function(e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1200px) rotateY(' + (x*14) + 'deg) rotateX(' + (-y*14) + 'deg) scale(1.018)';
        card.style.transition = 'transform .1s ease';
    });
    wrap.addEventListener('mouseleave', function() {
        card.style.transform = '';
        card.style.transition = 'transform .45s ease';
    });
}

// INIT
async function init() {
    initBgKanji();
    try {
        var res = await fetch('words.json');
        if (!res.ok) throw new Error('HTTP ' + res.status + ': Cannot load words.json');
        var data = await res.json();
        allWords = data.words;
        loadProgress();
        mergeNewWords();
        updateHeaderScore();
        buildStudyQueue();
        renderFolderView();
    } catch(e) {
        document.getElementById('mainArea').innerHTML = '<div class="err"><div style="font-size:48px;margin-bottom:10px;">⚠</div><strong>Cannot load words.json</strong><pre>' + e.message + '</pre><p style="margin-top:10px;">Run <code>npx serve .</code></p><p>Open <code>http://localhost:3000</code></p></div>';
    }
}

// PERSISTENCE
function loadProgress() {
    try {
        var r = localStorage.getItem(SK);
        if (r) {
            progress = JSON.parse(r);
            return;
        }
    } catch(e) {}
    progress = {
        user: 'local_user',
        totalscore: 0,
        lastexamwordids: [],
        words: []
    };
}

function saveProgress() {
    localStorage.setItem(SK, JSON.stringify(progress));
}

function mergeNewWords() {
    var changed = false;
    allWords.forEach(function(w) {
        if (!progress.words.find(function(p) { return p.wordid === w.id; })) {
            progress.words.push({
                wordid: w.id,
                score: 0,
                correctcount: 0,
                wrongcount: 0,
                totalattempts: 0,
                lastseen: null,
                notes: '',
                important: false
            });
            changed = true;
        }
    });
    if (changed) saveProgress();
}

function getP(id) {
    return progress.words.find(function(p) { return p.wordid === id; }) || null;
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

// SCORING SYSTEM
// Score range: -50 to 100
// Confidence Remembered:
//   - Correct: +2 (type 1), +4 (type 2), +6 (type 3)
//   - Wrong: double penalty (-4, -8, -12)
// Confidence Forgot:
//   - Correct: half reward (+1, +2, +3)
//   - Wrong: normal penalty (-2, -4, -6)
//
// High score penalties:
//   - Score 100 wrong: reset to 40
//   - Score 75-99 wrong: -26
//   - Score 50-74 wrong: -10
//   - Below 50: normal rules

function applyScore(wordId, questionType, remembered, correct) {
    var p = getP(wordId);
    if (!p) return 0;

    p.lastseen = todayStr();
    p.totalattempts++;

    var baseReward = { jp: 2, en: 4, te: 4, sound: 6 }[questionType] || 2;
    var basePenalty = baseReward;

    var delta = 0;

    if (correct) {
        if (remembered) {
            delta = baseReward;
        } else {
            delta = Math.floor(baseReward / 2);
        }
        p.correctcount++;
    } else {
        if (remembered) {
            delta = -(basePenalty * 2);
        } else {
            delta = -basePenalty;
        }
        p.wrongcount++;

        // High score penalties
        if (p.score === 100) {
            p.score = 40;
            delta = 0;
        } else if (p.score >= 75 && p.score <= 99) {
            delta = -26;
        } else if (p.score >= 50 && p.score <= 74) {
            delta = -10;
        }
    }

    p.score += delta;
    if (p.score < -50) p.score = -50;
    if (p.score > 100) p.score = 100;

    progress.totalscore += delta;
    examSessionScore += delta;

    saveProgress();
    updateHeaderScore();
    return delta;
}

// CATEGORY SYSTEM
// New: score 0 and never attempted
// Worst: -50 to 10
// Needs Improvement: 10 to 30
// Good Going: 30 to 70
// Excellent: 70 to 100

function getCategory(p) {
    if (!p) return 'new';
    if (p.score === 0 && p.totalattempts === 0) return 'new';
    if (p.score >= -50 && p.score < 10) return 'worst';
    if (p.score >= 10 && p.score < 30) return 'improvement';
    if (p.score >= 30 && p.score < 70) return 'good';
    if (p.score >= 70 && p.score <= 100) return 'excellent';
    return 'new';
}

function getCategoryName(cat) {
    return {
        new: 'New Words',
        worst: 'Worst Words',
        improvement: 'Needs Improvement',
        good: 'Good Going',
        excellent: 'Excellent'
    }[cat] || 'Unknown';
}

function getCategoryDesc(cat) {
    return {
        new: 'Words you haven\'t studied yet',
        worst: 'Words that need urgent attention (Score -50 to 10)',
        improvement: 'Words that need practice (Score 10 to 30)',
        good: 'Words you\'re progressing well with (Score 30 to 70)',
        excellent: 'Words you know very well (Score 70 to 100)'
    }[cat] || '';
}

// STUDY QUEUE - sorted by priority
function buildStudyQueue() {
    studyQueue = allWords.slice().sort(function(a, b) {
        var pa = getP(a.id);
        var pb = getP(b.id);
        
        // Sort by: wrongcount DESC, then score ASC, then lastseen ASC
        var wa = pa ? pa.wrongcount : 0;
        var wb = pb ? pb.wrongcount : 0;
        if (wa !== wb) return wb - wa;

        var sa = pa ? pa.score : 0;
        var sb = pb ? pb.score : 0;
        if (sa !== sb) return sa - sb;

        var la = pa ? (pa.lastseen || '1970-01-01') : '1970-01-01';
        var lb = pb ? (pb.lastseen || '1970-01-01') : '1970-01-01';
        if (la < lb) return -1;
        if (la > lb) return 1;
        return 0;
    });
    studyIndex = 0;
}

// FOLDER VIEW
function renderFolderView() {
    var categories = ['new', 'worst', 'improvement', 'good', 'excellent'];
    var folderData = {};
    
    categories.forEach(function(cat) {
        folderData[cat] = [];
    });

    allWords.forEach(function(w) {
        var p = getP(w.id);
        var cat = getCategory(p);
        folderData[cat].push(w);
    });

    var html = '<div class="folders">';
    
    categories.forEach(function(cat) {
        var words = folderData[cat];
        var count = words.length;
        var icon = {
            new: '🆕',
            worst: '🔴',
            improvement: '🟡',
            good: '🟢',
            excellent: '⭐'
        }[cat];

        html += '<div class="folder" onclick="openFolder(\'' + cat + '\')">';
        html += '<div class="folder-header">';
        html += '<div class="folder-title">' + icon + ' ' + getCategoryName(cat) + '</div>';
        html += '<div class="folder-count">' + count + '</div>';
        html += '</div>';
        html += '<div class="folder-desc">' + getCategoryDesc(cat) + '</div>';
        html += '</div>';
    });

    html += '</div>';

    // Search box
    html += '<div class="search-box">';
    html += '<input type="text" class="search-input" id="searchInput" placeholder="🔍 Search Japanese, English, Telugu..." oninput="handleSearch()">';
    html += '</div>';
    html += '<div id="searchResults"></div>';

    document.getElementById('mainArea').innerHTML = html;
    document.getElementById('navBar').style.display = 'none';
}

function openFolder(category) {
    currentFolder = category;
    var words = allWords.filter(function(w) {
        return getCategory(getP(w.id)) === category;
    });

    if (words.length === 0) {
        document.getElementById('mainArea').innerHTML = '<div class="empty">No words in this category yet.</div><button class="big-btn" onclick="renderFolderView()" style="margin-top:20px;">← Back to Folders</button>';
        document.getElementById('navBar').style.display = 'none';
        return;
    }

    // Sort by priority within folder
    words.sort(function(a, b) {
        var pa = getP(a.id);
        var pb = getP(b.id);
        
        var wa = pa ? pa.wrongcount : 0;
        var wb = pb ? pb.wrongcount : 0;
        if (wa !== wb) return wb - wa;

        var sa = pa ? pa.score : 0;
        var sb = pb ? pb.score : 0;
        if (sa !== sb) return sa - sb;

        var la = pa ? (pa.lastseen || '1970-01-01') : '1970-01-01';
        var lb = pb ? (pb.lastseen || '1970-01-01') : '1970-01-01';
        if (la < lb) return -1;
        if (la > lb) return 1;
        return 0;
    });

    studyQueue = words;
    studyIndex = 0;
    renderStudyMode();
}

// SEARCH
function handleSearch() {
    var query = document.getElementById('searchInput').value.toLowerCase().trim();
    var resultsDiv = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }

    var matches = allWords.filter(function(w) {
        return (w.japanese_word && w.japanese_word.toLowerCase().includes(query)) ||
               (w.hiragana && w.hiragana.toLowerCase().includes(query)) ||
               (w.romaji && w.romaji.toLowerCase().includes(query)) ||
               (w.english_meaning && w.english_meaning.toLowerCase().includes(query)) ||
               (w.telugu_meaning && w.telugu_meaning.toLowerCase().includes(query)) ||
               (w.telugu_pronunciation && w.telugu_pronunciation.toLowerCase().includes(query));
    });

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="empty">No matches found</div>';
        return;
    }

    var html = '<div class="search-results">';
    matches.slice(0, 10).forEach(function(w) {
        var p = getP(w.id);
        var cat = getCategory(p);
        var badge = {
            new: '🆕',
            worst: '🔴',
            improvement: '🟡',
            good: '🟢',
            excellent: '⭐'
        }[cat];

        html += '<div class="search-card" onclick="openWordDetail(' + w.id + ')">';
        html += '<div class="search-word">' + (w.japanese_word || '') + ' ' + badge + '</div>';
        html += '<div class="search-meta">' + (w.hiragana || '') + ' • ' + (w.romaji || '') + '</div>';
        html += '<div class="meanings">';
        html += '<span class="tag-en">' + (w.english_meaning || '') + '</span>';
        html += '<span class="tag-te">' + (w.telugu_meaning || '') + '</span>';
        html += '</div>';
        html += '<div class="sc-tag">Score: ' + (p ? p.score : 0) + ' | ' + (p ? p.correctcount : 0) + '✓ ' + (p ? p.wrongcount : 0) + '✗</div>';
        html += '</div>';
    });
    html += '</div>';

    resultsDiv.innerHTML = html;
}

function openWordDetail(wordId) {
    var word = allWords.find(function(w) { return w.id === wordId; });
    if (!word) return;

    studyQueue = [word];
    studyIndex = 0;
    currentFolder = null;
    renderStudyMode();
}

// MODE SWITCH
function switchMode(m) {
    currentMode = m;
    document.getElementById('btnStudy').classList.toggle('active', m === 'study');
    document.getElementById('btnExam').classList.toggle('active', m === 'exam');
    
    if (m === 'study') {
        if (currentFolder) {
            openFolder(currentFolder);
        } else {
            renderFolderView();
        }
    } else {
        startExam();
    }
}

// STUDY MODE
function renderStudyMode() {
    document.getElementById('navBar').style.display = 'flex';
    renderStudyCard();
    updateNavBar();
}

function goBackToHome() {
    currentFolder = null;
    renderFolderView();
}

function studyNav(dir) {
    var n = studyIndex + dir;
    if (n < 0 || n >= studyQueue.length) return;
    studyIndex = n;
    renderStudyCard();
    updateNavBar();
}

function updateNavBar() {
    var info = 'Word ' + (studyIndex + 1) + ' of ' + studyQueue.length;
    if (currentFolder) {
        info += ' • ' + getCategoryName(currentFolder);
    }
    document.getElementById('navInfo').textContent = info;
    document.getElementById('btnPrev').disabled = studyIndex === 0;
    document.getElementById('btnNext').disabled = studyIndex >= studyQueue.length - 1;
    
    // Show back button in navbar
    var navBar = document.getElementById('navBar');
    if (navBar && !document.getElementById('btnBack')) {
        var backBtn = document.createElement('button');
        backBtn.id = 'btnBack';
        backBtn.className = 'nav-btn';
        backBtn.textContent = '← Home';
        backBtn.onclick = goBackToHome;
        navBar.insertBefore(backBtn, navBar.firstChild);
    }
}

function toggleStudyExpand(id) {
    studyExpanded[id] = !studyExpanded[id];
    renderStudyCard();
}

function renderStudyCard() {
    var word = studyQueue[studyIndex];
    if (!word) {
        document.getElementById('mainArea').innerHTML = '<div class="empty">No words in this category.</div>';
        return;
    }
    
    document.getElementById('mainArea').innerHTML = buildStudyCardHTML(word, getP(word.id), studyExpanded[word.id] || false);
    
    var wrap = document.getElementById('sw_' + word.id);
    var card = wrap ? wrap.querySelector('.study-card') : null;
    if (wrap && card) initTilt(wrap, card);
}

function buildStudyCardHTML(word, p, exp) {
    var cat = getCategory(p);
    var catClass = {
        new: 's-new',
        worst: 's-worst',
        improvement: 's-learning',
        good: 's-good',
        excellent: 's-strong'
    }[cat] || 's-new';
    
    var catLabel = getCategoryName(cat);
    
    var scoreNorm = Math.max(0, Math.min(100, ((p ? p.score : 0) + 50) / 150 * 100));
    var barColor = (p && p.score < 0) ? 'var(--red)' : (p && p.score < 30) ? 'var(--yellow)' : 'var(--green)';

    var ss = word.example_sentences || [];

    var h = '<div class="s-card-wrap" id="sw_' + word.id + '">';
    h += '<div class="study-card">';
    
    h += '<div class="word-kanji" onclick="speak(\'' + esc(word.japanese_word || '') + '\')">' + (word.japanese_word || '') + '</div>';
    h += '<div class="word-reading"><span class="hiragana">' + (word.hiragana || '') + '</span><span class="romaji">' + (word.romaji || '') + '</span></div>';
    h += '<button class="snd-btn" onclick="speak(\'' + esc(word.japanese_word || '') + '\')">🔊 Listen</button>';
    
    h += '<div class="meanings"><span class="tag-en">' + (word.english_meaning || '') + '</span><span class="tag-te">' + (word.telugu_meaning || '') + '</span></div>';
    h += '<div class="te-pron">(' + (word.telugu_pronunciation || '') + ')</div>';
    
    h += '<div class="prog-row"><span class="sbadge ' + catClass + '">' + catLabel + '</span><span class="sc-tag">Score: ' + (p ? p.score : 0) + ' • ' + (p ? p.correctcount : 0) + '✓ ' + (p ? p.wrongcount : 0) + '✗</span></div>';
    h += '<div class="sc-bar-w"><div class="sc-bar-f" style="width:' + scoreNorm + '%;background:' + barColor + '"></div></div>';
    
    h += '<div class="divider"></div>';
    h += '<div class="sec-lbl">Example Sentences</div>';
    h += ss.slice(0, 3).map(exHTML).join('');

    if (!exp) {
        h += '<button class="exp-btn" onclick="toggleStudyExpand(' + word.id + ')">📖 Show all examples & notes</button>';
    } else {
        if (ss.length > 3) {
            h += ss.slice(3).map(exHTML).join('');
        }
        h += '<div class="divider"></div>';
        if (word.letter_breakdown && word.letter_breakdown.length) {
            h += '<div class="sec-lbl">Letter Breakdown</div><div class="ltr-grid">';
            word.letter_breakdown.forEach(function(l) {
                h += '<div class="ltr-box"><span class="ltr-jp">' + (l.letter || '') + '</span><span class="ltr-te">' + (l.telugu_sound || '') + '</span></div>';
            });
            h += '</div>';
        }
        if (word.description) {
            h += '<div class="sec-lbl">Notes</div><div class="desc">' + word.description + '</div>';
        }
        h += '<button class="exp-btn" onclick="toggleStudyExpand(' + word.id + ')">🔼 Collapse</button>';
    }
    
    h += '</div></div>';
    return h;
}

function exHTML(s) {
    var html = '<div class="ex-card">';
    html += '<div class="ex-jp">' + (s.sentence || '') + '</div>';
    html += '<div class="ex-rom">' + (s.romaji || '') + '</div>';
    html += '<div class="ex-te">(' + (s.telugu_pronunciation || '') + ')</div>';
    html += '<div class="ex-row"><span class="ex-en">' + (s.english_meaning || '') + '</span><span class="ex-te">' + (s.telugu_meaning || '') + '</span></div>';
    
    // Add speaker button for sentence
    if (s.sentence) {
        html += '<button class="snd-btn" onclick="speak(\'' + esc(s.sentence) + '\')" style="margin-top:8px;font-size:12px;padding:5px 12px;">🔊 Listen</button>';
    }
    
    // Add word breakdown if available
    if (s.word_breakdown && s.word_breakdown.length > 0) {
        html += '<div class="word-breakdown-section">';
        html += '<div class="wd-label">Word Breakdown:</div>';
        html += '<div class="wd-grid">';
        s.word_breakdown.forEach(function(wd) {
            html += '<div class="wd-item">';
            html += '<span class="wd-word">' + (wd.word || '') + '</span>';
            html += '<span class="wd-meaning">→ ' + (wd.meaning_en || '') + '</span>';
            html += '<span class="wd-te">(' + (wd.meaning_te || '') + ')</span>';
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

// EXAM MODE
function startExam() {
    if (allWords.length === 0) {
        document.getElementById('mainArea').innerHTML = '<div class="empty">No words available for exam.</div><button class="big-btn ghost" onclick="switchMode(\'study\')">📚 Go to Study Mode</button>';
        document.getElementById('navBar').style.display = 'none';
        return;
    }

    var examCount = Math.min(30, allWords.length);
    examWords = buildExamWords(examCount);
    examIndex = 0;
    examSessionScore = 0;
    examConfidenceMode = null;
    examWrongAnswers = [];
    examConfidenceErrors = [];
    examRepeatQueue = [];
    document.getElementById('navBar').style.display = 'none';
    renderExamQuestion();
}

// EXAM WORD SELECTION
// 30 questions:
//   - 20 from score < 30
//   - 5 from score 30-70
//   - 5 from score > 70
//   - 5-7 listening questions
function buildExamWords(count) {
    var below30 = [];
    var mid = [];
    var high = [];

    allWords.forEach(function(w) {
        var p = getP(w.id);
        var score = p ? p.score : 0;
        if (score < 30) {
            below30.push(w);
        } else if (score >= 30 && score < 70) {
            mid.push(w);
        } else {
            high.push(w);
        }
    });

    function pick(arr, n) {
        return arr.slice().sort(function() { return Math.random() - 0.5; }).slice(0, n);
    }

    var sel = [];
    
    // If all words are new, just pick randomly from all
    if (below30.length === allWords.length && allWords.every(function(w) {
        var p = getP(w.id);
        return p && p.score === 0 && p.totalattempts === 0;
    })) {
        sel = pick(allWords, count);
    } else {
        // Normal distribution
        var need20 = Math.min(20, below30.length);
        var need5mid = Math.min(5, mid.length);
        var need5high = Math.min(5, high.length);
        
        sel = sel.concat(pick(below30, need20));
        sel = sel.concat(pick(mid, need5mid));
        sel = sel.concat(pick(high, need5high));

        if (sel.length < count) {
            var remaining = allWords.filter(function(w) {
                return !sel.find(function(s) { return s.id === w.id; });
            });
            sel = sel.concat(pick(remaining, count - sel.length));
        }
    }

    sel = sel.slice(0, count);
    return sel.sort(function() { return Math.random() - 0.5; });
}

function renderExamQuestion() {
    if (examIndex >= examWords.length) {
        renderExamComplete();
        return;
    }

    // Check if we need to repeat a word
    if (examRepeatQueue.length > 0) {
        var repeatWord = examRepeatQueue.shift();
        examWords.splice(examIndex, 0, repeatWord);
    }

    var word = examWords[examIndex];
    var p = getP(word.id);

    // Pick question type
    var pool = ['jp', 'en', 'te'];
    if (p && p.score >= 30) {
        pool.push('sound');
    }
    
    // Ensure 5-7 listening questions total
    var soundCount = 0;
    for (var i = 0; i < examIndex; i++) {
        if (examWords[i]._wasSound) soundCount++;
    }
    
    if (soundCount < 5 && Math.random() < 0.3) {
        examStimType = 'sound';
    } else if (soundCount < 7 && examIndex > 23) {
        examStimType = 'sound';
    } else {
        examStimType = pool[Math.floor(Math.random() * pool.length)];
    }
    
    word._wasSound = (examStimType === 'sound');

    var pct = Math.round((examIndex / examWords.length) * 100);
    var catClass = {
        new: 's-new',
        worst: 's-worst',
        improvement: 's-learning',
        good: 's-good',
        excellent: 's-strong'
    }[getCategory(p)] || 's-new';

    var promptTxt = '';
    var frontInner = '';

    if (examStimType === 'jp') {
        promptTxt = 'What does this mean?';
        frontInner = '<div class="q-kanji">' + (word.japanese_word || '') + '</div>';
        frontInner += '<div class="q-hira">' + (word.hiragana || '') + '</div>';
        frontInner += '<div class="q-rom">' + (word.romaji || '') + '</div>';
        frontInner += '<div class="q-tepron">(' + (word.telugu_pronunciation || '') + ')</div>';
        frontInner += '<button class="snd-btn" onclick="speak(\'' + esc(word.japanese_word || '') + '\')" style="margin:10px auto 0;">🔊 Listen</button>';
    } else if (examStimType === 'en') {
        promptTxt = 'What is the Japanese word?';
        frontInner = '<div class="q-single">' + (word.english_meaning || '') + '</div>';
    } else if (examStimType === 'te') {
        promptTxt = 'What is the Japanese word?';
        frontInner = '<div class="q-single q-te">' + (word.telugu_meaning || '') + '</div>';
    } else {
        promptTxt = 'What word did you hear?';
        frontInner = '<div style="font-size:64px;margin-bottom:12px;">🔊</div>';
        frontInner += '<button class="snd-btn" onclick="speak(\'' + esc(word.japanese_word || '') + '\')" style="margin:0 auto;">▶ Play Again</button>';
        setTimeout(function() { speak(word.japanese_word || ''); }, 450);
    }

    var html = '';
    html += '<div class="ex-header">';
    html += '<div class="ex-meta"><span>Question ' + (examIndex + 1) + ' of ' + examWords.length + '</span><span class="sbadge ' + catClass + '">' + getCategoryName(getCategory(p)) + '</span></div>';
    html += '<div class="ex-pbar"><div class="ex-pfill" style="width:' + pct + '%"></div></div>';
    html += '</div>';

    html += '<div class="flip-scene">';
    html += '<div class="flip-card" id="flipCard">';
    html += '<div class="flip-face flip-front" id="flipFront">';
    html += '<div class="q-label">' + promptTxt + '</div>';
    html += frontInner;
    html += '</div>';
    html += '<div class="flip-face flip-back" id="flipBack"></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="exam-btns-fixed" id="examBtns">';
    html += '<div class="btn-row">';
    html += '<button class="ebtn eg" onclick="examConfidence(\'remembered\')">✅ I Remember</button>';
    html += '<button class="ebtn er" onclick="examConfidence(\'forgot\')">❌ I Forgot</button>';
    html += '</div>';
    html += '<div class="score-hint">';
    html += '<span class="sh-g">Remember: +' + {jp:2,en:4,te:4,sound:6}[examStimType] + '</span>';
    html += '<span class="sh-r">Forgot: -' + {jp:2,en:4,te:4,sound:6}[examStimType] + '</span>';
    html += '</div>';
    html += '</div>';

    document.getElementById('mainArea').innerHTML = html;
}

// CONFIDENCE CHECK
function examConfidence(mode) {
    examConfidenceMode = mode;
    var word = examWords[examIndex];
    
    document.getElementById('examBtns').innerHTML = '<div class="mcq-area"><div class="mcq-label">Select the correct answer</div><div id="mcqGrid"></div></div>';
    
    renderMCQ(word);
}

// MCQ OPTIONS
function renderMCQ(word) {
    var distractor = allWords.filter(function(w) { return w.id !== word.id; })
        .sort(function() { return Math.random() - 0.5; })
        .slice(0, 5);
    
    var opts = distractor.concat([word]).sort(function() { return Math.random() - 0.5; });

    var testMeaning = (examStimType === 'jp' || examStimType === 'sound');

    var grid = opts.map(function(opt) {
        var label = testMeaning ?
            '<span class="mopt-en">' + (opt.english_meaning || '') + '</span><span class="mopt-te">' + (opt.telugu_meaning || '') + '</span>' :
            '<span class="mopt-jp">' + (opt.japanese_word || '') + '</span><span class="mopt-rom">' + (opt.romaji || '') + '</span>';
        return '<button class="mopt" id="mo_' + opt.id + '" onclick="pickMCQ(' + opt.id + ',' + word.id + ')">' + label + '</button>';
    }).join('');

    document.getElementById('mcqGrid').innerHTML = grid;
    document.getElementById('mcqGrid').className = 'mcq-grid';
}

function pickMCQ(selectedId, correctId) {
    document.querySelectorAll('.mopt').forEach(function(b) { b.style.pointerEvents = 'none'; });

    document.querySelectorAll('.mopt').forEach(function(btn) {
        var id = parseInt(btn.id.replace('mo_', ''));
        if (id === correctId) btn.classList.add('c');
        if (id === selectedId && id !== correctId) btn.classList.add('w');
    });

    var correct = (selectedId === correctId);
    var remembered = (examConfidenceMode === 'remembered');
    var word = examWords[examIndex];

    var delta = applyScore(word.id, examStimType, remembered, correct);
    
    showToast(delta);
    screenFlash(correct);
    if (correct) spawnConfetti();

    flipToAnswer(word, !correct);

    // Track errors
    if (!correct) {
        examWrongAnswers.push({ word: word, questionType: examStimType });
        
        // Add to repeat queue if not already there and within next 5 questions
        if (!examRepeatQueue.find(function(w) { return w.id === word.id; }) && examRepeatQueue.length < 5) {
            examRepeatQueue.push(word);
        }
    }

    if (remembered && !correct) {
        examConfidenceErrors.push({ word: word, questionType: examStimType });
    }

    setTimeout(examNext, 1600);
}

function flipToAnswer(word, isWrong) {
    var back = document.getElementById('flipBack');
    if (!back) return;

    back.className = 'flip-face flip-back' + (isWrong ? ' wrong-back' : '');
    back.innerHTML = '<div class="ans-kanji">' + (word.japanese_word || '') + '</div>';
    back.innerHTML += '<div class="ans-hira">' + (word.hiragana || '') + ' • ' + (word.romaji || '') + '</div>';
    back.innerHTML += '<button class="snd-btn" onclick="speak(\'' + esc(word.japanese_word || '') + '\')" style="margin:8px auto;">🔊 Listen</button>';
    back.innerHTML += '<div class="ans-means"><span class="tag-en">' + (word.english_meaning || '') + '</span><span class="tag-te">' + (word.telugu_meaning || '') + '</span></div>';
    back.innerHTML += '<div class="ans-pron">(' + (word.telugu_pronunciation || '') + ')</div>';

    setTimeout(function() {
        var fc = document.getElementById('flipCard');
        if (fc) fc.classList.add('flipped');
    }, 60);
}

function examNext() {
    examIndex++;
    renderExamQuestion();
}

// EXAM COMPLETE
function renderExamComplete() {
    progress.lastexamwordids = examWords.map(function(w) { return w.id; });
    saveProgress();
    
    spawnConfetti();
    spawnConfetti();
    spawnConfetti();

    var totalQuestions = examWords.length;
    var correctCount = totalQuestions - examWrongAnswers.length;
    var wrongCount = examWrongAnswers.length;
    var confidenceErrorCount = examConfidenceErrors.length;
    var accuracy = Math.round((correctCount / totalQuestions) * 100);

    var categoryCount = {
        new: 0,
        worst: 0,
        improvement: 0,
        good: 0,
        excellent: 0
    };

    allWords.forEach(function(w) {
        var cat = getCategory(getP(w.id));
        categoryCount[cat]++;
    });

    var html = '<div class="complete">';
    html += '<span class="c-icon">🎉</span>';
    html += '<div class="c-title">Exam Complete!</div>';
    html += '<div class="c-sub">' + totalQuestions + ' questions • Session Score: <strong style="color:var(--yellow)">' + (examSessionScore >= 0 ? '+' : '') + examSessionScore + '</strong></div>';
    
    html += '<div class="stats-g">';
    html += '<div class="stat-box"><span class="stat-val" style="color:var(--green)">' + correctCount + '</span><span class="stat-lbl">Correct</span></div>';
    html += '<div class="stat-box"><span class="stat-val" style="color:var(--red)">' + wrongCount + '</span><span class="stat-lbl">Wrong</span></div>';
    html += '<div class="stat-box"><span class="stat-val" style="color:var(--yellow)">' + accuracy + '%</span><span class="stat-lbl">Accuracy</span></div>';
    html += '</div>';

    if (confidenceErrorCount > 0) {
        html += '<div class="stats-g">';
        html += '<div class="stat-box"><span class="stat-val" style="color:var(--purple)">' + confidenceErrorCount + '</span><span class="stat-lbl">Confidence Errors</span></div>';
        html += '</div>';
    }

    html += '<div class="stats-g">';
    html += '<div class="stat-box"><span class="stat-val" style="color:var(--green)">⭐ ' + categoryCount.excellent + '</span><span class="stat-lbl">Excellent</span></div>';
    html += '<div class="stat-box"><span class="stat-val" style="color:var(--accent)">🟢 ' + categoryCount.good + '</span><span class="stat-lbl">Good</span></div>';
    html += '<div class="stat-box"><span class="stat-val" style="color:var(--purple)">🆕 ' + categoryCount.new + '</span><span class="stat-lbl">New</span></div>';
    html += '</div>';

    html += '<button class="big-btn" onclick="startExam()">🔄 New Exam</button>';
    html += '<button class="big-btn ghost" onclick="switchMode(\'study\')">📚 Study Mode</button>';
    
    if (wrongCount > 0) {
        html += '<button class="big-btn ghost" onclick="reviewWrongAnswers()">❌ Review Wrong Answers</button>';
    }
    
    if (confidenceErrorCount > 0) {
        html += '<button class="big-btn ghost" onclick="reviewConfidenceErrors()">⚠️ Review Confidence Errors</button>';
    }
    
    html += '</div>';

    document.getElementById('mainArea').innerHTML = html;
    document.getElementById('navBar').style.display = 'none';
    updateHeaderScore();
}

function reviewWrongAnswers() {
    studyQueue = examWrongAnswers.map(function(item) { return item.word; });
    studyIndex = 0;
    currentFolder = null;
    switchMode('study');
}

function reviewConfidenceErrors() {
    studyQueue = examConfidenceErrors.map(function(item) { return item.word; });
    studyIndex = 0;
    currentFolder = null;
    switchMode('study');
}

// SCREEN FLASH
function screenFlash(good) {
    var ov = document.getElementById('flashOv');
    ov.className = good ? 'flash-g' : 'flash-r';
    setTimeout(function() { ov.className = ''; }, 350);
}

// CONFETTI
var COLORS = ['#e63946','#2a9d8f','#e9c46a','#457b9d','#f4a261','#9b59b6','#fff','#ff6b6b','#4ecdc4'];
function spawnConfetti() {
    for (var i = 0; i < 28; i++) {
        (function() {
            var el = document.createElement('div');
            el.className = 'conf';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
            el.style.animationDuration = (.8 + Math.random() * .9) + 's';
            el.style.animationDelay = (Math.random() * .4) + 's';
            el.style.borderRadius = (Math.random() > .5 ? 50 : 3) + 'px';
            el.style.width = (7 + Math.random() * 8) + 'px';
            el.style.height = el.style.width;
            el.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
            document.body.appendChild(el);
            setTimeout(function() { el.remove(); }, 2000);
        })();
    }
}

// HEADER SCORE
function updateHeaderScore() {
    var pill = document.getElementById('scorePill');
    pill.textContent = progress.totalscore;
    pill.classList.add('bump');
    setTimeout(function() { pill.classList.remove('bump'); }, 350);
}

// SOUND
function speak(text) {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = 0.85;
    var v = window.speechSynthesis.getVoices().filter(function(v) { return v.lang.startsWith('ja'); });
    if (v.length) u.voice = v[0];
    window.speechSynthesis.speak(u);
}

// TOAST
function showToast(delta) {
    document.querySelectorAll('.toast').forEach(function(t) { t.remove(); });
    var el = document.createElement('div');
    el.className = 'toast ' + (delta >= 0 ? 'pos' : 'neg');
    el.textContent = (delta >= 0 ? '+' : '') + delta;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 1800);
}

// SWIPE
var tx0, ty0;
document.addEventListener('touchstart', function(e) {
    tx0 = e.changedTouches[0].screenX;
    ty0 = e.changedTouches[0].screenY;
}, {passive: true});

document.addEventListener('touchend', function(e) {
    if (currentMode !== 'study') return;
    var dx = e.changedTouches[0].screenX - tx0;
    var dy = e.changedTouches[0].screenY - ty0;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        if (dx > 0) studyNav(-1);
        else studyNav(1);
    }
}, {passive: true});

// ESCAPE
function esc(s) {
    if (!s) return '';
    return s.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

// BOOT
init();
