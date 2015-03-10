(function(log) {
  var dnn = require('dnn');

  var x = [
    [1, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0]
  ];

  var y = [
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 1],
    [0, 1],
    [0, 1]
  ];

  var classifier = new dnn.LogisticRegression({
    input: x,
    label: y,
    n_in: 6,
    n_out: 2
  });

  // disable logging
  classifier.set('log level', 0);

  var epochs = 800,
      rate = .01;

  classifier.train({
    lr: rate,
    epochs: epochs
  });

  x = [
    [1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 0]
  ];

  log('result', classifier.predict(x));
})(console.log);