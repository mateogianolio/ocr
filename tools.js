(function() {
  'use strict';

  // bounding box centering
  module.exports.center = function(chunk) {
    var size = Math.sqrt(chunk.length),
        min = {
          x: size,
          y: size
        },
        max = {
          x: 0,
          y: 0
        },
        x, y, j, k;

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
  };
})();
