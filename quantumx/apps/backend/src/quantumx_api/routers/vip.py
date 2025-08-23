from fastapi import APIRouter

router = APIRouter()

@router.get("/plans")
async def plans():
    return {
        "plans": [
            {"id": "vip_basic", "name": "VIP Basic", "features": ["Priority OSINT", "2x ST Bonus"], "price_st": 500},
            {"id": "vip_pro", "name": "VIP Pro", "features": ["Advanced AI", "5x ST Bonus"], "price_st": 1200},
        ]
    }
