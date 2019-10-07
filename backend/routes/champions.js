const router = require('express').Router();
let Champion = require('../models/champions.model');

router.route('/').get((req, res) => {
  Champion.find()
    .then(champions => res.json(champions))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:key')
  .all(function(req, res, next) {
    next();
  })
  .get(function(req, res, next) {
    res.json(req.champion);
  })
  .post(function(req, res, next) {
    next(new Error('not implemented'));
  })
  .delete(function(req, res, next) {
    next(new Error('not implemented'));
  })

router.route('/add').post((req, res) => {
  const id = req.body.id;
  const key = req.body.key;
  const name = req.body.name;
  const origin = req.body.origin;
  const classe = req.body.classe;
  const cost = req.body.cost;
  const ability = req.body.ability;
  const stats = req.body.stats;
  const image = req.body.image;
  const newChampion = new Champion({id, key, name, origin, classe, cost,
                                    ability, stats, image});

  newChampion.save()
    .then(() => res.json('Champion added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
