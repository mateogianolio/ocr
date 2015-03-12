(function(log) {
  var synaptic = require('synaptic'),
      captcha = require('node-captcha'),
      png = require('pngjs').PNG,
      _ = require('underscore'),
      fs = require('fs');
  
  var chars = 10,
      size = 16,
      threshold = 250;
  
  var set = [];
  
  var samples = 2500,
      text,
      n;
  
  log('generating captchas to input/ ...');
  for(n = 0; n < samples; n++) {
    text = _.sample('abcdefghijklmnopqrstuvxyz'.split(''), chars);
    captcha({
      size: chars,
      height: size,
      text: text.join(''),
      noise: false
    }, generate(n));
  }
  
  // captcha callback
  function generate(n) {
    return function(text, data) {
      data = data.split(',').pop();

      fs.writeFileSync('./input/' + n + '.png', data, 'base64');
      fs.createReadStream('./input/' + n + '.png')
        .pipe(new png({
          filterType: 4
        }))
        .on('parsed', parse(text, n));
    };
  }
  
  // 'parsed' event callback
  function parse(text, n) {
    return function() {
      var index,
          i, j,
          x, y;

      var chunks = [],
          chunk = [],
          pixel = [];
      for(i = 0; i < chars; i++) {
        for(y = 0; y < this.height; y++) {
          for(x = i * size; x < (i * size + size); x++) {
            index = (this.width * y + x) << 2;

            for(j = 0; j < 3; j++)
              pixel.push(this.data[index + j]);

            chunk.push(
              pixel.reduce(function(previous, current) {
                return previous + current;
              }) > threshold ? 0 : 1
            );
            pixel = [];
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
    var perceptron = new synaptic.Architect.Perceptron(size * size, size, 8);
    var rate = .015,
        length = set.length,
        object;
    
    log('learning from', samples, 'captchas, containing', length, 'characters ...');
    
    var i, j;
    for(i = 0; i < length; i++) {
      object = set[i];
      
      if(i > 0 && !(i % (length / 10)))
        log('progress:', Math.round(100 * (i / length)) + '%');
      
      for(j = 0; j < 10; j++) {
        perceptron.activate(object.input);
        perceptron.propagate(rate, object.output);
      }
    }
    
    log('... done');
    log();
    
    done(perceptron);
  }
  
  // network is trained and ready to use
  function done(network) {
    fs.writeFileSync('./network.js', 'module.exports.activate = ' + network.standalone().toString());
    log('network saved to ./network.js');
    
    var input,
        output,
        prediction,
        result,
        r;
    
    var samples = 100000,
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