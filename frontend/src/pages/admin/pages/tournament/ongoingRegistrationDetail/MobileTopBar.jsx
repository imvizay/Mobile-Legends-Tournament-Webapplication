import React from "react";
import { ArrowLeft } from "lucide-react";


const MobileTopBar = ({
    tournament,
    onBack,
}) => {

    return (
        <div className="fixed inset-x-0 top-0 z-50 flex h-12 items-center border-b border-[var(--border-subtle)] bg-[var(--surface-base)]/95 px-3 backdrop-blur-md sm:hidden">

            <button
                type="button"
                onClick={onBack ?? (() => window.history.back())}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)]"
                aria-label="Go back"
            >
                <ArrowLeft size={17} />
            </button>

            <div className="ml-2 min-w-0">

                <p className="text-[10px] font-semibold text-[var(--text-primary)]">
                    Tournament Registration
                </p>

                <p className="truncate text-[7px] text-[var(--text-muted)]">
                    {tournament.tournament_name}
                </p>

            </div>

        </div>
    );
};

export default MobileTopBar;