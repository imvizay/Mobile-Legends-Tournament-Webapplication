import React, { useEffect, useState } from "react"
import { ChevronDown, Gamepad2, Tag, Users, Trophy, Hash, AlignLeft } from "lucide-react"

const SectionLabel = ({ children }) => {
    return (
        <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-5" style={{ background: "var(--accent-gold)" }} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>{children}</span>
        </div>
    )
}


const FieldLabel = ({ children, required = false, optional = false }) => {
    return (
        <label className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
            {children}
            {required && <span style={{ color: "var(--accent-gold)" }}>*</span>}
            {optional && <span className="text-[9px] font-normal" style={{ color: "var(--text-muted)" }}>Optional</span>}
        </label>
    )
}


const TournamentBasicInfo = ({ data, setData }) => {

    const [length, setLength] = useState(0)

    useEffect(() => {
        setLength(data.description?.length || 0)
    }, [data.description])


    const handleInputChange = (e) => {
        const { name, value } = e.target

        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    return (
        <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

            {/* Header */}

            <div className="flex items-start gap-3 border-b px-4 py-3.5 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                    <Trophy size={15} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                            Tournament Details
                        </h2>

                        <span className="rounded border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                            Required
                        </span>

                    </div>

                    <p className="mt-0.5 text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Set the identity and competition structure.
                    </p>

                </div>

            </div>


            <div className="space-y-6 p-4 sm:p-5">


                {/* Identity */}

                <div>

                    <SectionLabel>Tournament Identity</SectionLabel>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div className="space-y-1.5">

                            <FieldLabel required>Tournament Name</FieldLabel>

                            <input type="text" name="tournament_name" value={data.tournament_name || ""} onChange={handleInputChange} placeholder="e.g. Gamix Summer Cup" className="h-10 w-full rounded-lg border bg-transparent px-3 text-[11px] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

                        </div>


                        <div className="space-y-1.5">

                            <FieldLabel optional>Tournament Slug</FieldLabel>

                            <div className="relative">

                                <Hash size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <input type="text" name="tournament_slug" value={data.tournament_slug || ""} onChange={handleInputChange} placeholder="gamix-summer-cup" className="h-10 w-full rounded-lg border bg-transparent pl-8 pr-3 text-[11px] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Configuration */}

                <div>

                    <SectionLabel>Competition Setup</SectionLabel>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        <div className="space-y-1.5">

                            <FieldLabel required>Game</FieldLabel>

                            <div className="relative">

                                <Gamepad2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <select name="game_name" value={data.game_name || "mlbb"} onChange={handleInputChange} className="h-10 w-full appearance-none rounded-lg border bg-transparent pl-9 pr-9 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="mlbb">Mobile Legends: Bang Bang</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                            </div>

                        </div>


                        <div className="space-y-1.5">

                            <FieldLabel required>Tournament Format</FieldLabel>

                            <div className="relative">

                                <Tag size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <select name="tournament_type" value={data.tournament_type || ""} onChange={handleInputChange} className="h-10 w-full appearance-none rounded-lg border bg-transparent pl-9 pr-9 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select format</option>
                                    <option value="single_elimination">Single Elimination</option>
                                    <option value="double_elimination">Double Elimination</option>
                                    <option value="round_robin">Round Robin</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                            </div>

                        </div>


                        <div className="space-y-1.5">

                            <FieldLabel required>Team Format</FieldLabel>

                            <div className="relative">

                                <Users size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <select name="team_format" value={data.team_format || "5vs5"} onChange={handleInputChange} className="h-10 w-full appearance-none rounded-lg border bg-transparent pl-9 pr-9 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="5vs5">5 vs 5</option>
                                    <option value="3vs3">3 vs 3</option>
                                    <option value="1vs1">1 vs 1</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                            </div>

                        </div>


                        <div className="grid grid-cols-2 gap-3">

                            <div className="space-y-1.5">

                                <FieldLabel required>Min Teams</FieldLabel>

                                <input type="number" name="min_teams" value={data.min_teams || ""} onChange={handleInputChange} min="1" max="99" placeholder="8" className="h-10 w-full rounded-lg border bg-transparent px-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

                            </div>


                            <div className="space-y-1.5">

                                <FieldLabel required>Max Teams</FieldLabel>

                                <input type="number" name="max_teams" value={data.max_teams || ""} onChange={handleInputChange} min="1" max="99" placeholder="32" className="h-10 w-full rounded-lg border bg-transparent px-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Description */}

                <div>

                    <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">
                            <span className="h-px w-5" style={{ background: "var(--accent-gold)" }} />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Description</span>
                        </div>

                        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Optional</span>

                    </div>


                    <div className="relative">

                        <AlignLeft size={14} className="pointer-events-none absolute left-3 top-3" style={{ color: "var(--text-muted)" }} />

                        <textarea rows="5" name="description" value={data.description || ""} onChange={handleInputChange} maxLength={3000} placeholder="Describe the format, eligibility, important rules or anything players should know..." className="w-full resize-none rounded-lg border bg-transparent py-3 pl-9 pr-3 text-[11px] leading-relaxed outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

                    </div>


                    <div className="mt-1.5 flex justify-end">

                        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                            {length} / 3000
                        </span>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default TournamentBasicInfo