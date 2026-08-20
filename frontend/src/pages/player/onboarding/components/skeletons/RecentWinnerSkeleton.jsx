import React from "react";

function RecentWinnerHistorySkeleton({ historyCount = 4 }) {
    return (
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">
            {/* =========================================================
                FEATURED TOURNAMENT SKELETON
            ========================================================= */}
            <div className="relative h-[220px] overflow-hidden xs:h-[230px] sm:h-[260px] md:h-[290px] lg:h-[310px]">
                {/* Background */}
                <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                {/* Tournament label */}
                <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                    <Skeleton className="h-7 w-28 rounded-md bg-white/10" />
                </div>

                {/* Navigation */}
                <div className="absolute right-3 top-3 flex items-center gap-1 sm:right-5 sm:top-5 sm:gap-1.5">
                    <Skeleton className="size-7 rounded-full bg-white/10 sm:size-8" />
                    <Skeleton className="size-7 rounded-full bg-white/10 sm:size-8" />
                </div>

                {/* Play Button */}
                <Skeleton className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 sm:size-14 md:size-16" />

                {/* Bottom Content */}
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
                    <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            {/* Season */}
                            <Skeleton className="h-2 w-16 bg-white/10" />

                            {/* Title */}
                            <Skeleton className="mt-2 h-6 w-[70%] max-w-[360px] bg-white/10 sm:h-7 md:h-8" />

                            {/* Subtitle */}
                            <Skeleton className="mt-2 h-2 w-28 bg-white/10 sm:w-36" />
                        </div>

                        {/* Duration */}
                        <Skeleton className="h-6 w-12 shrink-0 rounded-md bg-white/10" />
                    </div>
                </div>
            </div>

            {/* =========================================================
                WINNER RESULT SKELETON
            ========================================================= */}
            <div className="border-b border-[var(--border-default)] px-3 py-3 sm:px-5 sm:py-4">
                {/* Teams + Score */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* Winner */}
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <Skeleton className="size-9 shrink-0 rounded-full sm:size-11" />

                        <div className="min-w-0 space-y-2">
                            <Skeleton className="h-2 w-14" />
                            <Skeleton className="h-3 w-24 sm:w-28" />
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex shrink-0 flex-col items-center gap-2 px-1 sm:px-2">
                        <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
                        <Skeleton className="h-2 w-14" />
                    </div>

                    {/* Runner Up */}
                    <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right sm:gap-3">
                        <div className="min-w-0 space-y-2">
                            <Skeleton className="ml-auto h-2 w-16" />
                            <Skeleton className="ml-auto h-3 w-24 sm:w-28" />
                        </div>

                        <Skeleton className="size-9 shrink-0 rounded-full sm:size-11" />
                    </div>
                </div>

                {/* Tournament Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-4">
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="size-3 rounded-full" />
                        <Skeleton className="h-2 w-20" />
                    </div>

                    <span className="hidden size-1 rounded-full bg-[var(--border-default)] sm:block" />

                    <div className="flex items-center gap-1.5">
                        <Skeleton className="size-3 rounded-full" />
                        <Skeleton className="h-2 w-14" />
                    </div>

                    <span className="hidden size-1 rounded-full bg-[var(--border-default)] sm:block" />

                    <Skeleton className="ml-auto h-2.5 w-20" />
                </div>
            </div>

            {/* =========================================================
                TOURNAMENT HISTORY SKELETON
            ========================================================= */}
            <div className="px-3 py-3 sm:px-4">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between px-0.5 sm:px-1">
                    <Skeleton className="h-2 w-28" />
                    <Skeleton className="h-2 w-8" />
                </div>

                {/* History Cards */}
                <div className="flex gap-1.5 overflow-hidden pb-1 sm:gap-2">
                    {Array.from({ length: historyCount }).map((_, index) => (
                        <HistoryCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   HISTORY CARD
========================================================= */

function HistoryCardSkeleton() {
    return (
        <div
            className="
                flex min-w-[145px] shrink-0 items-center gap-2
                rounded-md
                border border-[var(--border-default)]
                bg-[var(--surface-base)]
                px-2 py-1.5
                sm:min-w-[170px] sm:gap-2.5 sm:px-2.5 sm:py-2
            "
        >
            {/* Logo */}
            <Skeleton className="size-7 shrink-0 rounded-md sm:size-8" />

            {/* Text */}
            <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-2.5 w-[85%]" />
                <Skeleton className="h-1.5 w-[55%]" />
            </div>

            {/* Arrow */}
            <Skeleton className="size-3 shrink-0 rounded-full" />
        </div>
    );
}

/* =========================================================
   SHIMMER
========================================================= */

function Skeleton({ className = "" }) {
    return (
        <div
            className={`
                relative
                overflow-hidden
                rounded
                bg-black/[0.055]
                animate-pulse
                ${className}
            `}
        >
            <div
                className="
                    absolute inset-0
                    -translate-x-full
                    animate-[skeleton-shimmer_1.6s_ease-in-out_infinite]
                    bg-gradient-to-r
                    from-transparent
                    via-white/55
                    to-transparent
                "
            />
        </div>
    );
}

export default RecentWinnerHistorySkeleton;