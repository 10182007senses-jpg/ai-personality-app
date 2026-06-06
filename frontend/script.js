const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const startScreen = document.getElementById("start-screen");
const questionLoadingScreen = document.getElementById("question-loading-screen");
const questionScreen = document.getElementById("question-screen");
const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const homeButton = document.getElementById("home-button");
const questionCount = document.getElementById("question-count");
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const questionLoadingStage = document.getElementById("question-loading-stage");
const questionLoadingTitle = document.getElementById("question-loading-title");
const questionLoadingText = document.getElementById("question-loading-text");
const loadingStage = document.getElementById("loading-stage");
const loadingTitle = document.getElementById("loading-title");
const loadingStatusText = document.getElementById("loading-status-text");
const resultTitle = document.getElementById("result-title");
const resultCopy = document.getElementById("result-copy");
const resultSubtype = document.getElementById("result-subtype");
const resultDescription = document.getElementById("result-description");
const resultRecommendation = document.getElementById("result-recommendation");
const resultThemeBadge = document.getElementById("result-theme-badge");
const resultThemeDescription = document.getElementById("result-theme-description");
const resultTags = document.getElementById("result-tags");
const resultTraits = document.getElementById("result-traits");
const resultInnerTags = document.getElementById("result-inner-tags");
const resultLoveTags = document.getElementById("result-love-tags");
const resultCompatibility = document.getElementById("result-compatibility");
const resultCompatibilityLabel = document.getElementById("result-compatibility-label");
const resultMatrix = document.getElementById("result-matrix");
const resultMatrixLabel = document.getElementById("result-matrix-label");
const resultCarousel = document.getElementById("result-carousel");
const resultCarouselPrev = document.getElementById("carousel-prev");
const resultCarouselNext = document.getElementById("carousel-next");
const resultCarouselDots = document.getElementById("carousel-dots");
const auraCoreText = document.getElementById("aura-core-text");
const otherInputArea = document.getElementById("other-input-area");
const otherText = document.getElementById("other-text");
const otherCharCount = document.getElementById("other-char-count");
const otherSubmitButton = document.getElementById("other-submit");
const particleField = document.getElementById("particle-field");
const brandChip = document.getElementById("brand-chip");
const langSwitcher = document.getElementById("lang-switcher");
const languageButtons = Array.from(document.querySelectorAll(".lang-button"));
const heroKicker = document.getElementById("hero-kicker");
const heroTitle = document.getElementById("hero-title");
const heroCatch = document.getElementById("hero-catch");
const heroLead = document.getElementById("hero-lead");
const heroTags = [
    document.getElementById("hero-tag-1"),
    document.getElementById("hero-tag-2"),
    document.getElementById("hero-tag-3")
];
const floatingNotes = [
    document.getElementById("floating-note-1"),
    document.getElementById("floating-note-2"),
    document.getElementById("floating-note-3")
];
const questionKicker = document.getElementById("question-kicker");
const loadingTags = [
    document.getElementById("loading-tag-1"),
    document.getElementById("loading-tag-2"),
    document.getElementById("loading-tag-3")
];
const resultKicker = document.getElementById("result-kicker");
const resultDescriptionLabel = document.getElementById("result-description-label");
const resultRecommendationLabel = document.getElementById("result-recommendation-label");
const resultSlides = Array.from(document.querySelectorAll(".result-slide"));

const screens = [
    startScreen,
    questionLoadingScreen,
    questionScreen,
    loadingScreen,
    resultScreen
];

const choiceLetters = ["A", "B", "C", "D"];
const LANGUAGE_STORAGE_KEY = "ai-love-language";
const HTML_LANG_MAP = {
    ja: "ja",
    en: "en",
    zh: "zh-CN",
    ko: "ko"
};

const TYPE_ORDER = ["Apple", "Google", "Amazon", "Microsoft", "Tesla", "Meta", "Nvidia", "Netflix"];
const TYPE_ABBR = {
    Apple: "Ap", Google: "Go", Amazon: "Am", Microsoft: "Ms",
    Tesla: "Te", Meta: "Me", Nvidia: "Nv", Netflix: "Nf"
};
const STATIC_COMPATIBILITY = {
    Apple:     { Google: 2, Amazon: 1, Microsoft: 3, Tesla: 2, Meta: 2, Nvidia: 3, Netflix: 2 },
    Google:    { Apple: 2, Amazon: 3, Microsoft: 1, Tesla: 2, Meta: 3, Nvidia: 1, Netflix: 2 },
    Amazon:    { Apple: 1, Google: 3, Microsoft: 2, Tesla: 3, Meta: 1, Nvidia: 1, Netflix: 1 },
    Microsoft: { Apple: 3, Google: 1, Amazon: 2, Tesla: 1, Meta: 3, Nvidia: 3, Netflix: 2 },
    Tesla:     { Apple: 2, Google: 2, Amazon: 3, Microsoft: 1, Meta: 2, Nvidia: 2, Netflix: 3 },
    Meta:      { Apple: 2, Google: 3, Amazon: 1, Microsoft: 3, Tesla: 2, Nvidia: 2, Netflix: 3 },
    Nvidia:    { Apple: 3, Google: 1, Amazon: 1, Microsoft: 3, Tesla: 2, Meta: 2, Netflix: 2 },
    Netflix:   { Apple: 2, Google: 2, Amazon: 1, Microsoft: 2, Tesla: 3, Meta: 3, Nvidia: 2 }
};
const MATRIX_SYMBOLS = { 3: "◎", 2: "○", 1: "△" };

