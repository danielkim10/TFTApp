const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
  key: {type: String},
  name: {type: String, required: true},
  description: {type: String},
  bonuses: [{
    needed: {type: Number},
    effect: {type: String},
  }],
  neededMustBeExact: {type: Bool},
  image: {type: String},
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
