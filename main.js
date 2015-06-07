(function(log) {
  'use strict';
  
  log('reading config file ...');
  
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
  config.network.output = config.network.output || 8;
  config.network.learning_rate = config.network.learning_rate || 0.1;
  
  log('... done');
  log();
  
  var perceptron;
  
  if(config.mnist === true) {
    perceptron = new synaptic.Architect.Perceptron(
      (config.image_size * config.image_size), // input
      config.network.hidden, // hidden
      4 // output
    );
    
    mnist();
  } else {
    perceptron = new synaptic.Architect.Perceptron(
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

    log('generating images ...');
    
    for(index = 0; index < samples; index++)
      captcha.generate(settings, generate(index));
  }
  
  // captcha callback
  function generate(index) {
    return function(text, data) {
      var png = new PNG({ filterType: 4 });
      png.parse(data, parse(text, index));
      
      if(index === 0)
        fs.writeFileSync('./examples/' + text + '.png', data, 'base64');
    };
  }
  
  // parse MNIST data
  function mnist() {
    log('parsing MNIST data ...');
    
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
      
      pixels = tools.center(
        pixels.map(function(pixel) {
          return pixel > config.threshold ? 1 : 0;
        })
      );
      
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
      
      pixels = tools.center(
        pixels.map(function(pixel) {
          return pixel > config.threshold ? 1 : 0;
        })
      );
      
      testing.push({
        input: pixels,
        output: ('0000' + parseInt(labels[image + 8]).toString(2)).substr(-4).split('').map(Number)
      });
      
      pixels = [];
    }
    
    log('... done', '\n');
    
    tools.validate(perceptron, training);
    tools.validate(perceptron, testing);
    
    network.train(perceptron, training, config.network.learning_rate);
    fs.writeFileSync('./ocr.js', perceptron.standalone().toString());
    network.test(perceptron, testing);
  }
  
  // 'parsed' event callback
  function parse(text, index) {
    return function(error, data) {
      if(error)
        throw error;
      
      var position,
          chunk = [],
          pixel = [],
          i, j, k, x, y;
      
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
        
        if(index < config.training_set) {
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
      
      if(index === samples - 1) {
        log('... done');
        log();
        
        network.train(perceptron, training, config.network.learning_rate);
        fs.writeFileSync('./ocr.js', perceptron.standalone().toString());
        network.test(perceptron, testing);
      }
    };
  }
})(console.log);