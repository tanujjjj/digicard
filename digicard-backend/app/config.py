import os
import json

DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql+asyncpg://postgres:password@localhost/digi_card_db"

SECRET = os.getenv("SECRET") or "super-secret-jwt-key"
INVITE_CODE = os.getenv("INVITE_CODE") or "abc"
QR_URL = os.getenv("QR_URL") or "http://localhost:5173/cards/public"

ORIGINS = os.getenv("ORIGINS").split(",") if os.getenv("ORIGINS") else "http://localhost:5173"