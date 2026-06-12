import { CalendarDays, ChevronRight, Clock3, Ellipsis, Globe2, Layers3, Trophy, UsersRound, Swords, } from "lucide-react";

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useUserContext } from '../../../../../contexts/UserContext'
import { tournamentService } from '../../../../../services/admin/tournament_service'

const STATUS_STYLES = {
    OPEN: {
        label: "Registration Open",
        className: "bg-[#ead9b3] text-[#755923]",
    },
    ONGOING: {
        label: "Ongoing",
        className: "bg-[#ead9b3] text-[#755923]",
    },
    UPCOMING: {
        label: "Upcoming",
        className: "bg-[#dbe5f2] text-[#42566e]",
    },
    COMPLETED: {
        label: "Completed",
        className: "bg-[#e5e5e5] text-[#555]",
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-[#f0d5d2] text-[#a0443b]",
    },
};


const TournamentMeta = ({ icon: Icon, children }) => (
    <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-[11px] text-[var(--text-muted)] sm:text-[12px]">
        <Icon size={14} className="shrink-0" />
        <span className="truncate">{children}</span>
    </div>
);


const RegistrationStatus = ({ tournament }) => {
    const status = tournament.status?.toUpperCase() || "OPEN";

    if (status === "ONGOING") {
        return (
            <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#d54b43]">Live now</div>
                <RegistrationProgress tournament={tournament} />
                <div className="flex items-start gap-2 pt-1">
                    <CalendarDays size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                    <div>
                        <p className="text-[10px] text-[var(--text-muted)]">Started on</p>
                        <p className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] sm:text-[12px]">{tournament.startDate}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "COMPLETED") {
        return (
            <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">Completed</div>
                <RegistrationProgress tournament={tournament} />
                <div className="flex items-start gap-2 pt-1">
                    <CalendarDays size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                    <div>
                        <p className="text-[10px] text-[var(--text-muted)]">Ended on</p>
                        <p className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] sm:text-[12px]">{tournament.endDate}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "CANCELLED") {
        return (
            <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#d54b43]">Cancelled</div>
                <RegistrationProgress tournament={tournament} />
                <div className="flex items-start gap-2 pt-1">
                    <CalendarDays size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                    <div>
                        <p className="text-[10px] text-[var(--text-muted)]">Cancelled on</p>
                        <p className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] sm:text-[12px]">{tournament.endDate}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "UPCOMING") {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-[#f1eadc] text-[#967335]">
                        <Clock3 size={14} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)]">Registration opens</p>
                        <p className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] sm:text-[12px]">{tournament.registrationOpens}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">Registration</div>
            <RegistrationProgress tournament={tournament} />
            <div className="flex items-start gap-2 pt-1">
                <CalendarDays size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                <div>
                    <p className="text-[10px] text-[var(--text-muted)]">Closes on</p>
                    <p className="mt-0.5 text-[11px] font-medium text-[var(--text-primary)] sm:text-[12px]">{tournament.registrationCloses}</p>
                </div>
            </div>
        </div>
    );
};


const RegistrationProgress = ({ tournament }) => {
    const registered = Number(tournament.registered || 0);
    const capacity = Number(tournament.capacity || 1);
    const percentage = Math.min(Math.round((registered / capacity) * 100), 100);

    return (
        <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-[18px] font-bold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[20px]">{registered} / {capacity}</span>
            <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
                <div className="h-full rounded-full bg-[#c39b51] transition-all" style={{ width: `${percentage}%` }} />
            </div>
            <span className="shrink-0 text-[10px] font-medium text-[var(--text-muted)]">{percentage}%</span>
        </div>
    );
};


