# OCR

Trains a multi-layer perceptron (MLP) neural network to perform optical character recognition (OCR).

The training set is automatically generated using a heavily modified version of the captcha-generator [node-captcha](http://npmjs.com/package/node-captcha). Support for the MNIST handwritten digit database has been added recently (see performance section).

The network takes a one-dimensional binary array (default ```20 * 20 = 400```-bit) as input and outputs an 10-bit array of probabilities, which can be converted into a character code. Initial performance measurements show promising success rates.

After training, the network is saved as a standalone module to ```./ocr.js```, which can then be used in your project like this (from `test.js`):

```javascript
var predict = require('./ocr.js');

// a binary array that we want to predict
var one = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

// the prediction is an array of probabilities
var prediction = predict(one);

// the index with the maximum probability is the best guess
console.log('prediction:', prediction.indexOf(Math.max.apply(null, prediction)));
// will hopefully output 1 if trained with 0-9 :)
```

## Usage

Clone this repository. The script is using [canvas](https://www.npmjs.com/package/canvas), so you'll need to install the **Cairo** rendering engine. On OS X, assuming you have [Homebrew](http://brew.sh) installed, this can be done with the following (copied from canvas README):

```bash
$ brew install cairo jpeg giflib
```

Then install npm dependencies and test it:

```bash
$ npm install
$ node main.js
$ node test.js
```

## Performance

All runs below were performed with a MacBook Pro Retina 13" Early 2015 with 8GB RAM.

### [MNIST [0-9]](http://yann.lecun.com/exdb/mnist/)

To test with the MNIST dataset: click on the title above, download the 4 data files and put them in a folder called ```mnist``` in the root directory of this repository.

```javascript
// config.json
{
  "mnist": true,
  "network": {
    "hidden": 160,
    "learning_rate": 0.03
  }
}
```

Then run

```bash
$ node mnist.js
```

* **Neurons**
  * ```400``` input
  * ```160``` hidden
  * ```10``` output
* **Learning rate:** ```0.03```
* **Training set:** ```60000``` digits
* **Testing set:** ```10000``` digits
* **Training time:** ```21 min 53 s 753 ms```
* **Success rate:** ```95.16%```

### [A-Za-z0-9]

```javascript
// config.json
{
  "mnist": false,
  "text": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012356789",
  "fonts": [
    "sans-serif",
    "serif"
  ],
  "training_set": 2000,
  "testing_set": 1000,
  "image_size": 16,
  "threshold": 400,
  "network": {
    "hidden": 60,
    "learning_rate": 0.1,
    "output": 62
  }
}
```

* **Neurons**
  * ```256``` input
  * ```60``` hidden
  * ```62``` output
* **Learning rate:** ```0.03```
* **Training set**
  * **Size:** ```124000``` characters
  * **Sample:** ![abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.png)
* **Testing set:** ```62000``` characters
* **Training time:** ```8 min 18 s 560 ms```
* **Success rate:** ```93.58225806451614%```

### [a-z]

```javascript
// config.json
{
  "mnist": false,
  "text": "abcdefghijklmnopqrstuvwxyz",
  "fonts": [
    "sans-serif",
    "serif"
  ],
  "training_set": 2000,
  "testing_set": 1000,
  "image_size": 16,
  "threshold": 400,
  "network": {
    "hidden": 40,
    "learning_rate": 0.1,
    "output": 26
  }
}
```

* **Neurons**
  * ```256``` input
  * ```40``` hidden
  * ```26``` output
* **Learning rate:** ```0.1```
* **Training set**
  * **Size:** ```52000``` characters
  * **Sample:** ![abcdefghijklmnopqrstuvwxyz](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/abcdefghijklmnopqrstuvwxyz.png)
* **Testing set:** ```26000``` characters
* **Training time:** ```1 min 55 s 414 ms```
* **Success rate:** ```93.83846153846153%```

### [0-9]

```javascript
// config.json
{
  "mnist": false,
  "text": "0123456789",
  "fonts": [
    "sans-serif",
    "serif"
  ],
  "training_set": 2000,
  "testing_set": 1000,
  "image_size": 16,
  "threshold": 400,
  "network": {
    "hidden": 40,
    "learning_rate": 0.1
  }
}
```

* **Neurons**
  * ```256``` input
  * ```40``` hidden
  * ```10``` output
* **Learning rate:** ```0.1```
* **Training set**
  * **Size:** ```20000``` digits
  * **Sample:** ![0123456789](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/0123456789.png)
* **Testing set:** ```10000``` digits
* **Training time:** ```0 min 44 s 363 ms```
* **Success rate:** ```99.59%```

## Configuration

Tweak the network for your needs by editing the ```config.json``` file located in the main folder. Pasted below is the default config file.

```javascript
// config.json
{
  "mnist": false,
  "text": "0123456789",
  "fonts": [
    "sans-serif",
    "serif"
  ],
  "training_set": 2000,
  "testing_set": 1000,
  "image_size": 16,
  "threshold": 400,
  "network": {
    "hidden": 40,
    "learning_rate": 0.1
  }
}

```

* **```mnist```**
  * If set to true, the MNIST handwritten digit dataset will be used for training and testing the network. This setting will overwrite configured set sizes and will ignore the ```image_size```, ```threshold```, ```fonts``` and ```text``` settings.
* **```text```**
  * A string containing the glyphs with which to train/test the network.
* **```fonts```**
  * An array of fonts to be used when generating images.
* **```training_set```**
  * Number of images to be generated and used as the network training set.
* **```testing_set```**
  * Same as above, but these images are used for testing the network.
* **```image_size```**
  * The size of the square chunk (in pixels) containing a glyph. The resulting network input size is ```image_size```^2.
* **```threshold```**
  * When analyzing the pixels of a glyph, the algorithm reduces each pixel ```(r, g, b)``` to ```(r + g + b)``` and everything below ```threshold``` is marked as 1 in the resulting binary array used as network input.
* **```network```**
  * **```hidden```**
    * The size (number of neurons) of the hidden layer of the network.
  * **```learning_rate```**
    * The learning rate of the network.
