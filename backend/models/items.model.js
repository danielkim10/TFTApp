const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  id: {type: Number},
  key: {type: String},
  name: {type: String},
  type: {type: String},
  bonus: {type: String},
  depth: {type: Number},
  stats: [{
    name: {type: String},
    label: {type: String},
    value: {type: Number},
  }],
  buildsFrom: [{type: String}],
  buildsInto: [{type: String}],
  unique: {type: Boolean},
  cannotEquip: {type: String},
  set: {type: Number},
  image: {type: String},
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
