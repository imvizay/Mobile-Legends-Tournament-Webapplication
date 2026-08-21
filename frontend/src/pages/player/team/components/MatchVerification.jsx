import React from "react";
import { Check, CloudUpload, Eye, ShieldCheck } from "lucide-react";

export default function MatchVerification({ match }) {
    const completedProofs = match.games.filter((game) => game.proof);

    const allProofsUploaded =
        completedProofs.length === match.games.length;

    return (
        <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                        Match Verification
                    </p>

                    <h2 className="mt-1 text-sm font-semibold">
                        {match.stage} · {match.round}
                    </h2>
                </div>

                <span className="text-[9px] font-semibold text-[var(--text-muted)]">
                    {completedProofs.length} / {match.games.length} Proofs
                </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {match.games.map((game) => (
                    <ProofCard
                        key={game.id}
                        game={game}
                    />
                ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border-default)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-semibold">
                        {allProofsUploaded
                            ? "All match proofs uploaded"
                            : "Match result pending"}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                        {allProofsUploaded
                            ? "Your result is ready for verification."
                            : "Upload proof for every game before submitting."}
                    </p>
                </div>

                <button
                    disabled={!allProofsUploaded}
                    className="h-9 rounded-lg bg-[var(--accent-gold)] px-5 text-[9px] font-bold uppercase tracking-[0.1em] text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Submit Match Result
                </button>
            </div>
        </section>
    );
}

function ProofCard({ game }) {
    return (
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] px-3 py-2.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em]">
                    Round {game.number}
                </span>

                {game.verified && (
                    <span className="flex items-center gap-1 text-[8px] font-semibold text-emerald-600">
                        <ShieldCheck size={11} />
                        Verified
                    </span>
                )}
            </div>

            {game.proof ? (
                <div className="p-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black/5">
                        <img
                            src={game.proof}
                            alt={`Round ${game.number} proof`}
                            className="h-full w-full object-cover"
                        />

                        <button className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                            <Eye size={12} />
                        </button>
                    </div>

                    <button className="mt-2 w-full text-[8px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Replace Screenshot
                    </button>
                </div>
            ) : (
                <button className="m-2 flex aspect-video w-[calc(100%-16px)] flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)]">
                    <CloudUpload size={20} strokeWidth={1.5} />

                    <span className="mt-2 text-[9px] font-semibold">
                        Upload Screenshot
                    </span>

                    <span className="mt-0.5 text-[7px]">
                        PNG / JPG · Max 10MB
                    </span>
                </button>
            )}
        </div>
    );
}