const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const originSchema = new Schema({
  key: {type: String},
  name: {type: String},
  description: {type: String},
  bonuses: [{
    needed: {type: Number},
    effect: {type: String},
  }],
  neededMustBeExact: {type: Boolean},
  image: {type: String},
});

const Origin = mongoose.model('Origin', originSchema);

module.exports = Origin;
