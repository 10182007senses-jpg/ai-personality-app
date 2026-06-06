import json
import os
import random
import re
import threading
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
        "diagnosis_description_length": "160 to 200 Japanese characters",
        "diagnosis_recommendation_length": "160 to 200 Japanese characters",
        "fallback_comment": "準備中...",
        "fallback_love": "準備中...",
    },
    "en": {
        "output_name": "English",
        "question_output_rule": "All question text and choice text must be written in natural English.",
        "result_output_rule": "All result text must be written in natural English.",
        "comment_length": "40 to 80 characters",
        "love_length": "70 to 120 characters",
        "diagnosis_description_length": "240 to 320 characters (3 full sentences minimum — each sentence must be at least 40 characters)",
        "diagnosis_recommendation_length": "240 to 320 characters (3 full sentences minimum — each sentence must be at least 40 characters)",
        "fallback_comment": "Preparing your result...",
        "fallback_love": "Preparing your result...",
    },
    "zh": {
        "output_name": "Simplified Chinese",
        "question_output_rule": "所有问题和选项都必须使用自然的简体中文。",
        "result_output_rule": "所有结果文案都必须使用自然的简体中文。",
        "comment_length": "30 to 60 Chinese characters",
        "love_length": "50 to 90 Chinese characters",
        "diagnosis_description_length": "160 to 200 Chinese characters (strict minimum — each sentence must be at least 40 characters)",
        "diagnosis_recommendation_length": "160 to 200 Chinese characters (strict minimum — each sentence must be at least 40 characters)",
        "fallback_comment": "准备中...",
        "fallback_love": "准备中...",
    },
    "ko": {
        "output_name": "Korean",
        "question_output_rule": "모든 질문과 선택지는 자연스러운 한국어로 작성하세요.",
        "result_output_rule": "모든 결과 문장은 자연스러운 한국어로 작성하세요.",
        "comment_length": "35 to 70 Korean characters",
        "love_length": "55 to 100 Korean characters",
        "diagnosis_description_length": "160자에서 200자",
        "diagnosis_recommendation_length": "160자에서 200자",
        "fallback_comment": "준비 중...",
        "fallback_love": "준비 중...",
    },
}

