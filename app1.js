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

// Always speak as romaji using English TTS — clearest and most universal
function llSpeak(japaneseText) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (!_enVoice) initVoices();

    const utt  = new SpeechSynthesisUtterance();
    utt.text   = toRomaji(japaneseText);
    utt.lang   = 'en-US';
    utt.volume = 1.0;
    utt.rate   = 0.78;
    utt.pitch  = 1.0;
    if (_enVoice) utt.voice = _enVoice;

    window.speechSynthesis.speak(utt);
}

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function() { initVoices(); };
    initVoices();
}

// ─── Data ────────────────────────────────────────────────────────────────────
const hiraganaData = [
    { char: 'あ', telugu: 'a', english: 'a', examples: [{word: 'あめ', telugu: 'rain', english: 'rain', pronunciation: 'ame', breakdown: 'あめ'}] },
    { char: 'い', telugu: 'i', english: 'i', examples: [{word: 'いえ', telugu: 'house', english: 'house', pronunciation: 'ie', breakdown: 'いえ'}] },
    { char: 'う', telugu: 'u', english: 'u', examples: [{word: 'うみ', telugu: 'sea', english: 'sea', pronunciation: 'umi', breakdown: 'うみ'}] },
    { char: 'え', telugu: 'e', english: 'e', examples: [{word: 'えき', telugu: 'station', english: 'station', pronunciation: 'eki', breakdown: 'えき'}] },
    { char: 'お', telugu: 'o', english: 'o', examples: [{word: 'おか', telugu: 'hill', english: 'hill', pronunciation: 'oka', breakdown: 'おか'}] },
    { char: 'か', telugu: 'ka', english: 'ka', examples: [{word: 'かさ', telugu: 'umbrella', english: 'umbrella', pronunciation: 'kasa', breakdown: 'かさ'}] },
    { char: 'き', telugu: 'ki', english: 'ki', examples: [{word: 'きく', telugu: 'chrysanthemum', english: 'chrysanthemum', pronunciation: 'kiku', breakdown: 'きく'}] },
    { char: 'く', telugu: 'ku', english: 'ku', examples: [{word: 'くも', telugu: 'cloud', english: 'cloud', pronunciation: 'kumo', breakdown: 'くも'}] },
    { char: 'け', telugu: 'ke', english: 'ke', examples: [{word: 'けむり', telugu: 'smoke', english: 'smoke', pronunciation: 'kemuri', breakdown: 'けむり'}] },
    { char: 'こ', telugu: 'ko', english: 'ko', examples: [{word: 'こえ', telugu: 'voice', english: 'voice', pronunciation: 'koe', breakdown: 'こえ'}] },
    { char: 'さ', telugu: 'sa', english: 'sa', examples: [{word: 'さかな', telugu: 'fish', english: 'fish', pronunciation: 'sakana', breakdown: 'さかな'}] },
    { char: 'し', telugu: 'shi', english: 'shi', examples: [{word: 'しお', telugu: 'salt', english: 'salt', pronunciation: 'shio', breakdown: 'しお'}] },
    { char: 'す', telugu: 'su', english: 'su', examples: [{word: 'すし', telugu: 'sushi', english: 'sushi', pronunciation: 'sushi', breakdown: 'すし'}] },
    { char: 'せ', telugu: 'se', english: 'se', examples: [{word: 'せかい', telugu: 'world', english: 'world', pronunciation: 'sekai', breakdown: 'せかい'}] },
    { char: 'そ', telugu: 'so', english: 'so', examples: [{word: 'そら', telugu: 'sky', english: 'sky', pronunciation: 'sora', breakdown: 'そら'}] },
    { char: 'た', telugu: 'ta', english: 'ta', examples: [{word: 'たべる', telugu: 'to eat', english: 'to eat', pronunciation: 'taberu', breakdown: 'たべる'}] },
    { char: 'ち', telugu: 'chi', english: 'chi', examples: [{word: 'ちち', telugu: 'father', english: 'father', pronunciation: 'chichi', breakdown: 'ちち'}] },
    { char: 'つ', telugu: 'tsu', english: 'tsu', examples: [{word: 'つき', telugu: 'moon', english: 'moon', pronunciation: 'tsuki', breakdown: 'つき'}] },
    { char: 'て', telugu: 'te', english: 'te', examples: [{word: 'て', telugu: 'hand', english: 'hand', pronunciation: 'te', breakdown: 'て'}] },
    { char: 'と', telugu: 'to', english: 'to', examples: [{word: 'とけい', telugu: 'clock', english: 'clock', pronunciation: 'tokei', breakdown: 'とけい'}] },
    { char: 'な', telugu: 'na', english: 'na', examples: [{word: 'なつ', telugu: 'summer', english: 'summer', pronunciation: 'natsu', breakdown: 'なつ'}] },
    { char: 'に', telugu: 'ni', english: 'ni', examples: [{word: 'にく', telugu: 'meat', english: 'meat', pronunciation: 'niku', breakdown: 'にく'}] },
    { char: 'ぬ', telugu: 'nu', english: 'nu', examples: [{word: 'ぬの', telugu: 'cloth', english: 'cloth', pronunciation: 'nuno', breakdown: 'ぬの'}] },
    { char: 'ね', telugu: 'ne', english: 'ne', examples: [{word: 'ねこ', telugu: 'cat', english: 'cat', pronunciation: 'neko', breakdown: 'ねこ'}] },
    { char: 'の', telugu: 'no', english: 'no', examples: [{word: 'のむ', telugu: 'to drink', english: 'to drink', pronunciation: 'nomu', breakdown: 'のむ'}] },
    { char: 'は', telugu: 'ha', english: 'ha', examples: [{word: 'はな', telugu: 'flower', english: 'flower', pronunciation: 'hana', breakdown: 'はな'}] },
    { char: 'ひ', telugu: 'hi', english: 'hi', examples: [{word: 'ひと', telugu: 'person', english: 'person', pronunciation: 'hito', breakdown: 'ひと'}] },
    { char: 'ふ', telugu: 'fu', english: 'fu', examples: [{word: 'ふゆ', telugu: 'winter', english: 'winter', pronunciation: 'fuyu', breakdown: 'ふゆ'}] },
    { char: 'へ', telugu: 'he', english: 'he', examples: [{word: 'へや', telugu: 'room', english: 'room', pronunciation: 'heya', breakdown: 'へや'}] },
    { char: 'ほ', telugu: 'ho', english: 'ho', examples: [{word: 'ほん', telugu: 'book', english: 'book', pronunciation: 'hon', breakdown: 'ほん'}] },
    { char: 'ま', telugu: 'ma', english: 'ma', examples: [{word: 'まち', telugu: 'town', english: 'town', pronunciation: 'machi', breakdown: 'まち'}] },
    { char: 'み', telugu: 'mi', english: 'mi', examples: [{word: 'みず', telugu: 'water', english: 'water', pronunciation: 'mizu', breakdown: 'みず'}] },
    { char: 'む', telugu: 'mu', english: 'mu', examples: [{word: 'むし', telugu: 'insect', english: 'insect', pronunciation: 'mushi', breakdown: 'むし'}] },
    { char: 'め', telugu: 'me', english: 'me', examples: [{word: 'め', telugu: 'eye', english: 'eye', pronunciation: 'me', breakdown: 'め'}] },
    { char: 'も', telugu: 'mo', english: 'mo', examples: [{word: 'もの', telugu: 'thing', english: 'thing', pronunciation: 'mono', breakdown: 'もの'}] },
    { char: 'や', telugu: 'ya', english: 'ya', examples: [{word: 'やま', telugu: 'mountain', english: 'mountain', pronunciation: 'yama', breakdown: 'やま'}] },
    { char: 'ゆ', telugu: 'yu', english: 'yu', examples: [{word: 'ゆき', telugu: 'snow', english: 'snow', pronunciation: 'yuki', breakdown: 'ゆき'}] },
    { char: 'よ', telugu: 'yo', english: 'yo', examples: [{word: 'よる', telugu: 'night', english: 'night', pronunciation: 'yoru', breakdown: 'よる'}] },
    { char: 'ら', telugu: 'ra', english: 'ra', examples: [{word: 'らいねん', telugu: 'next year', english: 'next year', pronunciation: 'rainen', breakdown: 'らいねん'}] },
    { char: 'り', telugu: 'ri', english: 'ri', examples: [{word: 'りんご', telugu: 'apple', english: 'apple', pronunciation: 'ringo', breakdown: 'りんご'}] },
    { char: 'る', telugu: 'ru', english: 'ru', examples: [{word: 'るす', telugu: 'absence', english: 'absence', pronunciation: 'rusu', breakdown: 'るす'}] },
    { char: 'れ', telugu: 're', english: 're', examples: [{word: 'れい', telugu: 'zero', english: 'zero', pronunciation: 'rei', breakdown: 'れい'}] },
    { char: 'ろ', telugu: 'ro', english: 'ro', examples: [{word: 'ろく', telugu: 'six', english: 'six', pronunciation: 'roku', breakdown: 'ろく'}] },
    { char: 'わ', telugu: 'wa', english: 'wa', examples: [{word: 'わたし', telugu: 'I/me', english: 'I/me', pronunciation: 'watashi', breakdown: 'わたし'}] },
    { char: 'を', telugu: 'wo', english: 'wo', examples: [{word: 'を', telugu: 'object marker', english: 'object marker', pronunciation: 'wo', breakdown: 'を'}] },
    { char: 'ん', telugu: 'n', english: 'n', examples: [{word: 'ほん', telugu: 'book', english: 'book', pronunciation: 'hon', breakdown: 'ほん'}] },
    { char: 'が', telugu: 'ga', english: 'ga', examples: [{word: 'がっこう', telugu: 'school', english: 'school', pronunciation: 'gakkou', breakdown: 'がっこう'}] },
    { char: 'ぎ', telugu: 'gi', english: 'gi', examples: [{word: 'ぎんこう', telugu: 'bank', english: 'bank', pronunciation: 'ginkou', breakdown: 'ぎんこう'}] },
    { char: 'ぐ', telugu: 'gu', english: 'gu', examples: [{word: 'ぐあい', telugu: 'condition', english: 'condition', pronunciation: 'guai', breakdown: 'ぐあい'}] },
    { char: 'げ', telugu: 'ge', english: 'ge', examples: [{word: 'げんき', telugu: 'healthy', english: 'healthy', pronunciation: 'genki', breakdown: 'げんき'}] },
    { char: 'ご', telugu: 'go', english: 'go', examples: [{word: 'ごはん', telugu: 'rice/meal', english: 'rice/meal', pronunciation: 'gohan', breakdown: 'ごはん'}] },
    { char: 'ざ', telugu: 'za', english: 'za', examples: [{word: 'ざっし', telugu: 'magazine', english: 'magazine', pronunciation: 'zasshi', breakdown: 'ざっし'}] },
    { char: 'じ', telugu: 'ji', english: 'ji', examples: [{word: 'じかん', telugu: 'time', english: 'time', pronunciation: 'jikan', breakdown: 'じかん'}] },
    { char: 'ず', telugu: 'zu', english: 'zu', examples: [{word: 'ずっと', telugu: 'always', english: 'always', pronunciation: 'zutto', breakdown: 'ずっと'}] },
    { char: 'ぜ', telugu: 'ze', english: 'ze', examples: [{word: 'ぜんぶ', telugu: 'all', english: 'all', pronunciation: 'zenbu', breakdown: 'ぜんぶ'}] },
    { char: 'ぞ', telugu: 'zo', english: 'zo', examples: [{word: 'ぞう', telugu: 'elephant', english: 'elephant', pronunciation: 'zou', breakdown: 'ぞう'}] },
    { char: 'だ', telugu: 'da', english: 'da', examples: [{word: 'だいがく', telugu: 'university', english: 'university', pronunciation: 'daigaku', breakdown: 'だいがく'}] },
    { char: 'ぢ', telugu: 'ji (di)', english: 'ji (di)', examples: [{word: 'はなぢ', telugu: 'nosebleed', english: 'nosebleed', pronunciation: 'hanaji', breakdown: 'はなぢ'}] },
    { char: 'づ', telugu: 'zu (du)', english: 'zu (du)', examples: [{word: 'つづく', telugu: 'to continue', english: 'to continue', pronunciation: 'tsuzuku', breakdown: 'つづく'}] },
    { char: 'で', telugu: 'de', english: 'de', examples: [{word: 'でんしゃ', telugu: 'train', english: 'train', pronunciation: 'densha', breakdown: 'でんしゃ'}] },
    { char: 'ど', telugu: 'do', english: 'do', examples: [{word: 'どこ', telugu: 'where', english: 'where', pronunciation: 'doko', breakdown: 'どこ'}] },
    { char: 'ば', telugu: 'ba', english: 'ba', examples: [{word: 'ばか', telugu: 'fool', english: 'fool', pronunciation: 'baka', breakdown: 'ばか'}] },
    { char: 'び', telugu: 'bi', english: 'bi', examples: [{word: 'びょういん', telugu: 'hospital', english: 'hospital', pronunciation: 'byouin', breakdown: 'びょういん'}] },
    { char: 'ぶ', telugu: 'bu', english: 'bu', examples: [{word: 'ぶどう', telugu: 'grapes', english: 'grapes', pronunciation: 'budou', breakdown: 'ぶどう'}] },
    { char: 'べ', telugu: 'be', english: 'be', examples: [{word: 'べんきょう', telugu: 'study', english: 'study', pronunciation: 'benkyou', breakdown: 'べんきょう'}] },
    { char: 'ぼ', telugu: 'bo', english: 'bo', examples: [{word: 'ぼうし', telugu: 'hat', english: 'hat', pronunciation: 'boushi', breakdown: 'ぼうし'}] },
    { char: 'ぱ', telugu: 'pa', english: 'pa', examples: [{word: 'ぱん', telugu: 'bread', english: 'bread', pronunciation: 'pan', breakdown: 'ぱん'}] },
    { char: 'ぴ', telugu: 'pi', english: 'pi', examples: [{word: 'ぴあの', telugu: 'piano', english: 'piano', pronunciation: 'piano', breakdown: 'ぴあの'}] },
    { char: 'ぷ', telugu: 'pu', english: 'pu', examples: [{word: 'ぷーる', telugu: 'pool', english: 'pool', pronunciation: 'puuru', breakdown: 'ぷーる'}] },
    { char: 'ぺ', telugu: 'pe', english: 'pe', examples: [{word: 'ぺん', telugu: 'pen', english: 'pen', pronunciation: 'pen', breakdown: 'ぺん'}] },
    { char: 'ぽ', telugu: 'po', english: 'po', examples: [{word: 'ぽけっと', telugu: 'pocket', english: 'pocket', pronunciation: 'poketto', breakdown: 'ぽけっと'}] },
    { char: 'きゃ', telugu: 'kya', english: 'kya', examples: [{word: 'きゃく', telugu: 'guest', english: 'guest', pronunciation: 'kyaku', breakdown: 'きゃく'}] },
    { char: 'きゅ', telugu: 'kyu', english: 'kyu', examples: [{word: 'きゅうり', telugu: 'cucumber', english: 'cucumber', pronunciation: 'kyuuri', breakdown: 'きゅうり'}] },
    { char: 'きょ', telugu: 'kyo', english: 'kyo', examples: [{word: 'きょう', telugu: 'today', english: 'today', pronunciation: 'kyou', breakdown: 'きょう'}] },
    { char: 'しゃ', telugu: 'sha', english: 'sha', examples: [{word: 'しゃしん', telugu: 'photo', english: 'photo', pronunciation: 'shashin', breakdown: 'しゃしん'}] },
    { char: 'しゅ', telugu: 'shu', english: 'shu', examples: [{word: 'しゅくだい', telugu: 'homework', english: 'homework', pronunciation: 'shukudai', breakdown: 'しゅくだい'}] },
    { char: 'しょ', telugu: 'sho', english: 'sho', examples: [{word: 'しょくじ', telugu: 'meal', english: 'meal', pronunciation: 'shokuji', breakdown: 'しょくじ'}] },
    { char: 'ちゃ', telugu: 'cha', english: 'cha', examples: [{word: 'おちゃ', telugu: 'tea', english: 'tea', pronunciation: 'ocha', breakdown: 'おちゃ'}] },
    { char: 'ちゅ', telugu: 'chu', english: 'chu', examples: [{word: 'ちゅうごく', telugu: 'China', english: 'China', pronunciation: 'chuugoku', breakdown: 'ちゅうごく'}] },
    { char: 'ちょ', telugu: 'cho', english: 'cho', examples: [{word: 'ちょっと', telugu: 'a little', english: 'a little', pronunciation: 'chotto', breakdown: 'ちょっと'}] },
    { char: 'にゃ', telugu: 'nya', english: 'nya', examples: [{word: 'にゃー', telugu: 'meow', english: 'meow', pronunciation: 'nyaa', breakdown: 'にゃー'}] },
    { char: 'にゅ', telugu: 'nyu', english: 'nyu', examples: [{word: 'にゅうがく', telugu: 'enrollment', english: 'enrollment', pronunciation: 'nyuugaku', breakdown: 'にゅうがく'}] },
    { char: 'にょ', telugu: 'nyo', english: 'nyo', examples: [{word: 'にょろ', telugu: 'slithering', english: 'slithering', pronunciation: 'nyoro', breakdown: 'にょろ'}] },
    { char: 'ひゃ', telugu: 'hya', english: 'hya', examples: [{word: 'ひゃく', telugu: 'hundred', english: 'hundred', pronunciation: 'hyaku', breakdown: 'ひゃく'}] },
    { char: 'ひゅ', telugu: 'hyu', english: 'hyu', examples: [{word: 'ひゅうひゅう', telugu: 'whistling wind', english: 'whistling wind', pronunciation: 'hyuuhyuu', breakdown: 'ひゅうひゅう'}] },
    { char: 'ひょ', telugu: 'hyo', english: 'hyo', examples: [{word: 'ひょう', telugu: 'hail/table', english: 'hail/table', pronunciation: 'hyou', breakdown: 'ひょう'}] },
    { char: 'みゃ', telugu: 'mya', english: 'mya', examples: [{word: 'みゃく', telugu: 'pulse', english: 'pulse', pronunciation: 'myaku', breakdown: 'みゃく'}] },
    { char: 'みゅ', telugu: 'myu', english: 'myu', examples: [{word: 'みゅーじっく', telugu: 'music', english: 'music', pronunciation: 'myuujikku', breakdown: 'みゅーじっく'}] },
    { char: 'みょ', telugu: 'myo', english: 'myo', examples: [{word: 'みょうじ', telugu: 'surname', english: 'surname', pronunciation: 'myouji', breakdown: 'みょうじ'}] },
    { char: 'りゃ', telugu: 'rya', english: 'rya', examples: [{word: 'りゃくご', telugu: 'abbreviation', english: 'abbreviation', pronunciation: 'ryakugo', breakdown: 'りゃくご'}] },
    { char: 'りゅ', telugu: 'ryu', english: 'ryu', examples: [{word: 'りゅう', telugu: 'dragon', english: 'dragon', pronunciation: 'ryuu', breakdown: 'りゅう'}] },
    { char: 'りょ', telugu: 'ryo', english: 'ryo', examples: [{word: 'りょこう', telugu: 'travel', english: 'travel', pronunciation: 'ryokou', breakdown: 'りょこう'}] },
    { char: 'ぎゃ', telugu: 'gya', english: 'gya', examples: [{word: 'ぎゃく', telugu: 'reverse', english: 'reverse', pronunciation: 'gyaku', breakdown: 'ぎゃく'}] },
    { char: 'ぎゅ', telugu: 'gyu', english: 'gyu', examples: [{word: 'ぎゅうにゅう', telugu: 'milk', english: 'milk', pronunciation: 'gyuunyuu', breakdown: 'ぎゅうにゅう'}] },
    { char: 'ぎょ', telugu: 'gyo', english: 'gyo', examples: [{word: 'ぎょうざ', telugu: 'gyoza', english: 'gyoza', pronunciation: 'gyouza', breakdown: 'ぎょうざ'}] },
    { char: 'じゃ', telugu: 'ja', english: 'ja', examples: [{word: 'じゃあ', telugu: 'well then', english: 'well then', pronunciation: 'jaa', breakdown: 'じゃあ'}] },
    { char: 'じゅ', telugu: 'ju', english: 'ju', examples: [{word: 'じゅうしょ', telugu: 'address', english: 'address', pronunciation: 'juusho', breakdown: 'じゅうしょ'}] },
    { char: 'じょ', telugu: 'jo', english: 'jo', examples: [{word: 'じょせい', telugu: 'woman', english: 'woman', pronunciation: 'josei', breakdown: 'じょせい'}] },
    { char: 'びゃ', telugu: 'bya', english: 'bya', examples: [{word: 'びゃくや', telugu: 'white night', english: 'white night', pronunciation: 'byakuya', breakdown: 'びゃくや'}] },
    { char: 'びゅ', telugu: 'byu', english: 'byu', examples: [{word: 'びゅうびゅう', telugu: 'whooshing', english: 'whooshing', pronunciation: 'byuubyuu', breakdown: 'びゅうびゅう'}] },
    { char: 'びょ', telugu: 'byo', english: 'byo', examples: [{word: 'びょうき', telugu: 'illness', english: 'illness', pronunciation: 'byouki', breakdown: 'びょうき'}] },
    { char: 'ぴゃ', telugu: 'pya', english: 'pya', examples: [{word: 'ぴゃあ', telugu: 'eek!', english: 'eek!', pronunciation: 'pyaa', breakdown: 'ぴゃあ'}] },
    { char: 'ぴゅ', telugu: 'pyu', english: 'pyu', examples: [{word: 'ぴゅう', telugu: 'whoosh', english: 'whoosh', pronunciation: 'pyuu', breakdown: 'ぴゅう'}] },
    { char: 'ぴょ', telugu: 'pyo', english: 'pyo', examples: [{word: 'ぴょんぴょん', telugu: 'hopping', english: 'hopping', pronunciation: 'pyonpyon', breakdown: 'ぴょんぴょん'}] }
];

