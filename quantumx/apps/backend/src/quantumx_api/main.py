from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
import redis.asyncio as redis
import os

from quantumx_api.routers import health, wallet, osint, shop, vip, casino
from quantumx_api.routers import bonus
from quantumx_api.db.session import create_async_engine_and_session

app = FastAPI(title="QuantumX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup() -> None:
    try:
        redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
        pool = redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
        await FastAPILimiter.init(pool)
    except Exception:
        # Limiter is optional in dev/test
        pass
    await create_async_engine_and_session()

@app.get("/")
async def root():
    return {"name": "QuantumX", "status": "ok"}

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(wallet.router, prefix="/wallet", tags=["wallet"])
app.include_router(osint.router, prefix="/osint", tags=["osint"])
app.include_router(shop.router, prefix="/shop", tags=["shop"])
app.include_router(vip.router, prefix="/vip", tags=["vip"])
app.include_router(casino.router, prefix="/casino", tags=["casino"])
app.include_router(bonus.router, prefix="/bonus", tags=["bonus"])
