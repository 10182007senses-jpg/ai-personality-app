import json
import os
import random
import re
from pathlib import Path

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

OPEN_ROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = "google/gemini-2.5-flash"

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

SUPPORTED_LANGUAGES = {"ja", "en", "zh", "ko"}

LANGUAGE_SETTINGS = {
    "ja": {
        "output_name": "Japanese",
        "question_output_rule": "All question text and choice text must be written in natural Japanese.",
        "result_output_rule": "All result text must be written in natural Japanese.",
        "comment_length": "40 to 70 Japanese characters",
        "love_length": "60 to 100 Japanese characters",
        "diagnosis_description_length": "up to 120 Japanese characters",
        "diagnosis_recommendation_length": "up to 120 Japanese characters",
        "fallback_comment": "準備中...",
        "fallback_love": "準備中...",
    },
    "en": {
        "output_name": "English",
        "question_output_rule": "All question text and choice text must be written in natural English.",
        "result_output_rule": "All result text must be written in natural English.",
        "comment_length": "40 to 80 characters",
        "love_length": "70 to 120 characters",
        "diagnosis_description_length": "up to 200 characters",
        "diagnosis_recommendation_length": "up to 200 characters",
        "fallback_comment": "Preparing your result...",
        "fallback_love": "Preparing your result...",
    },
    "zh": {
        "output_name": "Simplified Chinese",
        "question_output_rule": "所有问题和选项都必须使用自然的简体中文。",
        "result_output_rule": "所有结果文案都必须使用自然的简体中文。",
        "comment_length": "30 to 60 Chinese characters",
        "love_length": "50 to 90 Chinese characters",
        "diagnosis_description_length": "120字以内",
        "diagnosis_recommendation_length": "120字以内",
        "fallback_comment": "准备中...",
        "fallback_love": "准备中...",
    },
    "ko": {
        "output_name": "Korean",
        "question_output_rule": "모든 질문과 선택지는 자연스러운 한국어로 작성하세요.",
        "result_output_rule": "모든 결과 문장은 자연스러운 한국어로 작성하세요.",
        "comment_length": "35 to 70 Korean characters",
        "love_length": "55 to 100 Korean characters",
        "diagnosis_description_length": "120자 이내",
        "diagnosis_recommendation_length": "120자 이내",
        "fallback_comment": "준비 중...",
        "fallback_love": "준비 중...",
    },
}

