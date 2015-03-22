(function(log) {
  var synaptic = require('synaptic'),
      captcha = require('./captcha.js'),
      png = require('pngjs').PNG,
      fs = require('fs');
  
  log('reading config file ...');
  
  var config = fs.readFileSync('./config.json', 'utf8');
  if(config === null)
    return;
  
  config = JSON.parse(config);
  
  log('... done');
  log();
  
  var sets = {
    training: [],
    testing: []
  };
  
  var training_set,
      testing_set,
      samples,
      size,
      threshold;
  
  if(config.mnist === true)
    mnist();
  else {
    var text = config.text || '0123456789',
        fonts = config.fonts || [
          '"Arial", "Helvetica", sans-serif'
        ],
        chars = text.length;

    var distortion = config.distortion === undefined ? true : config.distortion,
        n; // index to keep track of callbacks
    
    training_set = config.training_set || 2000;
    testing_set = config.testing_set || 500;
    samples = training_set + testing_set;
    size = config.image_size || 20;
    threshold = config.threshold || 400;

    log('generating images ...');
    for(n = 0; n < samples; n++)
      captcha.generate({
        size: chars,
        height: size,
        text: text,
        fonts: fonts,
        distortion: distortion
      }, generate(n));
  }
  
  // captcha callback
  function generate(n) {
    return function(text, data) {
      var PNG = new png({
        filterType: 4
      });
      
      PNG.parse(data, parse(text, n));
      if(n === 0)
         fs.writeFileSync('examples/' + text + '.png', data, 'base64');
    };
  }
  
  // parse MNIST data
  function mnist() {
    log('parsing MNIST data ...');
    var data = fs.readFileSync('./mnist/train-images.idx3-ubyte'),
        labels = fs.readFileSync('./mnist/train-labels.idx1-ubyte'),
        pixels = [],
        image,
        x, y;
    
    training_set = 60000;
    testing_set = 10000;
    samples = training_set + testing_set;
    threshold = 50;
    size = 20;
    
    var sample = Math.floor(Math.random() * training_set);
    for(image = 0; image < training_set; image++) {
      for(y = 4; y < size + 4; y++)
        for(x = 4; x < size + 4; x++)
          pixels.push(data[(image * 28 * 28) + (x + (y * 28)) + 15]);
      
      pixels = center(
        pixels.map(function(pixel) {
          return pixel > threshold ? 1 : 0;
        })
      );
      
      sets.training.push({
        input: pixels,
        output: ('0000' + parseInt(labels[image + 8]).toString(2)).substr(-4).split('').map(Number)
      });
      
      if(image === sample) {
        log('digit', labels[image + 8], 'from training set');

        while(pixels.length)
          log(pixels.splice(0, size).join(''));

        log();
      }
      
      pixels = [];
    }
    
    data = fs.readFileSync('./mnist/t10k-images-2.idx3-ubyte');
    labels = fs.readFileSync('./mnist/t10k-labels.idx1-ubyte');
    sample = Math.floor(Math.random() * testing_set);
    
    for(image = 0; image < testing_set; image++) {
      for(y = 4; y < size + 4; y++)
        for(x = 4; x < size + 4; x++)
          pixels.push(data[(image * 28 * 28) + (x + (y * 28)) + 15]);
      
      pixels = center(
        pixels.map(function(pixel) {
          return pixel > threshold ? 1 : 0;
        })
      );
      
      sets.testing.push({
        input: pixels,
        output: ('0000' + parseInt(labels[image + 8]).toString(2)).substr(-4).split('').map(Number)
      });
      
      if(image === sample) {
        log('digit', labels[image + 8], 'from testing set');
        
        while(pixels.length)
          log(pixels.splice(0, size).join(''));
        
        log();
      }
      
      pixels = [];
    }
    
    log('... done');
    log();
    
    // make sure sets are valid before proceeding
    for(var key in sets) {
      sets[key].forEach(function(object, i, array) {
        if(object.input.length !== 400 || object.output.length !== 4)
          array.splice(i, 1);
      });
    };
    
    train();
  }
  
  // 'parsed' event callback
  function parse(text, n) {
    return function(error, data) {
      if(error)
        throw error;
      
      var index,
          i, j, k,
          x, y;

      var chunk = [],
          pixel = [];
      for(i = 0; i < chars; i++) {
        for(y = 0; y < data.height; y++) {
          for(x = i * size; x < (i * size + size); x++) {
            index = (data.width * y + x) << 2;

            for(j = 0; j < 3; j++)
              pixel.push(data.data[index + j]);

            chunk.push(
              pixel.reduce(function(previous, current) {
                return previous + current;
              }) > threshold ? 0 : 1
            );
            pixel = [];
          }
        }
        
        chunk = center(chunk);
        
        if(n < training_set) {
          sets.training.push({
            input: chunk,
            output: ('00000000' + text.charCodeAt(i).toString(2)).substr(-8).split('').map(Number)
          });
        } else {
          sets.testing.push({
            input: chunk,
            output: ('00000000' + text.charCodeAt(i).toString(2)).substr(-8).split('').map(Number)
          });
        }
        
        chunk = [];
      }
      
      if(n === samples - 1) {
        log('... done');
        log();
        
        train();
      }
    };
  }
  
  function center(chunk) {
    var min = {
      x: size,
      y: size
    };
    var max = {
      x: 0,
      y: 0
    };
    var x, y,
        j, k;

    for(y = 0; y < size; y++) {
      for(x = 0; x < size; x++) {
        if(chunk[size * y + x]) {
          if(min.x > x)
            min.x = x;

          if(min.y > y)
            min.y = y;

          if(max.x < x)
            max.x = x;

          if(max.y < y)
            max.y = y;
        }
      }
    }

    var diff = {
      x: Math.floor((size / 2) - (min.x + (max.x - min.x) / 2)),
      y: Math.floor((size / 2) - (min.y + (max.y - min.y) / 2))
    };

    // fill array with size * size zeros
    var clone = Array.apply(null, new Array(size * size)).map(Number.prototype.valueOf, 0);

    // move character to center
    for(y = 0; y < size; y++) {
      for(x = 0; x < size; x++) {
        j = size * y + x;
        k = size * (y + diff.y) + (x + diff.x);

        if(chunk[j])
          clone[k] = chunk[j];
      }
    }
    
    return clone;
  }
  
  // train network
  function train() {
    var input = size * size,
        hidden = config.network.hidden || size * 2,
        output = config.mnist === true ? 4 : 8;
    
    var perceptron = new synaptic.Architect.Perceptron(input, hidden, output);
    var rate = config.network.learning_rate || (hidden / input),
        length = sets.training.length,
        object;
    
    log('neural network specs:');
    log('  layers:');
    log('    input:', input, 'neurons.');
    log('    hidden:', hidden, 'neurons.');
    log('    output:', output, 'neurons.');
    log('  learning rate:', rate);
    log('  training set:', length, 'characters.');
    log('  testing set:', sets.testing.length, 'characters.');
    log();
    
    log('learning ...');
    
    var count = 0;
    while(sets.training.length) {
      object = sets.training.pop();
      
      if(count > 0 && !(count % Math.round(length / 10)))
        log('progress:', Math.round(100 * (count / length)) + '%');
      
      perceptron.activate(object.input);
      perceptron.propagate(rate, object.output);
      
      count++;
    }
    
    log('... done');
    log();
    
    done(perceptron);
  }
  
  // network is trained and ready to use
  function done(network) {
    fs.writeFileSync('./network.js', 'module.exports.activate = ' + network.standalone().toString());
    
    log('network saved to ./network.js');
    log();
    
    var object,
        input,
        output,
        prediction,
        result;
    
    var length = sets.testing.length,
        success = 0,
        count = 0;
    
    // test on random inputs
    log('testing on', length, 'samples ...');
    while(sets.testing.length) {
      object = sets.testing.pop();
      
      if(count > 0 && !(count % Math.round(length / 10)))
        log('progress:', Math.round(100 * (count / length)) + '%');
      
      input = object.input;
      output = object.output;

      prediction = network
        .activate(input)
        .map(function(bit) {
          return bit > .5 ? 1 : 0;
        });
      
      // convert to chars
      if(config.mnist === true) {
        prediction = parseInt(prediction.join(''), 2);
        result = parseInt(output.join(''), 2);
      } else {
        prediction = String.fromCharCode(parseInt(prediction.join(''), 2));
        result = String.fromCharCode(parseInt(output.join(''), 2));
      }

      if(prediction === result)
        success++;
      
      count++;
    }
    
    log('... done');
    log();
    log('success rate:', (100 * (success / length)), '%');
  }
})(console.log);