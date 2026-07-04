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

  return (
    <aside className="hidden h-screen w-[215px] shrink-0 flex-col border-r lg:flex" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

      {/* Brand */}
      <div className="shrink-0 px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-['Inter'] text-[22px] font-bold tracking-[-1.5px]" style={{ color: "var(--text-primary)" }}>
            GAMI<span style={{ color: "var(--accent-gold)" }}>X</span>
          </h1>

          <span className="text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Control
          </span>
        </div>
      </div>

      {/* Profile */}
      <div className="shrink-0 px-5 pb-5">
        <div className="flex items-center gap-2.5">

          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--surface-elevated)", color: "var(--accent-gold)" }}>
            <span className="text-[11px] font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </span>

            <span className="absolute bottom-0 right-0 h-[7px] w-[7px] rounded-full bg-emerald-500 ring-2 ring-[var(--surface-base)]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {user?.email?.split("@")[0]?.toUpperCase()}
            </p>

            <p className="mt-0.5 truncate text-[9px]" style={{ color: "var(--text-muted)" }}>
              {user?.role === "admin" ? "Super Administrator" : "Administrator"}
            </p>
          </div>

          <button className="ml-auto flex h-6 w-6 items-center justify-center rounded-md" style={{ color: "var(--text-muted)" }}>
            <ChevronDown size={13} strokeWidth={1.6} />
          </button>

        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-4">

        {/* Workspace */}
        <div className="mb-5">

          <p className="mb-2 px-2.5 text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Workspace
          </p>

          <button className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[12px] font-semibold" style={{ background: "rgba(200,176,122,0.10)", color: "var(--text-primary)" }}>

            <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full" style={{ background: "var(--accent-gold)" }} />

            <LayoutDashboard size={15} strokeWidth={1.7} style={{ color: "var(--accent-gold)" }} />

            <span>Overview</span>

            <span className="ml-auto h-[5px] w-[5px] rounded-full" style={{ background: "var(--accent-gold)" }} />

          </button>

        </div>

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

              </div>
            )}

          </div>

        </div>

        {/* Communication */}
        <div className="mb-5">

          <p className="mb-2 px-2.5 text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Communication
          </p>

          <div className="space-y-0.5">

            <button className="admin-nav-item">
              <MessageSquare size={15} strokeWidth={1.6} />
              <span>Feedbacks</span>
            </button>

            <button className="admin-nav-item">
              <FileWarning size={15} strokeWidth={1.6} />
              <span>Complaints</span>
            </button>

            <button className="admin-nav-item">
              <Megaphone size={15} strokeWidth={1.6} />
              <span>Announcements</span>
            </button>

          </div>

        </div>

        {/* Platform */}
        <div>

          <p className="mb-2 px-2.5 text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Platform
          </p>

          <div className="space-y-0.5">

            <button className="admin-nav-item">
              <Gift size={15} strokeWidth={1.6} />
              <span>Rewards & Coupons</span>
            </button>

            <button className="admin-nav-item">
              <WalletCards size={15} strokeWidth={1.6} />
              <span>Wallet Management</span>
            </button>

            <button className="admin-nav-item">
              <UserCog size={15} strokeWidth={1.6} />
              <span>Roles & Permissions</span>
            </button>

            <button className="admin-nav-item">
              <Settings size={15} strokeWidth={1.6} />
              <span>System Settings</span>
            </button>

            <button className="admin-nav-item">
              <ClipboardList size={15} strokeWidth={1.6} />
              <span>Activity Logs</span>
            </button>

          </div>

        </div>

      </nav>

      {/* Support */}
      <div className="shrink-0 px-5 pb-5 pt-3">

        <button className="flex w-full items-center gap-2.5 text-left">

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(200,176,122,0.09)", color: "var(--accent-gold)" }}>
            <Headphones size={14} strokeWidth={1.6} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Support
            </p>

            <p className="mt-0.5 truncate text-[8px]" style={{ color: "var(--text-muted)" }}>
              Contact the team
            </p>

          </div>

          <ChevronRight size={13} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />

        </button>

      </div>

    </aside>
  );
}