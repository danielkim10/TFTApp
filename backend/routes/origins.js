const router = require('express').Router();
let Origin = require('../models/origins.model');

router.route('/').get((req, res) => {
  Origin.find()
    .then(origins => res.json(origins))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Origin.findById(req.params.id)
    .then(origin => res.json(origin))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/update/:id').post((req, res) => {
  Origin.findById(req.params.id)
    .then(origin => {
      origin.id = req.body.id;
      origin.key = req.body.key;
      origin.name = req.body.name;
      origin.description = req.body.description;
      origin.bonuses = req.body.bonuses;
      origin.mustBeExact = req.body.mustBeExact;
      origin.set = req.body.set;
      origin.image = req.body.image;

      origin.save()
        .then(() => res.json('Origin updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error :' + err));
});

router.route('/add').post((req, res) => {
  const id = req.body.id;
  const key = req.body.key;
  const name = req.body.name;
  const description = req.body.description;
  const bonuses = req.body.bonuses;
  const mustBeExact = req.body.mustBeExact;
  const set = req.body.set;
  const image = req.body.image;
  const newOrigin = new Origin({id, key, name, description, bonuses, mustBeExact, set, image});

  newOrigin.save()
    .then(() => res.json('Origin added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
