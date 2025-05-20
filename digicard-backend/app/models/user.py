from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from app.db.database import Base
import sqlalchemy as sa
import uuid

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"
    id = sa.Column(sa.Uuid, primary_key=True, default=uuid.uuid4)