
import { useState } from "react";
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Trophy,
  ChartPie,
  BadgeCheck,
  MessageSquare,
  FileWarning,
  Megaphone,
  Gift,
  WalletCards,
  UserCog,
  Settings,
  ClipboardList,
  Headphones,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useUserContext } from "../../../contexts/UserContext";

export default function AdminSidebar() {
  const [verificationOpen, setVerificationOpen] = useState(false);

  const { user } = useUserContext();
  const location = useLocation();

  const active = (path) => location.pathname === path;

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
        <div className="flex items-center justify-between">
          <Link to="/admin">
            <h1
              className="text-[21px] font-bold tracking-[-1.5px]"
              style={{ color: "var(--text-primary)" }}
            >
              GAMI<span style={{ color: "var(--accent-gold)" }}>X</span>
            </h1>
          </Link>

          <span
            className="text-[7px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--text-muted)" }}
          >
            Control
          </span>
        </div>
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
              style={{
                boxShadow: "0 0 0 2px var(--surface-base)",
              }}
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
              {user?.role === "admin"
                ? "Super Administrator"
                : "Administrator"}
            </p>
          </div>

          <ChevronDown
            size={13}
            strokeWidth={1.5}
            className="ml-auto"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-scrollbar flex-1 overflow-y-auto px-3 py-5">

        {/* Workspace */}
        <p
          className="mb-2 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)" }}
        >
          Workspace
        </p>

        <Link
          to="/admin"
          className={`relative mb-5 flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-colors ${
            active("/admin")
              ? "bg-[rgba(200,176,122,0.07)]"
              : "hover:bg-[rgba(255,255,255,0.025)]"
          }`}
          style={{
            color: active("/admin")
              ? "var(--text-primary)"
              : "var(--text-muted)",
          }}
        >
          {active("/admin") && (
            <span
              className="absolute left-0 h-4 w-[1px]"
              style={{ background: "var(--accent-gold)" }}
            />
          )}

          <LayoutDashboard
            size={15}
            strokeWidth={1.6}
            style={{
              color: active("/admin")
                ? "var(--accent-gold)"
                : "var(--text-muted)",
            }}
          />

          Overview

          {active("/admin") && (
            <span
              className="ml-auto h-[4px] w-[4px] rounded-full"
              style={{ background: "var(--accent-gold)" }}
            />
          )}
        </Link>

        {/* Management */}
        <div className="mb-5">

          <p className="mb-2 px-2.5 text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Management
          </p>

          <div className="space-y-0.5">

            <button className="admin-nav-item">
              <Users size={15} strokeWidth={1.6} />
              <span>Users</span>
            </button>

            <button className="admin-nav-item">
              <ShieldCheck size={15} strokeWidth={1.6} />
              <span>Teams</span>
            </button>

            <Link to='tournaments' className="admin-nav-item">
              <Trophy size={15} strokeWidth={1.6} />
              <span>Tournaments</span>
            </Link>

            <button className="admin-nav-item">
              <ChartPie size={15} strokeWidth={1.6} />
              <span>Price Distribution</span>
            </button>

            <button onClick={() => setVerificationOpen(!verificationOpen)} className="admin-nav-item">

              <BadgeCheck size={15} strokeWidth={1.6} />

              <span className="flex-1">
                Verification
              </span>

              {verificationOpen ? (
                <ChevronDown size={13} strokeWidth={1.6} />
              ) : (
                <ChevronRight size={13} strokeWidth={1.6} />
              )}

            </button>

            {verificationOpen && (
              <div className="ml-7 space-y-0.5 pt-1">

                <button className="admin-sub-item">
                  Screenshots
                </button>

                <button className="admin-sub-item">
                  KYC
                </button>

                <button className="admin-sub-item">
                  Team Verification
                </button>

            {verificationOpen ? (
              <ChevronDown size={12} strokeWidth={1.5} />
            ) : (
              <ChevronRight size={12} strokeWidth={1.5} />
            )}
          </button>

          {verificationOpen && (
            <div className="ml-7 border-l pl-3">
              <Link
                to="/admin/verification/screenshots"
                className="admin-sub-item"
              >
                Screenshots
              </Link>

              <Link
                to="/admin/verification/kyc"
                className="admin-sub-item"
              >
                KYC
              </Link>

              <Link
                to="/admin/verification/teams"
                className="admin-sub-item"
              >
                Team Verification
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
            className="admin-nav-item"
          >
            <MessageSquare size={15} strokeWidth={1.5} />
            Feedbacks
          </Link>

          <Link
            to="/admin/complaints"
            className="admin-nav-item"
          >
            <FileWarning size={15} strokeWidth={1.5} />
            Complaints
          </Link>

          <Link
            to="/admin/announcements"
            className="admin-nav-item"
          >
            <Megaphone size={15} strokeWidth={1.5} />
            Announcements
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
            className="admin-nav-item"
          >
            <Gift size={15} strokeWidth={1.5} />
            Rewards & Coupons
          </Link>

          <Link
            to="/admin/wallet"
            className="admin-nav-item"
          >
            <WalletCards size={15} strokeWidth={1.5} />
            Wallet Management
          </Link>

          <Link
            to="/admin/roles"
            className="admin-nav-item"
          >
            <UserCog size={15} strokeWidth={1.5} />
            Roles & Permissions
          </Link>

          <Link
            to="/admin/settings"
            className="admin-nav-item"
          >
            <Settings size={15} strokeWidth={1.5} />
            System Settings
          </Link>

          <Link
            to="/admin/activity"
            className="admin-nav-item"
          >
            <ClipboardList size={15} strokeWidth={1.5} />
            Activity Logs
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
          className="group flex items-center gap-2.5 rounded-md px-2 py-2"
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

