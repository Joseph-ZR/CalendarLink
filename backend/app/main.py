from fastapi import FastAPI
from .database import engine, Base
from .models import User
from .routes import users, events, links
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://calendar-link-ny3n-p226i4owt-joseph-zr-s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(events.router)
app.include_router(links.router)

@app.get("/")
def root():
    return {"message": "Backend running"}