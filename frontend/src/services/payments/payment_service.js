import { api } from "../../api/client/request";

export const paymentService = {
    createOrder: (contributionId, idempotencyKey) => {
        return api.post(`/payments/contribution/${contributionId}/razorpay/create-order`,
            {},
            {
                headers: {
                    "Idempotency-Key": idempotencyKey,
                },
            }
        );
    },
};