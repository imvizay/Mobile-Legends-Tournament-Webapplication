
export const validateTournamentData = (data) => {

    const {
        reg_open_date,
        reg_close_date,
        reg_open_time,
        reg_close_time,

        tournament_start_date,
        tournament_end_date,
        tournament_start_time,
        tournament_end_time,
    } = data

    const errors = {}

    const toDateTime = (date, time) => {
        if (!date && !time) return null
        const datetime = new Date(`${date}T${time}`)
        return datetime
    }

    const regOpen = toDateTime(reg_open_date, reg_open_time)
    const regClose = toDateTime(reg_close_date, reg_close_time)

    const tournamentStart = toDateTime(tournament_start_date, tournament_start_time)
    const tournamentEnd = toDateTime(tournament_end_date, tournament_end_time)

    // Required schedule fields
    if (!regOpen) {
        errors.reg_open = "Registration opening time is required."
    }

    if (!regClose) {
        errors.reg_close = "Registration closing time is required."
    }

    if (!tournamentStart) {
        errors.tournament_start = "Tournament start time is required."
    }

    if (!tournamentEnd) {
        errors.tournament_end = "Tournament end time is required."
    }

    // Registration timing
    if (regOpen && regClose && regClose <= regOpen) {
        errors.reg_close =
            "Registration must close after it opens."
    }

    // Tournament timing
    if (tournamentStart && tournamentEnd && tournamentEnd <= tournamentStart) {
        errors.tournament_end =
            "Tournament must end after it starts."
    }

    // Registration must close before tournament starts
    if (regClose && tournamentStart && regClose >= tournamentStart) {
        errors.reg_close =
            "Registration must close before the tournament starts."
    }

    return ({
            "isValid": Object.keys(errors).length === 0,
            errors
        })
}