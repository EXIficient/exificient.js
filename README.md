# exificient.js
JavaScript Implementation of [EXI](https://www.w3.org/TR/exi/) and [EXI for JSON](https://www.w3.org/TR/exi-for-json/)

[![Build Status](https://travis-ci.org/EXIficient/exificient.js.svg?branch=master)](https://travis-ci.org/EXIficient/exificient.js)

## Demo

An online demonstration can be found here: <http://exificient.github.io/javascript/demo/>.

## HowTo for EXIforJSON

```javascript
// encode JSON object
var uint8Array = EXI4JSON.exify(jsonObjIn);

// decode EXIforJSON
var jsonObjOut = EXI4JSON.parse(uint8Array);
```


## HowTo for EXI

```javascript
// Note: the necessary grammars can be generated from XML schema using
// the project https://github.com/EXIficient/exificient-grammars
// class com.siemens.ct.exi.grammars.persistency.Grammars2JSON 

// encode XML
var exiEncoder = new EXIEncoder(grammars);	
exiEncoder.encodeXmlText(textXML);
var uint8ArrayLength = exiEncoder.getUint8ArrayLength();
var uint8Array = exiEncoder.getUint8Array();

// decode EXI to XML again
var exiDecoder = new EXIDecoder(grammars);
var xmlHandler = new XMLEventHandler(); // register XML handler
exiDecoder.registerEventHandler(xmlHandler);
exiDecoder.decode(arrayBuffer); // EXI input data
xmlHandler.getXML(); // get XML
```
