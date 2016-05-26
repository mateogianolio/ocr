(function () {
  'use strict';

  var fs = require('fs'),
      synaptic = require('synaptic'),
      config = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
      network = require('./network.js');

  var perceptron = new synaptic.Architect.Perceptron(
    (config.image_size * config.image_size), // input
    config.network.hidden, // hidden
    4 // output
  );

  console.log('parsing MNIST data ...');

  var data = fs.readFileSync('./mnist/train-images.idx3-ubyte'),
      labels = fs.readFileSync('./mnist/train-labels.idx1-ubyte'),
      training = [],
      testing = [],
      pixels = [],
      image,
      x, y;

  config.training_set = 60000;
  config.testing_set = 10000;
  config.threshold = 50;
  config.image_size = 20;

  for(image = 0; image < config.training_set; image++) {
    for(y = 4; y < config.image_size + 4; y++)
      for(x = 4; x < config.image_size + 4; x++)
        pixels.push(data[(image * 28 * 28) + (x + (y * 28)) + 15]);

    pixels = tools.center(pixels.map(binary));

    training.push({
      input: pixels,
      output: ('0000' + parseInt(labels[image + 8]).toString(2)).substr(-4).split('').map(Number)
    });

    pixels = [];
  }

  data = fs.readFileSync('./mnist/t10k-images-2.idx3-ubyte');
  labels = fs.readFileSync('./mnist/t10k-labels.idx1-ubyte');

  for(image = 0; image < config.testing_set; image++) {
    for(y = 4; y < config.image_size + 4; y++)
      for(x = 4; x < config.image_size + 4; x++)
        pixels.push(data[(image * 28 * 28) + (x + (y * 28)) + 15]);

    pixels = tools.center(pixels.map(binary));

    testing.push({
      input: pixels,
      output: ('0000' + parseInt(labels[image + 8]).toString(2)).substr(-4).split('').map(Number)
    });

    pixels = [];
  }

  console.log('... done', '\n');

  network.train(perceptron, training, config.network.learning_rate);
  fs.writeFileSync('./ocr.js', 'module.exports = ' + perceptron.standalone().toString());
  network.test(perceptron, testing);
}());
