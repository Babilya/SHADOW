from fastapi import APIRouter

router = APIRouter()

@router.get("/items")
async def list_items():
    return {
        "items": [
            {"id": "vip_basic", "name": "VIP Basic", "price_st": 500},
            {"id": "ai_pack", "name": "AI Pack", "price_st": 300},
            {"id": "mystery_box", "name": "Mystery Box", "price_st": 200},
        ]
    }
