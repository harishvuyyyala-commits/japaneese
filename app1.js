// ─── Text-to-Speech ──────────────────────────────────────────────────────────

// Full romaji map for every kana character so we always have a clear fallback
const romajiMap = {
    // Hiragana
    'あ':'a','い':'i','う':'u','え':'e','お':'o',
    'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
    'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
    'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
    'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
    'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
    'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
    'や':'ya','ゆ':'yu','よ':'yo',
    'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
    'わ':'wa','を':'wo','ん':'n',
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
    'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
    'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
    'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
    // Katakana
    'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
    'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
    'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
    'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
    'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
    'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
    'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
    'ヤ':'ya','ユ':'yu','ヨ':'yo',
    'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
    'ワ':'wa','ヲ':'wo','ン':'n',
    // Kanji → reading
    '一':'ichi','二':'ni','三':'san','四':'shi','五':'go',
    '六':'roku','七':'shichi','八':'hachi','九':'ku','十':'juu',
    '百':'hyaku','千':'sen',
    '日':'nichi','月':'tsuki','火':'hi','水':'mizu',
    '木':'ki','金':'kin','人':'hito','山':'yama'
};

// Convert a Japanese string to romaji for reliable speech
function toRomaji(text) {
    if (!text) return text;
    // If it's a single character and we have a direct mapping, use it
    if (text.length === 1 && romajiMap[text]) return romajiMap[text];
    // For multi-char strings, convert char by char (skips ー and unknown chars)
    let result = '';
    for (const ch of text) {
        result += romajiMap[ch] || ch;
    }
    return result;
}

// Get the best available Japanese voice
// ── Telugu pronunciation map ─────────────────────────────────────────────────
// Maps every Japanese char to its Telugu equivalent for native te-IN TTS.
// Telugu phonemes closely match Japanese — so this sounds natural & clear.
const teluguPronMap = {
    // Hiragana vowels
    'あ':'అ','い':'ఇ','う':'ఉ','え':'ఎ','お':'ఒ',
    // ka row
    'か':'క','き':'కి','く':'కు','け':'కె','こ':'కొ',
    // sa row
    'さ':'స','し':'షి','す':'సు','せ':'సె','そ':'సొ',
    // ta row
    'た':'త','ち':'చి','つ':'త్సు','て':'తె','と':'తొ',
    // na row
    'な':'న','に':'ని','ぬ':'ను','ね':'నె','の':'నొ',
    // ha row
    'は':'హ','ひ':'హి','ふ':'ఫు','へ':'హె','ほ':'హొ',
    // ma row
    'ま':'మ','み':'మి','む':'ము','め':'మె','も':'మొ',
    // ya row
    'や':'య','ゆ':'యు','よ':'యొ',
    // ra row
    'ら':'ర','り':'రి','る':'రు','れ':'రె','ろ':'రొ',
    // wa row
    'わ':'వ','を':'వొ','ん':'న్',
    // Katakana vowels
    'ア':'అ','イ':'ఇ','ウ':'ఉ','エ':'ఎ','オ':'ఒ',
    'カ':'క','キ':'కి','ク':'కు','ケ':'కె','コ':'కొ',
    'サ':'స','シ':'షి','ス':'సు','セ':'సె','ソ':'సొ',
    'タ':'త','チ':'చి','ツ':'త్సు','テ':'తె','ト':'తొ',
    'ナ':'న','ニ':'ని','ヌ':'ను','ネ':'నె','ノ':'నొ',
    'ハ':'హ','ヒ':'హి','フ':'ఫు','ヘ':'హె','ホ':'హొ',
    'マ':'మ','ミ':'మి','ム':'ము','メ':'మె','モ':'మొ',
    'ヤ':'య','ユ':'యు','ヨ':'యొ',
    'ラ':'ర','リ':'రి','ル':'రు','レ':'రె','ロ':'రొ',
    'ワ':'వ','ヲ':'వొ','ン':'న్',
    // Basic kanji numbers/common
    '一':'ఒకటి','二':'రెండు','三':'మూడు','四':'నాలుగు','五':'అయిదు',
    '六':'ఆరు','七':'ఏడు','八':'ఎనిమిది','九':'తొమ్మిది','十':'పది',
    '百':'వంద','千':'వెయ్యి',
    '日':'నిచి','月':'త్సుకి','火':'హి','水':'మిజు',
    '木':'కి','金':'కిన్','人':'హితో','山':'యమ'
};

// Convert a Japanese string to its Telugu phonetic equivalent
function toTeluguPhonetic(text) {
    if (!text) return '';
    // Single char lookup
    if (teluguPronMap[text]) return teluguPronMap[text];
    // Multi-char: map each character
    let result = '';
    for (const ch of text) {
        result += teluguPronMap[ch] || ch;
    }
    return result;
}

// Voice cache
let _teVoice = null;
let _jaVoice = null;
let _enVoice = null;

function initVoices() {
    const voices = window.speechSynthesis.getVoices();
    _teVoice = voices.find(v => v.lang === 'te-IN') ||
               voices.find(v => v.lang.startsWith('te')) || null;
    _jaVoice = voices.find(v => v.lang === 'ja-JP' && v.localService) ||
               voices.find(v => v.lang === 'ja-JP') ||
               voices.find(v => v.lang.startsWith('ja')) || null;
    _enVoice = voices.find(v => v.lang === 'en-US') ||
               voices.find(v => v.lang.startsWith('en')) || null;
}

// Main speak:
// Priority 1 — Telugu voice with Telugu phonetics  (sounds best for Telugu users)
// Priority 2 — Japanese voice with Japanese text   (if device has it)
// Priority 3 — English voice with romaji           (universal fallback)
function llSpeak(japaneseText) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (!_teVoice && !_jaVoice && !_enVoice) initVoices();

    const utt = new SpeechSynthesisUtterance();
    utt.volume = 1.0;
    utt.rate   = 0.8;
    utt.pitch  = 1.0;

    if (_teVoice) {
        utt.text  = toTeluguPhonetic(japaneseText);
        utt.lang  = 'te-IN';
        utt.voice = _teVoice;
    } else if (_jaVoice) {
        utt.text  = japaneseText;
        utt.lang  = 'ja-JP';
        utt.voice = _jaVoice;
    } else {
        utt.text  = toRomaji(japaneseText);
        utt.lang  = 'en-US';
        if (_enVoice) utt.voice = _enVoice;
    }

    window.speechSynthesis.speak(utt);
}

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function() { initVoices(); };
    initVoices();
}

