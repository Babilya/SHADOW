from __future__ import annotations
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

from quantumx_api.db.session import Base

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use SQLAlchemy metadata from our models
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = os.getenv("DATABASE_SYNC_URL", "postgresql+psycopg2://quantumx:quantumx@postgres:5432/quantumx")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"})

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    cfg = config.get_section(config.config_ini_section)
    url = os.getenv("DATABASE_SYNC_URL", cfg.get("sqlalchemy.url"))
    connectable = engine_from_config(
        {**cfg, "sqlalchemy.url": url},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
