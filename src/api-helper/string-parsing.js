var fnv = require('fnv-plus');

export const item_desc_parse = (item) => {
  let description = item.patch_data.desc;
  let desc_hashed = '';
  let previous_index = 0;
  let counter = 0;
  let counter2 = 0;

  if (description.indexOf('@') === -1) {
    return item.description;
  }

  description = description.replaceAll('<br>', '\r\n');

  console.log(description);

  while (description.indexOf('@') !== -1) {
    previous_index = 0;
    counter = description.indexOf('@');
    counter2 = description.indexOf('@', description.indexOf('@') + 1);
    let substring = description.substring(counter+1, counter2);
    let fnvsubstring = '{' + fnv.fast1a32hex(substring.toLowerCase()) + '}';
    if (substring === 'Lifesteal') {
      desc_hashed += description.substring(previous_index, counter) + item.patch_data.effects['LifeSteal'];
    }
    else if (item.patch_data.effects[substring] !== undefined) {
      desc_hashed += description.substring(previous_index, counter) + item.patch_data.effects[substring];
    }
    else if (item.patch_data.effects[fnvsubstring] !== undefined) {
      desc_hashed += description.substring(previous_index, counter) + item.patch_data.effects[fnvsubstring];
    }
    previous_index = counter2+1;
    description = description.substring(counter2+1, description.length);
  }
  desc_hashed += description;
  return desc_hashed;
}

