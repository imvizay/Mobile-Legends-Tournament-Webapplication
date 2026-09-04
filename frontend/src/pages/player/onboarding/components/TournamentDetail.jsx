import React from "react"
import {ArrowRight,CalendarDays,CheckCircle2,Clock3,IndianRupee,ShieldCheck,Swords,Timer,Trophy,Users,X,} from "lucide-react"

import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
const dummyTournament = {
    tournament_name: "Mobile Legends Champions Cup",

    tournament_banner_url:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1800&q=90",

    tournament_logo_url: "",

    tournament_prize_pool: 50000,
    tournament_entry_fees: 100,

    tournament_max_teams: 20,
    tournament_joined_teams: 14,

    tournament_format_type: "5V5",
    tournament_type: "Double Elimination",

    tournament_reg_start_date: "2026-09-01T10:00:00",
    tournament_reg_close_date: "2026-09-15T22:00:00",

    tournament_start_date: "2026-09-18T18:00:00",
    tournament_end_date: "2026-09-18T23:00:00",

    tournament_grace_period: "15 Minutes",
    tournament_check_in_period: "1 Hour Before Start",

    tournament_overview:
        "A competitive Mobile Legends tournament for organized teams competing for the championship prize pool.",

    tournament_description: `/*Tournament Overview*/
The Mobile Legends Champions Cup is a competitive 5V5 tournament designed for organized teams looking to compete in a structured esports environment.

Teams are expected to maintain an eligible roster throughout the competition and follow all official tournament requirements.

/*Registration & Eligibility*/
Each participating player must be registered as part of the team's tournament roster.

Roster members are responsible for completing their required contribution before the participation process can be finalized.

/*Match Check-In*/
Teams must complete check-in within the official check-in window.

Failure to report before the end of the grace period may result in disqualification from the scheduled match.

/*Player Conduct*/
Players must maintain professional and respectful conduct throughout the competition.

Abusive behavior, harassment, cheating, exploitation of game bugs or unauthorized third-party tools may result in penalties.

/*Account Rules*/
Players must compete using their registered game account.

Account sharing or using an account belonging to another player is strictly prohibited.

/*Tournament Decisions*/
Tournament administrators reserve the right to investigate violations and apply penalties when required.

Administrative decisions related to competitive integrity and tournament operation will be considered final.`,
}



