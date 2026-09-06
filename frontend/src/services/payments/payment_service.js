import { api } from "../../api/client/request";

export const paymentService = {
    createOrder: (registrationId,roster_id, idempotencyKey) => {
        return api.post(`/payments/contribution/${registrationId}/razorpay/create-order`,
            {roster_id},
            {
                headers: {
                    "Idempotency-Key": idempotencyKey,
                },
            }
        );
    },

    verifyPayment: ({ registration_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
        return api.post(`/payments/contribution/${registration_id}/razorpay/verify-order`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })

    }
}