const TournamentBanner = ({ tournament }) => {
    const status = tournament.status?.toUpperCase() || "OPEN";
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.OPEN;

    return (
        <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-[10px] bg-[#16191d] sm:h-[120px] sm:w-[348px]">
            {tournament.banner ? (
                <img src={tournament.banner} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#20242a,#090b0e)]" />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.7))]" />

            <div className="absolute left-3 top-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[0.1em] ${statusStyle.className}`}>{statusStyle.label}</span>
            </div>

            <div className="absolute bottom-3 left-4 right-4">
                {tournament.season && <p className="mb-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/65">{tournament.season}</p>}
                <h3 className="max-w-[280px] text-[19px] font-bold uppercase leading-[0.95] tracking-[0.02em] text-white sm:text-[21px]">{tournament.bannerTitle || tournament.name}</h3>
            </div>
        </div>
    );
};


const TournamentAction = ({ tournament, onAction }) => {
    const status = tournament.status?.toUpperCase() || "OPEN";

    const actionLabel =
        status === "ONGOING"
            ? "View Live"
            : status === "COMPLETED"
                ? "View Results"
                : "View Details";

    return (
        <div className="flex shrink-0 items-center gap-2 border-t border-[var(--border-subtle)] pt-4 sm:border-0 sm:border-l sm:border-[var(--border-subtle)] sm:pl-5 sm:pt-0">
            <button type="button" onClick={() => onAction?.(tournament)} className="group flex h-[42px] min-w-[130px] flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#151a20] px-4 text-[11px] font-semibold text-white transition-transform hover:-translate-y-px sm:flex-none">
                <span>{actionLabel}</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>

            <button type="button" aria-label="More tournament options" className="flex size-[42px] shrink-0 items-center justify-center rounded-[8px] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-transform hover:-translate-y-px">
                <Ellipsis size={17} />
            </button>
        </div>
    );
};


const TournamentRegistrationCard = ({ tournament, onAction }) => {
    return (
        <article className="grid shrink-0 grid-cols-1 overflow-hidden rounded-[10px] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-2.5 transition-transform hover:-translate-y-px sm:grid-cols-[348px_minmax(250px,1fr)_245px_200px] sm:items-center sm:gap-0 sm:p-0">
            <TournamentBanner tournament={tournament} />

            <div className="min-w-0 px-2 py-4 sm:px-5 sm:py-4">
                <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-[17px] font-bold tracking-[-0.035em] text-[var(--text-primary)] sm:text-[18px]">{tournament.name}</h2>
                    {tournament.featured && <span className="shrink-0 rounded-full bg-[#f2e8d3] px-2 py-1 text-[8px] font-bold text-[#876a32]">Featured</span>}
                </div>

                <p className="mt-1 truncate text-[11px] text-[var(--text-muted)] sm:text-[12px]">{tournament.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <TournamentMeta icon={UsersRound}>{tournament.format || "5v5"}</TournamentMeta>
                    <TournamentMeta icon={Globe2}>{tournament.region || "India"}</TournamentMeta>
                    <TournamentMeta icon={Trophy}>₹{tournament.entryFee || 0} / player</TournamentMeta>
                    <TournamentMeta icon={Swords}>{tournament.elimination || "Single Elimination"}</TournamentMeta>
                </div>
            </div>

            <div className="border-t border-[var(--border-subtle)] px-2 py-4 sm:border-l sm:border-t-0 sm:px-5 sm:py-4">
                <RegistrationStatus tournament={tournament} />
            </div>

            <div className="px-2 pb-2 pt-0 sm:px-5 sm:py-4">
                <TournamentAction tournament={tournament} onAction={onAction} />
            </div>
        </article>
    );
};


const EmptyRegistrations = () => (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-base)] px-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-[14px] bg-[var(--surface-elevated)] text-[var(--text-muted)]">
            <Trophy size={20} />
        </div>
        <h3 className="mt-4 text-[15px] font-semibold text-[var(--text-primary)]">No tournament registrations</h3>
        <p className="mt-1 max-w-[320px] text-[11px] leading-relaxed text-[var(--text-muted)]">There are currently no tournaments matching this registration view.</p>
    </div>
);


const OngoingTournamentRegistration = ({ tournaments = [], onTournamentAction }) => {
    return (
        <section className="flex h-full min-h-0 w-full flex-col">
            <header className="shrink-0 pb-5 sm:pb-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#b28b4a]">Tournament registrations</p>
                <div className="mt-1 flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[36px]">Ongoing Tournament Registration</h1>
                        <p className="mt-1 max-w-[680px] text-[11px] leading-relaxed text-[var(--text-muted)] sm:text-[12px]">Monitor tournament registrations, availability, and participation status.</p>
                    </div>

                    <span className="hidden shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:block">{tournaments.length} registrations</span>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                <div className="flex flex-col gap-3 pb-6">
                    {tournaments.length > 0 ? tournaments.map((tournament) => <TournamentRegistrationCard key={tournament.id} tournament={tournament} onAction={onTournamentAction} />) : <EmptyRegistrations />}
                </div>
            </div>
        </section>
    );
};


export default OngoingTournamentRegistration;