export default function TournamentDetail({
    tournament = dummyTournament,
   
}) {

    const navigate = useNavigate()
    const {id}= useParams()
    const data = normalizeTournament(tournament)

    const joinedTeams = Number(data.joinedTeams || 0)
    const maxTeams = Number(data.maxTeams || 0)

    const teamProgress =
        maxTeams > 0
            ? Math.min((joinedTeams / maxTeams) * 100, 100)
            : 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-0 backdrop-blur-md sm:p-4 lg:p-6">
            {/* BACKDROP */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            <section
                className="relative flex h-[100dvh] w-full flex-col overflow-hidden border bg-[var(--surface-base)] sm:h-[92dvh] sm:max-w-[1120px] sm:rounded-[20px]"
                style={{ borderColor: "var(--border-default)" }}
            >

                <header
                    className="flex h-11 shrink-0 items-center justify-between border-b px-3.5 sm:h-12 sm:px-6"
                    style={{ borderColor: "var(--border-subtle)" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />

                        <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                            Tournament Details
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close tournament details"
                        className="flex size-7 items-center justify-center rounded-full transition hover:bg-[var(--surface-elevated)] sm:size-8"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <X size={15} />
                    </button>
                </header>


                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1080px] px-3 py-3 sm:px-6 sm:py-5">

                        <section
                            className="relative overflow-hidden rounded-[14px] border sm:rounded-[16px]"
                            style={{ borderColor: "var(--border-default)" }}
                        >
                            {/* BANNER */}
                            {data.banner ? (
                                <img
                                    src={data.banner}
                                    alt={data.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--accent-gold) 20%, transparent), transparent 42%), linear-gradient(135deg, var(--surface-elevated), var(--surface-base))",
                                    }}
                                />
                            )}

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" />

                            <div className="relative z-10 flex min-h-[185px] flex-col justify-between p-3.5 sm:min-h-[225px] sm:p-6">

                                {/* HERO TOP */}

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                                        <span className="truncate text-[6px] font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] sm:text-[7px]">
                                            Mobile Legends
                                        </span>

                                        <span className="size-1 shrink-0 rounded-full bg-white/30" />

                                        <span className="truncate text-[6px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:text-[7px]">
                                            {data.type}
                                        </span>
                                    </div>

                                    <div
                                        className="flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 sm:gap-1.5 sm:px-2.5"
                                        style={{
                                            borderColor: "rgba(255,255,255,.12)",
                                            background: "rgba(0,0,0,.25)",
                                        }}
                                    >
                                        <CheckCircle2
                                            size={9}
                                            className="text-[var(--accent-gold)]"
                                        />

                                        <span className="text-[6px] font-bold uppercase tracking-[0.08em] text-white/70 sm:text-[7px]">
                                            Open
                                        </span>
                                    </div>
                                </div>

                                <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
                                    {/* LOGO */}

                                    <div
                                        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border backdrop-blur-md sm:size-14 sm:rounded-[14px]"
                                        style={{
                                            borderColor: "rgba(255,255,255,.15)",
                                            background: "rgba(0,0,0,.38)",
                                        }}
                                    >
                                        {data.logo ? (
                                            <img src={data.logo} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <Trophy
                                                size={19}
                                                className="text-[var(--accent-gold)] sm:size-[25px]"
                                            />
                                        )}
                                    </div>

                                    {/* TITLE */}

                                    <div className="min-w-0">
                                        <h1 className="line-clamp-2 text-[18px] font-black uppercase leading-[1.02] tracking-[-0.035em] text-white sm:max-w-[700px] sm:text-[28px] lg:text-[32px]">
                                            {data.name}
                                        </h1>

                                        {data.overview && (
                                            <p className="mt-1 max-w-[650px] text-[6.5px] leading-[1.65] text-white/55 sm:mt-1.5 sm:text-[8px]">
                                                {data.overview}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className="grid grid-cols-2 overflow-hidden rounded-[10px] border backdrop-blur-xl sm:grid-cols-4 sm:rounded-[12px]"
                                    style={{
                                        borderColor: "rgba(255,255,255,.11)",
                                        background: "rgba(8,8,8,.58)",
                                    }}
                                >
                                    <HeroOverviewItem
                                        icon={<Trophy size={11} />}
                                        label="Prize Pool"
                                        value={`₹${Number(data.prizePool).toLocaleString("en-IN")}`}
                                        accent
                                    />

                                    <HeroOverviewItem
                                        icon={<IndianRupee size={11} />}
                                        label="Contribution"
                                        value={`₹${Number(data.entryFee).toLocaleString("en-IN")}`}
                                    />

                                    <HeroOverviewItem
                                        icon={<Swords size={11} />}
                                        label="Format"
                                        value={data.format}
                                    />

                                    <HeroOverviewItem
                                        icon={<Users size={11} />}
                                        label="Teams"
                                        value={`${joinedTeams}/${maxTeams || "—"}`}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="mt-5 grid gap-6 sm:mt-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(270px,.72fr)] lg:gap-8">

                            <section className="min-w-0">
                                <SectionTitle
                                    eyebrow="Competition briefing"
                                    title="Tournament Description & Regulations"
                                    description="Review the official tournament information and regulations before completing your contribution."
                                />

                                <div
                                    className="mt-3.5 overflow-hidden rounded-[12px] border sm:mt-4 sm:rounded-[14px]"
                                    style={{
                                        borderColor: "var(--border-subtle)",
                                        background: "var(--surface-elevated)",
                                    }}
                                >
                                    {/* DESCRIPTION HEADER */}

                                    <div
                                        className="flex items-center justify-between border-b px-3 py-2.5 sm:px-4"
                                        style={{ borderColor: "var(--border-subtle)" }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck
                                                size={11}
                                                className="text-[var(--accent-gold)]"
                                            />

                                            <span className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:text-[7px]">
                                                Official Information
                                            </span>
                                        </div>

                                        <span className="hidden text-[6px] font-semibold text-[var(--text-muted)] sm:block">
                                            Tournament regulations
                                        </span>
                                    </div>

                                    {/* DESCRIPTION */}

                                    <div className="max-h-[430px] overflow-y-auto px-3 sm:max-h-[460px] sm:px-4">
                                        <Description description={data.description} />
                                    </div>
                                </div>
                            </section>

                            <aside className="min-w-0">
                                <SectionTitle
                                    eyebrow="Competition details"
                                    title="Tournament Details"
                                />

                                <div className="mt-3.5 sm:mt-4">

                                    {/* SCHEDULE */}

                                    <DetailGroup title="Schedule">
                                        <DetailRow
                                            icon={<CalendarDays size={13} />}
                                            label="Registration Opens"
                                            value={formatDate(data.registrationStart)}
                                        />

                                        <DetailRow
                                            icon={<Clock3 size={13} />}
                                            label="Registration Closes"
                                            value={formatDate(data.registrationClose)}
                                        />

                                        <DetailRow
                                            icon={<Trophy size={13} />}
                                            label="Tournament Starts"
                                            value={formatDate(data.startDate)}
                                        />

                                        <DetailRow
                                            icon={<CheckCircle2 size={13} />}
                                            label="Tournament Ends"
                                            value={formatDate(data.endDate)}
                                        />
                                    </DetailGroup>


                                    {/* PARTICIPATION */}

                                    <DetailGroup title="Participation">
                                        <DetailRow
                                            icon={<Clock3 size={13} />}
                                            label="Check-In Period"
                                            value={data.checkInPeriod}
                                        />

                                        <DetailRow
                                            icon={<Timer size={13} />}
                                            label="Grace Period"
                                            value={data.gracePeriod}
                                        />
                                    </DetailGroup>


                                    {/* TEAM CAPACITY */}

                                    <div
                                        className="border-t pt-4"
                                        style={{ borderColor: "var(--border-subtle)" }}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <Users
                                                    size={12}
                                                    className="text-[var(--accent-gold)]"
                                                />

                                                <span className="text-[6px] font-bold uppercase tracking-[0.11em] text-[var(--text-muted)] sm:text-[7px]">
                                                    Team Capacity
                                                </span>
                                            </div>

                                            <span className="text-[9px] font-black text-[var(--text-primary)]">
                                                {joinedTeams}

                                                <span className="font-medium text-[var(--text-muted)]">
                                                    {" "}
                                                    / {maxTeams || "—"}
                                                </span>
                                            </span>
                                        </div>



                                        <p className="mt-1.5 text-[6px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] sm:text-[7px]">
                                            {maxTeams > 0
                                                ? `${Math.max(
                                                    maxTeams - joinedTeams,
                                                    0
                                                )} team slots remaining`
                                                : "Team capacity not available"}
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>

                        <section
                            className="mt-5 border-t pt-4 sm:mt-6 sm:pt-5"
                            style={{ borderColor: "var(--border-subtle)" }}
                        >
                            <div
                                className="flex items-start gap-2.5 rounded-[11px] border px-3 py-3 sm:gap-3 sm:rounded-[12px] sm:px-4 sm:py-3.5"
                                style={{
                                    borderColor:
                                        "color-mix(in srgb, var(--accent-gold) 18%, var(--border-subtle))",
                                    background:
                                        "color-mix(in srgb, var(--accent-gold) 4%, var(--surface-elevated))",
                                }}
                            >
                                {/* ICON */}

                                <div
                                    className="flex size-7 shrink-0 items-center justify-center rounded-full border"
                                    style={{
                                        borderColor:
                                            "color-mix(in srgb, var(--accent-gold) 25%, transparent)",
                                        color: "var(--accent-gold)",
                                    }}
                                >
                                    <ShieldCheck size={12} />
                                </div>

                                {/* CONTENT */}

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <h3 className="text-[7px] font-black uppercase tracking-[0.09em] text-[var(--text-primary)] sm:text-[8px]">
                                            Individual Contribution
                                        </h3>

                                        <span className="text-[6px] font-medium text-[var(--text-muted)] sm:text-[7px]">
                                            ₹{Number(data.entryFee).toLocaleString("en-IN")} per player
                                        </span>
                                    </div>

                                    <p className="mt-1.5 max-w-[850px] text-[7px] leading-[1.75] text-[var(--text-secondary)] sm:text-[9px]">
                                        Each player is responsible for completing their
                                        individual contribution. Completing the contribution
                                        alone does not confirm tournament participation.
                                        Eligibility to compete remains subject to inclusion in
                                        the team's confirmed tournament roster and fulfillment
                                        of all roster requirements.
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

                <footer
                    className="shrink-0 border-t px-3 py-2.5 sm:px-6 sm:py-3"
                    style={{
                        borderColor: "var(--border-subtle)",
                        background: "var(--surface-base)",
                    }}
                >
                    <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-3">

                        {/* PRICE */}

                        <div className="min-w-0">
                            <p className="text-[6px] font-bold uppercase tracking-[0.11em] text-[var(--text-muted)] sm:text-[7px]">
                                Individual Contribution
                            </p>

                            <p className="mt-0.5 text-[14px] font-black tracking-[-0.02em] text-[var(--accent-gold)] sm:text-[16px]">
                                ₹{Number(data.entryFee).toLocaleString("en-IN")}
                            </p>
                        </div>


                        {/* CTA */}

                        <button
                            type="button"
                            onClick={()=>navigate(`/player/tournament/${id}/review-contribution`)}
                            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] px-3 text-[7px] font-black uppercase tracking-[0.09em] transition hover:-translate-y-px active:translate-y-0 sm:h-10 sm:min-w-[250px] sm:flex-none sm:px-6 sm:text-[8px]"
                            style={{
                                color: "var(--bg-canvas)",
                                background: "var(--accent-gold)",
                            }}
                        >
                            <span className="truncate">
                                Continue to Contribution
                            </span>

                            <ArrowRight
                                size={12}
                                strokeWidth={2.5}
                                className="shrink-0"
                            />
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    )
}


