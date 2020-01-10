const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema ({
  team: [{
    champion: {type: Champion},
    tier: {type: Number},
    items: [{type: Item}],
  }],
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
