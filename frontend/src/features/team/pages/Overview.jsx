import { useOutletContext } from "react-router-dom";

// components
import AccountSecurity from "../components/overview/AccountSecurity";
import ActiveTournament from "../components/overview/ActiveTournament";
import ActivityFeed from "../components/overview/ActivityFeed";
import SubstitutePlayers from "../components/overview/Substitute";
import TeamRoster from "../components/overview/TeamRoster";
import WalletOverview from "../components/overview/WalletOverview";
import TeamMetaData from "../components/common/TeamMetaData";


const Overview = () => {

  const team = useOutletContext()

  return (
    <section className="space-y-5 lg:space-y-6">

      {/* Wallet + Security */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">

        <div className="lg:col-span-8">
          <WalletOverview wallet={team.team_wallet}/>
        </div>

        <div className="lg:col-span-4">
          <AccountSecurity />
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">

        {/* Left */}
        <div className="space-y-5 lg:col-span-8 lg:space-y-6">

          <ActiveTournament />

          <TeamRoster />

          <SubstitutePlayers />

        </div>

        {/* Right */}
        <div className="lg:col-span-4">

          <ActivityFeed />

        </div>

      </div>

    </section>
  );
};

export default Overview;