import Skeleton from "../../Skeleton";
export default function TeamPageSkeleton() {
  return (
    <div className="space-y-6">

      {/* Hero Banner */}
      <div className="relative h-[250px] overflow-hidden rounded-3xl border border-gray-400 bg-background">
        <Skeleton className="absolute inset-0" />

        <div className="absolute bottom-8 left-8 flex items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-2xl" />

          <div className="space-y-3">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96" />

            <div className="flex gap-4 pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 rounded-2xl border border-gray-400 p-5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-20" />
        ))}
      </div>

      {/* Wallet + Security */}
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 rounded-3xl border border-gray-400 p-6">
          <Skeleton className="mb-6 h-6 w-40" />

          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-400 p-6">
          <Skeleton className="mb-5 h-5 w-44" />

          <Skeleton className="h-24 rounded-xl" />
        </div>

      </div>

      {/* Tournament Card */}
      <div className="rounded-3xl border p-6">
        <Skeleton className="mb-5 h-5 w-40" />

        <div className="flex gap-6">
          <Skeleton className="h-28 w-28 rounded-xl" />

          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-96" />

            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </div>

          <Skeleton className="h-12 w-44 rounded-xl" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-4 gap-6">

        {/* Team Members */}
        <div className="col-span-3">

          <Skeleton className="mb-6 h-6 w-40" />

          <div className="grid grid-cols-5 gap-5">

            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border p-3"
              >
                <Skeleton className="mb-3 h-40 rounded-xl" />

                <Skeleton className="mb-2 h-5 w-28" />
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}

          </div>

        </div>

        {/* Activity */}
        <div className="rounded-3xl border p-6">

          <Skeleton className="mb-6 h-6 w-32" />

          <div className="space-y-6">

            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}