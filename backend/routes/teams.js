const router = require('express').Router();
let Team = require('../models/teams.model');

router.route('/').get((req, res) => {
  Team.find()
    .then(teams => res.json(teams))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Team.findById(req.params.id)
    .then(team => res.json(team))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Team.findById(req.params.id)
    .then(team => {
      team.team = req.body.team;

      team.save()
        .then(() => res.json('Team saved'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const team = req.body.team;
  const newTeam = new Team({team});

  newTeam.save()
    .then(() => res.json('Team added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
