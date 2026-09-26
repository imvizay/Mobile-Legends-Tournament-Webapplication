from .client import razorpay_client


class RazorpayGatewayService:

    def fetch_order(self, order_id: str):
        if not order_id:
            return None

        try:
            return razorpay_client.order.fetch(order_id)
        except Exception:
            return None

    def fetch_order_payments(self, order_id: str):
        if not order_id:
            return None

        try:
            return razorpay_client.order.payments(order_id)
        except Exception:
            return None

    def create_order(
        self,
        amount: int,
        currency: str,
        receipt: str,
    ):
        return razorpay_client.order.create(
            data={
                "amount": amount,
                "currency": currency,
                "receipt": receipt,
                "partial_payment": False,
            }
        )
