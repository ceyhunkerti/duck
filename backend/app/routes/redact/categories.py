from typing import List
from fastapi import Depends
from pydantic.types import SecretBytes
from sqlalchemy.orm import Session
import app.models.orm as models
from app.models.orm.connection import Connection
import app.models.schemas.redact as s
from .base import router
from app.database import get_db
from app.oracle import ping
from pydantic import parse_obj_as
from app.oracle import redact


@router.get(
    "/connections/{conn_id}/categories",
    tags=["Categories"],
    response_model=List[s.CategoryOut],
)
def get_all(conn_id: int, db: Session = Depends(get_db)):
    connection = connection = db.query(models.Connection).get(conn_id)
    expressions = redact.get_expressions(connection)

    def get_expression(policy_expression_name):
        for e in expressions:
            if e.policy_expression_name == policy_expression_name:
                return e

    categories = (
        db.query(models.Category)
        .filter(models.Category.connection_id == conn_id)
        .all()
    )
    for c in categories:
        c.policy_expression = get_expression(c.policy_expression_name)

    return parse_obj_as(List[s.CategoryOut], categories)


@router.get(
    "/connections/{conn_id}/categories/{id}",
    tags=["Categories"],
    response_model=s.CategoryOut,
)
def get_one(conn_id: int, id: int, db: Session = Depends(get_db)):
    connection = connection = db.query(models.Connection).get(conn_id)
    expressions = redact.get_expressions(connection)

    def get_expression(policy_expression_name):
        for e in expressions:
            if e.policy_expression_name == policy_expression_name:
                return e

    category = (
        db.query(models.Category)
        .filter(
            models.Category.connection_id == conn_id, models.Category.id == id
        )
        .one()
    )
    category.policy_expression = get_expression(
        category.policy_expression_name
    )

    return s.CategoryOut.from_orm(category)


@router.post(
    "/connections/{conn_id}/categories",
    tags=["Categories"],
    response_model=s.CategoryOut,
)
def create(
    conn_id: int, category: s.CategoryCreateIn, db: Session = Depends(get_db),
):
    payload = {**category.dict(), "connection_id": conn_id}
    new_category: models.Category = models.Category(**payload)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    policy_expression = redact.get_expression(
        new_category.connection, new_category.policy_expression_name
    )
    new_category.policy_expression = policy_expression
    return s.CategoryOut.from_orm(new_category)


@router.put(
    "/connections/{conn_id}/categories/{id}",
    tags=["Categories"],
    response_model=s.CategoryOut,
)
def update(
    conn_id: int,
    id: int,
    category: s.CategoryUpdateIn,
    db: Session = Depends(get_db),
):
    cat = db.query(models.Category).get(id)
    if cat is None:
        return None

    for var, value in vars(category).items():
        setattr(cat, var, value) if value else None

    db.add(cat)
    db.commit()
    db.refresh(cat)
    return s.CategoryOut.from_orm(cat)


@router.delete(
    "/connections/{conn_id}/categories/{id}", response_model=s.CategoryOut,
)
def delete(conn_id: int, id: int, db: Session = Depends(get_db)):  # reserved
    category = db.query(models.Category).get(id)
    db.delete(category)
    db.commit()
    return s.CategoryOut.from_orm(category)