const translations = {
    ja: {
        metaTitle: "AIパーソナリティ診断",
        languageSwitcherLabel: "言語切り替え",
        brand: "AIパーソナリティ診断",
        heroKicker: "AIパーソナリティ診断",
        heroTitle: "AIパーソナリティ診断",
        heroCatch: "あなたの「隠れた個性」\nAIに見抜かれてみる？",
        heroLead: "直感で答えるだけで、あなたの思考パターンや行動の癖、個性の空気感を鮮やかに可視化します。",
        heroTags: ["#個性", "#思考のクセ", "#スクショしたい"],
        floatingNotes: ["隠れた個性", "思考パターン", "本音フィルター"],
        auraCore: "YOU",
        otherButton: "その他",
        otherPlaceholder: "自分で書いてみる...",
        otherSubmit: "送信",
        otherSubmitLoading: "分析中...",
        otherHint: "AIがあなたの回答を分析します",
        otherMinCharsHint: "5文字以上で送信できます",
        startButton: "診断スタート",
        questionLoadingTitle: "あなた向けの質問をえらんでいます",
        questionLoadingSequence: [
            {
                stage: "質問を準備中",
                text: "個性が自然に出やすいように、やさしく答えやすい順番へ整えています。"
            },
            {
                stage: "あなた向けに調整中",
                text: "思考パターンや行動の癖が見えやすいように、質問のムードをふわっと合わせています。"
            },
            {
                stage: "まもなくスタート",
                text: "直感で答えるほど、あなたらしい個性がくっきり見えてきます。"
            }
        ],
        questionKicker: "気分に近いものをタップ",
        questionPlaceholder: "質問がここに表示されます。",
        choiceHint: "タップして選ぶ",
        loadingStage: "パーソナリティをまとめています",
        loadingTitle: "あなたの個性をやさしく整理中",
        resultLoadingSequence: [
            "思考パターンや行動の癖を、やさしくまとめています。",
            "あなたの個性が出やすい瞬間を、丁寧に読み取っています。",
            "あなたのパーソナリティを、スクショしたくなる形に仕上げています。"
        ],
        loadingTags: ["個性", "思考", "行動パターン"],
        resultKicker: "あなたのパーソナリティ",
        resultTitle: "診断結果",
        resultSubtypePrefix: "近い個性",
        resultDescriptionLabel: "AIが読んだ個性",
        resultRecommendationLabel: "恋愛モード",
        resultCompatibilityLabel: "相性の良いタイプ",
        resultMatrixLabel: "相性マップ",
        matrixReasons: { 3: "最も相性がいいタイプです。", 2: "相性がいいタイプです。", 1: "関わり方次第で相性が出るタイプです。" },
        compatibilityPlaceholder: "もう一度診断すると相性タイプが表示されます。",
        carouselPagesLabel: "結果カード",
        carouselDotLabel: "結果カード",
        carouselPrev: "前へ",
        carouselNext: "次へ",
        restartButton: "もう一度診断する",
        homeButton: "ホームに戻る",
        errorStartTitle: "ちょっと準備に失敗しました",
        errorStartCopy: "質問の表示に少し時間がかかっています。",
        errorStartDescription: "少し待ってから、もう一度診断してみてください。",
        errorResultTitle: "ちょっと時間がかかっています",
        errorResultAbortCopy: "結果の整理に少しだけ時間がかかっています。",
        errorResultCopy: "結果の表示に失敗しました。",
        errorResultDescription: "通信環境を確認して、もう一度診断してみてください。",
        errorResultRecommendation: "もう一度はじめると、パーソナリティをやさしく表示し直します。",
        classifyingAnswers: "あなたの回答をひとつひとつ分析しています..."
    },
    en: {
        metaTitle: "AI Personality Test",
        languageSwitcherLabel: "Language",
        brand: "AI Personality Test",
        heroKicker: "AI Personality Test",
        heroTitle: "AI Personality Test",
        heroCatch: "Want AI to read\nyour hidden personality?",
        heroLead: "Answer on instinct and turn your thought patterns, behavioral habits, and personal vibe into a shareable card.",
        heroTags: ["#Personality", "#TrueColors", "#ScreenshotWorthy"],
        floatingNotes: ["Hidden Self", "Thought Pattern", "Inner Voice"],
        auraCore: "YOU",
        otherButton: "Other",
        otherPlaceholder: "Write your own answer...",
        otherSubmit: "Submit",
        otherSubmitLoading: "Analyzing...",
        otherHint: "AI will analyze your answer",
        otherMinCharsHint: "At least 5 characters to submit",
        startButton: "Start Test",
        questionLoadingTitle: "Picking questions that match your vibe",
        questionLoadingSequence: [
            {
                stage: "Preparing questions",
                text: "We are lining them up so your natural personality shows up without overthinking."
            },
            {
                stage: "Tuning the flow",
                text: "The prompts are being adjusted so your real traits and habits come through clearly."
            },
            {
                stage: "Almost ready",
                text: "The more instinctively you answer, the more your true personality will come through."
            }
        ],
        questionKicker: "Tap what feels most like you",
        questionPlaceholder: "Your question will show up here.",
        choiceHint: "Tap to choose",
        loadingStage: "Mapping your personality",
        loadingTitle: "Gently reading your personality",
        resultLoadingSequence: [
            "Sorting your thought patterns and behavioral tendencies.",
            "Finding the traits that make your personality stand out.",
            "Wrapping your personality into something worth screenshotting."
        ],
        loadingTags: ["personality", "patterns", "inner self"],
        resultKicker: "Your personality",
        resultTitle: "Your Result",
        resultSubtypePrefix: "Close type",
        resultDescriptionLabel: "Your personality read",
        resultRecommendationLabel: "Love mode",
        resultCompatibilityLabel: "Best Match Types",
        resultMatrixLabel: "Compatibility Map",
        matrixReasons: { 3: "Your best match type.", 2: "A good match type.", 1: "Compatible depending on how you connect." },
        compatibilityPlaceholder: "Run the diagnosis again to reveal your best matches.",
        carouselPagesLabel: "Result cards",
        carouselDotLabel: "Result card",
        carouselPrev: "Prev",
        carouselNext: "Next",
        restartButton: "Try Again",
        homeButton: "Back to Home",
        errorStartTitle: "We hit a small setup glitch",
        errorStartCopy: "The questions are taking a little longer to appear.",
        errorStartDescription: "Give it a moment, then try the test again.",
        errorResultTitle: "This is taking a little longer",
        errorResultAbortCopy: "Your result needs a few more seconds to come together.",
        errorResultCopy: "We could not show your result this time.",
        errorResultDescription: "Please check your connection and try again.",
        errorResultRecommendation: "Start over and we will refresh your personality card.",
        classifyingAnswers: "Analyzing each of your answers..."
    },
    zh: {
        metaTitle: "AI性格测试",
        languageSwitcherLabel: "语言切换",
        brand: "AI性格测试",
        heroKicker: "AI性格测试",
        heroTitle: "AI性格测试",
        heroCatch: "让 AI 看穿\n你隐藏的个性？",
        heroLead: "凭直觉回答几个问题，就能把你的思维方式、行为习惯和个性氛围变成一张精准的分享卡。",
        heroTags: ["#个性", "#思维习惯", "#想截图"],
        floatingNotes: ["隐藏个性", "思维模式", "真心滤镜"],
        auraCore: "YOU",
        otherButton: "其他",
        otherPlaceholder: "自己填写...",
        otherSubmit: "提交",
        otherSubmitLoading: "分析中...",
        otherHint: "AI会分析你的回答",
        otherMinCharsHint: "至少输入5个字符才能提交",
        startButton: "开始测试",
        questionLoadingTitle: "正在挑选适合你的问题",
        questionLoadingSequence: [
            {
                stage: "正在准备问题",
                text: "为了让你的个性自然显现，问题会按轻松又好答的顺序排好。"
            },
            {
                stage: "正在调整节奏",
                text: "我们会把题目调整到最适合你的状态，让真实的个性更容易流露出来。"
            },
            {
                stage: "马上开始",
                text: "越凭感觉作答，越能看见最像你的真实个性。"
            }
        ],
        questionKicker: "点选最像你的感觉",
        questionPlaceholder: "问题会显示在这里。",
        choiceHint: "点我选择",
        loadingStage: "正在整理你的性格",
        loadingTitle: "温柔梳理你的个性",
        resultLoadingSequence: [
            "正在整理你的思维模式和行为习惯。",
            "正在找出最能体现你个性的特征。",
            "正在把你的性格变成一张很想截图的结果卡。"
        ],
        loadingTags: ["个性", "思维", "行为模式"],
        resultKicker: "你的个性",
        resultTitle: "诊断结果",
        resultSubtypePrefix: "相近类型",
        resultDescriptionLabel: "AI读出的个性",
        resultRecommendationLabel: "恋爱模式",
        resultCompatibilityLabel: "相性好的类型",
        resultMatrixLabel: "相性地图",
        matrixReasons: { 3: "最相配的类型。", 2: "相性不错的类型。", 1: "相处方式决定相性的类型。" },
        compatibilityPlaceholder: "重新测试后会显示更适合的类型。",
        carouselPagesLabel: "结果卡片",
        carouselDotLabel: "结果卡片",
        carouselPrev: "上一张",
        carouselNext: "下一张",
        restartButton: "再测一次",
        homeButton: "返回首页",
        errorStartTitle: "准备时出了点小问题",
        errorStartCopy: "问题出现得比平时慢一点。",
        errorStartDescription: "稍等一下，再重新测试看看。",
        errorResultTitle: "结果还在整理中",
        errorResultAbortCopy: "这次结果需要再多一点时间。",
        errorResultCopy: "这次没有成功显示结果。",
        errorResultDescription: "请检查网络后再试一次。",
        errorResultRecommendation: "重新开始后，我们会再温柔地整理你的性格结果。",
        classifyingAnswers: "正在逐一分析你的回答..."
    },
    ko: {
        metaTitle: "AI 성격 테스트",
        languageSwitcherLabel: "언어 선택",
        brand: "AI 성격 테스트",
        heroKicker: "AI 성격 테스트",
        heroTitle: "AI 성격 테스트",
        heroCatch: "AI가 너의\n숨겨진 개성을 읽어볼까?",
        heroLead: "직감대로 답하면 너의 사고 패턴, 행동 습관, 개성의 분위기를 선명하게 시각화해 줍니다.",
        heroTags: ["#개성", "#사고패턴", "#스크린샷각"],
        floatingNotes: ["숨겨진 개성", "사고 패턴", "속마음 필터"],
        auraCore: "YOU",
        otherButton: "기타",
        otherPlaceholder: "직접 입력해 보세요...",
        otherSubmit: "제출",
        otherSubmitLoading: "분석 중...",
        otherHint: "AI가 답변을 분석합니다",
        otherMinCharsHint: "5자 이상 입력하면 제출할 수 있습니다",
        startButton: "테스트 시작",
        questionLoadingTitle: "너한테 맞는 질문을 고르는 중",
        questionLoadingSequence: [
            {
                stage: "질문 준비 중",
                text: "개성이 자연스럽게 드러나도록 편하게 답할 수 있는 흐름으로 정리하고 있어요."
            },
            {
                stage: "흐름 조정 중",
                text: "너의 진짜 성격과 행동 패턴이 잘 보이도록 질문의 결을 부드럽게 맞추고 있어요."
            },
            {
                stage: "곧 시작해요",
                text: "직감대로 답할수록 너다운 개성이 더 선명하게 보여요."
            }
        ],
        questionKicker: "가장 가까운 기분을 탭해 줘",
        questionPlaceholder: "질문이 여기에 표시됩니다.",
        choiceHint: "탭해서 선택",
        loadingStage: "성격을 정리하는 중",
        loadingTitle: "너의 개성을 부드럽게 읽는 중",
        resultLoadingSequence: [
            "사고 패턴과 행동 습관을 정리하고 있어요.",
            "너의 개성이 가장 잘 드러나는 특징을 찾고 있어요.",
            "스크린샷 하고 싶은 성격 카드로 마무리하고 있어요."
        ],
        loadingTags: ["개성", "사고패턴", "행동습관"],
        resultKicker: "너의 퍼스널리티",
        resultTitle: "진단 결과",
        resultSubtypePrefix: "비슷한 타입",
        resultDescriptionLabel: "AI가 읽은 개성",
        resultRecommendationLabel: "연애 모드",
        resultCompatibilityLabel: "잘 맞는 타입",
        resultMatrixLabel: "궁합 지도",
        matrixReasons: { 3: "가장 잘 맞는 타입입니다.", 2: "잘 맞는 타입입니다.", 1: "관계 방식에 따라 달라지는 타입입니다." },
        compatibilityPlaceholder: "다시 진단하면 잘 맞는 타입이 표시됩니다.",
        carouselPagesLabel: "결과 카드",
        carouselDotLabel: "결과 카드",
        carouselPrev: "이전",
        carouselNext: "다음",
        restartButton: "다시 진단하기",
        homeButton: "홈으로 돌아가기",
        errorStartTitle: "준비 중에 작은 문제가 생겼어요",
        errorStartCopy: "질문이 뜨기까지 조금 더 시간이 걸리고 있어요.",
        errorStartDescription: "잠깐 기다렸다가 다시 테스트해 주세요.",
        errorResultTitle: "결과를 정리하는 데 시간이 조금 더 필요해요",
        errorResultAbortCopy: "이번 결과는 몇 초만 더 기다려야 해요.",
        errorResultCopy: "이번에는 결과를 보여 주지 못했어요.",
        errorResultDescription: "연결 상태를 확인한 뒤 다시 시도해 주세요.",
        errorResultRecommendation: "처음부터 다시 시작하면 성격 카드를 부드럽게 다시 정리해 드릴게요.",
        classifyingAnswers: "각각의 답변을 하나씩 분석하고 있어요..."
    }
};

