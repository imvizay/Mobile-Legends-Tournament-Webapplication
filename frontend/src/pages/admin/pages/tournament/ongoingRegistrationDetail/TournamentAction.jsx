import React from "react";

import {
    Clock3,
    Ellipsis,
    XCircle,
} from "lucide-react";


const TournamentActions = ({
    tournament,
    postpone,
    onAction,
}) => {

    return (
        <div className="mt-3 grid grid-cols-[1fr_1.35fr_32px] gap-1.5">

            <button
                type="button"
                onClick={() => postpone?.(tournament)}
                className="inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-white/20 bg-white/10 px-2 text-[8px] font-semibold text-white transition-all hover:bg-white/15"
            >
                <Clock3 size={10} />
                Postpone
            </button>


            <button
                type="button"
                onClick={() =>
                    onAction?.("cancel", tournament)
                }
                className="inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-red-500 px-2.5 text-[8px] font-bold text-white shadow-sm transition-all hover:bg-red-600"
            >
                <XCircle size={10} />
                Cancel Tournament
            </button>


            <button
                type="button"
                onClick={() =>
                    onAction?.("more", tournament)
                }
                className="flex size-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all hover:bg-white/15"
                aria-label="More tournament actions"
            >
                <Ellipsis size={15} />
            </button>

        </div>
    );
};


export default TournamentActions;