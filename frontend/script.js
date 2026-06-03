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
const resultCarousel = document.getElementById("result-carousel");
const resultCarouselPrev = document.getElementById("carousel-prev");
const resultCarouselNext = document.getElementById("carousel-next");
const resultCarouselDots = document.getElementById("carousel-dots");
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

const translations = {
    ja: {
        metaTitle: "AI恋愛人格診断",
        languageSwitcherLabel: "言語切り替え",
        brand: "AI恋愛人格診断",
        heroKicker: "恋愛オーラフィルター",
        heroTitle: "AI恋愛人格診断",
        heroCatch: "あなたの“好きのクセ”\nAIに見抜かれてみる？",
        heroLead: "直感で答えるだけで、恋愛のテンポや本音の出し方、ときめき方の空気感をかわいく可視化します。",
        heroTags: ["#本音", "#恋愛温度", "#スクショしたい"],
        floatingNotes: ["好きのクセ", "恋愛オーラ", "本音フィルター"],
        startButton: "診断スタート",
        questionLoadingTitle: "あなた向けの質問をえらんでいます",
        questionLoadingSequence: [
            {
                stage: "質問を準備中",
                text: "恋愛の空気感が見えやすいように、やさしく答えやすい順番へ整えています。"
            },
            {
                stage: "あなた向けに調整中",
                text: "本音や好きのクセが自然に出やすいように、質問のムードをふわっと合わせています。"
            },
            {
                stage: "まもなくスタート",
                text: "直感で答えるほど、あなたらしい恋愛オーラがきれいに見えてきます。"
            }
        ],
        questionKicker: "気分に近いものをタップ",
        questionPlaceholder: "質問がここに表示されます。",
        choiceHint: "タップして選ぶ",
        loadingStage: "恋愛オーラをまとめています",
        loadingTitle: "あなたの本音をやさしく整理中",
        resultLoadingSequence: [
            "ときめき方や距離感のクセを、やさしくまとめています。",
            "本音が出やすい瞬間と、好きになるテンポを整理しています。",
            "あなたの恋愛オーラを、スクショしたくなる形に仕上げています。"
        ],
        loadingTags: ["ときめき", "本音", "距離感"],
        resultKicker: "あなたの恋愛フィルター",
        resultTitle: "診断結果",
        resultSubtypePrefix: "近い空気感",
        resultDescriptionLabel: "AIが見つけた本音",
        resultRecommendationLabel: "恋愛モード",
        resultCompatibilityLabel: "相性の良いタイプ",
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
        errorResultRecommendation: "もう一度はじめると、恋愛オーラをやさしく表示し直します。"
    },
    en: {
        metaTitle: "AI Love Persona Test",
        languageSwitcherLabel: "Language",
        brand: "AI Love Persona Test",
        heroKicker: "Love Aura Filter",
        heroTitle: "AI Love Persona Test",
        heroCatch: "Want AI to read\nyour love pattern?",
        heroLead: "Answer on instinct and turn your flirting rhythm, honesty, and emotional vibe into a cute shareable card.",
        heroTags: ["#HeartMode", "#LoveVibe", "#ScreenshotWorthy"],
        floatingNotes: ["Love Pattern", "Aura Vibe", "Inner Voice"],
        startButton: "Start Test",
        questionLoadingTitle: "Picking questions that match your vibe",
        questionLoadingSequence: [
            {
                stage: "Preparing questions",
                text: "We are lining them up in a soft, easy flow so your real dating vibe shows up naturally."
            },
            {
                stage: "Tuning the mood",
                text: "The prompts are being adjusted so your honest feelings come through without overthinking."
            },
            {
                stage: "Almost ready",
                text: "The more instinctively you answer, the more your love aura will feel like you."
            }
        ],
        questionKicker: "Tap what feels most like you",
        questionPlaceholder: "Your question will show up here.",
        choiceHint: "Tap to choose",
        loadingStage: "Wrapping up your love aura",
        loadingTitle: "Gently sorting your real feelings",
        resultLoadingSequence: [
            "Sorting out your flirting rhythm and emotional distance.",
            "Finding the moments where your real feelings quietly show.",
            "Wrapping your love aura into something worth screenshotting."
        ],
        loadingTags: ["spark", "feelings", "distance"],
        resultKicker: "Your love filter",
        resultTitle: "Your Result",
        resultSubtypePrefix: "Close vibe",
        resultDescriptionLabel: "What AI picked up",
        resultRecommendationLabel: "Love mode",
        resultCompatibilityLabel: "Best Match Types",
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
        errorResultRecommendation: "Start over and we will refresh your love aura card softly."
    },
    zh: {
        metaTitle: "AI恋爱人格测试",
        languageSwitcherLabel: "语言切换",
        brand: "AI恋爱人格测试",
        heroKicker: "恋爱气场滤镜",
        heroTitle: "AI恋爱人格测试",
        heroCatch: "让 AI 看穿\n你的心动习惯？",
        heroLead: "凭直觉回答几个问题，就能把你的恋爱节奏、真心表达和心动氛围变成一张可爱的分享卡。",
        heroTags: ["#真心", "#恋爱温度", "#想截图"],
        floatingNotes: ["心动习惯", "恋爱气场", "真心滤镜"],
        startButton: "开始测试",
        questionLoadingTitle: "正在挑选适合你的问题",
        questionLoadingSequence: [
            {
                stage: "正在准备问题",
                text: "为了更自然地看见你的恋爱氛围，问题会按轻松又好答的顺序排好。"
            },
            {
                stage: "正在调整感觉",
                text: "我们会把题目的情绪感调柔一点，让你的真心更容易自然流出来。"
            },
            {
                stage: "马上开始",
                text: "越凭感觉作答，越能看见最像你的恋爱气场。"
            }
        ],
        questionKicker: "点选最像你的感觉",
        questionPlaceholder: "问题会显示在这里。",
        choiceHint: "点我选择",
        loadingStage: "正在整理你的恋爱气场",
        loadingTitle: "温柔梳理你的真实心意",
        resultLoadingSequence: [
            "正在整理你的心动节奏和距离感。",
            "正在找出你最容易露出真心的瞬间。",
            "正在把你的恋爱气场变成一张很想截图的结果卡。"
        ],
        loadingTags: ["心动", "真心", "距离感"],
        resultKicker: "你的恋爱滤镜",
        resultTitle: "诊断结果",
        resultSubtypePrefix: "相近气质",
        resultDescriptionLabel: "AI捕捉到的真心",
        resultRecommendationLabel: "恋爱模式",
        resultCompatibilityLabel: "相性好的类型",
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
        errorResultRecommendation: "重新开始后，我们会再温柔地整理你的恋爱气场。"
    },
    ko: {
        metaTitle: "AI 연애 성향 테스트",
        languageSwitcherLabel: "언어 선택",
        brand: "AI 연애 성향 테스트",
        heroKicker: "연애 오라 필터",
        heroTitle: "AI 연애 성향 테스트",
        heroCatch: "AI가 너의\n설렘 패턴을 읽어볼까?",
        heroLead: "직감대로 답하면 연애 템포, 속마음을 드러내는 방식, 설렘 무드까지 귀엽게 시각화해 줍니다.",
        heroTags: ["#속마음", "#연애온도", "#스크린샷각"],
        floatingNotes: ["설렘 패턴", "연애 오라", "속마음 필터"],
        startButton: "테스트 시작",
        questionLoadingTitle: "너한테 맞는 질문을 고르는 중",
        questionLoadingSequence: [
            {
                stage: "질문 준비 중",
                text: "연애 무드가 자연스럽게 보이도록 편하게 답할 수 있는 흐름으로 정리하고 있어요."
            },
            {
                stage: "무드 조정 중",
                text: "너의 진짜 마음이 자연스럽게 드러나도록 질문의 결을 부드럽게 맞추고 있어요."
            },
            {
                stage: "곧 시작해요",
                text: "직감대로 답할수록 너다운 연애 오라가 더 선명하게 보여요."
            }
        ],
        questionKicker: "가장 가까운 기분을 탭해 줘",
        questionPlaceholder: "질문이 여기에 표시됩니다.",
        choiceHint: "탭해서 선택",
        loadingStage: "연애 오라를 정리하는 중",
        loadingTitle: "너의 진짜 마음을 부드럽게 읽는 중",
        resultLoadingSequence: [
            "설렘이 올라오는 템포와 거리감을 정리하고 있어요.",
            "속마음이 가장 잘 드러나는 순간을 찾고 있어요.",
            "스크린샷 하고 싶은 연애 오라 카드로 마무리하고 있어요."
        ],
        loadingTags: ["설렘", "속마음", "거리감"],
        resultKicker: "너의 연애 필터",
        resultTitle: "진단 결과",
        resultSubtypePrefix: "비슷한 무드",
        resultDescriptionLabel: "AI가 읽은 속마음",
        resultRecommendationLabel: "연애 모드",
        resultCompatibilityLabel: "잘 맞는 타입",
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
        errorResultRecommendation: "처음부터 다시 시작하면 연애 오라 카드를 부드럽게 다시 정리해 드릴게요."
    }
};

