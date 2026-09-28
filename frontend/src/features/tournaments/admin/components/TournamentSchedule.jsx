import React from "react"
import { CalendarDays, Clock3, Timer, Globe2, CalendarClock,Trophy } from "lucide-react"

const DateTimeField = ({ label, required = false, dateName, timeName, handleInputChange, data }) => {

    return (
        <div className="relative">

            <div className="mb-2 flex items-center justify-between">
                <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {label} {required && <span style={{ color: "var(--accent-gold)" }}>*</span>}
                </label>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                <div className="relative">
                    <CalendarDays size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                    <input name={dateName} value={data[dateName] || ""} onChange={handleInputChange} type="date" className="h-10 w-full rounded-lg border bg-transparent pl-9 pr-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                </div>

                <div className="relative">
                    <Clock3 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

                    <input name={timeName} value={data[timeName] || ""} onChange={handleInputChange} type="time" className="h-10 w-full rounded-lg border bg-transparent pl-9 pr-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                </div>

            </div>

        </div>
    )
}


const ScheduleGroup = ({ title, children, icon: Icon }) => {

    return (
        <div>

            <div className="mb-4 flex items-center gap-2">

                <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                    <Icon size={13} strokeWidth={1.8} />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                    {title}
                </span>

                <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />

            </div>

            {children}

        </div>
    )
}


const TournamentSchedule = ({ data, setData }) => {

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

            <div className="flex items-start gap-3 border-b px-4 py-3.5" style={{ borderColor: "var(--border-subtle)" }}>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                    <CalendarClock size={15} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">

                    <div className="flex items-center gap-2">
                        <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Tournament Schedule</h2>

                        <span className="rounded border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                            Timeline
                        </span>
                    </div>

                    <p className="mt-0.5 text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Define registration windows and tournament timings.
                    </p>

                </div>

            </div>


            <div className="space-y-6 p-4">


                {/* Registration */}

                <ScheduleGroup title="Registration" icon={CalendarDays}>

                    <div className="space-y-5">

                        <DateTimeField label="Registration Opens" required dateName="reg_open_date" timeName="reg_open_time" handleInputChange={handleInputChange} data={data} />

                        <div className="ml-3 h-3 border-l" style={{ borderColor: "var(--border-default)" }} />

                        <DateTimeField label="Registration Closes" required dateName="reg_close_date" timeName="reg_close_time" handleInputChange={handleInputChange} data={data} />

                    </div>

                </ScheduleGroup>


                {/* Tournament */}

                <ScheduleGroup title="Tournament" icon={Trophy}>

                    <div className="space-y-5">

                        <DateTimeField label="Tournament Starts" required dateName="tournament_start_date" timeName="tournament_start_time" handleInputChange={handleInputChange} data={data} />

                        <div className="ml-3 h-3 border-l" style={{ borderColor: "var(--border-default)" }} />

                        <DateTimeField label="Tournament Ends" required dateName="tournament_end_date" timeName="tournament_end_time" handleInputChange={handleInputChange} data={data} />

                    </div>

                </ScheduleGroup>


                {/* Operational Settings */}

                <ScheduleGroup title="Match Settings" icon={Timer}>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <div className="space-y-1.5">

                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Check-in Window
                            </label>

                            <select name="check_in" value={data.check_in || ""} onChange={handleInputChange} className="h-10 w-full rounded-lg border bg-transparent px-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                <option value="">Select window</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>

                        </div>


                        <div className="space-y-1.5">

                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Grace Period
                            </label>

                            <select name="grace_period" value={data.grace_period || ""} onChange={handleInputChange} className="h-10 w-full rounded-lg border bg-transparent px-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                <option value="">Select period</option>
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                            </select>

                        </div>

                    </div>

                </ScheduleGroup>


                {/* Timezone */}

                <div className="border-t pt-5" style={{ borderColor: "var(--border-subtle)" }}>

                    <div className="mb-3 flex items-center gap-2">

                        <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "var(--surface-elevated)", color: "var(--text-muted)" }}>
                            <Globe2 size={13} />
                        </div>

                        <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                            Tournament Timezone <span style={{ color: "var(--accent-gold)" }}>*</span>
                        </label>

                    </div>

                    <select name="timezone" value={data.timezone || "Asia/Kolkata"} onChange={handleInputChange} className="h-10 w-full rounded-lg border bg-transparent px-3 text-[11px] outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                        <option value="Asia/Kolkata">(GMT+05:30) India</option>
                        <option value="UTC">(GMT+00:00) UTC</option>
                        <option value="Asia/Singapore">(GMT+08:00) Singapore</option>
                    </select>

                </div>

            </div>

        </section>
    )
}

export default TournamentSchedule