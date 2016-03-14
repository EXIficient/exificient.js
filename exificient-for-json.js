/*! exificient-for-json.js v0.0.2-SNAPSHOT | (c) 2016 Siemens AG | The MIT License (MIT) */
/*! JSON components for exificient.js */

//const
exiForJsonUri = "http://www.w3.org/2015/EXI/json";

Inheritance_Manager.extend(EXI4JSONDecoder, EXIDecoder);

// arrayBuffer EXI ArrayBuffer
// Note: JSON grammars (see variable jsonGrammarsObject) is implicit
function EXI4JSONDecoder() {
	EXI4JSONDecoder.baseConstructor.call(this, jsonGrammarsObject);
}

Inheritance_Manager.extend(EXI4JSONEncoder, EXIEncoder);

function EXI4JSONEncoder() {
	EXI4JSONEncoder.baseConstructor.call(this, jsonGrammarsObject);
	
	EXI4JSONEncoder.prototype.encodeJsonText = function(textJSON){
		var jsonObj = JSON.parse(textJSON);
		this.encodeJsonObject(jsonObj);
	}
	
	EXI4JSONEncoder.prototype.encodeJsonObject = function(jsonObj){
		this.startDocument();
		
		// encode
		if (jsonObj instanceof Array) {
			this.startElement(exiForJsonUri, "array");
			this.processJSONArray(jsonObj);
			this.endElement();
		} else if (jsonObj instanceof Object) {
			this.startElement(exiForJsonUri, "map");
			this.processJSONObject(jsonObj);
			this.endElement();
		} else {
			throw new Error("Neither array nor object root");
		}
		
		this.endDocument();
	}
	
	EXI4JSONEncoder.prototype.processJSONArray = function(jsonArray){
		var arrayLength = jsonArray.length;
		for (var i = 0; i < arrayLength; i++) {
			var val = jsonArray[i];
			if (val instanceof Array) {
				this.startElement(exiForJsonUri, "array");
				this.processJSONArray(val);
				this.endElement();
			} else if (val instanceof Object) {
				this.startElement(exiForJsonUri, "map");
				this.processJSONObject(val);
				this.endElement();
			} else if (typeof val === "string") {
				this.startElement(exiForJsonUri, "string");
				this.characters(val);
				this.endElement();
			} else if (typeof val === "number") {
				this.startElement(exiForJsonUri, "number");
				this.characters(val);
				this.endElement();
			} else if (typeof val === "boolean") {
				this.startElement(exiForJsonUri, "boolean");
				this.characters(val);
				this.endElement();
			} else if (val === null) {
				this.startElement(exiForJsonUri, "null");
				// this.characters(val);
				this.endElement();
			} else {
				throw new Error("Not supported object type: " + (typeof val));
			}
		}
	}
	
	EXI4JSONEncoder.prototype.processJSONObject = function(jsonObj){
		var keys = Object.keys(jsonObj);
		
		for (var key in jsonObj) {
			if (jsonObj.hasOwnProperty(key)) {
				/* useful code here */
				var val = jsonObj[key];
				console.log("JSON " + key + ": " + val);
				
				if (val instanceof Array) {
					this.startElement(exiForJsonUri, "array");
					this.attribute("", "key", key);
					this.processJSONArray(val);
					this.endElement();
				} else if (val instanceof Object) {
					this.startElement(exiForJsonUri, "map");
					this.attribute("", "key", key);
					this.processJSONObject(val);
					this.endElement();
				} else if (typeof val === "string") {
					this.startElement(exiForJsonUri, "string");
					this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
				} else if (typeof val === "number") {
					this.startElement(exiForJsonUri, "number");
					this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
				} else if (typeof val === "boolean") {
					this.startElement(exiForJsonUri, "boolean");
					this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
				} else if (val === null) {
					this.startElement(exiForJsonUri, "null");
					this.attribute("", "key", key);
					// this.characters(val);
					this.endElement();
				} else {
					throw new Error("Not supported object type: " + (typeof val));
				}
			}
		}
	}
}


