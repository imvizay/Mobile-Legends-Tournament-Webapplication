import { useState } from "react";

import { loadRazorpay } from "../../features/payments/utils/loadRazorpay";
import { getNetworkStatus } from "../../features/payments/utils/networkStatus";
import { paymentService } from "../../services/payments/payment_service";
import { useUserContext } from "../../contexts/UserContext";


export const useRazorpayPayment = () => {
  const [paymentState, setPaymentState] = useState("IDLE");
  const [networkStatus, setNetworkStatus] = useState(null);

  const { user } = useUserContext();


  const verifyPayment = async (registrationId, razorpayResponse) => {
    const verificationResponse = await paymentService.verifyPayment({
      registration_id: registrationId,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    });

    // Supports both:
    // 1. service returns response.data
    // 2. service returns the complete Axios response
    return verificationResponse?.code
      ? verificationResponse
      : verificationResponse?.data;
  };


  const openRazorpayCheckout = (registrationId, order) => {
    if (!window.Razorpay) {
      console.error("[Razorpay] Razorpay constructor is unavailable");
      setPaymentState("RAZORPAY_LOAD_ERROR");
      return;
    }

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.order_id,

      name: "GAMIX",
      description: order.description || "Tournament contribution",

      prefill: {
        name: user?.email?.split("@")[0] || "",
        email: user?.email || "",
        ...(user?.contact ? { contact: user.contact } : {}),
      },

      handler: async (razorpayResponse) => {
        console.log("[Razorpay] Payment response:", razorpayResponse);

        setPaymentState("VERIFYING");

        try {
          const verificationResponse = await verifyPayment(
            registrationId,
            razorpayResponse
          );

          console.log(
            "[Razorpay] Verification response:",
            verificationResponse
          );

          const code = verificationResponse?.code;
          const data = verificationResponse?.data;

          if (
            code === "PAYMENT_VERIFIED" ||
            code === "PAYMENT_ALREADY_PAID"
          ) {
            window.location.replace(
              `/player/payments/success/${data?.payment_reference}`
            );
            return;
          }

          setPaymentState("VERIFICATION_FAILED");
        } catch (error) {
          console.error("[Razorpay] Verification failed:", error);
          setPaymentState("VERIFICATION_FAILED");
        }
      },

      modal: {
        ondismiss: () => {
          console.log("[Razorpay] Checkout dismissed");
          setPaymentState("IDLE");
        },
      },
    };

    try {
      console.log("[Razorpay] Opening checkout:", options);

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("[Razorpay] Payment failed:", response);
        setPaymentState("PAYMENT_FAILED");
      });

      razorpay.open();
    } catch (error) {
      console.error("[Razorpay] Could not open checkout:", error);
      setPaymentState("PAYMENT_ERROR");
    }
  };


  const startPayment = async ({
    registrationId,
    rosterId,
    idempotencyKey,
  }) => {
    console.log("[Razorpay] startPayment called:", {
      registrationId,
      rosterId,
      idempotencyKey,
    });

    try {
      if (!registrationId || !rosterId || !idempotencyKey) {
        console.error("[Razorpay] Missing payment values:", {
          registrationId,
          rosterId,
          idempotencyKey,
        });

        setPaymentState("PAYMENT_ERROR");
        return;
      }

      const network = getNetworkStatus();

      console.log("[Razorpay] Network status:", network);

      setNetworkStatus(network);

      if (network.status === "OFFLINE") {
        setPaymentState("NETWORK_ERROR");
        return;
      }

      // Do not block payment for POOR or SLOW.
      // The request can still succeed.
      setPaymentState("LOADING_CHECKOUT");

      console.log("[Razorpay] Loading Razorpay SDK...");

      const loaded = await loadRazorpay();

      console.log("[Razorpay] SDK loaded:", loaded);

      if (!loaded) {
        setPaymentState("RAZORPAY_LOAD_ERROR");
        return;
      }

      setPaymentState("CREATING_ORDER");

      console.log("[Razorpay] Creating order...");

      const response = await paymentService.createOrder(
        registrationId,
        rosterId,
        idempotencyKey
      );

      console.log("[Razorpay] Raw create-order response:", response);

      // Handles either:
      // API body:       { code, data }
      // Axios response: { data: { code, data }, status, ... }
      const payload = response?.code
        ? response
        : response?.data;

      const code = payload?.code;
      const data = payload?.data;

      console.log("[Razorpay] Normalized create-order response:", {
        code,
        data,
      });

      if (!code) {
        console.error(
          "[Razorpay] Backend response does not contain a code:",
          response
        );

        setPaymentState("PAYMENT_ERROR");
        return;
      }

      if (code === "PAYMENT_ALREADY_PAID") {
        setPaymentState("ALREADY_PAID");

        window.location.replace(
          `/player/payments/success/already_paid/${data?.payment_reference}`
        );

        return;
      }

      if (code === "PAYMENT_ATTEMPT_FAILED") {
        setPaymentState("PAYMENT_FAILED");
        return;
      }

      if (
        code === "PAYMENT_ORDER_CREATED" ||
        code === "PAYMENT_ATTEMPT_RESUMABLE"
      ) {
        if (!data?.order_id || !data?.key_id) {
          console.error(
            "[Razorpay] Missing order_id or key_id:",
            data
          );

          setPaymentState("PAYMENT_ERROR");
          return;
        }

        setPaymentState("CHECKOUT_READY");

        openRazorpayCheckout(registrationId, data);
        return;
      }

      console.error("[Razorpay] Unknown backend response code:", code);
      setPaymentState("PAYMENT_ERROR");
    } catch (error) {
      console.error("[Razorpay] startPayment failed:", error);
      setPaymentState("PAYMENT_ERROR");
    }
  };


  const retryPayment = async (
    registrationId,
    rosterId,
    idempotencyKey
  ) => {
    const network = getNetworkStatus();

    console.log("[Razorpay] Retry network status:", network);

    setNetworkStatus(network);

    if (network.status === "OFFLINE") {
      setPaymentState("NETWORK_ERROR");
      return;
    }

    return startPayment({
      registrationId,
      rosterId,
      idempotencyKey,
    });
  };


  return {
    paymentState,
    networkStatus,
    startPayment,
    retryPayment,
  };
};