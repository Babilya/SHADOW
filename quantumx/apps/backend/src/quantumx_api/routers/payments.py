from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import User, Wallet

router = APIRouter()


class TopUpRequest(BaseModel):
    amount_st: int = Field(gt=0)


@router.post("/topup/{telegram_id}")
async def topup(telegram_id: int, body: TopUpRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(telegram_id=telegram_id)
        db.add(user)
        await db.flush()
        wallet = Wallet(user_id=user.id, st_balance=0)
        db.add(wallet)
        await db.flush()
    else:
        wallet = user.wallet
        if wallet is None:
            wallet = Wallet(user_id=user.id, st_balance=0)
            db.add(wallet)
            await db.flush()
    wallet.st_balance += body.amount_st
    await db.commit()
    await db.refresh(user)
    return {"telegram_id": telegram_id, "st_balance": wallet.st_balance}


class TransferRequest(BaseModel):
    to_telegram_id: int
    amount_st: int = Field(gt=0)


@router.post("/transfer/{from_telegram_id}")
async def transfer(from_telegram_id: int, body: TransferRequest, db: AsyncSession = Depends(get_db)):
    if from_telegram_id == body.to_telegram_id:
        raise HTTPException(400, "cannot transfer to self")
    # sender
    res = await db.execute(select(User).where(User.telegram_id == from_telegram_id))
    sender = res.scalar_one_or_none()
    if sender is None or sender.wallet is None or sender.wallet.st_balance < body.amount_st:
        raise HTTPException(400, "insufficient funds")
    # receiver
    res = await db.execute(select(User).where(User.telegram_id == body.to_telegram_id))
    receiver = res.scalar_one_or_none()
    if receiver is None:
        receiver = User(telegram_id=body.to_telegram_id)
        db.add(receiver)
        await db.flush()
        db.add(Wallet(user_id=receiver.id, st_balance=0))
        receiver = receiver
    # apply
    sender.wallet.st_balance -= body.amount_st
    if receiver.wallet is None:
        receiver.wallet = Wallet(user_id=receiver.id, st_balance=0)
    receiver.wallet.st_balance += body.amount_st
    await db.commit()
    return {"ok": True}