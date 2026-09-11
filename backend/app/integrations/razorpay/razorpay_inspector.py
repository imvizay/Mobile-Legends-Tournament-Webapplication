from .razorpay_service import RazorpayGatewayService


class RazorpayPaymentInspector:

    def __init__(self):
        self.gateway = RazorpayGatewayService()

    def inspect(self, order_id: str):

        if not order_id:
            return {
                "state": "INVALID",
                "order": None,
                "payment": None,
            }

        order = self.gateway.fetch_order(order_id)

        if not order:
            return {
                "state": "UNKNOWN",
                "order": None,
                "payment": None,
            }

        order_status = order.get("status")

        if order_status == "paid":

            payments_response = self.gateway.fetch_order_payments(order_id)

            if not payments_response:
                return {
                    "state": "PAID",
                    "order": order,
                    "payment": None,
                }

            payments = payments_response.get("items") or []

            captured_payment = next(
                (
                    payment
                    for payment in payments
                    if payment.get("status") == "captured"
                ),
                None,
            )

            return {
                "state": "PAID",
                "order": order,
                "payment": captured_payment,
            }

        if order_status in ("created", "attempted"):
            return {
                "state": "RESUMABLE",
                "order": order,
                "payment": None,
            }

        return {
            "state": "INVALID",
            "order": order,
            "payment": None,
        }