const themeProfiles = {
    default: {
        themeColor: "#170821",
        locales: {
            ja: {
                title: "診断結果",
                badge: "パーソナリティタイプ",
                description: "ピンクとオーロラのやわらかい空気感。あなたの個性を映し出すフィルターです。",
                tags: ["#パーソナリティ", "#個性フィルター", "#性格診断"]
            },
            en: {
                title: "Result",
                badge: "Personality Type",
                description: "A soft aurora mood that reflects the personality vibe that feels most like you.",
                tags: ["#Personality", "#TrueColors", "#PersonalityTest"]
            },
            zh: {
                title: "诊断结果",
                badge: "性格类型",
                description: "柔和的极光氛围，映出最像你的个性滤镜。",
                tags: ["#个性", "#真实自我", "#性格测试"]
            },
            ko: {
                title: "진단 결과",
                badge: "퍼스널리티 타입",
                description: "오로라의 부드러운 공기감으로 지금의 너와 가장 닮은 개성을 보여 줘요.",
                tags: ["#퍼스널리티", "#개성필터", "#성격테스트"]
            }
        }
    },
    Apple: {
        themeColor: "#171d29",
        locales: {
            ja: {
                title: "Appleタイプ",
                badge: "クリアタイプ",
                description: "透明感と静かな余裕がにじむ、洗練された個性の持ち主。",
                tags: ["#透明感", "#洗練", "#静かな余裕"]
            },
            en: {
                title: "Apple Type",
                badge: "Clear Type",
                description: "Clean, polished, and quietly elegant. A personality with calm, refined confidence.",
                tags: ["#ClearVibes", "#Polished", "#QuietConfidence"]
            },
            zh: {
                title: "Apple型",
                badge: "清透型",
                description: "清透又克制，带着安静高级感的个性。",
                tags: ["#透明感", "#精致", "#从容感"]
            },
            ko: {
                title: "Apple 타입",
                badge: "클리어 타입",
                description: "투명하고 정돈된 분위기에 잔잔한 여유가 스며 있는 개성.",
                tags: ["#투명한무드", "#세련됨", "#잔잔한여유"]
            }
        }
    },
    Google: {
        themeColor: "#18091d",
        locales: {
            ja: {
                title: "Googleタイプ",
                badge: "カラフルタイプ",
                description: "明るさと好奇心が弾ける、ポップで親しみやすい個性の持ち主。",
                tags: ["#カラフル", "#好奇心", "#明るさ"]
            },
            en: {
                title: "Google Type",
                badge: "Color Pop Type",
                description: "Bright, curious, and playful. A personality that lights up any room.",
                tags: ["#ColorPop", "#CuriousHeart", "#BrightEnergy"]
            },
            zh: {
                title: "Google型",
                badge: "多彩型",
                description: "明亮、好奇又有玩心，轻松就能带动气氛的个性。",
                tags: ["#多巴胺", "#好奇心", "#明亮感"]
            },
            ko: {
                title: "Google 타입",
                badge: "컬러팝 타입",
                description: "밝고 호기심 많고 장난기 있는, 어디서든 분위기를 밝히는 개성.",
                tags: ["#컬러팝", "#호기심", "#밝은에너지"]
            }
        }
    },
    Amazon: {
        themeColor: "#1d0d16",
        locales: {
            ja: {
                title: "Amazonタイプ",
                badge: "アクティブタイプ",
                description: "テンポの良さと行動力がにじみ出る、熱量高めの個性の持ち主。",
                tags: ["#行動派", "#テンポ感", "#まっすぐ"]
            },
            en: {
                title: "Amazon Type",
                badge: "Action Type",
                description: "Quick, active, and direct. A personality that moves with bold momentum.",
                tags: ["#ActionFirst", "#FastPace", "#StraightForward"]
            },
            zh: {
                title: "Amazon型",
                badge: "行动型",
                description: "节奏明快、行动力在线，带着一股热劲的个性。",
                tags: ["#行动派", "#节奏快", "#很直接"]
            },
            ko: {
                title: "Amazon 타입",
                badge: "액티브 타입",
                description: "템포가 빠르고 행동력이 살아 있는, 뜨거운 에너지를 가진 개성.",
                tags: ["#행동파", "#빠른템포", "#직진무드"]
            }
        }
    },
    Microsoft: {
        themeColor: "#101128",
        locales: {
            ja: {
                title: "Microsoftタイプ",
                badge: "やさしさタイプ",
                description: "安心感と誠実さがやわらかく広がる、落ち着いた個性の持ち主。",
                tags: ["#優しさ", "#安心感", "#誠実"]
            },
            en: {
                title: "Microsoft Type",
                badge: "Steady Type",
                description: "Gentle, steady, and reassuring. A personality that makes others feel safe.",
                tags: ["#SoftEnergy", "#SafeVibes", "#SincereHeart"]
            },
            zh: {
                title: "Microsoft型",
                badge: "温柔型",
                description: "带着安心感和真诚感，温柔又稳定的个性。",
                tags: ["#温柔", "#安心感", "#真诚"]
            },
            ko: {
                title: "Microsoft 타입",
                badge: "다정한 타입",
                description: "안정감과 성실함이 부드럽게 퍼지는, 편안한 개성.",
                tags: ["#다정함", "#안정감", "#성실함"]
            }
        }
    },
    Tesla: {
        themeColor: "#19070e",
        locales: {
            ja: {
                title: "Teslaタイプ",
                badge: "情熱タイプ",
                description: "惹きつける力が強くてまっすぐ。温度高めの個性の持ち主。",
                tags: ["#情熱型", "#引力強め", "#一直線"]
            },
            en: {
                title: "Tesla Type",
                badge: "Passion Type",
                description: "Intense, magnetic, and impossible to ignore. A personality full of drive.",
                tags: ["#PassionMode", "#Magnetic", "#AllIn"]
            },
            zh: {
                title: "Tesla型",
                badge: "热感型",
                description: "吸引力很强，也很直接，是会把氛围一下子点燃的个性。",
                tags: ["#热情体质", "#吸引力强", "#直球感"]
            },
            ko: {
                title: "Tesla 타입",
                badge: "열정 타입",
                description: "강한 끌림과 직진 에너지가 느껴지는, 온도가 높은 개성.",
                tags: ["#열정형", "#강한끌림", "#직진스타일"]
            }
        }
    },
    Meta: {
        themeColor: "#120727",
        locales: {
            ja: {
                title: "Metaタイプ",
                badge: "共感タイプ",
                description: "共感とつながりが自然に広がる、やわらかいコミュニケーション力を持つ個性。",
                tags: ["#共感", "#つながり", "#やわらかい"]
            },
            en: {
                title: "Meta Type",
                badge: "Connection Type",
                description: "Warm, social, and emotionally tuned in. A personality built on empathy.",
                tags: ["#Empathy", "#Connected", "#SoftTalk"]
            },
            zh: {
                title: "Meta型",
                badge: "共感型",
                description: "很会连接情绪和关系，带着社交感与温柔感的个性。",
                tags: ["#共感力", "#连接感", "#会聊天"]
            },
            ko: {
                title: "Meta 타입",
                badge: "공감 타입",
                description: "공감과 연결감이 자연스럽게 번지는, 소통 능력이 뛰어난 개성.",
                tags: ["#공감력", "#연결감", "#부드러운소통"]
            }
        }
    },
    Nvidia: {
        themeColor: "#0d1218",
        locales: {
            ja: {
                title: "Nvidiaタイプ",
                badge: "ミステリアスタイプ",
                description: "深みのある余韻と静かな吸引力。少し謎めいた独特の個性の持ち主。",
                tags: ["#ミステリアス", "#深夜感", "#余韻強め"]
            },
            en: {
                title: "Nvidia Type",
                badge: "Midnight Type",
                description: "Quiet, deep, and a little mysterious. A personality with quiet depth.",
                tags: ["#MidnightMood", "#Mystery", "#LingeringVibe"]
            },
            zh: {
                title: "Nvidia型",
                badge: "深夜型",
                description: "安静、神秘又有余韵，是让人越了解越上头的个性。",
                tags: ["#神秘感", "#深夜氛围", "#后劲强"]
            },
            ko: {
                title: "Nvidia 타입",
                badge: "미드나잇 타입",
                description: "조용하고 깊고 살짝 비밀스러운, 밤 같은 매력을 가진 개성.",
                tags: ["#미스터리", "#심야무드", "#여운강함"]
            }
        }
    },
    Netflix: {
        themeColor: "#15080f",
        locales: {
            ja: {
                title: "Netflixタイプ",
                badge: "シネマタイプ",
                description: "感情の余韻がきれいに残る、エモさと表現力を持つ個性の持ち主。",
                tags: ["#エモ", "#表現力", "#余韻"]
            },
            en: {
                title: "Netflix Type",
                badge: "Cinema Type",
                description: "Emotional, expressive, and immersive. A personality that leaves a lasting impression.",
                tags: ["#Cinematic", "#Emotional", "#Afterglow"]
            },
            zh: {
                title: "Netflix型",
                badge: "电影型",
                description: "情绪感很强，也很有表现力，是会在人心里留下余韵的个性。",
                tags: ["#很有戏", "#表现力", "#余韵感"]
            },
            ko: {
                title: "Netflix 타입",
                badge: "시네마 타입",
                description: "감정의 여운이 깊게 남는, 풍부한 표현력을 가진 개성.",
                tags: ["#에모감성", "#표현력", "#긴여운"]
            }
        }
    }
};

