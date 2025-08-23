"""initial tables

Revision ID: 0001_initial
Revises: 
Create Date: 2025-08-23 00:00:00

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
	# users
	op.create_table(
		"users",
		sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column("telegram_id", sa.BigInteger(), nullable=False, unique=True),
		sa.Column("username", sa.String(length=64), nullable=True),
		sa.Column("language", sa.String(length=8), nullable=False, server_default="ua"),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
	)
	op.create_index("ix_users_telegram_id", "users", ["telegram_id"], unique=False)

	# wallets
	op.create_table(
		"wallets",
		sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
		sa.Column("st_balance", sa.Integer(), nullable=False, server_default="0"),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
	)

	# bonus_claims
	op.create_table(
		"bonus_claims",
		sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
		sa.Column("claim_date", sa.Date(), nullable=False),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
		sa.UniqueConstraint("user_id", "claim_date", name="uq_bonus_day"),
	)

	# subscriptions
	op.create_table(
		"subscriptions",
		sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
		sa.Column("plan_id", sa.String(length=64), nullable=False),
		sa.Column("start_at", sa.DateTime(timezone=True), nullable=False),
		sa.Column("end_at", sa.DateTime(timezone=True), nullable=False),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
	)

	# purchases
	op.create_table(
		"purchases",
		sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
		sa.Column("item_id", sa.String(length=64), nullable=False),
		sa.Column("price_st", sa.Integer(), nullable=False),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
	)

	# analytics_events
	op.create_table(
		"analytics_events",
		sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
		sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
		sa.Column("event_name", sa.String(length=64), nullable=False),
		sa.Column("properties", sa.JSON(), nullable=True),
		sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
		sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
	)


def downgrade() -> None:
	op.drop_table("analytics_events")
	op.drop_table("purchases")
	op.drop_table("subscriptions")
	op.drop_table("bonus_claims")
	op.drop_table("wallets")
	op.drop_index("ix_users_telegram_id", table_name="users")
	op.drop_table("users")