TYPE_LOCALES = {
    "Apple": {
        "ja": {
            "title": "Appleタイプ",
            "copy": "透明感と洗練で、静かに心を惹きつける恋愛タイプ。",
            "profile": "透明感・洗練・静かな余裕を持つタイプ",
            "fallback_description": "気持ちを大きく見せすぎず、上品な余韻で惹きつけるタイプです。",
            "fallback_recommendation": "好きな相手には丁寧に距離を縮めやすく、心地よさや品の良さを大切にします。",
        },
        "en": {
            "title": "Apple Type",
            "copy": "A love type that draws people in with clarity, polish, and quiet confidence.",
            "profile": "a type with clarity, refinement, and calm confidence",
            "fallback_description": "You tend to attract people with understated charm instead of loud signals.",
            "fallback_recommendation": "In love, you usually close the distance gently and value comfort, taste, and emotional poise.",
        },
        "zh": {
            "title": "Apple型",
            "copy": "靠透明感与精致感，安静地吸引人心的恋爱类型。",
            "profile": "拥有透明感、精致感和从容气质的类型",
            "fallback_description": "你不太会用夸张的方式表达喜欢，而是靠细腻气质慢慢打动对方。",
            "fallback_recommendation": "在恋爱里，你更容易用温柔而有分寸的方式拉近距离，也很在意相处的质感。",
        },
        "ko": {
            "title": "Apple 타입",
            "copy": "투명함과 세련됨으로 조용히 마음을 끄는 연애 타입.",
            "profile": "투명함, 세련됨, 차분한 여유를 지닌 타입",
            "fallback_description": "감정을 크게 드러내기보다 은은한 분위기로 상대를 끌어당기는 편입니다.",
            "fallback_recommendation": "연애에서는 천천히 거리를 좁히며 편안함과 분위기의 결을 중요하게 생각합니다.",
        },
    },
    "Google": {
        "ja": {
            "title": "Googleタイプ",
            "copy": "明るさと好奇心で、ときめきを広げていく恋愛タイプ。",
            "profile": "好奇心・明るさ・遊び心を持つタイプ",
            "fallback_description": "会話や発見を楽しみながら、恋の空気を軽やかに広げていくタイプです。",
            "fallback_recommendation": "好きな相手とはテンポよく仲良くなりやすく、一緒に新しいことを楽しめる関係を好みます。",
        },
        "en": {
            "title": "Google Type",
            "copy": "A love type that expands attraction through curiosity, brightness, and playful energy.",
            "profile": "a type with curiosity, brightness, and playfulness",
            "fallback_description": "You naturally build attraction through conversation, discovery, and a light, upbeat vibe.",
            "fallback_recommendation": "You tend to bond quickly with someone you like and enjoy relationships that feel fresh and fun.",
        },
        "zh": {
            "title": "Google型",
            "copy": "用明亮感和好奇心，把心动一点点放大的恋爱类型。",
            "profile": "充满好奇心、明亮感和玩心的类型",
            "fallback_description": "你很会通过聊天、发现新鲜感和轻松气氛，让暧昧自然升温。",
            "fallback_recommendation": "面对喜欢的人，你通常比较容易快速熟起来，也偏爱一起探索新鲜事物的关系。",
        },
        "ko": {
            "title": "Google 타입",
            "copy": "밝음과 호기심으로 설렘을 넓혀 가는 연애 타입.",
            "profile": "호기심, 밝음, 장난기를 가진 타입",
            "fallback_description": "대화와 새로운 발견을 즐기면서 가볍고 경쾌하게 호감을 키워 가는 편입니다.",
            "fallback_recommendation": "좋아하는 사람과는 빠르게 친해지기 쉽고, 함께 새로운 자극을 즐기는 관계를 선호합니다.",
        },
    },
    "Amazon": {
        "ja": {
            "title": "Amazonタイプ",
            "copy": "気持ちが動いたら早い、行動力で魅せる恋愛タイプ。",
            "profile": "行動力・実用感・テンポの良さを持つタイプ",
            "fallback_description": "迷う時間より動くタイミングを大切にして、恋を前へ進めるタイプです。",
            "fallback_recommendation": "好きになると連絡や行動も早めで、分かりやすく関係を前に進めたくなりやすいです。",
        },
        "en": {
            "title": "Amazon Type",
            "copy": "A love type that moves fast once feelings click and shows interest through action.",
            "profile": "a type with action, practicality, and good tempo",
            "fallback_description": "You prefer momentum over hesitation and tend to move a connection forward in practical ways.",
            "fallback_recommendation": "When you like someone, your messages and actions often become quicker and more direct.",
        },
        "zh": {
            "title": "Amazon型",
            "copy": "一旦心动就很快行动，用节奏感推进关系的恋爱类型。",
            "profile": "拥有行动力、务实感和节奏感的类型",
            "fallback_description": "你比起反复犹豫，更重视及时行动，喜欢让关系有明确推进。",
            "fallback_recommendation": "对喜欢的人，你往往会更主动、更直接，也更希望关系往前走得清晰一点。",
        },
        "ko": {
            "title": "Amazon 타입",
            "copy": "마음이 움직이면 빠르게 행동으로 보여 주는 연애 타입.",
            "profile": "행동력, 현실감, 좋은 템포를 지닌 타입",
            "fallback_description": "오래 망설이기보다 적절한 타이밍에 움직여 관계를 앞으로 밀어가는 편입니다.",
            "fallback_recommendation": "좋아하는 사람이 생기면 연락과 행동이 빨라지고, 관계를 분명하게 진전시키고 싶어 합니다.",
        },
    },
    "Microsoft": {
        "ja": {
            "title": "Microsoftタイプ",
            "copy": "安心感とやさしさで、じっくり距離を縮める恋愛タイプ。",
            "profile": "安心感・やさしさ・誠実さを持つタイプ",
            "fallback_description": "相手に寄り添いながら、無理のないペースで信頼を育てるタイプです。",
            "fallback_recommendation": "恋愛では急ぎすぎず、やさしい会話や気遣いで自然に心の距離を近づけます。",
        },
        "en": {
            "title": "Microsoft Type",
            "copy": "A love type that closes the distance through warmth, patience, and reassurance.",
            "profile": "a type with reassurance, kindness, and sincerity",
            "fallback_description": "You build trust gently and make people feel safe around you without forcing the pace.",
            "fallback_recommendation": "In love, you usually rely on steady care, kind words, and emotional consistency.",
        },
        "zh": {
            "title": "Microsoft型",
            "copy": "用温柔和安心感，慢慢拉近距离的恋爱类型。",
            "profile": "拥有安心感、温柔和真诚的类型",
            "fallback_description": "你很会照顾对方的感受，也擅长在不勉强的节奏里建立信任。",
            "fallback_recommendation": "在恋爱中，你通常不会太急，而是靠稳定、贴心和持续的关心让关系变近。",
        },
        "ko": {
            "title": "Microsoft 타입",
            "copy": "안정감과 다정함으로 천천히 가까워지는 연애 타입.",
            "profile": "안정감, 다정함, 성실함을 지닌 타입",
            "fallback_description": "상대를 배려하며 무리하지 않는 속도로 신뢰를 쌓아 가는 편입니다.",
            "fallback_recommendation": "연애에서는 서두르기보다 다정한 대화와 꾸준한 배려로 마음의 거리를 좁힙니다.",
        },
    },
    "Tesla": {
        "ja": {
            "title": "Teslaタイプ",
            "copy": "情熱の熱量で、一気に空気を変える恋愛タイプ。",
            "profile": "情熱・強い引力・勢いを持つタイプ",
            "fallback_description": "気持ちが高まると一直線で、恋の温度を一気に上げるタイプです。",
            "fallback_recommendation": "好きになると熱量が伝わりやすく、本音は隠していても態度には出やすいです。",
        },
        "en": {
            "title": "Tesla Type",
            "copy": "A love type that changes the whole mood with passion, pull, and intensity.",
            "profile": "a type with passion, strong pull, and momentum",
            "fallback_description": "Once your feelings rise, you move intensely and can shift the emotional energy very quickly.",
            "fallback_recommendation": "When you like someone, your intensity tends to show even if you try to hide your softer feelings.",
        },
        "zh": {
            "title": "Tesla型",
            "copy": "带着强烈热度和吸引力，一下子改变气氛的恋爱类型。",
            "profile": "拥有热情、强引力和冲劲的类型",
            "fallback_description": "一旦心动升温，你就会很直接，能迅速把恋爱的温度推高。",
            "fallback_recommendation": "面对喜欢的人，你的热度通常藏不太住，就算嘴上克制，态度里也很容易露出来。",
        },
        "ko": {
            "title": "Tesla 타입",
            "copy": "강한 열기와 끌림으로 분위기를 단번에 바꾸는 연애 타입.",
            "profile": "열정, 강한 끌림, 추진력을 지닌 타입",
            "fallback_description": "감정이 올라오면 곧장 직진하며 연애의 온도를 빠르게 끌어올리는 편입니다.",
            "fallback_recommendation": "좋아하는 사람이 생기면 속마음을 숨기려 해도 태도와 분위기에서 열기가 드러나기 쉽습니다.",
        },
    },
    "Meta": {
        "ja": {
            "title": "Metaタイプ",
            "copy": "共感とつながりで、恋の空気をあたためるタイプ。",
            "profile": "共感・つながり・やわらかなコミュニケーションを持つタイプ",
            "fallback_description": "相手の気分に寄り添いながら、自然なやり取りで空気をあたためるタイプです。",
            "fallback_recommendation": "恋愛では会話や共感を通して親しくなりやすく、気持ちを共有できる関係を好みます。",
        },
        "en": {
            "title": "Meta Type",
            "copy": "A love type that warms the mood through empathy, connection, and easy communication.",
            "profile": "a type with empathy, connection, and soft communication",
            "fallback_description": "You make people feel close through emotional awareness and naturally warm conversation.",
            "fallback_recommendation": "In love, you often grow closer through shared feelings, regular contact, and emotional reciprocity.",
        },
        "zh": {
            "title": "Meta型",
            "copy": "靠共感和连接感，把恋爱氛围慢慢暖起来的类型。",
            "profile": "拥有共感、连接感和柔和沟通力的类型",
            "fallback_description": "你很会感受对方的情绪，也擅长用自然的互动让关系变得亲近。",
            "fallback_recommendation": "在恋爱里，你通常会通过聊天、共鸣和持续联系，一点点拉近彼此距离。",
        },
        "ko": {
            "title": "Meta 타입",
            "copy": "공감과 연결감으로 연애의 공기를 따뜻하게 만드는 타입.",
            "profile": "공감, 연결감, 부드러운 소통력을 지닌 타입",
            "fallback_description": "상대의 기분을 잘 읽고 자연스러운 대화로 가까운 분위기를 만드는 편입니다.",
            "fallback_recommendation": "연애에서는 공감과 꾸준한 소통을 통해 친밀감을 쌓아 가는 관계를 선호합니다.",
        },
    },
    "Nvidia": {
        "ja": {
            "title": "Nvidiaタイプ",
            "copy": "ミステリアスな余韻で、じわっと惹かせる恋愛タイプ。",
            "profile": "ミステリアス・深夜感・静かな吸引力を持つタイプ",
            "fallback_description": "全部を見せ切らず、余韻や静かな雰囲気で惹きつけるタイプです。",
            "fallback_recommendation": "恋愛では慎重に距離を縮めつつ、知るほど気になる空気を自然に作りやすいです。",
        },
        "en": {
            "title": "Nvidia Type",
            "copy": "A love type that attracts people slowly through mystery, depth, and quiet magnetism.",
            "profile": "a type with mystery, midnight mood, and quiet magnetism",
            "fallback_description": "You rarely reveal everything at once and often leave a lingering, intriguing emotional impression.",
            "fallback_recommendation": "In love, you tend to move carefully while naturally creating a mood that makes people want to know more.",
        },
        "zh": {
            "title": "Nvidia型",
            "copy": "靠神秘感和余韵，慢慢让人上头的恋爱类型。",
            "profile": "拥有神秘感、深夜氛围和安静吸引力的类型",
            "fallback_description": "你不会一下子把全部情绪都摊开，而是更容易用氛围和余韵打动人。",
            "fallback_recommendation": "在恋爱里，你通常会谨慎靠近，但也很会自然营造“越了解越想靠近”的感觉。",
        },
        "ko": {
            "title": "Nvidia 타입",
            "copy": "미스터리한 여운으로 천천히 빠져들게 하는 연애 타입.",
            "profile": "미스터리함, 밤 같은 무드, 조용한 흡인력을 지닌 타입",
            "fallback_description": "감정을 한 번에 모두 드러내기보다 여운과 분위기로 상대를 끌어당기는 편입니다.",
            "fallback_recommendation": "연애에서는 조심스럽게 다가가면서도, 알수록 더 궁금해지는 공기를 자연스럽게 만듭니다.",
        },
    },
    "Netflix": {
        "ja": {
            "title": "Netflixタイプ",
            "copy": "ドラマみたいな余韻で、感情を深く残す恋愛タイプ。",
            "profile": "映画感・余韻・感情表現の強さを持つタイプ",
            "fallback_description": "見せ方や空気づくりがうまく、感情の印象を深く残しやすいタイプです。",
            "fallback_recommendation": "恋愛では特別感や物語性を大切にし、忘れられない時間を作ろうとしやすいです。",
        },
        "en": {
            "title": "Netflix Type",
            "copy": "A love type that leaves a cinematic afterglow and makes emotions feel unforgettable.",
            "profile": "a type with cinematic mood, afterglow, and strong emotional expression",
            "fallback_description": "You know how to shape the mood and leave emotional moments that feel vivid and memorable.",
            "fallback_recommendation": "In love, you often value chemistry, timing, and the kind of moments that feel like a scene from a story.",
        },
        "zh": {
            "title": "Netflix型",
            "copy": "像电影余韵一样，把情绪深深留住的恋爱类型。",
            "profile": "拥有电影感、余韵和强烈情绪表达的类型",
            "fallback_description": "你很会营造氛围，也容易让一段情绪或瞬间在别人心里停留很久。",
            "fallback_recommendation": "在恋爱里，你通常很在意感觉、时机和故事感，喜欢让相处变得难忘。",
        },
        "ko": {
            "title": "Netflix 타입",
            "copy": "영화 같은 여운으로 감정을 깊게 남기는 연애 타입.",
            "profile": "영화 같은 무드, 여운, 강한 감정 표현을 지닌 타입",
            "fallback_description": "분위기와 연출 감각이 좋아서 감정의 장면을 오래 기억에 남기기 쉽습니다.",
            "fallback_recommendation": "연애에서는 특별한 분위기와 서사를 중요하게 여기며, 오래 남는 순간을 만들고 싶어 합니다.",
        },
    },
}