TYPE_LOCALES = {
    "Apple": {
        "ja": {
            "title": "Appleタイプ",
            "copy": "透明感と洗練で、静かに際立つパーソナリティ。",
            "profile": "透明感・洗練・静かな余裕を持つパーソナリティ",
            "fallback_description": "感情を大げさに見せず、上品な存在感で自然に人を惹きつけるタイプです。",
            "fallback_recommendation": "恋愛では丁寧に距離を縮めやすく、心地よさや品の良さを大切にします。",
        },
        "en": {
            "title": "Apple Type",
            "copy": "A personality that stands out quietly through clarity and polish.",
            "profile": "a personality with clarity, refinement, and calm confidence",
            "fallback_description": "You draw people in with understated presence rather than loud gestures.",
            "fallback_recommendation": "In love, you close the distance gently and value comfort, taste, and emotional balance.",
        },
        "zh": {
            "title": "Apple型",
            "copy": "靠透明感与精致感，安静散发独特魅力的个性。",
            "profile": "拥有透明感、精致感和从容气质的个性",
            "fallback_description": "你不需要刻意表现，自然散发出的气质就能默默打动身边的人。",
            "fallback_recommendation": "在恋爱里，你更容易用温柔而有分寸的方式拉近距离，也很在意相处的质感。",
        },
        "ko": {
            "title": "Apple 타입",
            "copy": "투명함과 세련됨으로 조용히 존재감을 드러내는 퍼스널리티.",
            "profile": "투명함, 세련됨, 차분한 여유를 지닌 퍼스널리티",
            "fallback_description": "감정을 크게 드러내기보다 은은한 분위기로 자연스럽게 주변을 이끄는 편입니다.",
            "fallback_recommendation": "연애에서는 천천히 거리를 좁히며 편안함과 분위기의 결을 중요하게 생각합니다.",
        },
    },
    "Google": {
        "ja": {
            "title": "Googleタイプ",
            "copy": "明るさと好奇心で、どこでも空気を変えるパーソナリティ。",
            "profile": "好奇心・明るさ・遊び心を持つパーソナリティ",
            "fallback_description": "会話や新しい発見を楽しみながら、場の空気を自然と軽やかにするタイプです。",
            "fallback_recommendation": "恋愛ではテンポよく仲良くなりやすく、一緒に新しいことを楽しめる関係を好みます。",
        },
        "en": {
            "title": "Google Type",
            "copy": "A personality that brightens any room through curiosity and playful energy.",
            "profile": "a personality with curiosity, brightness, and playfulness",
            "fallback_description": "You naturally lift the energy around you through conversation, discovery, and an upbeat vibe.",
            "fallback_recommendation": "In love, you tend to bond quickly and enjoy relationships that feel fresh and full of new experiences.",
        },
        "zh": {
            "title": "Google型",
            "copy": "用明亮感和好奇心，随时把气氛带动起来的个性。",
            "profile": "充满好奇心、明亮感和玩心的个性",
            "fallback_description": "你很擅长通过聊天和发现新鲜感，自然而然地让周围气氛变得轻松活跃。",
            "fallback_recommendation": "在恋爱里，你通常比较容易快速熟起来，也偏爱一起探索新鲜事物的关系。",
        },
        "ko": {
            "title": "Google 타입",
            "copy": "밝음과 호기심으로 어디서든 분위기를 바꾸는 퍼스널리티.",
            "profile": "호기심, 밝음, 장난기를 가진 퍼스널리티",
            "fallback_description": "대화와 새로운 발견을 즐기면서 자연스럽게 주변 분위기를 밝고 경쾌하게 만드는 편입니다.",
            "fallback_recommendation": "연애에서는 빠르게 친해지기 쉽고, 함께 새로운 자극을 즐기는 관계를 선호합니다.",
        },
    },
    "Amazon": {
        "ja": {
            "title": "Amazonタイプ",
            "copy": "決めたら動く、行動力とテンポで存在感を示すパーソナリティ。",
            "profile": "行動力・実用感・テンポの良さを持つパーソナリティ",
            "fallback_description": "迷う時間より動くタイミングを大切にして、物事をテンポよく前に進めるタイプです。",
            "fallback_recommendation": "恋愛では連絡や行動も早めで、分かりやすく関係を前に進めたくなりやすいです。",
        },
        "en": {
            "title": "Amazon Type",
            "copy": "A personality that moves fast and makes things happen through action.",
            "profile": "a personality with action, practicality, and good tempo",
            "fallback_description": "You prefer momentum over hesitation and push things forward in practical, decisive ways.",
            "fallback_recommendation": "In love, your messages and actions tend to become quicker and more direct when you care.",
        },
        "zh": {
            "title": "Amazon型",
            "copy": "一旦决定就立刻行动，用节奏感推动一切的个性。",
            "profile": "拥有行动力、务实感和节奏感的个性",
            "fallback_description": "你比起反复犹豫，更重视及时行动，习惯让事情有明确的推进。",
            "fallback_recommendation": "在恋爱里，你往往会更主动、更直接，也更希望关系往前走得清晰一点。",
        },
        "ko": {
            "title": "Amazon 타입",
            "copy": "결정하면 곧장 움직이는, 행동력과 템포로 존재감을 드러내는 퍼스널리티.",
            "profile": "행동력, 현실감, 좋은 템포를 지닌 퍼스널리티",
            "fallback_description": "오래 망설이기보다 적절한 타이밍에 움직여 일을 앞으로 밀어가는 편입니다.",
            "fallback_recommendation": "연애에서는 연락과 행동이 빠르고, 관계를 분명하게 진전시키고 싶어 합니다.",
        },
    },
    "Microsoft": {
        "ja": {
            "title": "Microsoftタイプ",
            "copy": "安心感とやさしさで、そっと場を支えるパーソナリティ。",
            "profile": "安心感・やさしさ・誠実さを持つパーソナリティ",
            "fallback_description": "周囲に寄り添いながら、無理のないペースで信頼関係を育てるタイプです。",
            "fallback_recommendation": "恋愛では急ぎすぎず、やさしい会話や気遣いで自然に心の距離を近づけます。",
        },
        "en": {
            "title": "Microsoft Type",
            "copy": "A personality that supports others quietly through warmth and sincerity.",
            "profile": "a personality with reassurance, kindness, and sincerity",
            "fallback_description": "You build trust steadily and make people around you feel genuinely supported.",
            "fallback_recommendation": "In love, you rely on steady care, kind words, and consistent emotional presence.",
        },
        "zh": {
            "title": "Microsoft型",
            "copy": "用温柔和安心感，默默支撑周围人的个性。",
            "profile": "拥有安心感、温柔和真诚的个性",
            "fallback_description": "你很会照顾别人的感受，也擅长在不勉强的节奏里建立信任。",
            "fallback_recommendation": "在恋爱中，你通常靠稳定、贴心和持续的关心让关系慢慢变近。",
        },
        "ko": {
            "title": "Microsoft 타입",
            "copy": "안정감과 다정함으로 조용히 주변을 지지하는 퍼스널리티.",
            "profile": "안정감, 다정함, 성실함을 지닌 퍼스널리티",
            "fallback_description": "주변을 배려하며 무리하지 않는 속도로 신뢰를 쌓아 가는 편입니다.",
            "fallback_recommendation": "연애에서는 서두르기보다 다정한 대화와 꾸준한 배려로 마음의 거리를 좁힙니다.",
        },
    },
    "Tesla": {
        "ja": {
            "title": "Teslaタイプ",
            "copy": "情熱の熱量で、一気に空気を塗り替えるパーソナリティ。",
            "profile": "情熱・強い引力・勢いを持つパーソナリティ",
            "fallback_description": "気持ちが高まると一直線で、場の温度を一気に引き上げるタイプです。",
            "fallback_recommendation": "恋愛では熱量が伝わりやすく、本音は隠していても態度には出やすいです。",
        },
        "en": {
            "title": "Tesla Type",
            "copy": "A personality that reshapes the whole mood with passion and intensity.",
            "profile": "a personality with passion, strong pull, and momentum",
            "fallback_description": "Once you commit to something, you move with intensity and shift the energy around you quickly.",
            "fallback_recommendation": "In love, your intensity tends to show even when you try to hold back your softer feelings.",
        },
        "zh": {
            "title": "Tesla型",
            "copy": "带着强烈热度和冲劲，一下子改变气场的个性。",
            "profile": "拥有热情、强引力和冲劲的个性",
            "fallback_description": "一旦下定决心，你就会很直接地全力推进，能迅速把周围气氛推到高温。",
            "fallback_recommendation": "在恋爱里，你的热度通常藏不太住，就算嘴上克制，态度里也很容易露出来。",
        },
        "ko": {
            "title": "Tesla 타입",
            "copy": "강한 열기와 추진력으로 분위기를 단번에 바꾸는 퍼스널리티.",
            "profile": "열정, 강한 끌림, 추진력을 지닌 퍼스널리티",
            "fallback_description": "한번 결심하면 곧장 전력을 다하며 주변의 온도를 빠르게 끌어올리는 편입니다.",
            "fallback_recommendation": "연애에서는 속마음을 숨기려 해도 태도와 분위기에서 열기가 드러나기 쉽습니다.",
        },
    },
    "Meta": {
        "ja": {
            "title": "Metaタイプ",
            "copy": "共感とつながりで、人と人の間をあたためるパーソナリティ。",
            "profile": "共感・つながり・やわらかなコミュニケーションを持つパーソナリティ",
            "fallback_description": "相手の気持ちに自然に寄り添い、やり取りを通じてじんわりと場をあたためるタイプです。",
            "fallback_recommendation": "恋愛では会話や共感を通して親しくなりやすく、気持ちを共有できる関係を好みます。",
        },
        "en": {
            "title": "Meta Type",
            "copy": "A personality that warms the space between people through empathy and connection.",
            "profile": "a personality with empathy, connection, and soft communication",
            "fallback_description": "You naturally tune into how others feel and create warmth through genuine, flowing conversation.",
            "fallback_recommendation": "In love, you grow closer through shared feelings, consistent contact, and emotional reciprocity.",
        },
        "zh": {
            "title": "Meta型",
            "copy": "靠共感和连接感，温暖人与人之间关系的个性。",
            "profile": "拥有共感、连接感和柔和沟通力的个性",
            "fallback_description": "你很自然地感受到别人的情绪，也擅长用流畅的互动让关系变得更近。",
            "fallback_recommendation": "在恋爱里，你通常通过聊天、共鸣和持续联系，一点点拉近彼此距离。",
        },
        "ko": {
            "title": "Meta 타입",
            "copy": "공감과 연결감으로 사람 사이를 따뜻하게 만드는 퍼스널리티.",
            "profile": "공감, 연결감, 부드러운 소통력을 지닌 퍼스널리티",
            "fallback_description": "상대의 감정을 자연스럽게 읽고 부드러운 대화로 편안한 분위기를 만드는 편입니다.",
            "fallback_recommendation": "연애에서는 공감과 꾸준한 소통을 통해 친밀감을 쌓아 가는 관계를 선호합니다.",
        },
    },
    "Nvidia": {
        "ja": {
            "title": "Nvidiaタイプ",
            "copy": "ミステリアスな余韻と深みで、じわっと惹きつけるパーソナリティ。",
            "profile": "ミステリアス・深夜感・静かな吸引力を持つパーソナリティ",
            "fallback_description": "全部を見せ切らず、余韻や静かな雰囲気で人を引きつけるタイプです。",
            "fallback_recommendation": "恋愛では慎重に距離を縮めつつ、知るほど気になる空気を自然に作りやすいです。",
        },
        "en": {
            "title": "Nvidia Type",
            "copy": "A personality that draws people in slowly through mystery and quiet depth.",
            "profile": "a personality with mystery, midnight mood, and quiet magnetism",
            "fallback_description": "You rarely reveal everything at once and leave a lingering impression that makes people want to know more.",
            "fallback_recommendation": "In love, you move carefully and naturally create a mood that makes others want to get closer.",
        },
        "zh": {
            "title": "Nvidia型",
            "copy": "靠神秘感和深度，慢慢让人着迷的个性。",
            "profile": "拥有神秘感、深夜氛围和安静吸引力的个性",
            "fallback_description": "你不会一下子把全部都摊开，而是更容易用氛围和余韵，让人越来越想了解你。",
            "fallback_recommendation": "在恋爱里，你通常会谨慎靠近，但也很会自然营造「越了解越想靠近」的感觉。",
        },
        "ko": {
            "title": "Nvidia 타입",
            "copy": "미스터리한 여운과 깊이로 천천히 사람을 끌어당기는 퍼스널리티.",
            "profile": "미스터리함, 밤 같은 무드, 조용한 흡인력을 지닌 퍼스널리티",
            "fallback_description": "감정을 한 번에 모두 드러내기보다 여운과 분위기로 상대를 끌어당기는 편입니다.",
            "fallback_recommendation": "연애에서는 조심스럽게 다가가면서도, 알수록 더 궁금해지는 공기를 자연스럽게 만듭니다.",
        },
    },
    "Netflix": {
        "ja": {
            "title": "Netflixタイプ",
            "copy": "感情の余韻と表現力で、深く記憶に刻むパーソナリティ。",
            "profile": "映画感・余韻・感情表現の強さを持つパーソナリティ",
            "fallback_description": "場の空気づくりがうまく、感情の印象を深く残しやすいタイプです。",
            "fallback_recommendation": "恋愛では特別感や物語性を大切にし、忘れられない時間を作ろうとしやすいです。",
        },
        "en": {
            "title": "Netflix Type",
            "copy": "A personality that leaves a deep, cinematic impression through emotion and expression.",
            "profile": "a personality with cinematic mood, afterglow, and strong emotional expression",
            "fallback_description": "You know how to shape a moment and leave emotional impressions that stay with people long after.",
            "fallback_recommendation": "In love, you value the feeling of something special and tend to create moments that feel unforgettable.",
        },
        "zh": {
            "title": "Netflix型",
            "copy": "靠情绪感和表现力，在人心里留下深刻印记的个性。",
            "profile": "拥有电影感、余韵和强烈情绪表达的个性",
            "fallback_description": "你很会营造氛围，也容易让一段情绪或瞬间在别人心里停留很久。",
            "fallback_recommendation": "在恋爱里，你通常很在意感觉、时机和故事感，喜欢让相处变得难忘。",
        },
        "ko": {
            "title": "Netflix 타입",
            "copy": "감정의 여운과 표현력으로 깊은 인상을 남기는 퍼스널리티.",
            "profile": "영화 같은 무드, 여운, 강한 감정 표현을 지닌 퍼스널리티",
            "fallback_description": "분위기와 표현 감각이 좋아서 감정의 순간을 오래 기억에 남기기 쉽습니다.",
            "fallback_recommendation": "연애에서는 특별한 분위기와 서사를 중요하게 여기며, 오래 남는 순간을 만들고 싶어 합니다.",
        },
    },
}

