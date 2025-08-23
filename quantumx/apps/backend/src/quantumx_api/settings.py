from __future__ import annotations
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_TITLE: str = "QuantumX API"
    DATABASE_URL: str = "postgresql+asyncpg://quantumx:quantumx@postgres:5432/quantumx"
    DATABASE_SYNC_URL: str = "postgresql+psycopg2://quantumx:quantumx@postgres:5432/quantumx"
    REDIS_URL: str | None = "redis://redis:6379/0"
    RATE_LIMIT_ENABLED: bool = True
    CORS_ALLOW_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(env_file=None, env_prefix="", case_sensitive=False)


settings = Settings()