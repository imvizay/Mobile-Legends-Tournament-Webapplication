import React from "react"
import { CloudUpload, ImagePlus, Trophy, WalletCards, Upload } from "lucide-react"

const TournamentMedia = () => {
    return (
        <div className="space-y-4">

            {/* Tournament Media */}
            <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

                {/* Section Header */}
                <div className="flex items-start gap-3 border-b px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                        <ImagePlus size={14} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[13px] font-semibold tracking-[-0.1px]" style={{ color: "var(--text-primary)" }}>
                                Tournament Media
                            </h2>

                            <span className="hidden rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider sm:inline-flex" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                                Visuals
                            </span>
                        </div>

                        <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Add the visual assets players will see across the platform.
                        </p>
                    </div>

                </div>

                {/* Media Content */}
                <div className="space-y-5 p-4 sm:p-5">

                    {/* Background */}
                    <div>

                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                                Tournament Background
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.65fr]">

                            {/* Background Upload */}
                            <div className="space-y-1.5">

                                <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                    Background Image
                                    <span style={{ color: "var(--accent-gold)" }}>*</span>
                                </label>

                                <label className="group flex min-h-[126px] cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 transition-colors hover:border-[var(--accent-gold)]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                                        <CloudUpload size={18} strokeWidth={1.6} />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                                            Upload background image
                                        </p>

                                        <p className="mt-1 text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                            Use a high-quality image that represents the tournament atmosphere.
                                        </p>

                                        <p className="mt-2 text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>
                                            PNG · JPG · WEBP · Max 5MB
                                        </p>

                                    </div>

                                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" />

                                </label>

                            </div>

                            {/* Background Recommendation */}
                            <div className="hidden rounded-lg border px-4 py-3 lg:block" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>

                                <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                                    Recommended
                                </p>

                                <p className="mt-2 text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                                    1920 × 1080px
                                </p>

                                <p className="mt-1 text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                    Landscape images work best for tournament pages and promotional surfaces.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Banner */}
                    <div>

                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                                Tournament Banner
                            </span>
                        </div>

                        <div className="space-y-1.5">

                            <label className="flex items-center gap-2 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Banner / Thumbnail

                                <span className="text-[9px] font-normal" style={{ color: "var(--text-muted)" }}>
                                    Optional
                                </span>
                            </label>

                            <label className="flex min-h-[96px] cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 transition-colors hover:border-[var(--accent-gold)]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--surface-base)", color: "var(--text-muted)" }}>
                                    <Upload size={16} strokeWidth={1.6} />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                                        Upload promotional banner
                                    </p>

                                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                                        Recommended 1200 × 628px · JPG, PNG or WEBP
                                    </p>

                                </div>

                                <span className="hidden rounded-md border px-2.5 py-1.5 text-[9px] font-medium sm:inline-flex" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
                                    Browse
                                </span>

                                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" />

                            </label>

                        </div>

                    </div>

                </div>

            </section>


            {/* Prize & Rewards */}
            <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

                {/* Section Header */}
                <div className="flex items-start gap-3 border-b px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                        <Trophy size={14} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">

                        <div className="flex items-center gap-2">

                            <h2 className="text-[13px] font-semibold tracking-[-0.1px]" style={{ color: "var(--text-primary)" }}>
                                Prize & Rewards
                            </h2>

                            <span className="hidden rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider sm:inline-flex" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                                Rewards
                            </span>

                        </div>

                        <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Define the prize pool and how rewards will be distributed.
                        </p>

                    </div>

                </div>

                {/* Prize Content */}
                <div className="space-y-5 p-4 sm:p-5">

                    {/* Prize Summary */}
                    <div>

                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                                Prize Distribution
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                            {[
                                ["Total Prize Pool", "50,000"],
                                ["Winner", "30,000"],
                                ["Runner-up", "12,000"],
                            ].map(([label, value]) => (

                                <div key={label} className="space-y-1.5">

                                    <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                        {label}

                                        {label === "Total Prize Pool" && (
                                            <span style={{ color: "var(--accent-gold)" }}>*</span>
                                        )}
                                    </label>

                                    <div className="relative">

                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            defaultValue={value}
                                            className="h-9 w-full rounded-lg border bg-transparent pl-8 pr-3 text-xs font-medium outline-none transition-colors focus:border-[var(--accent-gold)]"
                                            style={{
                                                borderColor: "var(--border-default)",
                                                color: "var(--text-primary)",
                                            }}
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Reward Note */}
                    <div className="flex items-start gap-3 rounded-lg border px-3.5 py-3" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>

                        <WalletCards size={15} strokeWidth={1.6} className="mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />

                        <div>

                            <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>
                                Prize distribution
                            </p>

                            <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                Make sure the distributed rewards do not exceed the total prize pool.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    )
}

export default TournamentMedia