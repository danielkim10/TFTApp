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