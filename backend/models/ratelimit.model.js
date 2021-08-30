const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratelimitSchema = new Schema ({
  dateFirst: {type: Number},
  dateNow: {type: Number},
  limitSecond: {type: Number},
  limit2Minute: {type: Number},
  remainingPerRegion: {type: Object},
});

const RateLimit = mongoose.model('Rate Limit', ratelimitSchema);

module.exports = RateLimit;
