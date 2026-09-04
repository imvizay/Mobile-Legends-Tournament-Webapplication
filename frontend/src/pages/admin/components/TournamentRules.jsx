import React from "react"
import {
    ChevronDown,
    ShieldCheck,
    Tag,
    Wallet,
    Trophy,
    Medal,
    UsersRound,
    GitBranch,
    Shuffle,
    Crown,
    Server,
    CheckCircle2,
} from "lucide-react"


const SectionLabel = ({ children }) => {

    return (
        <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-4" style={{ background: "var(--accent-gold)" }} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                {children}
            </span>
        </div>
    )
}


const FieldLabel = ({ children, required = false }) => {

    return (
        <label className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
            {children}
            {required && <span style={{ color: "var(--accent-gold)" }}>*</span>}
        </label>
    )
}


const SelectField = ({ label, required = false, name, value, onChange, icon: Icon, children }) => {

    return (
        <div className="space-y-1.5">

            <FieldLabel required={required}>
                {label}
            </FieldLabel>


            <div className="relative">

                {Icon && <Icon size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />}

                <select name={name} value={value || ""} onChange={onChange} className={`h-9 w-full appearance-none rounded-lg border bg-transparent text-[10px] outline-none transition-colors focus:border-[var(--accent-gold)] ${Icon ? "pl-8 pr-8" : "px-3 pr-8"}`} style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                    {children}
                </select>

                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />

            </div>

        </div>
    )
}


const MoneyInput = ({ label, name, value, onChange, currency, disabled = false, placeholder = "0.00" }) => {

    const symbol = currency === "USD" ? "$" : "₹"


    return (
        <div className="space-y-1.5">

            <FieldLabel>
                {label}
            </FieldLabel>


            <div className="relative">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {symbol}
                </span>


                <input type="number" name={name} min="0" value={value || ""} onChange={onChange} disabled={disabled} placeholder={placeholder} className="h-9 w-full rounded-lg border bg-transparent pl-8 pr-3 text-[10px] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)] disabled:cursor-not-allowed disabled:opacity-45" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />

            </div>

        </div>
    )
}


