import React from "react";
import { useOutletContext } from "react-router-dom";
import CurrentTournament from '../components/CurrentTournament'
import TeamWallet from "../components/TeamWallet";
import TournamentProgress from '../components/TournamentProgess'
import MatchVerification from "../components/MatchVerification";
import TeamRoster from "../components/RosterAndSubstitute";
// import TeamRoster from "../components/TeamRoster";

export default function TeamDashboard() {
    const { team } = useOutletContext();

    return (
        <div className="space-y-4">
            {/* Competition Context */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
                <CurrentTournament tournament={team.currentTournament} />

                <TeamWallet wallet={team.wallet} />
            </div>

            {/* Tournament Journey */}
            {team.currentTournament && (
                <TournamentProgress
                    stages={team.currentTournament.stages}
                    currentStage={team.currentTournament.currentStage}
                />
            )}

             <TournamentProgress
                 
                />

            {/* Current Match */}
            {team.currentMatch && (
                <MatchVerification match={team.currentMatch} />
            )}

            {/* Team */}
            <TeamRoster
                roster={team.roster}
                substitutes={team.substitutes}
            />
        </div>
    );
}