// ─── Data ────────────────────────────────────────────────────────────────────
const hiraganaData = [
    { char: 'あ', telugu: 'అ', english: 'a', examples: [{word: 'あめ', telugu: 'వర్షం', english: 'rain', pronunciation: 'ame', breakdown: 'あ+め'}, {word: 'あさ', telugu: 'ఉదయం', english: 'morning', pronunciation: 'asa', breakdown: 'あ+さ'}] },
    { char: 'い', telugu: 'ఇ', english: 'i', examples: [{word: 'いえ', telugu: 'ఇల్లు', english: 'house', pronunciation: 'ie', breakdown: 'い+え'}, {word: 'いぬ', telugu: 'కుక్క', english: 'dog', pronunciation: 'inu', breakdown: 'い+ぬ'}] },
    { char: 'う', telugu: 'ఉ', english: 'u', examples: [{word: 'うみ', telugu: 'సముద్రం', english: 'sea', pronunciation: 'umi', breakdown: 'う+み'}, {word: 'うし', telugu: 'ఆవు', english: 'cow', pronunciation: 'ushi', breakdown: 'う+し'}] },
    { char: 'え', telugu: 'ఎ', english: 'e', examples: [{word: 'えき', telugu: 'స్టేషన్', english: 'station', pronunciation: 'eki', breakdown: 'え+き'}, {word: 'えん', telugu: 'యెన్', english: 'yen', pronunciation: 'en', breakdown: 'え+ん'}] },
    { char: 'お', telugu: 'ఒ', english: 'o', examples: [{word: 'おかね', telugu: 'డబ్బు', english: 'money', pronunciation: 'okane', breakdown: 'お+か+ね'}, {word: 'おちゃ', telugu: 'టీ', english: 'tea', pronunciation: 'ocha', breakdown: 'お+ちゃ'}] },
    { char: 'か', telugu: 'క', english: 'ka', examples: [{word: 'かさ', telugu: 'గొడుగు', english: 'umbrella', pronunciation: 'kasa', breakdown: 'か+さ'}, {word: 'かみ', telugu: 'కాగితం', english: 'paper', pronunciation: 'kami', breakdown: 'か+み'}] },
    { char: 'き', telugu: 'కి', english: 'ki', examples: [{word: 'きた', telugu: 'ఉత్తరం', english: 'north', pronunciation: 'kita', breakdown: 'き+た'}, {word: 'きれい', telugu: 'అందమైన', english: 'beautiful', pronunciation: 'kirei', breakdown: 'き+れ+い'}] },
    { char: 'く', telugu: 'కు', english: 'ku', examples: [{word: 'くつ', telugu: 'షూ', english: 'shoes', pronunciation: 'kutsu', breakdown: 'く+つ'}, {word: 'くに', telugu: 'దేశం', english: 'country', pronunciation: 'kuni', breakdown: 'く+に'}] },
    { char: 'け', telugu: 'కె', english: 'ke', examples: [{word: 'けさ', telugu: 'ఈ ఉదయం', english: 'this morning', pronunciation: 'kesa', breakdown: 'け+さ'}, {word: 'けしき', telugu: 'దృశ్యం', english: 'scenery', pronunciation: 'keshiki', breakdown: 'け+し+き'}] },
    { char: 'こ', telugu: 'కొ', english: 'ko', examples: [{word: 'ここ', telugu: 'ఇక్కడ', english: 'here', pronunciation: 'koko', breakdown: 'こ+こ'}, {word: 'こども', telugu: 'పిల్లలు', english: 'children', pronunciation: 'kodomo', breakdown: 'こ+ど+も'}] },
    { char: 'さ', telugu: 'స', english: 'sa', examples: [{word: 'さかな', telugu: 'చేప', english: 'fish', pronunciation: 'sakana', breakdown: 'さ+か+な'}, {word: 'さけ', telugu: 'సాకే', english: 'sake', pronunciation: 'sake', breakdown: 'さ+け'}] },
    { char: 'し', telugu: 'శి', english: 'shi', examples: [{word: 'しお', telugu: 'ఉప్పు', english: 'salt', pronunciation: 'shio', breakdown: 'し+お'}, {word: 'した', telugu: 'క్రింద', english: 'below', pronunciation: 'shita', breakdown: 'し+た'}] },
    { char: 'す', telugu: 'సు', english: 'su', examples: [{word: 'すし', telugu: 'సుషీ', english: 'sushi', pronunciation: 'sushi', breakdown: 'す+し'}, {word: 'すき', telugu: 'ఇష్టం', english: 'like', pronunciation: 'suki', breakdown: 'す+き'}] },
    { char: 'せ', telugu: 'సె', english: 'se', examples: [{word: 'せかい', telugu: 'ప్రపంచం', english: 'world', pronunciation: 'sekai', breakdown: 'せ+か+い'}, {word: 'せなか', telugu: 'వెనుక', english: 'back', pronunciation: 'senaka', breakdown: 'せ+な+か'}] },
    { char: 'そ', telugu: 'సొ', english: 'so', examples: [{word: 'そら', telugu: 'ఆకాశం', english: 'sky', pronunciation: 'sora', breakdown: 'そ+ら'}, {word: 'そと', telugu: 'బయట', english: 'outside', pronunciation: 'soto', breakdown: 'そ+と'}] },
    { char: 'た', telugu: 'త', english: 'ta', examples: [{word: 'たべる', telugu: 'తినడం', english: 'to eat', pronunciation: 'taberu', breakdown: 'た+べ+る'}, {word: 'たかい', telugu: 'ఎత్తైన', english: 'tall/expensive', pronunciation: 'takai', breakdown: 'た+か+い'}] },
    { char: 'ち', telugu: 'చి', english: 'chi', examples: [{word: 'ちち', telugu: 'తండ్రి', english: 'father', pronunciation: 'chichi', breakdown: 'ち+ち'}, {word: 'ちず', telugu: 'మ్యాప్', english: 'map', pronunciation: 'chizu', breakdown: 'ち+ず'}] },
    { char: 'つ', telugu: 'త్సు', english: 'tsu', examples: [{word: 'つき', telugu: 'చంద్రుడు', english: 'moon', pronunciation: 'tsuki', breakdown: 'つ+き'}, {word: 'つくえ', telugu: 'టేబుల్', english: 'desk', pronunciation: 'tsukue', breakdown: 'つ+く+え'}] },
    { char: 'て', telugu: 'తె', english: 'te', examples: [{word: 'て', telugu: 'చేతి', english: 'hand', pronunciation: 'te', breakdown: 'て'}, {word: 'てがみ', telugu: 'లేఖ', english: 'letter', pronunciation: 'tegami', breakdown: 'て+が+み'}] },
    { char: 'と', telugu: 'తొ', english: 'to', examples: [{word: 'とけい', telugu: 'గడియారం', english: 'clock', pronunciation: 'tokei', breakdown: 'と+け+い'}, {word: 'とり', telugu: 'పక్షి', english: 'bird', pronunciation: 'tori', breakdown: 'と+り'}] },
    { char: 'な', telugu: 'న', english: 'na', examples: [{word: 'なつ', telugu: 'వేసవి', english: 'summer', pronunciation: 'natsu', breakdown: 'な+つ'}, {word: 'なまえ', telugu: 'పేరు', english: 'name', pronunciation: 'namae', breakdown: 'な+ま+え'}] },
    { char: 'に', telugu: 'ని', english: 'ni', examples: [{word: 'にく', telugu: 'మాంసం', english: 'meat', pronunciation: 'niku', breakdown: 'に+く'}, {word: 'にわ', telugu: 'తోట', english: 'garden', pronunciation: 'niwa', breakdown: 'に+わ'}] },
    { char: 'ぬ', telugu: 'ను', english: 'nu', examples: [{word: 'ぬの', telugu: 'బట్ట', english: 'cloth', pronunciation: 'nuno', breakdown: 'ぬ+の'}, {word: 'ぬく', telugu: 'తీయడం', english: 'to remove', pronunciation: 'nuku', breakdown: 'ぬ+く'}] },
    { char: 'ね', telugu: 'నె', english: 'ne', examples: [{word: 'ねこ', telugu: 'పిల్లి', english: 'cat', pronunciation: 'neko', breakdown: 'ね+こ'}, {word: 'ねる', telugu: 'నిద్రపోవు', english: 'to sleep', pronunciation: 'neru', breakdown: 'ね+る'}] },
    { char: 'の', telugu: 'నొ', english: 'no', examples: [{word: 'のむ', telugu: 'తాగు', english: 'to drink', pronunciation: 'nomu', breakdown: 'の+む'}, {word: 'のり', telugu: 'సముద్రపు పాచి', english: 'seaweed', pronunciation: 'nori', breakdown: 'の+り'}] },
    { char: 'は', telugu: 'హ', english: 'ha', examples: [{word: 'はな', telugu: 'పువ్వు', english: 'flower', pronunciation: 'hana', breakdown: 'は+な'}, {word: 'はは', telugu: 'తల్లి', english: 'mother', pronunciation: 'haha', breakdown: 'は+は'}] },
    { char: 'ひ', telugu: 'హి', english: 'hi', examples: [{word: 'ひと', telugu: 'వ్యక్తి', english: 'person', pronunciation: 'hito', breakdown: 'ひ+と'}, {word: 'ひる', telugu: 'మధ్యాహ్నం', english: 'noon', pronunciation: 'hiru', breakdown: 'ひ+る'}] },
    { char: 'ふ', telugu: 'ఫు', english: 'fu', examples: [{word: 'ふゆ', telugu: 'చలికాలం', english: 'winter', pronunciation: 'fuyu', breakdown: 'ふ+ゆ'}, {word: 'ふね', telugu: 'ఓడ', english: 'ship', pronunciation: 'fune', breakdown: 'ふ+ね'}] },
    { char: 'へ', telugu: 'హె', english: 'he', examples: [{word: 'へや', telugu: 'గది', english: 'room', pronunciation: 'heya', breakdown: 'へ+や'}, {word: 'へた', telugu: 'చెడ్డ', english: 'bad at', pronunciation: 'heta', breakdown: 'へ+た'}] },
    { char: 'ほ', telugu: 'హొ', english: 'ho', examples: [{word: 'ほん', telugu: 'పుస్తకం', english: 'book', pronunciation: 'hon', breakdown: 'ほ+ん'}, {word: 'ほし', telugu: 'నక్షత్రం', english: 'star', pronunciation: 'hoshi', breakdown: 'ほ+し'}] },
    { char: 'ま', telugu: 'మ', english: 'ma', examples: [{word: 'まち', telugu: 'పట్టణం', english: 'town', pronunciation: 'machi', breakdown: 'ま+ち'}, {word: 'まど', telugu: 'కిటికీ', english: 'window', pronunciation: 'mado', breakdown: 'ま+ど'}] },
    { char: 'み', telugu: 'మి', english: 'mi', examples: [{word: 'みず', telugu: 'నీరు', english: 'water', pronunciation: 'mizu', breakdown: 'み+ず'}, {word: 'みみ', telugu: 'చెవి', english: 'ear', pronunciation: 'mimi', breakdown: 'み+み'}] },
    { char: 'む', telugu: 'ము', english: 'mu', examples: [{word: 'むし', telugu: 'కీటకం', english: 'insect', pronunciation: 'mushi', breakdown: 'む+し'}, {word: 'むら', telugu: 'గ్రామం', english: 'village', pronunciation: 'mura', breakdown: 'む+ら'}] },
    { char: 'め', telugu: 'మె', english: 'me', examples: [{word: 'め', telugu: 'కన్ను', english: 'eye', pronunciation: 'me', breakdown: 'め'}, {word: 'めし', telugu: 'భోజనం', english: 'meal', pronunciation: 'meshi', breakdown: 'め+し'}] },
    { char: 'も', telugu: 'మొ', english: 'mo', examples: [{word: 'もの', telugu: 'వస్తువు', english: 'thing', pronunciation: 'mono', breakdown: 'も+の'}, {word: 'もり', telugu: 'అడవి', english: 'forest', pronunciation: 'mori', breakdown: 'も+り'}] },
    { char: 'や', telugu: 'య', english: 'ya', examples: [{word: 'やま', telugu: 'కొండ', english: 'mountain', pronunciation: 'yama', breakdown: 'や+ま'}, {word: 'やさい', telugu: 'కూరగాయలు', english: 'vegetables', pronunciation: 'yasai', breakdown: 'や+さ+い'}] },
    { char: 'ゆ', telugu: 'యు', english: 'yu', examples: [{word: 'ゆき', telugu: 'మంచు', english: 'snow', pronunciation: 'yuki', breakdown: 'ゆ+き'}, {word: 'ゆめ', telugu: 'కల', english: 'dream', pronunciation: 'yume', breakdown: 'ゆ+め'}] },
    { char: 'よ', telugu: 'యొ', english: 'yo', examples: [{word: 'よる', telugu: 'రాత్రి', english: 'night', pronunciation: 'yoru', breakdown: 'よ+る'}, {word: 'よこ', telugu: 'పక్క', english: 'side', pronunciation: 'yoko', breakdown: 'よ+こ'}] },
    { char: 'ら', telugu: 'ర', english: 'ra', examples: [{word: 'らいねん', telugu: 'వచ్చే సంవత్సరం', english: 'next year', pronunciation: 'rainen', breakdown: 'ら+い+ね+ん'}, {word: 'らく', telugu: 'సులభమైన', english: 'easy', pronunciation: 'raku', breakdown: 'ら+く'}] },
    { char: 'り', telugu: 'రి', english: 'ri', examples: [{word: 'りんご', telugu: 'ఆపిల్', english: 'apple', pronunciation: 'ringo', breakdown: 'り+ん+ご'}, {word: 'りょう', telugu: 'నివాసం', english: 'dormitory', pronunciation: 'ryou', breakdown: 'り+ょ+う'}] },
    { char: 'る', telugu: 'రు', english: 'ru', examples: [{word: 'るす', telugu: 'ఇంట్లో లేని', english: 'absence', pronunciation: 'rusu', breakdown: 'る+す'}, {word: 'るい', telugu: 'కన్నీళ్లు', english: 'tears', pronunciation: 'rui', breakdown: 'る+い'}] },
    { char: 'れ', telugu: 'రె', english: 're', examples: [{word: 'れい', telugu: 'సున్నా', english: 'zero', pronunciation: 'rei', breakdown: 'れ+い'}, {word: 'れきし', telugu: 'చరిత్ర', english: 'history', pronunciation: 'rekishi', breakdown: 'れ+き+し'}] },
    { char: 'ろ', telugu: 'రొ', english: 'ro', examples: [{word: 'ろく', telugu: 'ఆరు', english: 'six', pronunciation: 'roku', breakdown: 'ろ+く'}, {word: 'ろうか', telugu: 'కారిడార్', english: 'corridor', pronunciation: 'rouka', breakdown: 'ろ+う+か'}] },
    { char: 'わ', telugu: 'వ', english: 'wa', examples: [{word: 'わたし', telugu: 'నేను', english: 'I/me', pronunciation: 'watashi', breakdown: 'わ+た+し'}, {word: 'わに', telugu: 'మొసలి', english: 'crocodile', pronunciation: 'wani', breakdown: 'わ+に'}] },
    { char: 'を', telugu: 'వొ', english: 'wo', examples: [{word: 'を', telugu: 'ను (పదార్థం)', english: 'object marker', pronunciation: 'wo', breakdown: 'を'}] },
    { char: 'ん', telugu: 'న్', english: 'n', examples: [{word: 'ほん', telugu: 'పుస్తకం', english: 'book', pronunciation: 'hon', breakdown: 'ほ+ん'}, {word: 'さん', telugu: 'మూడు', english: 'three', pronunciation: 'san', breakdown: 'さ+ん'}] }
];

