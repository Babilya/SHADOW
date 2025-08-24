from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from quantumx_api.db.session import get_db
from quantumx_api.services.economy import process_purchase

router = APIRouter()


CATALOG = [
    # VIP
    {"id": "vip_basic", "name": "VIP Basic", "price_st": 500, "category": "vip"},
    {"id": "vip_pro", "name": "VIP Pro", "price_st": 1200, "category": "vip"},
    {"id": "vip_elite", "name": "VIP Elite", "price_st": 3000, "category": "vip"},
    # AI
    {"id": "ai_pack_s", "name": "AI Pack S (50 msgs)", "price_st": 250, "category": "ai"},
    {"id": "ai_pack_m", "name": "AI Pack M (200 msgs)", "price_st": 800, "category": "ai"},
    {"id": "ai_pack_l", "name": "AI Pack L (600 msgs)", "price_st": 2000, "category": "ai"},
    {"id": "ai_private_model", "name": "Private Model Access (7d)", "price_st": 1500, "category": "ai"},
    # OSINT
    {"id": "osint_phone_deep", "name": "OSINT Deep Phone Report", "price_st": 350, "category": "osint"},
    {"id": "osint_email_breach", "name": "OSINT Email Breach Report", "price_st": 280, "category": "osint"},
    {"id": "osint_social_monitor", "name": "Username Monitor (30d)", "price_st": 500, "category": "osint"},
    # Security
    {"id": "sec_verification", "name": "Security Verification Badge", "price_st": 400, "category": "security"},
    {"id": "sec_darknet_watch", "name": "Darknet Watch (30d)", "price_st": 900, "category": "security"},
    {"id": "sec_phishing_kit", "name": "Anti‑Phishing Kit", "price_st": 650, "category": "security"},
    {"id": "sec_incident_retainer", "name": "Incident Response (On‑call)", "price_st": 2500, "category": "security"},
    # Games / Boxes
    {"id": "box_bronze", "name": "Mystery Box Bronze", "price_st": 150, "category": "box"},
    {"id": "box_silver", "name": "Mystery Box Silver", "price_st": 400, "category": "box"},
    {"id": "box_gold", "name": "Mystery Box Gold", "price_st": 1000, "category": "box"},
    # Business / API
    {"id": "api_basic", "name": "API Access Basic (1000 calls)", "price_st": 700, "category": "api"},
    {"id": "api_pro", "name": "API Access Pro (10k calls)", "price_st": 5000, "category": "api"},
    {"id": "team_seat", "name": "Team Seat (1 user, 30d)", "price_st": 600, "category": "business"},
]


class PurchaseRequest(BaseModel):
    telegram_id: int
    sku: str
    quantity: int = 1


@router.get("/items")
async def list_items():
    return {"items": CATALOG}


@router.post("/purchase")
async def purchase(req: PurchaseRequest, db: AsyncSession = Depends(get_db)):
    item = next((i for i in CATALOG if i["id"] == req.sku), None)
    if not item:
        raise HTTPException(status_code=404, detail="item_not_found")
    result = await process_purchase(
        db=db,
        telegram_id=req.telegram_id,
        sku=item["id"],
        name=item["name"],
        price_st=item["price_st"],
        quantity=req.quantity,
    )
    if not result.success:
        raise HTTPException(status_code=400, detail=result.reason or "purchase_failed")
    return {"ok": True, "purchase_id": result.purchase_id, "new_balance": result.new_balance}
