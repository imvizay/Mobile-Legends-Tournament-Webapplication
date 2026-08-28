export function TournamentContributionSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-3.5 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="animate-pulse">
        <div
          className="h-2 w-24 rounded"
          style={{ background: "var(--surface-elevated)" }}
        />

        <div
          className="mt-3 h-7 w-72 rounded sm:h-9 sm:w-96"
          style={{ background: "var(--surface-elevated)" }}
        />

        <div
          className="mt-3 h-3 w-full max-w-[590px] rounded"
          style={{ background: "var(--surface-elevated)" }}
        />

        <div className="mt-5 grid gap-5 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
          <main className="order-2 min-w-0 space-y-5 lg:order-1 lg:space-y-6">
            <SkeletonBlock className="h-[235px] rounded-[14px] sm:h-[285px] sm:rounded-[16px]" />

            <SkeletonBlock className="h-[105px] rounded-[13px] sm:h-[110px] sm:rounded-[14px]" />

            <SkeletonBlock className="h-[155px] rounded-[13px] sm:h-[165px] sm:rounded-[14px]" />
          </main>

          <aside className="order-1 lg:order-2">
            <SkeletonBlock className="h-[480px] rounded-[16px] sm:rounded-[18px]" />
          </aside>
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        background: "var(--surface-elevated)",
      }}
    />
  );
}