BASE_TYPE_LAYOUTS = [
    ["Apple", "Google", "Amazon", "Microsoft"],
    ["Tesla", "Meta", "Nvidia", "Netflix"],
    ["Apple", "Tesla", "Google", "Meta"],
    ["Amazon", "Microsoft", "Nvidia", "Netflix"],
    ["Apple", "Amazon", "Tesla", "Netflix"],
    ["Google", "Microsoft", "Meta", "Nvidia"],
    ["Apple", "Meta", "Amazon", "Nvidia"],
    ["Google", "Tesla", "Microsoft", "Netflix"],
    ["Apple", "Google", "Tesla", "Nvidia"],
    ["Amazon", "Microsoft", "Meta", "Netflix"],
]

ALLOWED_TYPE_KEYS = set(TYPE_LOCALES.keys())

QUESTION_FORBIDDEN_TERMS = {
    "common": [
        "apple",
        "google",
        "amazon",
        "microsoft",
        "tesla",
        "meta",
        "nvidia",
        "netflix",
        "mac",
        "iphone",
        "gpu",
        "ai chip",
        "cloud",
        "sns",
        "movie",
        "movies",
        "electric vehicle",
        "search engine",
        "subscription",
        "delivery",
        "windows",
    ],
    "ja": [
        "恋愛",
        "好きな人",
        "デート",
        "告白",
        "恋人",
        "彼氏",
        "彼女",
        "モテ",
        "愛情表現",
        "企業名",
        "ガジェット",
        "aiチップ",
        "クラウド",
        "映画",
        "電気自動車",
        "検索エンジン",
        "サブスク",
        "配送",
        "os",
        "windows",
    ],
    "en": [
        "love",
        "romance",
        "crush",
        "dating",
        "date",
        "confession",
        "partner",
        "boyfriend",
        "girlfriend",
        "popular",
        "affection",
        "company",
        "brand",
        "gadget",
        "social media",
        "operating system",
    ],
    "zh": [
        "恋爱",
        "喜欢的人",
        "约会",
        "告白",
        "恋人",
        "男朋友",
        "女朋友",
        "桃花",
        "爱意表达",
        "企业名",
        "公司",
        "苹果",
        "谷歌",
        "亚马逊",
        "微软",
        "特斯拉",
        "英伟达",
        "网飞",
        "云服务",
        "社交媒体",
        "电影",
        "电动车",
        "搜索引擎",
        "订阅",
        "配送",
        "操作系统",
    ],
    "ko": [
        "연애",
        "좋아하는 사람",
        "데이트",
        "고백",
        "연인",
        "남자친구",
        "여자친구",
        "인기",
        "애정표현",
        "기업명",
        "회사",
        "애플",
        "구글",
        "아마존",
        "마이크로소프트",
        "테슬라",
        "메타",
        "엔비디아",
        "넷플릭스",
        "클라우드",
        "영화",
        "전기차",
        "검색엔진",
        "구독",
        "배송",
        "운영체제",
    ],
}

