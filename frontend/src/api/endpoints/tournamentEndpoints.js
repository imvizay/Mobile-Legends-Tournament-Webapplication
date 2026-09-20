export const TOURNAMENT_ENDPOINT = {
  CREATE_TOURNAMENT: "/tournament/create",

  GET_TOURNAMENTS: "/tournament/tournaments",

  ONGOING_TOURNAMENT: '/tournament/ongoing-registrations',

  GET_TOURNAMENT: (tournamentId) =>
    `/player/tournament/${tournamentId}/detail`,

  UPDATE_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}`,

  PUBLISH_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}/publish`,

  CANCEL_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}/cancel`,

  ONGOING_TOURNAMENT_DETAIL: (ongoingTournamentRegistrationId) => `/tournament/ongoing-registration/${ongoingTournamentRegistrationId}/details`

};

export const TOURNAMENT_ROSTER = {
  ADD_ROSTER_PLAYER: "/tournaments/roster/player/add",
  REMOVE_ROSTER_PLAYER: "/tournaments/roster/player/remove",

  ADD_SUBSTITUTE: "/tournaments/roster/substitute/add",
  REMOVE_SUBSTITUTE: "/tournaments/roster/substitute/remove",

  LOCK_ROSTER: "/tournaments/roster/lock",

}

export const TOURNAMENT_CONTRIBUTION = {



}