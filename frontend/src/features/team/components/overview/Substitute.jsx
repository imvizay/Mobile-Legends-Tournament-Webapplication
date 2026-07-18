import {
  HiOutlineUser,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

const substitutes = [
  {
    id: 1,
    player_name: "Rahul Verma",
    mlbb_id: "812998",
    server: "2169",
    role: "Gold Lane",
    payment: "Paid",
  },
  {
    id: 2,
    player_name: "Aman Singh",
    mlbb_id: "921182",
    server: "2201",
    role: "Jungler",
    payment: "Pending",
  },
];

const paymentStyles = {
  Paid: {
    bg: "#22c55e15",
    color: "#22c55e",
  },
  Pending: {
    bg: "#f59e0b15",
    color: "#f59e0b",
  },
  Unpaid: {
    bg: "#ef444415",
    color: "#ef4444",
  },
};

const SubstitutePlayers = () => {
  return (
    <section
      className="rounded-3xl border"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}

      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{
          borderColor: "var(--border-default)",
        }}
      >
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Bench
          </p>

          <h2
            className="mt-1 text-lg font-semibold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Google Sans",
            }}
          >
            Substitute Players
          </h2>
        </div>

        {/* <button
          className="flex items-center gap-2 text-xs font-medium"
          style={{
            color: "var(--accent-gold)",
          }}
        >
          View All

          <FiArrowRight />
        </button> */}
      </div>

      {/* Players */}

      <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
        {substitutes.map((player) => {
          const payment = paymentStyles[player.payment];

          return (
            <div
              key={player.id}
              className="flex flex-col gap-4 
              sm:flex-row 
              sm:items-center 
              sm:justify-between  
              px-5 py-4 transition hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="flex w-full justify-between sm:w-auto sm:gap-4">
                {/* Avatar */}

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
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

                <div>
                  <h3
                    className="text-sm font-medium"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {player.player_name}
                  </h3>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    MLBB {player.mlbb_id} • Server {player.server}
                  </p>
                </div>
              </div>

              {/* Right */}

              <div className="flex items-center gap-4">
                <span
                  className="hidden rounded-lg px-3 py-1 text-xs font-medium md:block"
                  style={{
                    background: "var(--surface-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {player.role}
                </span>

                <span
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: payment.bg,
                    color: payment.color,
                  }}
                >
                  <HiOutlineCheckBadge size={14} />

                  {player.payment}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SubstitutePlayers;