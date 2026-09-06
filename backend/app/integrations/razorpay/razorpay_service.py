from .razorpay_client import razorpay_client


class RazorpayGatewayService:
    
    def fetch_order(self, order_id: str):
        if not order_id:
            return {
                "code": 400,
                "status": "BAD_REQUEST",
                "message": "Cannot fetch Razorpay order, 'order_id' is None.",
            }

        return razorpay_client.order.fetch(order_id)

    def fetch_order_payments(self, order_id: str):
        if not order_id:
            return {
                "code": 400,
                "status": "BAD_REQUEST",
                "message": "Cannot fetch Razorpay payments, 'order_id' is None.",
            }

        return razorpay_client.order.payments(order_id)
    


