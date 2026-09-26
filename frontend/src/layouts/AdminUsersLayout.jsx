import React from "react";
import { Outlet } from "react-router-dom";

function AdminUsersLayout() {
    return (
        <div className="min-h-screen">
            <main className="min-h-0 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminUsersLayout;