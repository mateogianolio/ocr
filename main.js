(function () {
  'use strict';

  console.log('reading config file ...');

  var synaptic = require('synaptic'),
      network = require('./network.js'),
      captcha = require('./captcha.js'),
      tools = require('./tools.js'),
      PNG = require('pngjs').PNG,
      fs = require('fs'),
      config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

  if(config === null)
    return;

  config.training_set = config.training_set || 2000;
  config.testing_set = config.testing_set || 500;
  config.image_size = config.image_size || 20;
  config.threshold = config.threshold || 400;
  config.text = config.text || '0123456789';
  config.fonts = config.fonts || ['serif', 'sans-serif'];
  config.distortion = config.distortion === undefined ? true : config.distortion;
  config.network.hidden = config.network.hidden || 40;
  config.network.output = config.network.output || 10;
  config.network.learning_rate = config.network.learning_rate || 0.1;

  console.log('... done');
  console.log();

  var perceptron = new synaptic.Architect.Perceptron(
    (config.image_size * config.image_size), // input
    config.network.hidden, // hidden
    config.network.output // output
  );

  var index,
      samples = config.training_set + config.testing_set,
      training = [],
      testing = [],
      settings = {
        size: config.text.length,
        height: config.image_size,
        text: config.text,
        fonts: config.fonts,
        distortion: config.distortion
      };

  // captcha callback
  var k = 0;
  function generate(text, data) {
    if (k === 0)
      fs.writeFileSync('./examples/' + text + '.png', data, 'base64');

    var png = new PNG({ filterType: 4 });

    png.parse(data, function(error, data) {
      if(error)
        throw error;

      var position,
          chunk = [],
          pixel = [],
          i, j, x, y;

      for(i = 0; i < config.text.length; i++) {
        for(y = 0; y < data.height; y++) {
          for(x = i * config.image_size; x < (i * config.image_size + config.image_size); x++) {
            position = (data.width * y + x) << 2;

            for(j = 0; j < 3; j++)
              pixel.push(data.data[position + j]);

            chunk.push(
              pixel.reduce(function(previous, current) {
                return previous + current;
              }) > config.threshold ? 0 : 1
            );
            pixel = [];
          }
        }

        chunk = tools.center(chunk);

        var output = Array.apply(null, new Array(config.network.output)).map(Number.prototype.valueOf, 0);
        output[i] = 1;

        if(k < config.training_set) {
          training.push({
            input: chunk,
            output: output
          });
        } else {
          testing.push({
            input: chunk,
            output: output
          });
        }

        chunk = [];
      }

      if(k++ === samples - 1) {
        console.log('... done');
        console.log();

        network.train(perceptron, training, config.network.learning_rate);
        fs.writeFileSync('./ocr.js', 'module.exports = ' + perceptron.standalone().toString());
        network.test(perceptron, testing);
      }
    });
  }

  console.log('generating images ...');

  for(index = 0; index < samples; index++)
    captcha.generate(settings, generate);
})();