const katakanaData = [
    { char: 'ア', telugu: 'అ', english: 'a', examples: [{word: 'アメリカ', telugu: 'అమెరికా', english: 'America', pronunciation: 'amerika', breakdown: 'ア+メ+リ+カ'}] },
    { char: 'イ', telugu: 'ఇ', english: 'i', examples: [{word: 'インド', telugu: 'ఇండియా', english: 'India', pronunciation: 'indo', breakdown: 'イ+ン+ド'}] },
    { char: 'ウ', telugu: 'ఉ', english: 'u', examples: [{word: 'ウイスキー', telugu: 'విస్కీ', english: 'whiskey', pronunciation: 'uisukii', breakdown: 'ウ+イ+ス+キ+ー'}] },
    { char: 'エ', telugu: 'ఎ', english: 'e', examples: [{word: 'エアコン', telugu: 'ఎయిర్ కండిషనర్', english: 'air conditioner', pronunciation: 'eakon', breakdown: 'エ+ア+コ+ン'}] },
    { char: 'オ', telugu: 'ఒ', english: 'o', examples: [{word: 'オレンジ', telugu: 'నారింజ', english: 'orange', pronunciation: 'orenji', breakdown: 'オ+レ+ン+ジ'}] },
    { char: 'カ', telugu: 'క', english: 'ka', examples: [{word: 'カメラ', telugu: 'కెమెరా', english: 'camera', pronunciation: 'kamera', breakdown: 'カ+メ+ラ'}] },
    { char: 'キ', telugu: 'కి', english: 'ki', examples: [{word: 'キス', telugu: 'ముద్దు', english: 'kiss', pronunciation: 'kisu', breakdown: 'キ+ス'}] },
    { char: 'ク', telugu: 'కు', english: 'ku', examples: [{word: 'クラス', telugu: 'తరగతి', english: 'class', pronunciation: 'kurasu', breakdown: 'ク+ラ+ス'}] },
    { char: 'ケ', telugu: 'కె', english: 'ke', examples: [{word: 'ケーキ', telugu: 'కేక్', english: 'cake', pronunciation: 'keeki', breakdown: 'ケ+ー+キ'}] },
    { char: 'コ', telugu: 'కొ', english: 'ko', examples: [{word: 'コーヒー', telugu: 'కాఫీ', english: 'coffee', pronunciation: 'koohii', breakdown: 'コ+ー+ヒ+ー'}] },
    { char: 'サ', telugu: 'స', english: 'sa', examples: [{word: 'サラダ', telugu: 'సలాడ్', english: 'salad', pronunciation: 'sarada', breakdown: 'サ+ラ+ダ'}] },
    { char: 'シ', telugu: 'శి', english: 'shi', examples: [{word: 'シャツ', telugu: 'షర్ట్', english: 'shirt', pronunciation: 'shatsu', breakdown: 'シ+ャ+ツ'}] },
    { char: 'ス', telugu: 'సు', english: 'su', examples: [{word: 'スプーン', telugu: 'స్పూన్', english: 'spoon', pronunciation: 'supuun', breakdown: 'ス+プ+ー+ン'}] },
    { char: 'セ', telugu: 'సె', english: 'se', examples: [{word: 'セーター', telugu: 'స్వెటర్', english: 'sweater', pronunciation: 'seetaa', breakdown: 'セ+ー+タ+ー'}] },
    { char: 'ソ', telugu: 'సొ', english: 'so', examples: [{word: 'ソース', telugu: 'సాస్', english: 'sauce', pronunciation: 'soosu', breakdown: 'ソ+ー+ス'}] },
    { char: 'タ', telugu: 'త', english: 'ta', examples: [{word: 'タクシー', telugu: 'టాక్సీ', english: 'taxi', pronunciation: 'takushii', breakdown: 'タ+ク+シ+ー'}] },
    { char: 'チ', telugu: 'చి', english: 'chi', examples: [{word: 'チーズ', telugu: 'చీజ్', english: 'cheese', pronunciation: 'chiizu', breakdown: 'チ+ー+ズ'}] },
    { char: 'ツ', telugu: 'త్సు', english: 'tsu', examples: [{word: 'ツアー', telugu: 'టూర్', english: 'tour', pronunciation: 'tsuaa', breakdown: 'ツ+ア+ー'}] },
    { char: 'テ', telugu: 'తె', english: 'te', examples: [{word: 'テレビ', telugu: 'టెలివిజన్', english: 'television', pronunciation: 'terebi', breakdown: 'テ+レ+ビ'}] },
    { char: 'ト', telugu: 'తొ', english: 'to', examples: [{word: 'トイレ', telugu: 'టాయిలెట్', english: 'toilet', pronunciation: 'toire', breakdown: 'ト+イ+レ'}] },
    { char: 'ナ', telugu: 'న', english: 'na', examples: [{word: 'ナイフ', telugu: 'కత్తి', english: 'knife', pronunciation: 'naifu', breakdown: 'ナ+イ+フ'}] },
    { char: 'ニ', telugu: 'ని', english: 'ni', examples: [{word: 'ニュース', telugu: 'వార్తలు', english: 'news', pronunciation: 'nyuusu', breakdown: 'ニ+ュ+ー+ス'}] },
    { char: 'ヌ', telugu: 'ను', english: 'nu', examples: [{word: 'ヌードル', telugu: 'నూడుల్స్', english: 'noodles', pronunciation: 'nuudoru', breakdown: 'ヌ+ー+ド+ル'}] },
    { char: 'ネ', telugu: 'నె', english: 'ne', examples: [{word: 'ネクタイ', telugu: 'టై', english: 'necktie', pronunciation: 'nekutai', breakdown: 'ネ+ク+タ+イ'}] },
    { char: 'ノ', telugu: 'నొ', english: 'no', examples: [{word: 'ノート', telugu: 'నోట్బుక్', english: 'notebook', pronunciation: 'nooto', breakdown: 'ノ+ー+ト'}] },
    { char: 'ハ', telugu: 'హ', english: 'ha', examples: [{word: 'ハンバーガー', telugu: 'హాంబర్గర్', english: 'hamburger', pronunciation: 'hanbaagaa', breakdown: 'ハ+ン+バ+ー+ガ+ー'}] },
    { char: 'ヒ', telugu: 'హి', english: 'hi', examples: [{word: 'ヒーター', telugu: 'హీటర్', english: 'heater', pronunciation: 'hiitaa', breakdown: 'ヒ+ー+タ+ー'}] },
    { char: 'フ', telugu: 'ఫు', english: 'fu', examples: [{word: 'フォーク', telugu: 'ఫోర్క్', english: 'fork', pronunciation: 'fooku', breakdown: 'フ+ォ+ー+ク'}] },
    { char: 'ヘ', telugu: 'హె', english: 'he', examples: [{word: 'ヘリコプター', telugu: 'హెలికాప్టర్', english: 'helicopter', pronunciation: 'herikoputaa', breakdown: 'ヘ+リ+コ+プ+タ+ー'}] },
    { char: 'ホ', telugu: 'హొ', english: 'ho', examples: [{word: 'ホテル', telugu: 'హోటల్', english: 'hotel', pronunciation: 'hoteru', breakdown: 'ホ+テ+ル'}] },
    { char: 'マ', telugu: 'మ', english: 'ma', examples: [{word: 'マスク', telugu: 'మాస్క్', english: 'mask', pronunciation: 'masuku', breakdown: 'マ+ス+ク'}] },
    { char: 'ミ', telugu: 'మి', english: 'mi', examples: [{word: 'ミルク', telugu: 'పాలు', english: 'milk', pronunciation: 'miruku', breakdown: 'ミ+ル+ク'}] },
    { char: 'ム', telugu: 'ము', english: 'mu', examples: [{word: 'ムービー', telugu: 'చిత్రం', english: 'movie', pronunciation: 'muubii', breakdown: 'ム+ー+ビ+ー'}] },
    { char: 'メ', telugu: 'మె', english: 'me', examples: [{word: 'メール', telugu: 'మెయిల్', english: 'email', pronunciation: 'meeru', breakdown: 'メ+ー+ル'}] },
    { char: 'モ', telugu: 'మొ', english: 'mo', examples: [{word: 'モデル', telugu: 'మోడల్', english: 'model', pronunciation: 'moderu', breakdown: 'モ+デ+ル'}] },
    { char: 'ヤ', telugu: 'య', english: 'ya', examples: [{word: 'ヤクルト', telugu: 'యాకుల్ట్', english: 'Yakult', pronunciation: 'yakuruto', breakdown: 'ヤ+ク+ル+ト'}] },
    { char: 'ユ', telugu: 'యు', english: 'yu', examples: [{word: 'ユーザー', telugu: 'యూజర్', english: 'user', pronunciation: 'yuuzaa', breakdown: 'ユ+ー+ザ+ー'}] },
    { char: 'ヨ', telugu: 'యొ', english: 'yo', examples: [{word: 'ヨーグルト', telugu: 'యోగర్ట్', english: 'yogurt', pronunciation: 'yooguruto', breakdown: 'ヨ+ー+グ+ル+ト'}] },
    { char: 'ラ', telugu: 'ర', english: 'ra', examples: [{word: 'ラジオ', telugu: 'రేడియో', english: 'radio', pronunciation: 'rajio', breakdown: 'ラ+ジ+オ'}] },
    { char: 'リ', telugu: 'రి', english: 'ri', examples: [{word: 'リモコン', telugu: 'రిమోట్', english: 'remote control', pronunciation: 'rimokon', breakdown: 'リ+モ+コ+ン'}] },
    { char: 'ル', telugu: 'రు', english: 'ru', examples: [{word: 'ルール', telugu: 'నియమం', english: 'rule', pronunciation: 'ruuru', breakdown: 'ル+ー+ル'}] },
    { char: 'レ', telugu: 'రె', english: 're', examples: [{word: 'レストラン', telugu: 'రెస్టారెంట్', english: 'restaurant', pronunciation: 'resutoran', breakdown: 'レ+ス+ト+ラ+ン'}] },
    { char: 'ロ', telugu: 'రొ', english: 'ro', examples: [{word: 'ロボット', telugu: 'రోబోట్', english: 'robot', pronunciation: 'robotto', breakdown: 'ロ+ボ+ッ+ト'}] },
    { char: 'ワ', telugu: 'వ', english: 'wa', examples: [{word: 'ワイン', telugu: 'వైన్', english: 'wine', pronunciation: 'wain', breakdown: 'ワ+イ+ン'}] },
    { char: 'ヲ', telugu: 'వొ', english: 'wo', examples: [{word: 'ヲタク', telugu: 'ఒటాకు', english: 'otaku', pronunciation: 'wotaku', breakdown: 'ヲ+タ+ク'}] },
    { char: 'ン', telugu: 'న్', english: 'n', examples: [{word: 'パン', telugu: 'బ్రెడ్', english: 'bread', pronunciation: 'pan', breakdown: 'パ+ン'}] }
];

