from .models import PaymentType
from datetime import datetime,timezone
from uuid import uuid4

def generate_payment_reference(payment_type: PaymentType) -> str:
    prefix_map = {
        PaymentType.TOURNAMENT_CONTRIBUTION: "TC",
        PaymentType.WALLET_TOPUP: "WT",
        PaymentType.WITHDRAWAL: "WD",
        PaymentType.REFUND: "RF",
        PaymentType.REWARD: "RW",
        PaymentType.CLAIM: "CL",
        PaymentType.BONUS: "BN",
    }

    prefix = prefix_map.get(payment_type, "PAY")
    date = datetime.now(timezone.utc).strftime("%Y%m%d")
    unique_id = uuid4().hex[:10].upper()

    return f"PAY-{prefix}-{date}-{unique_id}"
