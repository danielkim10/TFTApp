const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const originSchema = new Schema({
  key: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String},
  bonuses: [{
    needed: {type: Number},
    effect: {type: String},
  }],
  neededMustBeExact: {type: Bool},
  image: {type: String},
});

const Origin = mongoose.model('Origin', originSchema);

module.exports = Origin;
