from fastapi import FastAPI
from .database import engine, Base
from .models import User
from .routes import users

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "Backend running"}