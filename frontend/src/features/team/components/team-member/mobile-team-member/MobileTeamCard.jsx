import React from 'react'
import { EllipsisVertical } from 'lucide-react'

function MobileTeamCard({item}) {
    return (

        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3 lg:hidden">

            <div className="flex flex-1 items-start gap-3 min-w-0">

                {/* Number */}

                <span className="w-8 shrink-0 text-[28px] font-black leading-none text-neutral-300">
                    {String(item.id).padStart(2, "0")}
                </span>

                {/* Content */}

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                        <h6 className="truncate text-sm font-semibold text-[var(--headline-primary)]">
                            {item.name}
                        </h6>

                        {item === 1 && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold uppercase text-amber-700">
                                Captain
                            </span>
                        )}

                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-[var(--text-secondary)]">

                        <span>
                            <span className="font-medium">ID</span> : {item.mlbb}
                        </span>

                        <span>
                            <span className="font-medium">Server</span> : {item.server}
                        </span>

                    </div>

                </div>

            </div>

            <button className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-neutral-100">
                <EllipsisVertical size={16} />
            </button>

        </div>
    )
}

export default MobileTeamCard