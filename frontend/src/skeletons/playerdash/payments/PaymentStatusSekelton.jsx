// PaymentStatusSkeleton.jsx

export default function PaymentStatusSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
      <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />

      <div className="mx-auto h-7 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="mx-auto mt-3 h-4 w-72 max-w-full rounded bg-slate-200 dark:bg-slate-800" />

      <div className="mt-8 space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between gap-4 rounded-xl bg-slate-100 px-4 py-4 dark:bg-slate-900"
          >
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="mt-8 h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}