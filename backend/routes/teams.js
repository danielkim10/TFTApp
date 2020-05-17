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

router.route('/set/:set').get((req, res) => {
  Team.find({set: req.params.set})
    .then(team => res.json(team))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/update/:id').post((req, res) => {
  Team.findById(req.params.id)
    .then(team => {
      team.name = req.body.name;
      team.team = req.body.team;
      team.synergies = req.body.synergies;
      team.teamString = req.body.teamString;
      team.set = req.body.set;
      team.patch = req.body.patch;

      team.save()
        .then(() => res.json('Team saved'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const team = req.body.team;
  const synergies = req.body.synergies;
  const teamString = req.body.teamString;
  const set = req.body.set;
  const patch = req.body.patch;
  const newTeam = new Team({name, team, synergies, teamString, set, patch});

  newTeam.save()
    .then(() => res.json('Team added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
