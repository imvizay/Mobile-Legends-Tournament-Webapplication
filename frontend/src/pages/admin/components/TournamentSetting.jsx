import { Trophy, ChevronDown } from "lucide-react"

const TournamentSettings = ({ }) => {
    return (
        <section
            className="overflow-hidden rounded-xl border"
            style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", }} >

            <div className="flex items-start gap-3 border-b px-4 py-3.5" style={{ borderColor: "var(--border-subtle)" }} >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                    style={{background: "rgba(200,176,122,0.12)",color: "var(--accent-gold)",}}>
                    <Trophy size={14} strokeWidth={1.7} />
                </div>

                <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        Tournament Classification
                    </h2>
                    <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Define tournament type and registration access.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                        Tournament Category
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <select
                            name="category"
                            className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]"
                            style={{
                                borderColor: "var(--border-default)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <option value="">Select category</option>
                            <option value="weekly">Weekly Tournament</option>
                            <option value="monthly">Monthly Tournament</option>
                            <option value="year_finale">Year Finale</option>
                        </select>

                        <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--text-muted)" }}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                        Competition Type
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <select
                            name="competition_type"
                            className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]"
                            style={{
                                borderColor: "var(--border-default)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <option value="">Select type</option>
                            <option value="competitive">Competitive</option>
                            <option value="casual">Casual</option>
                        </select>

                        <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--text-muted)" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TournamentSettings