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

router.route('/name/:name').get((req, res) => {
  Class.find({name: req.params.name})
    .then(classe => res.json(classe))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/set/:set').get((req, res) => {
  Class.find({set: req.params.set})
    .then(classe => res.json(classe))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/update/:id').post((req, res) => {
  Class.findById(req.params.id)
    .then(classe => {
      classe.id = req.body.id;
      classe.key = req.body.key;
      classe.name = req.body.name;
      classe.description = req.body.description;
      classe.bonuses = req.body.bonuses;
      classe.mustBeExact = req.body.mustBeExact;
      classe.set = req.body.set;
      classe.image = req.body.image;

      classe.save()
        .then(() => res.json('Class updated'))
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
  const newClass = new Class({id, key, name, description, bonuses, mustBeExact, set, image});

  newClass.save()
    .then(() => res.json('Class added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
