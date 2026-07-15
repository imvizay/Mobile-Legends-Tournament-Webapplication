import React from "react";
import { Outlet } from "react-router-dom";

// Desktop Navbar
<<<<<<< Updated upstream
import PlayerSidebar from '../components/playerLayout/Sidebar';
=======
import PlayerSidebar from "../components/playerdashboard/Sidebar";
>>>>>>> Stashed changes

// Mobile Navbar
import MobileNavbar from "../components/navigations/MobileNavbar";

import { PLAYER_DASHBOARD_NAVIGATION_LINKS } from "../utils/playerdashboard_links/playerdash_links";

import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../contexts/UserContext";
function PlayerLayout() {
<<<<<<< Updated upstream

  

  



=======
    
>>>>>>> Stashed changes
    return (
        <section className="grid h-screen w-full min-w-0 overflow-hidden bg-[var(--bg-canvas)] lg:grid-cols-[220px_minmax(0,1fr)]">

            {/* Desktop Sidebar */}
            <aside className="hidden min-h-0 lg:block">
                <PlayerSidebar
                    dashboardLinks={PLAYER_DASHBOARD_NAVIGATION_LINKS}
                />
            </aside>


            {/* Right Content Area */}
            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">

                {/* Mobile Header */}
                <div className="shrink-0 lg:hidden">
                    <MobileNavbar />
                </div>

<<<<<<< Updated upstream
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pt-20 pb-6 md:px-6 lg:px-8 lg:pt-6">
                    <Outlet />
=======

                {/* Dashboard Body */}
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">

                    <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-5 md:px-6 lg:px-7 lg:py-6 xl:px-8">

                        <Outlet />

                    </div>

>>>>>>> Stashed changes
                </main>

            </div>

        </section>
    );
}

export default PlayerLayout;