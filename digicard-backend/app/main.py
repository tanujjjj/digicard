# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from app.auth.setup import fastapi_users, auth_backend, current_active_user
from app.models.user import User
from app.schemas.user import UserRead, UserCreate
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

from app.config import INVITE_CODE, ORIGINS
app = FastAPI()


print(ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"]
)
async def validate_invite(invite: str):
    print("Validating invite")
    invitation = await validate_invite_code(invite)
    if not invitation:
        raise HTTPException(status_code=403, detail="Invalid Invite Code")

async def validate_invite_code(code):
    invite = INVITE_CODE
    if code != invite:
        print("Invites code invalid")
    elif invite == code:
        print("this code is valid")
        return True
    return False

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
    dependencies=[Depends(validate_invite)]
)




app.include_router(
    fastapi_users.get_users_router(UserRead, UserCreate),
    prefix="/users",
    tags=["users"]
)

@app.get("/auth/me", tags=["auth"])
async def read_current_user(user=Depends(current_active_user)):
    return user

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

from app.routers import cards  # Add this import

app.include_router(cards.router)

from app.routers import qrcode  # Add import

app.include_router(qrcode.router)

from app.routers import contacts  # Add this import

app.include_router(contacts.router)
