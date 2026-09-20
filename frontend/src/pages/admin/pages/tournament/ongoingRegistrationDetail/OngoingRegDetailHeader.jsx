import React from "react";

const dummytournament = {
    "id": 1,
    "tournament_name": "Mythic Immortal Competetive Championship Trophy",
    "game_name": "Mobile Legends: Bang Bang",
    "tournament_type": "single_elimination",
    "team_format": "3vs3",
    "min_teams": 10,
    "max_teams": 20,
    "background_image_url": "https://res.cloudinary.com/dxywgvhss/image/upload/v1787858049/tournament/background_image/b0h6eivatmpwkk0tzl0q.png",
    "banner_image_url": null,
    "description": 'Spartan never turn backs in midst of struggle',
    "platform_fee": null,
    "winner_share": null,
    "runner_up_share": null,
    "registration_opens_at": "2026-09-12T12:00:00+05:30",
    "registration_closes_at": "2026-09-21T12:00:00+05:30",
    "starts_at": "2026-09-18T12:00:00+05:30",
    "ends_at": "2026-09-20T12:00:00+05:30",
    "check_in": null,
    "grace_period": "10",
    "bracket_format": "double_elimination",
    "category": "weekly",
    "competition_type": "competitive",
    "seeding_method": "rank_based",
    "entry_fee": 100,
    "entry_type": "paid",
    "minimum_account_level": 40,
    "minimum_rank": "mythic",
    "registration_access": "open",
    "registration_approval": "admin",
    "server": "india",
    "registration_status": "upcoming",
    "status": "scheduled",
    "visibility_status": "published",
    "registration_count": 1
}


import { ArrowLeft, CalendarDays, Clock3, Ellipsis, Gamepad2, IndianRupee, Layers3, Trophy, UsersRound, XCircle, } from "lucide-react";

import FlipDigit from "../../../../player/onboarding/components/countdown/FlipDigit";
import FlipUnit from "../../../../player/onboarding/components/countdown/FlipUnit";
import MobileTopBar from "./MobileTopBar";
import TournamentBanner from "./Banner";

export const OngoingRegistrationHeader = ({
    tournament = dummytournament,
    postpone,
    onAction,
    onBack,
}) => {

    if (!tournament) return null;

    return (
        <section className="w-full pt-0 sm:pt-0">

            <TournamentBanner
                tournament={tournament}
                postpone={postpone}
                onAction={onAction}
            />

        </section>
    );
};
