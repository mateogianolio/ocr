# MLP character recognition

Trains a multi-layer perceptron (MLP) neural network to perform optical character recognition (OCR).

The training set is automatically generated using a heavily modified version of the captcha-generator [node-captcha](http://npmjs.com/package/node-captcha). Support for the MNIST handwritten digit database has been added recently (see performance section).

The network takes a one-dimensional binary array (default ```20 * 20 = 400```-bit) as input and outputs an 8-bit array, which can then be converted into a character code. Initial performance measurements show promising success rates.

After training, the network is saved as a standalone module to ```./ocr.js```, which can then be used in your project with

```javascript
var ocr = require('./ocr.js');
var output = ocr
  .activate(input)
  .map(function(bit) {
    return bit > 0.5 ? 1 : 0;
  });
  
// output is now binary array, converting to character is easy
var character = String.fromCharCode(parseInt(output.join(''), 2));

// do stuff ...
```

## Performance

### [MNIST [0-9]](http://yann.lecun.com/exdb/mnist/)

* **Neurons**
  * ```400``` input
  * ```40``` hidden
  * ```4``` output
* **Learning rate**
  * ```0.1```
* **Training set**
  * ```59999``` digits
* **Testing set**
  * ```9999``` digits
* **Measured success rate**
  * ```82.08820882088209%```

### [a-z]

* **Fonts**
  * sans-serif
  * serif
* **Neurons**
  * ```400``` input
  * ```40``` hidden
  * ```8``` output
* **Learning rate**
  * ```0.1```
* **Training set**
  * ```52000``` characters
  * **Sample**
    * ![abcdefghijklmnopqrstuvwxyz](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/abcdefghijklmnopqrstuvwxyz.png)
* **Testing set**
  * ```13000``` characters
* **Measured success rate**
  * ```96.32307692307693%```
    
### [0-9]

* **Fonts**
  * sans-serif
  * serif
* **Neurons**
  * ```400``` input
  * ```40``` hidden
  * ```8``` output
* **Learning rate**
  * ```0.1```
* **Training set**
  * **Size**
    * ```20000``` digits
  * **Sample**
    * ![0123456789](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/0123456789.png)
* **Testing set**
  * ```5000``` digits
* **Measured success rate**
  * ```99.22%```

## Configuration

Tweak the network for your needs by editing the ```config.json``` file located in the main folder. Pasted below is the default config file.

```javascript
{
  "mnist": false,
  "text": "abcdefghijklmnopqrstuvwxyz",
  "fonts": [
    "sans-serif",
    "serif"
  ],
  "training_set": 2000,
  "testing_set": 500,
  "image_size": 20,
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

## Usage

Clone this repository. The script is using [canvas](https://www.npmjs.com/package/canvas), so you'll need to install the **Cairo** rendering engine. On OSX, this can be done with the following one-liner (copied from canvas README):

```bash
$ wget https://raw.githubusercontent.com/LearnBoost/node-canvas/master/install -O - | sh
```

Then install npm dependencies and test it:

```bash
$ npm install
$ node main.js
```