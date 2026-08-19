import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, UserRound, Mail, Gamepad2, Crown, CalendarDays, Eye, Pencil, Ban, Trash2, X, Plus, UsersRound, } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../../services/user.service";

const USERS_PER_PAGE = 10;

function AdminUsers() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [membershipFilter, setMembershipFilter] = useState("all");
    const [openMenu, setOpenMenu] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 12 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState(null);

    const { data: userQuery, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: userService.getUsers,
    });

    const users = useMemo(
        () => Array.isArray(userQuery?.data) ? userQuery.data : userQuery?.data || [],
        [userQuery]
    );

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                !query ||
                user.username?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.mlbb_id?.toString().includes(query);

            const matchesStatus =
                statusFilter === "all" || user.status === statusFilter;

            const isMember = Boolean(user.is_membership_active);

            const matchesMembership =
                membershipFilter === "all" ||
                (membershipFilter === "active" && isMember) ||
                (membershipFilter === "inactive" && !isMember);

            return matchesSearch && matchesStatus && matchesMembership;
        });
    }, [users, search, statusFilter, membershipFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(start, start + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "active").length;
    const inactiveUsers = users.filter((user) => user.status !== "active").length;
    const subscribedUsers = users.filter((user) => user.is_membership_active).length;

    const firstRecord = filteredUsers.length ? (currentPage - 1) * USERS_PER_PAGE + 1 : 0;
    const lastRecord = Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length);

    const resetPage = () => setCurrentPage(1);

    const handleSearch = (value) => {
        setSearch(value);
        resetPage();
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        resetPage();
    };

    const handleMembershipChange = (value) => {
        setMembershipFilter(value);
        resetPage();
    };

    const handleMenuToggle = (event, userId) => {
        if (openMenu === userId) {
            setOpenMenu(null);
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const menuHeight = 178;
        const spacing = 6;
        const openUp = window.innerHeight - rect.bottom < menuHeight + spacing;

        setMenuPosition({
            top: openUp ? rect.top - menuHeight - spacing : rect.bottom + spacing,
            right: Math.max(12, window.innerWidth - rect.right),
        });

        setOpenMenu(userId);
    };



    if (isLoading) {
        return (
            <section className="flex min-h-0 flex-1 items-center justify-center">
                <span className="text-xs text-[var(--text-muted)]">Loading users...</span>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="flex min-h-0 flex-1 items-center justify-center">
                <span className="text-xs text-red-500">Failed to load users.</span>
            </section>
        );
    }

    return (
        <>
            <section className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">

                {/* HEADER */}
                <header className="shrink-0 px-2 pb-2 pt-1.5 sm:px-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-[17px] font-semibold tracking-tight text-[var(--text-primary)]">Users</h1>
                                <span className="rounded-md border border-[var(--border-default)] bg-[var(--glass-navbar)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--text-muted)]">{totalUsers}</span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">Manage player accounts, memberships and access.</p>
                        </div>

                        <button type="button" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold shadow-sm transition hover:opacity-90" style={{ background: "var(--action-primary-bg)", color: "var(--action-primary-text)" }}>
                            <Plus size={13} strokeWidth={2.2} />
                            Add User
                        </button>
                    </div>
                </header>

                {/* ONLY THIS AREA SCROLLS */}
                <main className="min-h-0 flex-1 overflow-y-auto lg:px-2 pb-3 sm:px-3">

                    {/* SUMMARY */}
                    <div className="mb-2 grid grid-cols-2 gap-1.5 xl:grid-cols-4">
                        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--glass-highlight)] px-2.5 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Total Users</span>
                                <UserRound size={13} className="text-[var(--text-muted)]" />
                            </div>
                            <p className="mt-1 text-base font-semibold leading-none text-[var(--text-primary)]">{totalUsers}</p>
                        </div>

                        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--glass-highlight)] px-2.5 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Active</span>
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            </div>
                            <p className="mt-1 text-base font-semibold leading-none text-emerald-500">{activeUsers}</p>
                        </div>

                        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--glass-highlight)] px-2.5 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Inactive</span>
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                            </div>
                            <p className="mt-1 text-base font-semibold leading-none text-[var(--text-primary)]">{inactiveUsers}</p>
                        </div>

                        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--glass-highlight)] px-2.5 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Membership</span>
                                <Crown size={13} className="text-[var(--accent-gold)]" />
                            </div>
                            <p className="mt-1 text-base font-semibold leading-none text-[var(--accent-gold)]">{subscribedUsers}</p>
                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--glass-highlight)]">

                        {/* TOOLBAR */}
                        <div className="flex flex-col gap-1.5 border-b border-[var(--border-default)] p-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:max-w-[430px]">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search username, email or MLBB ID..." className="h-8 w-full rounded-md border border-[var(--border-default)] bg-transparent pl-8 pr-2.5 text-[10px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--text-muted)]" />
                            </div>

                            <div className="flex gap-1.5">
                                <div className="relative">
                                    <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} className="h-8 min-w-[120px] appearance-none rounded-md border border-[var(--border-default)] bg-transparent pl-2.5 pr-7 text-[10px] text-[var(--text-secondary)] outline-none">
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                </div>

                                <div className="relative">
                                    <select value={membershipFilter} onChange={(e) => handleMembershipChange(e.target.value)} className="h-8 min-w-[125px] appearance-none rounded-md border border-[var(--border-default)] bg-transparent pl-2.5 pr-7 text-[10px] text-[var(--text-secondary)] outline-none">
                                        <option value="all">All Membership</option>
                                        <option value="active">Subscribed</option>
                                        <option value="inactive">Free</option>
                                    </select>
                                    <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                </div>

                                <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)]">
                                    <SlidersHorizontal size={14} />
                                </button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="w-10 px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">#</th>
                                        <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">User</th>
                                        <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Account</th>
                                        <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">MLBB</th>
                                        <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Status</th>
                                        <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Membership</th>
                                        <th className="px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Joined</th>
                                        <th className="w-10 px-2.5 py-2 text-right text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedUsers.length ? paginatedUsers.map((user, index) => {
                                        const isActive = user.verified ? true : false;
                                        const isMember = Boolean(user.is_membership_active);

                                        return (
                                            <tr key={user.id} className="border-b border-[var(--border-default)] last:border-0 transition hover:bg-[var(--glass-navbar)]">
                                                <td className="px-2.5 py-2 text-[10px] text-[var(--text-muted)]">{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>

                                                <td className="px-2.5 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white"><UserRound size={14} /></div>
                                                        <div className="min-w-0">
                                                            <p className="max-w-[140px] truncate text-[10px] font-semibold text-[var(--text-primary)]">{user.username || "Unknown User"}</p>
                                                            <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">ID #{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-2.5 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail size={13} className="shrink-0 text-[var(--text-muted)]" />
                                                        <div className="min-w-0">
                                                            <p className="max-w-[190px] truncate text-[10px] text-[var(--text-secondary)]">{user.email || "—"}</p>
                                                            <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">Email account</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-2.5 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Gamepad2 size={13} className="text-[var(--text-muted)]" />
                                                        <span className="text-[10px] text-[var(--text-secondary)]">{user.mlbb_id || "—"}</span>
                                                    </div>
                                                </td>

                                                <td className="px-2.5 py-2">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                                        {isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>

                                                <td className="px-2.5 py-2">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${isMember ? "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]" : "bg-[var(--glass-navbar)] text-[var(--text-muted)]"}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${isMember ? "bg-[var(--accent-gold)]" : "bg-[var(--text-muted)]"}`} />
                                                        {isMember ? "Subscribed" : "Free"}
                                                    </span>
                                                </td>

                                                <td className="px-2.5 py-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                                                        <CalendarDays size={12} className="text-[var(--text-muted)]" />
                                                        {user.created_at ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                                    </div>
                                                </td>

                                                <td className="px-2.5 py-2 text-right">
                                                    <button type="button" onClick={(e) => handleMenuToggle(e, user.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)]">
                                                        <MoreHorizontal size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-12 text-center">
                                                <UsersRound size={22} className="mx-auto mb-2 text-[var(--text-muted)]" />
                                                <p className="text-[10px] font-medium text-[var(--text-primary)]">No users found</p>
                                                <p className="mt-1 text-[9px] text-[var(--text-muted)]">Try changing your search or filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>


                        {/* PAGINATION */}
                        <div className="flex flex-col gap-2 border-t border-[var(--border-default)] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">

                            <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                                Showing <span className="font-medium text-[var(--text-secondary)]">{firstRecord}–{lastRecord}</span> of <span className="font-medium text-[var(--text-secondary)]">{filteredUsers.length}</span>
                            </p>

                            <div className="flex items-center gap-1">

                                <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8">
                                    <ChevronsLeft size={14} />
                                </button>

                                <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8">
                                    <ChevronLeft size={14} />
                                </button>

                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            if (totalPages <= 5) return true;
                                            if (page === 1 || page === totalPages) return true;
                                            return Math.abs(page - currentPage) <= 1;
                                        })
                                        .map((page, index, pages) => {
                                            const previousPage = pages[index - 1];
                                            const showEllipsis = previousPage && page - previousPage > 1;

                                            return (
                                                <React.Fragment key={page}>
                                                    {showEllipsis && <span className="flex h-7 w-6 items-center justify-center text-[10px] text-[var(--text-muted)] sm:h-8 sm:w-7 sm:text-xs">...</span>}

                                                    <button type="button" onClick={() => setCurrentPage(page)} className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-[10px] font-medium transition sm:h-8 sm:min-w-8 sm:text-xs ${currentPage === page ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] shadow-sm" : "text-[var(--text-secondary)] hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)]"}`}>
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        })}
                                </div>

                                <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8">
                                    <ChevronRight size={14} />
                                </button>

                                <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition hover:bg-[var(--glass-navbar)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8">
                                    <ChevronsRight size={14} />
                                </button>

                            </div>
                        </div>
                    </div>
                </main>
            </section>

        </>
    );
}

export default AdminUsers;