import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ShieldCheck, Trophy, ChartPie, BadgeCheck, MessageSquare, FileWarning, Megaphone, Gift, WalletCards, UserCog, Settings, ClipboardList, Headphones, ChevronDown, ChevronRight } from "lucide-react";

import { useUserContext } from "../../../contexts/UserContext";

export default function AdminSidebar() {

  const { user } = useUserContext();
  const location = useLocation();

  const [openSection, setOpenSection] = useState(null);

  const isActive = (path) => location.pathname === path;
  const isSectionActive = (path) => location.pathname.startsWith(path);

  const toggleSection = (section) => {
    setOpenSection((current) => current === section ? null : section);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/admin/users")) setOpenSection("users");
    else if (location.pathname.startsWith("/admin/teams")) setOpenSection("teams");
    else if (location.pathname.startsWith("/admin/tournaments")) setOpenSection("tournaments");
    else if (location.pathname.startsWith("/admin/prize-distribution")) setOpenSection("prizes");
    else if (location.pathname.startsWith("/admin/verification")) setOpenSection("verification");
  }, [location.pathname]);

  return (
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r lg:flex" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

      {/* Brand */}
      <div className="border-b px-5 py-5" style={{ borderColor: "var(--border-default)" }}>
        <Link to="/admin" className="flex items-center justify-between">
          <h1 className="text-[21px] font-bold tracking-[-1.5px]" style={{ color: "var(--text-primary)" }}>GAMI<span style={{ color: "var(--accent-gold)" }}>X</span></h1>
          <span className="text-[7px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Control</span>
        </Link>
      </div>

      {/* Admin Profile */}
      <div className="border-b px-5 py-4" style={{ borderColor: "var(--border-default)" }}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--surface-elevated)", color: "var(--accent-gold)" }}>
            <span className="text-[10px] font-semibold">{user?.email?.charAt(0).toUpperCase()}</span>
            <span className="absolute bottom-0 right-0 h-[6px] w-[6px] rounded-full bg-emerald-500" style={{ boxShadow: "0 0 0 2px var(--surface-base)" }} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>{user?.email?.split("@")[0]?.toUpperCase()}</p>
            <p className="mt-0.5 truncate text-[8px]" style={{ color: "var(--text-muted)" }}>{user?.role === "admin" ? "Super Administrator" : "Administrator"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">

        {/* Workspace */}
        <p className="mb-2 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Workspace</p>

        <Link to="/admin" className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin") ? "var(--text-primary)" : "var(--text-muted)" }}>
          {isActive("/admin") && <span className="absolute left-0 h-4 w-[1px]" style={{ background: "var(--accent-gold)" }} />}
          <LayoutDashboard size={15} strokeWidth={1.6} style={{ color: isActive("/admin") ? "var(--accent-gold)" : "var(--text-muted)" }} />
          <span>Overview</span>
          {isActive("/admin") && <span className="ml-auto h-[4px] w-[4px] rounded-full" style={{ background: "var(--accent-gold)" }} />}
        </Link>

        {/* Management */}
        <p className="mb-2 mt-6 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Management</p>

        <div className="space-y-0.5">

          {/* Users */}
          <button onClick={() => toggleSection("users")} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isSectionActive("/admin/users") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isSectionActive("/admin/users") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <Users size={15} strokeWidth={1.6} style={{ color: isSectionActive("/admin/users") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span className="flex-1 text-left">Users</span>
            {openSection === "users" ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>

          {openSection === "users" && (
            <div className="ml-4 space-y-0.5 border-l pl-3" style={{ borderColor: "var(--border-default)" }}>
              <Link to="/admin/users" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/users") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/users") ? "var(--text-primary)" : "var(--text-muted)" }}>All Users</Link>
              <Link to="/admin/users/active" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/users/active") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/users/active") ? "var(--text-primary)" : "var(--text-muted)" }}>Active Users</Link>
              <Link to="/admin/users/suspended" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/users/suspended") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/users/suspended") ? "var(--text-primary)" : "var(--text-muted)" }}>Suspended Users</Link>
            </div>
          )}

          {/* Teams */}
          <button onClick={() => toggleSection("teams")} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isSectionActive("/admin/teams") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isSectionActive("/admin/teams") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <ShieldCheck size={15} strokeWidth={1.6} style={{ color: isSectionActive("/admin/teams") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span className="flex-1 text-left">Teams</span>
            {openSection === "teams" ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>

          {openSection === "teams" && (
            <div className="ml-4 space-y-0.5 border-l pl-3" style={{ borderColor: "var(--border-default)" }}>
              <Link to="/admin/teams" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/teams") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/teams") ? "var(--text-primary)" : "var(--text-muted)" }}>All Teams</Link>
              <Link to="/admin/teams/active" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/teams/active") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/teams/active") ? "var(--text-primary)" : "var(--text-muted)" }}>Active Teams</Link>
              <Link to="/admin/teams/pending" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/teams/pending") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/teams/pending") ? "var(--text-primary)" : "var(--text-muted)" }}>Pending Teams</Link>
            </div>
          )}

          {/* Tournaments */}
          <button onClick={() => toggleSection("tournaments")} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isSectionActive("/admin/tournaments") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isSectionActive("/admin/tournaments") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <Trophy size={15} strokeWidth={1.6} style={{ color: isSectionActive("/admin/tournaments") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span className="flex-1 text-left">Tournaments</span>
            {openSection === "tournaments" ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>

          {openSection === "tournaments" && (
            <div className="ml-4 space-y-0.5 border-l pl-3" style={{ borderColor: "var(--border-default)" }}>
              <Link to="/admin/tournaments" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/tournaments") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/tournaments") ? "var(--text-primary)" : "var(--text-muted)" }}>All Tournaments</Link>
              <Link to="/admin/tournaments/published" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/tournaments/published") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/tournaments/published") ? "var(--text-primary)" : "var(--text-muted)" }}>Published</Link>
              <Link to="/admin/tournaments/drafts" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/tournaments/drafts") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/tournaments/drafts") ? "var(--text-primary)" : "var(--text-muted)" }}>Drafts</Link>
              <Link to="/admin/tournaments/ongoing" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/tournaments/ongoing") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/tournaments/ongoing") ? "var(--text-primary)" : "var(--text-muted)" }}>Ongoing</Link>
              <Link to="/admin/tournaments/completed" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/tournaments/completed") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/tournaments/completed") ? "var(--text-primary)" : "var(--text-muted)" }}>Completed</Link>
              <Link to="/admin/tournaments/cancelled" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/tournaments/cancelled") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/tournaments/cancelled") ? "var(--text-primary)" : "var(--text-muted)" }}>Cancelled</Link>
            </div>
          )}

          {/* Prize Distribution */}
          <button onClick={() => toggleSection("prizes")} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isSectionActive("/admin/prize-distribution") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isSectionActive("/admin/prize-distribution") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <ChartPie size={15} strokeWidth={1.6} style={{ color: isSectionActive("/admin/prize-distribution") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span className="flex-1 text-left">Prize Distribution</span>
            {openSection === "prizes" ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>

          {openSection === "prizes" && (
            <div className="ml-4 space-y-0.5 border-l pl-3" style={{ borderColor: "var(--border-default)" }}>
              <Link to="/admin/prize-distribution" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/prize-distribution") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/prize-distribution") ? "var(--text-primary)" : "var(--text-muted)" }}>Overview</Link>
              <Link to="/admin/prize-distribution/pending" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/prize-distribution/pending") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/prize-distribution/pending") ? "var(--text-primary)" : "var(--text-muted)" }}>Pending Payouts</Link>
              <Link to="/admin/prize-distribution/completed" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/prize-distribution/completed") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/prize-distribution/completed") ? "var(--text-primary)" : "var(--text-muted)" }}>Completed Payouts</Link>
            </div>
          )}

          {/* Verification */}
          <button onClick={() => toggleSection("verification")} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isSectionActive("/admin/verification") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isSectionActive("/admin/verification") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <BadgeCheck size={15} strokeWidth={1.6} style={{ color: isSectionActive("/admin/verification") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span className="flex-1 text-left">Verification</span>
            {openSection === "verification" ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>

          {openSection === "verification" && (
            <div className="ml-4 space-y-0.5 border-l pl-3" style={{ borderColor: "var(--border-default)" }}>
              <Link 
              to="/admin/verification/screenshots" 
              className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors 
              ${isActive("/admin/verification/screenshots") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} 
              style={{ color: isActive("/admin/verification/screenshots") ? "var(--text-primary)" : "var(--text-muted)" }}>Screenshots</Link>

              <Link to="/admin/verification/kyc" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/verification/kyc") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/verification/kyc") ? "var(--text-primary)" : "var(--text-muted)" }}>KYC</Link>
              <Link to="/admin/verification/teams" className={`block rounded-md px-3 py-1.5 text-[10px] transition-colors ${isActive("/admin/verification/teams") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/verification/teams") ? "var(--text-primary)" : "var(--text-muted)" }}>Team Verification</Link>
            </div>
          )}

        </div>

        {/* Communication */}
        <p className="mb-2 mt-6 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Communication</p>

        <div className="space-y-0.5">
          <Link to="/admin/feedbacks" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/feedbacks") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/feedbacks") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <MessageSquare size={15} strokeWidth={1.5} style={{ color: isActive("/admin/feedbacks") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Feedbacks</span>
          </Link>

          <Link to="/admin/complaints" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/complaints") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/complaints") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <FileWarning size={15} strokeWidth={1.5} style={{ color: isActive("/admin/complaints") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Complaints</span>
          </Link>

          <Link to="/admin/announcements" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/announcements") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/announcements") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <Megaphone size={15} strokeWidth={1.5} style={{ color: isActive("/admin/announcements") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Announcements</span>
          </Link>
        </div>

        {/* Platform */}
        <p className="mb-2 mt-6 px-2 text-[7px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Platform</p>

        <div className="space-y-0.5">
          <Link to="/admin/rewards" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/rewards") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/rewards") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <Gift size={15} strokeWidth={1.5} style={{ color: isActive("/admin/rewards") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Rewards & Coupons</span>
          </Link>

          <Link to="/admin/wallet" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/wallet") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/wallet") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <WalletCards size={15} strokeWidth={1.5} style={{ color: isActive("/admin/wallet") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Wallet Management</span>
          </Link>

          <Link to="/admin/roles" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/roles") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/roles") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <UserCog size={15} strokeWidth={1.5} style={{ color: isActive("/admin/roles") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Roles & Permissions</span>
          </Link>

          <Link to="/admin/activity" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/activity") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/activity") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <ClipboardList size={15} strokeWidth={1.5} style={{ color: isActive("/admin/activity") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>Activity Logs</span>
          </Link>

          <Link to="/admin/settings" className={`flex items-center gap-3 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${isActive("/admin/settings") ? "bg-[rgba(200,176,122,0.07)]" : "hover:bg-[rgba(255,255,255,0.025)]"}`} style={{ color: isActive("/admin/settings") ? "var(--text-primary)" : "var(--text-muted)" }}>
            <Settings size={15} strokeWidth={1.5} style={{ color: isActive("/admin/settings") ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span>System Settings</span>
          </Link>
        </div>

      </nav>

      {/* Support */}
      <div className="border-t px-4 py-4" style={{ borderColor: "var(--border-default)" }}>
        <Link to="/admin/support" className="group flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-[rgba(255,255,255,0.025)]">
          <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.07)", color: "var(--accent-gold)" }}>
            <Headphones size={14} strokeWidth={1.5} />
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>Support</p>
            <p className="mt-0.5 text-[8px]" style={{ color: "var(--text-muted)" }}>Contact the team</p>
          </div>

          <ChevronRight size={12} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
        </Link>
      </div>

    </aside>
  )
}