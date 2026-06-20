import {
  HiOutlineTrophy,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

const ActiveTournament = () => {
  return (
    <section
      className=" relative overflow-hidden rounded-3xl border p-4 md:p-5 lg:p-6"
      style={{
        background: "var(--glass-surface)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "var(--glass-border)",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      {/* Decorative Glow */}
      <div
        className="absolute -right-16 -top-16 h-36 w-36 lg:h-52 lg:w-52 rounded-full blur-3xl"
        style={{
          background: "rgba(200,176,122,.18)",
        }}
      />

      <div
        className="absolute bottom-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "rgba(200,176,122,.08)",
        }}
      />

      <div className=" relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex-1">
          {/* Header */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{
                background: "rgba(200,176,122,.12)",
                color: "var(--accent-gold)",
                border: "1px solid rgba(200,176,122,.22)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Registered
            </span>

            {/* <button
              className="hidden lg:flex items-center gap-2 rounded-xl w-full justify-center rounded-xl px-4 py-2.5 text-xs sm:w-auto text-xs transition-all duration-300 hover:translate-x-1"
              style={{
                background: "var(--action-secondary-bg)",
                color: "var(--action-secondary-text)",
                border: "1px solid var(--action-secondary-border)",
              }}
            >
              View Tournament

              <FiArrowRight size={15} />
            </button> */}
          </div>

          {/* Title */}

          <div className="mt-5">
            <h2
              className="
              text-xl
              sm:text-2xl
              lg:text-3xl 
              font-semibold leading-tight"
              style={{
                color: "var(--headline-primary)",
                fontFamily: "Google Sans",
              }}
            >
              MLBB Championship
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Organized by Gamix Esports
            </p>
          </div>

          {/* Description */}

          <p
            className="mt-4 max-w-xl text-xs sm:text-sm leading-6"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Your team has successfully completed registration. Stay updated with
            match schedules, tournament announcements and upcoming fixtures.
          </p>

          {/* Stats */}

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              icon={<HiOutlineTrophy />}
              title="Prize Pool"
              value="₹50,000"
            />

            <Stat
              icon={<HiOutlineUsers />}
              title="Teams"
              value="32 / 64"
            />

            <Stat
              icon={<HiOutlineClock />}
              title="Starts In"
              value="2 Days"
            />

            <Stat
              icon={<HiOutlineCheckBadge />}
              title="Status"
              value="Confirmed"
            />
          </div>

           <button
              className="mt-2 flex items-center gap-2 rounded-xl w-full justify-center rounded-xl px-10 py-4 text-xs sm:w-auto font-bold tracking-light text-xs transition-all duration-300 hover:translate-x-1"
              style={{
                background: "var(--action-primary-bg)",
                color: "var(--action-primary-text)",
                border: "1px solid var(--action-secondary-border)",
              }}
            >
              View Tournament

              <FiArrowRight size={15} />
            </button>
        </div>

        {/* RIGHT */}

        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            {/* Glow */}

            <div
              className="absolute inset-0 scale-110 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,176,122,.22), transparent 70%)",
              }}
            />

            {/* Glass Circle */}

            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: "var(--glass-surface)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(18px)",
              }}
            >
              <HiOutlineTrophy
                className="text-[90px]"
                style={{
                  color: "var(--accent-gold)",
                }}
              />

              {/* Floating Ring */}

              <div
                className="absolute inset-3 rounded-full"
                style={{
                  border: "1px dashed rgba(200,176,122,.18)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



function Stat({ icon, title, value }) {
  return (
    <div
      className="rounded-2xl p-2.5 sm:p-3 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--glass-surface)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="mb-2 text-base sm:text-lg"
        style={{
          color: "var(--accent-gold)",
        }}
      >
        {icon}
      </div>

      <p
        className="text-[10px] sm:text-[11px] uppercase tracking-wider"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {title}
      </p>

      <h4
        className="mt-1 text-xs sm:text-sm font-semibold"
        style={{
          color: "var(--text-primary)",
          fontFamily: "Google Sans",
        }}
      >
        {value}
      </h4>
    </div>
  );
}

export default ActiveTournament;