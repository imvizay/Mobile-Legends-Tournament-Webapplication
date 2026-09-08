import { ArrowRight, CalendarDays, CheckCircle2, Clock3, IndianRupee, ShieldCheck, Swords, Timer, Trophy, Users, X } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export default function TournamentDetail({ tournament = {} }) {
    const navigate = useNavigate()
    const { id } = useParams()

    const {
        tournament_name = "Tournament",
        background_image_url = "",
        banner_image_url = "",
        bracket_format = "Not specified",
        category = "Not specified",
        check_in = null,
        description = "",
        ends_at = null,
        entry_fee = 0,
        grace_period = null,
        max_teams = 0,
        minimum_account_level = null,
        minimum_rank = null,
        prize_pool = 0,
        registration_closes_at = null,
        registration_opens_at = null,
        starts_at = null,
        team_format = "Not specified",
        tournament_type = "Not specified",
        registration_status = "Not specified",
    } = tournament

    const maxTeams = Number(max_teams) || 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-0 backdrop-blur-md sm:p-4 lg:p-6">
            <div className="absolute inset-0" aria-hidden="true" />
            <section className="relative flex h-[100dvh] w-full flex-col overflow-hidden border bg-[var(--surface-base)] sm:h-[92dvh] sm:max-w-[1120px] sm:rounded-[20px]" style={{ borderColor: "var(--border-default)" }}>
                <header className="flex h-11 shrink-0 items-center justify-between border-b px-3.5 sm:h-12 sm:px-6" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />
                        <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Tournament Details</span>
                    </div>
                    <button type="button" aria-label="Close tournament details" onClick={() => navigate("/player/tournament")} className="flex size-7 items-center justify-center rounded-full transition hover:bg-[var(--surface-elevated)] sm:size-8" style={{ color: "var(--text-secondary)" }}>
                        <X size={15} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1080px] px-3 py-3 sm:px-6 sm:py-5">
                        <section className="relative overflow-hidden rounded-[14px] border sm:rounded-[16px]" style={{ borderColor: "var(--border-default)" }}>
                            {banner_image_url ? (
                                <img src={banner_image_url} alt={tournament_name} className="absolute inset-0 h-full w-full object-cover" />
                            ) : background_image_url ? (
                                <img src={background_image_url} alt={tournament_name} className="absolute inset-0 h-full w-full object-cover" />
                            ) : (
                                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--accent-gold) 20%, transparent), transparent 42%), linear-gradient(135deg, var(--surface-elevated), var(--surface-base))" }} />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" />

                            <div className="relative z-10 flex min-h-[185px] flex-col justify-between p-3.5 sm:min-h-[225px] sm:p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                                        <span className="truncate text-[6px] font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] sm:text-[7px]">Mobile Legends</span>
                                        <span className="size-1 shrink-0 rounded-full bg-white/30" />
                                        <span className="truncate text-[6px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:text-[7px]">{formatEnum(tournament_type)}</span>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 sm:gap-1.5 sm:px-2.5" style={{ borderColor: "rgba(255,255,255,.12)", background: "rgba(0,0,0,.25)" }}>
                                        <CheckCircle2 size={9} className="text-[var(--accent-gold)]" />
                                        <span className="text-[6px] font-bold uppercase tracking-[0.08em] text-white/70 sm:text-[7px]">{formatEnum(registration_status)}</span>
                                    </div>
                                </div>

                                <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border backdrop-blur-md sm:size-14 sm:rounded-[14px]" style={{ borderColor: "rgba(255,255,255,.15)", background: "rgba(0,0,0,.38)" }}>
                                        <Trophy size={19} className="text-[var(--accent-gold)] sm:size-[25px]" />
                                    </div>

                                    <div className="min-w-0">
                                        <h1 className="line-clamp-2 text-[18px] font-black uppercase leading-[1.02] tracking-[-0.035em] text-white sm:max-w-[700px] sm:text-[28px] lg:text-[32px]">{tournament_name}</h1>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 overflow-hidden rounded-[10px] border backdrop-blur-xl sm:grid-cols-4 sm:rounded-[12px]" style={{ borderColor: "rgba(255,255,255,.11)", background: "rgba(8,8,8,.58)" }}>
                                    <HeroOverviewItem icon={<Trophy size={11} />} label="Prize Pool" value={formatCurrency(prize_pool)} accent />
                                    <HeroOverviewItem icon={<IndianRupee size={11} />} label="Contribution" value={formatCurrency(entry_fee)} />
                                    <HeroOverviewItem icon={<Swords size={11} />} label="Format" value={formatEnum(team_format)} />
                                    <HeroOverviewItem icon={<Users size={11} />} label="Teams" value={maxTeams || "—"} />
                                </div>
                            </div>
                        </section>

                        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(270px,.72fr)] lg:items-stretch lg:gap-8">
                            <section className="min-w-0 lg:flex lg:min-h-0 lg:flex-col">
                                <SectionTitle eyebrow="Competition briefing" title="Tournament Description & Regulations" description="Review the official tournament information and regulations before completing your contribution." />

                                <div className="mt-3.5 overflow-hidden rounded-[12px] border sm:mt-4 sm:rounded-[14px] lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}>
                                    <div className="flex shrink-0 items-center justify-between border-b px-3 py-2.5 sm:px-4" style={{ borderColor: "var(--border-subtle)" }}>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={11} className="text-[var(--accent-gold)]" />
                                            <span className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:text-[7px]">Official Information</span>
                                        </div>
                                        <span className="hidden text-[6px] font-semibold text-[var(--text-muted)] sm:block">Tournament regulations</span>
                                    </div>

                                    <div className="px-3 sm:px-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                                        <Description description={description} />
                                    </div>
                                </div>
                            </section>

                            <aside className="min-w-0">
                                <SectionTitle eyebrow="Competition details" title="Tournament Details" />

                                <div className="mt-3.5 sm:mt-4">
                                    <DetailGroup title="Schedule">
                                        <DetailRow icon={<CalendarDays size={13} />} label="Registration Opens" value={formatDate(registration_opens_at)} />
                                        <DetailRow icon={<Clock3 size={13} />} label="Registration Closes" value={formatDate(registration_closes_at)} />
                                        <DetailRow icon={<Trophy size={13} />} label="Tournament Starts" value={formatDate(starts_at)} />
                                        <DetailRow icon={<CheckCircle2 size={13} />} label="Tournament Ends" value={formatDate(ends_at)} />
                                    </DetailGroup>

                                    <DetailGroup title="Participation">
                                        <DetailRow icon={<Clock3 size={13} />} label="Check-In Period" value={check_in ? formatEnum(check_in) : "Not specified"} />
                                        <DetailRow icon={<Timer size={13} />} label="Grace Period" value={grace_period ? `${grace_period} min` : "Not specified"} />
                                        <DetailRow icon={<Swords size={13} />} label="Bracket Format" value={formatEnum(bracket_format)} />
                                        <DetailRow icon={<Users size={13} />} label="Category" value={formatEnum(category)} />
                                    </DetailGroup>

                                    <DetailGroup title="Eligibility">
                                        <DetailRow icon={<ShieldCheck size={13} />} label="Minimum Rank" value={minimum_rank ? formatEnum(minimum_rank) : "Not specified"} />
                                        <DetailRow icon={<Users size={13} />} label="Account Level" value={minimum_account_level ? `Level ${minimum_account_level}+` : "Not specified"} />
                                    </DetailGroup>

                                    <div className="border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={12} className="text-[var(--accent-gold)]" />
                                                <span className="text-[6px] font-bold uppercase tracking-[0.11em] text-[var(--text-muted)] sm:text-[7px]">Team Capacity</span>
                                            </div>
                                            <span className="text-[9px] font-black text-[var(--text-primary)]">{maxTeams || "—"}</span>
                                        </div>
                                        <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] sm:text-[7px]">{maxTeams ? `${maxTeams} team slots available` : "Team capacity not available"}</p>
                                    </div>
                                </div>
                            </aside>
                        </div>

                        <section className="mt-5 border-t pt-4 sm:mt-6 sm:pt-5" style={{ borderColor: "var(--border-subtle)" }}>
                            <div className="flex items-start gap-2.5 rounded-[11px] border px-3 py-3 sm:gap-3 sm:rounded-[12px] sm:px-4 sm:py-3.5" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 18%, var(--border-subtle))", background: "color-mix(in srgb, var(--accent-gold) 4%, var(--surface-elevated))" }}>
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 25%, transparent)", color: "var(--accent-gold)" }}>
                                    <ShieldCheck size={12} />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <h3 className="text-[7px] font-black uppercase tracking-[0.09em] text-[var(--text-primary)] sm:text-[8px]">Individual Contribution</h3>
                                        <span className="text-[6px] font-medium text-[var(--text-muted)] sm:text-[7px]">{formatCurrency(entry_fee)} per player</span>
                                    </div>

                                    <p className="mt-1.5 max-w-[850px] text-[7px] leading-[1.75] text-[var(--text-secondary)] sm:text-[9px]">
                                        Each player is responsible for completing their individual contribution. Completing the contribution alone does not confirm tournament participation. Eligibility to compete remains subject to inclusion in the team's confirmed tournament roster and fulfillment of all roster requirements.
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-x-4">
                                        <ContributionPoint text="Individual payment required" />
                                        <ContributionPoint text="Confirmed roster required" />
                                        <ContributionPoint text="Eligibility verified" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <footer className="shrink-0 border-t px-3 py-2.5 sm:px-6 sm:py-3" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-base)" }}>
                    <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[6px] font-bold uppercase tracking-[0.11em] text-[var(--text-muted)] sm:text-[7px]">Individual Contribution</p>
                            <p className="mt-0.5 text-[14px] font-black tracking-[-0.02em] text-[var(--accent-gold)] sm:text-[16px]">{formatCurrency(entry_fee)}</p>
                        </div>

                        <button type="button" onClick={() => navigate(`/player/tournament/${id}/review-contribution`)} className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] px-3 text-[7px] font-black uppercase tracking-[0.09em] transition hover:-translate-y-px active:translate-y-0 sm:h-10 sm:min-w-[250px] sm:flex-none sm:px-6 sm:text-[8px]" style={{ color: "var(--bg-canvas)", background: "var(--accent-gold)" }}>
                            <span className="truncate">Continue to Contribution</span>
                            <ArrowRight size={12} strokeWidth={2.5} className="shrink-0" />
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    )
}