export const champion_icon_parse = (icon) => {
  if (icon.indexOf('TFT_Set5_Stage2') > -1) {
    let championId = icon.substring(icon.indexOf('ChampionSplashes/')+17, icon.indexOf('.')).toLowerCase();
    //console.log(icon);
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championId}/hud/${championId}_square.tft_set5_stage2.png`;
  }
  else if (icon.indexOf('TFT_Set5') > -1) {
    let championIconParse = icon.substring(icon.indexOf('ChampionSplashes/')+17, icon.indexOf('.TFT_Set5')).toLowerCase();
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championIconParse}/hud/${championIconParse}_square.tft_set5.png`;
  }
  else {
    let championIconParse = icon.substring(icon.indexOf('ChampionSplashes/')+17, icon.indexOf('.dds')).toLowerCase();
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championIconParse}/hud/${championIconParse}_square.png`;
  }
}

export const ability_desc_parse = (ability) => {
  let description = ability.desc;
  let desc_parsed = '';
  let previous_index = 0;
  let counter = 0;
  let counter2 = 0;

  if (description.indexOf('@') === -1) {
    return description;
  }

  description = description.replaceAll('<br>', '\r\n');

  while (description.indexOf('@') !== -1) {
    previous_index = 0;
    counter = description.indexOf('@');
    counter2 = description.indexOf('@', description.indexOf('@') + 1);
    let substring = description.substring(counter+1, counter2);
    for (let variable in ability.variables) {
      if (ability.variables[variable].name === substring || ability.variables[variable].name === substring.substring(0,substring.length-4)) {
        if (ability.variables[variable].value[1] === ability.variables[variable].value[2] && ability.variables[variable].value[1] === ability.variables[variable].value[3]) {
          desc_parsed += description.substring(previous_index, counter) + (Math.round(ability.variables[variable].value[1]*100)/100);
          previous_index = counter2+1;
          description = description.substring(counter2+1, description.length);
          counter = 0;
          counter2 = -1;
          break;
        }
        else {
          description = description.replace(description.substring(counter, counter2+1), '');
          counter = 0;
          counter2 = -1;
          break;
        }
      }
      else {
        
      }
    }
    description = description.replace(description.substring(counter, counter2+1), '');
  }
  desc_parsed += description;
  
  return desc_parsed;
}

export const ability_icon_parse = (patch_data) => {
  let icon = patch_data.ability.icon.substring(patch_data.ability.icon.indexOf('Icons2D/')+8, patch_data.ability.icon.indexOf('.dds')).toLowerCase();
  icon = icon.replace('tft5_', '');
  icon = icon.replace('.tft_set5', '');
  switch(patch_data.name) {
    case 'Akshan':
      icon = 'akshan_e.akshan';
      break;
    case 'Garen':
      return "https://raw.communitydragon.org/latest/game/assets/characters/tft5_garen/hud/icons2d/tft5_garen_eyeofthestorm.tft_set5.png";
    case 'Karma':
      return "https://raw.communitydragon.org/latest/game/assets/characters/karma/hud/icons2d/karma_q2.png"
    case 'Nidalee':
      return "https://raw.communitydragon.org/latest/game/assets/characters/nidalee/hud/icons2d/nidalee_r2.png"
    case 'Nunu & Willump':
      return "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/nunu/hud/icons2d/" + icon + ".png"
    case 'Rakan':
      return "https://raw.communitydragon.org/latest/game/assets/characters/rakan/hud/icons2d/rakan_e2.png"
    case 'Rell':
      return "https://raw.communitydragon.org/latest/game/assets/characters/rell/hud/icons2d/relle.darksupport.png"
    case 'Syndra':
      return "https://raw.communitydragon.org/latest/game/assets/characters/syndra/hud/icons2d/syndraw2.png"
    case 'Teemo':
      return "https://raw.communitydragon.org/latest/game/assets/characters/tft5_teemo/hud/icons2d/tft5_teemo_spell.tft_set5.png";
    default:
      break;
  }
  return "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/" + patch_data.name.replace(' ', '').replace('\'', '').toLowerCase() + "/hud/icons2d/" + icon + ".png";
}

export const ability_variables_convert = (ability) => {
  
}

export const trait_desc_parse = (patch_data) => {
    let description = patch_data.desc.substring(0, patch_data.desc.indexOf('<br>'));
    let desc_hashed = '';
    let previous_index = 0;
    let counter = 0;
    let counter2 = 0;
    while (description.indexOf('@') !== -1) {
        previous_index = 0;
        counter = description.indexOf('@');
        counter2 = description.indexOf('@', description.indexOf('@') + 1);

        let substring = description.substring(counter+1, counter2);
        let fnvsubstring = '{' + fnv.fast1a32hex(substring.toLowerCase()) + '}';
    

        desc_hashed += description.substring(previous_index, counter) + patch_data.effects[0].variables[fnvsubstring];

        previous_index = counter2+1;
        description = description.substring(counter2+1, description.length);
    }
    desc_hashed += description;
    return desc_hashed;
}

export const trait_effect_parse = (string, patch_data) => {
    let effects = [];
    for (let i = 0; i < patch_data.effects.length; i++) {
      effects.push('');
    }
    let previous_index = 0;
    let counter = 0;
    let counter2 = 0;
    while (string.indexOf('@') !== -1) {
      previous_index = 0;
      counter = string.indexOf('@');
      counter2 = string.indexOf('@', string.indexOf('@') + 1);

      let substring = string.substring(counter+1, counter2);
      let fnvsubstring = '{' + fnv.fast1a32hex(substring.toLowerCase()) + '}';

      for (let effect in patch_data.effects) {
        
        if (patch_data.effects[effect].variables[substring] !== undefined) {
          effects[effect] += string.substring(previous_index, counter) + patch_data.effects[effect].variables[substring];
        }
        else if (patch_data.effects[effect].variables[fnvsubstring] !== undefined) {
          effects[effect] += string.substring(previous_index, counter) + patch_data.effects[effect].variables[fnvsubstring];
        }
        else if (substring === 'MinUnits') {
          effects[effect] += string.substring(previous_index, counter) + patch_data.effects[effect].minUnits;
        }
      }

      previous_index = counter2+1;
      string = string.substring(counter2+1, string.length);
    }

    for (let effect in effects) {
      effects[effect] += string;
    }
    return effects;
}

export const companion_parse = (companion) => {
  return '{' + fnv.fast1a32hex(companion) + '}';
}