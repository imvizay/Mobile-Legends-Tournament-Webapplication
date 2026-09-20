import React, { useRef, useState } from "react";
import { ArrowLeft, UsersRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { OngoingRegistrationHeader } from "../ongoingRegistrationDetail/OngoingRegDetailHeader";
import { tournamentService } from "../../../../../services/admin/tournament_service";
import AllTeamsSection from "../ongoingRegistrationDetail/AllTeams";

function OngoingRegistrationDetailsLayout() {
    const { ongoingTournamentRegistrationId } = useParams();
    const [openMenu, setOpenMenu] = useState(null);
    const actionRefs = useRef({});

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["tournament-registration-detail", ongoingTournamentRegistrationId],
        queryFn: () => tournamentService.ongoingTournamentRegistrationDetail(ongoingTournamentRegistrationId),
        enabled: !!ongoingTournamentRegistrationId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });

    if (isPending) return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--text-muted)]">Loading registration...</div>;

    if (isError) return <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-red-500">{error?.message || "Failed to load registration."}</div>;

    const tournament = data?.tournament;
    const registrations = data?.registrations ?? [];
    const entryFee = tournament?.entry_fee ?? 0;

    return (
        <section className="flex h-screen min-h-0 w-full flex-col bg-[var(--bg-canvas)]">
            <header className="sticky top-0 z-40 shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface-base)]/95 backdrop-blur-md">
                <div className="flex h-11 items-center gap-2 px-2.5 sm:h-[62px] sm:gap-2.5 sm:px-5">
                    <button type="button" onClick={() => window.history.back()} className="flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] sm:size-8 sm:rounded-lg" aria-label="Go back">
                        <ArrowLeft size={15} className="sm:size-[16px]" />
                    </button>

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <h1 className="truncate text-[10px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[15px]">Registration Details</h1>
                            <span className="hidden shrink-0 rounded-md bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[6px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] sm:inline-flex sm:text-[7px]">Admin</span>
                        </div>

                        <div className="mt-0.5 hidden min-w-0 items-center gap-1.5 text-[8px] text-[var(--text-muted)] sm:flex">
                            <UsersRound size={10} className="shrink-0" />
                            <span className="truncate">Manage registered teams and registration status</span>
                            {tournament?.tournament_name && <><span className="shrink-0 text-[var(--border-default)]">/</span><span className="truncate">{tournament.tournament_name}</span></>}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-1.5 py-1 sm:gap-1.5 sm:rounded-lg sm:px-2.5 sm:py-1.5">
                        <span className="text-[9px] font-semibold leading-none text-[var(--text-primary)] sm:text-[11px]">{registrations.length}</span>
                        <span className="text-[6px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)] sm:text-[7px] sm:tracking-[0.08em]">Teams</span>
                    </div>
                </div>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
                <div className="w-full px-2 pb-6 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
                    <OngoingRegistrationHeader tournament={tournament} onBack={() => window.history.back()} />

                    <div className="mt-1 sm:mt-2">
                        <AllTeamsSection registration={registrations} entryFee={entryFee} openMenu={openMenu} setOpenMenu={setOpenMenu} actionRefs={actionRefs} />
                    </div>
                </div>
            </main>
        </section>
    );
}

export default OngoingRegistrationDetailsLayout;