import React, { useEffect, useState } from "react"
import { CloudUpload, ImagePlus, Trophy, WalletCards, Upload } from "lucide-react"

const TournamentMedia = ({ data, setData }) => {

    const [backgroundPreview, setBgImgUrl] = useState(null)
    const [bannerPreview, setBannerImgUrl] = useState(null)

    useEffect(() => {

        return () => {
            if (backgroundPreview) URL.revokeObjectURL(backgroundPreview)
            if (bannerPreview) URL.revokeObjectURL(bannerPreview)
        }

    }, [backgroundPreview, bannerPreview])


    const handleInputChange = (e) => {

        const { name, value, files } = e.target

        if (files?.[0]) {
            const previewURL = URL.createObjectURL(files[0])
            if (name == "background_image") {
                setBgImgUrl(prev => {
                    if (prev) URL.revokeObjectURL(prev)
                    return previewURL
                })
            }
            if (name == "banner_image") {
                setBannerImgUrl(prev => {
                    if (prev) URL.revokeObjectURL(prev)
                    return previewURL
                })
            }
        }

        setData((prev) => ({
            ...prev, [name]: files?.length ? files?.[0] : value
        }))
    }

    return (
        <div className="space-y-4">

            {/* Tournament Media */}
            <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                <div className="flex items-start gap-3 border-b px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                        <ImagePlus size={14} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Tournament Media</h2>
                            <span className="hidden rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider sm:inline-flex" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>Visuals</span>
                        </div>

                        <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>Add the images players will see on the tournament page.</p>
                    </div>
                </div>

                <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">

                    {/* Background */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Background Image <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>
                            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>1920 × 1080</span>
                        </div>

                        <label className="group relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors hover:border-[var(--accent-gold)]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                            {backgroundPreview ? (
                                <>
                                    <img src={backgroundPreview} alt="Tournament background" className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="relative rounded-md border px-3 py-1.5 text-[9px] font-medium opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                        Change image
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                                        <CloudUpload size={17} strokeWidth={1.6} />
                                    </div>

                                    <p className="mt-2 text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Upload background</p>
                                    <p className="mt-1 text-[9px]" style={{ color: "var(--text-muted)" }}>PNG, JPG or WEBP · Max 5MB</p>
                                </div>
                            )}

                            <input name="background_image" onChange={handleInputChange} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" />
                        </label>
                    </div>

                    {/* Banner */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Tournament Banner
                            </label>
                            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Optional · 1200 × 628</span>
                        </div>

                        <label className="group relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors hover:border-[var(--accent-gold)]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                            {bannerPreview ? (
                                <>
                                    <img src={bannerPreview} alt="Tournament banner" className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="relative rounded-md border px-3 py-1.5 text-[9px] font-medium opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                        Change banner
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--surface-base)", color: "var(--text-muted)" }}>
                                        <Upload size={16} strokeWidth={1.6} />
                                    </div>

                                    <p className="mt-2 text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Upload banner</p>
                                    <p className="mt-1 text-[9px]" style={{ color: "var(--text-muted)" }}>PNG, JPG or WEBP · Max 5MB</p>
                                </div>
                            )}

                            <input type="file" name="banner_image" onChange={handleInputChange} accept="image/png,image/jpeg,image/webp" className="hidden" />
                        </label>
                    </div>

                </div>
            </section>


            {/* Prize & Platform */}
            <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                <div className="flex items-start gap-3 border-b px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                        <Trophy size={14} strokeWidth={1.7} />
                    </div>

                    <div>
                        <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Prize & Platform</h2>
                        <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>Set the entry fee and prize distribution.</p>
                    </div>
                </div>

                <div className="space-y-5 p-4 sm:p-5">

                    {/* Platform Fee */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Tournament Fees</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                    Platform Fee
                                    <span className="ml-1" style={{ color: "var(--accent-gold)" }}>*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="platform_fee_percent"
                                        value={data.platform_fee_percent || ""}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                        placeholder="10"
                                        className="h-9 w-full rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none focus:border-[var(--accent-gold)]"
                                        style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prize Distribution */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Prize Distribution</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Winner Share</label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="winner_percent"
                                        value={data.winner_percent || ""}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                        placeholder="70"
                                        className="h-9 w-full rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none focus:border-[var(--accent-gold)]"
                                        style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>%</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Runner-up Share</label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="runner_up_percent"
                                        value={data.runner_up_percent || ""}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="100"
                                        placeholder="30"
                                        className="h-9 w-full rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none focus:border-[var(--accent-gold)]"
                                        style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>%</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="flex items-start gap-3 rounded-lg border px-3.5 py-3" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>
                        <WalletCards size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />

                        <div>
                            <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>Prize pool is calculated automatically</p>
                            <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                The final prize depends on paid registrations. Platform fees and applicable charges are deducted before distributing the remaining pool.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    )
}

export default TournamentMedia