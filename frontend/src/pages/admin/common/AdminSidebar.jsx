import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {LayoutDashboard,Users,ShieldCheck,Trophy,ChartPie,BadgeCheck,MessageSquare,FileWarning,Megaphone,Gift,WalletCards,UserCog,Settings,ClipboardList,Headphones,ChevronDown,ChevronRight,} from "lucide-react";

import { useUserContext } from "../../../contexts/UserContext";

export default function AdminSidebar() {

  const [verificationOpen, setVerificationOpen] = useState(false);

  const { user } = useUserContext();
  const location = useLocation();

  const active = (path) => location.pathname === path;

  const navClass = (path) =>
    `group relative flex items-center gap-3 rounded-md px-3 py-2
    text-[11px] font-medium transition-all ${
      active(path)
        ? "bg-[rgba(200,176,122,0.07)]"
        : "hover:bg-[rgba(255,255,255,0.025)]"
    }`;

  const navStyle = (path) => ({
    color: active(path) ? "var(--text-primary)" : "var(--text-muted)",
  });

  const iconStyle = (path) => ({
    color: active(path) ? "var(--accent-gold)" : "var(--text-muted)",
  });

  return (
    <aside
      className="hidden h-screen w-[220px] shrink-0 flex-col border-r lg:flex"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Brand */}
      <div
        className="border-b px-5 py-5"
        style={{ borderColor: "var(--border-default)" }}
      >
        <Link to="/admin" className="flex items-center justify-between">
          <h1
            className="text-[21px] font-bold tracking-[-1.5px]"
            style={{ color: "var(--text-primary)" }}
          >
            GAMI<span style={{ color: "var(--accent-gold)" }}>X</span>
          </h1>

          <span
            className="text-[7px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--text-muted)" }}
          >
            Control
          </span>
        </Link>
      </div>

      {/* Admin Profile */}
      <div
        className="border-b px-5 py-4"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "var(--surface-elevated)",
              color: "var(--accent-gold)",
            }}
          >
            <span className="text-[10px] font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </span>

            <span
              className="absolute bottom-0 right-0 h-[6px] w-[6px] rounded-full bg-emerald-500"
              style={{ boxShadow: "0 0 0 2px var(--surface-base)" }}
            />
          </div>

          <div className="min-w-0">
            <p
              className="truncate text-[10px] font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.email?.split("@")[0]?.toUpperCase()}
            </p>

            <p
              className="mt-0.5 truncate text-[8px]"
              style={{ color: "var(--text-muted)" }}
            >
              {user?.role === "admin" ? "Super Administrator" : "Administrator"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {/* Workspace */}
        <p
          className="mb-2 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)" }}
        >
          Workspace
        </p>

        <Link to="/admin" className={navClass("/admin")} style={navStyle("/admin")}>
          {active("/admin") && (
            <span
              className="absolute left-0 h-4 w-[1px]"
              style={{ background: "var(--accent-gold)" }}
            />
          )}

          <LayoutDashboard size={15} strokeWidth={1.6} style={iconStyle("/admin")} />
          <span>Overview</span>

          {active("/admin") && (
            <span
              className="ml-auto h-[4px] w-[4px] rounded-full"
              style={{ background: "var(--accent-gold)" }}
            />
          )}
        </Link>

        {/* Management */}
        <p
          className="mb-2 mt-6 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)" }}
        >
          Management
        </p>

        <div className="space-y-0.5">
          <Link to="/admin/users" className={navClass("/admin/users")} style={navStyle("/admin/users")}>
            <Users size={15} strokeWidth={1.6} style={iconStyle("/admin/users")} />
            <span>Users</span>
          </Link>

          <Link to="/admin/teams" className={navClass("/admin/teams")} style={navStyle("/admin/teams")}>
            <ShieldCheck size={15} strokeWidth={1.6} style={iconStyle("/admin/teams")} />
            <span>Teams</span>
          </Link>

          <Link
            to="/admin/tournaments"
            className={navClass("/admin/tournaments")}
            style={navStyle("/admin/tournaments")}
          >
            <Trophy size={15} strokeWidth={1.6} style={iconStyle("/admin/tournaments")} />
            <span>Tournaments</span>
          </Link>

          {/* Tournament Child Routes */}
          {}

          <Link
            to="/admin/prize-distribution"
            className={navClass("/admin/prize-distribution")}
            style={navStyle("/admin/prize-distribution")}
          >
            <ChartPie size={15} strokeWidth={1.6} style={iconStyle("/admin/prize-distribution")} />
            <span>Prize Distribution</span>
          </Link>

          {/* Verification */}
          <button
            onClick={() => setVerificationOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px]
              font-medium text-[var(--text-muted)] transition-colors
              hover:bg-[rgba(255,255,255,0.025)]"
          >
            <BadgeCheck size={15} strokeWidth={1.6} />
            <span className="flex-1 text-left">Verification</span>

            {verificationOpen ? (
              <ChevronDown size={13} strokeWidth={1.6} />
            ) : (
              <ChevronRight size={13} strokeWidth={1.6} />
            )}
          </button>

          {verificationOpen && (
            <div className="ml-4 space-y-0.5 border-l pl-3">
              <Link
                to="/admin/verification/screenshots"
                className={navClass("/admin/verification/screenshots")}
                style={navStyle("/admin/verification/screenshots")}
              >
                <span>Screenshots</span>
              </Link>

              <Link
                to="/admin/verification/kyc"
                className={navClass("/admin/verification/kyc")}
                style={navStyle("/admin/verification/kyc")}
              >
                <span>KYC</span>
              </Link>

              <Link
                to="/admin/verification/teams"
                className={navClass("/admin/verification/teams")}
                style={navStyle("/admin/verification/teams")}
              >
                <span>Team Verification</span>
              </Link>
            </div>
          )}
        </div>

        {/* Communication */}
        <p
          className="mb-2 mt-6 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)" }}
        >
          Communication
        </p>

        <div className="space-y-0.5">
          <Link
            to="/admin/feedbacks"
            className={navClass("/admin/feedbacks")}
            style={navStyle("/admin/feedbacks")}
          >
            <MessageSquare size={15} strokeWidth={1.5} style={iconStyle("/admin/feedbacks")} />
            <span>Feedbacks</span>
          </Link>

          <Link
            to="/admin/complaints"
            className={navClass("/admin/complaints")}
            style={navStyle("/admin/complaints")}
          >
            <FileWarning size={15} strokeWidth={1.5} style={iconStyle("/admin/complaints")} />
            <span>Complaints</span>
          </Link>

          <Link
            to="/admin/announcements"
            className={navClass("/admin/announcements")}
            style={navStyle("/admin/announcements")}
          >
            <Megaphone size={15} strokeWidth={1.5} style={iconStyle("/admin/announcements")} />
            <span>Announcements</span>
          </Link>
        </div>

        {/* Platform */}
        <p
          className="mb-2 mt-6 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)" }}
        >
          Platform
        </p>

        <div className="space-y-0.5">
          <Link
            to="/admin/rewards"
            className={navClass("/admin/rewards")}
            style={navStyle("/admin/rewards")}
          >
            <Gift size={15} strokeWidth={1.5} style={iconStyle("/admin/rewards")} />
            <span>Rewards & Coupons</span>
          </Link>

          <Link
            to="/admin/wallet"
            className={navClass("/admin/wallet")}
            style={navStyle("/admin/wallet")}
          >
            <WalletCards size={15} strokeWidth={1.5} style={iconStyle("/admin/wallet")} />
            <span>Wallet Management</span>
          </Link>

          <Link
            to="/admin/roles"
            className={navClass("/admin/roles")}
            style={navStyle("/admin/roles")}
          >
            <UserCog size={15} strokeWidth={1.5} style={iconStyle("/admin/roles")} />
            <span>Roles & Permissions</span>
          </Link>

          <Link
            to="/admin/activity"
            className={navClass("/admin/activity")}
            style={navStyle("/admin/activity")}
          >
            <ClipboardList size={15} strokeWidth={1.5} style={iconStyle("/admin/activity")} />
            <span>Activity Logs</span>
          </Link>

          <Link
            to="/admin/settings"
            className={navClass("/admin/settings")}
            style={navStyle("/admin/settings")}
          >
            <Settings size={15} strokeWidth={1.5} style={iconStyle("/admin/settings")} />
            <span>System Settings</span>
          </Link>
        </div>
      </nav>

      {/* Support */}
      <div
        className="border-t px-4 py-4"
        style={{ borderColor: "var(--border-default)" }}
      >
        <Link
          to="/admin/support"
          className="group flex items-center gap-2.5 rounded-md px-2 py-2
            transition-colors hover:bg-[rgba(255,255,255,0.025)]"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{
              background: "rgba(200,176,122,0.07)",
              color: "var(--accent-gold)",
            }}
          >
            <Headphones size={14} strokeWidth={1.5} />
          </div>

          <div className="flex-1">
            <p
              className="text-[10px] font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Support
            </p>

            <p
              className="mt-0.5 text-[8px]"
              style={{ color: "var(--text-muted)" }}
            >
              Contact the team
            </p>
          </div>

          <ChevronRight
            size={12}
            strokeWidth={1.5}
            style={{ color: "var(--text-muted)" }}
          />
        </Link>
      </div>
    </aside>
  );
}