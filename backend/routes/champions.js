const router = require('express').Router();
let Champion = require('../models/champions.model');

router.route('/').get((req, res) => {
  Champion.find()
    .then(champions => res.json(champions))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const id = req.body.id;
  const key = req.body.key;
  const name = req.body.name;
  const origin = req.body.origin;
  const class = req.body.class;
  const cost = req.body.cost;
  const ability = req.body.ability;
  const stats = req.body.stats;
  const newChampion = new Champion({id, key, name, origin, class, cost,
                                    ability, stats});

  newChampion.save()
    .then(() => res.json('Champion added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
