(function(log) {
  'use strict';
  
  module.exports.train = function(network, set, rate) {
    var length = set.length,
        object,
        count = 0;
    
    log('layers:');
    log('  input:', network.layers.input.size, 'neurons.');
    log('  hidden:', network.layers.hidden[0].size, 'neurons.');
    log('  output:', network.layers.output.size, 'neurons.');
    log('learning rate:', rate, '\n');
    log('learning ...');
    
    while(set.length) {
      object = set.pop();
      
      if(count % Math.round(length / 10) === 0)
        log('progress:', Math.round(100 * (count / length)) + '%');
      
      network.activate(object.input);
      network.propagate(rate, object.output);
      
      count++;
    }
    
    log('... done');
    log();
  };
  
  module.exports.test = function(network, set) {
    var object,
        prediction,
        result,
        length = set.length,
        success = 0,
        count = 0;
    
    // test on random inputs
    log('testing on', length, 'samples ...');
    while(set.length) {
      object = set.pop();
      
      if(count % Math.round(length / 10) === 0)
        log('progress:', Math.round(100 * (count / length)), '%');

      prediction = network
        .activate(object.input)
        .map(function(bit) {
          return bit > 0.5 ? 1 : 0;
        });
      
      // convert to char codes
      prediction = String.fromCharCode(parseInt(prediction.join(''), 2));
      result = String.fromCharCode(parseInt(object.output.join(''), 2));

      if(prediction === result)
        success++;
      
      count++;
    }
    
    log('... done', '\n');
    log('success rate:', (100 * (success / length)), '%');
  };
})(console.log);