const questionsCache = new Map();
const questionsRequests = new Map();

let currentLanguage = resolveInitialLanguage();
let currentQuestionIndex = 0;
let answers = [];
let activeTickerId = null;
let activeSessionId = 0;
let activeThemeName = "default";
let activeSubtype = null;
let activeCarouselIndex = 0;
let isCarouselInitialized = false;

function normalizeLanguage(language) {
    if (typeof language !== "string") {
        return "ja";
    }

    const normalized = language.toLowerCase().trim();

    if (normalized.startsWith("ja")) {
        return "ja";
    }
    if (normalized.startsWith("en")) {
        return "en";
    }
    if (normalized.startsWith("zh")) {
        return "zh";
    }
    if (normalized.startsWith("ko")) {
        return "ko";
    }

    return "ja";
}

function matchSupportedLanguage(language) {
    if (typeof language !== "string") {
        return null;
    }

    const normalized = language.toLowerCase().trim();

    if (normalized.startsWith("ja")) {
        return "ja";
    }
    if (normalized.startsWith("en")) {
        return "en";
    }
    if (normalized.startsWith("zh")) {
        return "zh";
    }
    if (normalized.startsWith("ko")) {
        return "ko";
    }

    return null;
}

function resolveInitialLanguage() {
    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored) {
            return normalizeLanguage(stored);
        }
    } catch (error) {
        console.warn("localStorage is unavailable:", error);
    }

    const navigatorLanguages = Array.isArray(window.navigator.languages)
        ? window.navigator.languages
        : [window.navigator.language];

    for (const language of navigatorLanguages) {
        const matched = matchSupportedLanguage(language);
        if (matched) {
            return matched;
        }
    }

    return "ja";
}