const kanjiData = [
    { char: '一', telugu: 'ఒకటి', english: 'one', examples: [{word: '一人', telugu: 'ఒక వ్యక్తి', english: 'one person', pronunciation: 'hitori', breakdown: '一+人'}] },
    { char: '二', telugu: 'రెండు', english: 'two', examples: [{word: '二人', telugu: 'ఇద్దరు', english: 'two people', pronunciation: 'futari', breakdown: '二+人'}] },
    { char: '三', telugu: 'మూడు', english: 'three', examples: [{word: '三日', telugu: 'మూడు రోజులు', english: 'three days', pronunciation: 'mikka', breakdown: '三+日'}] },
    { char: '四', telugu: 'నాలుగు', english: 'four', examples: [{word: '四月', telugu: 'ఏప్రిల్', english: 'April', pronunciation: 'shigatsu', breakdown: '四+月'}] },
    { char: '五', telugu: 'ఐదు', english: 'five', examples: [{word: '五日', telugu: 'ఐదు రోజులు', english: 'five days', pronunciation: 'itsuka', breakdown: '五+日'}] },
    { char: '六', telugu: 'ఆరు', english: 'six', examples: [{word: '六月', telugu: 'జూన్', english: 'June', pronunciation: 'rokugatsu', breakdown: '六+月'}] },
    { char: '七', telugu: 'ఏడు', english: 'seven', examples: [{word: '七月', telugu: 'జూలై', english: 'July', pronunciation: 'shichigatsu', breakdown: '七+月'}] },
    { char: '八', telugu: 'ఎనిమిది', english: 'eight', examples: [{word: '八月', telugu: 'ఆగస్ట్', english: 'August', pronunciation: 'hachigatsu', breakdown: '八+月'}] },
    { char: '九', telugu: 'తొమ్మిది', english: 'nine', examples: [{word: '九月', telugu: 'సెప్టెంబర్', english: 'September', pronunciation: 'kugatsu', breakdown: '九+月'}] },
    { char: '十', telugu: 'పది', english: 'ten', examples: [{word: '十月', telugu: 'అక్టోబర్', english: 'October', pronunciation: 'juugatsu', breakdown: '十+月'}] },
    { char: '百', telugu: 'వంద', english: 'hundred', examples: [{word: '百円', telugu: 'వంద యెన్', english: 'hundred yen', pronunciation: 'hyakuen', breakdown: '百+円'}] },
    { char: '千', telugu: 'వేయి', english: 'thousand', examples: [{word: '千円', telugu: 'వేయి యెన్', english: 'thousand yen', pronunciation: "sen'en", breakdown: '千+円'}] },
    { char: '日', telugu: 'రోజు/సూర్యుడు', english: 'day/sun', examples: [{word: '今日', telugu: 'ఈరోజు', english: 'today', pronunciation: 'kyou', breakdown: '今+日'}] },
    { char: '月', telugu: 'నెల/చంద్రుడు', english: 'month/moon', examples: [{word: '一月', telugu: 'జనవరి', english: 'January', pronunciation: 'ichigatsu', breakdown: '一+月'}] },
    { char: '火', telugu: 'అగ్ని', english: 'fire', examples: [{word: '火曜日', telugu: 'మంగళవారం', english: 'Tuesday', pronunciation: 'kayoubi', breakdown: '火+曜+日'}] },
    { char: '水', telugu: 'నీరు', english: 'water', examples: [{word: '水曜日', telugu: 'బుధవారం', english: 'Wednesday', pronunciation: 'suiyoubi', breakdown: '水+曜+日'}] },
    { char: '木', telugu: 'చెట్టు', english: 'tree/wood', examples: [{word: '木曜日', telugu: 'గురువారం', english: 'Thursday', pronunciation: 'mokuyoubi', breakdown: '木+曜+日'}] },
    { char: '金', telugu: 'బంగారం', english: 'gold/money', examples: [{word: '金曜日', telugu: 'శుక్రవారం', english: 'Friday', pronunciation: "kin'youbi", breakdown: '金+曜+日'}] },
    { char: '人', telugu: 'వ్యక్తి', english: 'person', examples: [{word: '日本人', telugu: 'జపనీస్ వ్యక్తి', english: 'Japanese person', pronunciation: 'nihonjin', breakdown: '日+本+人'}] },
    { char: '山', telugu: 'కొండ', english: 'mountain', examples: [{word: '富士山', telugu: 'ఫుజి కొండ', english: 'Mt. Fuji', pronunciation: 'fujisan', breakdown: '富+士+山'}] }
];

