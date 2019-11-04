const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
  id: {type: Number},
  key: {type: String},
  name: {type: String},
  description: {type: String},
  bonuses: [{
    needed: {type: Number},
    effect: {type: String},
  }],
  mustBeExact: {type: Boolean},
  set: {type: Number},
  image: {type: String},
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