QUESTION_CATEGORY_BUCKETS = {
    "social": [
        "friend hangout flow",
        "how someone opens or extends a conversation",
        "reaction to a slightly awkward mood",
        "light message-checking or reply timing without naming platforms",
    ],
    "school": [
        "school life",
        "festival or event preparation",
        "group work",
        "after-school movement or detours",
    ],
    "solo": [
        "alone time",
        "how a free weekend gap is spent",
        "late-night mood or routine",
        "tidying a room, desk, or bag",
    ],
    "change": [
        "a sudden plan change",
        "first time in a new place",
        "recovering from a small mistake",
        "starting something unfamiliar",
    ],
    "choice": [
        "how someone keeps photos or memories",
        "how someone makes a small purchase choice",
        "what detail catches the eye first",
        "what someone cares about while making or finishing something",
    ],
}

QUESTION_SCENE_TEXTURE_POOL = [
    "after school",
    "on the way home",
    "right before meeting up",
    "a quiet weekend morning",
    "a slightly sleepy late evening",
    "a rainy day",
    "a sunny day with extra time",
    "just before a deadline",
    "when there is a short wait",
    "in a place that feels a little unfamiliar",
    "during a casual break",
    "when plans become a little loose",
]

QUESTION_OPENING_STYLE_POOL = [
    "When ...",
    "You are in the middle of ...",
    "Suppose ...",
    "On a day when ...",
    "Right after ...",
    "If the mood suddenly ...",
    "At the moment you notice ...",
    "While everyone is deciding ...",
]

