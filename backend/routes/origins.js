const router = require('express').Router();
let Origin = require('../models/origins.model');

router.route('/').get((req, res) => {
  Origin.find()
    .then(origins => res.json(origins))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const key = req.body.key;
  const name = req.body.name;
  const description = req.body.description;
  const bonuses = req.body.bonuses;
  const mustBeExact = req.body.mustBeExact;
  const image = req.body.image;
  const newOrigin = new Origin({key, name, description, bonuses, mustBeExact, image});

  newOrigin.save()
    .then(() => res.json('Origin added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
