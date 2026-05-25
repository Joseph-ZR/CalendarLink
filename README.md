# CalendarLink
CalendarLink is a personal full-stack project I started to build a better shared scheduling system for my girlfriend and I while continuing to improve my backend and full-stack development skills.

CalendarLink is designed to allow users to create personal events, share availability with linked users, and manage schedules through a modern web application, something that my girlfriend has always wanted for us.


This project was built as both a passion project and a portfolio-focused full-stack application emphasizing:
- backend API architecture
- authentication systems
- relational databases
- protected routes
- CRUD operations
- frontend/backend integration

---

# Features

## Authentication
- User registration
- Secure password hashing
- JWT authentication
- Protected API routes
- Case-insensitive email login

## Event Management
- Create events
- View events
- Update events
- Delete events
- Event visibility controls:
  - private
  - shared
  - busy

## Backend
- FastAPI REST API
- PostgreSQL database
- SQLAlchemy ORM
- Neon cloud database hosting
- Structured route architecture

## Planned Features
- Shared user linking system
- Interactive calendar UI
- Frontend dashboard
- Responsive design
- Deployment with Vercel

---

# Tech Stack

## Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Neon
- JWT Authentication
- Uvicorn

## Frontend
- React
- HTML
- CSS
- JavaScript

## Planned Deployment
- Vercel

---

# Current Project Structure

```txt
backend/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── auth.py
│   ├── models.py
│   ├── schemas.py
│   │
│   └── routes/
│       ├── users.py
│       ├── events.py
│       └── links.py