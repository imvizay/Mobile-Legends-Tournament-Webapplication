import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { NavLink } from "react-router-dom";

function PlayerSidebar({ dashboardLinks }) {
    return (
        <aside className="flex h-screen w-[232px] shrink-0 flex-col border-r border-[var(--border-default)] bg-[var(--surface-base)]">

            {/* Brand */}
            <div className="flex h-[76px] shrink-0 items-center border-b border-[var(--border-default)] px-5">
                <div className="min-w-0">
                    <h1 className="text-[17px] font-black tracking-[0.22em] text-[var(--text-primary)]">
                        GAMIX
                    </h1>

                    <p className="mt-0.5 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.17em] text-[var(--text-muted)]">
                        Compete · Battle · Conquer
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-scrollbar flex-1 overflow-y-auto px-3 py-4">

                {/* General */}
                <div className="mb-4">
                    <h3 className="mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        General
                    </h3>

                    <NavLink
                        to="/player"
                        end
                        className={({ isActive }) => `group relative flex h-9 items-center gap-3 rounded-[5px] px-2.5 text-[13px] font-medium transition-colors duration-150 ${isActive ? "bg-[var(--surface-elevated)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"}`}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span className="absolute left-0 h-4 w-[2px] rounded-full bg-[var(--accent-gold)]" />
                                )}

                                <span className="flex w-4 shrink-0 items-center justify-center">
                                    <Home className={`${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"} size-4 transition-colors duration-150`} strokeWidth={1.8} />
                                </span>

                                <span className="min-w-0 flex-1 truncate">
                                    Home
                                </span>

                                {isActive && (
                                    <ChevronRight className="size-3 shrink-0 text-[var(--text-muted)]" strokeWidth={1.8} />
                                )}
                            </>
                        )}
                    </NavLink>
                </div>

                {/* Navigation Groups */}
                {dashboardLinks.map((group) => (
                    <div key={group.section} className="mb-4">

                        <h3 className="mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            {group.section}
                        </h3>

                        <div className="space-y-0.5">
                            {group.links.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) => `group relative flex h-9 items-center gap-3 rounded-[5px] px-2.5 text-[13px] font-medium transition-colors duration-150 ${isActive ? "bg-[var(--surface-elevated)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <span className="absolute left-0 h-4 w-[2px] rounded-full bg-[var(--accent-gold)]" />
                                                )}

                                                <span className="flex w-4 shrink-0 items-center justify-center">
                                                    <Icon className={`${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"} size-4 transition-colors duration-150`} strokeWidth={1.8} />
                                                </span>

                                                <span className="min-w-0 flex-1 truncate">
                                                    {link.name}
                                                </span>

                                                {isActive && (
                                                    <ChevronRight className="size-3 shrink-0 text-[var(--text-muted)]" strokeWidth={1.8} />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Player */}
            <div className="shrink-0 border-t border-[var(--border-default)] px-4 py-3">
                <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-[11px] font-semibold text-[var(--text-secondary)]">
                        V
                    </div>

                    {/* Player Info */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                            Vijay
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            Mythic Player
                        </p>
                    </div>

                    <ChevronRight className="size-3.5 shrink-0 text-[var(--text-muted)]" strokeWidth={1.8} />

                </div>
            </div>

        </aside>
    );
}

export default PlayerSidebar;