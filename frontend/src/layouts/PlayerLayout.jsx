import React from "react";
import { Outlet } from "react-router-dom";

import PlayerSidebar from "../pages/player/layouts/navigations/Sidebar";
import MobileNavbar from "../components/navigations/MobileNavbar";

import { PLAYER_DASHBOARD_NAVIGATION_LINKS } from "../utils/playerdashboard_links/playerdash_links";

function PlayerLayout() {
    return (
        <section className="grid h-dvh w-full min-w-0 overflow-hidden bg-[var(--bg-canvas)] lg:grid-cols-[240px_minmax(0,1fr)]">
            {/* Desktop Navigation */}
            <aside className="hidden min-h-0 lg:block">
                <PlayerSidebar dashboardLinks={PLAYER_DASHBOARD_NAVIGATION_LINKS} />
            </aside>

            {/* Application Content */}
            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
                {/* Mobile Navigation */}
                <div className="shrink-0 lg:hidden">
                    <MobileNavbar />
                </div>

                {/* Main Workspace */}
                <main className="bg-[var--bg-canvas)] min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-7 pt-[4.75rem] sm:px-4 md:px-3 md:pb-8 lg:px-3 lg:py-2 xl:px-2 2xl:px-12">
                    <div className="mx-auto w-full min-w-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </section>
    );
}

export default PlayerLayout;