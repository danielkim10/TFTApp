const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const championSchema = new Schema({
  id: {type: Number},
  key: {type: String},
  name: {type: String},
  origin: [{type: String}],
  classe: [{type: String}],
  cost: [{type: Number}],
  ability: {
    name: {type: String},
    description: {type: String},
    type: {type: String},
    manaCost: {type: Number},
    manaStart: {type: Number},
    stats: [{
      type: {type: String},
      value: [{type: Number}],
    }]
  },
  stats: {
    offense: {
      damage: [{type: Number}],
      attackSpeed: {type: Number},
      spellPower: {type: Number},
      critChance: {type: Number},
      range: {type: Number},
    },
    defense: {
      health: [{type: Number}],
      armor: {type: Number},
      magicResist: {type: Number},
    },
  },
  image: {type: String},
  icon: {type: String},
});

const Champion = mongoose.model('Champion', championSchema);

module.exports = Champion;