function SectionTitle({ eyebrow, title, description }) {
    return (
        <div className="max-w-[680px]">
            {eyebrow && <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] sm:text-[7px]">{eyebrow}</p>}
            <h2 className={`text-[14px] font-black tracking-[-0.02em] text-[var(--text-primary)] sm:text-[17px] ${eyebrow ? "mt-1.5" : ""}`}>{title}</h2>
            {description && <p className="mt-1 text-[7px] leading-[1.7] text-[var(--text-secondary)] sm:mt-1.5 sm:text-[9px]">{description}</p>}
        </div>
    )
}

function HeroOverviewItem({ icon, label, value, accent = false }) {
    return (
        <div className="min-w-0 border-b border-r border-white/10 px-2.5 py-2 sm:px-3.5 sm:py-3">
            <div className="flex items-center gap-1.5">
                <span className={accent ? "text-[var(--accent-gold)]" : "text-white/45"}>{icon}</span>
                <span className="truncate text-[5.5px] font-bold uppercase tracking-[0.09em] text-white/45 sm:text-[6px]">{label}</span>
            </div>
            <p className={`mt-1 truncate text-[8px] font-black uppercase sm:text-[10px] ${accent ? "text-[var(--accent-gold)]" : "text-white"}`}>{value}</p>
        </div>
    )
}

