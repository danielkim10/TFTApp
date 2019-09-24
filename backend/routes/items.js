const router = require('express').Router();
let Item = require('../models/items.model');

router.route('/').get((req, res) => {
  Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const newItem = new Item({name});

  newItem.save()
    .then(() => res.json('Item added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