question_cache: dict[str, list[dict]] = {}


class LanguagePayload(BaseModel):
    language: str = "ja"


class AnswerItem(BaseModel):
    questions: str
    answer: str
    type: str


class AnswerData(BaseModel):
    language: str = "ja"
    answers: list[AnswerItem]


def normalize_language(language: str | None) -> str:
    if not language:
        return "ja"

    normalized = language.lower().strip()

    if normalized.startswith("ja"):
        return "ja"
    if normalized.startswith("en"):
        return "en"
    if normalized.startswith("zh"):
        return "zh"
    if normalized.startswith("ko"):
        return "ko"

    return "ja"


def get_type_locale(type_name: str, language: str) -> dict[str, str]:
    normalized_language = normalize_language(language)
    return TYPE_LOCALES[type_name][normalized_language]


def build_random_type_layouts() -> list[list[str]]:
    layouts = [layout[:] for layout in BASE_TYPE_LAYOUTS]
    random.shuffle(layouts)

    randomized_layouts = []
    for layout in layouts:
        shuffled_layout = layout[:]
        random.shuffle(shuffled_layout)
        randomized_layouts.append(shuffled_layout)

    return randomized_layouts


def build_random_type_layout_text(layouts: list[list[str]]) -> str:
    return "\n\n".join(
        f"Q{index}:\n" + "\n".join(layout)
        for index, layout in enumerate(layouts, start=1)
    )


def get_question_forbidden_terms(language: str) -> list[str]:
    normalized_language = normalize_language(language)
    terms = QUESTION_FORBIDDEN_TERMS["common"] + QUESTION_FORBIDDEN_TERMS.get(normalized_language, [])
    return list(dict.fromkeys(terms))


def call_openrouter_chat(messages: list[dict[str, str]], timeout: int = 10, max_tokens: int | None = None) -> str:
    if not OPEN_ROUTER_KEY:
        raise ValueError("OPENROUTER_API_KEY is not configured.")

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
    }

    if max_tokens is not None:
        payload["max_tokens"] = max_tokens

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPEN_ROUTER_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=timeout,
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


def strip_json_wrapper(raw_text: str) -> str:
    trimmed = raw_text.strip()

    if trimmed.startswith("```json"):
        trimmed = trimmed.replace("```json", "", 1).strip()
    if trimmed.startswith("```"):
        trimmed = trimmed.replace("```", "", 1).strip()
    if trimmed.endswith("```"):
        trimmed = trimmed[:-3].strip()

    return trimmed


def sample_question_prompt_context() -> dict[str, list[str]]:
    selected_categories = []

    for bucket_categories in QUESTION_CATEGORY_BUCKETS.values():
        selected_categories.extend(random.sample(bucket_categories, 2))

    random.shuffle(selected_categories)

    return {
        "categories": selected_categories,
        "scene_textures": random.sample(QUESTION_SCENE_TEXTURE_POOL, 5),
        "opening_styles": random.sample(QUESTION_OPENING_STYLE_POOL, 4),
    }


