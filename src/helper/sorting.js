export const sortCostAscending = (a, b) => {
    if (a.cost > b.cost) {
        return 1;
    }
    else if (a.cost < b.cost) {
        return -1;
    }
    return 0;
}

export const sortCostDescending = (a, b) => {
    if (a.cost < b.cost) {
        return 1;
    }
    else if (a.cost > b.cost) {
        return -1;
    }
    return 0;
}

export const sortTierAscending = (a,b) => {
    if (a.tier > b.tier) {
        return 1;
    }
    else if (a.tier < b.tier) {
        return -1;
    }
    return 0;
}

export const sortTierDescending = (a,b) => {
    if (a.tier < b.tier || b.rarity > a.rarity) {
        return 1;
    }
    else if (a.tier > b.tier || b.rarity < a.rarity) {
        return -1;
    }
    return 0;
}

export const sortTierMatchAscending = (a, b) => {
    if (a.tier_current > b.tier_current) {
        return 1;
    }
    else if (a.tier_current < b.tier_current) {
        return -1;
    }
    return 0;
}

export const sortTierMatchDescending = (a, b) => {
    if (a.tier_current < b.tier_current) {
        return 1;
    }
    else if (a.tier_current > b.tier_current) {
        return -1;
    }
    return 0;
}

export const sortPlacementAscending = (a, b) => {
    if (a.placement > b.placement) {
        return 1;
    }
    else if (a.placement < b.placement) {
        return -1;
    }
    return 0;
}

export const sortGametimeDescending = (a,b) => {
    if (a.info.game_datetime < b.info.game_datetime) {
        return 1;
    }
    else if (a.info.game_datetime > b.info.game_datetime) {
        return -1;
    }
    return 0;
}

export const sortTrait = (a, b) => {
    if (a.tier < b.tier) {
        return 1;
    }
    else if (a.tier > b.tier) {
        return -1;
    }
    return 0;
}

export const sortTraitMatch = (a, b) => {
    if (a.style < b.style) {
        return 1;
    }
    else if (a.style > b.style) {
        return -1;
    }
    return 0;
}

export const sortTeamDate = (a, b) => {
    if (a.date < b.date) {
        return 1;
    }
    else if (a.date > b.date) {
        return -1;
    }
    return 0;
}