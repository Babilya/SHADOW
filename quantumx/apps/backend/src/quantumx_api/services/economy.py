from __future__ import annotations
from dataclasses import dataclass
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from quantumx_api.domain.user.models import User, Wallet
from quantumx_api.domain.shop.models import Purchase


@dataclass
class PurchaseResult:
    success: bool
    reason: Optional[str]
    new_balance: int
    purchase_id: Optional[int]


async def process_purchase(
    db: AsyncSession,
    telegram_id: int,
    sku: str,
    name: str,
    price_st: int,
    quantity: int = 1,
) -> PurchaseResult:
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(telegram_id=telegram_id)
        db.add(user)
        await db.flush()
        db.add(Wallet(user_id=user.id, st_balance=0))
        await db.flush()
    await db.refresh(user)

    cost = price_st * max(1, quantity)
    if not user.wallet or user.wallet.st_balance < cost:
        await db.rollback()
        return PurchaseResult(False, "insufficient_funds", user.wallet.st_balance if user.wallet else 0, None)

    user.wallet.st_balance -= cost
    purchase = Purchase(user_id=user.id, sku=sku, name=name, price_st=price_st, quantity=quantity)
    db.add(purchase)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        return PurchaseResult(False, "db_error", user.wallet.st_balance if user.wallet else 0, None)

    await db.refresh(user)
    await db.refresh(purchase)
    return PurchaseResult(True, None, user.wallet.st_balance, purchase.id)