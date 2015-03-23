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

## Example

Here is an example run of the script (with ```mnist``` set to true in ```config.json```):

```bash
$ node main.js
reading config file ...
... done

parsing MNIST data ...
digit 6 from training set
00000000000000000000
00000001111000000000
00000011110000000000
00000011100000000000
00000111000000000000
00000111000000000000
00001110000000000000
00001110000000000000
00001110000000000000
00001100000001110000
00011100000111110000
00011100001111111000
00011100001110111000
00011100011100111000
00001110111000111000
00001111111001110000
00000111111111110000
00000011111111000000
00000001111110000000
00000000000000000000

digit 8 from testing set
00000000000000000000
00000000111110000000
00000001111111110000
00000011110011111100
00000011100000111100
00000011100000011100
00000011100000111100
00000001100001111000
00000001111111110000
00000011111111100000
00001111111110000000
00001111111100000000
00011100111100000000
00011000111100000000
00111000011000000000
00111000011000000000
00111000011000000000
00011100011000000000
00011100111000000000
00001111110000000000

... done

neural network specs:
  layers:
    input: 400 neurons.
    hidden: 40 neurons.
    output: 4 neurons.
  learning rate: 0.1
  training set: 59999 characters.
  testing set: 999 characters.

learning ...
progress: 10%
progress: 20%
progress: 30%
progress: 40%
progress: 50%
progress: 60%
progress: 70%
progress: 80%
progress: 90%
... done

network saved to ./network.js

testing on 999 samples ...
progress: 10%
progress: 20%
progress: 30%
progress: 40%
progress: 50%
progress: 60%
progress: 70%
progress: 80%
progress: 90%
... done

success rate: 81.38138138138137 %
```