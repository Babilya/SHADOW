from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import redis.asyncio as redis

from quantumx_api.routers import health, wallet, osint, shop, vip, casino
from quantumx_api.routers import bonus
from quantumx_api.db.session import create_async_engine_and_session
from quantumx_api.settings import settings

app = FastAPI(title=settings.APP_TITLE)

app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.CORS_ALLOW_ORIGINS,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup() -> None:
	if settings.RATE_LIMIT_ENABLED and settings.REDIS_URL:
		pool = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
		await FastAPILimiter.init(pool)
	await create_async_engine_and_session(settings.DATABASE_URL)

if settings.RATE_LIMIT_ENABLED:
	@app.get("/", dependencies=[RateLimiter(times=5, seconds=1)])
	async def root():
		return {"name": "QuantumX", "status": "ok"}
else:
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
