from fastapi import APIRouter

router = APIRouter()

@router.get("/slots/spin")
async def slots_spin():
    return {"result": ["💎", "7", "💎"], "win": True, "payout_st": 50}

@router.get("/roulette/spin")
async def roulette_spin():
    return {"number": 17, "color": "black", "win": False}

@router.get("/crash/next")
async def crash_next():
    return {"multiplier": 1.72}