function DetailGroup({ title, children }) {
    return (
        <section className="border-b py-3.5 first:pt-0 sm:py-4" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="mb-2.5 text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--accent-gold)] sm:mb-3 sm:text-[7px]">{title}</p>
            <div className="space-y-3">{children}</div>
        </section>
    )
}

function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-[var(--text-muted)]">{icon}</span>
            <div className="min-w-0 flex-1">
                <p className="text-[6px] font-bold uppercase tracking-[0.09em] text-[var(--text-muted)] sm:text-[7px]">{label}</p>
                <p className="mt-0.5 break-words text-[8px] font-bold leading-[1.55] text-[var(--text-primary)] sm:text-[10px]">{value || "Not specified"}</p>
            </div>
        </div>
    )
}

function ContributionPoint({ text }) {
    return (
        <div className="flex items-center gap-1.5">
            <CheckCircle2 size={9} className="shrink-0 text-[var(--accent-gold)]" />
            <span className="text-[6px] font-semibold text-[var(--text-muted)] sm:text-[7px]">{text}</span>
        </div>
    )
}

function Description({ description = "" }) {
    const sections = parseDescription(description)

    if (!sections.length) {
        return (
            <div className="py-8 text-center">
                <ShieldCheck size={19} className="mx-auto text-[var(--accent-gold)]" />
                <p className="mt-2 text-[7px] font-semibold text-[var(--text-muted)]">Tournament information is not available.</p>
            </div>
        )
    }

    return (
        <div>
            {sections.map((section, index) => (
                <article key={`${section.heading}-${index}`} className={`py-3.5 sm:py-4 ${index !== 0 ? "border-t" : ""}`} style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex gap-2.5 sm:gap-4">
                        <span className="w-5 shrink-0 pt-0.5 text-[7px] font-black tracking-[0.05em] text-[var(--accent-gold)] sm:text-[8px]">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-[7px] font-black uppercase leading-[1.5] tracking-[0.04em] text-[var(--text-primary)] sm:text-[9px]">{section.heading}</h3>
                            <div className="mt-1.5 space-y-1.5">
                                {section.content.map((line, lineIndex) => (
                                    <p key={lineIndex} className="text-[7px] leading-[1.8] text-[var(--text-secondary)] sm:text-[9px]">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}

function parseDescription(description = "") {
    if (typeof description !== "string" || !description.trim()) return []

    const numberedRules = description
        .replace(/\r/g, "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)

    if (numberedRules.some((line) => /^\d+\./.test(line))) {
        return numberedRules.map((line, index) => {
            const match = line.match(/^\d+\.\s*(.*)$/)
            const text = match?.[1] || line
            const separator = text.indexOf("—")
            const colon = text.indexOf(":")
            const splitAt = separator > -1 ? separator : colon

            if (splitAt > -1) {
                return {
                    heading: text.slice(0, splitAt).trim(),
                    content: [text.slice(splitAt + 1).trim()].filter(Boolean),
                }
            }

            return {
                heading: `Rule ${index + 1}`,
                content: [text],
            }
        })
    }

    const regex = /\/\*([\s\S]*?)\*\/([\s\S]*?)(?=\/\*|$)/g
    const sections = []
    let match

    while ((match = regex.exec(description)) !== null) {
        const heading = match[1].trim()
        const content = match[2].replace(/\r/g, "").trim().split(/\n+/).map((line) => line.trim()).filter(Boolean)

        if (heading || content.length) {
            sections.push({ heading: heading || "Overview", content })
        }
    }

    return sections.length ? sections : [{ heading: "Overview", content: [description.trim()] }]
}

function formatCurrency(value) {
    const amount = Number(value)
    return `₹${Number.isFinite(amount) ? amount.toLocaleString("en-IN") : "0"}`
}

function formatEnum(value) {
    if (!value) return "Not specified"
    return String(value).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDate(value) {
    if (!value) return "Not specified"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return String(value)

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}