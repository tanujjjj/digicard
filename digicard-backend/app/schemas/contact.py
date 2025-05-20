# app/schemas/contact.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.schemas.card import CardRead

class ContactCreate(BaseModel):
    card_id: UUID
    notes: Optional[str] = None

class ContactRead(BaseModel):
    id: UUID
    card: CardRead
    notes: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