DIAGNOSIS_TRAIT_LABELS = {
    "ja": {
        "clarity": "透明感",
        "refinement": "洗練度",
        "balance": "安定感",
        "gentleness": "やわらかさ",
        "curiosity": "好奇心",
        "expression": "表現力",
        "spontaneity": "軽やかさ",
        "friendliness": "親しみやすさ",
        "drive": "行動力",
        "decisiveness": "決断力",
        "tempo": "テンポ感",
        "practicality": "現実感",
        "kindness": "やさしさ",
        "stability": "安心感",
        "listening": "受け止め力",
        "sincerity": "誠実さ",
        "passion": "情熱",
        "magnetism": "引力",
        "boldness": "大胆さ",
        "momentum": "勢い",
        "empathy": "共感力",
        "connection": "つながり力",
        "communication": "会話力",
        "warmth": "あたたかさ",
        "insight": "洞察力",
        "focus": "集中力",
        "mystery": "神秘性",
        "composure": "静けさ",
        "sensitivity": "感受性",
        "atmosphere": "空気づくり",
        "afterglow": "余韻力",
        "creativity": "表現センス",
    },
    "en": {
        "clarity": "Clarity",
        "refinement": "Polish",
        "balance": "Balance",
        "gentleness": "Softness",
        "curiosity": "Curiosity",
        "expression": "Expression",
        "spontaneity": "Lightness",
        "friendliness": "Warmth",
        "drive": "Drive",
        "decisiveness": "Decisiveness",
        "tempo": "Pace",
        "practicality": "Practicality",
        "kindness": "Kindness",
        "stability": "Stability",
        "listening": "Listening",
        "sincerity": "Sincerity",
        "passion": "Passion",
        "magnetism": "Magnetism",
        "boldness": "Boldness",
        "momentum": "Momentum",
        "empathy": "Empathy",
        "connection": "Connection",
        "communication": "Conversation",
        "warmth": "Warmth",
        "insight": "Insight",
        "focus": "Focus",
        "mystery": "Mystery",
        "composure": "Calm",
        "sensitivity": "Sensitivity",
        "atmosphere": "Atmosphere",
        "afterglow": "Afterglow",
        "creativity": "Creative Sense",
    },
    "zh": {
        "clarity": "透明感",
        "refinement": "精致感",
        "balance": "稳定感",
        "gentleness": "柔和感",
        "curiosity": "好奇心",
        "expression": "表达力",
        "spontaneity": "轻盈感",
        "friendliness": "亲和力",
        "drive": "行动力",
        "decisiveness": "决断力",
        "tempo": "节奏感",
        "practicality": "务实感",
        "kindness": "温柔度",
        "stability": "安心感",
        "listening": "倾听力",
        "sincerity": "真诚度",
        "passion": "热度",
        "magnetism": "吸引力",
        "boldness": "大胆度",
        "momentum": "推进力",
        "empathy": "共感力",
        "connection": "连接感",
        "communication": "聊天力",
        "warmth": "温度感",
        "insight": "洞察力",
        "focus": "专注力",
        "mystery": "神秘感",
        "composure": "安静感",
        "sensitivity": "感受力",
        "atmosphere": "氛围感",
        "afterglow": "余韵感",
        "creativity": "表达感",
    },
    "ko": {
        "clarity": "투명함",
        "refinement": "세련미",
        "balance": "안정감",
        "gentleness": "부드러움",
        "curiosity": "호기심",
        "expression": "표현력",
        "spontaneity": "가벼운 템포",
        "friendliness": "친화력",
        "drive": "행동력",
        "decisiveness": "결단력",
        "tempo": "템포감",
        "practicality": "현실감",
        "kindness": "다정함",
        "stability": "안심감",
        "listening": "들어주는 힘",
        "sincerity": "성실함",
        "passion": "열정",
        "magnetism": "끌림",
        "boldness": "대담함",
        "momentum": "추진력",
        "empathy": "공감력",
        "connection": "연결감",
        "communication": "대화력",
        "warmth": "온기",
        "insight": "통찰력",
        "focus": "집중력",
        "mystery": "미스터리함",
        "composure": "차분함",
        "sensitivity": "감수성",
        "atmosphere": "무드감",
        "afterglow": "여운",
        "creativity": "표현 감각",
    },
}

