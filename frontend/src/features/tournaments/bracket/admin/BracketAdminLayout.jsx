import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { bracketService } from "../services/bracketService";
import Loader from "../../../../components/feedback/Loader";
import { toast } from "react-toastify";

function BracketAdminLayout() {
    const navigate = useNavigate();
    const { tournamentId } = useParams();

    const { data: initialBracket, isPending, isError } = useQuery({
        queryKey: ['tournament-competetive-teams', tournamentId],
        queryFn: () => bracketService.getTournamentDetail(tournamentId)
    })

    if (isPending) {
        return <Loader />
    }
    if (isError) {
        toast.error("Error loading approved tournament details")
        return null
    }

    const teams = initialBracket?.data?.teams
    const tournament = initialBracket?.data?.tournament
    console.log("Layout teams", teams)

    return (
        <section className="flex h-screen flex-col bg-[var(--bg-canvas)]">
            {/* Fixed */}
            <header className="shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-2">
                <div className="mx-auto flex max-w-[1600px] items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin`, {
                                replace: true
                            })
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] transition-all hover:-translate-y-px hover:text-[var(--headline-primary)]"
                    >
                        <ArrowLeft size={14} strokeWidth={2} />
                    </button>

                    <div className="min-w-0 leading-none">
                        <h1 className="truncate text-[13px] font-semibold tracking-[-0.01em] text-[var(--headline-primary)]">
                            Create Tournament Bracket
                        </h1>

                        <p className="mt-1 truncate text-[9px] text-[var(--text-muted)]">
                            Configure rounds, assign teams and prepare matches.
                        </p>
                    </div>
                </div>
            </header>

            {/* Remaining viewport */}
            <main className="mx-auto min-h-0 w-full max-w-[1600px] flex-1 px-3 py-4 sm:px-6 sm:py-5">
                <Outlet context={{ tournament, teams }} />
            </main>
        </section>
    );
}

export default BracketAdminLayout