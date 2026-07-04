import React, { useEffect, useState } from "react"
import { ChevronDown, Gamepad2, Tag, Users, Trophy } from "lucide-react"

const TournamentBasicInfo = ({ data, setData }) => {

    const [len, setLength] = useState(0)

    useEffect(() => {
        setLength(data.description?.length || 0)
    }, [data.description])


    const handleInputChange = (e) => {
        const { name, value } = e.target

        setData(prev => ({
            ...prev, [name]: value
        }))
    }


    return (
        <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>


            <div className="flex items-start gap-3 border-b px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                    <Trophy size={14} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[13px] font-semibold tracking-[-0.1px]" style={{ color: "var(--text-primary)" }}>
                            Basic Information
                        </h2>

                        <span className="hidden rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider sm:inline-flex" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                            Required
                        </span>
                    </div>

                    <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Define the identity and core structure of your tournament.
                    </p>
                </div>

            </div>


            <div className="space-y-5 p-4 sm:p-5">


                <div>

                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                            Tournament Identity
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Tournament Name
                                <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>

                            <input
                                type="text"
                                name="tournament_name"
                                value={data?.tournament_name || ""}
                                onChange={handleInputChange}
                                placeholder="e.g. Gamix Summer Cup"
                                className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]"
                                style={{
                                    borderColor: "var(--border-default)",
                                    color: "var(--text-primary)",
                                }}
                            />

                        </div>

                        <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Tournament Slug
                                <span className="text-[9px] font-normal" style={{ color: "var(--text-muted)" }}>
                                    Optional
                                </span>
                            </label>

                            <input
                                type="text"
                                placeholder="gamix-summer-cup"
                                className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]"
                                style={{
                                    borderColor: "var(--border-default)",
                                    color: "var(--text-primary)",
                                }}
                            />

                        </div>

                    </div>

                </div>


                <div>

                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                            Tournament Configuration
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Game
                                <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>

                            <div className="relative">

                                <Gamepad2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <select
                                    name="game_name"
                                    value={data.game_name || "Mobile Legends: Bang Bang"}
                                    onChange={handleInputChange}
                                    className="h-9 w-full appearance-none rounded-lg border bg-transparent pl-9 pr-9 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]"
                                    style={{
                                        borderColor: "var(--border-default)",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <option value={"mlbb"}>Mobile Legends: Bang Bang</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                            </div>

                        </div>


                        <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Tournament Type
                                <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>

                            <div className="relative">

                                <Tag size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <select
                                    name="tournament_type"
                                    value={data?.tournament_type}
                                    onChange={handleInputChange}
                                    className="h-9 w-full appearance-none rounded-lg border bg-transparent pl-9 pr-9 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]"
                                    style={{
                                        borderColor: "var(--border-default)",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <option value="">Select tournament type</option>
                                    <option value="single_elimination">Single Elimination</option>
                                    <option value="double_elimination">Double Elimination</option>
                                    <option value="round_robin">Round Robin</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                            </div>

                        </div>


                        <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Team Format
                                <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>

                            <div className="relative">

                                <Users size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                                <select
                                    name="team_format"
                                    value={data.team_format || "5vs5"}
                                    onChange={handleInputChange}
                                    className="h-9 w-full appearance-none rounded-lg border bg-transparent pl-9 pr-9 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]"
                                    style={{
                                        borderColor: "var(--border-default)",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <option value={"5vs5"} >5 vs 5</option>
                                    <option value={"3vs3"} >3 vs 3</option>
                                    <option value={"1vs1"} >1 vs 1</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                            </div>

                        </div>

                         <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Minimum Teams
                                <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>

                            <input
                                name="min_teams"
                                value={data.min_teams}
                                onChange={handleInputChange}
                                type="number"
                                min="1"
                                max="99"
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                                }}
                                placeholder="25"
                                className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]"
                                style={{
                                    borderColor: "var(--border-default)",
                                    color: "var(--text-primary)",
                                }}
                            />

                        </div>



                        <div className="space-y-1.5">

                            <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Maximum Teams
                                <span style={{ color: "var(--accent-gold)" }}>*</span>
                            </label>

                            <input
                                name="max_teams"
                                value={data.max_teams}
                                onChange={handleInputChange}
                                type="number"
                                min="1"
                                max="99"
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                                }}
                                placeholder="25"
                                className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]"
                                style={{
                                    borderColor: "var(--border-default)",
                                    color: "var(--text-primary)",
                                }}
                            />

                        </div>

                    </div>

                </div>


                <div>

                    <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                                Description
                            </span>

                        </div>

                        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                            Optional
                        </span>

                    </div>

                    <textarea
                        rows="4"
                        name="description"
                        value={data.description || ""}
                        onChange={handleInputChange}
                        maxLength={3000}

                        placeholder="Describe the tournament format, eligibility, rules or other information players should know..."
                        className="w-full resize-none rounded-lg border bg-transparent px-3 py-2.5 text-xs leading-relaxed outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]"
                        style={{
                            borderColor: "var(--border-default)",
                            color: "var(--text-primary)",
                        }}
                    />

                    <div className="mt-1.5 flex justify-end">
                        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                            {len} / 3000 characters
                        </span>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default TournamentBasicInfo