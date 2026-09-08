from .models import PaymentType
from datetime import datetime, timezone

def generate_payment_reference(payment_type: PaymentType, payment_id: int):

    now = datetime.now(timezone.utc)

    type_code = {
        PaymentType.TOURNAMENT_CONTRIBUTION: "TC",
        PaymentType.WALLET_TOPUP: "WT",
        PaymentType.WITHDRAWAL: "WD",
        PaymentType.REFUND: "RF",
        PaymentType.REWARD: "RW",
    }[payment_type]

    return f"PAY-{type_code}-{now:%Y-%m%d}-{payment_id:06d}"
