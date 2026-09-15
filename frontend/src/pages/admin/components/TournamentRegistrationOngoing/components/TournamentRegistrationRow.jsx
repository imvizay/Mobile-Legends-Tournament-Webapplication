const TournamentRegistrationRow = ({ icon: Icon, title, subtitle, right, status, className = "", children }) => (
  <div className={`group flex min-w-[290px] items-center gap-2.5 border-b px-3 py-3 last:border-b-0 sm:px-3.5 ${className}`} style={{ borderColor: "var(--border-subtle)" }}>
    {Icon && <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-[var(--surface-base)] text-[var(--text-muted)]" style={{ borderColor: "var(--border-subtle)" }}><Icon size={13} /></div>}
    <div className="min-w-0 flex-1">
      {title && <p className="truncate text-[9px] font-semibold text-[var(--text-primary)]">{title}</p>}
      {subtitle && <p className="mt-0.5 truncate text-[7px] text-[var(--text-muted)]">{subtitle}</p>}
      {children}
    </div>
    {status && <div className="shrink-0">{status}</div>}
    {right && <div className="shrink-0 text-right">{right}</div>}
  </div>
);

export default TournamentRegistrationRow;
