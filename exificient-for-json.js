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
					/* TODO escape key */
					this.startElement(exiForJsonUri, key);
					this.startElement(exiForJsonUri, "array");
					// this.attribute("", "key", key);
					this.processJSONArray(val);
					this.endElement();
					this.endElement();
				} else if (val instanceof Object) {
					/* TODO escape key */
					this.startElement(exiForJsonUri, key);
					this.startElement(exiForJsonUri, "map");
					// this.attribute("", "key", key);
					this.processJSONObject(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "string") {
					/* TODO escape key */
					this.startElement(exiForJsonUri, key);
					this.startElement(exiForJsonUri, "string");
					//this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "number") {
					/* TODO escape key */
					this.startElement(exiForJsonUri, key);
					this.startElement(exiForJsonUri, "number");
					// this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "boolean") {
					/* TODO escape key */
					this.startElement(exiForJsonUri, key);
					this.startElement(exiForJsonUri, "boolean");
					// this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (val === null) {
					/* TODO escape key */
					this.startElement(exiForJsonUri, key);
					this.startElement(exiForJsonUri, "null");
					// this.attribute("", "key", key);
					// this.characters(val);
					this.endElement();
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
var jsonGrammars = '{"qnames":{"namespaceContext":[{"uriID":0,"uri":"","qnameContext":[]},{"uriID":1,"uri":"http://www.w3.org/XML/1998/namespace","qnameContext":[{"uriID":1,"localNameID":0,"localName":"base"},{"uriID":1,"localNameID":1,"localName":"id"},{"uriID":1,"localNameID":2,"localName":"lang"},{"uriID":1,"localNameID":3,"localName":"space"}]},{"uriID":2,"uri":"http://www.w3.org/2001/XMLSchema-instance","qnameContext":[{"uriID":2,"localNameID":0,"localName":"nil"},{"uriID":2,"localNameID":1,"localName":"type"}]},{"uriID":3,"uri":"http://www.w3.org/2001/XMLSchema","qnameContext":[{"uriID":3,"localNameID":0,"localName":"ENTITIES","globalTypeGrammarID":18},{"uriID":3,"localNameID":1,"localName":"ENTITY","globalTypeGrammarID":7},{"uriID":3,"localNameID":2,"localName":"ID","globalTypeGrammarID":7},{"uriID":3,"localNameID":3,"localName":"IDREF","globalTypeGrammarID":7},{"uriID":3,"localNameID":4,"localName":"IDREFS","globalTypeGrammarID":18},{"uriID":3,"localNameID":5,"localName":"NCName","globalTypeGrammarID":7},{"uriID":3,"localNameID":6,"localName":"NMTOKEN","globalTypeGrammarID":7},{"uriID":3,"localNameID":7,"localName":"NMTOKENS","globalTypeGrammarID":18},{"uriID":3,"localNameID":8,"localName":"NOTATION","globalTypeGrammarID":7},{"uriID":3,"localNameID":9,"localName":"Name","globalTypeGrammarID":7},{"uriID":3,"localNameID":10,"localName":"QName","globalTypeGrammarID":7},{"uriID":3,"localNameID":11,"localName":"anySimpleType","globalTypeGrammarID":7},{"uriID":3,"localNameID":12,"localName":"anyType","globalTypeGrammarID":19},{"uriID":3,"localNameID":13,"localName":"anyURI","globalTypeGrammarID":7},{"uriID":3,"localNameID":14,"localName":"base64Binary","globalTypeGrammarID":12},{"uriID":3,"localNameID":15,"localName":"boolean","globalTypeGrammarID":9},{"uriID":3,"localNameID":16,"localName":"byte","globalTypeGrammarID":20},{"uriID":3,"localNameID":17,"localName":"date","globalTypeGrammarID":15},{"uriID":3,"localNameID":18,"localName":"dateTime","globalTypeGrammarID":13},{"uriID":3,"localNameID":19,"localName":"decimal","globalTypeGrammarID":17},{"uriID":3,"localNameID":20,"localName":"double","globalTypeGrammarID":8},{"uriID":3,"localNameID":21,"localName":"duration","globalTypeGrammarID":7},{"uriID":3,"localNameID":22,"localName":"float","globalTypeGrammarID":8},{"uriID":3,"localNameID":23,"localName":"gDay","globalTypeGrammarID":21},{"uriID":3,"localNameID":24,"localName":"gMonth","globalTypeGrammarID":22},{"uriID":3,"localNameID":25,"localName":"gMonthDay","globalTypeGrammarID":23},{"uriID":3,"localNameID":26,"localName":"gYear","globalTypeGrammarID":24},{"uriID":3,"localNameID":27,"localName":"gYearMonth","globalTypeGrammarID":25},{"uriID":3,"localNameID":28,"localName":"hexBinary","globalTypeGrammarID":26},{"uriID":3,"localNameID":29,"localName":"int","globalTypeGrammarID":16},{"uriID":3,"localNameID":30,"localName":"integer","globalTypeGrammarID":16},{"uriID":3,"localNameID":31,"localName":"language","globalTypeGrammarID":7},{"uriID":3,"localNameID":32,"localName":"long","globalTypeGrammarID":16},{"uriID":3,"localNameID":33,"localName":"negativeInteger","globalTypeGrammarID":16},{"uriID":3,"localNameID":34,"localName":"nonNegativeInteger","globalTypeGrammarID":27},{"uriID":3,"localNameID":35,"localName":"nonPositiveInteger","globalTypeGrammarID":16},{"uriID":3,"localNameID":36,"localName":"normalizedString","globalTypeGrammarID":7},{"uriID":3,"localNameID":37,"localName":"positiveInteger","globalTypeGrammarID":27},{"uriID":3,"localNameID":38,"localName":"short","globalTypeGrammarID":16},{"uriID":3,"localNameID":39,"localName":"string","globalTypeGrammarID":7},{"uriID":3,"localNameID":40,"localName":"time","globalTypeGrammarID":14},{"uriID":3,"localNameID":41,"localName":"token","globalTypeGrammarID":7},{"uriID":3,"localNameID":42,"localName":"unsignedByte","globalTypeGrammarID":28},{"uriID":3,"localNameID":43,"localName":"unsignedInt","globalTypeGrammarID":27},{"uriID":3,"localNameID":44,"localName":"unsignedLong","globalTypeGrammarID":27},{"uriID":3,"localNameID":45,"localName":"unsignedShort","globalTypeGrammarID":27}]},{"uriID":4,"uri":"http://www.w3.org/2015/EXI/json","qnameContext":[{"uriID":4,"localNameID":0,"localName":"array","globalElementGrammarID":5},{"uriID":4,"localNameID":1,"localName":"arrayType","globalTypeGrammarID":5},{"uriID":4,"localNameID":2,"localName":"base64Binary"},{"uriID":4,"localNameID":3,"localName":"boolean","globalElementGrammarID":9},{"uriID":4,"localNameID":4,"localName":"booleanType","globalTypeGrammarID":9},{"uriID":4,"localNameID":5,"localName":"date"},{"uriID":4,"localNameID":6,"localName":"dateTime"},{"uriID":4,"localNameID":7,"localName":"decimal"},{"uriID":4,"localNameID":8,"localName":"integer"},{"uriID":4,"localNameID":9,"localName":"map","globalElementGrammarID":6},{"uriID":4,"localNameID":10,"localName":"mapType","globalTypeGrammarID":6},{"uriID":4,"localNameID":11,"localName":"null","globalElementGrammarID":10},{"uriID":4,"localNameID":12,"localName":"nullType","globalTypeGrammarID":10},{"uriID":4,"localNameID":13,"localName":"number","globalElementGrammarID":8},{"uriID":4,"localNameID":14,"localName":"numberType","globalTypeGrammarID":8},{"uriID":4,"localNameID":15,"localName":"other","globalElementGrammarID":11},{"uriID":4,"localNameID":16,"localName":"otherType","globalTypeGrammarID":11},{"uriID":4,"localNameID":17,"localName":"string","globalElementGrammarID":7},{"uriID":4,"localNameID":18,"localName":"stringType","globalTypeGrammarID":7},{"uriID":4,"localNameID":19,"localName":"time"}]}]},"simpleDatatypes":[{"simpleDatatypeID":0,"type":"STRING"},{"simpleDatatypeID":1,"type":"STRING"},{"simpleDatatypeID":2,"type":"FLOAT"},{"simpleDatatypeID":3,"type":"FLOAT"},{"simpleDatatypeID":4,"type":"BOOLEAN"},{"simpleDatatypeID":5,"type":"BOOLEAN"},{"simpleDatatypeID":6,"type":"BINARY_BASE64"},{"simpleDatatypeID":7,"type":"DATETIME","datetimeType":"dateTime"},{"simpleDatatypeID":8,"type":"DATETIME","datetimeType":"time"},{"simpleDatatypeID":9,"type":"DATETIME","datetimeType":"date"},{"simpleDatatypeID":10,"type":"INTEGER"},{"simpleDatatypeID":11,"type":"DECIMAL"},{"simpleDatatypeID":12,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":13,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":14,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":-128,"upperBound":127},{"simpleDatatypeID":15,"type":"INTEGER"},{"simpleDatatypeID":16,"type":"DATETIME","datetimeType":"gDay"},{"simpleDatatypeID":17,"type":"STRING"},{"simpleDatatypeID":18,"type":"DATETIME","datetimeType":"gMonth"},{"simpleDatatypeID":19,"type":"DATETIME","datetimeType":"gMonthDay"},{"simpleDatatypeID":20,"type":"DATETIME","datetimeType":"gYear"},{"simpleDatatypeID":21,"type":"DATETIME","datetimeType":"gYearMonth"},{"simpleDatatypeID":22,"type":"BINARY_HEX"},{"simpleDatatypeID":23,"type":"UNSIGNED_INTEGER"},{"simpleDatatypeID":24,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":0,"upperBound":255},{"simpleDatatypeID":25,"type":"UNSIGNED_INTEGER"}],"grs":{"documentGrammarID":0,"fragmentGrammarID":3,"grammar":[{"grammarID":"0","type":"document","production":[{"event":"startDocument","nextGrammarID":1}]},{"grammarID":"1","type":"docContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":2},{"event":"startElementGeneric","nextGrammarID":2}]},{"grammarID":"2","type":"docEnd","production":[{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"3","type":"fragment","production":[{"event":"startDocument","nextGrammarID":4}]},{"grammarID":"4","type":"fragmentContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":12,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":15,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":13,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":17,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":16,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":14,"nextGrammarID":4},{"event":"startElementGeneric","nextGrammarID":4},{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"5","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":31},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"6","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElementNS","startElementNamespaceID":4,"nextGrammarID":29},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"7","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":0,"nextGrammarID":32}]},{"grammarID":"8","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":2,"nextGrammarID":32}]},{"grammarID":"9","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":4,"nextGrammarID":32}]},{"grammarID":"10","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"11","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":12,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":13,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":14,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":15,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":16,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":17,"nextGrammarID":32}]},{"grammarID":"12","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":6,"nextGrammarID":32}]},{"grammarID":"13","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":7,"nextGrammarID":32}]},{"grammarID":"14","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":8,"nextGrammarID":32}]},{"grammarID":"15","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":9,"nextGrammarID":32}]},{"grammarID":"16","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":10,"nextGrammarID":32}]},{"grammarID":"17","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":11,"nextGrammarID":32}]},{"grammarID":"18","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":12,"nextGrammarID":32}]},{"grammarID":"19","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attributeGeneric","nextGrammarID":19},{"event":"startElementGeneric","nextGrammarID":33},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":33}]},{"grammarID":"20","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":14,"nextGrammarID":32}]},{"grammarID":"21","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":16,"nextGrammarID":32}]},{"grammarID":"22","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":18,"nextGrammarID":32}]},{"grammarID":"23","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":19,"nextGrammarID":32}]},{"grammarID":"24","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":20,"nextGrammarID":32}]},{"grammarID":"25","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":21,"nextGrammarID":32}]},{"grammarID":"26","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":22,"nextGrammarID":32}]},{"grammarID":"27","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":23,"nextGrammarID":32}]},{"grammarID":"28","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":24,"nextGrammarID":32}]},{"grammarID":"29","type":"elementContent","production":[{"event":"startElementNS","startElementNamespaceID":4,"nextGrammarID":29},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"30","type":"elementContent","production":[]},{"grammarID":"31","type":"elementContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":31},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"32","type":"elementContent","production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"33","type":"elementContent","production":[{"event":"startElementGeneric","nextGrammarID":33},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":33}]}]}}';
var jsonGrammarsObject = JSON.parse(jsonGrammars);

function JSONEventHandler() {

	this.openTag;
	this.openTagKey;
	this.json;
	this.jsonStack;
	// this.lastElement;
	this.chars;
	
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
		
//	JSONEventHandler.prototype.checkOpenElement = function(){
//		if(this.openTag != null) {
//			var top = this.jsonStack[this.jsonStack.length-1];
//			
//			var el = null;
//			if(this.openTag === "map") {
//				el = new Object();
//				this.jsonStack.push(el);
//			} else if(this.openTag === "array") {
//				el = new Array();
//				this.jsonStack.push(el);
//			}
//			
//			if(el != null) {
//				if(this.openTagKey === null) {
//					// outer array
//					top.push(el);
//				} else {
//					// outer object
//					top[this.openTagKey] = el;
//				}
//				
//				
//				this.openTag = null;
//				this.openTagKey = null;
//			}
//		}
//	}
	
	JSONEventHandler.prototype.startElement = function(namespace, localName){
		if(this.json === null) {
			// root element still missing
			if(localName === "map") {
				this.json = new Object();
				this.jsonStack.push(this.json);
			} else if(localName === "array") {
				this.json = new Array();
				this.jsonStack.push(this.json);
			} else {
				throw new Error("Unexpected root element = " + localName);
			}
		} else {
			if(localName === "map" || localName === "array") {
				var value;
				
				if(localName === "map") {
					value = new Object();
				} else {
					value = new Array();
				}
				
				
				// var o = new Object();
				this.jsonStack.push(value);
				
				var top2 = this.jsonStack[this.jsonStack.length-2];
				var top3 = this.jsonStack[this.jsonStack.length-3];
				if(top3 instanceof Array) {
					top3.push(value);
				} else if(top3 instanceof Object) {
					top3[top2] = value;
				} else if(top2 instanceof Array) {
					top2.push(value);
				} else {
					throw new Error("Unexpected SE top3  instance = " + top3);
				}
				
				
//			} else if(localName === "array") {
//				var a = new Array();
//				this.jsonStack.push(a);
			} else {
				this.jsonStack.push(localName);
			}
			
			
			
			
//			this.checkOpenElement();
//			this.openTag = localName;
//			// this.openTagKey = null;
//			
//			if(this.openTagKey === null && !( localName === "map" ||  localName === "array" ||  localName === "string" || localName === "number" ||  localName === "boolean" ||  localName === "null" ||  localName === "other")) {
//				this.openTagKey = localName;
//			}
			
		}
	}
	JSONEventHandler.prototype.endElement = function(namespace, localName) {
		
		var top = this.jsonStack[this.jsonStack.length-1];
		
		
		var value;
		
		if(top === "number") {
			value = new Number(this.chars);
		} else if (top === "string") {
			value = new String(this.chars);
		} else if (top === "boolean") {
			value = new Boolean(this.chars);
		} else if (top === "null") {
			value = null;
		}
		
		if(value !== undefined) {
			var top2 = this.jsonStack[this.jsonStack.length-2];
			var top3 = this.jsonStack[this.jsonStack.length-3];
			if(top3 instanceof Array) {
				top3.push(value);
			} else if(top3 instanceof Object) {
				top3[top2] = value;
			} else if(top2 instanceof Array) {
				top2.push(value);
			} else {
				throw new Error("Unexpected EE top3  instance = " + top3);
			}
			
			this.chars = null;
		}
		
		
		this.jsonStack.pop();
		
//		if(this.openTag === "null") {
//			var top = this.jsonStack[this.jsonStack.length-1];
//			
//			if(top instanceof Array) {
//				top.push(null);
//			} else if(top instanceof Object) {
//				top[this.openTagKey] = null;
//			}
//		}
//		
//		this.checkOpenElement();
//		
//		if(localName === "map") {
//			this.jsonStack.pop();
//		} else if(localName === "array") {
//			this.jsonStack.pop();
//		}
	}

		
	JSONEventHandler.prototype.attribute = function(namespace, localName, value){
//		if(localName === "key") {
//			this.openTagKey = value;
//		}
	}
	
	
	
	JSONEventHandler.prototype.characters = function(chars){
		// this.checkOpenElement();
		
		console.log("chars: " + chars);
		this.chars = chars;
		
//		var top = this.jsonStack[this.jsonStack.length-1];
		
//		if(this.openTag === "number") {
//			var n = new Number(chars);
//			if(top instanceof Array) {
//				top.push(n);
//			} else if(top instanceof Object) {
//				top[this.openTagKey] = n;
//			}
//		} else if(this.openTag === "string") {
//			var s = new String(chars);
//			if(top instanceof Array) {
//				top.push(s);
//			} else if(top instanceof Object) {
//				top[this.openTagKey] = s;
//			}
//		} else if(this.openTag === "boolean") {
//			var b = new Boolean(chars);
//			if(top instanceof Array) {
//				top.push(b);
//			} else if(top instanceof Object) {
//				top[this.openTagKey] = b;
//			}
//		} else {
//			throw new Error("Unsupported characters type: " + this.openTag);
//		}
	}

	
}






function EXI4JSON() {
}

// EXI4JSON.encoder = new EXI4JSONEncoder();
// var decoder = new EXI4JSONDecoder();

EXI4JSON.exify = function(jsonObj) {
	var encoder = new EXI4JSONEncoder();
	encoder.encodeJsonObject(jsonObj);
	// EXI4JSON.encoder.encodeJsonObject(jsonObj);
	var uint8ArrayLength = encoder.getUint8ArrayLength();
	var uint8Array = encoder.getUint8Array();
	return uint8Array;
}


EXI4JSON.parse = function(uint8Array){
	var decoder = new EXI4JSONDecoder();
	var jsonHandler = new JSONEventHandler();
	decoder.registerEventHandler(jsonHandler);
	decoder.decode(uint8Array.buffer);
	// var jsonText = JSON.stringify(jsonHandler.getJSON(), null, "\t");
	return jsonHandler.getJSON();
}


