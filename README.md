# MLP character recognition

Trains a multi-layer perceptron (MLP) neural network to perform optical character recognition (OCR). The training set is automatically generated using a modified version of the captcha-generator [node-captcha](http://npmjs.com/package/node-captcha).

The script moves each character to the center of the 400-bit (20x20) network input to maximize success rate.

Below are examples of input images from training sets generated for recognition of numbers ```0-9``` and letters ```a-z``` respectively.

## Performance

* **```abcdefghijklmnopqrstuvwxyz```**
    * **Font:** Arial, Helvetica, sans-serif
    * **MLP specification:**
      * **Neurons:** (```400``` input, ```40``` hidden, ```8``` output)
      * **Learning rate:** ```0.1```
      * **Training set:** ```52000``` characters (e.g: ![abcdefghijklmnopqrstuvwxyz](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/abcdefghijklmnopqrstuvwxyz.png))
    * **Success rate:** ```98.52%```
* **```0123456789```**
    * **Font:** Arial, Helvetica, sans-serif
    * **MLP specification:**
      * **Neurons:** (```400``` input, ```40``` hidden, ```8``` output)
      * **Learning rate:** ```0.1```
      * **Training set:** ```20000``` characters (e.g: ![0123456789](https://raw.github.com/mateogianolio/mlp-character-recognition/master/examples/0123456789.png))
    * **Success rate:** ```99.79%```

## Usage

Clone this repository and make sure the ```input``` folder exists before running

```bash
$ npm install
$ node main.js
```

## Contribute

Feel free to fork and submit pull requests.