# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH=/app/src
WORKDIR /app

FROM base AS builder
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

FROM base AS runtime
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*
COPY ./src ./src
COPY alembic.ini ./alembic.ini
COPY alembic ./alembic
EXPOSE 8000
CMD ["uvicorn", "quantumx_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
