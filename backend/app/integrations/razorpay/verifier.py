# integrations/razorpay/razorpay_verifier.py

import hashlib
import hmac

from app.core.config.settings import settings


class RazorpayVerifier:

    def __init__(self):
        self.payment_secret = settings.RAZORPAY_KEY_SECRET
        # self.webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

    def verify_payment_signature(
        self,
        order_id: str,
        payment_id: str,
        razorpay_signature: str,
    ) -> bool:

        if not order_id:
            return False

        if not payment_id:
            return False

        if not razorpay_signature:
            return False

        message = f"{order_id}|{payment_id}"

        generated_signature = hmac.new(
            self.payment_secret.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        return hmac.compare_digest(
            generated_signature,
            razorpay_signature,
        )

    def verify_webhook_signature(
        self,
        raw_body: bytes,
        razorpay_signature: str,
    ) -> bool:

        if not raw_body:
            return False

        if not razorpay_signature:
            return False

        generated_signature = hmac.new(
            self.webhook_secret.encode("utf-8"),
            raw_body,
            hashlib.sha256,
        ).hexdigest()

        return hmac.compare_digest(
            generated_signature,
            razorpay_signature,
        )