const katakanaData = [
    { char: 'ア', telugu: 'a', english: 'a', examples: [{word: 'アメリカ', telugu: 'America', english: 'America', pronunciation: 'Amerika', breakdown: 'アメリカ'}] },
    { char: 'イ', telugu: 'i', english: 'i', examples: [{word: 'インド', telugu: 'India', english: 'India', pronunciation: 'Indo', breakdown: 'インド'}] },
    { char: 'ウ', telugu: 'u', english: 'u', examples: [{word: 'ウイスキー', telugu: 'whiskey', english: 'whiskey', pronunciation: 'uisukii', breakdown: 'ウイスキー'}] },
    { char: 'エ', telugu: 'e', english: 'e', examples: [{word: 'エアコン', telugu: 'air conditioner', english: 'air conditioner', pronunciation: 'eakon', breakdown: 'エアコン'}] },
    { char: 'オ', telugu: 'o', english: 'o', examples: [{word: 'オレンジ', telugu: 'orange', english: 'orange', pronunciation: 'orenji', breakdown: 'オレンジ'}] },
    { char: 'カ', telugu: 'ka', english: 'ka', examples: [{word: 'カメラ', telugu: 'camera', english: 'camera', pronunciation: 'kamera', breakdown: 'カメラ'}] },
    { char: 'キ', telugu: 'ki', english: 'ki', examples: [{word: 'キス', telugu: 'kiss', english: 'kiss', pronunciation: 'kisu', breakdown: 'キス'}] },
    { char: 'ク', telugu: 'ku', english: 'ku', examples: [{word: 'クラス', telugu: 'class', english: 'class', pronunciation: 'kurasu', breakdown: 'クラス'}] },
    { char: 'ケ', telugu: 'ke', english: 'ke', examples: [{word: 'ケーキ', telugu: 'cake', english: 'cake', pronunciation: 'keeki', breakdown: 'ケーキ'}] },
    { char: 'コ', telugu: 'ko', english: 'ko', examples: [{word: 'コーヒー', telugu: 'coffee', english: 'coffee', pronunciation: 'koohii', breakdown: 'コーヒー'}] },
    { char: 'サ', telugu: 'sa', english: 'sa', examples: [{word: 'サラダ', telugu: 'salad', english: 'salad', pronunciation: 'sarada', breakdown: 'サラダ'}] },
    { char: 'シ', telugu: 'shi', english: 'shi', examples: [{word: 'シャツ', telugu: 'shirt', english: 'shirt', pronunciation: 'shatsu', breakdown: 'シャツ'}] },
    { char: 'ス', telugu: 'su', english: 'su', examples: [{word: 'スプーン', telugu: 'spoon', english: 'spoon', pronunciation: 'supuun', breakdown: 'スプーン'}] },
    { char: 'セ', telugu: 'se', english: 'se', examples: [{word: 'セーター', telugu: 'sweater', english: 'sweater', pronunciation: 'seetaa', breakdown: 'セーター'}] },
    { char: 'ソ', telugu: 'so', english: 'so', examples: [{word: 'ソース', telugu: 'sauce', english: 'sauce', pronunciation: 'soosu', breakdown: 'ソース'}] },
    { char: 'タ', telugu: 'ta', english: 'ta', examples: [{word: 'タクシー', telugu: 'taxi', english: 'taxi', pronunciation: 'takushii', breakdown: 'タクシー'}] },
    { char: 'チ', telugu: 'chi', english: 'chi', examples: [{word: 'チーズ', telugu: 'cheese', english: 'cheese', pronunciation: 'chiizu', breakdown: 'チーズ'}] },
    { char: 'ツ', telugu: 'tsu', english: 'tsu', examples: [{word: 'ツアー', telugu: 'tour', english: 'tour', pronunciation: 'tsuaa', breakdown: 'ツアー'}] },
    { char: 'テ', telugu: 'te', english: 'te', examples: [{word: 'テレビ', telugu: 'TV', english: 'TV', pronunciation: 'terebi', breakdown: 'テレビ'}] },
    { char: 'ト', telugu: 'to', english: 'to', examples: [{word: 'トイレ', telugu: 'toilet', english: 'toilet', pronunciation: 'toire', breakdown: 'トイレ'}] },
    { char: 'ナ', telugu: 'na', english: 'na', examples: [{word: 'ナイフ', telugu: 'knife', english: 'knife', pronunciation: 'naifu', breakdown: 'ナイフ'}] },
    { char: 'ニ', telugu: 'ni', english: 'ni', examples: [{word: 'ニュース', telugu: 'news', english: 'news', pronunciation: 'nyuusu', breakdown: 'ニュース'}] },
    { char: 'ヌ', telugu: 'nu', english: 'nu', examples: [{word: 'ヌードル', telugu: 'noodles', english: 'noodles', pronunciation: 'nuudoru', breakdown: 'ヌードル'}] },
    { char: 'ネ', telugu: 'ne', english: 'ne', examples: [{word: 'ネクタイ', telugu: 'necktie', english: 'necktie', pronunciation: 'nekutai', breakdown: 'ネクタイ'}] },
    { char: 'ノ', telugu: 'no', english: 'no', examples: [{word: 'ノート', telugu: 'notebook', english: 'notebook', pronunciation: 'nooto', breakdown: 'ノート'}] },
    { char: 'ハ', telugu: 'ha', english: 'ha', examples: [{word: 'ハンバーガー', telugu: 'hamburger', english: 'hamburger', pronunciation: 'hanbaagaa', breakdown: 'ハンバーガー'}] },
    { char: 'ヒ', telugu: 'hi', english: 'hi', examples: [{word: 'ヒーター', telugu: 'heater', english: 'heater', pronunciation: 'hiitaa', breakdown: 'ヒーター'}] },
    { char: 'フ', telugu: 'fu', english: 'fu', examples: [{word: 'フォーク', telugu: 'fork', english: 'fork', pronunciation: 'fooku', breakdown: 'フォーク'}] },
    { char: 'ヘ', telugu: 'he', english: 'he', examples: [{word: 'ヘリコプター', telugu: 'helicopter', english: 'helicopter', pronunciation: 'herikoputaa', breakdown: 'ヘリコプター'}] },
    { char: 'ホ', telugu: 'ho', english: 'ho', examples: [{word: 'ホテル', telugu: 'hotel', english: 'hotel', pronunciation: 'hoteru', breakdown: 'ホテル'}] },
    { char: 'マ', telugu: 'ma', english: 'ma', examples: [{word: 'マスク', telugu: 'mask', english: 'mask', pronunciation: 'masuku', breakdown: 'マスク'}] },
    { char: 'ミ', telugu: 'mi', english: 'mi', examples: [{word: 'ミルク', telugu: 'milk', english: 'milk', pronunciation: 'miruku', breakdown: 'ミルク'}] },
    { char: 'ム', telugu: 'mu', english: 'mu', examples: [{word: 'ムービー', telugu: 'movie', english: 'movie', pronunciation: 'muubii', breakdown: 'ムービー'}] },
    { char: 'メ', telugu: 'me', english: 'me', examples: [{word: 'メール', telugu: 'email', english: 'email', pronunciation: 'meeru', breakdown: 'メール'}] },
    { char: 'モ', telugu: 'mo', english: 'mo', examples: [{word: 'モデル', telugu: 'model', english: 'model', pronunciation: 'moderu', breakdown: 'モデル'}] },
    { char: 'ヤ', telugu: 'ya', english: 'ya', examples: [{word: 'ヤクザ', telugu: 'yakuza', english: 'yakuza', pronunciation: 'yakuza', breakdown: 'ヤクザ'}] },
    { char: 'ユ', telugu: 'yu', english: 'yu', examples: [{word: 'ユニフォーム', telugu: 'uniform', english: 'uniform', pronunciation: 'yunifoomu', breakdown: 'ユニフォーム'}] },
    { char: 'ヨ', telugu: 'yo', english: 'yo', examples: [{word: 'ヨーグルト', telugu: 'yogurt', english: 'yogurt', pronunciation: 'yooguruto', breakdown: 'ヨーグルト'}] },
    { char: 'ラ', telugu: 'ra', english: 'ra', examples: [{word: 'ラーメン', telugu: 'ramen', english: 'ramen', pronunciation: 'raamen', breakdown: 'ラーメン'}] },
    { char: 'リ', telugu: 'ri', english: 'ri', examples: [{word: 'リモコン', telugu: 'remote control', english: 'remote control', pronunciation: 'rimokon', breakdown: 'リモコン'}] },
    { char: 'ル', telugu: 'ru', english: 'ru', examples: [{word: 'ルール', telugu: 'rule', english: 'rule', pronunciation: 'ruuru', breakdown: 'ルール'}] },
    { char: 'レ', telugu: 're', english: 're', examples: [{word: 'レストラン', telugu: 'restaurant', english: 'restaurant', pronunciation: 'resutoran', breakdown: 'レストラン'}] },
    { char: 'ロ', telugu: 'ro', english: 'ro', examples: [{word: 'ロボット', telugu: 'robot', english: 'robot', pronunciation: 'robotto', breakdown: 'ロボット'}] },
    { char: 'ワ', telugu: 'wa', english: 'wa', examples: [{word: 'ワイン', telugu: 'wine', english: 'wine', pronunciation: 'wain', breakdown: 'ワイン'}] },
    { char: 'ヲ', telugu: 'wo', english: 'wo', examples: [{word: 'ヲ', telugu: 'object marker', english: 'object marker', pronunciation: 'wo', breakdown: 'ヲ'}] },
    { char: 'ン', telugu: 'n', english: 'n', examples: [{word: 'パン', telugu: 'bread', english: 'bread', pronunciation: 'pan', breakdown: 'パン'}] },
    { char: 'ガ', telugu: 'ga', english: 'ga', examples: [{word: 'ガラス', telugu: 'glass', english: 'glass', pronunciation: 'garasu', breakdown: 'ガラス'}] },
    { char: 'ギ', telugu: 'gi', english: 'gi', examples: [{word: 'ギター', telugu: 'guitar', english: 'guitar', pronunciation: 'gitaa', breakdown: 'ギター'}] },
    { char: 'グ', telugu: 'gu', english: 'gu', examples: [{word: 'グラス', telugu: 'glass/cup', english: 'glass/cup', pronunciation: 'gurasu', breakdown: 'グラス'}] },
    { char: 'ゲ', telugu: 'ge', english: 'ge', examples: [{word: 'ゲーム', telugu: 'game', english: 'game', pronunciation: 'geemu', breakdown: 'ゲーム'}] },
    { char: 'ゴ', telugu: 'go', english: 'go', examples: [{word: 'ゴリラ', telugu: 'gorilla', english: 'gorilla', pronunciation: 'gorira', breakdown: 'ゴリラ'}] },
    { char: 'ザ', telugu: 'za', english: 'za', examples: [{word: 'ザッハトルテ', telugu: 'Sachertorte', english: 'Sachertorte', pronunciation: 'zahhatorute', breakdown: 'ザッハトルテ'}] },
    { char: 'ジ', telugu: 'ji', english: 'ji', examples: [{word: 'ジュース', telugu: 'juice', english: 'juice', pronunciation: 'juusu', breakdown: 'ジュース'}] },
    { char: 'ズ', telugu: 'zu', english: 'zu', examples: [{word: 'ズボン', telugu: 'trousers', english: 'trousers', pronunciation: 'zubon', breakdown: 'ズボン'}] },
    { char: 'ゼ', telugu: 'ze', english: 'ze', examples: [{word: 'ゼリー', telugu: 'jelly', english: 'jelly', pronunciation: 'zerii', breakdown: 'ゼリー'}] },
    { char: 'ゾ', telugu: 'zo', english: 'zo', examples: [{word: 'ゾンビ', telugu: 'zombie', english: 'zombie', pronunciation: 'zonbi', breakdown: 'ゾンビ'}] },
    { char: 'ダ', telugu: 'da', english: 'da', examples: [{word: 'ダンス', telugu: 'dance', english: 'dance', pronunciation: 'dansu', breakdown: 'ダンス'}] },
    { char: 'ヂ', telugu: 'ji (di)', english: 'ji (di)', examples: [{word: 'ヂ', telugu: 'rare di sound', english: 'rare di sound', pronunciation: 'di', breakdown: 'ヂ'}] },
    { char: 'ヅ', telugu: 'zu (du)', english: 'zu (du)', examples: [{word: 'ヅ', telugu: 'rare du sound', english: 'rare du sound', pronunciation: 'du', breakdown: 'ヅ'}] },
    { char: 'デ', telugu: 'de', english: 'de', examples: [{word: 'デザート', telugu: 'dessert', english: 'dessert', pronunciation: 'dezaato', breakdown: 'デザート'}] },
    { char: 'ド', telugu: 'do', english: 'do', examples: [{word: 'ドア', telugu: 'door', english: 'door', pronunciation: 'doa', breakdown: 'ドア'}] },
    { char: 'バ', telugu: 'ba', english: 'ba', examples: [{word: 'バナナ', telugu: 'banana', english: 'banana', pronunciation: 'banana', breakdown: 'バナナ'}] },
    { char: 'ビ', telugu: 'bi', english: 'bi', examples: [{word: 'ビール', telugu: 'beer', english: 'beer', pronunciation: 'biiru', breakdown: 'ビール'}] },
    { char: 'ブ', telugu: 'bu', english: 'bu', examples: [{word: 'ブルー', telugu: 'blue', english: 'blue', pronunciation: 'buruu', breakdown: 'ブルー'}] },
    { char: 'ベ', telugu: 'be', english: 'be', examples: [{word: 'ベッド', telugu: 'bed', english: 'bed', pronunciation: 'beddo', breakdown: 'ベッド'}] },
    { char: 'ボ', telugu: 'bo', english: 'bo', examples: [{word: 'ボタン', telugu: 'button', english: 'button', pronunciation: 'botan', breakdown: 'ボタン'}] },
    { char: 'パ', telugu: 'pa', english: 'pa', examples: [{word: 'パスポート', telugu: 'passport', english: 'passport', pronunciation: 'pasupooto', breakdown: 'パスポート'}] },
    { char: 'ピ', telugu: 'pi', english: 'pi', examples: [{word: 'ピアノ', telugu: 'piano', english: 'piano', pronunciation: 'piano', breakdown: 'ピアノ'}] },
    { char: 'プ', telugu: 'pu', english: 'pu', examples: [{word: 'プール', telugu: 'pool', english: 'pool', pronunciation: 'puuru', breakdown: 'プール'}] },
    { char: 'ペ', telugu: 'pe', english: 'pe', examples: [{word: 'ペン', telugu: 'pen', english: 'pen', pronunciation: 'pen', breakdown: 'ペン'}] },
    { char: 'ポ', telugu: 'po', english: 'po', examples: [{word: 'ポケット', telugu: 'pocket', english: 'pocket', pronunciation: 'poketto', breakdown: 'ポケット'}] },
    { char: 'キャ', telugu: 'kya', english: 'kya', examples: [{word: 'キャンプ', telugu: 'camp', english: 'camp', pronunciation: 'kyanpu', breakdown: 'キャンプ'}] },
    { char: 'キュ', telugu: 'kyu', english: 'kyu', examples: [{word: 'キューバ', telugu: 'Cuba', english: 'Cuba', pronunciation: 'kyuuba', breakdown: 'キューバ'}] },
    { char: 'キョ', telugu: 'kyo', english: 'kyo', examples: [{word: 'キョート', telugu: 'Kyoto', english: 'Kyoto', pronunciation: 'kyooto', breakdown: 'キョート'}] },
    { char: 'シャ', telugu: 'sha', english: 'sha', examples: [{word: 'シャワー', telugu: 'shower', english: 'shower', pronunciation: 'shawaa', breakdown: 'シャワー'}] },
    { char: 'シュ', telugu: 'shu', english: 'shu', examples: [{word: 'シュークリーム', telugu: 'cream puff', english: 'cream puff', pronunciation: 'shuukuriimu', breakdown: 'シュークリーム'}] },
    { char: 'ショ', telugu: 'sho', english: 'sho', examples: [{word: 'ショッピング', telugu: 'shopping', english: 'shopping', pronunciation: 'shoppingu', breakdown: 'ショッピング'}] },
    { char: 'チャ', telugu: 'cha', english: 'cha', examples: [{word: 'チャンス', telugu: 'chance', english: 'chance', pronunciation: 'chansu', breakdown: 'チャンス'}] },
    { char: 'チュ', telugu: 'chu', english: 'chu', examples: [{word: 'チューリップ', telugu: 'tulip', english: 'tulip', pronunciation: 'chuurippu', breakdown: 'チューリップ'}] },
    { char: 'チョ', telugu: 'cho', english: 'cho', examples: [{word: 'チョコレート', telugu: 'chocolate', english: 'chocolate', pronunciation: 'chokoreeto', breakdown: 'チョコレート'}] },
    { char: 'ニャ', telugu: 'nya', english: 'nya', examples: [{word: 'ニャー', telugu: 'meow', english: 'meow', pronunciation: 'nyaa', breakdown: 'ニャー'}] },
    { char: 'ニュ', telugu: 'nyu', english: 'nyu', examples: [{word: 'ニュートン', telugu: 'Newton', english: 'Newton', pronunciation: 'nyuuton', breakdown: 'ニュートン'}] },
    { char: 'ニョ', telugu: 'nyo', english: 'nyo', examples: [{word: 'ニョキ', telugu: 'sprouting', english: 'sprouting', pronunciation: 'nyoki', breakdown: 'ニョキ'}] },
    { char: 'ヒャ', telugu: 'hya', english: 'hya', examples: [{word: 'ヒャク', telugu: 'hundred', english: 'hundred', pronunciation: 'hyaku', breakdown: 'ヒャク'}] },
    { char: 'ヒュ', telugu: 'hyu', english: 'hyu', examples: [{word: 'ヒューズ', telugu: 'fuse', english: 'fuse', pronunciation: 'hyuuzu', breakdown: 'ヒューズ'}] },
    { char: 'ヒョ', telugu: 'hyo', english: 'hyo', examples: [{word: 'ヒョウ', telugu: 'leopard', english: 'leopard', pronunciation: 'hyou', breakdown: 'ヒョウ'}] },
    { char: 'ミャ', telugu: 'mya', english: 'mya', examples: [{word: 'ミャンマー', telugu: 'Myanmar', english: 'Myanmar', pronunciation: 'myanmaa', breakdown: 'ミャンマー'}] },
    { char: 'ミュ', telugu: 'myu', english: 'myu', examples: [{word: 'ミュージック', telugu: 'music', english: 'music', pronunciation: 'myuujikku', breakdown: 'ミュージック'}] },
    { char: 'ミョ', telugu: 'myo', english: 'myo', examples: [{word: 'ミョウバン', telugu: 'alum', english: 'alum', pronunciation: 'myouban', breakdown: 'ミョウバン'}] },
    { char: 'リャ', telugu: 'rya', english: 'rya', examples: [{word: 'リャマ', telugu: 'llama', english: 'llama', pronunciation: 'ryama', breakdown: 'リャマ'}] },
    { char: 'リュ', telugu: 'ryu', english: 'ryu', examples: [{word: 'リュック', telugu: 'backpack', english: 'backpack', pronunciation: 'ryukku', breakdown: 'リュック'}] },
    { char: 'リョ', telugu: 'ryo', english: 'ryo', examples: [{word: 'リョコウ', telugu: 'travel', english: 'travel', pronunciation: 'ryokou', breakdown: 'リョコウ'}] },
    { char: 'ギャ', telugu: 'gya', english: 'gya', examples: [{word: 'ギャップ', telugu: 'gap', english: 'gap', pronunciation: 'gyappu', breakdown: 'ギャップ'}] },
    { char: 'ギュ', telugu: 'gyu', english: 'gyu', examples: [{word: 'ギュウニク', telugu: 'beef', english: 'beef', pronunciation: 'gyuuniku', breakdown: 'ギュウニク'}] },
    { char: 'ギョ', telugu: 'gyo', english: 'gyo', examples: [{word: 'ギョーザ', telugu: 'gyoza', english: 'gyoza', pronunciation: 'gyooza', breakdown: 'ギョーザ'}] },
    { char: 'ジャ', telugu: 'ja', english: 'ja', examples: [{word: 'ジャケット', telugu: 'jacket', english: 'jacket', pronunciation: 'jaketto', breakdown: 'ジャケット'}] },
    { char: 'ジュ', telugu: 'ju', english: 'ju', examples: [{word: 'ジュース', telugu: 'juice', english: 'juice', pronunciation: 'juusu', breakdown: 'ジュース'}] },
    { char: 'ジョ', telugu: 'jo', english: 'jo', examples: [{word: 'ジョギング', telugu: 'jogging', english: 'jogging', pronunciation: 'jogingu', breakdown: 'ジョギング'}] },
    { char: 'ビャ', telugu: 'bya', english: 'bya', examples: [{word: 'ビャクヤ', telugu: 'white night', english: 'white night', pronunciation: 'byakuya', breakdown: 'ビャクヤ'}] },
    { char: 'ビュ', telugu: 'byu', english: 'byu', examples: [{word: 'ビュッフェ', telugu: 'buffet', english: 'buffet', pronunciation: 'byuffe', breakdown: 'ビュッフェ'}] },
    { char: 'ビョ', telugu: 'byo', english: 'byo', examples: [{word: 'ビョーイン', telugu: 'hospital', english: 'hospital', pronunciation: 'byooin', breakdown: 'ビョーイン'}] },
    { char: 'ピャ', telugu: 'pya', english: 'pya', examples: [{word: 'ピャー', telugu: 'eek!', english: 'eek!', pronunciation: 'pyaa', breakdown: 'ピャー'}] },
    { char: 'ピュ', telugu: 'pyu', english: 'pyu', examples: [{word: 'ピュア', telugu: 'pure', english: 'pure', pronunciation: 'pyua', breakdown: 'ピュア'}] },
    { char: 'ピョ', telugu: 'pyo', english: 'pyo', examples: [{word: 'ピョンヤン', telugu: 'Pyongyang', english: 'Pyongyang', pronunciation: 'pyonyan', breakdown: 'ピョンヤン'}] },
    { char: 'ファ', telugu: 'fa', english: 'fa', examples: [{word: 'ファン', telugu: 'fan', english: 'fan', pronunciation: 'fan', breakdown: 'ファン'}] },
    { char: 'フィ', telugu: 'fi', english: 'fi', examples: [{word: 'フィンランド', telugu: 'Finland', english: 'Finland', pronunciation: 'finrando', breakdown: 'フィンランド'}] },
    { char: 'フェ', telugu: 'fe', english: 'fe', examples: [{word: 'フェリー', telugu: 'ferry', english: 'ferry', pronunciation: 'ferii', breakdown: 'フェリー'}] },
    { char: 'フォ', telugu: 'fo', english: 'fo', examples: [{word: 'フォーク', telugu: 'fork', english: 'fork', pronunciation: 'fooku', breakdown: 'フォーク'}] },
    { char: 'ウィ', telugu: 'wi', english: 'wi', examples: [{word: 'ウィスキー', telugu: 'whisky', english: 'whisky', pronunciation: 'uisukii', breakdown: 'ウィスキー'}] },
    { char: 'ウェ', telugu: 'we', english: 'we', examples: [{word: 'ウェブ', telugu: 'web', english: 'web', pronunciation: 'webu', breakdown: 'ウェブ'}] },
    { char: 'ウォ', telugu: 'wo', english: 'wo', examples: [{word: 'ウォーター', telugu: 'water', english: 'water', pronunciation: 'wootaa', breakdown: 'ウォーター'}] },
    { char: 'ヴァ', telugu: 'va', english: 'va', examples: [{word: 'ヴァイオリン', telugu: 'violin', english: 'violin', pronunciation: 'vaiorin', breakdown: 'ヴァイオリン'}] },
    { char: 'ヴィ', telugu: 'vi', english: 'vi', examples: [{word: 'ヴィラ', telugu: 'villa', english: 'villa', pronunciation: 'vira', breakdown: 'ヴィラ'}] },
    { char: 'ヴ', telugu: 'vu', english: 'vu', examples: [{word: 'ヴ', telugu: 'v sound', english: 'v sound', pronunciation: 'vu', breakdown: 'ヴ'}] },
    { char: 'ヴェ', telugu: 've', english: 've', examples: [{word: 'ヴェネツィア', telugu: 'Venice', english: 'Venice', pronunciation: 'venetsia', breakdown: 'ヴェネツィア'}] },
    { char: 'ヴォ', telugu: 'vo', english: 'vo', examples: [{word: 'ヴォーカル', telugu: 'vocal', english: 'vocal', pronunciation: 'vookaru', breakdown: 'ヴォーカル'}] },
    { char: 'ティ', telugu: 'ti', english: 'ti', examples: [{word: 'パーティ', telugu: 'party', english: 'party', pronunciation: 'paati', breakdown: 'パーティ'}] },
    { char: 'ディ', telugu: 'di', english: 'di', examples: [{word: 'ディスコ', telugu: 'disco', english: 'disco', pronunciation: 'disuko', breakdown: 'ディスコ'}] },
    { char: 'トゥ', telugu: 'tu', english: 'tu', examples: [{word: 'トゥルー', telugu: 'true', english: 'true', pronunciation: 'turuu', breakdown: 'トゥルー'}] },
    { char: 'ドゥ', telugu: 'du', english: 'du', examples: [{word: 'ドゥ', telugu: 'du sound', english: 'du sound', pronunciation: 'du', breakdown: 'ドゥ'}] },
    { char: 'チェ', telugu: 'che', english: 'che', examples: [{word: 'チェック', telugu: 'check', english: 'check', pronunciation: 'chekku', breakdown: 'チェック'}] },
    { char: 'ジェ', telugu: 'je', english: 'je', examples: [{word: 'ジェット', telugu: 'jet', english: 'jet', pronunciation: 'jetto', breakdown: 'ジェット'}] },
    { char: 'イェ', telugu: 'ye', english: 'ye', examples: [{word: 'イェス', telugu: 'yes', english: 'yes', pronunciation: 'yesu', breakdown: 'イェス'}] },
    { char: 'クァ', telugu: 'kwa', english: 'kwa', examples: [{word: 'クァルテット', telugu: 'quartet', english: 'quartet', pronunciation: 'kuarutetto', breakdown: 'クァルテット'}] },
    { char: 'クィ', telugu: 'kwi', english: 'kwi', examples: [{word: 'クィーン', telugu: 'queen', english: 'queen', pronunciation: 'kuiin', breakdown: 'クィーン'}] },
    { char: 'クェ', telugu: 'kwe', english: 'kwe', examples: [{word: 'クェスチョン', telugu: 'question', english: 'question', pronunciation: 'kuesuchon', breakdown: 'クェスチョン'}] },
    { char: 'クォ', telugu: 'kwo', english: 'kwo', examples: [{word: 'クォーター', telugu: 'quarter', english: 'quarter', pronunciation: 'kuootaa', breakdown: 'クォーター'}] },
    { char: 'グァ', telugu: 'gwa', english: 'gwa', examples: [{word: 'グァム', telugu: 'Guam', english: 'Guam', pronunciation: 'guamu', breakdown: 'グァム'}] },
    { char: 'テュ', telugu: 'tyu', english: 'tyu', examples: [{word: 'テュニジア', telugu: 'Tunisia', english: 'Tunisia', pronunciation: 'tyuniia', breakdown: 'テュニジア'}] },
    { char: 'デュ', telugu: 'dyu', english: 'dyu', examples: [{word: 'デュエット', telugu: 'duet', english: 'duet', pronunciation: 'dyuetto', breakdown: 'デュエット'}] },
    { char: 'スィ', telugu: 'si', english: 'si', examples: [{word: 'スィ', telugu: 'si sound', english: 'si sound', pronunciation: 'si', breakdown: 'スィ'}] },
    { char: 'ズィ', telugu: 'zi', english: 'zi', examples: [{word: 'ズィ', telugu: 'zi sound', english: 'zi sound', pronunciation: 'zi', breakdown: 'ズィ'}] }
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

// Track last 12 chars asked so the same letter can't repeat within 10 questions
let llRecentHistory = [];

// ─── Persistence ─────────────────────────────────────────────────────────────
function loadState() {
    try {
        var saved = localStorage.getItem('japaneseLearnState');
        if (!saved) return;
        var loaded = JSON.parse(saved);

        // Merge helper: preserve saved progress for known chars,
        // but keep any new chars from the current data that aren't in the save yet
        function mergeStage(currentState, savedArray) {
            if (!savedArray || !Array.isArray(savedArray)) return currentState;
            var savedMap = {};
            savedArray.forEach(function(s) { if (s.char) savedMap[s.char] = s; });
            return currentState.map(function(item) {
                var s = savedMap[item.char];
                if (s) {
                    // Restore saved progress, keep all base data from current source
                    return Object.assign({}, item, {
                        score:    s.score    !== undefined ? s.score    : 0,
                        correct:  s.correct  !== undefined ? s.correct  : 0,
                        wrong:    s.wrong    !== undefined ? s.wrong    : 0,
                        attempts: s.attempts !== undefined ? s.attempts : 0,
                        learned:  s.learned  !== undefined ? s.learned  : false,
                        cantHear: s.cantHear !== undefined ? s.cantHear : false
                    });
                }
                // New char not in save — fresh state
                return item;
            });
        }

        letterState.hiragana = mergeStage(letterState.hiragana, loaded.hiragana);
        letterState.katakana = mergeStage(letterState.katakana, loaded.katakana);
        letterState.kanji    = mergeStage(letterState.kanji,    loaded.kanji);
    } catch(e) {
        console.warn('loadState error:', e);
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
    const percent  = total > 0 ? Math.round((mastered / total) * 100) : 0;

    document.getElementById(`${stage}-learned-count`).textContent  = learned;
    document.getElementById(`${stage}-mastered-count`).textContent = mastered;

    // Update total spans if they exist
    const t1 = document.getElementById(`${stage}-total`);
    const t2 = document.getElementById(`${stage}-total2`);
    if (t1) t1.textContent = total;
    if (t2) t2.textContent = total;

    const bar = document.getElementById(`${stage}-progress`);
    bar.style.width  = percent + '%';
    bar.textContent  = percent + '%';
}

function checkUnlocks() {
    const hiraganaAllMastered = letterState.hiragana.every(i => i.score >= 30);
    const katakanaAllMastered = letterState.katakana.every(i => i.score >= 30);
    const hiraganaAllLearned  = letterState.hiragana.every(i => i.learned);
    const katakanaAllLearned  = letterState.katakana.every(i => i.learned);

    // Unlock katakana once hiragana is fully mastered
    if (hiraganaAllMastered)
        document.querySelector('[data-stage="katakana"]').classList.remove('locked');

    // Unlock kanji once both are mastered
    if (hiraganaAllMastered && katakanaAllMastered)
        document.querySelector('[data-stage="kanji"]').classList.remove('locked');

    // Unlock typing once BOTH hiragana AND katakana are fully learned (not need mastered)
    if (hiraganaAllLearned && katakanaAllLearned) {
        document.querySelector('[data-stage="typing"]').classList.remove('locked');
        initTypingExam();
    }

    // Unlock/dim exam tabs per stage
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

    // If switching to typing stage, render the typing exam
    if (stage === 'typing') {
        initTypingExam();
    }

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

    // STRICT: each stage only tests its own script characters
    const stageCharSets = { hiragana: hiraganaData, katakana: katakanaData, kanji: kanjiData };
    const validChars = new Set((stageCharSets[stage] || []).map(l => l.char));
    const combinedPool = learnedLetters.filter(l => validChars.has(l.char));

    if (combinedPool.length < 4) {
        document.getElementById(`${stage}-exam-container`).innerHTML = `
            <p style="text-align:center;color:var(--color-text-muted);">
                Please mark at least 4 letters as "Learned" to start exams
            </p>
        `;
        return;
    }

    // Prefer letters NOT seen in last 10 questions (if pool is big enough)
    const freshPool = combinedPool.filter(l => !llRecentHistory.slice(-10).includes(l.char));
    const pickPool  = freshPool.length >= 2 ? freshPool : combinedPool;

    const weighted = [];
    pickPool.forEach(letter => {
        const weight = Math.max(1, 100 - letter.score);
        for (let i = 0; i < weight; i++) weighted.push(letter);
    });

    const randomLetter = weighted[Math.floor(Math.random() * weighted.length)];

    // Record in recent history (keep last 12)
    llRecentHistory.push(randomLetter.char);
    if (llRecentHistory.length > 12) llRecentHistory.shift();

    // Reset answer state + pick question type
    llExamState.confidence   = null;
    llExamState.answered     = false;
    llExamState.questionType = Math.floor(Math.random() * 4);

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
                    <div class="option-btn" onclick="answerMultipleChoice('${opt.english}', '${correctLetter.english}')">
                        <strong style="font-size:1.1rem;">${opt.english}</strong>
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
                Which character represents: <strong style="color:var(--gold-bright);font-size:1.2em;">${correctLetter.english}</strong>?
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
                            <strong>${letter.english}</strong>
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

    if (isCorrect) {
        // Auto-advance after 2 seconds
        const countdown = document.createElement('div');
        countdown.style.cssText = 'text-align:center;color:var(--text-dim);font-family:Cinzel,serif;font-size:11px;letter-spacing:0.10em;margin-top:10px;';
        countdown.textContent = 'Next question in 2s…';
        container.appendChild(countdown);
        setTimeout(function() { llStartExam(currentStage); }, 2000);
    } else {
        // Show a review card so the user can learn the correct character
        showWrongReviewCard(container, correctLetter);
    }

    saveState();
    updateProgress(currentStage);
    checkUnlocks();
    renderLetterGrid(currentStage);
}

// Show a learning card after a wrong answer
function showWrongReviewCard(container, letter) {
    var eg = letter.examples && letter.examples[0];
    var card = document.createElement('div');
    card.innerHTML = `
        <div style="margin-top:20px;background:var(--card);border:1px solid rgba(204,48,48,0.28);border-top:2px solid var(--red);border-radius:var(--r-lg);padding:22px;text-align:center;">
            <div style="font-family:'Cinzel',serif;font-size:10px;font-weight:700;color:var(--red);letter-spacing:0.16em;margin-bottom:14px;">📖 REVIEW THIS CHARACTER</div>
            <div style="font-size:4.5rem;font-family:'Noto Serif JP',serif;color:var(--gold-bright);text-shadow:0 0 28px var(--gold-glow);margin-bottom:8px;">${letter.char}
                <button class="speaker-btn" style="font-size:1.8rem;vertical-align:middle;" onclick="llSpeak('${letter.char}')">🔊</button>
            </div>
            <div style="font-size:1.6rem;font-weight:700;color:var(--text);margin-bottom:4px;">${letter.english}</div>
            ${eg ? `
            <div style="margin-top:14px;padding:12px 16px;background:var(--surface);border-radius:var(--r-sm);border:1px solid var(--border);text-align:left;">
                <div style="font-size:1.5rem;font-family:'Noto Serif JP',serif;margin-bottom:5px;color:var(--text);">${eg.word}
                    <button class="speaker-btn" onclick="llSpeak('${eg.word}')">🔊</button>
                </div>
                <div style="font-size:13px;color:var(--gold);font-style:italic;">${eg.pronunciation} — ${eg.english}</div>
            </div>` : ''}
            <button class="btn btn-primary" style="margin-top:18px;width:100%;font-family:'Cinzel',serif;" onclick="llStartExam('${currentStage}')">Next Question →</button>
        </div>
    `;
    container.appendChild(card);
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
        feedbackDiv.textContent = '✓ All matches complete! Next question in 2s…';
        container.appendChild(feedbackDiv);
        // Auto-advance after 2 seconds
        setTimeout(() => llStartExam(currentStage), 2000);
    }

    saveState();
    updateProgress(currentStage);
    checkUnlocks();
    renderLetterGrid(currentStage);
}

// ─── Typing Exam ──────────────────────────────────────────────────────────────
var typingState = {
    includeKanji: false,
    currentChar: null,
    streak: 0,
    total: 0,
    correct: 0,
    recentHistory: []
};

function initTypingExam() {
    var container = document.getElementById('typing-exam-container');
    if (!container) return;
    var hiLearned = letterState.hiragana.filter(i => i.learned);
    var kaLearned = letterState.katakana.filter(i => i.learned);
    if (hiLearned.length === 0 && kaLearned.length === 0) return;
    renderTypingExam();
}

function renderTypingExam() {
    var container = document.getElementById('typing-exam-container');
    if (!container) return;

    // Build pool based on kanji toggle
    var pool = [
        ...letterState.hiragana.filter(i => i.learned),
        ...letterState.katakana.filter(i => i.learned)
    ];
    if (typingState.includeKanji) {
        pool = pool.concat(letterState.kanji.filter(i => i.learned));
    }
    if (pool.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:30px 0;">No letters available.</p>';
        return;
    }

    // Avoid recent repeats (10-question gap)
    var fresh = pool.filter(l => !typingState.recentHistory.slice(-10).includes(l.char));
    var pickPool = fresh.length >= 2 ? fresh : pool;
    var pick = pickPool[Math.floor(Math.random() * pickPool.length)];
    typingState.currentChar = pick;

    typingState.recentHistory.push(pick.char);
    if (typingState.recentHistory.length > 12) typingState.recentHistory.shift();

    var accuracy = typingState.total > 0 ? Math.round((typingState.correct / typingState.total) * 100) : 0;

    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-dim);">Streak: <strong style="color:var(--gold);">${typingState.streak}</strong></span>
                <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-dim);">Accuracy: <strong style="color:var(--green);">${accuracy}%</strong></span>
            </div>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;color:var(--text-mid);background:var(--card);padding:6px 14px;border-radius:var(--r-sm);border:1px solid var(--border);">
                <input type="checkbox" id="kanjiToggle" ${typingState.includeKanji ? 'checked' : ''} onchange="toggleKanji()" style="accent-color:var(--gold);width:14px;height:14px;">
                Include Kanji
            </label>
        </div>
        <div style="text-align:center;padding:30px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);position:relative;overflow:hidden;">
            <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0.20;"></div>
            <div style="font-family:'Cinzel',serif;font-size:10px;font-weight:700;color:var(--gold);letter-spacing:0.16em;margin-bottom:18px;">⌨️ TYPE THE ROMAJI</div>
            <div style="font-size:5.5rem;font-family:'Noto Serif JP',serif;color:var(--gold-bright);text-shadow:0 0 32px var(--gold-glow);margin-bottom:6px;" id="typingChar">${pick.char}</div>
            <div style="margin-bottom:22px;">
                <button class="speaker-btn" style="font-size:1.6rem;" onclick="llSpeak('${pick.char}')">🔊</button>
            </div>
            <div style="max-width:320px;margin:0 auto;">
                <input type="text" id="typingInput"
                    style="width:100%;padding:14px 18px;background:var(--card);border:2px solid var(--border);border-radius:var(--r-md);color:var(--text);font-family:'Crimson Pro',serif;font-size:1.3rem;text-align:center;outline:none;transition:border-color 0.25s;letter-spacing:0.10em;"
                    placeholder="type romaji here…"
                    oninput="this.style.borderColor='var(--border)'"
                    onkeydown="if(event.key==='Enter')checkTyping()">
                <div id="typingFeedback" style="margin-top:12px;min-height:32px;"></div>
                <button class="big-btn" style="margin-top:14px;" onclick="checkTyping()">Check ✓</button>
                <button class="big-btn ghost" style="margin-top:6px;" onclick="renderTypingExam()">Skip →</button>
            </div>
        </div>
    `;
    // Auto-focus the input
    setTimeout(function(){ var el = document.getElementById('typingInput'); if(el) el.focus(); }, 100);
}

function checkTyping() {
    var input = document.getElementById('typingInput');
    var feedback = document.getElementById('typingFeedback');
    if (!input || !feedback) return;

    var typed   = input.value.trim().toLowerCase();
    var correct = typingState.currentChar.english.toLowerCase();
    // Also accept toRomaji output as valid
    var romajiAnswer = toRomaji(typingState.currentChar.char).toLowerCase();
    var isCorrect = typed === correct || typed === romajiAnswer;

    typingState.total++;
    if (isCorrect) {
        typingState.correct++;
        typingState.streak++;
        // Update score
        typingState.currentChar.score = Math.min(100, typingState.currentChar.score + 3);
        typingState.currentChar.correct++;
        typingState.currentChar.attempts++;

        input.style.borderColor = 'var(--green)';
        feedback.innerHTML = `<span style="color:var(--green);font-family:'Cinzel',serif;font-size:12px;font-weight:700;">✓ Correct! &nbsp;<em style="color:var(--text-dim);font-weight:400;">${correct}</em></span>`;
        saveState();
        // Auto-advance after 1.5s
        setTimeout(function() { renderTypingExam(); }, 1500);
    } else {
        typingState.streak = 0;
        typingState.currentChar.score = Math.max(-50, typingState.currentChar.score - 4);
        typingState.currentChar.wrong++;
        typingState.currentChar.attempts++;

        input.style.borderColor = 'var(--red)';
        feedback.innerHTML = `
            <span style="color:var(--red);font-family:'Cinzel',serif;font-size:12px;font-weight:700;">✗ Wrong</span>
            <span style="color:var(--text-dim);font-size:13px;margin-left:10px;">Answer: <strong style="color:var(--gold);">${correct}</strong></span>
        `;
        saveState();
        // Don't auto-advance on wrong — let user read the answer
    }
}

function toggleKanji() {
    typingState.includeKanji = document.getElementById('kanjiToggle').checked;
    renderTypingExam();
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