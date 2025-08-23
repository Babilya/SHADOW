from __future__ import annotations
import os
from datetime import datetime
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy import DateTime

_engine = None
_async_session: async_sessionmaker[AsyncSession] | None = None


class Base(DeclarativeBase):
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


async def create_async_engine_and_session() -> None:
    global _engine, _async_session
    if _engine is not None:
        return
    database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://quantumx:quantumx@postgres:5432/quantumx")
    _engine = create_async_engine(database_url, echo=False, pool_pre_ping=True)
    _async_session = async_sessionmaker(bind=_engine, expire_on_commit=False, autoflush=False, autocommit=False)


def get_session_maker() -> async_sessionmaker[AsyncSession]:
    if _async_session is None:
        raise RuntimeError("Session maker is not initialized. Call create_async_engine_and_session() on startup")
    return _async_session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    session_maker = get_session_maker()
    async with session_maker() as session:
        yield session
