# exificient.js
JavaScript Implementation of [EXI](https://www.w3.org/TR/exi/) and [EXI for JSON](https://www.w3.org/TR/exi-for-json/)

[![Build Status](https://travis-ci.org/EXIficient/exificient.js.svg?branch=master)](https://travis-ci.org/EXIficient/exificient.js)

## Demo

An online demonstration can be found here: <http://exificient.github.io/javascript/demo/>.

## HowTo EXIforJSON

```javascript
// encode JSON
var exiEncoder = new EXI4JSONEncoder();	
exiEncoder.encodeJsonText(textJSON); // JSON text input
// Note: there is also encodeJsonObject
var uint8ArrayLength = exiEncoder.getUint8ArrayLength();
var uint8Array = exiEncoder.getUint8Array();

// decode EXIforJSON
var exiDecoder = new EXI4JSONDecoder();
var jsonHandler = new JSONEventHandler(); // register JSON handler
exiDecoder.registerEventHandler(jsonHandler);
exiDecoder.decode(arrayBuffer); // input data
jsonHandler.getJSON(); // get JSON object

```