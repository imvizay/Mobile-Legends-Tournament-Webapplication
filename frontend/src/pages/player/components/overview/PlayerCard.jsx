import {
  HiOutlineUser,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { FiChevronRight } from "react-icons/fi";

const paymentColor = {
  Paid: "#16a34a",
  Pending: "#f59e0b",
  Unpaid: "#dc2626",
};

export default function PlayerRow({ player }) {
  return (
    <div
      className="
        group
        flex flex-col gap-4
        px-4 py-4
        transition-all duration-300
        hover:bg-black/[0.02]
        dark:hover:bg-white/[0.02]

        sm:flex-row
        sm:items-center
        sm:justify-between

        md:px-5
      "
    >
      {/* Left */}
      <div className="flex items-start gap-3 md:gap-4">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-11 md:w-11"
          style={{
            background: "var(--surface-elevated)",
          }}
        >
          <HiOutlineUser
            size={20}
            style={{
              color: "var(--text-secondary)",
            }}
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="truncate text-sm font-medium md:text-base"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {player.name}
            </h3>

            {player.role === "Captain" && (
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold md:text-[10px]"
                style={{
                  background: "rgba(200,176,122,.12)",
                  color: "var(--accent-gold)",
                }}
              >
                Captain
              </span>
            )}
          </div>

          <div
            className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] md:text-xs"
            style={{
              color: "var(--text-muted)",
            }}
          >
            <span>MLBB ID: {player.mlbbId}</span>

            <span>Server: {player.server}</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div
        className="
          flex
          w-full
          items-center
          justify-between

          sm:w-auto
          sm:gap-5
        "
      >
        {/* Role */}
        <span
          className="rounded-full px-2.5 py-1 text-[11px] md:px-3 md:text-xs"
          style={{
            background: "var(--surface-elevated)",
            color: "var(--text-secondary)",
          }}
        >
          {player.role}
        </span>

        {/* Payment */}
        <div
          className="flex items-center gap-1.5 text-xs font-medium md:text-sm"
          style={{
            color: paymentColor[player.payment],
          }}
        >
          <HiOutlineShieldCheck size={15} />

          {player.payment}
        </div>

        {/* Arrow */}
        <button
          className="
            hidden
            rounded-lg
            p-2
            transition
            hover:bg-black/5
            dark:hover:bg-white/5

            sm:block
          "
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}