const router = require('express').Router();
let RateLimit = require('../models/ratelimit.model');

router.route('/get/:date').get((req, res) => {
    // RateLimit.find()
    RateLimit.find({'dateFirst': {$gte: parseInt(req.params.date) - 120*1000, $lt: parseInt(req.params.date)}})
        .then(ratelimit => res.json(ratelimit))
        .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/').get((req, res) => {
//     RateLimit.find()
//         .then(ratelimit => res.json(ratelimit))
//         .catch(err => res.status(400).json('Error: ' + err));
// })

router.route('/update/:id').post((req, res) => {
    RateLimit.findById(req.params.id)
        .then(ratelimit => {
            ratelimit.dateFirst = req.body.dateFirst;
            ratelimit.dateNow = req.body.dateNow;
            ratelimit.limitSecond = req.body.limitSecond;
            ratelimit.limit2Minute = req.body.limit2Minute;
            ratelimit.remainingPerRegion = req.body.remainingPerRegion;

            ratelimit.save()
                .then(() => res.json('Rate Limit saved'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const dateFirst = req.body.dateFirst;
    const dateNow = req.body.dateNow;
    const limitSecond = req.body.limitSecond;
    const limit2Minute = req.body.limit2Minute;
    const remainingPerRegion = req.body.remainingPerRegion;
    const newRateLimit = new RateLimit({dateFirst, dateNow, limitSecond, limit2Minute, remainingPerRegion});

    newRateLimit.save()
        .then(() => res.json('Rate Limit added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete').post((req, res) => {
    req.setTimeout(0);
    RateLimit.deleteMany({'dateFirst': {$lt: Date.now() - 120*1000}})
        .then()
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

