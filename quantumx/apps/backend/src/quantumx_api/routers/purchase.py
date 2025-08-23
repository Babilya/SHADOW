from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import User, Wallet, Purchase

router = APIRouter()


SHOP = {
    "vip_basic": 500,
    "ai_pack": 300,
    "mystery_box": 200,
}


class PurchaseRequest(BaseModel):
    item_id: str


@router.post("/{telegram_id}")
async def buy_item(telegram_id: int, body: PurchaseRequest, db: AsyncSession = Depends(get_db)):
    if body.item_id not in SHOP:
        raise HTTPException(404, "item not found")
    price = SHOP[body.item_id]
    res = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = res.scalar_one_or_none()
    if user is None or user.wallet is None or user.wallet.st_balance < price:
        raise HTTPException(400, "insufficient funds")
    user.wallet.st_balance -= price
    db.add(Purchase(user_id=user.id, item_id=body.item_id, price_st=price))
    await db.commit()
    return {"ok": True, "item_id": body.item_id}