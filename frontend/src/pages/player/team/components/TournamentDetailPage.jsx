import TournamentDetails from "../../onboarding/components/TournamentDetail";
import { dummyTournamentDetail } from "../../../../utils/playerdashboard_links/dummydata";

export default function TournamentPage() {
    const handlePayContribution = () => {
        console.log("Proceeding to tournament contribution");
    };

    return (
        <TournamentDetails
            tournament={dummyTournamentDetail}
            contributionStatus="open"
            canContribute={true}
            onPayContribution={handlePayContribution}
        />
    );
}