// see minified schema-for-json.xsd.grs with thing grammars
// Note: the idea would be to have this optimized (currently all schema information, even unnecessary stuff is there...)
var jsonGrammars = '{"qnames":{"numberOfUris":5,"numberOfQNames":73,"namespaceContext":[{"uriID":"0","uri":"","numberOfLocalNames":1,"qnameContext":[{"localNameID":0,"localName":"key"}]},{"uriID":"1","uri":"http://www.w3.org/XML/1998/namespace","numberOfLocalNames":4,"qnameContext":[{"localNameID":0,"localName":"base"},{"localNameID":1,"localName":"id"},{"localNameID":2,"localName":"lang"},{"localNameID":3,"localName":"space"}]},{"uriID":"2","uri":"http://www.w3.org/2001/XMLSchema-instance","numberOfLocalNames":2,"qnameContext":[{"localNameID":0,"localName":"nil"},{"localNameID":1,"localName":"type"}]},{"uriID":"3","uri":"http://www.w3.org/2001/XMLSchema","numberOfLocalNames":46,"qnameContext":[{"localNameID":0,"localName":"ENTITIES","globalTypeGrammarID":26},{"localNameID":1,"localName":"ENTITY","globalTypeGrammarID":9},{"localNameID":2,"localName":"ID","globalTypeGrammarID":9},{"localNameID":3,"localName":"IDREF","globalTypeGrammarID":9},{"localNameID":4,"localName":"IDREFS","globalTypeGrammarID":26},{"localNameID":5,"localName":"NCName","globalTypeGrammarID":9},{"localNameID":6,"localName":"NMTOKEN","globalTypeGrammarID":9},{"localNameID":7,"localName":"NMTOKENS","globalTypeGrammarID":26},{"localNameID":8,"localName":"NOTATION","globalTypeGrammarID":9},{"localNameID":9,"localName":"Name","globalTypeGrammarID":9},{"localNameID":10,"localName":"QName","globalTypeGrammarID":9},{"localNameID":11,"localName":"anySimpleType","globalTypeGrammarID":9},{"localNameID":12,"localName":"anyType","globalTypeGrammarID":27},{"localNameID":13,"localName":"anyURI","globalTypeGrammarID":9},{"localNameID":14,"localName":"base64Binary","globalTypeGrammarID":14},{"localNameID":15,"localName":"boolean","globalTypeGrammarID":11},{"localNameID":16,"localName":"byte","globalTypeGrammarID":28},{"localNameID":17,"localName":"date","globalTypeGrammarID":17},{"localNameID":18,"localName":"dateTime","globalTypeGrammarID":15},{"localNameID":19,"localName":"decimal","globalTypeGrammarID":19},{"localNameID":20,"localName":"double","globalTypeGrammarID":10},{"localNameID":21,"localName":"duration","globalTypeGrammarID":9},{"localNameID":22,"localName":"float","globalTypeGrammarID":10},{"localNameID":23,"localName":"gDay","globalTypeGrammarID":29},{"localNameID":24,"localName":"gMonth","globalTypeGrammarID":30},{"localNameID":25,"localName":"gMonthDay","globalTypeGrammarID":31},{"localNameID":26,"localName":"gYear","globalTypeGrammarID":32},{"localNameID":27,"localName":"gYearMonth","globalTypeGrammarID":33},{"localNameID":28,"localName":"hexBinary","globalTypeGrammarID":34},{"localNameID":29,"localName":"int","globalTypeGrammarID":18},{"localNameID":30,"localName":"integer","globalTypeGrammarID":18},{"localNameID":31,"localName":"language","globalTypeGrammarID":9},{"localNameID":32,"localName":"long","globalTypeGrammarID":18},{"localNameID":33,"localName":"negativeInteger","globalTypeGrammarID":18},{"localNameID":34,"localName":"nonNegativeInteger","globalTypeGrammarID":35},{"localNameID":35,"localName":"nonPositiveInteger","globalTypeGrammarID":18},{"localNameID":36,"localName":"normalizedString","globalTypeGrammarID":9},{"localNameID":37,"localName":"positiveInteger","globalTypeGrammarID":35},{"localNameID":38,"localName":"short","globalTypeGrammarID":18},{"localNameID":39,"localName":"string","globalTypeGrammarID":9},{"localNameID":40,"localName":"time","globalTypeGrammarID":16},{"localNameID":41,"localName":"token","globalTypeGrammarID":9},{"localNameID":42,"localName":"unsignedByte","globalTypeGrammarID":36},{"localNameID":43,"localName":"unsignedInt","globalTypeGrammarID":35},{"localNameID":44,"localName":"unsignedLong","globalTypeGrammarID":35},{"localNameID":45,"localName":"unsignedShort","globalTypeGrammarID":35}]},{"uriID":"4","uri":"http://www.w3.org/2015/EXI/json","numberOfLocalNames":20,"qnameContext":[{"localNameID":0,"localName":"array","globalElementGrammarID":5},{"localNameID":1,"localName":"arrayType","globalTypeGrammarID":5},{"localNameID":2,"localName":"base64Binary"},{"localNameID":3,"localName":"boolean","globalElementGrammarID":11},{"localNameID":4,"localName":"booleanType","globalTypeGrammarID":11},{"localNameID":5,"localName":"date"},{"localNameID":6,"localName":"dateTime"},{"localNameID":7,"localName":"decimal"},{"localNameID":8,"localName":"integer"},{"localNameID":9,"localName":"map","globalElementGrammarID":6},{"localNameID":10,"localName":"mapType","globalTypeGrammarID":6},{"localNameID":11,"localName":"null","globalElementGrammarID":12},{"localNameID":12,"localName":"nullType","globalTypeGrammarID":12},{"localNameID":13,"localName":"number","globalElementGrammarID":10},{"localNameID":14,"localName":"numberType","globalTypeGrammarID":10},{"localNameID":15,"localName":"other","globalElementGrammarID":13},{"localNameID":16,"localName":"otherType","globalTypeGrammarID":13},{"localNameID":17,"localName":"string","globalElementGrammarID":9},{"localNameID":18,"localName":"stringType","globalTypeGrammarID":9},{"localNameID":19,"localName":"time"}]}]},"simpleDatatypes":[{"simpleDatatypeID":0,"type":"STRING"},{"simpleDatatypeID":1,"type":"STRING"},{"simpleDatatypeID":2,"type":"STRING"},{"simpleDatatypeID":3,"type":"FLOAT"},{"simpleDatatypeID":4,"type":"FLOAT"},{"simpleDatatypeID":5,"type":"BOOLEAN"},{"simpleDatatypeID":6,"type":"BOOLEAN"},{"simpleDatatypeID":7,"type":"BINARY_BASE64"},{"simpleDatatypeID":8,"type":"DATETIME","datetimeType":"dateTime"},{"simpleDatatypeID":9,"type":"DATETIME","datetimeType":"time"},{"simpleDatatypeID":10,"type":"DATETIME","datetimeType":"date"},{"simpleDatatypeID":11,"type":"INTEGER"},{"simpleDatatypeID":12,"type":"DECIMAL"},{"simpleDatatypeID":13,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":14,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":15,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":-128,"upperBound":127},{"simpleDatatypeID":16,"type":"INTEGER"},{"simpleDatatypeID":17,"type":"DATETIME","datetimeType":"gDay"},{"simpleDatatypeID":18,"type":"DATETIME","datetimeType":"gMonth"},{"simpleDatatypeID":19,"type":"DATETIME","datetimeType":"gMonthDay"},{"simpleDatatypeID":20,"type":"DATETIME","datetimeType":"gYear"},{"simpleDatatypeID":21,"type":"DATETIME","datetimeType":"gYearMonth"},{"simpleDatatypeID":22,"type":"BINARY_HEX"},{"simpleDatatypeID":23,"type":"UNSIGNED_INTEGER"},{"simpleDatatypeID":24,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":0,"upperBound":255},{"simpleDatatypeID":25,"type":"UNSIGNED_INTEGER"}],"grs":{"documentGrammarID":0,"fragmentGrammarID":3,"grammar":[{"grammarID":"0","type":"document","production":[{"event":"startDocument","nextGrammarID":1}]},{"grammarID":"1","type":"docContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":11,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":12,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":10,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":13,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":9,"nextGrammarID":2},{"event":"startElementGeneric","nextGrammarID":2}]},{"grammarID":"2","type":"docEnd","production":[{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"3","type":"fragment","production":[{"event":"startDocument","nextGrammarID":4}]},{"grammarID":"4","type":"fragmentContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":14,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":17,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":15,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":19,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":18,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":25,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":16,"nextGrammarID":4},{"event":"startElementGeneric","nextGrammarID":4},{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"5","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":9,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":10,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":11,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":12,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":13,"nextGrammarID":45},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"6","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":7,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":8,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":20,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":21,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":22,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":23,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":24,"nextGrammarID":44},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"7","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":37},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":7,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":8,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":20,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":21,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":22,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":23,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":24,"nextGrammarID":44},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"8","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":38},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":9,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":10,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":11,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":12,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":13,"nextGrammarID":45},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"9","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":2,"nextGrammarID":46}]},{"grammarID":"10","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":3,"nextGrammarID":46}]},{"grammarID":"11","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":5,"nextGrammarID":46}]},{"grammarID":"12","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"13","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":14,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":15,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":16,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":17,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":18,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":19,"nextGrammarID":46}]},{"grammarID":"14","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":7,"nextGrammarID":46}]},{"grammarID":"15","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":8,"nextGrammarID":46}]},{"grammarID":"16","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":9,"nextGrammarID":46}]},{"grammarID":"17","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":10,"nextGrammarID":46}]},{"grammarID":"18","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":11,"nextGrammarID":46}]},{"grammarID":"19","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":12,"nextGrammarID":46}]},{"grammarID":"20","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":39},{"event":"characters","charactersDatatypeID":2,"nextGrammarID":46}]},{"grammarID":"21","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":40},{"event":"characters","charactersDatatypeID":3,"nextGrammarID":46}]},{"grammarID":"22","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":41},{"event":"characters","charactersDatatypeID":5,"nextGrammarID":46}]},{"grammarID":"23","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":42},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"24","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":43},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":14,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":15,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":16,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":17,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":18,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":19,"nextGrammarID":46}]},{"grammarID":"25","type":"firstStartTagContent","isTypeCastable":true,"isNillable":true,"production":[{"event":"attribute","attributeNamespaceID":0,"attributeLocalNameID":0,"attributeDatatypeID":0,"nextGrammarID":25},{"event":"attributeGeneric","nextGrammarID":25},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":14,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":17,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":15,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":19,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":18,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":16,"nextGrammarID":48},{"event":"startElementGeneric","nextGrammarID":48},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":48}]},{"grammarID":"26","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":13,"nextGrammarID":46}]},{"grammarID":"27","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attributeGeneric","nextGrammarID":27},{"event":"startElementGeneric","nextGrammarID":49},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":49}]},{"grammarID":"28","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":15,"nextGrammarID":46}]},{"grammarID":"29","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":17,"nextGrammarID":46}]},{"grammarID":"30","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":18,"nextGrammarID":46}]},{"grammarID":"31","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":19,"nextGrammarID":46}]},{"grammarID":"32","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":20,"nextGrammarID":46}]},{"grammarID":"33","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":21,"nextGrammarID":46}]},{"grammarID":"34","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":22,"nextGrammarID":46}]},{"grammarID":"35","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":23,"nextGrammarID":46}]},{"grammarID":"36","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":24,"nextGrammarID":46}]},{"grammarID":"37","type":"startTagContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":7,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":8,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":20,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":21,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":22,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":23,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":24,"nextGrammarID":44},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"38","type":"startTagContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":9,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":10,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":11,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":12,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":13,"nextGrammarID":45},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"39","type":"startTagContent","production":[{"event":"characters","charactersDatatypeID":2,"nextGrammarID":46}]},{"grammarID":"40","type":"startTagContent","production":[{"event":"characters","charactersDatatypeID":3,"nextGrammarID":46}]},{"grammarID":"41","type":"startTagContent","production":[{"event":"characters","charactersDatatypeID":5,"nextGrammarID":46}]},{"grammarID":"42","type":"startTagContent","production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"43","type":"startTagContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":14,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":15,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":16,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":17,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":18,"nextGrammarID":46},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":19,"nextGrammarID":46}]},{"grammarID":"44","type":"elementContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":7,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":8,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":20,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":21,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":22,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":23,"nextGrammarID":44},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":24,"nextGrammarID":44},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"45","type":"elementContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":9,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":10,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":11,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":12,"nextGrammarID":45},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":13,"nextGrammarID":45},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"46","type":"elementContent","production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"47","type":"elementContent","production":[]},{"grammarID":"48","type":"elementContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":14,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":17,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":15,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":19,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":18,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":25,"nextGrammarID":48},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":16,"nextGrammarID":48},{"event":"startElementGeneric","nextGrammarID":48},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":48}]},{"grammarID":"49","type":"elementContent","production":[{"event":"startElementGeneric","nextGrammarID":49},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":49}]}]}}';
var jsonGrammarsObject = JSON.parse(jsonGrammars);

