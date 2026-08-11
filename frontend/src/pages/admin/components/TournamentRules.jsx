import React from "react"
import { ChevronDown, ShieldCheck } from "lucide-react"

const TournamentRules = ({ data,setData }) => {

    const handleInputChange = (e) => {
        const {name,value} = e.target

        setData(prev=>({
            ...prev,[name]:value
        }))

    }

    return (
        <section className="overflow-hidden rounded-xl border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>

            {/* Header */}
            <div className="flex items-start gap-3 border-b px-4 py-3.5" style={{ borderColor: "var(--border-subtle)" }}>

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "rgba(200,176,122,0.12)", color: "var(--accent-gold)" }}>
                    <ShieldCheck size={14} strokeWidth={1.7} />
                </div>

                <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Tournament Rules & Configuration</h2>
                    <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>Define tournament access, eligibility, bracket structure and player guidelines.</p>
                </div>

            </div>

            <div className="space-y-6 p-4">

                {/* Tournament Classification */}
                <div>

                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-5" style={{ background: "var(--accent-gold)" }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Tournament Classification</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Tournament Category
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select name="category" 
                                value={data?.category || ""} 
                                onChange={handleInputChange} className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select category</option>
                                    <option value="weekly">Weekly Tournament</option>
                                    <option value="monthly">Monthly Tournament</option>
                                    <option value="year_finale">Year Finale</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Competition Type */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Competition Type
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select 
                                name="competition_type" 
                                value={data?.competition_type || ""} 
                                onChange={handleInputChange} 

                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select type</option>
                                    <option value="competitive">Competitive</option>
                                    <option value="casual">Casual</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Registration Access */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Registration Access
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select 
                                name="registration_access" 
                                value={data?.registration_access || ""} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select access</option>
                                    <option value="open">Open Registration</option>
                                    <option value="invite_only">Invite Only</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Approval */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Registration Approval</label>

                            <div className="relative">
                                <select 
                                name="registration_approval" 
                                value={data?.registration_approval || "automatic"} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="automatic">Automatic Approval</option>
                                    <option value="admin">Admin Approval</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Entry & Prize */}
                <div>

                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-5" style={{ background: "var(--accent-gold)" }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Entry & Prize</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Entry Type */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Tournament Entry
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select 
                                name="entry_type" 
                                value={data?.entry_type || ""} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select entry type</option>
                                    <option value="free">Free Entry</option>
                                    <option value="paid">Paid Entry</option>
                                    <option value="invitee_only">Invitee Only</option>

                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Currency */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Currency</label>

                            <div className="relative">
                                <select 
                                name="currency" 
                                value={data?.currency || "INR"} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Entry Fee */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Entry Fee</label>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>₹</span>

                                <input type="number" name="entry_fee" min="0" 
                                value={data?.entry_fee || ""} 
                                onChange={handleInputChange} 
                                disabled={data?.entry_type !== "paid"} 
                                placeholder="0.00" 
                                className="h-9 w-full rounded-lg border bg-transparent pl-8 pr-3 text-xs outline-none transition-colors focus:border-[var(--accent-gold)] disabled:cursor-not-allowed disabled:opacity-50" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                            </div>
                        </div>

                        {/* Prize Pool */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Prize Pool</label>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-muted)" }}>₹</span>

                                <input 
                                type="number" 
                                name="prize_pool" min="0" 
                                value={data?.prize_pool || ""} 
                                onChange={handleInputChange} placeholder="0.00" className="h-9 w-full rounded-lg border bg-transparent pl-8 pr-3 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                            </div>
                        </div>

                    </div>

                </div>

                {/* Eligibility */}
                <div>

                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-5" style={{ background: "var(--accent-gold)" }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Eligibility</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Minimum Rank */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Minimum Rank</label>

                            <div className="relative">
                                <select 
                                name="minimum_rank" 
                                value={data?.minimum_rank || ""} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Any Rank</option>
                                    <option value="epic">Epic or Above</option>
                                    <option value="legend">Legend or Above</option>
                                    <option value="mythic">Mythic or Above</option>
                                    <option value="mythical_glory">Mythical Glory or Above</option>
                                    <option value="mythical_immortal">Mythical Immortal</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Account Level */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Minimum Account Level</label>

                            <input 
                            type="number" 
                            name="minimum_account_level" min="1" 
                            value={data?.minimum_account_level || ""} 
                            onChange={handleInputChange} 
                            placeholder="e.g. 20" 
                            className="h-9 w-full rounded-lg border bg-transparent px-3 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                        </div>

                        {/* Server */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Server / Region</label>

                            <div className="relative">
                                <select 
                                name="server" 
                                value={data?.server || ""} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Any Server</option>
                                    <option value="india">India</option>
                                    <option value="singapore">Singapore</option>
                                    <option value="indonesia">Indonesia</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Competition Structure */}
                <div>

                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-5" style={{ background: "var(--accent-gold)" }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Competition Structure</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Bracket Format */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                                Bracket Format
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select 
                                name="bracket_format" 
                                value={data?.bracket_format || ""} 
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select bracket</option>
                                    <option value="single_elimination">Single Elimination</option>
                                    <option value="double_elimination">Double Elimination</option>
                                    <option value="round_robin">Round Robin</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                        {/* Seeding */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Seeding Method</label>

                            <div className="relative">
                                <select 
                                name="seeding_method" 
                                value={data?.seeding_method || ""}
                                onChange={handleInputChange} 
                                className="h-9 w-full appearance-none rounded-lg border bg-transparent px-3 pr-8 text-xs outline-none transition-colors focus:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <option value="">Select method</option>
                                    <option value="random">Random Draw</option>
                                    <option value="rank_based">Rank Based</option>
                                    <option value="registration_order">Registration Order</option>
                                    <option value="manual">Manual Seeding</option>
                                </select>

                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </section>
    )
}

export default TournamentRules