from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: datetime
    visibility: str = "private"
    color: str = "#3b82f6"


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    visibility: Optional[str] = None
    color: Optional[str] = None


class EventResponse(BaseModel):
    id: int
    owner_id: int
    title: str
    description: Optional[str]
    start_datetime: datetime
    end_datetime: datetime
    visibility: str
    color: str

    class Config:
        from_attributes = True