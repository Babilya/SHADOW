from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import User, Wallet, BonusClaim

router = APIRouter()

BONUS_AMOUNT = 50

@router.post("/claim/{telegram_id}")
async def claim_daily_bonus(telegram_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(telegram_id=telegram_id)
        db.add(user)
        await db.flush()
        db.add(Wallet(user_id=user.id, st_balance=0))
        await db.flush()
    today = date.today()
    result = await db.execute(
        select(BonusClaim).where(BonusClaim.user_id == user.id, BonusClaim.claim_date == today)
    )
    already = result.scalar_one_or_none()
    if already:
        await db.commit()
        return {"claimed": False, "reason": "already_claimed", "st_balance": user.wallet.st_balance}
    db.add(BonusClaim(user_id=user.id, claim_date=today))
    user.wallet.st_balance += BONUS_AMOUNT
    await db.commit()
    await db.refresh(user)
    return {"claimed": True, "bonus": BONUS_AMOUNT, "st_balance": user.wallet.st_balance}
