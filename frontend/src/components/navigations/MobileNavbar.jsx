import React,{useState} from "react";
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
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "../button/ThemeToggle";

function MobileNavbar() {
    const [isOpen,setIsOpen] = useState(false) 
  const navigationLinks = [
    {
      id: 1,
      label: "Home",
      icon: <Home size={18} />,
    },
    {
      id: 2,
      label: "Tournaments",
      icon: <Trophy size={18} />,
    },
    {
      id: 3,
      label: "Teams",
      icon: <Users size={18} />,
    },
    {
      id: 4,
      label: "Friends",
      icon: <UserRound size={18} />,
      badge: "NEW",
    },
    {
      id: 5,
      label: "Leaderboards",
      icon: <BarChart3 size={18} />,
    },
    {
      id: 6,
      label: "Community",
      icon: <MessageSquare size={18} />,
    },
    {
      id: 7,
      label: "Wallet",
      icon: <Wallet size={18} />,
    },
    {
      id: 8,
      label: "Membership",
      icon: <Gem size={18} />,
    },
  ];

  return (
    <>
      {/* Overlay */}
    <header
      className="
      fixed top-2
      left-1/2 -translate-x-1/2
      z-50
      md:mx-auto
      min-w-[clamp(360px,90vw,980px)]
      h-16
      px-4
      rounded-2xl
      flex items-center justify-between
      bg-[var(--glass-navbar)]
      backdrop-blur-md
      border border-[var(--border-default)]
      "
    >
      <h1 className="
        font-['Google_Sans']
        font-black
        text-xl
        text-[var(--text-primary)]
      ">
        Gamix.
      </h1>

      <div className="flex items-center gap-3">

        <ThemeToggle />

        <button
          onClick={() => setIsOpen(true)}
          className="
          h-10 w-10
          rounded-xl

          flex flex-col
          items-center
          justify-center
          gap-1

          bg-[var(--glass-surface)]
          border border-[var(--border-default)]
          "
        >
          <span className="w-5 h-[2px] bg-[var(--text-primary)]" />
          <span className="w-5 h-[2px] bg-[var(--text-primary)]" />
          <span className="w-5 h-[2px] bg-[var(--text-primary)]" />
        </button>

      </div>
    </header>

      <div
        className={`fixed inset-0 bg-[var(--bg-primary)] backdrop-blur-md z-[998]
        transition-all duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
      />

      {/* Sheet */}

      <aside
        className={`
        fixed top-0 right-0
        overflow-y-auto
        
        h-screen w-[88%] max-w-[380px]
        z-[999]
        bg-[var(--glass-navbar)]
        backdrop-blur-2xl
        border-l border-[var(--border-default)]
        shadow-[-10px_0px_40px_rgba(0,0,0,0.08)]
        transition-all duration-500 ease-out
        
        ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
      >
        <div className="h-full flex flex-col p-5">
          {/* Header */}

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-bold font-[Inter] text-3xl text-[var(--text-primary)]">
              Gamix.
            </h1>

            <button
              onClick={() => setIsOpen(false)}
              className="
              h-12 w-12
              rounded-xl
              border border-[var(--border-default)]
              flex items-center justify-center
              "
            >
              <X className="text-[var(--text-primary)]" size={20} />
            </button>
          </div>

          {/* Navigation */}

          <nav className="space-y-1">
            {navigationLinks.map((item) => (
              <button
                key={item.id}
                className="
                w-full
                flex items-center justify-between
                px-4 py-4
                rounded-2xl
                hover:bg-black/[0.03]
                text-[var(--text-secondary)]
                transition-all duration-200
                "
              >
                <div className="flex items-center gap-4">
                  {item.icon}

                  <span className="font-medium text-[15px]">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className="
                      px-2 py-1
                      rounded-full
                      text-[10px]
                      bg-green-100
                      text-green-700
                      "
                    >
                      {item.badge}
                    </span>
                  )}

                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </nav>

          {/* Tournament Card */}

          <div
            className="
            mt-6
            border border-[var(--border-default)]
            rounded-3xl
            p-4
            "
          >
            <p
              className="
              uppercase
              tracking-wide
              text-xs
              text-[var(--text-secondary)]
              "
            >
              Active Tournament
            </p>

            <h3 className="mt-2 font-bold text-[var(--text-primary)] text-lg">
              Champions Clash S2
            </h3>

            <p className="text-[var(--text-secondary)] font-semibold mt-1">
              Starts in 2 Days
            </p>

            <button
              className="
              mt-4
              w-full
              py-3
              rounded-2xl
              bg-[var(--action-primary-bg)]
              text-[var(--action-primary-text)]
              border border-[var(--action-primary-border)]
              flex items-center justify-center gap-2
              "
            >
              Join Tournament
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Bottom Actions */}

          <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
            <button
              className="
              py-3
              rounded-2xl
              text-[var(--text-primary)]
              border border-[var(--border-default)]
              "
            >
              Login
            </button>

            <button
              className="
              py-3
              rounded-2xl
              bg-[var(--action-primary-bg)]
              text-[var(--action-primary-text)]
              border border-[var(--action-primary-border)]
              "
            >
              Register
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MobileNavbar;