# app/models/contact.py
from sqlalchemy import Column, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.db.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    card_id = Column(UUID(as_uuid=True), ForeignKey("cards.id"))
    notes = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    card = relationship("Card", backref="saved_contacts")
