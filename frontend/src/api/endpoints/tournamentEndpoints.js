export const TOURNAMENT_ENDPOINT = {
  CREATE_TOURNAMENT: "/tournament/create",

  GET_TOURNAMENTS: "/tournament/tournaments",

  GET_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}`,

  UPDATE_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}`,

  PUBLISH_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}/publish`,

  CANCEL_TOURNAMENT: (tournamentId) =>
    `/tournament/${tournamentId}/cancel`,
};