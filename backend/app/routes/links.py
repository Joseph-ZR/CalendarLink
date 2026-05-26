from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/links",
    tags=["Links"]
)


@router.post("/")
def link_user(
    link_data: schemas.LinkCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    target_user = db.query(models.User).filter(
        models.User.invite_code == link_data.invite_code
    ).first()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invite code"
        )

    if target_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot link with yourself"
        )

    existing_link = db.query(models.UserLink).filter(
        models.UserLink.user_id == current_user.id,
        models.UserLink.linked_user_id == target_user.id
    ).first()

    if existing_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already linked"
        )

    link_one = models.UserLink(
        user_id=current_user.id,
        linked_user_id=target_user.id
    )

    link_two = models.UserLink(
        user_id=target_user.id,
        linked_user_id=current_user.id
    )

    db.add(link_one)
    db.add(link_two)
    db.commit()

    return {
        "message": f"You are now linked with {target_user.username}"
    }


@router.get("/", response_model=list[schemas.LinkedUserResponse])
def get_linked_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    links = db.query(models.UserLink).filter(
        models.UserLink.user_id == current_user.id
    ).all()

    linked_users = []

    for link in links:
        user = db.query(models.User).filter(
            models.User.id == link.linked_user_id
        ).first()

        if user:
            linked_users.append(user)

    return linked_users