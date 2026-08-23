import { RefreshCw, Wifi, WifiOff } from "lucide-react";

const NETWORK_STATES = {
  OFFLINE: {
    icon: WifiOff,
    eyebrow: "PAYMENT CONNECTION",
    title: "No Internet Connection",
    description: "Your connection is currently unavailable. Reconnect to the internet before continuing with your contribution.",
    action: true,
  },

  POOR: {
    icon: Wifi,
    eyebrow: "UNSTABLE CONNECTION",
    title: "Very Weak Network",
    description: "Your connection is too weak for a reliable payment. A stronger network is recommended before continuing.",
    action: false,
  },

  SLOW: {
    icon: Wifi,
    eyebrow: "CONNECTION NOTICE",
    title: "Slow Network",
    description: "Your connection may be slow. Payment can still continue, but a stable network is recommended.",
    action: false,
    progress: true,
  },

  RECONNECTING: {
    icon: RefreshCw,
    eyebrow: "CONNECTION STATUS",
    title: "Reconnecting",
    description: "We're trying to restore your connection. Please wait a moment.",
    action: false,
    spinning: true,
  },
};

function PaymentNetworkStatus({ status, onRetry }) {
  if (!status || !NETWORK_STATES[status]) return null;

  const state = NETWORK_STATES[status];
  const Icon = state.icon;

  return (
    <NetworkStatusCard
      icon={<Icon size={25} strokeWidth={1.7} className={state.spinning ? "animate-spin" : ""} />}
      eyebrow={state.eyebrow}
      title={state.title}
      description={state.description}
      progress={state.progress}
      action={
        state.action ? (
          <button
            type="button"
            onClick={onRetry}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border px-4 text-[9px] font-bold tracking-[0.02em] text-[var(--action-primary-text)] transition-all duration-200 hover:-translate-y-px hover:opacity-90 active:translate-y-0"
            style={{
              background: "var(--action-primary-bg)",
              borderColor: "var(--action-primary-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <RefreshCw size={13} strokeWidth={1.8} />
            Try Again
          </button>
        ) : null
      }
    />
  );
}

function NetworkStatusCard({ icon, eyebrow, title, description, action, progress = false }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-[6px] sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--bg-canvas) 76%, transparent)",
      }}
      role="alert"
      aria-live="assertive"
    >
      <div
        className="relative w-full max-w-[330px] overflow-hidden rounded-[18px] border bg-[var(--surface-base)] p-6 text-center sm:p-7"
        style={{
          borderColor: "var(--border-default)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          className="absolute inset-x-[25%] top-0 h-px"
          style={{
            background: "var(--accent-gold)",
            boxShadow: "0 0 16px var(--accent-gold)",
          }}
        />

        <div
          className="mx-auto flex size-[58px] items-center justify-center rounded-full border"
          style={{
            color: "var(--accent-gold)",
            borderColor: "var(--border-default)",
            background: "var(--surface-elevated)",
          }}
        >
          {icon}
        </div>

        <p
          className="mt-5 text-[7px] font-bold uppercase tracking-[0.18em]"
          style={{ color: "var(--accent-gold)" }}
        >
          {eyebrow}
        </p>

        <h2
          className="mt-2 text-[15px] font-black tracking-[-0.025em]"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        <p
          className="mx-auto mt-2 max-w-[245px] text-[9px] font-medium leading-[1.65]"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>

        {progress && (
          <div
            className="mx-auto mt-5 h-[3px] w-[110px] overflow-hidden rounded-full"
            style={{ background: "var(--border-subtle)" }}
          >
            <div
              className="h-full w-[48%] animate-pulse rounded-full"
              style={{
                background: "var(--accent-gold)",
                boxShadow: "0 0 10px var(--accent-gold)",
              }}
            />
          </div>
        )}

        {action && <div className="mt-6">{action}</div>}

        <div
          className="mx-auto mt-5 flex w-fit items-center gap-1.5 text-[7px] font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          <span
            className="size-1 rounded-full"
            style={{ background: "var(--accent-gold)" }}
          />
          Payment protected
        </div>
      </div>
    </div>
  );
}

export default PaymentNetworkStatus;