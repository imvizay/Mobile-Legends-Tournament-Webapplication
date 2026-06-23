import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiLockClosed,
} from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

const WalletOverview = ({wallet}) => {
  return (
    <section
      className="rounded-3xl border p-4 md:p-5"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)" }}
          >
            Wallet Overview
          </p>

          <h2
            className="mt-1 text-lg font-semibold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Google Sans",
            }}
          >
            Team Wallet
          </h2>
        </div>

        {/* Desktop Only */}

        <button
          className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition"
          style={{
            background: "var(--action-secondary-bg)",
            color: "var(--action-secondary-text)",
            border: "1px solid var(--action-secondary-border)",
          }}
        >
          Transactions
          <FiArrowRight size={14} />
        </button>
      </div>

      {/* Desktop */}

      <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr] gap-5">

        {/* Balance */}

        <div>
          <p
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Available Balance
          </p>

          <h1
            className="mt-1 text-3xl font-bold"
            style={{
              color: "var(--headline-primary)",
              fontFamily: "Google Sans",
            }}
          >
            {wallet.wallet_balance || 0.00}
          </h1>

          <div className="mt-3 flex gap-2">

            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
              style={{
                background: "var(--action-primary-bg)",
                color: "var(--action-primary-text)",
              }}
            >
              <HiArrowDownTray size={14} />
              Deposit
            </button>

            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
              style={{
                background: "var(--action-secondary-bg)",
                color: "var(--action-secondary-text)",
                border: "1px solid var(--action-secondary-border)",
              }}
            >
              <HiArrowUpTray size={14} />
              Withdraw
            </button>

          </div>
        </div>

        {/* Locked */}

        <div
          className="border-l pl-5"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-2">

            <HiLockClosed
              size={14}
              style={{ color: "var(--accent-gold)" }}
            />

            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Wallet Status/Locked Balance
            </span>

          </div>

          <h3
            className="mt-2 text-xl font-semibold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Google Sans",
            }}
          >
            {wallet.status || wallet.wallet_balance}
          </h3>
        </div>

        {/* Earnings */}

        <div
          className="border-l pl-5"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Total Earnings
          </p>

          <h3
            className="mt-2 text-xl font-semibold"
            style={{
              color: "var(--accent-gold)",
              fontFamily: "Google Sans",
            }}
          >
            ₹25,000
          </h3>
        </div>

      </div>

      {/* Mobile */}

      <div className="space-y-4 md:hidden">

        <div>

          <p
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Available Balance
          </p>

          <h1
            className="mt-1 text-3xl font-bold"
            style={{
              color: "var(--headline-primary)",
              fontFamily: "Google Sans",
            }}
          >
            {wallet.wallet_balance || 0.00}
          </h1>

        </div>

        <div className="grid grid-cols-2 gap-3">

          <button
            className="flex justify-center items-center gap-2 rounded-xl py-3 text-sm font-medium"
            style={{
              background: "var(--action-primary-bg)",
              color: "var(--action-primary-text)",
            }}
          >
            <HiArrowDownTray size={15} />
            Deposit
          </button>

          <button
            className="flex justify-center items-center gap-2 rounded-xl py-3 text-sm font-medium"
            style={{
              background: "var(--action-secondary-bg)",
              color: "var(--action-secondary-text)",
              border: "1px solid var(--action-secondary-border)",
            }}
          >
            <HiArrowUpTray size={15} />
            Withdraw
          </button>

        </div>

        <div
          className="grid grid-cols-2 gap-3 border-t pt-4"
          style={{ borderColor: "var(--border-default)" }}
        >

          <div>

            <p
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Locked
            </p>

            <h3
              className="mt-1 text-lg font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              ₹1,250
            </h3>

          </div>

          <div>

            <p
              className="text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Earnings
            </p>

            <h3
              className="mt-1 text-lg font-semibold"
              style={{
                color: "var(--accent-gold)",
              }}
            >
              ₹25,000
            </h3>

          </div>

        </div>

      </div>

    </section>
  );
};

export default WalletOverview;