DIAGNOSIS_TAG_LABELS = {
    "ja": {
        "refined": "洗練",
        "calm": "落ち着き",
        "comfort": "心地よさ",
        "trust": "信頼感",
        "steady": "安定型",
        "curious": "好奇心",
        "playful": "遊び心",
        "bright": "明るさ",
        "conversation": "会話上手",
        "fresh": "新鮮さ",
        "direct": "素直さ",
        "initiative": "主導力",
        "action": "行動派",
        "honest": "分かりやすさ",
        "reliable": "安心感",
        "care": "気配り",
        "longterm": "長期型",
        "intense": "熱量高め",
        "heat": "情熱",
        "bold": "直球感",
        "empathy": "共感力",
        "sharing": "共有型",
        "connection": "つながり重視",
        "observer": "観察者",
        "depth": "深読み型",
        "slowburn": "じわっと型",
        "mystery": "静かな魅力",
        "emotional": "感情派",
        "memorable": "余韻強め",
        "specialness": "特別感",
    },
    "en": {
        "refined": "Polished",
        "calm": "Calm",
        "comfort": "Comfort",
        "trust": "Trust",
        "steady": "Steady",
        "curious": "Curious",
        "playful": "Playful",
        "bright": "Bright",
        "conversation": "Talkative",
        "fresh": "Fresh",
        "direct": "Direct",
        "initiative": "Initiative",
        "action": "Action-first",
        "honest": "Honest",
        "reliable": "Reliable",
        "care": "Caring",
        "longterm": "Long-term",
        "intense": "Intense",
        "heat": "High Heat",
        "bold": "Bold",
        "empathy": "Empathy",
        "sharing": "Sharing",
        "connection": "Connection",
        "observer": "Observer",
        "depth": "Deep Reader",
        "slowburn": "Slow Burn",
        "mystery": "Quiet Charm",
        "emotional": "Emotional",
        "memorable": "Lingering",
        "specialness": "Special Feel",
    },
    "zh": {
        "refined": "精致感",
        "calm": "松弛感",
        "comfort": "舒服感",
        "trust": "信赖感",
        "steady": "稳定型",
        "curious": "好奇心",
        "playful": "玩心",
        "bright": "明亮感",
        "conversation": "会聊天",
        "fresh": "新鲜感",
        "direct": "直率感",
        "initiative": "主动感",
        "action": "行动派",
        "honest": "很直接",
        "reliable": "安心感",
        "care": "会照顾人",
        "longterm": "长期型",
        "intense": "热度高",
        "heat": "有火花",
        "bold": "直球感",
        "empathy": "共感力",
        "sharing": "共享型",
        "connection": "连接感",
        "observer": "观察者",
        "depth": "深读型",
        "slowburn": "慢热型",
        "mystery": "安静魅力",
        "emotional": "情绪感",
        "memorable": "后劲强",
        "specialness": "特别感",
    },
    "ko": {
        "refined": "세련미",
        "calm": "차분함",
        "comfort": "편안함",
        "trust": "신뢰감",
        "steady": "안정형",
        "curious": "호기심",
        "playful": "장난기",
        "bright": "밝은 무드",
        "conversation": "대화력",
        "fresh": "신선함",
        "direct": "솔직함",
        "initiative": "주도력",
        "action": "행동파",
        "honest": "직진감",
        "reliable": "안심감",
        "care": "배려심",
        "longterm": "장기형",
        "intense": "열기 높음",
        "heat": "열정 무드",
        "bold": "직설적",
        "empathy": "공감력",
        "sharing": "공유형",
        "connection": "연결감",
        "observer": "관찰자",
        "depth": "깊이형",
        "slowburn": "천천히형",
        "mystery": "조용한 매력",
        "emotional": "감정형",
        "memorable": "여운 강함",
        "specialness": "특별한 감",
    },
}