def build_question_generation_prompts(language: str, type_layout_text: str) -> tuple[str, str]:
    normalized_language = normalize_language(language)
    settings = LANGUAGE_SETTINGS[normalized_language]
    forbidden_terms_text = ", ".join(get_question_forbidden_terms(normalized_language))
    variation_context = sample_question_prompt_context()
    category_text = "\n".join(
        f"{index}. {category}"
        for index, category in enumerate(variation_context["categories"], start=1)
    )
    texture_text = "\n".join(f"- {texture}" for texture in variation_context["scene_textures"])
    opening_style_text = "\n".join(f"- {style}" for style in variation_context["opening_styles"])

    system_prompt = f"""
You create indirect, hard-to-read personality questions for a school festival diagnosis app.
Output language: {settings["output_name"]}.
{settings["question_output_rule"]}

Core goal:
- The participant should not be able to tell that the diagnosis relates to love tendencies or hidden brand-inspired personality types.
- The questions should feel like a stylish daily-life personality quiz.
- When the participant later sees the result, it should feel surprisingly accurate.
- Each run should feel fresh, not like a repeated template.

Non-negotiable safety rules:
- Do not mention romance directly.
- Do not mention any company, brand, product, device, service, platform, operating system, movie/media category, or tech field directly.
- Do not use any forbidden term or any close equivalent in the output language.
- Return JSON only.
- No markdown.
- No code block.
- No explanation before or after the JSON.
""".strip()

    user_prompt = f"""
Generate exactly 10 balanced situational questions for this personality diagnosis.

Important hidden-design requirement:
The result may feel related to emotional style or relationship tendencies in hindsight,
but the questions themselves must stay neutral and rooted in everyday behavior.

Variation requirement:
- Make this run feel noticeably different from previous runs.
- Distribute question categories across the 10 questions instead of clustering similar scenes together.
- Use at least 7 distinct categories in the set.
- Do not let the same category appear in adjacent questions.
- Do not let more than 2 questions start with the same sentence shape.
- Do not make all choices the same length or rhythm; a little natural unevenness is good.

Forbidden words and concepts:
- Do not use any of these words in question text or choice text: {forbidden_terms_text}
- Also avoid close equivalents, slang, paraphrases, or obvious substitutes in the output language.
- Do not hint at the eight type names through brand-like, gadget-like, internet-service-like, or entertainment-like wording.

Category mix for this run:
{category_text}

Scene and mood accents you may lightly weave into some questions:
{texture_text}

Question opening styles to vary across the set:
{opening_style_text}

Question writing rules:
- Do not ask personality traits directly.
- Do not ask about love, dating, attraction, confession, or partners.
- Do not use gadgets, apps, cars, chips, cloud services, social platforms, streaming, delivery, or brand references as metaphors.
- Ask about small everyday actions, choices, reactions, priorities, or moods.
- Keep the questions natural enough that they do not feel like an obvious personality test.
- Keep each question concise and easy for high school visitors to answer.
- Keep the tone light, natural, and fun.
- Make all 4 choices feel plausible and slightly appealing.
- Do not create an obvious correct answer or a joke answer.
- Do not let the wording make the target type easy to guess.
- Avoid repeating the same sentence pattern across many questions.
- Let some questions feel school-based, some social, some solitary, some about change, and some about small choices.

Choice writing rules:
- Each choice should reflect a different style of reacting or prioritizing.
- Choices should differ by nuance, tempo, attention, energy, or social movement.
- Avoid choices that sound like labels, slogans, or archetype names.
- Avoid choices that sound too perfect, too cold, or too extreme.
- Avoid making all four choices equally polished or symmetrical; they should feel like real options a person might instinctively pick.

Important:
Each question already has a fixed set of 4 type keys.
You must use those exact type keys for the `type` field.
Never translate or rename the `type` field values.

Type layout:

{type_layout_text}

Important output rules:
- There must be exactly 10 questions.
- Each question must have exactly 4 choices.
- Each question must use the exact 4 type keys assigned to it.
- No duplicated type key inside the same question.
- The `type` field values must remain exactly one of:
  Apple, Google, Amazon, Microsoft, Tesla, Meta, Nvidia, Netflix
- Return JSON only.
- No markdown.
- No code block.
- No explanation.

Output JSON format:
{{
  "questions": [
    {{
      "text": "Question text",
      "choices": [
        {{
          "text": "Choice text",
          "type": "Apple"
        }}
      ]
    }}
  ]
}}
""".strip()

    return system_prompt, user_prompt