// ─── State ───────────────────────────────────────────────────────────────────
let currentStage = 'hiragana';
let currentSection = 'study';
let currentLetterData = null;
let currentLetterIndex = -1;

const letterState = {
    hiragana: hiraganaData.map(item => ({ ...item, score: 0, correct: 0, wrong: 0, attempts: 0, learned: false, cantHear: false })),
    katakana: katakanaData.map(item => ({ ...item, score: 0, correct: 0, wrong: 0, attempts: 0, learned: false, cantHear: false })),
    kanji:    kanjiData.map(item =>    ({ ...item, score: 0, correct: 0, wrong: 0, attempts: 0, learned: false, cantHear: false }))
};

let llExamState = {
    confidence: null,
    questionType: null,
    currentQuestion: null,
    answered: false
};

// ─── Persistence ─────────────────────────────────────────────────────────────
function loadState() {
    const saved = localStorage.getItem('japaneseLearnState');
    if (saved) {
        const loaded = JSON.parse(saved);
        letterState.hiragana = loaded.hiragana || letterState.hiragana;
        letterState.katakana = loaded.katakana || letterState.katakana;
        letterState.kanji    = loaded.kanji    || letterState.kanji;
    }
}

function saveState() {
    localStorage.setItem('japaneseLearnState', JSON.stringify(letterState));
}

