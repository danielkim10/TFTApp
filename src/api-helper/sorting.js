export function sortCostAscending(a, b) {
    if (a.cost > b.cost) {
        return 1;
    }
    else if (a.cost < b.cost) {
        return -1;
    }
    return 0;
}

export function sortCostDescending(a, b) {
    if (a.cost < b.cost) {
        return 1;
    }
    else if (a.cost > b.cost) {
        return -1;
    }
    return 0;
}