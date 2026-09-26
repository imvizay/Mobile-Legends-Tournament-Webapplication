// utils/getRegistrationRoadmap.js

export const getRegistrationRoadmap = ({
    tournament,
    roster,
}) => {
    const rosterPlayers = roster?.roster_players ?? [];

    const rosterRequired = 5;

    const rosterSelected = rosterPlayers.filter(
        (player) => player.status === "selected"
    ).length;

    const rosterConfirmed =
        roster?.is_roster_locked === true ||
        roster?.roster_status === "confirmed";

    const paymentsPaid = rosterPlayers.filter(
        (player) => player.fee_status === "paid"
    ).length;

    const paymentsPending = rosterPlayers.filter(
        (player) => player.fee_status === "pending"
    ).length;

    const paymentsRequired = rosterSelected;

    const registrationClosed = tournament?.registration_closes_at
        ? new Date(tournament.registration_closes_at) <= new Date()
        : false;

    return {
        currentStage: getCurrentStage({
            registrationStatus: tournament?.status,
            rosterSelected,
            rosterRequired,
            rosterConfirmed,
            paymentsPaid,
            paymentsRequired,
        }),

        registrationClosed,

        roster: {
            selected: rosterSelected,
            required: rosterRequired,
            confirmed: rosterConfirmed,
            status: roster?.roster_status ?? null,
        },

        payments: {
            paid: paymentsPaid,
            pending: paymentsPending,
            required: paymentsRequired,
        },

        registrationStatus: tournament?.status ?? null,
    };
};


const getCurrentStage = ({
    registrationStatus,
    rosterSelected,
    rosterRequired,
    rosterConfirmed,
    paymentsPaid,
    paymentsRequired,
}) => {
    /*
     * Team application exists.
     */
    if (!registrationStatus) {
        return "team_registered";
    }

    /*
     * Roster isn't complete yet.
     */
    if (rosterSelected < rosterRequired) {
        return "roster_submitted";
    }

    /*
     * Five players selected but roster isn't confirmed.
     */
    if (!rosterConfirmed) {
        return "roster_confirmed";
    }

    /*
     * Roster confirmed but payments aren't complete.
     */
    if (paymentsPaid < paymentsRequired) {
        return "player_payments";
    }

    /*
     * Everything required from the team is complete.
     * The backend registration status will eventually
     * determine whether this is actually confirmed.
     */
    return "registration_confirmed";
};