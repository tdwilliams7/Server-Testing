const express = require('express');
const bodyParser = require('body-parser');
const Food = require('./food');
const morgan = require('morgan');

const server = express();
server.use(bodyParser.json());
server.use(morgan('combined'));

server.get('/food', (req, res) => {
  Food.find({}, (err, food) => {
    if (err) return res.send(err);
    res.send(food);
  });
});

server.put('/food', (req, res) => {
  Food.findById(req.body.id, (err, food) => {
    food.name = req.body.name;
    food.save((err, updatedFood) => {
      if (err) return res.send(err);
      res.send(updatedFood);
    });
  });
});

server.delete('/food/:id', (req, res) => {
  Food.findById(req.params.id).remove((err, removedFood) => {
    if (err) return res.send(err);
    res.send(`success`);
  });
});

server.post('/food', (req, res) => {
  const food = new Food(req.body);
  food.save((err, newFood) => {
    if (err) return res.send(err);
    res.send(newFood);
  });
});

module.exports = server;