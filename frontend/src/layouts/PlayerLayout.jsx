// hooks and state
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';

// Desktop Navbar
import PlayerSidebar from '../components/playerLayout/Sidebar';

// Mobile Navbar
import MobileNavbar from '../components/navigations/MobileNavbar';
import { teamService } from '../services/team_service';

import { PLAYER_DASHBOARD_NAVIGATION_LINKS } from '../utils/playerdashboard_links/playerdash_links';


function PlayerLayout() {

  

  



    return (
        <section className="grid h-screen w-full min-w-0 overflow-hidden bg-[var(--bg-canvas)] lg:grid-cols-[220px_minmax(0,1fr)]">

            {/* Desktop Sidebar */}
            <aside className="hidden min-h-0 lg:block">
                <PlayerSidebar
                    dashboardLinks={PLAYER_DASHBOARD_NAVIGATION_LINKS}
                />
            </aside>

            {/* Right */}
            <div className="flex min-w-0 min-h-0 flex-col overflow-hidden">

                {/* Desktop Header
                <div className="hidden lg:block">
                    <TopbarHeader /> 
                </div> */}

                {/* Mobile Header */}
                <div className="lg:hidden">
                    <MobileNavbar />
                </div>

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pt-20 pb-6 md:px-6 lg:px-8 lg:pt-6">
                    <Outlet />
                </main>

            </div>

        </section>
    );
}

export default PlayerLayout

