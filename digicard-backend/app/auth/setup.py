# app/auth/setup.py
from fastapi import Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import BearerTransport, AuthenticationBackend, JWTStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from app.models.user import User
from app.db.database import SessionLocal
from fastapi_users.manager import BaseUserManager, UUIDIDMixin
from app.config import SECRET
import uuid

# ✅ JWT Bearer token transport (no cookies)
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    user_db_model = User
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request=None):
        print(f"User {user.id} has registered.")

# 🔁 DB session
async def get_user_db():
    async with SessionLocal() as session:
        yield SQLAlchemyUserDatabase(session, User)

# 🔁 User manager
async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

# ✅ Main authentication backend (JWT bearer)
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=lambda: JWTStrategy(secret=SECRET, lifetime_seconds=3600),
)

# ✅ FastAPI Users instance
fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)

# ✅ Dependency to get logged-in user
current_active_user = fastapi_users.current_user(active=True)
