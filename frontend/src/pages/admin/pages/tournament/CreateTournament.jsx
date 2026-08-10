import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { useUserContext } from "../../../../contexts/UserContext"

import TournamentBasicInfo from "../../components/TournamentBasicInfo"
import TournamentMedia from "../../components/TournamentMedia"
import TournamentSchedule from "../../components/TournamentSchedule"
import TournamentSettings from "../../components/TournamentSetting"
import TournamentRules from "../../components/TournamentRules"

import { tournamentService } from "../../../../services/admin/tournament_service"

const CreateTournament = () => {
    const [basicData, setBasicData] = useState()
    const [mediaData, setMediaData] = useState()
    const [scheduleData, setScheduleData] = useState()
    const [settingData, setSettingData] = useState()
    const [rulesData, setRulesData] = useState()

    const { user } = useUserContext()

    const tournamentMutation = useMutation({
        mutationKey: ["create-tournament", user?.id ?? 0],
        mutationFn: tournamentService.createTournament,
    })

    const tournamentFormSubmission = (e) => {
        e.preventDefault()

        const tournamentData = {
            ...basicData,
            ...scheduleData,
            ...settingData,
            ...rulesData,
        }

    }

    return (
        <section className="flex h-full w-full flex-col">

            <header className="shrink-0 border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">

                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                            <span>Tournaments</span>
                            <span className="opacity-40">/</span>
                            <span style={{ color: "var(--text-primary)" }}>Create Tournament</span>
                        </div>

                        <h1 className="text-[27px] font-semibold leading-tight tracking-[-0.9px] sm:text-[30px]" style={{ color: "var(--headline-primary)" }}>
                            Create Tournament
                        </h1>

                        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            Set up your tournament details, schedule, rewards and registration settings.
                        </p>

                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                        <button type="button" className="h-10 rounded-lg border px-4 text-xs font-medium transition-colors hover:bg-[var(--surface-elevated)] sm:text-[13px]" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                            Save Draft
                        </button>

                        <button type="submit" form="tournament-form" disabled={tournamentMutation.isPending} className="flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-[13px]" style={{ background: "var(--action-primary-bg)", color: "var(--action-primary-text)" }}>
                            {tournamentMutation.isPending ? "Creating..." : "Create Tournament"}

                            {!tournamentMutation.isPending && (
                                <span className="text-sm leading-none" style={{ color: "var(--accent-gold)" }}>
                                    →
                                </span>
                            )}
                        </button>

                    </div>

                </div>
            </header>

            {/* Tournament Form */}
            <form
                id="tournament-form"
                onSubmit={tournamentFormSubmission}
                className="mt-4 min-h-0 flex-1 overflow-y-auto scrollbar-hide"
            >
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">

                    <div className="min-w-0 space-y-4">
                        <TournamentBasicInfo data={basicData} setData={setBasicData} />
                        <TournamentMedia data={mediaData} setData={setMediaData} />
                    </div>

                    <aside className="min-w-0 space-y-4">
                        <TournamentSchedule data={scheduleData} setData={setScheduleData} />
                        <TournamentSettings data={settingData} setData={setSettingData} />
                        <TournamentRules data={rulesData} setData={setRulesData} />
                    </aside>

                </div>

                <div className="h-6 shrink-0" />
            </form>
        </section>
    )
}

export default CreateTournament
