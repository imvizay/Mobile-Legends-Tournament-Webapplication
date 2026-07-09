import React from "react";

export default function FeaturedTournamentCardSkeleton() {
    return (
        <section className="w-full">
            {/* Section Heading */}
            <div className="mb-4 hidden animate-pulse items-end justify-between gap-3 sm:flex">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-6 shrink-0 rounded-full bg-[var(--accent-gold)]/20" />

                        <Skeleton className="h-2 w-16" />
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton className="h-5 w-44" />

                        <span className="hidden h-4 w-px bg-[var(--border-default)] sm:block" />

                        <Skeleton className="hidden h-2 w-24 sm:block" />
                    </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                    <Skeleton className="size-3 rounded-full" />
                    <Skeleton className="h-2 w-20" />
                </div>
            </div>

            {/* Main Card */}
            <article
                className="
                    relative isolate min-h-fit overflow-hidden rounded-[22px]
                    border border-[var(--border-default)]
                    bg-white/60
                    shadow-[0_18px_60px_rgba(40,30,10,0.06)]
                    backdrop-blur-2xl
                    sm:min-h-[570px]
                    md:h-[360px]
                    md:min-h-0
                    md:rounded-[24px]
                "
            >
                {/* Ambient skeleton glow */}
                <div className="pointer-events-none absolute -right-24 top-1/2 size-[340px] -translate-y-1/2 rounded-full bg-[var(--accent-gold)]/[0.06] blur-[100px]" />

                {/* Decorative grid */}
                <div
                    className="
                        pointer-events-none absolute inset-0 opacity-[0.025]
                        [background-image:linear-gradient(rgba(80,65,35,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(80,65,35,.8)_1px,transparent_1px)]
                        [background-size:34px_34px]
                    "
                />

                <div className="relative flex h-full flex-col p-4 sm:p-6 md:p-7">
                    {/* Top badges */}
                    <div className="flex items-center justify-between gap-2.5">
                        <Skeleton className="h-7 w-28 rounded-full" />

                        <Skeleton className="h-7 w-24 rounded-full" />
                    </div>

                    {/* Main Content */}
                    <div className="mt-9 max-w-[650px] md:mt-5 md:flex md:flex-1 md:flex-col md:justify-center">
                        {/* Eyebrow */}
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-7 rounded-full bg-[var(--accent-gold)]/20" />
                            <Skeleton className="h-2 w-40" />
                        </div>

                        {/* Tournament title */}
                        <Skeleton className="h-9 w-[75%] max-w-[560px] rounded-md sm:h-12 md:h-14" />

                        {/* Description */}
                        <div className="mt-4 max-w-[500px] space-y-2">
                            <Skeleton className="h-2.5 w-full max-w-[480px]" />
                            <Skeleton className="h-2.5 w-[85%] max-w-[410px]" />
                            <Skeleton className="h-2.5 w-[55%] max-w-[280px]" />
                        </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="mt-7 grid grid-cols-2 gap-2 sm:mt-8 md:hidden">
                        <SkeletonMetric className="col-span-2">
                            <div className="size-8 shrink-0 rounded-lg bg-black/[0.045]" />

                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-2 w-24" />

                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-10" />
                                    <Skeleton className="h-8 w-10" />
                                    <Skeleton className="h-8 w-10" />
                                    <Skeleton className="h-8 w-10" />
                                </div>
                            </div>
                        </SkeletonMetric>

                        <SkeletonMetric>
                            <div className="size-8 shrink-0 rounded-lg bg-black/[0.045]" />

                            <div className="space-y-2">
                                <Skeleton className="h-2 w-16" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </SkeletonMetric>

                        <SkeletonMetric>
                            <div className="size-8 shrink-0 rounded-lg bg-black/[0.045]" />

                            <div className="space-y-2">
                                <Skeleton className="h-2 w-12" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="mt-1 h-1.5 w-16 rounded-full" />
                            </div>
                        </SkeletonMetric>
                    </div>

                    {/* Mobile Actions */}
                    <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
                        <Skeleton className="h-11 w-full rounded-xl" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>

                    {/* Desktop Bottom */}
                    <div className="mt-auto hidden items-end justify-between gap-5 md:flex">
                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 w-28 rounded-xl" />
                            <Skeleton className="h-10 w-32 rounded-xl" />
                        </div>

                        {/* Information Strip */}
                        <div
                            className="
                                flex h-[74px] overflow-hidden rounded-2xl
                                border border-white/80
                                bg-white/45
                                shadow-[0_12px_40px_rgba(50,40,20,0.05)]
                                backdrop-blur-2xl
                            "
                        >
                            {/* Timer */}
                            <div className="flex min-w-[245px] items-center gap-3 px-4">
                                <Skeleton className="size-8 shrink-0 rounded-lg" />

                                <div className="space-y-2">
                                    <Skeleton className="h-2 w-24" />

                                    <div className="flex gap-1.5">
                                        <Skeleton className="h-8 w-9" />
                                        <Skeleton className="h-8 w-9" />
                                        <Skeleton className="h-8 w-9" />
                                        <Skeleton className="h-8 w-9" />
                                    </div>
                                </div>
                            </div>

                            <SkeletonDivider />

                            {/* Prize */}
                            <div className="flex min-w-[145px] items-center gap-3 px-4">
                                <Skeleton className="size-8 shrink-0 rounded-lg" />

                                <div className="space-y-2">
                                    <Skeleton className="h-2 w-16" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>

                            <SkeletonDivider />

                            {/* Teams */}
                            <div className="flex min-w-[140px] items-center gap-3 px-4">
                                <Skeleton className="size-8 shrink-0 rounded-lg" />

                                <div className="space-y-2">
                                    <Skeleton className="h-2 w-12" />
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-1.5 w-[78px] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-[38%] bg-gradient-to-r from-[var(--accent-gold)]/30 to-transparent" />
            </article>
        </section>
    );
}

/* ------------------------------------------------ */
/* Skeleton primitives */
/* ------------------------------------------------ */

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
            {/* Shimmer */}
            <div
                className="
                    absolute inset-0
                    -translate-x-full
                    animate-[skeleton-shimmer_1.6s_ease-in-out_infinite]
                    bg-gradient-to-r
                    from-transparent
                    via-white/60
                    to-transparent
                "
            />
        </div>
    );
}

function SkeletonMetric({ children, className = "" }) {
    return (
        <div
            className={`
                relative overflow-hidden
                rounded-xl
                border border-white/80
                bg-white/50
                px-3 py-3
                backdrop-blur-xl
                ${className}
            `}
        >
            <div className="relative flex items-center gap-3">
                {children}
            </div>
        </div>
    );
}

function SkeletonDivider() {
    return (
        <div className="my-4 w-px bg-gradient-to-b from-transparent via-[var(--border-default)] to-transparent opacity-60" />
    );
}