// ─── Progress & Unlocks ───────────────────────────────────────────────────────
function updateProgress(stage) {
    const data     = letterState[stage];
    const learned  = data.filter(i => i.learned).length;
    const mastered = data.filter(i => i.score >= 30).length;
    const total    = data.length;
    const percent  = Math.round((mastered / total) * 100);

    document.getElementById(`${stage}-learned-count`).textContent  = learned;
    document.getElementById(`${stage}-mastered-count`).textContent = mastered;
    const bar = document.getElementById(`${stage}-progress`);
    bar.style.width  = percent + '%';
    bar.textContent  = percent + '%';
}

function checkUnlocks() {
    const hiraganaAllMastered = letterState.hiragana.every(i => i.score >= 30);
    const katakanaAllMastered = letterState.katakana.every(i => i.score >= 30);

    if (hiraganaAllMastered)
        document.querySelector('[data-stage="katakana"]').classList.remove('locked');

    if (hiraganaAllMastered && katakanaAllMastered) {
        document.querySelector('[data-stage="kanji"]').classList.remove('locked');
        document.querySelector('[data-stage="typing"]').classList.remove('locked');
    }

    // Unlock the Exam tab per stage once 4 letters are learned
    ['hiragana', 'katakana', 'kanji'].forEach(function(stage) {
        var learned = letterState[stage].filter(function(i) { return i.learned; }).length;
        var examTab = document.querySelector('#' + stage + '-stage .section-tab[data-section="exam"]');
        if (!examTab) return;
        if (learned >= 4) {
            examTab.style.opacity = '';
            examTab.style.cursor = '';
            examTab.style.pointerEvents = '';
            examTab.title = '';
        } else {
            examTab.style.opacity = '0.35';
            examTab.style.cursor = 'not-allowed';
            examTab.style.pointerEvents = 'none';
            examTab.title = 'Learn ' + (4 - learned) + ' more letter(s) to unlock';
        }
    });
}

// ─── Letter Grid ─────────────────────────────────────────────────────────────
function renderLetterGrid(stage) {
    const grid = document.getElementById(`${stage}-letter-grid`);
    grid.innerHTML = '';

    letterState[stage].forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'letter-card' + (item.learned ? ' learned' : '');
        card.innerHTML = `
            <div class="japanese">${item.char}</div>
            <div class="telugu">${item.telugu}</div>
            ${item.learned ? '<div class="learned-badge">✓</div>' : ''}
            <button class="card-speaker" title="Pronounce" onclick="event.stopPropagation(); llSpeak('${item.char}')">🔊</button>
        `;
        card.onclick = () => openStudyModal(stage, index);
        grid.appendChild(card);
    });
}

// ─── Study Modal ──────────────────────────────────────────────────────────────
function openStudyModal(stage, index) {
    currentLetterData  = letterState[stage][index];
    currentLetterIndex = index;
    const modal = document.getElementById('study-modal');

    document.getElementById('modal-japanese').textContent = currentLetterData.char;
    document.getElementById('modal-telugu').textContent   = currentLetterData.telugu;
    document.getElementById('modal-english').textContent  = currentLetterData.english;
    document.getElementById('modal-score').textContent    = currentLetterData.score;
    document.getElementById('modal-correct').textContent  = currentLetterData.correct;
    document.getElementById('modal-wrong').textContent    = currentLetterData.wrong;
    document.getElementById('modal-attempts').textContent = currentLetterData.attempts;

    const examplesDiv = document.getElementById('modal-examples');
    examplesDiv.innerHTML = '<h3>Example Words</h3>';

    currentLetterData.examples.forEach(example => {
        const highlightedWord = example.word.replace(
            new RegExp(currentLetterData.char, 'g'),
            `<span class="highlight">${currentLetterData.char}</span>`
        );
        const exampleCard = document.createElement('div');
        exampleCard.className = 'example-word';
        exampleCard.innerHTML = `
            <div class="word-japanese">
                <span>${highlightedWord}</span>
                <button class="speaker-btn" onclick="llSpeak('${example.word}')" title="Pronounce word">🔊</button>
            </div>
            <div class="word-meanings">
                <div class="meaning"><span class="label">Telugu:</span> ${example.telugu}</div>
                <div class="meaning"><span class="label">English:</span> ${example.english}</div>
                <div class="meaning"><span class="label">Pronunciation:</span> ${example.pronunciation}</div>
            </div>
        `;
        examplesDiv.appendChild(exampleCard);
    });

    const learnBtn = document.getElementById('mark-learned-btn');
    if (currentLetterData.learned) {
        learnBtn.textContent = '✓ Learned';
        learnBtn.classList.add('btn-secondary');
        learnBtn.classList.remove('btn-success');
    } else {
        learnBtn.textContent = '✓ Mark as Learned';
        learnBtn.classList.add('btn-success');
        learnBtn.classList.remove('btn-secondary');
    }
    learnBtn.onclick = () => toggleLearned();

    modal.classList.add('active');
    // Auto-pronounce the character when modal opens
    setTimeout(() => llSpeak(currentLetterData.char), 300);
}

function closeStudyModal() {
    document.getElementById('study-modal').classList.remove('active');
}

