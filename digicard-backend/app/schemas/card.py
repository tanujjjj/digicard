# app/schemas/card.py
from pydantic import BaseModel, HttpUrl, constr
from typing import Optional
from uuid import UUID
from datetime import datetime

class CardCreate(BaseModel):
    name: str
    title: Optional[str]
    company: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    website: Optional[HttpUrl] = None
    linkedin: Optional[HttpUrl] = None
    bio: Optional[str]
    profile_image_url: Optional[HttpUrl]
    slug: constr(strip_whitespace=True, min_length=3)

class CardUpdate(CardCreate):
    pass

class CardRead(CardCreate):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
