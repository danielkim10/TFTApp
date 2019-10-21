const router = require('express').Router();
let Item = require('../models/items.model');

router.route('/').get((req, res) => {
  Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Item.findById(req.params.id)
    .then(item => res.json(item))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      item.key = req.body.key;
      item.name = req.body.name;
      item.type = req.body.type;
      item.bonus = req.body.bonus;
      item.depth = req.body.depth;
      item.stats = req.body.stats;
      item.buildsFrom = req.body.buildsFrom;
      item.buildsInto = req.body.buildsInto;
      item.unique = req.body.unique;
      item.image = req.body.image;

      item.save()
        .then(() => res.json('Item updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const key = req.body.key;
  const name = req.body.name;
  const type = req.body.type;
  const bonus = req.body.bonus;
  const depth = req.body.depth;
  const stats = req.body.stats;
  const buildsFrom = req.body.buildsFrom;
  const buildsInto = req.body.buildsInto;
  const unique = req.body.unique;
  const image = req.body.image;
  const newItem = new Item({key, name, type, bonus, depth, stats, buildsFrom, buildsInto, unique, image});

  newItem.save()
    .then(() => res.json('Item added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