function getTranslations(language = currentLanguage) {
    return translations[normalizeLanguage(language)] || translations.ja;
}

function getThemeProfile(themeName, language = currentLanguage) {
    const normalizedTheme = themeProfiles[themeName] ? themeName : "default";
    return themeProfiles[normalizedTheme].locales[normalizeLanguage(language)] || themeProfiles[normalizedTheme].locales.ja;
}

function clearQuestions(language = currentLanguage) {
    const normalizedLanguage = normalizeLanguage(language);
    questionsCache.delete(normalizedLanguage);
    questionsRequests.delete(normalizedLanguage);
}

async function resetQuestions(language = currentLanguage) {
    const normalizedLanguage = normalizeLanguage(language);
    clearQuestions(normalizedLanguage);

    const response = await fetch("/reset-questions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ language: normalizedLanguage })
    });

    if (!response.ok) {
        throw new Error(`Reset request failed: ${response.status}`);
    }
}

async function getQuestions(language = currentLanguage) {
    const normalizedLanguage = normalizeLanguage(language);

    if (questionsCache.has(normalizedLanguage)) {
        return questionsCache.get(normalizedLanguage);
    }

    if (questionsRequests.has(normalizedLanguage)) {
        return questionsRequests.get(normalizedLanguage);
    }

    const request = (async () => {
        const response = await fetch("/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ language: normalizedLanguage })
        });

        if (!response.ok) {
            throw new Error(`Questions request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("Questions are not available.");
        }

        questionsCache.set(normalizedLanguage, data.questions);
        return data.questions;
    })();

    questionsRequests.set(normalizedLanguage, request);

    try {
        return await request;
    } finally {
        questionsRequests.delete(normalizedLanguage);
    }
}

function showScreen(screenToShow, screenName) {
    stopTicker();

    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    document.body.dataset.screen = screenName;
    screenToShow.classList.add("active");

    const locale = getTranslations();

    if (screenToShow === questionLoadingScreen) {
        startTicker(locale.questionLoadingSequence, 1400, (item) => {
            questionLoadingStage.textContent = item.stage;
            questionLoadingText.textContent = item.text;
        });
    }

    if (screenToShow === loadingScreen) {
        startTicker(locale.resultLoadingSequence, 1500, (message) => {
            loadingStatusText.textContent = message;
        });
    }
}

async function startDiagnosis() {
    const sessionId = ++activeSessionId;
    const language = currentLanguage;
    const locale = getTranslations(language);

    currentQuestionIndex = 0;
    answers = [];
    clearResultContent();
    applyTheme("default");

    try {
        showScreen(questionLoadingScreen, "question-loading");
        await waitForNextFrame();
        await resetQuestions(language);

        if (sessionId !== activeSessionId) {
            return;
        }

        await getQuestions(language);

        if (sessionId !== activeSessionId) {
            return;
        }

        showScreen(questionScreen, "question");
        await renderQuestion(sessionId, language);
    } catch (error) {
        if (sessionId !== activeSessionId) {
            return;
        }

        showErrorResult(
            locale.errorStartTitle,
            locale.errorStartCopy,
            locale.errorStartDescription
        );
        console.error(error);
    }
}

function clearResultContent() {
    const locale = getTranslations();

    resultTitle.textContent = locale.resultTitle;
    resultCopy.textContent = "";
    resultDescription.textContent = "";
    resultRecommendation.textContent = "";
    renderTraits([]);
    renderTagCollection(resultInnerTags, []);
    renderTagCollection(resultLoveTags, []);
    renderCompatibility([]);
    renderCompatibilityMatrix("");
    populateThemeProfile("default", null);
    setCarouselIndex(0, { behavior: "auto" });
}

async function renderQuestion(sessionId = activeSessionId, language = currentLanguage) {
    const questions = await getQuestions(language);

    if (sessionId !== activeSessionId) {
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
        throw new Error("Current question is unavailable.");
    }

    const questionNumber = currentQuestionIndex + 1;
    const progressPercent = Math.round((questionNumber / questions.length) * 100);

    questionCount.textContent = `Q${questionNumber} / ${questions.length}`;
    questionText.textContent = currentQuestion.text;
    progressFill.style.width = `${progressPercent}%`;
    progressLabel.textContent = `${progressPercent}%`;
    choicesContainer.dataset.locked = "false";

    const fragment = document.createDocumentFragment();
    currentQuestion.choices.forEach((choice, index) => {
        fragment.appendChild(createChoiceButton(choice, index, sessionId, language));
    });
    fragment.appendChild(createOtherChoiceButton(sessionId, language));
    choicesContainer.replaceChildren(fragment);

    // その他入力欄をリセット
    const locale = getTranslations(language);
    otherInputArea.hidden = true;
    otherText.value = "";
    otherText.disabled = false;
    otherCharCount.textContent = locale.otherMinCharsHint + "  0 / 200";
    otherCharCount.classList.add("is-warning");
    otherSubmitButton.disabled = true;
    otherSubmitButton.dataset.state = "";
    otherSubmitButton.textContent = locale.otherSubmit;
    otherSubmitButton.onclick = null;
    otherText.oninput = null;
}

function createOtherChoiceButton(sessionId, language) {
    const locale = getTranslations(language);
    const button = document.createElement("button");
    const choiceCopy = document.createElement("span");
    const choiceText = document.createElement("strong");
    const choiceHint = document.createElement("small");

    button.type = "button";
    button.className = "choice-button choice-button-other";

    choiceCopy.className = "choice-copy";
    choiceText.className = "choice-text";
    choiceText.textContent = locale.otherButton;
    choiceHint.className = "choice-hint";
    choiceHint.textContent = locale.otherHint;
    choiceCopy.append(choiceText, choiceHint);
    button.appendChild(choiceCopy);

    button.addEventListener("click", () => showOtherInput(button, sessionId, language));
    return button;
}

function showOtherInput(otherButton, sessionId, language) {
    if (choicesContainer.dataset.locked === "true" || sessionId !== activeSessionId) {
        return;
    }

    choicesContainer.dataset.locked = "true";
    Array.from(choicesContainer.querySelectorAll("button")).forEach((btn) => {
        btn.disabled = true;
    });
    otherButton.classList.add("is-selected");
    otherButton.disabled = false;

    otherInputArea.hidden = false;

    // スマホキーボードが出た後にスクロール（300ms待ってから送信ボタンが見えるよう調整）
    setTimeout(() => {
        otherSubmitButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);

    otherText.focus();

    // 文字数カウント更新・送信ボタン制御
    const locale = getTranslations(language);
    const updateCharCount = () => {
        const len = otherText.value.length;
        const trimLen = otherText.value.trim().length;
        if (trimLen < 5) {
            otherCharCount.textContent = locale.otherMinCharsHint + "  " + len + " / 200";
            otherCharCount.classList.add("is-warning");
        } else {
            otherCharCount.textContent = len + " / 200";
            otherCharCount.classList.remove("is-warning");
        }
        otherSubmitButton.disabled = trimLen < 5;
    };
    updateCharCount();
    otherText.oninput = updateCharCount;

    otherSubmitButton.onclick = () => submitOtherAnswer(sessionId, language);
}

async function submitOtherAnswer(sessionId, language) {
    if (sessionId !== activeSessionId) {
        return;
    }

    const locale = getTranslations(language);
    const freeText = otherText.value.trim();
    if (freeText.length < 5) {
        return;
    }

    otherSubmitButton.disabled = true;
    otherText.disabled = true;

    const questions = await getQuestions(language);
    if (sessionId !== activeSessionId) {
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];

    answers.push({
        questions: currentQuestion.text,
        answer: freeText,
        type: "__pending__",
    });

    await wait(180);

    if (sessionId !== activeSessionId) {
        return;
    }

    currentQuestionIndex += 1;

    if (currentQuestionIndex < questions.length) {
        await renderQuestion(sessionId, language);
        return;
    }

    showScreen(loadingScreen, "loading");
    await waitForNextFrame();

    if (sessionId !== activeSessionId) {
        return;
    }

    await batchClassifyPendingAnswers(sessionId, language);

    if (sessionId !== activeSessionId) {
        return;
    }

    await showResult(sessionId, language);
}

function createChoiceButton(choice, index, sessionId, language) {
    const button = document.createElement("button");
    const choiceIndex = document.createElement("span");
    const choiceCopy = document.createElement("span");
    const choiceText = document.createElement("strong");
    const choiceHint = document.createElement("small");

    button.type = "button";
    button.className = "choice-button";

    choiceIndex.className = "choice-index";
    choiceIndex.textContent = choiceLetters[index] ?? `${index + 1}`;

    choiceCopy.className = "choice-copy";
    choiceText.className = "choice-text";
    choiceText.textContent = choice.text;
    choiceHint.className = "choice-hint";
    choiceHint.textContent = getTranslations(language).choiceHint;
    choiceCopy.append(choiceText, choiceHint);

    button.append(choiceIndex, choiceCopy);
    button.addEventListener("click", () => selectAnswer(choice, button, sessionId, language));

    return button;
}

async function selectAnswer(choice, selectedButton, sessionId, language) {
    if (choicesContainer.dataset.locked === "true" || sessionId !== activeSessionId) {
        return;
    }

    choicesContainer.dataset.locked = "true";
    Array.from(choicesContainer.querySelectorAll("button")).forEach((button) => {
        button.disabled = true;
    });
    selectedButton.classList.add("is-selected");

    const questions = await getQuestions(language);

    if (sessionId !== activeSessionId) {
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
        throw new Error("Current question is unavailable.");
    }

    answers.push({
        questions: currentQuestion.text,
        answer: choice.text,
        type: choice.type
    });

    await wait(220);

    if (sessionId !== activeSessionId) {
        return;
    }

    currentQuestionIndex += 1;

    if (currentQuestionIndex < questions.length) {
        await renderQuestion(sessionId, language);
        return;
    }

    showScreen(loadingScreen, "loading");
    await waitForNextFrame();

    if (sessionId !== activeSessionId) {
        return;
    }

    await batchClassifyPendingAnswers(sessionId, language);

    if (sessionId !== activeSessionId) {
        return;
    }

    await showResult(sessionId, language);
}

async function getResultType(language, submittedAnswers) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45000);

    try {
        const response = await fetch("/diagnose", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: normalizeLanguage(language),
                answers: submittedAnswers
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Diagnose request failed: ${response.status}`);
        }

        return await response.json();
    } finally {
        window.clearTimeout(timeoutId);
    }
}

function waitForNextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}

function wait(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

async function showResult(sessionId = activeSessionId, language = currentLanguage) {
    const locale = getTranslations(language);

    try {
        clearResultContent();
        const submittedAnswers = answers.slice();
        const resultType = await getResultType(language, submittedAnswers);

        if (sessionId !== activeSessionId) {
            return;
        }

        const bestType = resultType.bestType || "default";
        applyTheme(bestType);
        populateThemeProfile(bestType, resultType.subtype || null, language);
        renderResultCarousel(resultType, language);
        showScreen(resultScreen, "result");
        requestAnimationFrame(() => {
            setCarouselIndex(0, { behavior: "auto" });
        });
    } catch (error) {
        if (sessionId !== activeSessionId) {
            return;
        }

        showErrorResult(
            locale.errorResultTitle,
            error.name === "AbortError" ? locale.errorResultAbortCopy : locale.errorResultCopy,
            locale.errorResultDescription
        );
        console.error(error);
    }
}

function showErrorResult(title, copy, description) {
    const locale = getTranslations();
    const errorResult = {
        title,
        copy,
        description,
        recommendation: locale.errorResultRecommendation,
        traits: [],
        innerTags: [],
        loveTags: [],
        compatibility: []
    };

    applyTheme("default");
    populateThemeProfile("default", null);
    renderResultCarousel(errorResult, currentLanguage);
    showScreen(resultScreen, "result");
    requestAnimationFrame(() => {
        setCarouselIndex(0, { behavior: "auto" });
    });
}

function applyTheme(themeName) {
    const normalizedTheme = themeProfiles[themeName] ? themeName : "default";
    activeThemeName = normalizedTheme;
    document.body.dataset.theme = normalizedTheme;

    if (themeColorMeta) {
        themeColorMeta.setAttribute("content", themeProfiles[normalizedTheme].themeColor);
    }
}

function populateThemeProfile(themeName, subtype, language = currentLanguage) {
    const locale = getTranslations(language);
    const profile = getThemeProfile(themeName, language);

    activeSubtype = subtype || null;
    resultThemeBadge.textContent = profile.badge;
    resultThemeDescription.textContent = profile.description;

    if (activeSubtype) {
        const subtypeProfile = getThemeProfile(activeSubtype, language);
        resultSubtype.textContent = `${locale.resultSubtypePrefix}: ${subtypeProfile.title}`;
    } else {
        resultSubtype.textContent = "";
    }

    resultSubtype.classList.toggle("is-hidden", !activeSubtype);
    renderResultTags(profile.tags);
}

function cleanResultText(text) {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(/\.{3,}|…+/g, "").trim();
}

function renderResultCarousel(resultType, language = currentLanguage) {
    const locale = getTranslations(language);

    resultTitle.textContent = resultType.title || locale.resultTitle;
    resultCopy.textContent = cleanResultText(resultType.copy || "");
    resultDescription.textContent = cleanResultText(resultType.description || "");
    resultRecommendation.textContent = cleanResultText(resultType.recommendation || "");

    renderTraits(Array.isArray(resultType.traits) ? resultType.traits : []);
    renderTagCollection(resultInnerTags, Array.isArray(resultType.innerTags) ? resultType.innerTags : []);
    renderTagCollection(resultLoveTags, Array.isArray(resultType.loveTags) ? resultType.loveTags : []);
    renderCompatibility(buildStaticCompatibilityList(resultType.bestType || "", language), language);
    renderCompatibilityMatrix(resultType.bestType || "");

    activeCarouselIndex = 0;
    updateCarouselState();
}

function renderTraits(traits) {
    resultTraits.replaceChildren();

    traits.forEach((trait) => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        const stars = document.createElement("span");
        const safeStars = Math.max(0, Math.min(5, Number(trait.stars) || 0));

        row.className = "trait-row";
        label.className = "trait-label";
        label.textContent = trait.label || "";
        stars.className = "trait-stars";
        stars.textContent = `${"★".repeat(safeStars)}${"☆".repeat(Math.max(0, 5 - safeStars))}`;

        row.append(label, stars);
        resultTraits.appendChild(row);
    });
}

