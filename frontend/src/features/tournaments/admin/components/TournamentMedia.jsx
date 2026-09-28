import React, { useEffect, useState } from "react"
import { CloudUpload, ImagePlus, Trophy, WalletCards, Upload, Image as ImageIcon, RefreshCw } from "lucide-react"


const SectionLabel = ({ children }) => {

    return (
        <div className="mb-3 flex items-center gap-2">

            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                {children}
            </span>

        </div>
    )
}


const FieldLabel = ({ children, required = false }) => {

    return (
        <label className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>

            {children}

            {required && <span style={{ color: "var(--accent-gold)" }}>*</span>}

        </label>
    )
}


const PercentageInput = ({ name, value, placeholder, label, handleInputChange, required = false }) => {

    return (
        <div className="space-y-1.5">

            <FieldLabel required={required}>
                {label}
            </FieldLabel>


            <div className="relative">

                <input type="number" name={name} value={value || ""} onChange={handleInputChange} min="0" max="100" placeholder={placeholder} className="h-9 w-full rounded-lg border bg-transparent px-3 pr-8 text-[11px] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    %
                </span>

            </div>

        </div>
    )
}


const MediaUpload = ({ title, description, recommendedSize, required = false, preview, inputName, handleInputChange, variant = "background" }) => {

    const hasPreview = Boolean(preview)


    return (
        <div className="space-y-2.5">

            <div className="flex items-start justify-between gap-3">

                <div>

                    <FieldLabel required={required}>
                        {title}
                    </FieldLabel>

                    <p className="mt-0.5 text-[9px]" style={{ color: "var(--text-muted)" }}>
                        {description}
                    </p>

                </div>


                <span className="shrink-0 rounded-md border px-1.5 py-1 text-[8px] font-medium" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                    {recommendedSize}
                </span>

            </div>


            <label className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors hover:border-[var(--accent-gold)] ${variant === "background" ? "h-44" : "h-36"}`} style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>


                {hasPreview ? (

                    <>

                        <img src={preview} alt={title} className="absolute inset-0 h-full w-full object-cover" />

                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />


                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">

                            <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[9px] font-medium" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>

                                <RefreshCw size={11} />

                                Replace image

                            </div>

                        </div>


                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md border px-2 py-1" style={{ background: "rgba(0,0,0,0.55)", borderColor: "rgba(255,255,255,0.12)" }}>

                            <ImageIcon size={10} style={{ color: "var(--accent-gold)" }} />

                            <span className="text-[8px] text-white">
                                Preview
                            </span>

                        </div>

                    </>

                ) : (

                    <div className="px-4 text-center">


                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: variant === "background" ? "rgba(200,176,122,0.10)" : "var(--surface-base)", color: variant === "background" ? "var(--accent-gold)" : "var(--text-muted)" }}>

                            {variant === "background" ? <CloudUpload size={17} strokeWidth={1.6} /> : <Upload size={16} strokeWidth={1.6} />}

                        </div>


                        <p className="mt-2 text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
                            Upload {variant === "background" ? "background" : "banner"}
                        </p>


                        <p className="mt-1 text-[9px]" style={{ color: "var(--text-muted)" }}>
                            PNG, JPG or WEBP · Max 5MB
                        </p>


                        <p className="mt-2 text-[8px]" style={{ color: "var(--text-muted)" }}>
                            Click to browse
                        </p>

                    </div>

                )}


                <input type="file" name={inputName} onChange={handleInputChange} accept="image/png,image/jpeg,image/webp" className="hidden" />

            </label>

        </div>
    )
}


const TournamentMedia = ({ data, setData }) => {

    const [backgroundPreview, setBackgroundPreview] = useState(null)
    const [bannerPreview, setBannerPreview] = useState(null)


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


            if (name === "background_image") {

                setBackgroundPreview(prev => {

                    if (prev) URL.revokeObjectURL(prev)

                    return previewURL

                })

            }


            if (name === "banner_image") {

                setBannerPreview(prev => {

                    if (prev) URL.revokeObjectURL(prev)

                    return previewURL

                })

            }


            setData(prev => ({
                ...prev,
                [name]: files[0],
            }))


            return

        }


        setData(prev => ({
            ...prev,
            [name]: value,
        }))

    }


    const winnerShare = Number(data.winner_percent || 0)
    const runnerUpShare = Number(data.runner_up_percent || 0)
    const totalDistribution = winnerShare + runnerUpShare


    return (
        <div className="space-y-4">


            {/* Tournament Media */}

            <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>


                {/* Header */}

                <div className="flex items-start gap-3 border-b px-4 py-3.5" style={{ borderColor: "var(--border-subtle)" }}>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>

                        <ImagePlus size={14} strokeWidth={1.7} />

                    </div>


                    <div className="min-w-0">

                        <div className="flex items-center gap-2">

                            <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                                Tournament Media
                            </h2>


                            <span className="rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                                Visuals
                            </span>

                        </div>


                        <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                            Add the visuals players will see across the tournament experience.
                        </p>

                    </div>

                </div>


                <div className="p-4">


                    <SectionLabel>
                        Tournament Visuals
                    </SectionLabel>


                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        <MediaUpload title="Background Image" description="Primary visual for the tournament page." recommendedSize="1920 × 1080" required preview={backgroundPreview} inputName="background_image" handleInputChange={handleInputChange} variant="background" />

                        <MediaUpload title="Tournament Banner" description="Optional promotional banner for tournament discovery." recommendedSize="1200 × 628" preview={bannerPreview} inputName="banner_image" handleInputChange={handleInputChange} variant="banner" />

                    </div>

                </div>

            </section>



            {/* Prize & Platform */}

            <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>


                {/* Header */}

                <div className="flex items-start gap-3 border-b px-4 py-3.5" style={{ borderColor: "var(--border-subtle)" }}>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>

                        <Trophy size={14} strokeWidth={1.7} />

                    </div>


                    <div className="min-w-0">

                        <div className="flex items-center gap-2">

                            <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                                Prize & Platform
                            </h2>


                            <span className="rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                                Economy
                            </span>

                        </div>


                        <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                            Configure platform fees and prize distribution.
                        </p>

                    </div>

                </div>


                <div className="space-y-5 p-4">


                    {/* Platform Fee */}

                    <div>

                        <SectionLabel>
                            Platform Fee
                        </SectionLabel>


                        <div className="max-w-[220px]">

                            <PercentageInput name="platform_fee_percent" value={data.platform_fee_percent} placeholder="10" label="Platform Fee" handleInputChange={handleInputChange} required />

                        </div>


                        <p className="mt-2 text-[9px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Percentage deducted from the tournament revenue according to your platform policy.
                        </p>

                    </div>



                    {/* Prize Distribution */}

                    <div>

                        <div className="mb-3 flex items-center justify-between gap-3">

                            <SectionLabel>
                                Prize Distribution
                            </SectionLabel>


                            <div className="flex items-center gap-1.5">

                                <span className="text-[8px]" style={{ color: "var(--text-muted)" }}>
                                    Total
                                </span>


                                <span className="rounded-md border px-1.5 py-0.5 text-[9px] font-semibold" style={{ background: totalDistribution === 100 ? "rgba(200,176,122,0.10)" : "var(--surface-elevated)", borderColor: totalDistribution === 100 ? "rgba(200,176,122,0.25)" : "var(--border-subtle)", color: totalDistribution === 100 ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                                    {totalDistribution}%
                                </span>

                            </div>

                        </div>


                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <PercentageInput name="winner_percent" value={data.winner_percent} placeholder="70" label="Winner Share" handleInputChange={handleInputChange} />

                            <PercentageInput name="runner_up_percent" value={data.runner_up_percent} placeholder="30" label="Runner-up Share" handleInputChange={handleInputChange} />

                        </div>


                        <div className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ background: "var(--surface-elevated)", borderColor: totalDistribution === 100 ? "rgba(200,176,122,0.20)" : "var(--border-subtle)" }}>

                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                                <Trophy size={10} />
                            </span>


                            <p className="text-[9px] leading-relaxed" style={{ color: "var(--text-muted)" }}>

                                {totalDistribution === 0
                                    ? "Define how the available prize pool should be distributed."
                                    : totalDistribution === 100
                                        ? "Prize distribution is balanced and ready for the tournament."
                                        : `Current distribution is ${totalDistribution}%. The total should equal 100%.`
                                }

                            </p>

                        </div>

                    </div>



                    {/* Information */}

                    <div className="flex items-start gap-3 rounded-lg border px-3.5 py-3" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>

                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>

                            <WalletCards size={12} />

                        </div>


                        <div>

                            <p className="text-[10px] font-semibold" style={{ color: "var(--text-primary)" }}>
                                Prize pool calculation
                            </p>


                            <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                The final reward pool is calculated from completed paid registrations after applicable platform fees and charges are processed.
                            </p>

                        </div>

                    </div>


                </div>

            </section>

        </div>
    )
}


export default TournamentMedia