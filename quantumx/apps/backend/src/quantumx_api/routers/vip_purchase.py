from __future__ import annotations
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import User, Wallet, Subscription

router = APIRouter()


class VipPurchaseRequest(BaseModel):
    plan_id: str
    months: int = 1


PLANS = {
    "vip_basic": 500,
    "vip_pro": 1200,
}


@router.post("/buy/{telegram_id}")
async def buy_vip(telegram_id: int, body: VipPurchaseRequest, db: AsyncSession = Depends(get_db)):
    if body.plan_id not in PLANS:
        raise HTTPException(404, "plan not found")
    price = PLANS[body.plan_id] * max(1, body.months)
    res = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = res.scalar_one_or_none()
    if user is None or user.wallet is None or user.wallet.st_balance < price:
        raise HTTPException(400, "insufficient funds")
    # deduct and create subscription
    user.wallet.st_balance -= price
    start = datetime.utcnow()
    end = start + timedelta(days=30 * max(1, body.months))
    db.add(Subscription(user_id=user.id, plan_id=body.plan_id, start_at=start, end_at=end))
    await db.commit()
    return {"ok": True, "plan_id": body.plan_id, "end_at": end.isoformat()}