import React from 'react'
import { EllipsisVertical } from 'lucide-react'


function DesktopTeamCard({item}) {

    console.log("ITEM:",item)

    return (
        <div className="hidden lg:grid lg:grid-cols-[55px_1fr_150px_80px_110px_90px_40px] items-center gap-4 border-b border-[var(--border-default)] px-6 py-3 transition-all duration-200 hover:bg-black/[0.02] last:border-0">

            {/* Number */}

            <div className="flex justify-center">
                <span className="select-none text-[34px] font-black leading-none tracking-tight text-neutral-300">
                    {String(item.id).padStart(2, "0")}
                </span>
            </div>

            {/* Player */}

            <div className="flex items-center gap-3 min-w-0">

                <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-200 shrink-0">
                    <img src="/avatar.png" alt="" className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <h5 className="truncate text-[15px] font-semibold text-[var(--headline-primary)]">
                            {item.name}
                        </h5>

                        {item === 1 && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-amber-700">
                                Captain
                            </span>
                        )}

                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)]">
                        {item?.role}
                    </p>

                </div>

            </div>

            {/* MLBB */}

            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    MLBB ID
                </span>
                <span className="text-sm font-medium">
                    {item.mlbb}
                </span>
            </div>

            {/* Server */}

            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    Server
                </span>
                <span className="text-sm font-medium">
                    {item.server}
                </span>
            </div>

            {/* Country */}
            <div className="hidden xl:flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Country</span>
                <span className="text-sm font-medium">{item === 6 ? "India" : "Bangladesh"}</span>
            </div>

            {/* Status */}

            <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

                <span className="text-xs font-medium">
                    {item.status}
                </span>

            </div>

            {/* Menu */}

            <button className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-neutral-100">
                <EllipsisVertical size={16} />
            </button>

        </div>
    )
}

export default DesktopTeamCard