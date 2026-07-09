import React, { useState } from "react";
import {
  X,
  Home,
  Trophy,
  Users,
  BarChart3,
  MessageSquare,
  Wallet,
  Gem,
  UserRound,
  ChevronRight,
} from "lucide-react";
import ThemeToggle from "../button/ThemeToggle";

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { id: 1, label: "Home", icon: Home },
    { id: 2, label: "Tournaments", icon: Trophy },
    { id: 3, label: "Teams", icon: Users },
    { id: 4, label: "Friends", icon: UserRound, badge: "NEW" },
    { id: 5, label: "Leaderboards", icon: BarChart3 },
    { id: 6, label: "Community", icon: MessageSquare },
    { id: 7, label: "Wallet", icon: Wallet },
    { id: 8, label: "Membership", icon: Gem },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <header
        className="
          fixed top-3 left-1/2 z-50
          -translate-x-1/2
          w-[calc(100%-24px)]
          max-w-[980px]
          h-[54px]
          px-3
          flex items-center justify-between
          rounded-xl
          bg-[var(--glass-navbar)]
          backdrop-blur-xl
          border border-[var(--border-default)]
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              h-7 w-7
              rounded-lg
              flex items-center justify-center
              bg-[var(--action-primary-bg)]
              text-[var(--action-primary-text)]
              text-[11px]
              font-black
            "
          >
            G
          </div>

          <span
            className="
              font-['Google_Sans']
              font-bold
              text-[17px]
              tracking-[-0.04em]
              text-[var(--text-primary)]
              whitespace-nowrap
            "
          >
            Gamix.
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation"
            className="
              h-9 w-9
              rounded-lg
              flex items-center justify-center
              text-[var(--text-primary)]
              border border-[var(--border-default)]
              bg-[var(--glass-surface)]
              transition-colors
              hover:bg-[var(--bg-secondary)]
            "
          >
            <div className="flex flex-col gap-[4px]">
              <span className="w-[16px] h-[1.5px] rounded-full bg-current" />
              <span className="w-[12px] h-[1.5px] rounded-full bg-current ml-auto" />
              <span className="w-[16px] h-[1.5px] rounded-full bg-current" />
            </div>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-[998]
          bg-black/30
          backdrop-blur-[2px]
          transition-opacity duration-300
          ${
            isOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }
        `}
      />

      {/* Navigation Drawer */}
      <aside
        className={`
          fixed top-0 right-0 z-[999]
          h-dvh
          w-[88%]
          max-w-[390px]
          bg-[var(--bg-primary)]
          border-l border-[var(--border-default)]
          shadow-[-20px_0_60px_rgba(0,0,0,0.12)]
          transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Drawer Top */}
          <div className="px-5 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                    font-semibold
                    text-[var(--text-secondary)]
                    whitespace-nowrap
                  "
                >
                  Gamix Platform
                </p>

                <h2
                  className="
                    mt-1
                    text-[20px]
                    leading-none
                    font-bold
                    tracking-[-0.035em]
                    text-[var(--text-primary)]
                    whitespace-nowrap
                  "
                >
                  Welcome back.
                </h2>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                className="
                  h-9 w-9
                  rounded-lg
                  flex items-center justify-center
                  border border-[var(--border-default)]
                  text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)]
                  transition-colors
                "
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 min-h-0 overflow-y-auto px-3 pt-7">
            <p
              className="
                px-2
                mb-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[var(--text-secondary)]
                whitespace-nowrap
              "
            >
              Navigation
            </p>

            <div className="space-y-0.5">
              {navigationLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    className="
                      group
                      relative
                      w-full
                      h-[46px]
                      px-3
                      flex items-center
                      rounded-lg
                      text-left
                      text-[var(--text-secondary)]
                      transition-colors
                      hover:bg-[var(--glass-surface)]
                      hover:text-[var(--text-primary)]
                    "
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className="shrink-0"
                      />

                      <span
                        className="
                          text-[13px]
                          font-medium
                          whitespace-nowrap
                        "
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className="
                            rounded-full
                            px-1.5 py-[2px]
                            text-[8px]
                            leading-none
                            font-bold
                            tracking-[0.08em]
                            bg-[var(--action-primary-bg)]
                            text-[var(--action-primary-text)]
                            whitespace-nowrap
                          "
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <ChevronRight
                      size={14}
                      className="
                        shrink-0
                        opacity-0
                        -translate-x-1
                        transition-all
                        group-hover:translate-x-0
                        group-hover:opacity-50
                      "
                    />
                  </button>
                );
              })}
            </div>

            {/* Featured Tournament */}
            <div className="mt-7">
              <div className="flex items-center justify-between px-2 mb-2">
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--text-secondary)]
                    whitespace-nowrap
                  "
                >
                  Featured
                </p>

                <span
                  className="
                    flex items-center gap-1
                    text-[9px]
                    font-medium
                    text-[var(--text-secondary)]
                    whitespace-nowrap
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Live
                </span>
              </div>

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-xl
                  border border-[var(--border-default)]
                  bg-[var(--glass-surface)]
                "
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-[var(--text-secondary)]
                          whitespace-nowrap
                        "
                      >
                        Championship Series
                      </p>

                      <h3
                        className="
                          mt-1.5
                          text-[15px]
                          font-bold
                          tracking-[-0.02em]
                          text-[var(--text-primary)]
                          whitespace-nowrap
                          overflow-hidden
                          text-ellipsis
                        "
                      >
                        Champions Clash S2
                      </h3>
                    </div>

                    <Trophy
                      size={18}
                      className="shrink-0 text-[var(--accent-gold)]"
                    />
                  </div>

                  <div
                    className="
                      mt-3
                      flex items-center justify-between
                      border-t border-[var(--border-default)]
                      pt-3
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-[var(--text-secondary)]
                        whitespace-nowrap
                      "
                    >
                      Starts in 2 days
                    </span>

                    <button
                      className="
                        flex items-center gap-1
                        text-[10px]
                        font-semibold
                        text-[var(--text-primary)]
                        whitespace-nowrap
                        hover:opacity-70
                        transition-opacity
                      "
                    >
                      View
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div
            className="
              shrink-0
              px-4
              py-4
              border-t border-[var(--border-default)]
            "
          >
            <div className="flex items-center justify-between gap-3">
              <button
                className="
                  text-[12px]
                  font-semibold
                  text-[var(--text-secondary)]
                  whitespace-nowrap
                  hover:text-[var(--text-primary)]
                  transition-colors
                "
              >
                Sign in
              </button>

              <button
                className="
                  h-9
                  px-4
                  rounded-lg
                  text-[11px]
                  font-semibold
                  whitespace-nowrap
                  bg-[var(--action-primary-bg)]
                  text-[var(--action-primary-text)]
                  border border-[var(--action-primary-border)]
                  hover:opacity-90
                  transition-opacity
                "
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MobileNavbar;