const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema ({
  name: { type: String },
  team: [{ type: Object }],
  traits: [{ type: Object }],
  date: { type: Date },
  set: { type: Number },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
