import { useState } from "react";

import { loadRazorpay } from "../../features/payments/utils/loadRazorpay";
import { getNetworkStatus } from "../../features/payments/utils/networkStatus";

import { paymentService } from "../../services/payments/payment_service";

import { useUserContext } from "../../contexts/UserContext";
import { Contact } from "lucide-react";

export const useRazorpayPayment = () => {

  const [paymentState, setPaymentState] = useState("IDLE");
  const [networkStatus, setNetworkStatus] = useState(null);
  const { user } = useUserContext()

  const startPayment = async (contributionId, idempotencyKey) => {

    try {
      const network = getNetworkStatus();

      setNetworkStatus(network);

      if (network.status === "OFFLINE") {
        setPaymentState("NETWORK_ERROR");
        return;
      }

      if (network.status === "POOR") {
        setPaymentState("NETWORK_POOR");
        return;
      }

      setPaymentState("LOADING_CHECKOUT");

      const loaded = await loadRazorpay();

      if (!loaded) {
        setPaymentState("RAZORPAY_LOAD_ERROR");
        return;
      }

      setPaymentState("CREATING_ORDER");

      const { data } = await paymentService.createOrder(contributionId,idempotencyKey)

      setPaymentState("CHECKOUT_READY");

      openRazorpayCheckout(data);

    } catch (error) {
      console.error(error);
      setPaymentState("PAYMENT_ERROR");
    }
  };

  const retryPayment = async () => {
    const network = getNetworkStatus()
    setNetworkStatus(network)

    if (network.status == "OFFLINE") {
      await startPayment(
        contributionId,
        idempotencyKey
      )
    }
  }

  const openRazorpayCheckout = (order) => {
    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.order_id,

      name: "GAMIX",
      description: order.description,
      prefil: {
        name: user?.email.split("@")[0],
        email: user?.email,
        ...(user?.contact && { contact: user?.contact })
      },
      handler: async (response) => {
        await verifyPayment(response);
      },

      modal: {
        ondismiss: () => {
          setPaymentState("CANCELLED");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.error("Payment failed:", response);

      setPaymentState("PAYMENT_FAILED");
    });

    razorpay.open();
  };

  const verifyPayment = async (response) => {
    try {
      setPaymentState("VERIFYING_PAYMENT");

      await paymentService.verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      setPaymentState("PAYMENT_SUCCESS");

    } catch (error) {
      console.error(error);
      setPaymentState("VERIFICATION_FAILED");
    }
  };

  return {
    paymentState,
    networkStatus,
    startPayment,
    retryPayment
  };
};