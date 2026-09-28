import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

import { useUserContext } from "../../contexts/UserContext";

const GOLD = "var(--accent-gold)";

const managementSections = [
  {
    key: "users",
    label: "Users",
    icon: Users,
    basePath: "/admin/users",
    items: [
      ["All Users", "/admin/users"],
      ["Active Users", "/admin/users/active"],
      ["Suspended Users", "/admin/users/suspended"],
    ],
  },
  {
    key: "teams",
    label: "Teams",
    icon: ShieldCheck,
    basePath: "/admin/teams",
    items: [
      ["All Teams", "/admin/teams"],
      ["Active Teams", "/admin/teams/active"],
      ["Pending Teams", "/admin/teams/pending"],
    ],
  },
  {
    key: "tournaments",
    label: "Tournaments",
    icon: Trophy,
    basePath: "/admin/tournaments",
    items: [
      ["All Tournaments", "/admin/tournaments"],
      ["Ongoing Registration", "/admin/tournaments/ongoing-registration"],
      ["Live Tournaments", "/admin/tournaments/live-tournament"],
      ["Completed", "/admin/tournaments/completed"],
      ["Cancelled", "/admin/tournaments/cancelled"],
    ],
  },
  {
    key: "prizes",
    label: "Prize Distribution",
    icon: ChartPie,
    basePath: "/admin/prize-distribution",
    items: [
      ["Overview", "/admin/prize-distribution"],
      ["Pending Payouts", "/admin/prize-distribution/pending"],
      ["Completed Payouts", "/admin/prize-distribution/completed"],
    ],
  },
  {
    key: "verification",
    label: "Verification",
    icon: BadgeCheck,
    basePath: "/admin/verification",
    items: [
      ["Screenshots", "/admin/verification/screenshots"],
      ["KYC", "/admin/verification/kyc"],
      ["Team Verification", "/admin/verification/teams"],
    ],
  },
];

const communicationItems = [
  { label: "Feedbacks", path: "/admin/feedbacks", icon: MessageSquare },
  { label: "Complaints", path: "/admin/complaints", icon: FileWarning },
  { label: "Announcements", path: "/admin/announcements", icon: Megaphone },
];

