from .razorpay_service import RazorpayGatewayService


class RazorpayPaymentInspector:
    """
    Inspects an existing Razorpay order before deciding whether
    the current payment attempt can be resumed.

    This class does not modify database state.
    """

    def __init__(self):
        self.razorpay_service = RazorpayGatewayService()

    def inspect_payments(self, order_id: str):

        if not order_id:
            return {"state": "INVALID", "payments": None}

        razorpay_order_payments = self.razorpay_service.fetch_order_payments(order_id)

        razorpay_payments = razorpay_order_payments.get("items", None)

        successful_razorpay_payment = next(
            (
                gateway_payment
                for gateway_payment in razorpay_payments
                if gateway_payment.get("status") == "captured"
            ),
            None,
        )

        if successful_razorpay_payment:
            return {
                "state": "PAID",
                "payment": successful_razorpay_payment,
            }

        return {
            "state": "UNPAID",
            "payment": None,
        }

    def inspect_order(self, order_id: str):
        """
        Returns the current Razorpay order state.
        """

        if not order_id:
            return {
                "state": "INVALID",
                "order": None,
            }

        razorpay_order = self.razorpay_service.fetch_order(order_id)

        if not razorpay_order:
            return {
                "state": "UNKNOWN",
                "order": None,
            }

        order_status = razorpay_order.get("status")

        if order_status == "paid":
            return {
                "state": "PAID",
                "order": razorpay_order,
            }

        if order_status in ("created", "attempted"):
            return {
                "state": "RESUMABLE",
                "order": razorpay_order,
            }

        return {
            "state": "INVALID",
            "order": razorpay_order,
        }
