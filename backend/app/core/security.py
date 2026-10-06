import random
import time
import base64
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Tuple
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=120))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --- Production SVG CAPTCHA Engine ---
def generate_math_captcha() -> Tuple[str, str, str]:
    """
    Generates a math CAPTCHA, an SVG image string, and a signed token.
    No external API needed.
    """
    num1 = random.randint(1, 12)
    num2 = random.randint(1, 12)
    operation = random.choice(["+", "-"])

    if operation == "-" and num1 < num2:
        num1, num2 = num2, num1

    answer = str(num1 + num2 if operation == "+" else num1 - num2)
    text = f"{num1} {operation} {num2} = ?"

    # Render a stylized SVG text with noise lines
    svg = f"""<svg width="150" height="45" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <line x1="0" y1="{random.randint(5,40)}" x2="150" y2="{random.randint(5,40)}" stroke="#4b5563" stroke-width="2"/>
        <line x1="0" y1="{random.randint(5,40)}" x2="150" y2="{random.randint(5,40)}" stroke="#374151" stroke-width="2"/>
        <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#38bdf8">{text}</text>
    </svg>"""

    # Sign the token with timestamp to expire in 5 mins
    timestamp = str(int(time.time()))
    signature = hmac.new(
        SECRET_KEY.encode(), f"{answer}:{timestamp}".encode(), hashlib.sha256
    ).hexdigest()
    captcha_token = f"{timestamp}:{signature}"

    return captcha_token, answer, svg


def verify_captcha(user_answer: str, captcha_token: str) -> bool:
    try:
        timestamp_str, signature = captcha_token.split(":", 1)
        timestamp = int(timestamp_str)

        # Check expiry (5 minutes)
        if int(time.time()) - timestamp > 300:
            return False

        expected_sig = hmac.new(
            SECRET_KEY.encode(),
            f"{user_answer.strip()}:{timestamp_str}".encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(signature, expected_sig)
    except Exception:
        return False
