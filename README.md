# MLP character recognition

Trains a multi-layer perceptron (MLP) neural network to perform optical character recognition (OCR).

The training set is automatically generated using a highly modified version of the captcha-generator [node-captcha](http://npmjs.com/package/node-captcha).

The network takes a 20x20-bit (400-bit) one-dimensional binary array as input and outputs an 8-bit binary array, which can then be converted into a character code. Initial performance measurements show promising success rates.

After training, the network is saved as a standalone module to ```./network.js```, which can then be used in your project with

```javascript
var network = require('./network.js');
var output = network.activate(input);
```

## Performance

###```abcdefghijklmnopqrstuvwxyz```

* **Fonts:**
  * sans-serif
  * serif
* **MLP specification:**
  * **Neurons:** (```400``` input, ```40``` hidden, ```8``` output)
  * **Learning rate:** ```0.1```
  * **Training set:**
    * **Size:** ```52000``` characters
    * **Sample:** ![abcdefghijklmnopqrstuvwxyz](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/abcdefghijklmnopqrstuvwxyz.png)
  * **Testing set:**
    * **Size:** ```13000``` characters
* **Measured success rate:** ```96.32307692307693%```
    
###```0123456789```

* **Fonts:**
  * sans-serif
  * serif
* **MLP specification:**
  * **Neurons:** (```400``` input, ```40``` hidden, ```8``` output)
  * **Learning rate:** ```0.1```
  * **Training set:**
    * **Size:** ```20000``` characters
    * **Sample:** ![0123456789](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/0123456789.png)
  * **Testing set:**
    * **Size:** ```5000``` characters
* **Measured success rate:** ```99.22%```

## Configuration

Tweak the network for your needs by editing the ```config.json``` file located in the main folder. Pasted below is the default config file.

```javascript
{
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

### Legend

**```text:```** A string containing the glyphs with which to train/test the network.

**```fonts:```** An array of fonts to be used when generating images.

**```training_set:```** Number of images to be generated and used as the network training set.

**```testing_set:```** Same as above, but these images are used for testing the network.

**```image_size:```** The size of the square chunk (in pixels) containing a glyph. The resulting network input size is ```image_size```^2.

**```threshold:```** When analyzing the pixels of a glyph, the algorithm reduces each pixel ```(r, g, b)``` to ```(r + g + b)``` and everything below ```threshold``` is marked as 1 in the resulting 20x20 binary array used as network input.

**```network:```**
* **```hidden:```** The size (number of neurons) of the hidden layer of the network.
* **```learning_rate:```** The learning rate of the network.

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

Here is an example run of the script:

```bash
$ node main.js
reading config file ...
... done

generating images ...
... done

neural network specs:
  layers:
    input: 400 neurons.
    hidden: 40 neurons.
    output: 8 neurons.
  learning rate: 0.1
  training set: 20000 characters.
  testing set: 5000 characters.

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

testing on 5000 samples ...
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

success rate: 99.58 %
```

## Contribute

Feel free to fork and submit pull requests.