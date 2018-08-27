'use strict';

const router = require('../lib/router');
//const cowsay = require('cowsay');
const Cow = require('../models/cows');

router.get('/api/cows', (req, res) => {
  if (req.query.id) {
    return Cow.findById(req.query.id)
      .then(cows => {
        json(res, cows);
      });
  }

  Cow.fetchAll()
    .then(cows => {
      json(res, cows);
    });
});


router.post('/api/cows', (req, res) => {
  var newCow = new Cow(req.body);
  newCow.save()
    .then(saved => {
      json(res, saved);
    });
});


router.delete('/api/cowsay', (req, res) => {
  json(res, {
    message: `Cow number ${req.query.id} is deleted`,
  });
});

function json(res, object) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(object));
  res.end();
}

