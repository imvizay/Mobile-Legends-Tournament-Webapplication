import {
  AlertTriangle,
  RefreshCw,
  WifiOff,
} from "lucide-react";

function PaymentNetworkStatus({ status, onRetry }) {
  if (!status || status === "GOOD") {
    return null;
  }

  const isOffline = status === "OFFLINE";
  const isReconnecting = status === "RECONNECTING";
  const isPoor = status === "POOR";
  const isSlow = status === "SLOW";

  const title = isOffline
    ? "You’re offline"
    : isReconnecting
      ? "Reconnecting..."
      : isPoor
        ? "Poor connection"
        : isSlow
          ? "Slow connection"
          : "Connection issue";

  const description = isOffline
    ? "Reconnect to the internet before starting your payment."
    : isReconnecting
      ? "We’re waiting for your connection to become stable."
      : isPoor
        ? "Your connection is unstable. The payment request may take longer."
        : isSlow
          ? "The payment request may take a little longer than usual."
          : "Check your internet connection and try again.";

  return (
    <div
      className="rounded-[14px] border p-3"
      style={{
        borderColor: isOffline
          ? "color-mix(in srgb, #ef4444 35%, var(--border-default))"
          : "var(--border-default)",
        background: isOffline
          ? "color-mix(in srgb, #ef4444 7%, var(--surface-base))"
          : "var(--surface-elevated)",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface-base)]">
          {isOffline ? (
            <WifiOff
              size={15}
              className="text-red-500"
            />
          ) : isReconnecting ? (
            <RefreshCw
              size={15}
              className="animate-spin text-[var(--text-secondary)]"
            />
          ) : (
            <AlertTriangle
              size={15}
              className="text-amber-500"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-[var(--text-primary)]">
            {title}
          </p>

          <p className="mt-1 text-[9px] leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>

          {isOffline && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 rounded-[9px] border px-3 py-2 text-[9px] font-semibold text-[var(--text-primary)]"
              style={{
                borderColor: "var(--border-default)",
              }}
            >
              <RefreshCw size={11} />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentNetworkStatus;