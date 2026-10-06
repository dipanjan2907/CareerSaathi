# app/core/config.py
from pathlib import Path
from typing import List, Union
from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerSaathi"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = Field(min_length=32)

    # CORS settings for Next.js frontend
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database Configuration - loaded from environment / .env
    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = Field(min_length=1)
    POSTGRES_DB: str

    # Groq LLM Infrastructure - loaded from environment / .env
    GROQ_API_KEY: str
    GROQ_MODEL: str

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE_PATH), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
