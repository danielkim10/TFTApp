export const patch_data_url = () => {
    return "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json";
}

export const assets_url = (asset) => {
    return `https://raw.communitydragon.org/latest/game/${asset}png`;
}

export const summoner_by_name_url = (name) => {
    return `/tft/summoner/v1/summoners/by-name/${name}`;
}

export const summoner_by_puuid_url = (puuid) => {
    return `/tft/summoner/v1/summoners/by-puuid/${puuid}`;
}

export const match_list_url = (puuid) => {
    return `/tft/match/v1/matches/by-puuid/${puuid}/ids`;
}

export const match_url = (match_id) => {
    return `/tft/match/v1/matches/${match_id}`;
}

export const ranked_league_url = (summoner_id) => {
    return `/tft/league/v1/entries/by-summoner/${summoner_id}`;
}

export const host_url = (platform) => {
    return `https://${platform}.api.riotgames.com`;
}

export const companion_bin_url = (species, skin_ID) => {
    return `https://raw.communitydragon.org/latest/game/data/characters/${species}/skins/skin${skin_ID}.bin.json`;
}

export const companion_icon_url = (icon) => {
    return `https://raw.communitydragon.org/latest/game/${icon}png`;
}

export const profile_icon_url = (icon) => {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${icon}.jpg`;
}

export const trait_bg_url = (style) => {
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default/${style}.png`;
}