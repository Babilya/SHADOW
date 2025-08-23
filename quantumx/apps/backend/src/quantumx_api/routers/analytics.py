from __future__ import annotations
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from quantumx_api.db.session import get_db
from quantumx_api.domain.user.models import AnalyticsEvent

router = APIRouter()


class AnalyticsEventIn(BaseModel):
	user_id: Optional[int] = None
	event_name: str
	properties: Optional[Dict[str, Any]] = None


@router.post("/")
async def ingest(event: AnalyticsEventIn, db: AsyncSession = Depends(get_db)):
	db.add(AnalyticsEvent(user_id=event.user_id, event_name=event.event_name, properties=event.properties))
	await db.commit()
	return {"ok": True}