const router = require('express').Router();
let Champion = require('../models/champions.model');

router.route('/').get((req, res) => {
  Champion.find()
    .then(champions => res.json(champions))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Champion.findById(req.params.id)
    .then(champion => res.json(champion))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Champion.findById(req.params.id)
    .then(champion => {
      champion.id = req.body.id;
      champion.key = req.body.key;
      champion.name = req.body.name;
      champion.cost = req.body.cost;
      champion.origin = req.body.origin;
      champion.classe = req.body.classe;
      champion.ability = req.body.ability;
      champion.stats = req.body.stats;
      champion.image = req.body.image;
      champion.icon = req.body.icon;

      champion.save()
        .then(() => res.json('Champion updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

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
  const icon = req.body.icon;
  const newChampion = new Champion({id, key, name, origin, classe, cost,
                                    ability, stats, image, icon});

  newChampion.save()
    .then(() => res.json('Champion added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