function renderTagCollection(container, tags) {
    container.replaceChildren();

    tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.textContent = tag;
        container.appendChild(chip);
    });
}

function renderCompatibility(items, language = currentLanguage) {
    const locale = getTranslations(language);
    const medals = ["🥇", "🥈", "🥉"];

    resultCompatibility.replaceChildren();

    if (!Array.isArray(items) || items.length === 0) {
        const copy = document.createElement("p");
        copy.className = "compatibility-reason";
        copy.textContent = locale.compatibilityPlaceholder;
        resultCompatibility.appendChild(copy);
        return;
    }

    items.forEach((item, index) => {
        const wrapper = document.createElement("div");
        const rank = document.createElement("span");
        const body = document.createElement("div");
        const type = document.createElement("strong");
        const reason = document.createElement("p");

        wrapper.className = "compatibility-item";
        rank.className = "compatibility-rank";
        rank.textContent = medals[index] || "•";
        body.className = "compatibility-body";
        type.className = "compatibility-type";
        type.textContent = item.type || "";
        reason.className = "compatibility-reason";
        reason.textContent = cleanResultText(item.reason || "");
        body.append(type, reason);
        wrapper.append(rank, body);
        resultCompatibility.appendChild(wrapper);
    });
}

function buildStaticCompatibilityList(bestType, language) {
    if (!bestType || !STATIC_COMPATIBILITY[bestType]) {
        return [];
    }
    const locale = getTranslations(language);
    const scores = STATIC_COMPATIBILITY[bestType];
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type, score]) => ({
            type,
            reason: (locale.matrixReasons || {})[score] || ""
        }));
}

function renderCompatibilityMatrix(bestType) {
    if (!resultMatrix) {
        return;
    }
    resultMatrix.replaceChildren();

    // ヘッダー行
    const header = document.createElement("div");
    header.className = "matrix-row matrix-header";
    const corner = document.createElement("span");
    corner.className = "matrix-cell matrix-corner";
    header.appendChild(corner);
    TYPE_ORDER.forEach((type) => {
        const cell = document.createElement("span");
        cell.className = "matrix-cell matrix-head-cell";
        if (type === bestType) {
            cell.classList.add("is-user-type");
        }
        cell.textContent = TYPE_ABBR[type];
        header.appendChild(cell);
    });
    resultMatrix.appendChild(header);

    // データ行
    TYPE_ORDER.forEach((rowType) => {
        const isUserRow = rowType === bestType;
        const row = document.createElement("div");
        row.className = "matrix-row " + (isUserRow ? "is-user-row" : "is-ref-row");

        const label = document.createElement("span");
        label.className = "matrix-cell matrix-row-label" + (isUserRow ? " is-user-type" : "");
        label.textContent = TYPE_ABBR[rowType];
        row.appendChild(label);

        TYPE_ORDER.forEach((colType) => {
            const cell = document.createElement("span");
            cell.className = "matrix-cell";

            if (rowType === colType) {
                cell.classList.add("matrix-self");
                cell.textContent = "―";
            } else {
                const rowData = STATIC_COMPATIBILITY[rowType] || {};
                const score = rowData[colType]
                    || (STATIC_COMPATIBILITY[colType] || {})[rowType]
                    || 1;
                cell.classList.add("matrix-score-" + score);
                cell.textContent = MATRIX_SYMBOLS[score];
            }
            row.appendChild(cell);
        });
        resultMatrix.appendChild(row);
    });
}

function applyCarouselLabels(language = currentLanguage) {
    const locale = getTranslations(language);

    if (!resultCarouselDots) {
        return;
    }

    resultCarouselDots.setAttribute("aria-label", locale.carouselPagesLabel);

    Array.from(resultCarouselDots.children).forEach((dot, index) => {
        dot.setAttribute("aria-label", `${locale.carouselDotLabel} ${index + 1}`);
    });
}

function renderResultTags(tags) {
    resultTags.replaceChildren();

    tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.textContent = tag;
        resultTags.appendChild(chip);
    });
}

function setupCarouselControls() {
    if (isCarouselInitialized || !resultCarousel) {
        return;
    }

    resultCarouselDots.replaceChildren();

    resultSlides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.dataset.slideIndex = String(index);
        resultCarouselDots.appendChild(dot);
    });

    resultCarouselPrev.addEventListener("click", () => {
        setCarouselIndex(activeCarouselIndex - 1);
    });

    resultCarouselNext.addEventListener("click", () => {
        setCarouselIndex(activeCarouselIndex + 1);
    });

    resultCarouselDots.addEventListener("click", (event) => {
        const button = event.target.closest(".carousel-dot");
        if (!button) {
            return;
        }

        const nextIndex = Number(button.dataset.slideIndex);
        if (!Number.isNaN(nextIndex)) {
            setCarouselIndex(nextIndex);
        }
    });

    resultCarousel.addEventListener("scroll", () => {
        const width = resultCarousel.clientWidth;
        if (!width) {
            return;
        }

        const nextIndex = Math.round(resultCarousel.scrollLeft / width);
        if (nextIndex !== activeCarouselIndex) {
            activeCarouselIndex = Math.max(0, Math.min(resultSlides.length - 1, nextIndex));
            updateCarouselState();
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        setCarouselIndex(activeCarouselIndex, { behavior: "auto" });
    });

    isCarouselInitialized = true;
    applyCarouselLabels();
    updateCarouselState();
}

