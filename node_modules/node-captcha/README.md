## Node Captcha

captcha generator for node.

## Installation

	$ npm install node-captcha

## Usage 

```javascript
var captcha = require('node-captcha');

captcha(options,function(text, data){
  res.end(data);
});
```

##Options

* `fileMode (default: 0)` `0`: data url, `1`: path to new png data file, `2`: return raw png data buffer
* `saveDir (default: '__dirname')` image file path
* `size (default: 4)` the count of generated characters
* `height (default: 24)` height of image
* `width (default: height * size)` width of image
* `color (default: 'rgb(0,0,0)')` text color
* `background (default: 'rgb(255,255,255)')` background of image
* `lineWidth (default: 2)` 
* `text (default: null)` `null`: generate random string and return callback
* `noise (default: true)` `false`: no noise
* `noiseColor (default: options.color)`

## LICENSE

Copyright ©2012 zhiyu zheng all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
