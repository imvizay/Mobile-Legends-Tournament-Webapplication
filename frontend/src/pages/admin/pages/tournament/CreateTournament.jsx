import React, { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { X, TriangleAlert } from 'lucide-react'

import { useUserContext } from "../../../../contexts/UserContext"

import TournamentBasicInfo from "../../components/TournamentBasicInfo"
import TournamentMedia from "../../components/TournamentMedia"
import TournamentSchedule from "../../components/TournamentSchedule"
import TournamentSettings from "../../components/TournamentSetting"
import TournamentRules from "../../components/TournamentRules"

import { tournamentService } from "../../../../services/admin/tournament_service"
import { validateTournamentData } from "../../../../utils/validators/tournament_creation"

const CreateTournament = () => {
    const [draftLoaded, setDraftLoaded] = useState(false)

    const [basicData, setBasicData] = useState({})
    const [mediaData, setMediaData] = useState({})
    const [scheduleData, setScheduleData] = useState({
        reg_open_date: "",
        reg_close_date: "",
        reg_open_time: "",
        reg_close_time: "",

        tournament_start_date: "",
        tournament_end_date: "",
        tournament_start_time: "",
        tournament_end_time: "",

        check_in: "",
        grace_period: ""
    })
    const [rulesData, setRulesData] = useState({})

    const [tournamentError, setErrors] = useState(null)

    const { user } = useUserContext()

    const tournamentMutation = useMutation({
        mutationKey: ["create-tournament", user?.id ?? 0],
        mutationFn: tournamentService.createTournament,
    })

    // Remove media files from being stored in localstorage
    const removedMediaFiles = (data) => {
        const { background_image, banner_image, ...rest } = data
        return rest
    }

    // protect data from accidental refresh or tab changes
    useEffect(() => {

        if (!draftLoaded) return

        localStorage.setItem("tournament-draft",
            JSON.stringify({
                basicData,
                mediaData: removedMediaFiles(mediaData),
                rulesData,
                scheduleData
            }))

    }, [draftLoaded, basicData, mediaData, rulesData, scheduleData])

    // restore draft data
    useEffect(() => {

        const savedDraft = localStorage.getItem('tournament-draft')

        if (savedDraft) {

            const data = JSON.parse(savedDraft)

            setBasicData(data.basicData ?? {})
            setMediaData(data.mediaData ?? {})
            setRulesData(data.rulesData ?? {})
            setScheduleData(data.scheduleData ?? {})
        }
        setDraftLoaded(true)
    }, [])

    // show error modal when form validation fails
    if (tournamentError) {

        return (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-6 backdrop-blur-sm">

                <section className="bg-[var(--surface-base)] border border-[var(--border-default)] w-full max-w-md overflow-hidden rounded-xl border shadow-2xl animate-[slideDown_0.35s_ease-out]">

                    <div
                        className="flex border border-[var(--border-subtle)] items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", }}>
                                <TriangleAlert size={16} />
                            </div>

                            <div>
                                <h2 className="text-sm text-[var(--text-primary)] font-semibold"> Fix these issues </h2>
                                <p className="text-[10px] text-[var(--text-muted)]"> Please review the following fields. </p>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setErrors(null)}
                            className="flex text-[var(--text-muted)] h-8 w-8 items-center justify-center rounded-lg
                            transition-colors hover:bg-[var(--surface-elevated)]">
                            <X size={17} strokeWidth={1.8} />
                        </button>
                    </div>

                    {/* Errors */}
                    <div className="space-y-2.5 px-4 py-4">
                        {Object.entries(tournamentError).map(([key, value], index) => (
                            <div
                                key={key}
                                className="flex items-start gap-2.5 rounded-lg border px-3 py-2.5 border border-[var(--border-subtle)] bg-[var(--surface-elevated)] ">
                                <span
                                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center
                                    justify-center rounded-full text-[9px] font-semibold"
                                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", }}>
                                    {index + 1}
                                </span>

                                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed"> {value} </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )
    }


    // form submission
    const tournamentFormSubmission = async (e) => {
        e.preventDefault()

        const { isValid, errors } = validateTournamentData(scheduleData)

        if (!isValid) {
            setErrors(errors)
            return
        }

        setErrors(null)
        const tournamentData = { ...basicData, ...scheduleData, ...rulesData, ...mediaData }

        console.log('tournament merged data', tournamentData)

        const formData = new FormData()

        Object.entries(tournamentData).forEach(([key, value]) => {

            if (key === "background_image" || key === "banner_image") {
                if (value instanceof File) {
                    formData.append(key, value)
                }
                return
            }
            if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value)
            }
        })

        try {
            const response = await tournamentMutation.mutateAsync(formData)
        }
        catch (error) {
            console.log("Error:", error)
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

                        <TournamentRules data={rulesData} setData={setRulesData} />
                    </aside>

                </div>

                <div className="h-6 shrink-0" />
            </form>
        </section>
    )
}

export default CreateTournament
