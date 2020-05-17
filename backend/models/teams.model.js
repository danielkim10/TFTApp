const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema ({
  name: {type: String},
  team: [{type: Object}],
  synergies: {type: Object},
  teamString: {type: String},
  set: {type: Number},
  patch: {type: String},
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