function toggleLearned() {
    currentLetterData.learned = !currentLetterData.learned;
    letterState[currentStage][currentLetterIndex] = currentLetterData;
    saveState();
    renderLetterGrid(currentStage);
    updateProgress(currentStage);
    checkUnlocks();
    closeStudyModal();

    var learnedNow = letterState[currentStage].filter(function(i) { return i.learned; }).length;
    if (currentLetterData.learned && learnedNow >= 4) {
        setTimeout(function() { switchSection(currentStage, 'exam'); }, 400);
    }
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function switchStage(stage) {
    const tab = document.querySelector(`[data-stage="${stage}"]`);
    if (tab.classList.contains('locked')) return;

    document.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.stage-content').forEach(s => s.style.display = 'none');
    document.getElementById(`${stage}-stage`).style.display = 'block';

    currentStage   = stage;
    currentSection = 'study';

    document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
    const studyTab = document.querySelector(`#${stage}-stage .section-tab[data-section="study"]`);
    if (studyTab) studyTab.classList.add('active');

    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const studySection = document.getElementById(`${stage}-study`);
    if (studySection) studySection.classList.add('active');
}

function switchSection(stage, section) {
    const stageEl = document.getElementById(`${stage}-stage`);
    stageEl.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
    stageEl.querySelector(`[data-section="${section}"]`).classList.add('active');

    stageEl.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${stage}-${section}`).classList.add('active');

    currentSection = section;
    if (section === 'exam') llStartExam(stage);
}

// ─── Exam ─────────────────────────────────────────────────────────────────────
function llStartExam(stage) {
    const learnedLetters = letterState[stage].filter(item => item.learned);

    let combinedPool = [...learnedLetters];
    if (stage === 'katakana') {
        const hiraganaLearned = letterState.hiragana.filter(item => item.learned);
        combinedPool = [...hiraganaLearned, ...learnedLetters];
    }

    if (combinedPool.length < 4) {
        document.getElementById(`${stage}-exam-container`).innerHTML = `
            <p style="text-align:center;color:var(--color-text-muted);">
                Please mark at least 4 letters as "Learned" to start exams
            </p>
        `;
        return;
    }

    llExamState.confidence   = null;
    llExamState.answered     = false;
    // 4 question types: 0=charToSound, 1=soundToChar, 2=matching, 3=listenAndPick
    llExamState.questionType = Math.floor(Math.random() * 4);

    const weighted = [];
    combinedPool.forEach(letter => {
        const weight = Math.max(1, 100 - letter.score);
        for (let i = 0; i < weight; i++) weighted.push(letter);
    });

    const randomLetter = weighted[Math.floor(Math.random() * weighted.length)];

    // For listen type, exclude cantHear letters — if none left, re-roll another type
    const hearablePool = combinedPool.filter(l => !l.cantHear);
    if (llExamState.questionType === 3 && hearablePool.length < 2) {
        llExamState.questionType = Math.floor(Math.random() * 3); // re-roll 0-2
    }

    if (llExamState.questionType === 0)      generateMultipleChoiceCharToSound(stage, randomLetter, combinedPool);
    else if (llExamState.questionType === 1) generateMultipleChoiceSoundToChar(stage, randomLetter, combinedPool);
    else if (llExamState.questionType === 2) generateMatchingQuestion(stage, combinedPool);
    else {
        // Pick a random letter that CAN be heard
        const hearableWeighted = [];
        hearablePool.forEach(letter => {
            const weight = Math.max(1, 100 - letter.score);
            for (let i = 0; i < weight; i++) hearableWeighted.push(letter);
        });
        const hearableLetter = hearableWeighted[Math.floor(Math.random() * hearableWeighted.length)];
        generateListenAndPickQuestion(stage, hearableLetter, hearablePool);
    }
}

// Type 0 – See character → pick sound
function generateMultipleChoiceCharToSound(stage, correctLetter, pool) {
    const container    = document.getElementById(`${stage}-exam-container`);
    const wrongOptions = pool.filter(l => l !== correctLetter).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions   = [correctLetter, ...wrongOptions].sort(() => Math.random() - 0.5);

    llExamState.currentQuestion = { correctLetter, type: 'charToSound' };

    container.innerHTML = `
        <div class="exam-type-badge">👁️ See → Identify Sound</div>
        <h3 style="text-align:center;margin-bottom:20px;">How confident are you?</h3>
        <div class="confidence-selector">
            <div class="confidence-btn" onclick="selectConfidence('remembered')">✓ Remembered</div>
            <div class="confidence-btn" onclick="selectConfidence('forgot')">✗ Forgot</div>
        </div>
        <div id="question-area" style="">
            <div class="question-text">What is the pronunciation of this character?</div>
            <div class="question-character">
                <span>${correctLetter.char}</span>
                <button class="speaker-btn" style="font-size:2rem;" onclick="llSpeak('${correctLetter.char}')" title="Hear pronunciation">🔊</button>
            </div>
            <div class="options-grid">
                ${allOptions.map(opt => `
                    <div class="option-btn" onclick="answerMultipleChoice('${opt.telugu}', '${correctLetter.telugu}')">
                        ${opt.telugu} (${opt.english})
                        <button class="speaker-btn" onclick="event.stopPropagation(); llSpeak('${opt.char}')" title="Hear">🔊</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Type 1 – See/hear sound → pick character
function generateMultipleChoiceSoundToChar(stage, correctLetter, pool) {
    const container    = document.getElementById(`${stage}-exam-container`);
    const wrongOptions = pool.filter(l => l !== correctLetter).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions   = [correctLetter, ...wrongOptions].sort(() => Math.random() - 0.5);

    llExamState.currentQuestion = { correctLetter, type: 'soundToChar' };

    container.innerHTML = `
        <div class="exam-type-badge">🔤 Sound → Pick Character</div>
        <h3 style="text-align:center;margin-bottom:20px;">How confident are you?</h3>
        <div class="confidence-selector">
            <div class="confidence-btn" onclick="selectConfidence('remembered')">✓ Remembered</div>
            <div class="confidence-btn" onclick="selectConfidence('forgot')">✗ Forgot</div>
        </div>
        <div id="question-area" style="">
            <div class="question-text">
                Which character represents: ${correctLetter.telugu} (${correctLetter.english})?
                <button class="speaker-btn" onclick="llSpeak('${correctLetter.char}')" title="Hear pronunciation" style="margin-left:8px;">🔊</button>
            </div>
            <div class="options-grid">
                ${allOptions.map(opt => `
                    <div class="option-btn" onclick="answerMultipleChoice('${opt.char}', '${correctLetter.char}')" style="font-size:2rem;">
                        ${opt.char}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Type 2 – Matching
function generateMatchingQuestion(stage, pool) {
    const container      = document.getElementById(`${stage}-exam-container`);
    const selectedLetters = pool.sort(() => Math.random() - 0.5).slice(0, 4);
    const shuffledSounds  = [...selectedLetters].sort(() => Math.random() - 0.5);

    llExamState.currentQuestion = {
        type: 'matching',
        pairs: selectedLetters.map(letter => ({ char: letter.char, sound: letter.telugu, letter })),
        matched: [],
        selectedChar: null,
        selectedSound: null
    };

    container.innerHTML = `
        <div class="exam-type-badge">🔗 Match Characters to Sounds</div>
        <h3 style="text-align:center;margin-bottom:20px;">How confident are you?</h3>
        <div class="confidence-selector">
            <div class="confidence-btn" onclick="selectConfidence('remembered')">✓ Remembered</div>
            <div class="confidence-btn" onclick="selectConfidence('forgot')">✗ Forgot</div>
        </div>
        <div id="question-area" style="">
            <div class="question-text">Match each character with its pronunciation</div>
            <div class="matching-container">
                <div class="matching-column">
                    <h4>Characters</h4>
                    ${selectedLetters.map(letter => `
                        <div class="matching-item" data-char="${letter.char}" onclick="selectMatchingChar('${letter.char}')" style="font-size:2rem;">
                            ${letter.char}
                            <button class="speaker-btn" onclick="event.stopPropagation(); llSpeak('${letter.char}')" title="Hear">🔊</button>
                        </div>
                    `).join('')}
                </div>
                <div class="matching-column">
                    <h4>Pronunciations</h4>
                    ${shuffledSounds.map(letter => `
                        <div class="matching-item" data-sound="${letter.telugu}" onclick="selectMatchingSound('${letter.telugu}')">
                            ${letter.telugu} (${letter.english})
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="matching-feedback"></div>
        </div>
    `;
}

// Type 3 – Listen (audio only) → pick character
function generateListenAndPickQuestion(stage, correctLetter, pool) {
    const container    = document.getElementById(`${stage}-exam-container`);
    const wrongOptions = pool.filter(l => l !== correctLetter && !l.cantHear).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions   = [correctLetter, ...wrongOptions].sort(() => Math.random() - 0.5);

    llExamState.currentQuestion = { correctLetter, type: 'listen' };

    container.innerHTML = `
        <div class="exam-type-badge">🔊 Listen → Identify Character</div>
        <div id="question-area" style="">
            <div class="question-text">Listen and pick the correct character:</div>
            <div class="listen-area">
                <button class="speaker-btn-large" onclick="llSpeak('${correctLetter.char}')">
                    🔊 Play Sound
                </button>
                <div class="listen-hint">Tap to hear • Tap again to replay</div>
            </div>
            <div class="options-grid">
                ${allOptions.map(opt => `
                    <div class="option-btn" onclick="answerMultipleChoice('${opt.char}', '${correctLetter.char}')" style="font-size:2rem;">
                        ${opt.char}
                    </div>
                `).join('')}
            </div>
            <div style="text-align:center;margin-top:18px;">
                <button class="cant-hear-btn" onclick="markCantHear('${correctLetter.char}', '${stage}')">
                    🔇 Can't Hear This Sound
                </button>
            </div>
        </div>
    `;

    setTimeout(() => llSpeak(correctLetter.char), 400);
}

// Mark a letter as cant-hear: show its visual info, skip from future listen questions
function markCantHear(char, stage) {
    // Find the letter object
    const letter = letterState[stage].find(l => l.char === char);
    if (!letter) return;

    letter.cantHear = true;
    saveState();

    const container = document.getElementById(`${stage}-exam-container`);
    container.innerHTML = `
        <div class="exam-type-badge" style="background:rgba(251,191,36,0.15);color:#fbbf24;border-color:rgba(251,191,36,0.3);">
            🔇 Marked as Can't Hear
        </div>
        <div style="text-align:center;padding:24px 0;">
            <div style="font-size:5rem;font-family:'Noto Serif JP',serif;margin-bottom:12px;color:var(--cyan);text-shadow:0 0 24px var(--cyan-glow);">
                ${letter.char}
            </div>
            <div style="font-size:2rem;margin-bottom:6px;color:var(--text);">
                ${letter.telugu}
            </div>
            <div style="font-size:1.1rem;color:var(--text-dim);margin-bottom:4px;">
                ${letter.english} &nbsp;·&nbsp; ${toRomaji(letter.char)}
            </div>
            <div style="font-size:0.85rem;color:var(--text-dim);margin-top:16px;padding:10px 20px;background:var(--card);border-radius:8px;display:inline-block;">
                This letter won't appear in 🔊 listen questions anymore
            </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;">
            <button class="btn btn-secondary" onclick="unmarkCantHear('${char}', '${stage}')">
                ↩ Undo — I can hear it
            </button>
            <button class="btn btn-primary" onclick="llStartExam('${stage}')">
                Next Question →
            </button>
        </div>
    `;
}

// Undo cantHear
function unmarkCantHear(char, stage) {
    const letter = letterState[stage].find(l => l.char === char);
    if (letter) { letter.cantHear = false; saveState(); }
    llStartExam(stage);
}

// ─── Confidence Selector ──────────────────────────────────────────────────────
function selectConfidence(type) {
    llExamState.confidence = type;
    document.querySelectorAll('.confidence-btn').forEach(function(btn) {
        btn.classList.remove('selected');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').indexOf(type) !== -1) {
            btn.classList.add('selected');
        }
    });
}

// ─── Answer Handlers ──────────────────────────────────────────────────────────
function answerMultipleChoice(selected, correct) {
    if (llExamState.answered) return;
    if (!llExamState.confidence) llExamState.confidence = "remembered";

    llExamState.answered = true;
    const isCorrect    = selected === correct;
    const correctLetter = llExamState.currentQuestion.correctLetter;

    // Types 1 & 3 = harder scoring (char identification)
    const isHard = llExamState.questionType === 1 || llExamState.questionType === 3;

    let scoreChange = 0;
    if (isCorrect) {
        scoreChange = llExamState.confidence === 'remembered' ? (isHard ? 8 : 5) : (isHard ? 4 : 2.5);
        correctLetter.correct++;
    } else {
        scoreChange = llExamState.confidence === 'remembered' ? (isHard ? -10 : -8) : (isHard ? -5 : -4);
        correctLetter.wrong++;
    }

    correctLetter.score = Math.max(-50, Math.min(100, correctLetter.score + scoreChange));
    correctLetter.attempts++;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';
        const btnChar = btn.textContent.trim().charAt(0);
        if (btn.textContent.includes(correct) || btnChar === correct) btn.classList.add('correct');
        else if (btn.textContent.includes(selected) || btnChar === selected) btn.classList.add('wrong');
    });

    // Speak the correct answer after answering
    llSpeak(correctLetter.char);

    const container   = document.getElementById(`${currentStage}-exam-container`);
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback ' + (isCorrect ? 'correct' : 'wrong');
    feedbackDiv.innerHTML = `
        ${isCorrect ? '✓ Correct!' : '✗ Wrong!'}
        Score: ${correctLetter.score > 0 ? '+' : ''}${Math.round(scoreChange)}
        (Total: ${correctLetter.score})
    `;
    container.appendChild(feedbackDiv);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Next Question';
    nextBtn.onclick = () => llStartExam(currentStage);
    container.appendChild(nextBtn);

    saveState();
    updateProgress(currentStage);
    checkUnlocks();
    renderLetterGrid(currentStage);
}

function selectMatchingChar(char) {
    if (llExamState.answered) return;
    if (!llExamState.confidence) llExamState.confidence = "remembered";

    llExamState.currentQuestion.selectedChar = char;
    document.querySelectorAll('[data-char]').forEach(el => {
        el.classList.remove('selected');
        if (!el.classList.contains('matched') && el.dataset.char === char) el.classList.add('selected');
    });

    if (llExamState.currentQuestion.selectedSound) checkMatch();
}

function selectMatchingSound(sound) {
    if (llExamState.answered) return;
    if (!llExamState.confidence) llExamState.confidence = "remembered";

    llExamState.currentQuestion.selectedSound = sound;
    document.querySelectorAll('[data-sound]').forEach(el => {
        el.classList.remove('selected');
        if (!el.classList.contains('matched') && el.dataset.sound === sound) el.classList.add('selected');
    });

    if (llExamState.currentQuestion.selectedChar) checkMatch();
}

function checkMatch() {
    const { selectedChar, selectedSound, pairs } = llExamState.currentQuestion;
    const correctPair = pairs.find(p => p.char === selectedChar && p.sound === selectedSound);

    if (correctPair) {
        document.querySelector(`[data-char="${selectedChar}"]`).classList.add('matched');
        document.querySelector(`[data-sound="${selectedSound}"]`).classList.add('matched');
        llExamState.currentQuestion.matched.push(correctPair);

        const scoreChange = llExamState.confidence === 'remembered' ? 6 : 3;
        correctPair.letter.score = Math.max(-50, Math.min(100, correctPair.letter.score + scoreChange));
        correctPair.letter.correct++;
        correctPair.letter.attempts++;
        llSpeak(selectedChar);
    } else {
        const charPair  = pairs.find(p => p.char === selectedChar);
        const soundPair = pairs.find(p => p.sound === selectedSound);

        document.querySelector(`[data-char="${selectedChar}"]`).classList.add('wrong');
        document.querySelector(`[data-sound="${selectedSound}"]`).classList.add('wrong');

        setTimeout(() => {
            document.querySelector(`[data-char="${selectedChar}"]`).classList.remove('wrong', 'selected');
            document.querySelector(`[data-sound="${selectedSound}"]`).classList.remove('wrong', 'selected');
        }, 1000);

        const penalty = llExamState.confidence === 'remembered' ? -8 : -4;
        if (charPair) {
            charPair.letter.score = Math.max(-50, Math.min(100, charPair.letter.score + penalty));
            charPair.letter.wrong++;
            charPair.letter.attempts++;
        }
        if (soundPair && soundPair !== charPair) {
            soundPair.letter.score = Math.max(-50, Math.min(100, soundPair.letter.score + penalty));
            soundPair.letter.wrong++;
            soundPair.letter.attempts++;
        }
    }

    llExamState.currentQuestion.selectedChar  = null;
    llExamState.currentQuestion.selectedSound = null;

    if (llExamState.currentQuestion.matched.length === 4) {
        llExamState.answered = true;
        const container   = document.getElementById(`${currentStage}-exam-container`);
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className   = 'feedback correct';
        feedbackDiv.textContent = '✓ All matches complete!';
        container.appendChild(feedbackDiv);

        const nextBtn       = document.createElement('button');
        nextBtn.className   = 'btn btn-primary';
        nextBtn.textContent = 'Next Question';
        nextBtn.onclick     = () => llStartExam(currentStage);
        container.appendChild(nextBtn);
    }

    saveState();
    updateProgress(currentStage);
    checkUnlocks();
    renderLetterGrid(currentStage);
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadState();

    document.querySelectorAll('.stage-tab').forEach(tab => {
        tab.addEventListener('click', () => switchStage(tab.dataset.stage));
    });

    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const stage = tab.closest('.stage-content').id.replace('-stage', '');
            switchSection(stage, tab.dataset.section);
        });
    });

    renderLetterGrid('hiragana');
    renderLetterGrid('katakana');
    renderLetterGrid('kanji');
    updateProgress('hiragana');
    updateProgress('katakana');
    updateProgress('kanji');
    checkUnlocks();
});

document.getElementById('study-modal').addEventListener('click', e => {
    if (e.target.id === 'study-modal') closeStudyModal();
});