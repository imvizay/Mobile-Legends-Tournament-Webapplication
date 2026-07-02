import React from "react"
import { CalendarDays, Clock3 } from "lucide-react"

const DateTimeField = ({ label, required = false,dateName,timeName,handleInputChange,data }) => {

    return (
        <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}

            <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="relative">
                    <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)" }} />
                    <input
                        name={dateName}
                        value={data[dateName] || ""}
                        onChange={handleInputChange}
                        type="date"

                        className="h-9 w-full rounded-lg border bg-transparent pl-8 pr-2 text-[10px] outline-none focus:border-[var(--accent-gold)]"
                        style={{
                            borderColor: "var(--border-default)",
                            color: "var(--text-primary)",
                        }}
                    />
                </div>

                <div className="relative">
                    <Clock3 size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input 
                        name={timeName}
                        value={data[timeName] || ""}
                        onChange={handleInputChange}

                        type="time"
                        className="h-9 w-full rounded-lg border bg-transparent pl-8 pr-2 text-[10px] outline-none focus:border-[var(--accent-gold)]"
                        style={{
                            borderColor: "var(--border-default)",
                            color: "var(--text-primary)",
                        }}
                    />
                </div>
            </div>
        </label>
    )
}

const TournamentSchedule = ({data,setData}) => {


    const handleInputChange = (e) => {
        const {name,value} = e.target

        setData(prev => ({
            ...prev,[name]:value
        }))
    }

    return (
        <section
            className="rounded-xl border"
            style={{
                background: "var(--surface-base)",
                borderColor: "var(--border-default)",
            }}
        >
            <div
                className="border-b px-5 py-4"
                style={{ borderColor: "var(--border-subtle)" }}
            >
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Tournament Schedule
                </h2>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    Configure registration and tournament timings.
                </p>
            </div>

            <div className="space-y-5 p-5">
                <div>
                    <p
                        className="mb-3 text-[9px] font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Registration
                    </p>

                    <div className="space-y-4">
                        <DateTimeField 
                        label="Registration Opens" 
                        required
                        dateName="reg_open_date"
                        timeName="reg_open_time"
                        handleInputChange={handleInputChange}
                        data={data}

                        />

                        <DateTimeField 
                        label="Registration Closes" 
                        required
                        dateName="reg_close_date"
                        timeName="reg_close_time"
                        handleInputChange={handleInputChange}
                        data={data}
                        />

                    </div>
                </div>

                <div>
                    <p
                        className="mb-3 text-[9px] font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Tournament
                    </p>

                    <div className="space-y-4">
                        <DateTimeField 
                            label="Tournament Start" 
                            required 
                            dateName="tournament_start_date"
                            timeName="tournament_start_time"
                            handleInputChange={handleInputChange}
                            data={data}

                        />

                        <DateTimeField 
                            label="Tournament End" 
                            required
                            dateName="tournament_end_date"
                            timeName="tournament_end_time"
                            handleInputChange={handleInputChange}
                            data={data}

                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                            Check-in
                        </label>
                        <select
                            name="check_in_time"
                            value={data.check_in}
                            onChange={handleInputChange}

                            className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none focus:border-[var(--accent-gold)]"
                            style={{
                                borderColor: "var(--border-default)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <option value="15-min">15 min</option>
                            <option value="30-min">30 min</option>
                            <option value="45-min">45 min</option>
                            <option value="60-min">60 min</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                            Grace Period
                        </label>
                        <select
                            name="grace_period"
                            value={data.grace_period}
                            onChange={handleInputChange}
                            className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none focus:border-[var(--accent-gold)]"
                            style={{
                                borderColor: "var(--border-default)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <option value="5-min">5 min</option>
                            <option value="10-min">10 min</option>
                            <option value="15-min">15 min</option>
                            <option value="30-min">30 min</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                        Time Zone
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                        name="timezone"
                        value={data.timezone}
                        onChange={handleInputChange}
                        className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none focus:border-[var(--accent-gold)]"
                        style={{
                            borderColor: "var(--border-default)",
                            color: "var(--text-primary)",
                        }}
                    >
                        <option>(GMT+05:30) Asia/Kolkata</option>
                        <option>(GMT+00:00) UTC</option>
                        <option>(GMT+08:00) Asia/Singapore</option>
                    </select>
                </div>
            </div>
        </section>
    )
}

export default TournamentSchedule