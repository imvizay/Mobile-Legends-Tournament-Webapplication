import React from "react";

function UpcomingTournamentGridSkeleton({ count = 4 }) {
    return (
        <section className="w-full min-w-0">
            {/* Section Header */}
            <div className="mb-4 flex animate-pulse items-end justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-5 rounded-full bg-[var(--accent-gold)]/25" />

                        <Skeleton className="h-2 w-16" />
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton className="h-5 w-48" />

                        <span className="hidden h-4 w-px bg-[var(--border-default)] sm:block" />

                        <Skeleton className="hidden h-2 w-16 sm:block" />
                    </div>
                </div>

                {/* Slider arrows */}
                <div className="flex shrink-0 gap-1.5">
                    <Skeleton className="size-8 rounded-none" />
                    <Skeleton className="size-8 rounded-none" />
                </div>
            </div>

            {/* Skeleton Slider */}
            <div className="w-full min-w-0 overflow-hidden">
                <div className="flex w-max gap-3 pb-1">
                    {Array.from({ length: count }).map((_, index) => (
                        <UpcomingTournamentCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function UpcomingTournamentCardSkeleton() {
    return (
        <article
            className="
                relative w-[270px] shrink-0 overflow-hidden rounded-lg
                border border-[var(--border-default)]
                bg-[var(--surface-base)]
                sm:w-[285px]
            "
        >
            {/* Image Skeleton */}
            <div className="relative h-[165px] overflow-hidden bg-black/[0.06]">
                <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

                {/* Top badges */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <Skeleton className="h-6 w-[82px] rounded-sm" />
                    <Skeleton className="h-6 w-[62px] rounded-sm" />
                </div>

                {/* Bottom tournament information */}
                <div className="absolute inset-x-3 bottom-3">
                    <Skeleton className="mb-2 h-2 w-16 bg-white/10" />

                    <Skeleton className="h-6 w-[75%] bg-white/10" />

                    <Skeleton className="mt-2 h-2 w-[48%] bg-white/10" />
                </div>
            </div>

            {/* Content */}
            <div className="px-3 pb-3 pt-3">
                {/* Stats */}
                <div className="grid grid-cols-3">
                    <SkeletonStat />
                    <SkeletonStat />
                    <SkeletonStat last />
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-[var(--border-default)]" />

                {/* Registration */}
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="space-y-2">
                        <Skeleton className="h-2 w-20" />
                        <Skeleton className="h-2 w-28" />
                    </div>

                    <Skeleton className="h-4 w-8" />
                </div>

                {/* Progress */}
                <Skeleton className="h-1 w-full rounded-full" />

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between gap-3">
                    <Skeleton className="h-3 w-20" />

                    <Skeleton className="h-8 w-24 rounded-sm" />
                </div>
            </div>
        </article>
    );
}

function SkeletonStat({ last = false }) {
    return (
        <div
            className={`
                min-w-0 px-2
                first:pl-0
                ${!last ? "border-r border-[var(--border-default)]" : "pr-0"}
            `}
        >
            {/* Icon + label */}
            <div className="flex items-center gap-1">
                <Skeleton className="size-2.5 rounded-full" />
                <Skeleton className="h-1.5 w-12" />
            </div>

            {/* Value */}
            <Skeleton className="mt-2 h-4 w-14" />
        </div>
    );
}

function Skeleton({ className = "" }) {
    return (
        <div className={` relative overflow-hidden rounded bg-black/[0.055] animate-pulse ${className} `} >
            
            <div className=" absolute inset-0 -translate-x-full animate-[skeleton-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/55 to-transparent " />
        </div>
    );
}

export default UpcomingTournamentGridSkeleton;