function setCarouselIndex(index, { behavior = "smooth" } = {}) {
    if (!resultCarousel || resultSlides.length === 0) {
        return;
    }

    activeCarouselIndex = Math.max(0, Math.min(resultSlides.length - 1, index));
    updateCarouselState();

    const width = resultCarousel.clientWidth;
    if (width > 0) {
        resultCarousel.scrollTo({
            left: width * activeCarouselIndex,
            behavior
        });
    }
}

function updateCarouselState() {
    resultSlides.forEach((slide, index) => {
        const isActive = index === activeCarouselIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
    });

    Array.from(resultCarouselDots.children).forEach((dot, index) => {
        const isActive = index === activeCarouselIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
    });

    if (resultCarouselPrev) {
        resultCarouselPrev.disabled = activeCarouselIndex === 0;
    }

    if (resultCarouselNext) {
        resultCarouselNext.disabled = activeCarouselIndex === resultSlides.length - 1;
    }
}

function startTicker(sequence, interval, onTick) {
    if (!Array.isArray(sequence) || sequence.length === 0) {
        return;
    }

    let index = 0;
    onTick(sequence[index], index);

    activeTickerId = window.setInterval(() => {
        index = (index + 1) % sequence.length;
        onTick(sequence[index], index);
    }, interval);
}

function stopTicker() {
    if (activeTickerId !== null) {
        window.clearInterval(activeTickerId);
        activeTickerId = null;
    }
}

async function batchClassifyPendingAnswers(sessionId, language) {
    const pendingIndices = answers
        .map((a, i) => (a.type === "__pending__" ? i : -1))
        .filter((i) => i >= 0);

    if (pendingIndices.length === 0) {
        return;
    }

    const locale = getTranslations(language);
    stopTicker();
    setText(loadingStatusText, locale.classifyingAnswers);

    const items = pendingIndices.map((i) => ({
        question: answers[i].questions,
        answer: answers[i].answer,
    }));

    try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 35000);
        const response = await fetch("/batch-classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
            signal: controller.signal,
        });
        window.clearTimeout(timeoutId);
        if (response.ok) {
            const data = await response.json();
            const results = data.results || [];
            pendingIndices.forEach((answerIndex, resultIndex) => {
                const result = results[resultIndex];
                if (result && result.type) {
                    answers[answerIndex].type = result.type;
                }
            });
        }
    } catch (error) {
        console.warn("batch-classify fallback:", error);
    }

    const typeKeys = ["Apple", "Google", "Amazon", "Microsoft", "Tesla", "Meta", "Nvidia", "Netflix"];
    answers.forEach((a) => {
        if (a.type === "__pending__") {
            a.type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        }
    });

    if (sessionId !== activeSessionId) {
        return;
    }

    startTicker(locale.resultLoadingSequence, 1500, (message) => {
        loadingStatusText.textContent = message;
    });
}

function setText(node, value) {
    if (node) {
        node.textContent = value;
    }
}

function setTextList(nodes, values) {
    nodes.forEach((node, index) => {
        if (node) {
            node.textContent = values[index] || "";
        }
    });
}

function applyLanguageButtonState() {
    languageButtons.forEach((button) => {
        const isActive = button.dataset.lang === currentLanguage;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function applyTranslations() {
    const locale = getTranslations();

    document.documentElement.lang = HTML_LANG_MAP[currentLanguage] || currentLanguage;
    document.title = locale.metaTitle;
    langSwitcher.setAttribute("aria-label", locale.languageSwitcherLabel);
    setText(brandChip, locale.brand);
    setText(heroKicker, locale.heroKicker);
    setText(heroTitle, locale.heroTitle);
    setText(heroCatch, locale.heroCatch);
    setText(heroLead, locale.heroLead);
    setTextList(heroTags, locale.heroTags);
    setTextList(floatingNotes, locale.floatingNotes);
    setText(auraCoreText, locale.auraCore);
    if (otherText) {
        otherText.placeholder = locale.otherPlaceholder;
    }
    if (otherSubmitButton && otherSubmitButton.dataset.state !== "loading") {
        otherSubmitButton.textContent = locale.otherSubmit;
    }
    setText(startButton, locale.startButton);
    setText(questionLoadingTitle, locale.questionLoadingTitle);
    setText(questionLoadingStage, locale.questionLoadingSequence[0].stage);
    setText(questionLoadingText, locale.questionLoadingSequence[0].text);
    setText(questionKicker, locale.questionKicker);
    setText(loadingStage, locale.loadingStage);
    setText(loadingTitle, locale.loadingTitle);
    setText(loadingStatusText, locale.resultLoadingSequence[0]);
    setTextList(loadingTags, locale.loadingTags);
    setText(resultKicker, locale.resultKicker);
    setText(resultDescriptionLabel, locale.resultDescriptionLabel);
    setText(resultRecommendationLabel, locale.resultRecommendationLabel);
    setText(resultCompatibilityLabel, locale.resultCompatibilityLabel);
    setText(resultMatrixLabel, locale.resultMatrixLabel);
    setText(resultCarouselPrev, locale.carouselPrev);
    setText(resultCarouselNext, locale.carouselNext);
    applyCarouselLabels(currentLanguage);
    setText(restartButton, locale.restartButton);
    setText(homeButton, locale.homeButton);
    applyLanguageButtonState();
}

function resetExperience() {
    const locale = getTranslations();

    activeSessionId += 1;
    stopTicker();
    currentQuestionIndex = 0;
    answers = [];
    clearQuestions(currentLanguage);
    applyTheme("default");
    clearResultContent();
    questionCount.textContent = "Q1 / 10";
    questionText.textContent = locale.questionPlaceholder;
    progressFill.style.width = "0%";
    progressLabel.textContent = "0%";
    choicesContainer.replaceChildren();
    choicesContainer.dataset.locked = "false";
    showScreen(startScreen, "start");
}

function setLanguage(language, { resetView = false } = {}) {
    const normalizedLanguage = normalizeLanguage(language);
    currentLanguage = normalizedLanguage;

    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    } catch (error) {
        console.warn("Failed to save language:", error);
    }

    if (resetView) {
        resetExperience();
    }

    applyTranslations();  // 常に最後に呼ぶ（resetExperience の後に翻訳を上書き）
}

function createParticleField() {
    if (particleField.childElementCount > 0) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 26; index += 1) {
        const particle = document.createElement("span");
        particle.style.setProperty("--left", `${Math.random() * 100}%`);
        particle.style.setProperty("--size", `${Math.random() * 3.4 + 1.2}px`);
        particle.style.setProperty("--opacity", `${Math.random() * 0.45 + 0.12}`);
        particle.style.setProperty("--duration", `${Math.random() * 12 + 15}s`);
        particle.style.setProperty("--delay", `${Math.random() * -16}s`);
        fragment.appendChild(particle);
    }

    particleField.appendChild(fragment);
}

function initialize() {
    createParticleField();
    setupCarouselControls();
    setLanguage(currentLanguage, { resetView: true });  // reset → translations の順で実行
}

languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const nextLanguage = button.dataset.lang;
        if (!nextLanguage || normalizeLanguage(nextLanguage) === currentLanguage) {
            return;
        }

        setLanguage(nextLanguage, { resetView: true });
    });
});

startButton.addEventListener("click", startDiagnosis);
restartButton.addEventListener("click", startDiagnosis);
homeButton.addEventListener("click", resetExperience);

initialize();
