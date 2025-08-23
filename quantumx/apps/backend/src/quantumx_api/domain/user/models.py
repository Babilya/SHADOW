from __future__ import annotations
from datetime import datetime, date
from typing import Optional

from sqlalchemy import BigInteger, String, Integer, ForeignKey, Date, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from quantumx_api.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)
    username: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    language: Mapped[str] = mapped_column(String(8), default="ua")

    wallet: Mapped["Wallet"] = relationship(back_populates="user", uselist=False)


class Wallet(Base):
    __tablename__ = "wallets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    st_balance: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped[User] = relationship(back_populates="wallet")


class BonusClaim(Base):
    __tablename__ = "bonus_claims"
    __table_args__ = (UniqueConstraint("user_id", "claim_date", name="uq_bonus_day"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    claim_date: Mapped[date] = mapped_column(Date)
