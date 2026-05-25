from fastapi import FastAPI
from .database import engine, Base
from .models import User
from .routes import users
from .routes import users, events

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.include_router(events.router)

@app.get("/")
def root():
    return {"message": "Backend running"}