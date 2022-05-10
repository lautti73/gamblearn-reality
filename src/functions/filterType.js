export const filterType = (bets, filters, typeOrSubtype) => {
    let filteredBets = []
    for (const type of filters) {
        const array = bets.filter( (bet) =>
            bet[typeOrSubtype] === type
        )
        filteredBets = [...array];
    }
    return filteredBets;
}