const themeProfiles = {
    default: {
        themeColor: "#170821",
        locales: {
            ja: {
                title: "診断結果",
                badge: "恋愛オーラタイプ",
                description: "ピンクとオーロラのやわらかい空気感。今のあなたに近い恋愛フィルターです。",
                tags: ["#恋愛人格", "#本音フィルター", "#オーラ診断"]
            },
            en: {
                title: "Result",
                badge: "Love Aura Type",
                description: "A soft pink aurora mood that frames the love vibe that feels most like you.",
                tags: ["#LovePersona", "#InnerVoice", "#AuraCheck"]
            },
            zh: {
                title: "诊断结果",
                badge: "恋爱气场类型",
                description: "柔和的粉色极光氛围，映出现在最像你的恋爱滤镜。",
                tags: ["#恋爱人格", "#真心滤镜", "#气场测试"]
            },
            ko: {
                title: "진단 결과",
                badge: "연애 오라 타입",
                description: "핑크 오로라의 부드러운 공기감으로 지금의 너와 가장 닮은 연애 필터를 보여 줘요.",
                tags: ["#연애성향", "#속마음필터", "#오라테스트"]
            }
        }
    },
    Apple: {
        themeColor: "#171d29",
        locales: {
            ja: {
                title: "Appleタイプ",
                badge: "クリアオーラ",
                description: "透明感と静かな余裕がにじむ、すっきり上品な恋愛フィルター。",
                tags: ["#透明感", "#洗練", "#静かな余裕"]
            },
            en: {
                title: "Apple Type",
                badge: "Clear Aura",
                description: "Clean, polished, and quietly elegant. A love filter with calm confidence.",
                tags: ["#ClearVibes", "#Polished", "#QuietConfidence"]
            },
            zh: {
                title: "Apple型",
                badge: "清透气场",
                description: "清透又克制，带着安静高级感的恋爱滤镜。",
                tags: ["#透明感", "#精致", "#从容感"]
            },
            ko: {
                title: "Apple 타입",
                badge: "클리어 오라",
                description: "투명하고 정돈된 분위기에 잔잔한 여유가 스며 있는 연애 필터.",
                tags: ["#투명한무드", "#세련됨", "#잔잔한여유"]
            }
        }
    },
    Google: {
        themeColor: "#18091d",
        locales: {
            ja: {
                title: "Googleタイプ",
                badge: "カラフルオーラ",
                description: "明るさと好奇心が弾ける、ポップで親しみやすい恋愛フィルター。",
                tags: ["#カラフル", "#好奇心", "#明るさ"]
            },
            en: {
                title: "Google Type",
                badge: "Color Pop Aura",
                description: "Bright, curious, and playful. A love filter that feels fun from the first tap.",
                tags: ["#ColorPop", "#CuriousHeart", "#BrightEnergy"]
            },
            zh: {
                title: "Google型",
                badge: "多彩气场",
                description: "明亮、好奇又有玩心，轻松就能带起氛围的恋爱滤镜。",
                tags: ["#多巴胺", "#好奇心", "#明亮感"]
            },
            ko: {
                title: "Google 타입",
                badge: "컬러팝 오라",
                description: "밝고 호기심 많고 장난기 있는, 첫인상부터 기분 좋은 연애 필터.",
                tags: ["#컬러팝", "#호기심", "#밝은에너지"]
            }
        }
    },
    Amazon: {
        themeColor: "#1d0d16",
        locales: {
            ja: {
                title: "Amazonタイプ",
                badge: "アクティブオーラ",
                description: "テンポの良さと行動力がそのまま伝わる、熱量高めの恋愛フィルター。",
                tags: ["#行動派", "#テンポ感", "#まっすぐ"]
            },
            en: {
                title: "Amazon Type",
                badge: "Fast Pace Aura",
                description: "Quick, active, and direct. A love filter that moves with bold momentum.",
                tags: ["#ActionFirst", "#FastPace", "#StraightForward"]
            },
            zh: {
                title: "Amazon型",
                badge: "行动气场",
                description: "节奏明快、行动力在线，带着一点热度的恋爱滤镜。",
                tags: ["#行动派", "#节奏快", "#很直接"]
            },
            ko: {
                title: "Amazon 타입",
                badge: "액티브 오라",
                description: "템포가 빠르고 행동력이 살아 있는, 열기가 느껴지는 연애 필터.",
                tags: ["#행동파", "#빠른템포", "#직진무드"]
            }
        }
    },
    Microsoft: {
        themeColor: "#101128",
        locales: {
            ja: {
                title: "Microsoftタイプ",
                badge: "やさしさオーラ",
                description: "安心感と誠実さがやわらかく広がる、落ち着いた恋愛フィルター。",
                tags: ["#優しさ", "#安心感", "#誠実"]
            },
            en: {
                title: "Microsoft Type",
                badge: "Soft Blue Aura",
                description: "Gentle, steady, and reassuring. A love filter that feels safe and sincere.",
                tags: ["#SoftEnergy", "#SafeVibes", "#SincereHeart"]
            },
            zh: {
                title: "Microsoft型",
                badge: "温柔气场",
                description: "带着安心感和真诚感，温柔又稳定的恋爱滤镜。",
                tags: ["#温柔", "#安心感", "#真诚"]
            },
            ko: {
                title: "Microsoft 타입",
                badge: "다정한 오라",
                description: "안정감과 성실함이 부드럽게 퍼지는 편안한 연애 필터.",
                tags: ["#다정함", "#안정감", "#성실함"]
            }
        }
    },
    Tesla: {
        themeColor: "#19070e",
        locales: {
            ja: {
                title: "Teslaタイプ",
                badge: "情熱オーラ",
                description: "惹かれる力が強くてまっすぐ。温度が高めに伝わる恋愛フィルター。",
                tags: ["#情熱型", "#引力強め", "#一直線"]
            },
            en: {
                title: "Tesla Type",
                badge: "Passion Aura",
                description: "Intense, magnetic, and impossible to ignore. A love filter full of heat.",
                tags: ["#PassionMode", "#Magnetic", "#AllIn"]
            },
            zh: {
                title: "Tesla型",
                badge: "热感气场",
                description: "吸引力很强，也很直接，是会把氛围一下子点燃的恋爱滤镜。",
                tags: ["#热恋体质", "#吸引力强", "#一旦喜欢就直球"]
            },
            ko: {
                title: "Tesla 타입",
                badge: "열정 오라",
                description: "강한 끌림과 직진 에너지가 느껴지는, 온도가 높은 연애 필터.",
                tags: ["#열정형", "#강한끌림", "#직진스타일"]
            }
        }
    },
    Meta: {
        themeColor: "#120727",
        locales: {
            ja: {
                title: "Metaタイプ",
                badge: "共感オーラ",
                description: "共感とつながりが自然に広がる、SNSっぽくやさしい恋愛フィルター。",
                tags: ["#共感", "#つながり", "#やわらかい"]
            },
            en: {
                title: "Meta Type",
                badge: "Connection Aura",
                description: "Warm, social, and emotionally tuned in. A love filter built on connection.",
                tags: ["#Empathy", "#Connected", "#SoftTalk"]
            },
            zh: {
                title: "Meta型",
                badge: "共感气场",
                description: "很会连接情绪和关系，带着社交感与温柔感的恋爱滤镜。",
                tags: ["#共感力", "#连接感", "#会聊天"]
            },
            ko: {
                title: "Meta 타입",
                badge: "공감 오라",
                description: "공감과 연결감이 자연스럽게 번지는, 소통형 연애 필터.",
                tags: ["#공감력", "#연결감", "#부드러운소통"]
            }
        }
    },
    Nvidia: {
        themeColor: "#0d1218",
        locales: {
            ja: {
                title: "Nvidiaタイプ",
                badge: "ミステリアスオーラ",
                description: "深夜っぽい余韻と静かな吸引力。少し謎めいた恋愛フィルター。",
                tags: ["#ミステリアス", "#深夜感", "#余韻強め"]
            },
            en: {
                title: "Nvidia Type",
                badge: "Midnight Aura",
                description: "Quiet, deep, and a little mysterious. A love filter with late-night pull.",
                tags: ["#MidnightMood", "#Mystery", "#LingeringVibe"]
            },
            zh: {
                title: "Nvidia型",
                badge: "深夜气场",
                description: "安静、神秘又有余韵，是让人越看越上头的恋爱滤镜。",
                tags: ["#神秘感", "#深夜氛围", "#后劲强"]
            },
            ko: {
                title: "Nvidia 타입",
                badge: "미드나잇 오라",
                description: "조용하고 깊고 살짝 비밀스러운, 밤 같은 매력을 가진 연애 필터.",
                tags: ["#미스터리", "#심야무드", "#여운강함"]
            }
        }
    },
    Netflix: {
        themeColor: "#15080f",
        locales: {
            ja: {
                title: "Netflixタイプ",
                badge: "シネマオーラ",
                description: "感情の余韻がきれいに残る、エモさ多めの映画みたいな恋愛フィルター。",
                tags: ["#エモ", "#映画感", "#余韻"]
            },
            en: {
                title: "Netflix Type",
                badge: "Cinema Aura",
                description: "Emotional, cinematic, and immersive. A love filter that feels like a scene.",
                tags: ["#Cinematic", "#Emotional", "#Afterglow"]
            },
            zh: {
                title: "Netflix型",
                badge: "电影气场",
                description: "情绪感很强，也很有故事氛围，是会留下余韵的恋爱滤镜。",
                tags: ["#很有戏", "#电影感", "#余韵感"]
            },
            ko: {
                title: "Netflix 타입",
                badge: "시네마 오라",
                description: "감정의 여운이 깊게 남는, 장면 같은 몰입감을 가진 연애 필터.",
                tags: ["#에모감성", "#영화무드", "#긴여운"]
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

    choicesContainer.replaceChildren(fragment);
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
    renderCompatibility(Array.isArray(resultType.compatibility) ? resultType.compatibility : [], language);

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

function applyCarouselLabels(language = currentLanguage) {
    const locale = getTranslations(language);

    if (resultCarouselDots) {
        resultCarouselDots.setAttribute("aria-label", locale.carouselPagesLabel);
    }

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

    applyTranslations();

    if (resetView) {
        resetExperience();
    }
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
    setLanguage(currentLanguage);
    resetExperience();
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
