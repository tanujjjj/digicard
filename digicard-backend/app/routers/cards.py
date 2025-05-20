# app/routers/cards.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import SessionLocal
from app.models.card import Card
from app.schemas.card import CardCreate, CardUpdate, CardRead
from app.auth.setup import current_active_user
from app.models.user import User
from uuid import UUID

router = APIRouter(prefix="/cards", tags=["cards"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("", response_model=CardRead)
async def create_card(card: CardCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    existing = await db.execute(select(Card).where(Card.slug == card.slug))
    if existing.scalar():
        raise HTTPException(status_code=400, detail="Slug already taken")

    card_data = card.dict()
# Convert all HttpUrl fields to str
    for field in ["website", "linkedin", "profile_image_url"]:
        if card_data.get(field):
            card_data[field] = str(card_data[field])

    new_card = Card(**card_data, owner_id=user.id)
    db.add(new_card)
    await db.commit()
    await db.refresh(new_card)
    return new_card

@router.get("", response_model=list[CardRead])
async def get_my_cards(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    result = await db.execute(select(Card).where(Card.owner_id == user.id))
    return result.scalars().all()

@router.get("/public/{slug}", response_model=CardRead)
async def get_card_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Card).where(Card.slug == slug))
    card = result.scalar()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@router.put("/{card_id}", response_model=CardRead)
async def update_card(
    card_id: UUID,
    card: CardUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_active_user)
):
    result = await db.execute(select(Card).where(Card.id == card_id, Card.owner_id == user.id))
    card_obj = result.scalar()

    if not card_obj:
        raise HTTPException(status_code=404, detail="Card not found")

    card_data = card.dict()

    # Convert any HttpUrl values to plain strings
    for field in ["website", "linkedin", "profile_image_url"]:
        if card_data.get(field):
            card_data[field] = str(card_data[field])

    for field, value in card_data.items():
        setattr(card_obj, field, value)

    await db.commit()
    await db.refresh(card_obj)
    return card_obj
    for field, value in card.dict().items():
        setattr(card_obj, field, value)

    await db.commit()
    await db.refresh(card_obj)
    return card_obj

@router.delete("/{card_id}", status_code=204)
async def delete_card(card_id: UUID, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    result = await db.execute(select(Card).where(Card.id == card_id, Card.owner_id == user.id))
    card_obj = result.scalar()
    if not card_obj:
        raise HTTPException(status_code=404, detail="Card not found")

    await db.delete(card_obj)
    await db.commit()
