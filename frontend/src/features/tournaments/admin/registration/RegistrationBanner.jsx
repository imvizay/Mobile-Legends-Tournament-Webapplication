import React from "react";

import {
    CalendarDays,
    Clock3,
    Gamepad2,
    IndianRupee,
    Layers3,
    UsersRound,
} from "lucide-react";

import RegistrationCountdown from "./RegistrationCountdown";
import TournamentActions from "./TournamentAction";


const TournamentBanner = ({
    tournament,
    postpone,
    onAction,
}) => {

    const formatLabel = (value) => {
        if (!value) return "—";

        return value
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };


    const formatDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };


    const formatMobileDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        });
    };


    const formatTime = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };


    return (
        <header className="relative overflow-hidden rounded-md border border-[var(--border-subtle)] bg-[var(--surface-base)] sm:rounded-xl">

            {tournament.background_image_url && (
                <img
                    src={tournament.background_image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}

            <div className="absolute inset-0 bg-black/65" />


            <div className="relative p-1.5 sm:grid sm:min-h-[142px] sm:grid-cols-[minmax(0,1.5fr)_minmax(190px,0.75fr)_auto] sm:gap-4 sm:p-4">


                {/* LEFT — Tournament identity */}
                <div className="min-w-0">

                    <span className="inline-flex max-w-full items-center whitespace-nowrap rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-[5px] font-semibold uppercase tracking-[0.07em] text-white/80 backdrop-blur-sm sm:px-2 sm:py-1 sm:text-[7px] sm:tracking-[0.1em]">
                        Registration Open
                    </span>


                    <h1 className="mt-0.5 max-w-2xl truncate text-[12px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:mt-2 sm:text-[24px] sm:leading-[1] sm:tracking-[-0.04em]">
                        {tournament.tournament_name}
                    </h1>


                    <div className="mt-0.5 flex max-w-full flex-nowrap items-center gap-1 overflow-hidden text-[5.5px] text-white/65 sm:mt-2 sm:gap-2 sm:text-[9px]">

                        <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap">
                            <Gamepad2 size={7} className="sm:size-[10px]" />
                            {tournament.game_name}
                        </span>

                        <span className="shrink-0 text-white/25">
                            •
                        </span>

                        <span className="shrink-0 whitespace-nowrap">
                            {tournament.team_format}
                        </span>

                        <span className="shrink-0 text-white/25">
                            •
                        </span>

                        <span className="shrink-0 whitespace-nowrap">
                            {formatLabel(tournament.category)}
                        </span>

                    </div>


                    {/* Desktop only */}
                    <p className="mt-2 hidden text-[8px] italic text-white/40 sm:mt-4 sm:block">
                        "Legends are not born. They are built."
                    </p>

                </div>


                {/* MIDDLE — Desktop secondary information */}
                <div className="mt-2 hidden grid-cols-2 gap-x-5 gap-y-2 border-t border-white/10 pt-2.5 sm:mt-0 sm:grid sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">

                    <InfoItem
                        icon={<Layers3 size={9} />}
                        label="Tournament"
                        value={formatLabel(tournament.tournament_type)}
                    />

                    <InfoItem
                        label="Bracket"
                        value={formatLabel(tournament.bracket_format)}
                    />

                    <InfoItem
                        icon={<IndianRupee size={9} />}
                        label="Entry Fee"
                        value={`₹${tournament.entry_fee ?? 0}`}
                    />

                    <InfoItem
                        icon={<UsersRound size={9} />}
                        label="Min. Teams"
                        value={tournament.min_teams ?? "—"}
                    />

                </div>


                {/* RIGHT — Countdown + actions */}
                <div className="mt-1.5 border-t border-white/10 pt-1.5 sm:mt-0 sm:flex sm:min-w-[165px] sm:flex-col sm:justify-between sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">


                    {/* MOBILE STRIP INFO */}
                    <div className="flex items-center justify-between gap-2 sm:hidden">

                        {/* Entry */}
                        <div className="shrink-0">

                            <p className="text-[4.5px] font-medium uppercase tracking-[0.07em] text-white/40">
                                Entry
                            </p>

                            <p className="mt-px flex items-center text-[8px] font-semibold leading-none text-white/90">
                                <IndianRupee size={7} />
                                {tournament.entry_fee ?? 0}
                            </p>

                        </div>


                        <div className="h-4 w-px bg-white/10" />


                        {/* Teams */}
                        <div className="shrink-0">

                            <p className="text-[4.5px] font-medium uppercase tracking-[0.07em] text-white/40">
                                Teams
                            </p>

                            <p className="mt-px text-[8px] font-semibold leading-none text-white/90">
                                {tournament.registration_count ?? 0}
                                <span className="px-0.5 text-white/30">
                                    /
                                </span>
                                {tournament.max_teams ?? 0}
                            </p>

                        </div>


                        <div className="h-4 w-px bg-white/10" />


                        {/* Registration deadline */}
                        <div className="min-w-0 flex-1">

                            <p className="text-[4.5px] font-medium uppercase tracking-[0.07em] text-white/40">
                                Registration Ends
                            </p>

                            <div className="mt-px flex min-w-0 items-center gap-1 text-[6px] font-medium text-white/75">

                                <CalendarDays size={7} className="shrink-0" />

                                <span className="whitespace-nowrap">
                                    {formatMobileDate(
                                        tournament.registration_closes_at
                                    )}
                                </span>

                                <span className="text-white/20">
                                    •
                                </span>

                                <Clock3 size={7} className="shrink-0" />

                                <span className="whitespace-nowrap">
                                    {formatTime(
                                        tournament.registration_closes_at
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* DESKTOP COUNTDOWN */}
                    <div className="hidden sm:block">

                        <p className="whitespace-nowrap text-[7px] font-medium uppercase tracking-[0.1em] text-white/45">
                            Registration Ends
                        </p>


                        <div className="mt-1">
                            <RegistrationCountdown
                                targetDate={tournament.registration_closes_at}
                            />
                        </div>


                        <div className="mt-2 flex flex-nowrap items-center gap-2 overflow-hidden text-[7px] text-white/55">

                            <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap">
                                <CalendarDays size={9} />
                                {formatDate(tournament.registration_closes_at)}
                            </span>

                            <span className="shrink-0 text-white/20">
                                •
                            </span>

                            <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap">
                                <Clock3 size={9} />
                                {formatTime(tournament.registration_closes_at)}
                            </span>

                        </div>

                    </div>


                    {/* ACTIONS */}
                    <div className="mt-1 sm:mt-0">

                        <TournamentActions
                            tournament={tournament}
                            postpone={postpone}
                            onAction={onAction}
                        />

                    </div>

                </div>

            </div>

        </header>
    );
};


const InfoItem = ({
    icon,
    label,
    value,
}) => {

    return (
        <div className="min-w-0">

            <p className="flex items-center gap-0.5 whitespace-nowrap text-[5px] uppercase tracking-[0.06em] text-white/40 sm:gap-1 sm:text-[6px] sm:tracking-[0.08em]">
                {icon}
                {label}
            </p>

            <p className="mt-0.5 truncate whitespace-nowrap text-[8px] font-medium text-white/85 sm:text-[9px]">
                {value ?? "—"}
            </p>

        </div>
    );
};


export default TournamentBanner;