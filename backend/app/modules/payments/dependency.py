from fastapi import Depends
from .services import PaymentService
from .repository import PaymentRepository
from sqlalchemy.orm import Session
from app.core.db.session import get_db


def get_payment_repository(db: Session = Depends(get_db)):
    return PaymentRepository(db=db)

def get_payment_service(
    repository: PaymentRepository = Depends(get_payment_repository),
):
    return PaymentService(repository=repository)