def text_contains_forbidden_term(text: str, term: str) -> bool:
    normalized_text = text.casefold()
    normalized_term = term.casefold().strip()

    if not normalized_term:
        return False

    if re.fullmatch(r"[a-z0-9][a-z0-9 +.-]*", normalized_term):
        pattern = rf"(?<![a-z0-9]){re.escape(normalized_term)}(?![a-z0-9])"
        return re.search(pattern, normalized_text) is not None

    return normalized_term in normalized_text


def validate_generated_questions_payload(payload: dict, language: str, expected_layouts: list[list[str]]) -> None:
    normalized_language = normalize_language(language)

    if not isinstance(payload, dict):
        raise ValueError("Questions payload must be a JSON object.")

    questions = payload.get("questions")
    if not isinstance(questions, list) or len(questions) != 10:
        raise ValueError("Questions payload must contain exactly 10 questions.")

    forbidden_terms = get_question_forbidden_terms(normalized_language)

    for question_index, question in enumerate(questions):
        if not isinstance(question, dict):
            raise ValueError(f"Question {question_index + 1} must be an object.")

        question_text = question.get("text")
        if not isinstance(question_text, str) or not question_text.strip():
            raise ValueError(f"Question {question_index + 1} must have text.")

        for term in forbidden_terms:
            if text_contains_forbidden_term(question_text, term):
                raise ValueError(f"Forbidden term '{term}' found in question {question_index + 1}.")

        choices = question.get("choices")
        if not isinstance(choices, list) or len(choices) != 4:
            raise ValueError(f"Question {question_index + 1} must have exactly 4 choices.")

        expected_types = set(expected_layouts[question_index])
        found_types = set()

        for choice_index, choice in enumerate(choices):
            if not isinstance(choice, dict):
                raise ValueError(f"Choice {choice_index + 1} in question {question_index + 1} must be an object.")

            choice_text = choice.get("text")
            choice_type = choice.get("type")

            if not isinstance(choice_text, str) or not choice_text.strip():
                raise ValueError(f"Choice {choice_index + 1} in question {question_index + 1} must have text.")

            if choice_type not in ALLOWED_TYPE_KEYS:
                raise ValueError(f"Invalid type '{choice_type}' in question {question_index + 1}.")

            for term in forbidden_terms:
                if text_contains_forbidden_term(choice_text, term):
                    raise ValueError(
                        f"Forbidden term '{term}' found in choice {choice_index + 1} of question {question_index + 1}."
                    )

            found_types.add(choice_type)

        if found_types != expected_types:
            raise ValueError(
                f"Question {question_index + 1} types do not match the assigned layout. "
                f"Expected {sorted(expected_types)}, got {sorted(found_types)}."
            )


def parse_and_validate_questions_payload(raw_questions: str, language: str, expected_layouts: list[list[str]]) -> dict:
    parsed = json.loads(strip_json_wrapper(raw_questions))
    validate_generated_questions_payload(parsed, language, expected_layouts)
    return parsed


def build_type_summary(counts: dict[str, int], language: str) -> str:
    return "\n".join(
        f"- {get_type_locale(type_name, language)['title']}: {score}"
        for type_name, score in sorted(counts.items(), key=lambda item: item[1], reverse=True)
        if score > 0
    )


def format_answers_for_prompt(answers: list[AnswerItem]) -> str:
    return "\n\n".join(
        f"{index + 1}. Question: {item.questions}\nAnswer: {item.answer}\nType key: {item.type}"
        for index, item in enumerate(answers)
    )


def generate_diagnosis_text(
    best_type: str,
    answers: list[AnswerItem],
    counts: dict[str, int],
    sub_type: str | None,
    language: str,
) -> dict[str, str]:
    normalized_language = normalize_language(language)
    settings = LANGUAGE_SETTINGS[normalized_language]

    if not OPEN_ROUTER_KEY:
        return {
            "description": settings["fallback_comment"],
            "recommendation": settings["fallback_love"],
        }

    best_profile = get_type_locale(best_type, normalized_language)
    subtype_section = (
        f"- Secondary type: {get_type_locale(sub_type, normalized_language)['title']}\n"
        f"- Secondary profile: {get_type_locale(sub_type, normalized_language)['profile']}"
        if sub_type is not None
        else "- Secondary type: none"
    )

    system_prompt = f"""
You are the analysis AI for a mobile-friendly love personality diagnosis app.
Output language: {settings["output_name"]}.
{settings["result_output_rule"]}

Tone requirements:
- Natural and native, never stiff or literal
- Warm, emotionally resonant, and easy to share
- Feels suitable for a school festival love/personality quiz
- Do not sound clinical, robotic, or judgmental
- Positive, grounded, and lightly insightful
- Do not sound like fortune telling

Important rules:
- Do not decide the whole text from the best type alone
- Read all answers carefully and reflect the user's actual patterns
- If a subtype exists, blend it in naturally
- If score gaps are small, reflect that nuance
- Avoid generic type-description paraphrases
- Output JSON only
- No markdown
- No code block
- No preface
- No extra text outside the JSON

Output rules:
- Return exactly this JSON shape:
  {{
    "description": "...",
    "recommendation": "..."
  }}
- `description` is for "AIが見つけた本音"
- `recommendation` is for "恋愛モード"
- `description` length: {settings["diagnosis_description_length"]}
- `recommendation` length: {settings["diagnosis_recommendation_length"]}
- Each field should be 2 to 3 short sentences
""".strip()

    user_prompt = f"""
Create both result fields for this person.

Primary type:
- {best_profile["title"]}
- Profile: {best_profile["profile"]}

{subtype_section}

Score trend:
{build_type_summary(counts, normalized_language)}

Answer history:
{format_answers_for_prompt(answers)}

description requirements:
- Analyze the user's personality from the answer tendencies
- Focus on emotional style, social rhythm, and how they naturally come across
- Keep it positive and specific

recommendation requirements:
- Describe how this person tends to interact when feelings deepen
- Mention a strength that becomes attractive in close relationships
- Keep it positive and practical
""".strip()

    try:
        raw_text = call_openrouter_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=360,
        )
        parsed = json.loads(strip_json_wrapper(raw_text))
        description = str(parsed.get("description", "")).strip()
        recommendation = str(parsed.get("recommendation", "")).strip()

        if not description or not recommendation:
            raise ValueError("Diagnosis JSON is missing description or recommendation.")

        return {
            "description": description,
            "recommendation": recommendation,
        }
    except Exception as error:
        print("AI diagnosis text error:", error)
        return {
            "description": settings["fallback_comment"],
            "recommendation": settings["fallback_love"],
        }


