export const validate = ( values ) => {
    const errors = {}
    const matchTimestamp = parseInt(new Date(values.matchTimestamp).getTime() / 1000)
    const todayTimestamp = parseInt(Date.now() / 1000)

    if (!values.firstTeam) {
        errors.firstTeam = 'Team 1 is required'
    }
    if (!values.secondTeam) {
        errors.secondTeam = 'Team 2 is required'
    }
    if ( values.firstTeam == values.secondTeam ) {
        errors.distinctTeam = 'The name of the teams can\'t be the same'
    }
    if (!values.description) {
        errors.description = 'Description is required'
    }
    if (!values.type) {
        errors.type = 'Type is required'
    }
    if (!values.subtype) {
        errors.subtype = 'Subtype is required'
    }
    if (!values.matchTimestamp) {
        errors.matchTimestamp = 'Match date time is required'
    }
    if (matchTimestamp - 86400 < todayTimestamp) {
        errors.matchTimestampDiff = 'The match date time has to be at least 24 hours after the creation of the bet'
    }
    if (typeof values.acceptsTie === undefined || typeof values.acceptsTie === null ) {
        errors.acceptsTie = 'Accept tie option is required time is required'
    }
    if (values.firstTeam.length > 30 || values.secondTeam.length > 30  ) {
        errors.teamLength = 'The name of the team can\'t be longer than 30 characters'
    }
    if (values.description.length > 300  ) {
        errors.descLength = 'The description can\'t be longer than 300 characters'
    }
    if (values.type.length > 30 || values.subtype.length > 30  ) {
        errors.typesLength = 'The types and sub-types can\'t be longer than 30 characters'
    }
    return errors
}