(function() {
  var canvas = require('canvas');
  
  function generate(config, callback) {
    config.size = config.size || 4;
    config.height = config.height || 24;
    config.width = config.width || config.height * config.size;
    config.color = config.color || 'rgb(0,0,0)';
    config.background = config.background || 'rgb(255,255,255)';
    config.text = config.text || ('' + Math.random()).substr(2, config.size);

    var size = Math.round(config.height * .7),
        c = new canvas(config.width, config.height),
        context = c.getContext('2d');

    context.fillStyle = config.background;
    context.fillRect(0, 0, config.width, config.height);
    context.fillStyle = config.color;
    
    var fonts = [
      '"Arial", "Helvetica", sans-serif',
    ];

    for(i = 0; i < config.text.length; i++) {
      context.font = size + 'px ' + fonts[Math.floor(Math.random() * fonts.length)];
      context.setTransform(
        Math.random() * 0.25 + 1, // scale horizontally
        Math.random() * 0.25, // skew horizontally
        Math.random() * 0.25, // skew vertically
        Math.random() * 0.25 + 1, // scale vertically
        config.height * i + (config.height - size) / 2, // move horizontally
        config.height - size / 2 // move vertically
      );
      context.fillText(config.text.charAt(i), 0, 0);
    }

    c.toBuffer(function(error, buffer) {
      if(error)
        throw error;
      
      callback(config.text, buffer);
    });
  }

  module.exports.generate = generate;
})();