import {
  AlertTriangle,
  Check,
  FileText,
  LockKeyhole,
  Mail,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

function ActionButton({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  soon = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || soon}
      className={`group flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
        danger
          ? "border-red-200 bg-red-50/70 hover:border-red-300 hover:bg-red-50"
          : disabled
            ? "cursor-not-allowed border-[var(--border-subtle)] bg-[var(--surface-base)] opacity-55"
            : soon
              ? "cursor-not-allowed border-[var(--border-subtle)] bg-[var(--surface-base)] opacity-65"
              : "border-[var(--border-subtle)] bg-[var(--surface-base)] hover:border-[var(--border-default)] hover:bg-[var(--surface-elevated)]"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          danger
            ? "bg-red-100 text-red-600"
            : disabled || soon
              ? "bg-[var(--surface-elevated)] text-[var(--text-muted)]"
              : "bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-[11px] font-semibold ${
            danger
              ? "text-red-600"
              : disabled || soon
                ? "text-[var(--text-muted)]"
                : "text-[var(--text-primary)]"
          }`}
        >
          {title}
        </span>

        <span
          className={`mt-0.5 block text-[9px] leading-4 ${
            danger
              ? "text-red-500/80"
              : "text-[var(--text-muted)]"
          }`}
        >
          {description}
        </span>
      </span>

      {soon && (
        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Soon
        </span>
      )}

      {disabled && !soon && (
        <LockKeyhole
          size={13}
          strokeWidth={1.8}
          className="shrink-0 text-[var(--text-muted)]"
        />
      )}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 px-0.5">
      <span className="h-1 w-1 rounded-full bg-[var(--accent-gold)]" />

      <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {children}
      </span>
    </div>
  );
}

export default function PlayerActionDrawer({
  member,
  isOpen,
  isCaptain = false,
  isRoster = false,
  isRosterLocked = false,
  isContributionPaid = false,

  onClose,
  onMakeRoster,
  onRemoveRoster,
  onRemindContribution,
  onKickOut,

  onAddNote,
}) {
  if (!isOpen || !member) return null;

  const displayName =
    member.username ||
    member.name ||
    member.email?.split("@")[0] ||
    "Player";

  const email = member.email || "No email available";
  const mlbbId = member.mlbb_id || "—";
  const serverId = member.mlbb_server || "—";

  const showMakeRoster = isCaptain && !isRoster && !isRosterLocked;
  const showRemoveRoster = isCaptain && isRoster;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close player actions"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/25 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-[320px] sm:max-w-[390px] lg:max-w-[390px] flex-col border-l border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-[var(--border-subtle)] px-5 pb-4 pt-5">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] text-sm font-semibold text-[var(--text-secondary)]">
              {member.profile_image ? (
                <img
                  src={member.profile_image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>

            {member.status === "active" && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--surface-base)] bg-emerald-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {displayName}
              </h2>

              <span className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Team Member
              </span>
            </div>

            <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
              @{displayName}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-[var(--text-secondary)]">
              {email}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
          >
            <X size={17} strokeWidth={1.7} />
          </button>
        </div>

        {/* Player identifiers */}
        <div className="mx-5 mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
          <div className="border-r border-[var(--border-subtle)] px-3.5 py-3">
            <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              MLBB ID
            </p>

            <p className="mt-1 text-[11px] font-semibold text-[var(--text-primary)]">
              {mlbbId}
            </p>
          </div>

          <div className="px-3.5 py-3">
            <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Server ID
            </p>

            <p className="mt-1 text-[11px] font-semibold text-[var(--text-primary)]">
              {serverId}
            </p>
          </div>
        </div>

        {/* Scrollable actions */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5">
          {/* Normal player actions */}
          <section>
            <SectionLabel>Quick Actions</SectionLabel>

            <div className="space-y-2">
              <ActionButton
                icon={<Mail size={16} strokeWidth={1.7} />}
                title="Send Message"
                description="Start a conversation"
                soon
              />

              <ActionButton
                icon={<UserPlus size={16} strokeWidth={1.7} />}
                title="Add to Friend List"
                description="Add this player to your friends"
                soon
              />

              <ActionButton
                icon={<FileText size={16} strokeWidth={1.7} />}
                title="Add Note"
                description="Save a private note about this player"
                onClick={onAddNote}
              />
            </div>
          </section>

          {/* Captain-only roster management */}
          {isCaptain && (
            <section className="mt-6">
              <SectionLabel>Roster Management</SectionLabel>

              <div className="space-y-2">
                {/* Player is NOT in roster + roster is open */}
                {showMakeRoster && (
                  <ActionButton
                    icon={<UsersRound size={16} strokeWidth={1.7} />}
                    title="Make Roster"
                    description="Add player to tournament roster"
                    onClick={onMakeRoster}
                  />
                )}

                {/* Player IS in roster */}
                {showRemoveRoster && (
                  <ActionButton
                    icon={<UsersRound size={16} strokeWidth={1.7} />}
                    title="Remove from Roster"
                    description={
                      isRosterLocked
                        ? "Roster is locked"
                        : "Move player out of tournament roster"
                    }
                    disabled={isRosterLocked}
                    onClick={onRemoveRoster}
                  />
                )}

                {/* Contribution reminder */}
                {isRoster && (
                  <ActionButton
                    icon={<Mail size={16} strokeWidth={1.7} />}
                    title="Remind About Contribution"
                    description={
                      isContributionPaid
                        ? "Contribution has already been paid"
                        : "Remind player about their contribution"
                    }
                    disabled={isContributionPaid}
                    onClick={onRemindContribution}
                  />
                )}
              </div>
            </section>
          )}

          {/* Captain-only destructive action */}
          {isCaptain && (
            <section className="mt-6">
              <SectionLabel>Team Actions</SectionLabel>

              <ActionButton
                icon={<AlertTriangle size={16} strokeWidth={1.8} />}
                title="Kick Out Player"
                description="Remove player from your team"
                danger
                onClick={onKickOut}
              />
            </section>
          )}

          {/* Small contextual footer */}
          <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-3">
            <p className="text-[8px] leading-4 text-[var(--text-muted)]">
              {isCaptain
                ? "Team management actions are available to the team captain."
                : "Some player actions will become available in a future update."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}