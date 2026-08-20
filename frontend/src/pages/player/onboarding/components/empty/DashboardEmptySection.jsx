import React from "react"

function DashboardSectionEmpty({
    title = "Nothing here yet",
    description = "There is no data available at the moment.",
}) {
    return (
        <div className="flex min-h-40 w-full items-center justify-center px-5 py-8">
            <div className="max-w-sm text-center">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-subtle)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-gold)]" />
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default DashboardSectionEmpty