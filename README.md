# MLP character recognition

Trains a multi-layer perceptron (MLP) neural network to perform optical character recognition (OCR).

The training set is automatically generated using a highly modified version of the captcha-generator [node-captcha](http://npmjs.com/package/node-captcha). Takes a 40x40-bit (400-bit) one-dimensional binary array as input and outputs an 8-bit binary array, which can then be converted into a character code. Initial performance measurements show very promising success rates.

## Performance

* **abcdefghijklmnopqrstuvwxyz**
    * **Font:** Arial, Helvetica, sans-serif
    * **MLP specification:**
      * **Neurons:** (```400``` input, ```40``` hidden, ```8``` output)
      * **Learning rate:** ```0.1```
      * **Training set:**
        * **Size:** ```52000``` characters
        * **Sample:** ![abcdefghijklmnopqrstuvwxyz](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/abcdefghijklmnopqrstuvwxyz.png)
    * **Success rate:** ```98.52%```
* **0123456789**
    * **Font:** Arial, Helvetica, sans-serif
    * **MLP specification:**
      * **Neurons:** (```400``` input, ```40``` hidden, ```8``` output)
      * **Learning rate:** ```0.1```
      * **Training set:**
        * **Size:** ```20000``` characters
        * **Sample:** ![0123456789](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/0123456789.png)
    * **Success rate:** ```99.79%```

## Usage

Clone this repository. The script is using [canvas](https://www.npmjs.com/package/canvas), so you'll need to install the **Cairo** rendering engine. This can be done with the following one-liner (copied from canvas README):

```bash
$ wget https://raw.githubusercontent.com/LearnBoost/node-canvas/master/install -O - | sh
```

Then install npm dependencies and test it:

```bash
$ npm install
$ node main.js
```

## Contribute

Feel free to fork and submit pull requests.