import React, { useEffect, useState } from "react";
import { Check, FileImage, ImagePlus, ShieldCheck, Upload, X } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function MatchProofUploads({ roundName = "Round 1", totalMatches = 3, onProofChange }) {
    const [proofs, setProofs] = useState(() => Array.from({ length: totalMatches }, (_, index) => ({ matchNumber: index + 1, file: null, preview: null, error: "" })));

    useEffect(() => {
        return () => {
            proofs.forEach((proof) => {
                if (proof.preview) URL.revokeObjectURL(proof.preview);
            });
        };
    }, [proofs]);

    const updateProof = (index, changes) => {
        setProofs((currentProofs) => {
            const updatedProofs = currentProofs.map((proof, proofIndex) => proofIndex === index ? { ...proof, ...changes } : proof);

            onProofChange?.(updatedProofs);

            return updatedProofs;
        });
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            updateProof(index, { file: null, preview: null, error: "Only image files are accepted." });
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            updateProof(index, { file: null, preview: null, error: "Screenshot must not exceed 5 MB." });
            return;
        }

        const previousPreview = proofs[index]?.preview;

        if (previousPreview) URL.revokeObjectURL(previousPreview);

        const preview = URL.createObjectURL(file);

        updateProof(index, { file, preview, error: "" });
    };

    const removeProof = (index) => {
        const currentProof = proofs[index];

        if (currentProof?.preview) URL.revokeObjectURL(currentProof.preview);

        updateProof(index, { file: null, preview: null, error: "" });
    };

    const uploadedCount = proofs.filter((proof) => proof.file).length;
    const isComplete = uploadedCount === totalMatches;

    return (
        <section className="w-full">
            <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent-gold)" }}>
                        Match Verification
                    </p>

                    <h2 className="mt-1 text-lg font-bold tracking-[-0.03em] sm:text-xl" style={{ color: "var(--headline-primary)" }}>
                        Match Evidence
                    </h2>

                    <p className="mt-1 text-[9px] sm:text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Upload the final result screenshot for each completed game.
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: isComplete ? "var(--accent-gold)" : "var(--text-muted)" }}>
                        {uploadedCount}/{totalMatches} Submitted
                    </p>

                    <p className="mt-1 text-[7px] font-medium uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                        {roundName}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-[18px] border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                <div className="border-b px-3 py-3 sm:px-4" style={{ borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--surface-elevated) 45%, var(--surface-base))" }}>
                    <div className="flex items-start gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md border" style={{ background: "color-mix(in srgb, var(--accent-gold) 6%, transparent)", borderColor: "color-mix(in srgb, var(--accent-gold) 14%, var(--border-subtle))" }}>
                            <ShieldCheck size={13} style={{ color: "var(--accent-gold)" }} />
                        </div>

                        <div>
                            <p className="text-[9px] font-bold" style={{ color: "var(--text-primary)" }}>
                                Submit clear and complete match results
                            </p>

                            <p className="mt-0.5 text-[8px] leading-4 sm:text-[9px]" style={{ color: "var(--text-muted)" }}>
                                Screenshots may be reviewed before the tournament result is confirmed.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                        {proofs.map((proof, index) => <ProofUploadSlot key={proof.matchNumber} proof={proof} index={index} onChange={handleFileChange} onRemove={removeProof} />)}
                    </div>
                </div>

                <div className="border-t px-3 py-2.5 sm:px-4" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px]" style={{ color: "var(--text-muted)" }}>
                        <FileImage size={11} style={{ color: "var(--accent-gold)" }} />

                        <span>PNG, JPG or WEBP · Maximum file size 5 MB</span>
                    </div>
                </div>
            </div>
        </section>
    );
}


function ProofUploadSlot({ proof, index, onChange, onRemove }) {
    const inputId = `match-proof-${proof.matchNumber}`;
    const hasProof = Boolean(proof.file);

    return (
        <article className="min-w-0 overflow-hidden rounded-xl border" style={{ background: "var(--surface-elevated)", borderColor: hasProof ? "color-mix(in srgb, var(--accent-gold) 22%, var(--border-default))" : "var(--border-subtle)" }}>
            <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: hasProof ? "var(--accent-gold)" : "var(--text-muted)" }}>
                        Game {proof.matchNumber}
                    </span>
                </div>

                {hasProof ? (
                    <span className="flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent-gold)" }}>
                        <Check size={10} strokeWidth={2.5} />
                        Added
                    </span>
                ) : (
                    <span className="text-[7px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                        Required
                    </span>
                )}
            </div>

            <div className="p-3">
                {proof.preview ? (
                    <div className="relative overflow-hidden rounded-lg border" style={{ borderColor: "var(--border-subtle)" }}>
                        <img src={proof.preview} alt={`Game ${proof.matchNumber} proof`} className="h-32 w-full object-cover sm:h-36" />

                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/70 px-2.5 py-2 backdrop-blur-sm">
                            <p className="min-w-0 truncate text-[7px] font-medium text-white/75">
                                {proof.file?.name}
                            </p>

                            <button type="button" onClick={() => onRemove(index)} aria-label={`Remove game ${proof.matchNumber} proof`} className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-white/80 transition-transform hover:-translate-y-px hover:bg-white/15">
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <label htmlFor={inputId} className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-3 text-center transition-colors hover:bg-[var(--surface-base)] sm:h-36" style={{ borderColor: "var(--border-default)" }}>
                        <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: "color-mix(in srgb, var(--accent-gold) 6%, transparent)" }}>
                            <ImagePlus size={15} style={{ color: "var(--accent-gold)" }} />
                        </div>

                        <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-secondary)" }}>
                            Upload Result
                        </p>

                        <p className="mt-1 text-[7px]" style={{ color: "var(--text-muted)" }}>
                            Screenshot required
                        </p>
                    </label>
                )}

                <input id={inputId} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={(event) => onChange(event, index)} />

                {proof.preview && (
                    <label htmlFor={inputId} className="mt-2 flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border text-[8px] font-bold uppercase tracking-[0.08em] transition-transform hover:-translate-y-px" style={{ color: "var(--text-secondary)", background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                        <Upload size={11} />
                        Replace
                    </label>
                )}

                {proof.error && (
                    <p className="mt-2 text-[7px] font-semibold text-red-600">
                        {proof.error}
                    </p>
                )}
            </div>
        </article>
    );
}