import { api } from "../../api/client/request";

export const paymentService = {
    createOrder: (contributionId) => {
        return api.post(`payments/contribution/${contribution_id}/razorpay/create-order`)
    }
}