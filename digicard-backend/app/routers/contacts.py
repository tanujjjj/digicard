# app/routers/contacts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import SessionLocal
from app.models.contact import Contact
from app.models.card import Card
from app.schemas.contact import ContactCreate, ContactRead
from app.auth.setup import current_active_user
from app.models.user import User
from uuid import UUID

router = APIRouter(prefix="/contacts", tags=["contacts"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/", response_model=ContactRead)
async def save_contact(contact: ContactCreate, db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    result = await db.execute(select(Card).where(Card.id == contact.card_id))
    card = result.scalar()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    new_contact = Contact(owner_id=user.id, card_id=card.id, notes=contact.notes)
    db.add(new_contact)
    await db.commit()
    await db.refresh(new_contact)
    return new_contact

@router.get("/", response_model=list[ContactRead])
async def get_my_contacts(db: AsyncSession = Depends(get_db), user: User = Depends(current_active_user)):
    result = await db.execute(select(Contact).where(Contact.owner_id == user.id).order_by(Contact.created_at.desc()))
    return result.scalars().all()
