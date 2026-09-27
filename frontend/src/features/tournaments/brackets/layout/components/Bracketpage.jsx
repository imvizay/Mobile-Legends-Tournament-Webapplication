import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Check,
    Clock3,
    Plus,
    Trophy,
    UsersRound,
} from "lucide-react";
import { useOutletContext, useParams } from "react-router-dom";

import { bracketService } from "../../services/bracket_services";

const ROUND_OPTIONS = [
    { value: "round_1", label: "Round 1" },
    { value: "quarter_final", label: "Quarter Final" },
    { value: "semi_final", label: "Semi Final" },
    { value: "final", label: "Final" },
];

/* =========================================================
   HELPERS
========================================================= */

function getTeamId(team) {
    return team?.id ?? team?.team_id ?? team?.teamId;
}

function getTeamName(team) {
    return (
        team?.name ??
        team?.team_name ??
        team?.teamName ??
        "Unknown Team"
    );
}

function getTeamTag(team) {
    return (
        team?.tag ??
        team?.team_tag ??
        team?.teamTag ??
        team?.itag ??
        null
    );
}

function createMatches(count) {
    return Array.from({ length: count }, (_, index) => ({
        match_number: index + 1,
        team: null,
        opponent: null,
        date: "",
        time: "",
    }));
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function BracketPage() {
    const { tournament, teams: contextTeams = [] } = useOutletContext();
    const { tournamentId } = useParams();

    /*
     * Normalize teams once so the rest of the component
     * doesn't care whether backend returns id/team_id etc.
     */
    const teams = useMemo(() => {
        return (Array.isArray(contextTeams) ? contextTeams : [])
            .map((team) => {
                const id = getTeamId(team);

                if (id === undefined || id === null) {
                    return null;
                }

                return {
                    ...team,
                    id,
                    name: getTeamName(team),
                    tag: getTeamTag(team),
                };
            })
            .filter(Boolean);
    }, [contextTeams]);

    const storageKey = `tournament-bracket-draft-${tournamentId}`;

    const [roundType, setRoundType] = useState("round_1");
    const [matches, setMatches] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
     * Number of first-round matches.
     *
     * Example:
     * 8 teams  -> 4 matches
     * 7 teams  -> 4 matches
     * 6 teams  -> 3 matches
     */
    const matchCount = Math.ceil(teams.length / 2);

    /* =====================================================
       LOAD DRAFT
    ===================================================== */

    useEffect(() => {
        if (!tournamentId) return;

        const savedDraft = localStorage.getItem(storageKey);

        if (!savedDraft) {
            setMatches(createMatches(matchCount));
            return;
        }

        try {
            const draft = JSON.parse(savedDraft);

            setRoundType(draft.round_type || "round_1");

            if (
                Array.isArray(draft.matches) &&
                draft.matches.length > 0
            ) {
                setMatches(draft.matches);
            } else {
                setMatches(createMatches(matchCount));
            }
        } catch (error) {
            console.error("Failed to load bracket draft:", error);

            localStorage.removeItem(storageKey);
            setMatches(createMatches(matchCount));
        }
    }, [storageKey, tournamentId, matchCount]);

    /* =====================================================
       SAVE DRAFT
    ===================================================== */

    useEffect(() => {
        if (!tournamentId || !matches.length) return;

        localStorage.setItem(
            storageKey,
            JSON.stringify({
                round_type: roundType,
                matches,
            })
        );
    }, [
        matches,
        roundType,
        storageKey,
        tournamentId,
    ]);

    /* =====================================================
       ASSIGNED TEAMS
    ===================================================== */

    const assignedTeamIds = useMemo(() => {
        const ids = new Set();

        matches.forEach((match) => {
            const teamId = getTeamId(match.team);
            const opponentId = getTeamId(match.opponent);

            if (teamId !== undefined && teamId !== null) {
                ids.add(String(teamId));
            }

            if (
                opponentId !== undefined &&
                opponentId !== null
            ) {
                ids.add(String(opponentId));
            }
        });

        return ids;
    }, [matches]);

    /* =====================================================
       READY MATCHES
    ===================================================== */

    const readyMatches = useMemo(() => {
        return matches.filter(
            (match) =>
                getTeamId(match.team) &&
                getTeamId(match.opponent) &&
                match.date &&
                match.time
        );
    }, [matches]);

    const isReady =
        matches.length > 0 &&
        readyMatches.length === matches.length;

    /* =====================================================
       UPDATE MATCH
    ===================================================== */

    function updateMatch(matchNumber, field, value) {
        setMatches((current) =>
            current.map((match) =>
                match.match_number === matchNumber
                    ? {
                          ...match,
                          [field]: value,
                      }
                    : match
            )
        );

        setError("");
        setSuccess("");
    }

    /* =====================================================
       SELECT TEAM
    ===================================================== */

    function selectTeam(matchNumber, field, teamId) {
        /*
         * Empty selection.
         */
        if (!teamId) {
            updateMatch(matchNumber, field, null);
            return;
        }

        /*
         * Find selected team using normalized ID.
         */
        const selectedTeam = teams.find(
            (team) =>
                String(getTeamId(team)) ===
                String(teamId)
        );

        if (!selectedTeam) {
            setError("Selected team could not be found.");
            return;
        }

        /*
         * Prevent a team from being assigned to
         * two different matches.
         */
        const isUsedElsewhere = matches.some((match) => {
            if (match.match_number === matchNumber) {
                return false;
            }

            return (
                String(getTeamId(match.team)) ===
                    String(teamId) ||
                String(getTeamId(match.opponent)) ===
                    String(teamId)
            );
        });

        if (isUsedElsewhere) {
            setError(
                `${getTeamName(
                    selectedTeam
                )} is already assigned to another match.`
            );
            return;
        }

        /*
         * Prevent Team A vs Team A.
         */
        const currentMatch = matches.find(
            (match) =>
                match.match_number === matchNumber
        );

        const otherField =
            field === "team"
                ? "opponent"
                : "team";

        const otherTeamId = getTeamId(
            currentMatch?.[otherField]
        );

        if (
            otherTeamId &&
            String(otherTeamId) === String(teamId)
        ) {
            setError(
                "A team cannot play against itself."
            );
            return;
        }

        /*
         * Store a small normalized team object.
         * We don't need to store the entire API object.
         */
        const selected = {
            id: getTeamId(selectedTeam),
            name: getTeamName(selectedTeam),
            tag: getTeamTag(selectedTeam),
        };

        setMatches((current) =>
            current.map((match) =>
                match.match_number === matchNumber
                    ? {
                          ...match,
                          [field]: selected,
                      }
                    : match
            )
        );

        setError("");
        setSuccess("");
    }

    /* =====================================================
       CHANGE ROUND
    ===================================================== */

    function changeRound(value) {
        setRoundType(value);
        setError("");
        setSuccess("");
    }

    /* =====================================================
       ADD MATCH
    ===================================================== */

    function addMatch() {
        setMatches((current) => [
            ...current,
            {
                match_number: current.length + 1,
                team: null,
                opponent: null,
                date: "",
                time: "",
            },
        ]);

        setError("");
        setSuccess("");
    }

    /* =====================================================
       REMOVE MATCH
    ===================================================== */

    function removeMatch(matchNumber) {
        setMatches((current) =>
            current
                .filter(
                    (match) =>
                        match.match_number !==
                        matchNumber
                )
                .map((match, index) => ({
                    ...match,
                    match_number: index + 1,
                }))
        );

        setError("");
        setSuccess("");
    }

    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateMatches() {
        if (!matches.length) {
            return "At least one match is required.";
        }

        const usedTeams = new Set();

        for (const match of matches) {
            const teamId = getTeamId(match.team);
            const opponentId = getTeamId(
                match.opponent
            );

            if (!teamId || !opponentId) {
                return `Match ${match.match_number}: both teams are required.`;
            }

            if (
                String(teamId) ===
                String(opponentId)
            ) {
                return `Match ${match.match_number}: a team cannot play against itself.`;
            }

            if (!match.date || !match.time) {
                return `Match ${match.match_number}: date and time are required.`;
            }

            const teamKey = String(teamId);
            const opponentKey =
                String(opponentId);

            if (usedTeams.has(teamKey)) {
                return `${getTeamName(
                    match.team
                )} is already assigned to another match.`;
            }

            if (usedTeams.has(opponentKey)) {
                return `${getTeamName(
                    match.opponent
                )} is already assigned to another match.`;
            }

            usedTeams.add(teamKey);
            usedTeams.add(opponentKey);
        }

        return null;
    }

    /* =====================================================
       CREATE ROUND
    ===================================================== */

    async function handleCreateRound() {
        setError("");
        setSuccess("");

        const validationError =
            validateMatches();

        if (validationError) {
            setError(validationError);
            return;
        }

        const payload = {
            round_type: roundType,

            matches: matches.map((match) => ({
                match_number:
                    match.match_number,

                team: {
                    id: Number(
                        getTeamId(match.team)
                    ),
                    name: getTeamName(
                        match.team
                    ),
                },

                opponent: {
                    id: Number(
                        getTeamId(
                            match.opponent
                        )
                    ),
                    name: getTeamName(
                        match.opponent
                    ),
                },

                scheduled_at: `${match.date}T${match.time}:00`,
            })),
        };

        try {
            setIsCreating(true);

            console.log(
                "CREATE ROUND PAYLOAD:",
                payload
            );

            await bracketService.createRound(
                tournamentId,
                payload
            );

            /*
             * IMPORTANT:
             * Only remove localStorage after API success.
             */
            localStorage.removeItem(storageKey);

            setSuccess(
                "Round created successfully."
            );
        } catch (error) {
            console.error(
                "Create round failed:",
                error
            );

            /*
             * Draft remains in localStorage.
             */
            setError(
                error?.response?.data?.detail ||
                    "Failed to create round. Your draft is still saved."
            );
        } finally {
            setIsCreating(false);
        }
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <section className="h-full overflow-y-auto scrollbar-hide">
            <div className="mx-auto w-full max-w-6xl space-y-4 pb-6">

                {/* =================================================
                    TOURNAMENT HEADER
                ================================================= */}

                <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">
                    <div className="flex items-center gap-3 px-4 py-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)]">
                            <Trophy
                                size={15}
                                className="text-[var(--headline-primary)]"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-semibold text-[var(--headline-primary)]">
                                {tournament?.name ||
                                    tournament?.tournament_name ||
                                    "Tournament"}
                            </h2>

                            <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                                Configure the opening
                                round and assign
                                participating teams.
                            </p>
                        </div>

                        <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-[8px] uppercase tracking-wide text-[var(--text-muted)]">
                                Qualified Teams
                            </p>

                            <p className="mt-0.5 text-[10px] font-semibold text-[var(--headline-primary)]">
                                {teams.length} Teams
                            </p>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    ROUND SETUP + TEAMS
                ================================================= */}

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">

                    {/* =============================================
                        ROUND MATCH SETUP
                    ============================================= */}

                    <section className="min-w-0 rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">

                        <div className="border-b border-[var(--border-subtle)] px-4 py-3">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="text-sm font-semibold text-[var(--headline-primary)]">
                                        Round Match Setup
                                    </h2>

                                    <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                                        Assign teams and
                                        schedule every
                                        match.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {ROUND_OPTIONS.map(
                                        (round) => (
                                            <button
                                                key={
                                                    round.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    changeRound(
                                                        round.value
                                                    )
                                                }
                                                className={`rounded-md border px-2.5 py-1.5 text-[8px] font-semibold transition ${
                                                    roundType ===
                                                    round.value
                                                        ? "border-[var(--headline-primary)] bg-[var(--headline-primary)] text-[var(--surface-base)]"
                                                        : "border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]"
                                                }`}
                                            >
                                                {
                                                    round.label
                                                }
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* MATCHES */}

                        <div className="space-y-3 p-3">

                            {matches.length ===
                            0 ? (
                                <div className="rounded-lg border border-dashed border-[var(--border-default)] px-4 py-10 text-center">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">
                                        No matches created
                                        yet.
                                    </p>

                                    <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                                        Add a match to
                                        begin assigning
                                        teams.
                                    </p>
                                </div>
                            ) : (
                                matches.map(
                                    (match) => (
                                        <MatchCard
                                            key={
                                                match.match_number
                                            }
                                            match={
                                                match
                                            }
                                            teams={
                                                teams
                                            }
                                            assignedTeamIds={
                                                assignedTeamIds
                                            }
                                            onSelectTeam={
                                                selectTeam
                                            }
                                            onChange={
                                                updateMatch
                                            }
                                            onRemove={
                                                removeMatch
                                            }
                                            canRemove={
                                                matches.length >
                                                1
                                            }
                                        />
                                    )
                                )
                            )}

                            <button
                                type="button"
                                onClick={addMatch}
                                className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--border-default)] text-[9px] font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-elevated)]"
                            >
                                <Plus size={12} />
                                Add Match
                            </button>
                        </div>

                        {/* FOOTER */}

                        <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">
                                {error ? (
                                    <p className="text-[9px] font-medium text-red-600">
                                        {error}
                                    </p>
                                ) : success ? (
                                    <p className="flex items-center gap-1.5 text-[9px] font-medium text-green-700">
                                        <Check
                                            size={
                                                11
                                            }
                                        />
                                        {success}
                                    </p>
                                ) : (
                                    <p className="text-[9px] text-[var(--text-muted)]">
                                        {
                                            readyMatches.length
                                        }
                                        /
                                        {
                                            matches.length
                                        }{" "}
                                        matches ready
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCreateRound
                                }
                                disabled={
                                    !isReady ||
                                    isCreating
                                }
                                className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-[var(--headline-primary)] px-4 text-[9px] font-semibold text-[var(--surface-base)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isCreating ? (
                                    <>
                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--surface-base)] border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus
                                            size={
                                                12
                                            }
                                        />
                                        Create Round
                                    </>
                                )}
                            </button>
                        </div>
                    </section>

                    {/* =============================================
                        ALL TEAMS
                    ============================================= */}

                    <section className="min-w-0 rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">

                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">

                            <div>
                                <h2 className="text-sm font-semibold text-[var(--headline-primary)]">
                                    All Teams
                                </h2>

                                <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                                    Select teams directly
                                    from the match
                                    selectors.
                                </p>
                            </div>

                            <span className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-1 text-[8px] font-semibold text-[var(--text-secondary)]">
                                {
                                    assignedTeamIds.size
                                }
                                /
                                {teams.length}
                            </span>
                        </div>

                        <div className="divide-y divide-[var(--border-subtle)]">

                            {teams.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <p className="text-[9px] text-[var(--text-muted)]">
                                        No approved teams
                                        found.
                                    </p>
                                </div>
                            ) : (
                                teams.map(
                                    (team) => {
                                        const teamId =
                                            String(
                                                getTeamId(
                                                    team
                                                )
                                            );

                                        const assigned =
                                            assignedTeamIds.has(
                                                teamId
                                            );

                                        return (
                                            <div
                                                key={
                                                    teamId
                                                }
                                                className="flex items-center gap-3 px-4 py-2.5"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[9px] font-semibold text-[var(--text-secondary)]">
                                                    {getTeamName(
                                                        team
                                                    )
                                                        ?.charAt(
                                                            0
                                                        )
                                                        ?.toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[10px] font-semibold text-[var(--headline-primary)]">
                                                        {getTeamName(
                                                            team
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                                                        ID:{" "}
                                                        {
                                                            getTeamId(
                                                                team
                                                            )
                                                        }

                                                        {getTeamTag(
                                                            team
                                                        )
                                                            ? ` · ${getTeamTag(
                                                                  team
                                                              )}`
                                                            : ""}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-2 py-1 text-[7px] font-semibold uppercase tracking-wide ${
                                                        assigned
                                                            ? "border-green-200 bg-green-50 text-green-700"
                                                            : "border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-muted)]"
                                                    }`}
                                                >
                                                    {assigned
                                                        ? "Assigned"
                                                        : "Available"}
                                                </span>
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   MATCH CARD
========================================================= */

function MatchCard({
    match,
    teams,
    assignedTeamIds,
    onSelectTeam,
    onChange,
    onRemove,
    canRemove,
}) {
    return (
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)] p-3">

            <div className="mb-3 flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--headline-primary)] text-[8px] font-bold text-[var(--surface-base)]">
                        {match.match_number}
                    </span>

                    <div>
                        <p className="text-[10px] font-semibold text-[var(--headline-primary)]">
                            Match{" "}
                            {match.match_number}
                        </p>

                        <p className="text-[7px] uppercase tracking-wide text-[var(--text-muted)]">
                            Team vs Opponent
                        </p>
                    </div>
                </div>

                {canRemove && (
                    <button
                        type="button"
                        onClick={() =>
                            onRemove(
                                match.match_number
                            )
                        }
                        className="text-[8px] font-medium text-[var(--text-muted)] hover:text-red-600"
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">

                <TeamSelect
                    label="Team"
                    value={getTeamId(
                        match.team
                    )}
                    teams={teams}
                    assignedTeamIds={
                        assignedTeamIds
                    }
                    ownTeamId={getTeamId(
                        match.team
                    )}
                    opponentId={getTeamId(
                        match.opponent
                    )}
                    onChange={(value) =>
                        onSelectTeam(
                            match.match_number,
                            "team",
                            value
                        )
                    }
                />

                <div className="hidden pb-2 sm:block">
                    <span className="text-[8px] font-bold text-[var(--text-muted)]">
                        VS
                    </span>
                </div>

                <TeamSelect
                    label="Opponent"
                    value={getTeamId(
                        match.opponent
                    )}
                    teams={teams}
                    assignedTeamIds={
                        assignedTeamIds
                    }
                    ownTeamId={getTeamId(
                        match.opponent
                    )}
                    opponentId={getTeamId(
                        match.team
                    )}
                    onChange={(value) =>
                        onSelectTeam(
                            match.match_number,
                            "opponent",
                            value
                        )
                    }
                />
            </div>

            <div className="mt-3 grid gap-3 border-t border-[var(--border-subtle)] pt-3 sm:grid-cols-2">

                <ScheduleInput
                    label="Match Date"
                    type="date"
                    icon={CalendarDays}
                    value={match.date}
                    onChange={(value) =>
                        onChange(
                            match.match_number,
                            "date",
                            value
                        )
                    }
                />

                <ScheduleInput
                    label="Start Time"
                    type="time"
                    icon={Clock3}
                    value={match.time}
                    onChange={(value) =>
                        onChange(
                            match.match_number,
                            "time",
                            value
                        )
                    }
                />
            </div>
        </div>
    );
}

/* =========================================================
   TEAM SELECT
========================================================= */

function TeamSelect({
    label,
    value,
    teams,
    assignedTeamIds,
    ownTeamId,
    opponentId,
    onChange,
}) {
    return (
        <label className="block min-w-0">

            <span className="mb-1.5 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                <UsersRound size={10} />
                {label}
            </span>

            <select
                value={value ?? ""}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="h-9 w-full rounded-md border border-[var(--border-default)] bg-[var(--surface-base)] px-2.5 text-[9px] font-medium text-[var(--headline-primary)] outline-none transition focus:border-[var(--headline-primary)]"
            >
                <option value="">
                    Select team
                </option>

                {teams.map((team) => {
                    const teamId = String(
                        getTeamId(team)
                    );

                    /*
                     * Team is already used in another
                     * match.
                     *
                     * ownTeamId allows the currently
                     * selected team to remain selectable.
                     */
                    const alreadyAssigned =
                        assignedTeamIds.has(
                            teamId
                        ) &&
                        teamId !==
                            String(
                                ownTeamId
                            );

                    /*
                     * Prevent selecting the opponent
                     * as the same team.
                     */
                    const isOpponent =
                        opponentId &&
                        teamId ===
                            String(
                                opponentId
                            );

                    return (
                        <option
                            key={teamId}
                            value={teamId}
                            disabled={
                                alreadyAssigned ||
                                isOpponent
                            }
                        >
                            {getTeamName(team)}
                            {getTeamTag(team)
                                ? ` (${getTeamTag(
                                      team
                                  )})`
                                : ""}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}

/* =========================================================
   SCHEDULE INPUT
========================================================= */

function ScheduleInput({
    label,
    type,
    icon: Icon,
    value,
    onChange,
}) {
    return (
        <label className="block">

            <span className="mb-1.5 flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                <Icon size={10} />
                {label}
            </span>

            <input
                type={type}
                value={value || ""}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="h-9 w-full rounded-md border border-[var(--border-default)] bg-[var(--surface-base)] px-2.5 text-[9px] font-medium text-[var(--headline-primary)] outline-none transition focus:border-[var(--headline-primary)]"
            />
        </label>
    );
}

export default BracketPage;