const TournamentRules = ({ data, setData }) => {

    const handleInputChange = (e) => {

        const { name, value } = e.target

        setData(prev => ({
            ...prev,
            [name]: value,
        }))

    }


    const isPaidTournament = data?.entry_type === "paid"


    return (
        <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>


            {/* Header */}

            <div className="flex items-start gap-3 border-b px-4 py-3.5" style={{ borderColor: "var(--border-subtle)" }}>

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                    <ShieldCheck size={14} strokeWidth={1.7} />
                </div>


                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                            Rules & Configuration
                        </h2>


                        <span className="rounded-full border px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                            Rules
                        </span>

                    </div>


                    <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Configure access, eligibility, rewards and competition structure.
                    </p>

                </div>

            </div>


            <div className="space-y-5 p-4">


                {/* Tournament Access */}

                <div>

                    <SectionLabel>
                        Tournament Access
                    </SectionLabel>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <SelectField label="Tournament Category" required name="category" value={data?.category} onChange={handleInputChange} icon={Tag}>
                            <option value="">Select category</option>
                            <option value="weekly">Weekly Tournament</option>
                            <option value="monthly">Monthly Tournament</option>
                            <option value="year_finale">Year Finale</option>
                        </SelectField>


                        <SelectField label="Competition Type" required name="competition_type" value={data?.competition_type} onChange={handleInputChange} icon={Trophy}>
                            <option value="">Select type</option>
                            <option value="ranked">Ranked Competition</option>
                            <option value="casual">Casual Competition</option>
                            <option value="premium">Premium Competition</option>
                        </SelectField>


                        <SelectField label="Registration Access" required name="registration_access" value={data?.registration_access} onChange={handleInputChange} icon={UsersRound}>
                            <option value="">Select access</option>
                            <option value="public">Public Registration</option>
                            <option value="private">Private Registration</option>
                            <option value="invite_only">Invite Only</option>
                        </SelectField>


                        <SelectField label="Registration Approval" name="registration_approval" value={data?.registration_approval || "automatic"} onChange={handleInputChange} icon={CheckCircle2}>
                            <option value="automatic">Automatic Approval</option>
                            <option value="admin">Admin Approval</option>
                        </SelectField>

                    </div>

                </div>


                {/* Entry & Rewards */}

                <div>

                    <SectionLabel>
                        Entry & Rewards
                    </SectionLabel>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <SelectField label="Tournament Entry" required name="entry_type" value={data?.entry_type} onChange={handleInputChange} icon={Wallet}>
                            <option value="">Select entry type</option>
                            <option value="free">Free Entry</option>
                            <option value="paid">Paid Entry</option>
                            <option value="invitee_only">Invitee Only</option>
                        </SelectField>


                        <SelectField label="Currency" name="currency" value={data?.currency || "INR"} onChange={handleInputChange}>
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                        </SelectField>


                        <MoneyInput label="Entry Fee" name="entry_fee" value={data?.entry_fee} onChange={handleInputChange} currency={data?.currency || "INR"} disabled={!isPaidTournament} />


                        <MoneyInput label="Prize Pool" name="prize_pool" value={data?.prize_pool} onChange={handleInputChange} currency={data?.currency || "INR"} />

                    </div>


                    <div className="mt-3 flex items-start gap-2.5 rounded-lg border px-3 py-2.5" style={{ background: "var(--surface-elevated)", borderColor: isPaidTournament ? "rgba(200,176,122,0.20)" : "var(--border-subtle)" }}>

                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.10)", color: "var(--accent-gold)" }}>
                            <Wallet size={10} />
                        </div>


                        <p className="text-[9px] leading-relaxed" style={{ color: "var(--text-muted)" }}>

                            {isPaidTournament
                                ? "Players will be required to complete the tournament contribution before their registration is confirmed."
                                : "Entry fee is disabled until this tournament is configured as a paid competition."
                            }

                        </p>

                    </div>

                </div>


                {/* Player Eligibility */}

                <div>

                    <SectionLabel>
                        Player Eligibility
                    </SectionLabel>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <SelectField label="Minimum Rank" name="minimum_rank" value={data?.minimum_rank} onChange={handleInputChange} icon={Medal}>
                            <option value="">Any Rank</option>
                            <option value="epic">Epic or Above</option>
                            <option value="legend">Legend or Above</option>
                            <option value="mythic">Mythic or Above</option>
                            <option value="mythical_honor">Mythical Honor or Above</option>
                            <option value="mythical_glory">Mythical Glory or Above</option>
                        </SelectField>


                        <SelectField label="Minimum Account Level" name="minimum_level" value={data?.minimum_level} onChange={handleInputChange} icon={Crown}>
                            <option value="">No Requirement</option>
                            <option value="10">Level 10+</option>
                            <option value="20">Level 20+</option>
                            <option value="30">Level 30+</option>
                            <option value="50">Level 50+</option>
                        </SelectField>


                        <div className="sm:col-span-2">

                            <SelectField label="Game Server" name="server_region" value={data?.server_region} onChange={handleInputChange} icon={Server}>
                                <option value="">All Supported Servers</option>
                                <option value="india">India</option>
                                <option value="asia">Asia</option>
                                <option value="sea">South East Asia</option>
                                <option value="global">Global</option>
                            </SelectField>

                        </div>

                    </div>

                </div>


                {/* Competition Structure */}

                <div>

                    <SectionLabel>
                        Competition Structure
                    </SectionLabel>


                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <SelectField label="Bracket Format" required name="bracket_format" value={data?.bracket_format} onChange={handleInputChange} icon={GitBranch}>
                            <option value="">Select bracket</option>
                            <option value="single_elimination">Single Elimination</option>
                            <option value="double_elimination">Double Elimination</option>
                            <option value="round_robin">Round Robin</option>
                        </SelectField>


                        <SelectField label="Seeding Method" name="seeding_method" value={data?.seeding_method} onChange={handleInputChange} icon={Shuffle}>
                            <option value="">Select method</option>
                            <option value="random">Random Draw</option>
                            <option value="rank_based">Rank Based</option>
                            <option value="registration_order">Registration Order</option>
                            <option value="manual">Manual Seeding</option>
                        </SelectField>

                    </div>

                </div>


            </div>

        </section>
    )
}


export default TournamentRules