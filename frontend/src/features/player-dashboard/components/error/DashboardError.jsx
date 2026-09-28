function DashboardSectionError({ onRetry }) {
    return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">
            <div className="text-center">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                    Couldn't load this section
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Something went wrong while loading the data.
                </p>

                <button
                    onClick={onRetry}
                    className="mt-3 text-xs font-medium text-[var(--accent-gold)]"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

export default DashboardSectionError