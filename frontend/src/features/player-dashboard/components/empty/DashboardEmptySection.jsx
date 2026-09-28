import React from "react"
import { Compass } from "lucide-react"

function DashboardSectionEmpty({
    title = "Nothing here yet",
    description = "There is no data available at the moment.",
}) {
    return (
        <div className="relative flex min-h-[190px] w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] px-5 py-10 sm:min-h-[210px] sm:px-8">
            {/* Background atmosphere */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/[0.035] via-transparent to-transparent" />

            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[var(--accent-gold)]/[0.035] blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 left-0 h-px w-28 bg-gradient-to-r from-[var(--accent-gold)]/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 max-w-[380px] text-center">

                {/* Icon */}
                <div className="relative mx-auto mb-4 flex size-11 items-center justify-center rounded-full border border-[var(--accent-gold)]/20 bg-[var(--surface-elevated)]">
                    <div className="absolute inset-[-5px] rounded-full border border-[var(--accent-gold)]/[0.06]" />

                    <Compass
                        className="size-[17px] text-[var(--accent-gold)]"
                        strokeWidth={1.4}
                    />
                </div>

                {/* Label */}
                <div className="mb-1.5 flex items-center justify-center gap-2">
                    <span className="h-px w-5 bg-[var(--accent-gold)]/35" />

                    <span className="font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                        Nothing Yet
                    </span>

                    <span className="h-px w-5 bg-[var(--accent-gold)]/35" />
                </div>

                {/* Title */}
                <h3 className="font-['Rajdhani'] text-[18px] font-bold uppercase leading-none tracking-[-0.01em] text-[var(--text-primary)] sm:text-[19px]">
                    {title}
                </h3>

                {/* Description */}
                <p className="mx-auto mt-2 max-w-[340px] text-[9px] leading-[1.7] text-[var(--text-muted)] sm:text-[10px]">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default DashboardSectionEmpty