const router = require('express').Router();
let Champion = require('../models/champions.model');

router.route('/').get((req, res) => {
  Champion.find()
    .then(champions => res.json(champions))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const newChampion = new Champion({name});

  newChampion.save()
    .then(() => res.json('Champion added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