const platformItems = [
  { label: "Rewards & Coupons", path: "/admin/rewards", icon: Gift },
  { label: "Wallet Management", path: "/admin/wallet", icon: WalletCards },
  { label: "Roles & Permissions", path: "/admin/roles", icon: UserCog },
  { label: "Activity Logs", path: "/admin/activity", icon: ClipboardList },
  { label: "System Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const { user } = useUserContext();
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);

  const isActive = (path) => location.pathname === path;
  const isSectionActive = (path) => location.pathname.startsWith(path);

  const toggleSection = (section) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  useEffect(() => {
    const activeSection = managementSections.find((section) => isSectionActive(section.basePath));
    setOpenSection(activeSection?.key || null);
  }, [location.pathname]);

  const adminName = user?.email?.split("@")[0]?.toUpperCase() || "ADMIN";

  const adminRole = user?.role === "admin" ? "Super Administrator" : "Administrator";

  return (
    <aside className="hidden h-screen w-[228px] shrink-0 flex-col border-r lg:flex" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

      {/* Brand */}
      <div className="border-b px-5 pb-4 pt-5" style={{ borderColor: "var(--border-default)" }}>
        <Link to="/admin" className="group flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-[7px]" style={{ background: "rgba(200,176,122,0.10)", border: "1px solid rgba(200,176,122,0.14)" }}>
              <span className="text-[9px] font-bold" style={{ color: GOLD }}>G</span>
            </div>

            <div>
              <h1 className="text-[18px] font-bold leading-none tracking-[-1.2px]" style={{ color: "var(--text-primary)" }}>
                GAMI<span style={{ color: GOLD }}>X</span>
              </h1>
              <p className="mt-[3px] text-[6px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                Administration
              </p>
            </div>
          </div>

          <span className="rounded-[5px] border px-1.5 py-1 text-[6px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
            Admin
          </span>
        </Link>
      </div>

      {/* Admin profile */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5 rounded-[9px] border px-2 py-2" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="relative shrink-0">
            <div className="flex size-8 items-center justify-center rounded-full" style={{ background: "var(--surface-floating)", color: GOLD }}>
              <span className="text-[9px] font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>

            <span className="absolute bottom-0 right-0 size-[6px] rounded-full bg-emerald-500" style={{ boxShadow: "0 0 0 2px var(--surface-elevated)" }} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[9px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {adminName}
            </p>

            <div className="mt-[3px] flex items-center gap-1.5">
              <span className="size-[4px] rounded-full bg-emerald-500" />
              <p className="truncate text-[7px]" style={{ color: "var(--text-muted)" }}>
                {adminRole}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 scrollbar-hide">

        <SectionLabel>Workspace</SectionLabel>

        <NavLink to="/admin" icon={LayoutDashboard} label="Overview" active={isActive("/admin")} />

        <SectionLabel className="mt-6">Management</SectionLabel>

        <div className="space-y-1">
          {managementSections.map((section) => {
            const Icon = section.icon;
            const active = isSectionActive(section.basePath);
            const expanded = openSection === section.key;

            return (
              <div key={section.key}>
                <button type="button" onClick={() => toggleSection(section.key)} className="group relative flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left transition-colors" style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)", background: active ? "rgba(200,176,122,0.055)" : "transparent" }}>
                  {active && <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full" style={{ background: GOLD }} />}

                  <Icon size={14} strokeWidth={1.6} style={{ color: active ? GOLD : "var(--text-muted)" }} />

                  <span className="flex-1 text-[10px] font-medium">{section.label}</span>

                  <span style={{ color: active ? "var(--text-secondary)" : "var(--text-muted)" }}>
                    {expanded ? <ChevronDown size={12} strokeWidth={1.7} /> : <ChevronRight size={12} strokeWidth={1.7} />}
                  </span>
                </button>

                {expanded && (
                  <div className="ml-[19px] mt-1 space-y-0.5 border-l pl-3" style={{ borderColor: "var(--border-subtle)" }}>
                    {section.items.map(([label, path]) => <SubNavLink key={path} to={path} label={label} active={isActive(path)} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <SectionLabel className="mt-6">Communication</SectionLabel>

        <div className="space-y-1">
          {communicationItems.map((item) => <NavLink key={item.path} to={item.path} icon={item.icon} label={item.label} active={isActive(item.path)} />)}
        </div>

        <SectionLabel className="mt-6">Platform</SectionLabel>

        <div className="space-y-1">
          {platformItems.map((item) => <NavLink key={item.path} to={item.path} icon={item.icon} label={item.label} active={isActive(item.path)} />)}
        </div>
      </nav>

      {/* Support */}
      <div className="border-t px-4 py-3" style={{ borderColor: "var(--border-default)" }}>
        <Link to="/admin/support" className="group flex items-center gap-2.5 rounded-[8px] px-2 py-2 transition-colors hover:bg-[rgba(255,255,255,0.025)]">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-[6px]" style={{ background: "rgba(200,176,122,0.07)", border: "1px solid rgba(200,176,122,0.10)", color: GOLD }}>
            <Headphones size={13} strokeWidth={1.6} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold" style={{ color: "var(--text-primary)" }}>Support</p>
            <p className="mt-[2px] truncate text-[7px]" style={{ color: "var(--text-muted)" }}>Contact the team</p>
          </div>

          <ChevronRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-muted)" }} />
        </Link>
      </div>
    </aside>
  );
}

function SectionLabel({ children, className = "" }) {
  return <p className={`mb-2 px-2 text-[6px] font-semibold uppercase tracking-[0.2em] ${className}`} style={{ color: "var(--text-muted)" }}>{children}</p>;
}

function NavLink({ to, icon: Icon, label, active }) {
  return (
    <Link to={to} className="group relative flex items-center gap-2.5 rounded-[7px] px-2.5 py-2 transition-colors" style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)", background: active ? "rgba(200,176,122,0.055)" : "transparent" }}>
      {active && <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full" style={{ background: GOLD }} />}
      <Icon size={14} strokeWidth={1.6} style={{ color: active ? GOLD : "var(--text-muted)" }} />
      <span className="text-[10px] font-medium">{label}</span>
      {active && <span className="ml-auto size-[4px] rounded-full" style={{ background: GOLD }} />}
    </Link>
  );
}

function SubNavLink({ to, label, active }) {
  return (
    <Link to={to} className="relative flex items-center rounded-[6px] px-2.5 py-[6px] transition-colors" style={{ color: active ? "var(--text-primary)" : "var(--text-muted)", background: active ? "rgba(200,176,122,0.045)" : "transparent" }}>
      {active && <span className="absolute -left-[14px] top-1/2 h-3 w-[2px] -translate-y-1/2 rounded-r-full" style={{ background: GOLD }} />}
      <span className="text-[9px]">{label}</span>
      {active && <span className="ml-auto size-[3px] rounded-full" style={{ background: GOLD }} />}
    </Link>
  );
}