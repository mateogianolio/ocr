(function(log) {
  var synaptic = require('synaptic'),
      captcha = require('node-captcha'),
      png = require('pngjs').PNG,
      fs = require('fs');
  
  var text = '01234567890123456789',
      chars = text.length;
  
  var set = [];
  
  var threshold = 300,
      samples = 2000,
      size = 20,
      n;
  
  log('generating images to input/ ...');
  for(n = 0; n < samples; n++) {
    captcha({
      size: chars,
      height: size,
      text: text,
      noise: false,
      fileMode: 2
    }, generate(n));
  }
  
  // captcha callback
  function generate(n) {
    return function(text, data) {
      var PNG = new png({
        filterType: 4
      });
      
      PNG.parse(data, parse(text, n));
      //fs.writeFileSync('./input/' + n + '.png', data, 'base64');
    };
  }
  
  // 'parsed' event callback
  function parse(text, n) {
    return function(error, data) {
      if(error)
        throw error;
      
      var index,
          i, j,
          x, y;

      var chunks = [],
          chunk = [],
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
        
        // center of mass calculation
        var mass = 0,
            sum = {
              x: 0,
              y: 0
            };
        for(y = 0; y < size; y++) {
          for(x = 0; x < size; x++) {
            if(chunk[size * y + x]) {
              sum.x += x;
              sum.y += y;
              mass++;
            }
          }
        }
        
        // diff from center of mass to center of image
        var diff = {
          x: (size / 2) - Math.round(sum.x / mass),
          y: (size / 2) - Math.round(sum.y / mass)
        };
        
        // length before move
        var len = chunk.length;
        
        // move center of mass to center of image
        for(y = 0; y < size; y++) {
          for(x = 0; x < size; x++) {
            if(chunk[size * y + x]) {
              chunk[size * (y + diff.y) + (x + diff.x)] = chunk[size * y + x];
              chunk[size * y + x] = 0;
            }
          }
        }

        chunks.push({
          character: text.charCodeAt(i),
          chunk: chunk
        });
        chunk = [];
      };

      while(chunks.length) {
        chunk = chunks.pop();

        set.push({
          input: chunk.chunk,
          output: ('00000000' + chunk.character.toString(2)).substr(-8).split('').map(Number)
        });
      }
      
      chunks = [];
      
      if(n === samples - 1) {
        log('... done');
        log();
        train();
      }
    };
  }
  
  // train network
  function train() {
    var input = size * size,
        hidden = size * 2,
        output = 8;
    
    var perceptron = new synaptic.Architect.Perceptron(input, hidden, output);
    var rate = hidden / input,
        length = set.length,
        object;
    
    log('neural network specs:');
    log('  layers:');
    log('    input:', input, 'neurons.');
    log('    hidden:', hidden, 'neurons.');
    log('    output:', output, 'neurons.');
    log('  learning rate:', rate);
    log('  training set:', samples, 'images containing', length, 'distorted characters.');
    log();
    
    log('learning ...');
    
    var i, j;
    for(i = 0; i < length; i++) {
      object = set[i];
      
      if(object.input.length !== input)
        continue;
      
      if(i > 0 && !(i % (length / 10)))
        log('progress:', Math.round(100 * (i / length)) + '%');
      
      perceptron.activate(object.input);
      perceptron.propagate(rate, object.output);
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
    
    var input,
        output,
        prediction,
        result,
        r;
    
    var samples = 10000,
        success = 0,
        i;
    
    // test on random inputs
    log('testing on', samples, 'random input samples ...');
    for(i = 0; i < samples; i++) {
      if(i > 0 && !(i % (samples / 10)))
        log('progress:', Math.round(100 * (i / samples)) + '%');
      
      r = Math.floor(Math.random() * set.length);
      input = set[r].input;
      output = set[r].output;

      prediction = network
        .activate(input)
        .map(function(bit) {
          return bit > .5 ? 1 : 0;
        });
      
      // convert to chars
      prediction = String.fromCharCode(parseInt(prediction.join(''), 2));
      result = String.fromCharCode(parseInt(output.join(''), 2));

      if(prediction === result)
        success++;
    }
    
    log('... done');
    log();
    log('success rate:', (100 * (success / samples)), '%');
  }
})(console.log);