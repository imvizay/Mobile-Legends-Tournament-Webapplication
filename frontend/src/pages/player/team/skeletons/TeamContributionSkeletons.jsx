
export default function TeamContributionSkeleton({ rows = 5, isCaptain = false }) {
    return (
        <section className="w-full overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">

            {/* Contribution Overview */}
            <div className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-2.5">
                        {/* Wallet icon */}
                        {/* <div className="size-8 shrink-0 rounded-lg bg-[var(--border-default)]" /> */}

                        <div className="min-w-0">
                            {/* Title */}
                            <div className="h-2 w-24 rounded-full bg-[var(--border-default)]" />

                            {/* Subtitle */}
                            <div className="mt-2 h-1.5 w-32 rounded-full bg-[var(--border-default)]" />
                        </div>
                    </div>

                    {/* Contribution amount */}
                    <div className="flex shrink-0 items-baseline gap-1.5">
                        <div className="h-6 w-16 rounded-md bg-[var(--border-default)] sm:h-7 sm:w-20" />
                        <div className="h-2.5 w-14 rounded-full bg-[var(--border-default)]" />
                    </div>
                </div>
            </div>

            {/* Payment Records */}
            <div className="px-4 py-3 sm:px-5">

                {/* Section heading */}
                <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="h-1.5 w-28 rounded-full bg-[var(--border-default)]" />
                    <div className="h-1.5 w-12 rounded-full bg-[var(--border-default)]" />
                </div>

                {/* Payment rows */}
                <div>
                    {Array.from({ length: rows }).map((_, index) => (
                        <ContributionRowSkeleton
                            key={index}
                            isLast={index === rows - 1}
                        />
                    ))}
                </div>

                {/* Captain reminder button */}
                {isCaptain && (
                    <div className="mt-3 h-9 w-full rounded-lg bg-[var(--border-default)]" />
                )}
            </div>

            {/* Payment Reservation */}
            <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-3 sm:px-5">
                <div className="flex items-start gap-2.5">

                    {/* Alert icon */}
                    <div className="mt-0.5 size-7 shrink-0 rounded-lg bg-[var(--border-default)]" />

                    <div className="min-w-0 flex-1">
                        {/* Heading */}
                        <div className="h-1.5 w-24 rounded-full bg-[var(--border-default)]" />

                        {/* Description */}
                        <div className="mt-2 space-y-1.5">
                            <div className="h-1.5 w-full rounded-full bg-[var(--border-default)]" />
                            <div className="h-1.5 w-[92%] rounded-full bg-[var(--border-default)]" />
                            <div className="h-1.5 w-[65%] rounded-full bg-[var(--border-default)]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContributionRowSkeleton({ isLast }) {
    return (
        <div className={`flex min-w-0 items-center gap-3 py-2.5 ${!isLast ? "border-b border-[var(--border-subtle)]" : ""}`}>

            {/* Status icon */}
            <div className="size-7 shrink-0 rounded-full bg-[var(--border-default)]" />

            {/* Player information */}
            <div className="min-w-0 flex-1">

                {/* Username */}
                <div className="h-2 w-24 rounded-full bg-[var(--border-default)] sm:w-28" />

                {/* Payment status */}
                <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1.5 w-10 rounded-full bg-[var(--border-default)]" />
                    <div className="size-1 rounded-full bg-[var(--border-default)]" />
                    <div className="h-1.5 w-16 rounded-full bg-[var(--border-default)]" />
                </div>
            </div>

            {/* Amount */}
            <div className="h-2.5 w-8 shrink-0 rounded-full bg-[var(--border-default)] sm:w-10" />
        </div>
    );
}

