const router = require('express').Router();
let Hex = require('../models/hexes.model');

router.route('/').get((req, res) => {
  Hex.find()
    .then(hexes => res.json(hexes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const key = req.body.key;
  const name = req.body.name;
  const description = req.body.description;
  const bonus = req.body.bonus;
  const set = req.body.set;
  const image = req.body.image;
  const newHex = new Hex({key, name, description, bonus, set, image});

  newHex.save()
    .then(() => res.json('Hex added'))
    .catch(err => res.status(400).json('Error: ' + err));
});
