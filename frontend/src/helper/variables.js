import { champion_icon_parse } from "./string-parsing";

export const SET_NUMBER = 5;
export const CHAMPION_ID_PREFIX = "TFT5_";

export const champions_fetch = () => {
    let champions = require("../data/champions.json");
    let champions_arr = {};
    for (let champion of Object.values(champions)) {
        if (champion.championId.startsWith(CHAMPION_ID_PREFIX)) {
            champions_arr[champion.championId] = champion;
        }
    }
    return champions_arr;
}

export const items_fetch = () => {
    let items = require("../data/items.json");
    let items_arr = {};
    for (let item of Object.values(items)) {
        items_arr[item.id.toString()] = item;
    }
    return items_arr;
}

export const traits_fetch = () => {
    let traits = require("../data/traits.json");
    let traits_arr = {};
    for (let trait of Object.values(traits)) {
        traits_arr[trait.key] = trait;
    }
    return traits_arr;
}

export const champion_patch_combine = (champions, patchData) => {
    for (let champion of Object.values(patchData)) {
        if (champions[champion.apiName] !== undefined) {
            champions[champion.apiName].patch_data = champion;
            champions[champion.apiName].patch_data.icon = champion_icon_parse(champions[champion.apiName].patch_data.icon);
        }
    }
    return champions;
}

export const item_patch_combine = (items, patchData) => {
    for (let item of Object.values(patchData)) {
        if (items[item.id.toString()] !== undefined) {
            if (items[item.id.toString()].name.replaceAll(' ', '').toLowerCase() === item.name.replaceAll(' ', '').toLowerCase()) {
                items[item.id.toString()].patch_data = item;
            }
            else {
                if (items[item.id.toString()].patch_data === undefined) {
                    items[item.id.toString()].patch_data = item;
                }
            }
        }
    }
    return items;
}

export const trait_patch_combine = (traits, patchData) => {
    for (let trait of Object.values(patchData)) {
        if (traits[trait.apiName] !== undefined) {
            traits[trait.apiName].patch_data = trait;
            traits[trait.apiName].count = 0;
            traits[trait.apiName].champions = [];
            traits[trait.apiName].tier = -1;
            traits[trait.apiName].color = "";
        }
    }
    return traits;
}