function JSONEventHandler() {

	this.openTag;
	this.openTagKey;
	this.json;
	this.jsonStack;
	// this.lastElement;
	
	JSONEventHandler.prototype.getJSON = function(){
		return this.json;
	}
	
	JSONEventHandler.prototype.startDocument = function(){
		this.openTag = null;
		this.openTagKey = null;
		this.json = null;
		this.jsonStack = [];
	}
	
	JSONEventHandler.prototype.endDocument = function(){
	}
		
	JSONEventHandler.prototype.checkOpenElement = function(){
		if(this.openTag != null) {
			var top = this.jsonStack[this.jsonStack.length-1];
			
			var el = null;
			if(this.openTag === "map") {
				el = new Object();
				this.jsonStack.push(el);
			} else if(this.openTag === "array") {
				el = new Array();
				this.jsonStack.push(el);
			}
			
			if(el != null) {
				if(this.openTagKey === null) {
					// outer array
					top.push(el);
				} else {
					// outer object
					top[this.openTagKey] = el;
				}
				
				
				this.openTag = null;
				this.openTagKey = null;
			}
		}
	}
	
	JSONEventHandler.prototype.startElement = function(namespace, localName){
		if(this.json === null) {
			// root element still missing
			if(localName === "map") {
				this.json = new Object();
				this.jsonStack.push(this.json);
			} else if(localName === "array") {
				this.json = new Array();
				this.jsonStack.push(this.json);
			}
		} else {
			this.checkOpenElement();
			this.openTag = localName;
			this.openTagKey = null;
		}
	}
	JSONEventHandler.prototype.endElement = function(namespace, localName) {
		if(this.openTag === "null") {
			var top = this.jsonStack[this.jsonStack.length-1];
			
			if(top instanceof Array) {
				top.push(null);
			} else if(top instanceof Object) {
				top[this.openTagKey] = null;
			}
		}
		
		this.checkOpenElement();
		
		if(localName === "map") {
			this.jsonStack.pop();
		} else if(localName === "array") {
			this.jsonStack.pop();
		}
	}

		
	JSONEventHandler.prototype.attribute = function(namespace, localName, value){
		if(localName === "key") {
			this.openTagKey = value;
		}
	}
	
	JSONEventHandler.prototype.characters = function(chars){
		// this.checkOpenElement();
		
		console.log("chars: " + chars);
		var top = this.jsonStack[this.jsonStack.length-1];
		
		if(this.openTag === "number") {
			var n = new Number(chars);
			if(top instanceof Array) {
				top.push(n);
			} else if(top instanceof Object) {
				top[this.openTagKey] = n;
			}
		} else if(this.openTag === "string") {
			var s = new String(chars);
			if(top instanceof Array) {
				top.push(s);
			} else if(top instanceof Object) {
				top[this.openTagKey] = s;
			}
		} else if(this.openTag === "boolean") {
			var b = new Boolean(chars);
			if(top instanceof Array) {
				top.push(b);
			} else if(top instanceof Object) {
				top[this.openTagKey] = b;
			}
		} else {
			throw new Error("Unsupported characters type: " + this.openTag);
		}
	}

	
}