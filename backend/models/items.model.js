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
    title: {type: String},
    amount: {type: Number},
  }],
  tier: [{type: String}],
  buildsInto: [{type: String}],
  unique: {type: Bool},
  image: {type: String},
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
