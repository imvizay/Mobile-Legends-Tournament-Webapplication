import { api } from "../../api/client/request"

export const tournamentRegistrationservice = {
    markRegistrationApproved: async (teamId, registrationId) => {
        const response = await api.post(`/team/${teamId}/registration/${registrationId}/approve`)
        return response
    },
    markRegistrationFailed: async (teamId, registrationId, reason = "") => {
        const response = await api.post(`/team/${teamId}/registration/${registrationId}/failed`, {
            reason
        })
        return response
    },

    lockFinalRoster: async (teamId, registrationId) => {
        const response = await api.post(`/team/${teamId}/registration/${registrationId}/roster/lock`)
        return response
    },
    getTeamDetails: async (teamId, registrationId) => {
        const response = await api.get(`/team/${teamId}/registration/${registrationId}/details`);
        return response;
    },


}