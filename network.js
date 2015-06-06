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
    log('training with', length, 'inputs ...');
    
    var start = process.hrtime();
    
    while(set.length) {
      object = set.pop();
      
      if(count % Math.round(length / 10) === 0)
        log('progress:', Math.round(100 * (count / length)),'%');
      
      network.activate(object.input);
      network.propagate(rate, object.output);
      
      count++;
    }
    
    var elapsed = process.hrtime(start);
    var time = {
      minutes: Math.floor(elapsed[0] / 60),
      seconds: elapsed[0] % 60,
      milliseconds: Math.floor(elapsed[1] / 1000000)
    };
    
    log('... done', '(' + time.minutes, 'min', time.seconds, 's', time.milliseconds, 'ms)');
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
    log('testing on', length, 'inputs ...');
    while(set.length) {
      object = set.pop();
      
      if(count % Math.round(length / 10) === 0)
        log('progress:', Math.round(100 * (count / length)), '%');

      prediction = network
        .activate(object.input)
      
      prediction = prediction.indexOf(Math.max.apply(null, prediction));
      result = object.output.indexOf(1);

      if(prediction === result)
        success++;
      
      count++;
    }
    
    log('... done', '\n');
    log('success rate:', (100 * (success / length)), '%');
  };
})(console.log);