const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hexSchema = new Schema({
  key: {type: String},
  name: {type: String},
  description: {type: String},
  bonus: {
    name: {type: String},
    label: {type: String},
    value: {type: Number},
  },
  set: {type: Number},
  image: {type: String},
});

const Hex = mongoose.model('Hex', hexSchema);

module.exports = Hex;
