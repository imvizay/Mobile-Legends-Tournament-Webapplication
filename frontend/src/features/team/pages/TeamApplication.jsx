import React from "react";

const filters = [
  { label: "All", count: 12 },
  { label: "Pending", count: 3 },
  { label: "Accepted", count: 7 },
  { label: "Declined", count: 2 },
];

function TeamApplication() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border-default)" }}>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "var(--headline-primary)" }}>
            Team Applications
          </h2>

          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Review players requesting to join your team.
          </p>
        </div>

        <span className="w-fit rounded-lg border px-3 py-1.5 text-sm font-medium" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
          3 Pending
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-6 overflow-x-auto border-b pb-3 whitespace-nowrap scrollbar-hide" style={{ borderColor: "var(--border-default)" }}>
        {filters.map((item, index) => {
          const active = index === 0;

          return (
            <button
              key={item.label}
              className="relative shrink-0 pb-2 text-sm font-medium transition-colors"
              style={{ color: active ? "var(--headline-primary)" : "var(--text-secondary)" }}
            >
              {item.label}

              <span className="ml-2 rounded-md px-1.5 py-0.5 text-[11px]" style={{ background: "var(--surface-elevated)", color: "var(--text-muted)" }}>
                {item.count}
              </span>

              {active && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full" style={{ background: "var(--accent-gold)" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Application Card */}
      <div className="flex flex-col gap-5 rounded-xl border p-4 md:flex-row md:items-center md:justify-between md:px-5" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
        {/* Left */}
        <div className="flex items-center gap-4">
          <img src="https://i.pravatar.cc/100?img=5" alt="" className="h-11 w-11 rounded-xl object-cover" />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold" style={{ color: "var(--headline-primary)" }}>
                ShadowHunter
              </h3>

              <span className="rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--border-default)", color: "var(--text-muted)" }}>
                🇮🇳 India
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span>
                <strong>MLBB</strong> 492847182
              </span>

              <span>
                <strong>Server</strong> 10324
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 md:items-end">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Applied 2h ago
          </span>

          <div className="flex w-full gap-2 sm:w-auto">
            <button
              className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors sm:flex-none"
              style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              Decline
            </button>

            <button
              className="flex-1 rounded-lg px-4 py-2 text-sm font-medium sm:flex-none"
              style={{ background: "var(--action-primary-bg)", color: "var(--action-primary-text)" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamApplication;