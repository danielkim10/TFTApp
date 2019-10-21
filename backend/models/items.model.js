const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  key: {type: String, required: true},
  name: {type: String, required: true},
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
  image: {type: String},
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
