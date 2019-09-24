const router = require('express').Router();
let Class = require('../models/classes.model');

router.route('/').get((req, res) => {
  Class.find()
    .then(classes => res.json(classes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const newClass = new Class(name);

  newClass.save()
    .then(() => res.json('Class added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