def generate_questions(language: str) -> tuple[dict, list[list[str]]]:
    normalized_language = normalize_language(language)
    type_layouts = build_random_type_layouts()
    type_layout_text = build_random_type_layout_text(type_layouts)
    system_prompt, user_prompt = build_question_generation_prompts(normalized_language, type_layout_text)
    raw_questions = call_openrouter_chat(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
    )
    parsed_questions = parse_and_validate_questions_payload(raw_questions, normalized_language, type_layouts)
    return parsed_questions, type_layouts


def get_or_create_questions(language: str) -> list[dict]:
    normalized_language = normalize_language(language)

    if normalized_language in question_cache:
        return question_cache[normalized_language]

    generated_payload, _ = generate_questions(normalized_language)
    question_cache[normalized_language] = generated_payload["questions"]
    return question_cache[normalized_language]


@app.get("/")
def read_index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/reset-questions")
def reset_questions_get(language: str = "ja"):
    normalized_language = normalize_language(language)
    question_cache.pop(normalized_language, None)
    return {"message": "questions reset", "language": normalized_language}


@app.post("/reset-questions")
def reset_questions(payload: LanguagePayload):
    normalized_language = normalize_language(payload.language)
    question_cache.pop(normalized_language, None)
    return {"message": "questions reset", "language": normalized_language}


@app.get("/questions")
def questions_get(language: str = "ja"):
    normalized_language = normalize_language(language)
    try:
        questions = get_or_create_questions(normalized_language)
        return {"questions": questions, "message": "ok", "language": normalized_language}
    except Exception as error:
        print("questions error:", error)
        return {"questions": [], "message": "failed", "language": normalized_language}


@app.post("/questions")
def questions(payload: LanguagePayload):
    normalized_language = normalize_language(payload.language)
    try:
        questions = get_or_create_questions(normalized_language)
        return {"questions": questions, "message": "ok", "language": normalized_language}
    except Exception as error:
        print("questions error:", error)
        return {"questions": [], "message": "failed", "language": normalized_language}


@app.post("/diagnose")
def diagnose(data: AnswerData):
    normalized_language = normalize_language(data.language)

    counts = {
        "Apple": 0,
        "Google": 0,
        "Amazon": 0,
        "Microsoft": 0,
        "Tesla": 0,
        "Meta": 0,
        "Nvidia": 0,
        "Netflix": 0,
    }

    for answer in data.answers:
        counts[answer.type] += 1

    sorted_types = sorted(counts.items(), key=lambda item: item[1], reverse=True)
    best_type = sorted_types[0][0]
    sub_type = next((type_name for type_name, score in sorted_types[1:] if score > 0), None)

    best_locale = get_type_locale(best_type, normalized_language)
    diagnosis_text = generate_diagnosis_text(best_type, data.answers, counts, sub_type, normalized_language)
    description = diagnosis_text["description"]
    recommendation = diagnosis_text["recommendation"]

    if description == LANGUAGE_SETTINGS[normalized_language]["fallback_comment"]:
        description = best_locale["fallback_description"]

    if recommendation == LANGUAGE_SETTINGS[normalized_language]["fallback_love"]:
        recommendation = best_locale["fallback_recommendation"]

    return {
        "title": best_locale["title"],
        "copy": best_locale["copy"],
        "description": description,
        "recommendation": recommendation,
        "bestType": best_type,
        "subtype": sub_type,
        "language": normalized_language,
        "message": "ok",
    }
