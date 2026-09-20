/*
Kick Out Player
Redesign Player Card
Make Roster/Remove Roster Actions
*/


import { AlertTriangle, X } from "lucide-react";

export default function KickOutConfirmationDialog({
    isOpen,
    player,
    isLoading = false,
    onCancel,
    onConfirm,
}) {
    if (!isOpen || !player) return null;

    const displayName =
        player.username ||
        player.name ||
        player.email?.split("@")[0] ||
        "this player";

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            {/* Modal backdrop */}
            <button
                type="button"
                aria-label="Close confirmation"
                onClick={isLoading ? undefined : onCancel}
                className="absolute inset-0 cursor-default bg-slate-950/35 backdrop-blur-[3px]"
            />

            {/* Dialog */}
            <div className="relative z-10 w-full sm:max-w-[390px] lg:max-w-[390px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5 shadow-2xl">
                {/* Close */}
                <button
                    type="button"
                    onClick={isLoading ? undefined : onCancel}
                    disabled={isLoading}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-50"
                >
                    <X size={16} strokeWidth={1.7} />
                </button>

                {/* Warning */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500">
                        <AlertTriangle size={21} strokeWidth={1.8} />
                    </div>

                    <h2 className="mt-4 text-[15px] font-semibold text-[var(--text-primary)]">
                        Kick Out Player?
                    </h2>

                    <p className="mt-2 max-w-[290px] text-[10px] leading-5 text-[var(--text-secondary)]">
                        Are you sure you want to remove{" "}
                        <span className="font-semibold text-[var(--text-primary)]">
                            {displayName}
                        </span>{" "}
                        from your team?
                    </p>

                    <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                        This action cannot be undone easily.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="h-10 rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] text-[10px] font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="h-10 rounded-xl bg-red-600 text-[10px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Removing..." : "Kick Out Player"}
                    </button>
                </div>
            </div>
        </div>
    );
}