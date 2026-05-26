from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post("/", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if event.visibility not in ["private", "shared", "busy"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visibility must be private, shared, or busy"
        )

    new_event = models.Event(
        owner_id=current_user.id,
        title=event.title,
        description=event.description,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        visibility=event.visibility,
        color=event.color
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


@router.get("/", response_model=List[schemas.EventResponse])
def get_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    events = db.query(models.Event).filter(
        models.Event.owner_id == current_user.id
    ).all()

    return events


@router.put("/{event_id}", response_model=schemas.EventResponse)
def update_event(
    event_id: int,
    updated_event: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(
        models.Event.id == event_id,
        models.Event.owner_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    update_data = updated_event.model_dump(exclude_unset=True)

    if "visibility" in update_data:
        if update_data["visibility"] not in ["private", "shared", "busy"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Visibility must be private, shared, or busy"
            )

    for key, value in update_data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return event


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(
        models.Event.id == event_id,
        models.Event.owner_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    db.delete(event)
    db.commit()

    return {"message": "Event deleted successfully"}

@router.get("/shared", response_model=List[schemas.EventResponse])
def get_shared_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    links = db.query(models.UserLink).filter(
        models.UserLink.user_id == current_user.id
    ).all()

    linked_user_ids = [link.linked_user_id for link in links]

    if not linked_user_ids:
        return []

    shared_events = db.query(models.Event).filter(
        models.Event.owner_id.in_(linked_user_ids),
        models.Event.visibility.in_(["shared", "busy"])
    ).all()

    return shared_events