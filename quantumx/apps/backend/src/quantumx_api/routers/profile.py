from __future__ import annotations
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import User

router = APIRouter()


class ProfileUpdate(BaseModel):
    username: str | None = Field(default=None, max_length=64)
    language: str | None = Field(default=None, max_length=8)


@router.get("/{telegram_id}")
async def get_profile(telegram_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(telegram_id=telegram_id)
        db.add(user)
        await db.flush()
        await db.commit()
        await db.refresh(user)
    return {"telegram_id": user.telegram_id, "username": user.username, "language": user.language}


@router.post("/{telegram_id}")
async def update_profile(telegram_id: int, payload: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(telegram_id=telegram_id)
        db.add(user)
        await db.flush()
    if payload.username is not None:
        user.username = payload.username
    if payload.language is not None:
        user.language = payload.language
    await db.commit()
    await db.refresh(user)
    return {"telegram_id": user.telegram_id, "username": user.username, "language": user.language}