DIAGNOSIS_REASON_LABELS = {
    "ja": {
        "steady_comfort": "落ち着いたテンポが心地よい",
        "quiet_depth": "静けさと洞察の相性がいい",
        "bright_balance": "明るさがほどよく広がる",
        "talk_flows": "会話の広がりが自然に続く",
        "fast_fun": "テンポの良さが楽しい",
        "safe_support": "安心感が支えになりやすい",
        "calm_polish": "上品な距離感が噛み合う",
        "gentle_reassurance": "やさしい受け止め方が合う",
        "energy_match": "熱量のリズムが揃いやすい",
        "heat_afterglow": "熱さと余韻のギャップが刺さる",
        "contrast_balance": "静けさと勢いの差が魅力になる",
        "shared_feelings": "感情の共有がしやすい",
        "subtype_sync": "感覚のテンポが自然に合いやすい",
    },
    "en": {
        "steady_comfort": "Your steady pace feels easy together.",
        "quiet_depth": "Calm energy and depth fit well.",
        "bright_balance": "Their brightness opens you up nicely.",
        "talk_flows": "Conversation keeps flowing naturally.",
        "fast_fun": "The pace feels lively and fun.",
        "safe_support": "They bring a reassuring balance.",
        "calm_polish": "Your polished calm works well together.",
        "gentle_reassurance": "Their kindness makes closeness easier.",
        "energy_match": "Your momentum lines up well.",
        "heat_afterglow": "Heat and afterglow create a strong pull.",
        "contrast_balance": "The calm-and-bold contrast feels magnetic.",
        "shared_feelings": "You connect through shared emotion easily.",
        "subtype_sync": "Your emotional rhythm tends to match naturally.",
    },
    "zh": {
        "steady_comfort": "相处节奏稳定又舒服",
        "quiet_depth": "安静感和洞察力很合拍",
        "bright_balance": "对方的明亮感能自然带动你",
        "talk_flows": "聊天很容易越聊越顺",
        "fast_fun": "节奏感很对，玩起来轻松",
        "safe_support": "对方能带来刚好的安心感",
        "calm_polish": "分寸感和质感都很合适",
        "gentle_reassurance": "温柔的接法会让关系更顺",
        "energy_match": "彼此的热度节奏容易同步",
        "heat_afterglow": "热烈和余韵的反差很有吸引力",
        "contrast_balance": "安静和冲劲的反差很有火花",
        "shared_feelings": "很容易在情绪上产生共鸣",
        "subtype_sync": "彼此的感觉节奏通常很容易对上",
    },
    "ko": {
        "steady_comfort": "편안한 템포가 잘 맞아요.",
        "quiet_depth": "차분함과 깊이가 잘 통합니다.",
        "bright_balance": "상대의 밝음이 자연스럽게 풀어 줘요.",
        "talk_flows": "대화가 부드럽게 이어지기 쉬워요.",
        "fast_fun": "템포가 잘 맞아서 즐겁습니다.",
        "safe_support": "안심감을 주는 균형이 좋아요.",
        "calm_polish": "정돈된 무드와 거리감이 잘 맞아요.",
        "gentle_reassurance": "다정한 받아줌이 가까워지기 쉬워요.",
        "energy_match": "열기의 리듬이 잘 맞습니다.",
        "heat_afterglow": "뜨거움과 여운의 대비가 매력적이에요.",
        "contrast_balance": "고요함과 추진력의 대비가 끌립니다.",
        "shared_feelings": "감정을 나누는 호흡이 좋아요.",
        "subtype_sync": "감정의 템포가 자연스럽게 맞는 편이에요.",
    },
}

