const router = require('express').Router();
let Origin = require('../models/origins.model');

router.route('/').get((req, res) => {
  Origin.find()
    .then(origins => res.json(origins))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const newOrigin = new Origin({name});

  newOrigin.save()
    .then(() => res.json('Origin added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
