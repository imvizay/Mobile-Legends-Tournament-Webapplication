import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/admin/common/AdminSidebar";

function AdminLayout() {
    return (
        <section className="flex h-screen w-full overflow-hidden" style={{ background: "var(--bg-canvas)" }}>

            <AdminSidebar />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

                <main className="min-h-0 min-w-0 flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-4">

                    <Outlet />

                </main>

            </div>

        </section>
    );
}

export default AdminLayout;