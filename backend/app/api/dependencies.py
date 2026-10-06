from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db_session
from app.infrastructure.llm.groq_provider import GroqLLMProvider


def get_llm_provider() -> GroqLLMProvider:
    return GroqLLMProvider()
