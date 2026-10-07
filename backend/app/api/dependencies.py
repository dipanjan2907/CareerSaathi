from app.db.session import get_db_session
from app.infrastructure.llm.base import BaseLLMProvider
from app.infrastructure.llm.groq_provider import GroqLLMProvider


def get_llm_provider() -> BaseLLMProvider:
    return GroqLLMProvider()


__all__ = ["get_db_session", "get_llm_provider"]