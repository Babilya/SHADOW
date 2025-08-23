from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import User, Wallet

router = APIRouter()

@router.get("/{telegram_id}")
async def get_wallet(telegram_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(telegram_id=telegram_id)
        db.add(user)
        await db.flush()
        db.add(Wallet(user_id=user.id, st_balance=0))
        await db.commit()
    await db.refresh(user)
    return {"telegram_id": telegram_id, "st_balance": user.wallet.st_balance if user.wallet else 0}