function SectionTitle({
    eyebrow,
    title,
    description,
}) {
    return (
        <div className="max-w-[680px]">
            {eyebrow && (
                <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[var(--accent-gold)] sm:text-[7px]">
                    {eyebrow}
                </p>
            )}

            <h2
                className={`text-[14px] font-black tracking-[-0.02em] text-[var(--text-primary)] sm:text-[17px] ${eyebrow ? "mt-1.5" : ""
                    }`}
            >
                {title}
            </h2>

            {description && (
                <p className="mt-1 text-[7px] leading-[1.7] text-[var(--text-secondary)] sm:mt-1.5 sm:text-[9px]">
                    {description}
                </p>
            )}
        </div>
    )
}

function HeroOverviewItem({
    icon,
    label,
    value,
    accent = false,
}) {
    return (
        <div className="min-w-0 border-b border-r border-white/10 px-2.5 py-2 sm:px-3.5 sm:py-3">
            <div className="flex items-center gap-1.5">
                <span
                    className={
                        accent
                            ? "text-[var(--accent-gold)]"
                            : "text-white/45"
                    }
                >
                    {icon}
                </span>

                <span className="truncate text-[5.5px] font-bold uppercase tracking-[0.09em] text-white/45 sm:text-[6px]">
                    {label}
                </span>
            </div>

            <p
                className={`mt-1 truncate text-[8px] font-black uppercase sm:text-[10px] ${accent
                    ? "text-[var(--accent-gold)]"
                    : "text-white"
                    }`}
            >
                {value}
            </p>
        </div>
    )
}


