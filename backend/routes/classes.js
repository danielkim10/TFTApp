const router = require('express').Router();
let Class = require('../models/classes.model');

router.route('/').get((req, res) => {
  Class.find()
    .then(classes => res.json(classes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Class.findById(req.params.id)
    .then(classe => res.json(classe))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const key = req.body.key;
  const name = req.body.name;
  const description = req.body.description;
  const bonuses = req.body.bonuses;
  const mustBeExact = req.body.mustBeExact;
  const image = req.body.image;
  const newClass = new Class({key, name, description, bonuses, mustBeExact, image});

  newClass.save()
    .then(() => res.json('Class added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