DIAGNOSIS_FALLBACK_PROFILES = {
    "Apple": {
        "traits": [("clarity", 5), ("refinement", 5), ("balance", 4), ("gentleness", 4)],
        "inner_tags": ["refined", "calm", "comfort"],
        "love_tags": ["trust", "steady", "care"],
        "compatibility": [("Microsoft", "steady_comfort"), ("Nvidia", "quiet_depth"), ("Google", "bright_balance")],
    },
    "Google": {
        "traits": [("curiosity", 5), ("expression", 4), ("spontaneity", 4), ("friendliness", 4)],
        "inner_tags": ["curious", "playful", "bright"],
        "love_tags": ["conversation", "fresh", "sharing"],
        "compatibility": [("Meta", "talk_flows"), ("Amazon", "fast_fun"), ("Apple", "bright_balance")],
    },
    "Amazon": {
        "traits": [("drive", 5), ("decisiveness", 4), ("tempo", 5), ("practicality", 4)],
        "inner_tags": ["direct", "initiative", "action"],
        "love_tags": ["honest", "action", "direct"],
        "compatibility": [("Tesla", "energy_match"), ("Google", "fast_fun"), ("Microsoft", "safe_support")],
    },
    "Microsoft": {
        "traits": [("kindness", 5), ("stability", 5), ("listening", 4), ("sincerity", 4)],
        "inner_tags": ["reliable", "care", "calm"],
        "love_tags": ["trust", "longterm", "comfort"],
        "compatibility": [("Apple", "calm_polish"), ("Meta", "gentle_reassurance"), ("Nvidia", "quiet_depth")],
    },
    "Tesla": {
        "traits": [("passion", 5), ("magnetism", 5), ("boldness", 4), ("momentum", 4)],
        "inner_tags": ["intense", "heat", "bold"],
        "love_tags": ["action", "direct", "specialness"],
        "compatibility": [("Amazon", "energy_match"), ("Netflix", "heat_afterglow"), ("Apple", "contrast_balance")],
    },
    "Meta": {
        "traits": [("empathy", 5), ("connection", 5), ("communication", 4), ("warmth", 4)],
        "inner_tags": ["empathy", "connection", "sharing"],
        "love_tags": ["conversation", "care", "connection"],
        "compatibility": [("Google", "talk_flows"), ("Microsoft", "gentle_reassurance"), ("Apple", "calm_polish")],
    },
    "Nvidia": {
        "traits": [("insight", 5), ("focus", 5), ("mystery", 4), ("composure", 3)],
        "inner_tags": ["observer", "depth", "mystery"],
        "love_tags": ["slowburn", "trust", "observer"],
        "compatibility": [("Apple", "quiet_depth"), ("Microsoft", "safe_support"), ("Tesla", "contrast_balance")],
    },
    "Netflix": {
        "traits": [("sensitivity", 5), ("atmosphere", 5), ("afterglow", 4), ("creativity", 4)],
        "inner_tags": ["emotional", "memorable", "specialness"],
        "love_tags": ["heat", "sharing", "memorable"],
        "compatibility": [("Tesla", "heat_afterglow"), ("Meta", "shared_feelings"), ("Apple", "calm_polish")],
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
question_pending: dict[str, threading.Event] = {}


class LanguagePayload(BaseModel):
    language: str = "ja"


class AnswerItem(BaseModel):
    questions: str
    answer: str
    type: str


class AnswerData(BaseModel):
    language: str = "ja"
    answers: list[AnswerItem]


class ClassifyAnswerPayload(BaseModel):
    question: str
    answer: str
    language: str = "ja"


class BatchClassifyItem(BaseModel):
    question: str
    answer: str


class BatchClassifyPayload(BaseModel):
    items: list[BatchClassifyItem]


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


def get_localized_value(mapping: dict[str, dict[str, str]], key: str, language: str) -> str:
    normalized_language = normalize_language(language)
    return mapping.get(normalized_language, mapping["ja"]).get(key, key)


def strip_ellipsis(text: str) -> str:
    return re.sub(r"(?:\.{3,}|…+)", "", text)


def normalize_short_text(value: str | None, max_length: int = 120) -> str:
    if value is None:
        return ""

    text = strip_ellipsis(str(value)).replace("\n", " ").replace("\r", " ").strip()
    text = re.sub(r"\s+", " ", text)
    return text[:max_length].strip()


def is_complete_result_text(text: str) -> bool:
    return bool(text) and text[-1] in {"。", "！", "？", ".", "!", "?"}


def build_fallback_traits(best_type: str, language: str) -> list[dict[str, int | str]]:
    profile = DIAGNOSIS_FALLBACK_PROFILES[best_type]
    return [
        {
            "label": get_localized_value(DIAGNOSIS_TRAIT_LABELS, label_key, language),
            "stars": stars,
        }
        for label_key, stars in profile["traits"]
    ]


def build_fallback_tags(best_type: str, tag_group: str, language: str) -> list[str]:
    profile = DIAGNOSIS_FALLBACK_PROFILES[best_type]
    return [
        get_localized_value(DIAGNOSIS_TAG_LABELS, tag_key, language)
        for tag_key in profile[tag_group]
    ]


def build_fallback_compatibility(best_type: str, sub_type: str | None, language: str) -> list[dict[str, str]]:
    profile = DIAGNOSIS_FALLBACK_PROFILES[best_type]
    candidates = list(profile["compatibility"])

    if sub_type is not None and sub_type != best_type:
        if any(type_name == sub_type for type_name, _ in candidates):
            candidates.sort(key=lambda item: item[0] != sub_type)
        else:
            candidates.insert(0, (sub_type, "subtype_sync"))

    compatibility = []
    seen_types = set()

    for type_name, reason_key in candidates:
        if type_name == best_type or type_name in seen_types:
            continue

        compatibility.append(
            {
                "type": type_name,
                "reason": get_localized_value(DIAGNOSIS_REASON_LABELS, reason_key, language),
            }
        )
        seen_types.add(type_name)

        if len(compatibility) == 3:
            break

    return compatibility


def build_fallback_diagnosis_payload(best_type: str, sub_type: str | None, language: str) -> dict:
    settings = LANGUAGE_SETTINGS[normalize_language(language)]
    return {
        "description": settings["fallback_comment"],
        "recommendation": settings["fallback_love"],
        "traits": build_fallback_traits(best_type, language),
        "innerTags": build_fallback_tags(best_type, "inner_tags", language),
        "loveTags": build_fallback_tags(best_type, "love_tags", language),
    }


def normalize_generated_traits(raw_traits: object, best_type: str, language: str) -> list[dict[str, int | str]]:
    fallback_traits = build_fallback_traits(best_type, language)

    if not isinstance(raw_traits, list) or len(raw_traits) != 4:
        return fallback_traits

    normalized_traits = []

    for item in raw_traits:
        if not isinstance(item, dict):
            return fallback_traits

        label = normalize_short_text(item.get("label"), max_length=24)
        stars_raw = item.get("stars")

        if isinstance(stars_raw, bool) or not isinstance(stars_raw, (int, float)):
            return fallback_traits

        stars = int(round(stars_raw))

        if not label or stars < 2 or stars > 5:
            return fallback_traits

        normalized_traits.append({"label": label, "stars": stars})

    if all(item["stars"] == 5 for item in normalized_traits):
        return fallback_traits

    return normalized_traits


def normalize_generated_tags(raw_tags: object, best_type: str, tag_group: str, language: str) -> list[str]:
    fallback_tags = build_fallback_tags(best_type, tag_group, language)

    if not isinstance(raw_tags, list) or len(raw_tags) != 3:
        return fallback_tags

    normalized_tags = []

    for tag in raw_tags:
        cleaned = normalize_short_text(str(tag).replace("#", ""), max_length=18)
        if not cleaned:
            return fallback_tags
        normalized_tags.append(cleaned)

    return normalized_tags


def normalize_generated_compatibility(
    raw_items: object,
    best_type: str,
    sub_type: str | None,
    language: str,
) -> list[dict[str, str]]:
    fallback_items = build_fallback_compatibility(best_type, sub_type, language)

    if not isinstance(raw_items, list) or len(raw_items) != 3:
        return fallback_items

    normalized_items = []
    seen_types = set()

    for item in raw_items:
        if not isinstance(item, dict):
            return fallback_items

        type_name = str(item.get("type", "")).strip()
        reason = normalize_short_text(item.get("reason"), max_length=72)

        if (
            type_name not in ALLOWED_TYPE_KEYS
            or type_name == best_type
            or type_name in seen_types
            or not reason
            or "..." in reason
            or "…" in reason
        ):
            return fallback_items

        normalized_items.append({"type": type_name, "reason": reason})
        seen_types.add(type_name)

    return normalized_items


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


def call_openrouter_chat(messages: list[dict[str, str]], timeout: int = 45, max_tokens: int | None = None) -> str:
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
) -> dict:
    normalized_language = normalize_language(language)
    settings = LANGUAGE_SETTINGS[normalized_language]
    fallback_payload = build_fallback_diagnosis_payload(best_type, sub_type, normalized_language)

    if not OPEN_ROUTER_KEY:
        return fallback_payload

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
- Read every answer carefully before writing anything
- The result must feel like it was written specifically for this person, not for their type in general
- At least one concrete behavioral pattern from the answers must be reflected in description
- Avoid phrases generic enough to apply to anyone with this type
- If two people have the same type but different answer patterns, their results should feel noticeably different
- If a subtype exists, blend it in naturally
- If score gaps are small, reflect that nuance
- Output JSON only
- No markdown
- No code block
- No preface
- No extra text outside the JSON
- Never use ... or … in any field
- Do not end sentences midway

Output rules:
- Return exactly this JSON shape:
  {{
    "description": "...",
    "recommendation": "...",
    "traits": [
      {{
        "label": "...",
        "stars": 5
      }}
    ],
    "innerTags": ["...", "...", "..."],
    "loveTags": ["...", "...", "..."],
    "compatibility": [
      {{
        "type": "Apple",
        "reason": "..."
      }}
    ]
  }}
- `description` is for the personality insight section ("AIが読んだ個性")
- `recommendation` is for the love tendency section ("恋愛モード") — like a fortune slip's love column
- `description` length: {settings["diagnosis_description_length"]} — this is a strict minimum, not a target
- `recommendation` length: {settings["diagnosis_recommendation_length"]} — this is a strict minimum, not a target
- `description` and `recommendation` must each be 2 to 3 sentences — never fewer than 2
- Write full, complete sentences — do not pad with filler, earn every character with specific insight
- Each sentence must add a new angle — never restate the previous sentence in different words
- `traits` must contain exactly 4 items
- `traits[].label` must be short and in the output language
- `traits[].stars` must be an integer from 1 to 5
- Do not make all 4 star ratings equal to 5
- Avoid using 1 unless truly necessary
- `innerTags` must contain exactly 3 short tags in the output language
- `loveTags` must contain exactly 3 short tags in the output language
- `compatibility` must contain exactly 3 items
- `compatibility[].type` must remain exactly one of:
  Apple, Google, Amazon, Microsoft, Tesla, Meta, Nvidia, Netflix
- Do not include the primary type inside compatibility
- If a subtype exists, you may place it near the top if it fits naturally
- `compatibility[].reason` must be short, natural, and in the output language
""".strip()

    user_prompt = f"""
Create all result fields for this person.

Primary type:
- {best_profile["title"]}
- Profile: {best_profile["profile"]}

{subtype_section}

Score trend:
{build_type_summary(counts, normalized_language)}

Answer history:
{format_answers_for_prompt(answers)}

description requirements:
- This is the core personality read — analyze who this person is from their specific answer patterns
- Do NOT write a generic type description — this must feel written for THIS person
- Write exactly 3 sentences, each covering a different angle:
  sentence 1: their core thinking or decision-making style based on specific answers
  sentence 2: how they come across socially or in groups, with a concrete example from the answers
  sentence 3: what quietly drives them or what others notice about them over time
- Each sentence must be substantial — at least 40 characters
- Do NOT frame this as a love or romance description

recommendation requirements:
- This is the love tendency section — like the love fortune in a traditional omikuji slip
- Write exactly 3 sentences:
  sentence 1: how feelings develop for this person and what triggers them
  sentence 2: how they behave once they like someone — their pace, signals, or style
  sentence 3: one quality that makes them quietly attractive in close relationships
- Each sentence must be substantial — at least 40 characters
- Keep it warm, specific, and clearly distinct from the personality description above

traits requirements:
- Choose 4 traits that fit this person's actual answer pattern
- Do not just restate the type profile
- Let the stars vary a little based on the answers

innerTags requirements:
- Tags should feel like short keywords for the person's inner vibe

loveTags requirements:
- Tags should feel like short keywords for how they come across in close relationships

compatibility requirements:
- Pick 3 compatible types from:
  Apple, Google, Amazon, Microsoft, Tesla, Meta, Nvidia, Netflix
- Never include {best_type}
- Keep each reason short and readable
""".strip()

    try:
        raw_text = call_openrouter_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            timeout=30,
            max_tokens=800,
        )
        parsed = json.loads(strip_json_wrapper(raw_text))
        description = normalize_short_text(parsed.get("description"), max_length=520)
        recommendation = normalize_short_text(parsed.get("recommendation"), max_length=520)

        if not is_complete_result_text(description):
            description = fallback_payload["description"]

        if not is_complete_result_text(recommendation):
            recommendation = fallback_payload["recommendation"]

        return {
            "description": description or fallback_payload["description"],
            "recommendation": recommendation or fallback_payload["recommendation"],
            "traits": normalize_generated_traits(parsed.get("traits"), best_type, normalized_language),
            "innerTags": normalize_generated_tags(parsed.get("innerTags"), best_type, "inner_tags", normalized_language),
            "loveTags": normalize_generated_tags(parsed.get("loveTags"), best_type, "love_tags", normalized_language),
        }
    except Exception as error:
        print("AI diagnosis text error:", error)
        return fallback_payload


def generate_questions(language: str) -> tuple[dict, list[list[str]]]:
    normalized_language = normalize_language(language)
    max_attempts = 3
    last_error: Exception = RuntimeError("Unknown error")

    for attempt in range(max_attempts):
        try:
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
        except (ValueError, json.JSONDecodeError) as error:
            last_error = error
            print(f"Question generation attempt {attempt + 1}/{max_attempts} failed: {error}")

    raise last_error


def get_or_create_questions(language: str) -> list[dict]:
    normalized_language = normalize_language(language)

    if normalized_language in question_cache:
        return question_cache[normalized_language]

    # 同言語の生成が進行中なら完了を待つ（重複API呼び出しを防ぐ）
    if normalized_language in question_pending:
        question_pending[normalized_language].wait(timeout=60)
        if normalized_language in question_cache:
            return question_cache[normalized_language]
        raise RuntimeError("Question generation timed out or failed.")

    event = threading.Event()
    question_pending[normalized_language] = event

    try:
        generated_payload, _ = generate_questions(normalized_language)
        question_cache[normalized_language] = generated_payload["questions"]
        return question_cache[normalized_language]
    finally:
        question_pending.pop(normalized_language, None)
        event.set()


@app.get("/")
def read_index():
    return FileResponse(FRONTEND_DIR / "index.html")


CLASSIFY_SYSTEM_PROMPT = """You classify free-form answers to personality quiz questions into one of 8 types.
Output JSON only. No markdown. No extra text.
Each type must be exactly one of: Apple, Google, Amazon, Microsoft, Tesla, Meta, Nvidia, Netflix

Type behavioral definitions (use these to classify, regardless of input language):
- Apple: values aesthetics, refinement, quiet confidence, and emotional depth; prefers quality over quantity
- Google: analytical, curious, information-driven; approaches problems systematically and logically
- Amazon: results-oriented, practical, efficient; focuses on execution, speed, and concrete outcomes
- Microsoft: structured, collaborative, reliable; values process, teamwork, and stable systems
- Tesla: visionary, independent, unconventional; driven by ideals and willing to go against the grain
- Meta: social, expressive, connection-focused; thrives on relationships and sharing experiences
- Nvidia: ambitious, high-performance, intense; pushes limits and is motivated by excellence and mastery
- Netflix: observant, selective, introspective; prefers depth over breadth and curates experiences carefully"""


@app.post("/classify-answer")
def classify_answer(data: ClassifyAnswerPayload):
    if not OPEN_ROUTER_KEY:
        return {"type": random.choice(sorted(ALLOWED_TYPE_KEYS)), "message": "fallback"}

    system_prompt = CLASSIFY_SYSTEM_PROMPT + '\nOutput format: {"type": "TypeName"}'

    user_prompt = f"""Question: {data.question}
User's free-form answer: {data.answer}

Which of the 8 personality types best fits this answer? Return JSON only."""

    try:
        raw = call_openrouter_chat(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            timeout=10,
            max_tokens=20,
        )
        parsed = json.loads(strip_json_wrapper(raw))
        type_name = str(parsed.get("type", "")).strip()
        if type_name not in ALLOWED_TYPE_KEYS:
            raise ValueError(f"Invalid type: {type_name}")
        return {"type": type_name, "message": "ok"}
    except Exception as error:
        print("classify_answer error:", error)
        return {"type": random.choice(sorted(ALLOWED_TYPE_KEYS)), "message": "fallback"}


@app.post("/batch-classify")
def batch_classify(data: BatchClassifyPayload):
    if not data.items:
        return {"results": []}
    if not OPEN_ROUTER_KEY:
        return {
            "results": [
                {"type": random.choice(sorted(ALLOWED_TYPE_KEYS)), "message": "fallback"}
                for _ in data.items
            ]
        }

    items_text = "\n\n".join(
        f"[{i + 1}]\nQuestion: {item.question}\nAnswer: {item.answer}"
        for i, item in enumerate(data.items)
    )
    user_prompt = f"""Classify each answer below into one of the 8 personality types.
Return a JSON array with one object per answer, in the same order.
Output format: [{{"type": "TypeName"}}, ...]

{items_text}"""

    timeout = min(max(len(data.items) * 4, 15), 30)
    max_tokens = len(data.items) * 25 + 20

    try:
        raw = call_openrouter_chat(
            [
                {"role": "system", "content": CLASSIFY_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            timeout=timeout,
            max_tokens=max_tokens,
        )
        parsed = json.loads(strip_json_wrapper(raw))
        if not isinstance(parsed, list):
            raise ValueError("Expected JSON array")
        results = []
        for i, _ in enumerate(data.items):
            entry = parsed[i] if i < len(parsed) else {}
            type_name = str(entry.get("type", "")).strip()
            if type_name not in ALLOWED_TYPE_KEYS:
                type_name = random.choice(sorted(ALLOWED_TYPE_KEYS))
            results.append({"type": type_name, "message": "ok"})
        return {"results": results}
    except Exception as error:
        print("batch_classify error:", error)
        return {
            "results": [
                {"type": random.choice(sorted(ALLOWED_TYPE_KEYS)), "message": "fallback"}
                for _ in data.items
            ]
        }


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
        if answer.type in counts:
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
        "traits": diagnosis_text["traits"],
        "innerTags": diagnosis_text["innerTags"],
        "loveTags": diagnosis_text["loveTags"],
        "bestType": best_type,
        "subtype": sub_type,
        "language": normalized_language,
        "message": "ok",
    }