function DetailGroup({
    title,
    children,
}) {
    return (
        <section
            className="border-b py-3.5 first:pt-0 sm:py-4"
            style={{ borderColor: "var(--border-subtle)" }}
        >
            <p className="mb-2.5 text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--accent-gold)] sm:mb-3 sm:text-[7px]">
                {title}
            </p>

            <div className="space-y-3">
                {children}
            </div>
        </section>
    )
}


function DetailRow({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-[var(--text-muted)]">
                {icon}
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-[6px] font-bold uppercase tracking-[0.09em] text-[var(--text-muted)] sm:text-[7px]">
                    {label}
                </p>

                <p className="mt-0.5 break-words text-[8px] font-bold leading-[1.55] text-[var(--text-primary)] sm:text-[10px]">
                    {value || "Not specified"}
                </p>
            </div>
        </div>
    )
}


function ContributionPoint({ text }) {
    return (
        <div className="flex items-center gap-1.5">
            <CheckCircle2
                size={9}
                className="shrink-0 text-[var(--accent-gold)]"
            />

            <span className="text-[6px] font-semibold text-[var(--text-muted)] sm:text-[7px]">
                {text}
            </span>
        </div>
    )
}


function Description({
    description,
}) {
    const sections = parseDescription(description)

    if (!sections.length) {
        return (
            <div className="py-8 text-center">
                <ShieldCheck
                    size={19}
                    className="mx-auto text-[var(--accent-gold)]"
                />

                <p className="mt-2 text-[7px] font-semibold text-[var(--text-muted)]">
                    Tournament information is not available.
                </p>
            </div>
        )
    }

    return (
        <div>
            {sections.map((section, index) => (
                <article
                    key={`${section.heading}-${index}`}
                    className={`py-3.5 sm:py-4 ${index !== 0 ? "border-t" : ""
                        }`}
                    style={{
                        borderColor: "var(--border-subtle)",
                    }}
                >
                    <div className="flex gap-2.5 sm:gap-4">

                        {/* NUMBER */}

                        <span className="w-5 shrink-0 pt-0.5 text-[7px] font-black tracking-[0.05em] text-[var(--accent-gold)] sm:text-[8px]">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                            <h3 className="text-[7px] font-black uppercase leading-[1.5] tracking-[0.04em] text-[var(--text-primary)] sm:text-[9px]">
                                {section.heading}
                            </h3>

                            <div className="mt-1.5 space-y-1.5">
                                {section.content.map(
                                    (line, lineIndex) => (
                                        <p
                                            key={lineIndex}
                                            className="text-[7px] leading-[1.8] text-[var(--text-secondary)] sm:text-[9px]"
                                        >
                                            {line}
                                        </p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}


function normalizeTournament(
    tournament = {}
) {
    const source = {
        ...dummyTournament,
        ...(tournament || {}),
    }

    return {
        name:
            source.tournament_name ||
            source.name ||
            "Tournament",

        banner:
            source.tournament_banner_url ||
            source.banner_url ||
            source.banner ||
            "",

        logo:
            source.tournament_logo_url ||
            source.logo_url ||
            source.logo ||
            "",

        prizePool:
            source.tournament_prize_pool ??
            source.prize_pool ??
            0,

        entryFee:
            source.tournament_entry_fees ??
            source.tournament_entry_fee ??
            source.entry_fee ??
            0,

        maxTeams:
            source.tournament_max_teams ??
            source.max_teams ??
            0,

        joinedTeams:
            source.tournament_joined_teams ??
            source.joined_teams ??
            0,

        format:
            source.tournament_format_type ||
            source.format_type ||
            source.format ||
            "Not specified",

        type:
            source.tournament_type ||
            source.type ||
            "Tournament",

        registrationStart:
            source.tournament_reg_start_date ||
            source.registration_start_date ||
            null,

        registrationClose:
            source.tournament_reg_close_date ||
            source.registration_close_date ||
            null,

        startDate:
            source.tournament_start_date ||
            source.start_date ||
            null,

        endDate:
            source.tournament_end_date ||
            source.end_date ||
            null,

        gracePeriod:
            source.tournament_grace_period ||
            source.grace_period ||
            "Not specified",

        checkInPeriod:
            source.tournament_check_in_period ||
            source.check_in_period ||
            "Not specified",

        overview:
            source.tournament_overview ||
            source.overview ||
            "",

        description:
            source.tournament_description ||
            source.tournametn_description ||
            source.description ||
            "",
    }
}


function parseDescription(
    description = ""
) {
    if (
        typeof description !== "string" ||
        !description.trim()
    ) {
        return []
    }

    const regex =
        /\/\*([\s\S]*?)\*\/([\s\S]*?)(?=\/\*|$)/g

    const sections = []

    let match

    while (
        (match = regex.exec(description)) !== null
    ) {
        const heading = match[1].trim()

        const content = match[2]
            .trim()
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)

        if (heading || content.length) {
            sections.push({
                heading: heading || "Overview",
                content,
            })
        }
    }

    if (
        !sections.length &&
        description.trim()
    ) {
        return [
            {
                heading: "Overview",
                content: [description.trim()],
            },
        ]
    }

    return sections
}


function formatDate(value) {
    if (!value) {
        return "Not specified"
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return String(value)
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}