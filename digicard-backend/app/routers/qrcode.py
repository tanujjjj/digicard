# app/routers/qrcode.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import SessionLocal
from app.models.card import Card
import qrcode
from io import BytesIO
from app.config import QR_URL
router = APIRouter(prefix="/cards", tags=["qr"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/{slug}/qrcode", response_class=StreamingResponse)
async def generate_qrcode(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Card).where(Card.slug == slug))
    card = result.scalar()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Assume your frontend or public viewer is at /cards/public/{slug}
    url = f"{QR_URL}/{card.slug}"

    img = qrcode.make(url)
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
