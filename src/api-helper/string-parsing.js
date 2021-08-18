var fnv = require('fnv-plus');

export function item_desc_parse(item) {
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

export function ability_desc_parse(ability) {
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

export function ability_variables_convert(ability) {
  
}

export function synergy_desc_parse(patch_data) {
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

export function synergy_effect_parse(string, patch_data) {
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