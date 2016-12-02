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
					this.startElement(exiForJsonUri, this.escapeKey(key));
					this.startElement(exiForJsonUri, "array");
					this.processJSONArray(val);
					this.endElement();
					this.endElement();
				} else if (val instanceof Object) {
					this.startElement(exiForJsonUri, this.escapeKey(key));
					this.startElement(exiForJsonUri, "map");
					this.processJSONObject(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "string") {
					this.startElement(exiForJsonUri, this.escapeKey(key));
					this.startElement(exiForJsonUri, "string");
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "number") {
					this.startElement(exiForJsonUri, this.escapeKey(key));
					this.startElement(exiForJsonUri, "number");
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "boolean") {
					this.startElement(exiForJsonUri, this.escapeKey(key));
					this.startElement(exiForJsonUri, "boolean");
					// this.attribute("", "key", key);
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (val === null) {
					this.startElement(exiForJsonUri, this.escapeKey(key));
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
	
	
	
	EXI4JSONEncoder.prototype.escapeKey = function(key){
		if ("map"===key || "array"===key 
				|| "string"===key || "number"===key
				|| "boolean"===key || "null"===key
				|| "other"===key) {
			// Key-name Escaping
			// (https://www.w3.org/TR/2016/WD-exi-for-json-20160823/#keynameEscaping)
			// --> Conflict with existing EXI4JSON global schema element name
			key = "_." + key;
		} else {
			key = this.escapeNCNamePlus(key);
		}

		return key;
	}
	
	EXI4JSONEncoder.prototype.escapeNCNamePlus = function(name) {
		if (name === null || name.length == 0) {
			throw new Error("Unsupported NCName: " + name);
		}

		var sb = "";

		for (var i = 0; i < name.length; i++) {
			var c = name.charAt(i);
			
			if (i == 0) {
				// first character (special)
				if (this.isLetter(c)) {
					// OK
					if (sb != null) {
						sb += c;
					}
				} else if (c == '_') {
					// NOT OK: valid NCName, but needs to be escaped for EXI4JSON
					sb += "_95.";
				} else {
					// NOT OK
					sb += "_";
					// TODO Is this a UTF-16 surrogate pair?
//					if (Character.isHighSurrogate(c)) {
//						// use code-point and increment loop count (2 char's)
//						sb += name.codePointAt(i++);
//					} else {
						sb += name.charCodeAt(i);
//					}
					sb += ".";
				}
			} else {
				// rest of the characters
				if (this.isNCNameChar(c)) {
					if(c == '_') {
						// NOT OK: valid NCName, but needs to be escaped for EXI4JSON
						if (sb.length == 0) {
							sb += name.substring(0, i);
						}
						sb +=  "_95.";
					} else {
						// OK
						if (sb.length != 0) {
							sb += c;
						}
					}
				} else {
					// Not OK, fix
					if (sb.length == 0) {
						sb += name.substring(0, i);
					}
					sb += "_";
					// TODO Is this a UTF-16 surrogate pair?
//					if (Character.isHighSurrogate(c)) {
//						// use code-point and increment loop count (2 char's)
//						sb += name.codePointAt(i++);
//					} else {
						sb += name.charCodeAt(i);
//					}
					sb += ".";
				}
			}
		}

		// All characters have been checked
		if (sb.length == 0) {
			return name; // as is
		} else {
			return sb;
		}
	}
	
	EXI4JSONEncoder.prototype.isNCNameChar = function(c) {
		return this._isAsciiBaseChar(c) || this._isAsciiDigit(c) || c == '.' || c == '-' || c == '_' || this._isNonAsciiBaseChar(c)
				|| this._isNonAsciiDigit(c) || this.isIdeographic(c) || this.isCombiningChar(c) || this.isExtender(c);
	}
	
	EXI4JSONEncoder.prototype.isLetter = function(c) {
		return this._isAsciiBaseChar(c) || this._isNonAsciiBaseChar(c) || this.isIdeographic(c);
	}
	
	EXI4JSONEncoder.prototype._isAsciiBaseChar = function(c) {
		return this._charInRange(c, 0x0041, 0x005A) || this._charInRange(c, 0x0061, 0x007A);
	}
	
	EXI4JSONEncoder.prototype._isNonAsciiBaseChar = function(c) {
		return this._charInRange(c, 0x00C0, 0x00D6) || this._charInRange(c, 0x00D8, 0x00F6) || this._charInRange(c, 0x00F8, 0x00FF)
				|| this._charInRange(c, 0x0100, 0x0131) || this._charInRange(c, 0x0134, 0x013E) || this._charInRange(c, 0x0141, 0x0148)
				|| this._charInRange(c, 0x014A, 0x017E) || this._charInRange(c, 0x0180, 0x01C3) || this._charInRange(c, 0x01CD, 0x01F0)
				|| this._charInRange(c, 0x01F4, 0x01F5) || this._charInRange(c, 0x01FA, 0x0217) || this._charInRange(c, 0x0250, 0x02A8)
				|| this._charInRange(c, 0x02BB, 0x02C1) || c == 0x0386 || this._charInRange(c, 0x0388, 0x038A) || c == 0x038C
				|| this._charInRange(c, 0x038E, 0x03A1) || this._charInRange(c, 0x03A3, 0x03CE) || this._charInRange(c, 0x03D0, 0x03D6)
				|| c == 0x03DA || c == 0x03DC || c == 0x03DE || c == 0x03E0 || this._charInRange(c, 0x03E2, 0x03F3)
				|| this._charInRange(c, 0x0401, 0x040C) || this._charInRange(c, 0x040E, 0x044F) || this._charInRange(c, 0x0451, 0x045C)
				|| this._charInRange(c, 0x045E, 0x0481) || this._charInRange(c, 0x0490, 0x04C4) || this._charInRange(c, 0x04C7, 0x04C8)
				|| this._charInRange(c, 0x04CB, 0x04CC) || this._charInRange(c, 0x04D0, 0x04EB) || this._charInRange(c, 0x04EE, 0x04F5)
				|| this._charInRange(c, 0x04F8, 0x04F9) || this._charInRange(c, 0x0531, 0x0556) || c == 0x0559
				|| this._charInRange(c, 0x0561, 0x0586) || this._charInRange(c, 0x05D0, 0x05EA) || this._charInRange(c, 0x05F0, 0x05F2)
				|| this._charInRange(c, 0x0621, 0x063A) || this._charInRange(c, 0x0641, 0x064A) || this._charInRange(c, 0x0671, 0x06B7)
				|| this._charInRange(c, 0x06BA, 0x06BE) || this._charInRange(c, 0x06C0, 0x06CE) || this._charInRange(c, 0x06D0, 0x06D3)
				|| c == 0x06D5 || this._charInRange(c, 0x06E5, 0x06E6) || this._charInRange(c, 0x0905, 0x0939) || c == 0x093D
				|| this._charInRange(c, 0x0958, 0x0961) || this._charInRange(c, 0x0985, 0x098C) || this._charInRange(c, 0x098F, 0x0990)
				|| this._charInRange(c, 0x0993, 0x09A8) || this._charInRange(c, 0x09AA, 0x09B0) || c == 0x09B2
				|| this._charInRange(c, 0x09B6, 0x09B9) || this._charInRange(c, 0x09DC, 0x09DD) || this._charInRange(c, 0x09DF, 0x09E1)
				|| this._charInRange(c, 0x09F0, 0x09F1) || this._charInRange(c, 0x0A05, 0x0A0A) || this._charInRange(c, 0x0A0F, 0x0A10)
				|| this._charInRange(c, 0x0A13, 0x0A28) || this._charInRange(c, 0x0A2A, 0x0A30) || this._charInRange(c, 0x0A32, 0x0A33)
				|| this._charInRange(c, 0x0A35, 0x0A36) || this._charInRange(c, 0x0A38, 0x0A39) || this._charInRange(c, 0x0A59, 0x0A5C)
				|| c == 0x0A5E || this._charInRange(c, 0x0A72, 0x0A74) || this._charInRange(c, 0x0A85, 0x0A8B) || c == 0x0A8D
				|| this._charInRange(c, 0x0A8F, 0x0A91) || this._charInRange(c, 0x0A93, 0x0AA8) || this._charInRange(c, 0x0AAA, 0x0AB0)
				|| this._charInRange(c, 0x0AB2, 0x0AB3) || this._charInRange(c, 0x0AB5, 0x0AB9) || c == 0x0ABD || c == 0x0AE0
				|| this._charInRange(c, 0x0B05, 0x0B0C) || this._charInRange(c, 0x0B0F, 0x0B10) || this._charInRange(c, 0x0B13, 0x0B28)
				|| this._charInRange(c, 0x0B2A, 0x0B30) || this._charInRange(c, 0x0B32, 0x0B33) || this._charInRange(c, 0x0B36, 0x0B39)
				|| c == 0x0B3D || this._charInRange(c, 0x0B5C, 0x0B5D) || this._charInRange(c, 0x0B5F, 0x0B61)
				|| this._charInRange(c, 0x0B85, 0x0B8A) || this._charInRange(c, 0x0B8E, 0x0B90) || this._charInRange(c, 0x0B92, 0x0B95)
				|| this._charInRange(c, 0x0B99, 0x0B9A) || c == 0x0B9C || this._charInRange(c, 0x0B9E, 0x0B9F)
				|| this._charInRange(c, 0x0BA3, 0x0BA4) || this._charInRange(c, 0x0BA8, 0x0BAA) || this._charInRange(c, 0x0BAE, 0x0BB5)
				|| this._charInRange(c, 0x0BB7, 0x0BB9) || this._charInRange(c, 0x0C05, 0x0C0C) || this._charInRange(c, 0x0C0E, 0x0C10)
				|| this._charInRange(c, 0x0C12, 0x0C28) || this._charInRange(c, 0x0C2A, 0x0C33) || this._charInRange(c, 0x0C35, 0x0C39)
				|| this._charInRange(c, 0x0C60, 0x0C61) || this._charInRange(c, 0x0C85, 0x0C8C) || this._charInRange(c, 0x0C8E, 0x0C90)
				|| this._charInRange(c, 0x0C92, 0x0CA8) || this._charInRange(c, 0x0CAA, 0x0CB3) || this._charInRange(c, 0x0CB5, 0x0CB9)
				|| this.c == 0x0CDE || this._charInRange(c, 0x0CE0, 0x0CE1) || this._charInRange(c, 0x0D05, 0x0D0C)
				|| this._charInRange(c, 0x0D0E, 0x0D10) || this._charInRange(c, 0x0D12, 0x0D28) || this._charInRange(c, 0x0D2A, 0x0D39)
				|| this._charInRange(c, 0x0D60, 0x0D61) || this._charInRange(c, 0x0E01, 0x0E2E) || c == 0x0E30
				|| this._charInRange(c, 0x0E32, 0x0E33) || this._charInRange(c, 0x0E40, 0x0E45) || this._charInRange(c, 0x0E81, 0x0E82)
				|| c == 0x0E84 || this._charInRange(c, 0x0E87, 0x0E88) || c == 0x0E8A || c == 0x0E8D
				|| this._charInRange(c, 0x0E94, 0x0E97) || this._charInRange(c, 0x0E99, 0x0E9F) || this._charInRange(c, 0x0EA1, 0x0EA3)
				|| this.c == 0x0EA5 || c == 0x0EA7 || this._charInRange(c, 0x0EAA, 0x0EAB) || this._charInRange(c, 0x0EAD, 0x0EAE)
				|| this.c == 0x0EB0 || this._charInRange(c, 0x0EB2, 0x0EB3) || c == 0x0EBD || this._charInRange(c, 0x0EC0, 0x0EC4)
				|| this._charInRange(c, 0x0F40, 0x0F47) || this._charInRange(c, 0x0F49, 0x0F69) || this._charInRange(c, 0x10A0, 0x10C5)
				|| this._charInRange(c, 0x10D0, 0x10F6) || c == 0x1100 || this._charInRange(c, 0x1102, 0x1103)
				|| this._charInRange(c, 0x1105, 0x1107) || c == 0x1109 || this._charInRange(c, 0x110B, 0x110C)
				|| this._charInRange(c, 0x110E, 0x1112) || c == 0x113C || c == 0x113E || c == 0x1140 || c == 0x114C
				|| c == 0x114E || c == 0x1150 || this._charInRange(c, 0x1154, 0x1155) || c == 0x1159
				|| this._charInRange(c, 0x115F, 0x1161) || c == 0x1163 || c == 0x1165 || c == 0x1167 || c == 0x1169
				|| this._charInRange(c, 0x116D, 0x116E) || this._charInRange(c, 0x1172, 0x1173) || c == 0x1175 || c == 0x119E
				|| c == 0x11A8 || c == 0x11AB || this._charInRange(c, 0x11AE, 0x11AF) || this._charInRange(c, 0x11B7, 0x11B8)
				|| c == 0x11BA || this._charInRange(c, 0x11BC, 0x11C2) || c == 0x11EB || c == 0x11F0 || c == 0x11F9
				|| this._charInRange(c, 0x1E00, 0x1E9B) || this._charInRange(c, 0x1EA0, 0x1EF9) || this._charInRange(c, 0x1F00, 0x1F15)
				|| this._charInRange(c, 0x1F18, 0x1F1D) || this._charInRange(c, 0x1F20, 0x1F45) || this._charInRange(c, 0x1F48, 0x1F4D)
				|| this._charInRange(c, 0x1F50, 0x1F57) || c == 0x1F59 || c == 0x1F5B || c == 0x1F5D
				|| this._charInRange(c, 0x1F5F, 0x1F7D) || this._charInRange(c, 0x1F80, 0x1FB4) || this._charInRange(c, 0x1FB6, 0x1FBC)
				|| c == 0x1FBE || this._charInRange(c, 0x1FC2, 0x1FC4) || this._charInRange(c, 0x1FC6, 0x1FCC)
				|| this._charInRange(c, 0x1FD0, 0x1FD3) || this._charInRange(c, 0x1FD6, 0x1FDB) || this._charInRange(c, 0x1FE0, 0x1FEC)
				|| this._charInRange(c, 0x1FF2, 0x1FF4) || this._charInRange(c, 0x1FF6, 0x1FFC) || c == 0x2126
				|| this._charInRange(c, 0x212A, 0x212B) || c == 0x212E || this._charInRange(c, 0x2180, 0x2182)
				|| this._charInRange(c, 0x3041, 0x3094) || this._charInRange(c, 0x30A1, 0x30FA) || this._charInRange(c, 0x3105, 0x312C)
				|| this._charInRange(c, 0xAC00, 0xD7A3);
	}
	
	EXI4JSONEncoder.prototype.isIdeographic = function(c) {
		return this._charInRange(c, 0x4E00, 0x9FA5) || c == 0x3007 || this._charInRange(c, 0x3021, 0x3029);
	}
	
	EXI4JSONEncoder.prototype.isCombiningChar = function(c) {
		return this._charInRange(c, 0x0300, 0x0345) || this._charInRange(c, 0x0360, 0x0361) || this._charInRange(c, 0x0483, 0x0486)
				|| this._charInRange(c, 0x0591, 0x05A1) || this._charInRange(c, 0x05A3, 0x05B9) || this._charInRange(c, 0x05BB, 0x05BD)
				|| c == 0x05BF || this._charInRange(c, 0x05C1, 0x05C2) || c == 0x05C4 || this._charInRange(c, 0x064B, 0x0652)
				|| c == 0x0670 || this._charInRange(c, 0x06D6, 0x06DC) || this._charInRange(c, 0x06DD, 0x06DF)
				|| this._charInRange(c, 0x06E0, 0x06E4) || this._charInRange(c, 0x06E7, 0x06E8) || this._charInRange(c, 0x06EA, 0x06ED)
				|| this._charInRange(c, 0x0901, 0x0903) || c == 0x093C || this._charInRange(c, 0x093E, 0x094C) || c == 0x094D
				|| this._charInRange(c, 0x0951, 0x0954) || this._charInRange(c, 0x0962, 0x0963) || this._charInRange(c, 0x0981, 0x0983)
				|| c == 0x09BC || c == 0x09BE || c == 0x09BF || this._charInRange(c, 0x09C0, 0x09C4)
				|| this._charInRange(c, 0x09C7, 0x09C8) || this._charInRange(c, 0x09CB, 0x09CD) || c == 0x09D7
				|| this._charInRange(c, 0x09E2, 0x09E3) || c == 0x0A02 || c == 0x0A3C || c == 0x0A3E || c == 0x0A3F
				|| this._charInRange(c, 0x0A40, 0x0A42) || this._charInRange(c, 0x0A47, 0x0A48) || this._charInRange(c, 0x0A4B, 0x0A4D)
				|| this._charInRange(c, 0x0A70, 0x0A71) || this._charInRange(c, 0x0A81, 0x0A83) || c == 0x0ABC
				|| this._charInRange(c, 0x0ABE, 0x0AC5) || this._charInRange(c, 0x0AC7, 0x0AC9) || this._charInRange(c, 0x0ACB, 0x0ACD)
				|| this._charInRange(c, 0x0B01, 0x0B03) || c == 0x0B3C || this._charInRange(c, 0x0B3E, 0x0B43)
				|| this._charInRange(c, 0x0B47, 0x0B48) || this._charInRange(c, 0x0B4B, 0x0B4D) || this._charInRange(c, 0x0B56, 0x0B57)
				|| this._charInRange(c, 0x0B82, 0x0B83) || this._charInRange(c, 0x0BBE, 0x0BC2) || this._charInRange(c, 0x0BC6, 0x0BC8)
				|| this._charInRange(c, 0x0BCA, 0x0BCD) || c == 0x0BD7 || this._charInRange(c, 0x0C01, 0x0C03)
				|| this._charInRange(c, 0x0C3E, 0x0C44) || this._charInRange(c, 0x0C46, 0x0C48) || this._charInRange(c, 0x0C4A, 0x0C4D)
				|| this._charInRange(c, 0x0C55, 0x0C56) || this._charInRange(c, 0x0C82, 0x0C83) || this._charInRange(c, 0x0CBE, 0x0CC4)
				|| this._charInRange(c, 0x0CC6, 0x0CC8) || this._charInRange(c, 0x0CCA, 0x0CCD) || this._charInRange(c, 0x0CD5, 0x0CD6)
				|| this._charInRange(c, 0x0D02, 0x0D03) || this._charInRange(c, 0x0D3E, 0x0D43) || this._charInRange(c, 0x0D46, 0x0D48)
				|| this._charInRange(c, 0x0D4A, 0x0D4D) || c == 0x0D57 || c == 0x0E31 || this._charInRange(c, 0x0E34, 0x0E3A)
				|| this._charInRange(c, 0x0E47, 0x0E4E) || c == 0x0EB1 || this._charInRange(c, 0x0EB4, 0x0EB9)
				|| this._charInRange(c, 0x0EBB, 0x0EBC) || this._charInRange(c, 0x0EC8, 0x0ECD) || this._charInRange(c, 0x0F18, 0x0F19)
				|| c == 0x0F35 || c == 0x0F37 || c == 0x0F39 || c == 0x0F3E || c == 0x0F3F
				|| this._charInRange(c, 0x0F71, 0x0F84) || this._charInRange(c, 0x0F86, 0x0F8B) || this._charInRange(c, 0x0F90, 0x0F95)
				|| c == 0x0F97 || this._charInRange(c, 0x0F99, 0x0FAD) || this._charInRange(c, 0x0FB1, 0x0FB7) || c == 0x0FB9
				|| this._charInRange(c, 0x20D0, 0x20DC) || c == 0x20E1 || this._charInRange(c, 0x302A, 0x302F) || c == 0x3099
				|| c == 0x309A;
	}
	
	
	EXI4JSONEncoder.prototype.isDigit = function(c) {
		return this._isAsciiDigit(c) || this._isNonAsciiDigit(c);
	}

	EXI4JSONEncoder.prototype._isAsciiDigit = function(c) {
		return this._charInRange(c, 0x0030, 0x0039);
	}

	EXI4JSONEncoder.prototype._isNonAsciiDigit = function(c) {
		return this._charInRange(c, 0x0660, 0x0669) || this._charInRange(c, 0x06F0, 0x06F9) || this._charInRange(c, 0x0966, 0x096F)
				|| this._charInRange(c, 0x09E6, 0x09EF) || this._charInRange(c, 0x0A66, 0x0A6F) || this._charInRange(c, 0x0AE6, 0x0AEF)
				|| this._charInRange(c, 0x0B66, 0x0B6F) || this._charInRange(c, 0x0BE7, 0x0BEF) || this._charInRange(c, 0x0C66, 0x0C6F)
				|| this._charInRange(c, 0x0CE6, 0x0CEF) || this._charInRange(c, 0x0D66, 0x0D6F) || this._charInRange(c, 0x0E50, 0x0E59)
				|| this._charInRange(c, 0x0ED0, 0x0ED9) || this._charInRange(c, 0x0F20, 0x0F29);
	}

	EXI4JSONEncoder.prototype.isExtender = function(c) {
		return c == 0x00B7 || c == 0x02D0 || c == 0x02D1 || c == 0x0387 || c == 0x0640 || c == 0x0E46 || c == 0x0EC6
				|| c == 0x3005 || this._charInRange(c, 0x3031, 0x3035) || this._charInRange(c, 0x309D, 0x309E)
				|| this._charInRange(c, 0x30FC, 0x30FE);
	}

	EXI4JSONEncoder.prototype._charInRange = function(c, start, end) {
		var ccode = c.charCodeAt(0);
		return ccode >= start && ccode <= end;
		
		// charCodeAt
	}
}


// see minified schema-for-json.xsd.grs with thing grammars
// Note: the idea would be to have this optimized (currently all schema information, even unnecessary stuff is there...)
var jsonGrammars = '{"qnames":{"namespaceContext":[{"uriID":0,"uri":"","qnameContext":[]},{"uriID":1,"uri":"http://www.w3.org/XML/1998/namespace","qnameContext":[{"uriID":1,"localNameID":0,"localName":"base"},{"uriID":1,"localNameID":1,"localName":"id"},{"uriID":1,"localNameID":2,"localName":"lang"},{"uriID":1,"localNameID":3,"localName":"space"}]},{"uriID":2,"uri":"http://www.w3.org/2001/XMLSchema-instance","qnameContext":[{"uriID":2,"localNameID":0,"localName":"nil"},{"uriID":2,"localNameID":1,"localName":"type"}]},{"uriID":3,"uri":"http://www.w3.org/2001/XMLSchema","qnameContext":[{"uriID":3,"localNameID":0,"localName":"ENTITIES","globalTypeGrammarID":18},{"uriID":3,"localNameID":1,"localName":"ENTITY","globalTypeGrammarID":7},{"uriID":3,"localNameID":2,"localName":"ID","globalTypeGrammarID":7},{"uriID":3,"localNameID":3,"localName":"IDREF","globalTypeGrammarID":7},{"uriID":3,"localNameID":4,"localName":"IDREFS","globalTypeGrammarID":18},{"uriID":3,"localNameID":5,"localName":"NCName","globalTypeGrammarID":7},{"uriID":3,"localNameID":6,"localName":"NMTOKEN","globalTypeGrammarID":7},{"uriID":3,"localNameID":7,"localName":"NMTOKENS","globalTypeGrammarID":18},{"uriID":3,"localNameID":8,"localName":"NOTATION","globalTypeGrammarID":7},{"uriID":3,"localNameID":9,"localName":"Name","globalTypeGrammarID":7},{"uriID":3,"localNameID":10,"localName":"QName","globalTypeGrammarID":7},{"uriID":3,"localNameID":11,"localName":"anySimpleType","globalTypeGrammarID":7},{"uriID":3,"localNameID":12,"localName":"anyType","globalTypeGrammarID":19},{"uriID":3,"localNameID":13,"localName":"anyURI","globalTypeGrammarID":7},{"uriID":3,"localNameID":14,"localName":"base64Binary","globalTypeGrammarID":12},{"uriID":3,"localNameID":15,"localName":"boolean","globalTypeGrammarID":9},{"uriID":3,"localNameID":16,"localName":"byte","globalTypeGrammarID":20},{"uriID":3,"localNameID":17,"localName":"date","globalTypeGrammarID":15},{"uriID":3,"localNameID":18,"localName":"dateTime","globalTypeGrammarID":13},{"uriID":3,"localNameID":19,"localName":"decimal","globalTypeGrammarID":17},{"uriID":3,"localNameID":20,"localName":"double","globalTypeGrammarID":8},{"uriID":3,"localNameID":21,"localName":"duration","globalTypeGrammarID":7},{"uriID":3,"localNameID":22,"localName":"float","globalTypeGrammarID":8},{"uriID":3,"localNameID":23,"localName":"gDay","globalTypeGrammarID":21},{"uriID":3,"localNameID":24,"localName":"gMonth","globalTypeGrammarID":22},{"uriID":3,"localNameID":25,"localName":"gMonthDay","globalTypeGrammarID":23},{"uriID":3,"localNameID":26,"localName":"gYear","globalTypeGrammarID":24},{"uriID":3,"localNameID":27,"localName":"gYearMonth","globalTypeGrammarID":25},{"uriID":3,"localNameID":28,"localName":"hexBinary","globalTypeGrammarID":26},{"uriID":3,"localNameID":29,"localName":"int","globalTypeGrammarID":16},{"uriID":3,"localNameID":30,"localName":"integer","globalTypeGrammarID":16},{"uriID":3,"localNameID":31,"localName":"language","globalTypeGrammarID":7},{"uriID":3,"localNameID":32,"localName":"long","globalTypeGrammarID":16},{"uriID":3,"localNameID":33,"localName":"negativeInteger","globalTypeGrammarID":16},{"uriID":3,"localNameID":34,"localName":"nonNegativeInteger","globalTypeGrammarID":27},{"uriID":3,"localNameID":35,"localName":"nonPositiveInteger","globalTypeGrammarID":16},{"uriID":3,"localNameID":36,"localName":"normalizedString","globalTypeGrammarID":7},{"uriID":3,"localNameID":37,"localName":"positiveInteger","globalTypeGrammarID":27},{"uriID":3,"localNameID":38,"localName":"short","globalTypeGrammarID":16},{"uriID":3,"localNameID":39,"localName":"string","globalTypeGrammarID":7},{"uriID":3,"localNameID":40,"localName":"time","globalTypeGrammarID":14},{"uriID":3,"localNameID":41,"localName":"token","globalTypeGrammarID":7},{"uriID":3,"localNameID":42,"localName":"unsignedByte","globalTypeGrammarID":28},{"uriID":3,"localNameID":43,"localName":"unsignedInt","globalTypeGrammarID":27},{"uriID":3,"localNameID":44,"localName":"unsignedLong","globalTypeGrammarID":27},{"uriID":3,"localNameID":45,"localName":"unsignedShort","globalTypeGrammarID":27}]},{"uriID":4,"uri":"http://www.w3.org/2015/EXI/json","qnameContext":[{"uriID":4,"localNameID":0,"localName":"array","globalElementGrammarID":5},{"uriID":4,"localNameID":1,"localName":"arrayType","globalTypeGrammarID":5},{"uriID":4,"localNameID":2,"localName":"base64Binary"},{"uriID":4,"localNameID":3,"localName":"boolean","globalElementGrammarID":9},{"uriID":4,"localNameID":4,"localName":"booleanType","globalTypeGrammarID":9},{"uriID":4,"localNameID":5,"localName":"date"},{"uriID":4,"localNameID":6,"localName":"dateTime"},{"uriID":4,"localNameID":7,"localName":"decimal"},{"uriID":4,"localNameID":8,"localName":"integer"},{"uriID":4,"localNameID":9,"localName":"map","globalElementGrammarID":6},{"uriID":4,"localNameID":10,"localName":"mapType","globalTypeGrammarID":6},{"uriID":4,"localNameID":11,"localName":"null","globalElementGrammarID":10},{"uriID":4,"localNameID":12,"localName":"nullType","globalTypeGrammarID":10},{"uriID":4,"localNameID":13,"localName":"number","globalElementGrammarID":8},{"uriID":4,"localNameID":14,"localName":"numberType","globalTypeGrammarID":8},{"uriID":4,"localNameID":15,"localName":"other","globalElementGrammarID":11},{"uriID":4,"localNameID":16,"localName":"otherType","globalTypeGrammarID":11},{"uriID":4,"localNameID":17,"localName":"string","globalElementGrammarID":7},{"uriID":4,"localNameID":18,"localName":"stringType","globalTypeGrammarID":7},{"uriID":4,"localNameID":19,"localName":"time"}]}]},"simpleDatatypes":[{"simpleDatatypeID":0,"type":"STRING"},{"simpleDatatypeID":1,"type":"STRING"},{"simpleDatatypeID":2,"type":"FLOAT"},{"simpleDatatypeID":3,"type":"FLOAT"},{"simpleDatatypeID":4,"type":"BOOLEAN"},{"simpleDatatypeID":5,"type":"BOOLEAN"},{"simpleDatatypeID":6,"type":"BINARY_BASE64"},{"simpleDatatypeID":7,"type":"DATETIME","datetimeType":"dateTime"},{"simpleDatatypeID":8,"type":"DATETIME","datetimeType":"time"},{"simpleDatatypeID":9,"type":"DATETIME","datetimeType":"date"},{"simpleDatatypeID":10,"type":"INTEGER"},{"simpleDatatypeID":11,"type":"DECIMAL"},{"simpleDatatypeID":12,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":13,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":14,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":-128,"upperBound":127},{"simpleDatatypeID":15,"type":"INTEGER"},{"simpleDatatypeID":16,"type":"DATETIME","datetimeType":"gDay"},{"simpleDatatypeID":17,"type":"STRING"},{"simpleDatatypeID":18,"type":"DATETIME","datetimeType":"gMonth"},{"simpleDatatypeID":19,"type":"DATETIME","datetimeType":"gMonthDay"},{"simpleDatatypeID":20,"type":"DATETIME","datetimeType":"gYear"},{"simpleDatatypeID":21,"type":"DATETIME","datetimeType":"gYearMonth"},{"simpleDatatypeID":22,"type":"BINARY_HEX"},{"simpleDatatypeID":23,"type":"UNSIGNED_INTEGER"},{"simpleDatatypeID":24,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":0,"upperBound":255},{"simpleDatatypeID":25,"type":"UNSIGNED_INTEGER"}],"grs":{"documentGrammarID":0,"fragmentGrammarID":3,"grammar":[{"grammarID":"0","type":"document","production":[{"event":"startDocument","nextGrammarID":1}]},{"grammarID":"1","type":"docContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":2},{"event":"startElementGeneric","nextGrammarID":2}]},{"grammarID":"2","type":"docEnd","production":[{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"3","type":"fragment","production":[{"event":"startDocument","nextGrammarID":4}]},{"grammarID":"4","type":"fragmentContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":12,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":15,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":13,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":17,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":16,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":14,"nextGrammarID":4},{"event":"startElementGeneric","nextGrammarID":4},{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"5","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":31},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"6","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElementNS","startElementNamespaceID":4,"nextGrammarID":29},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"7","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":0,"nextGrammarID":32}]},{"grammarID":"8","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":2,"nextGrammarID":32}]},{"grammarID":"9","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":4,"nextGrammarID":32}]},{"grammarID":"10","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"11","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":12,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":13,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":14,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":15,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":16,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":17,"nextGrammarID":32}]},{"grammarID":"12","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":6,"nextGrammarID":32}]},{"grammarID":"13","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":7,"nextGrammarID":32}]},{"grammarID":"14","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":8,"nextGrammarID":32}]},{"grammarID":"15","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":9,"nextGrammarID":32}]},{"grammarID":"16","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":10,"nextGrammarID":32}]},{"grammarID":"17","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":11,"nextGrammarID":32}]},{"grammarID":"18","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":12,"nextGrammarID":32}]},{"grammarID":"19","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attributeGeneric","nextGrammarID":19},{"event":"startElementGeneric","nextGrammarID":33},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":33}]},{"grammarID":"20","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":14,"nextGrammarID":32}]},{"grammarID":"21","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":16,"nextGrammarID":32}]},{"grammarID":"22","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":18,"nextGrammarID":32}]},{"grammarID":"23","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":19,"nextGrammarID":32}]},{"grammarID":"24","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":20,"nextGrammarID":32}]},{"grammarID":"25","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":21,"nextGrammarID":32}]},{"grammarID":"26","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":22,"nextGrammarID":32}]},{"grammarID":"27","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":23,"nextGrammarID":32}]},{"grammarID":"28","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":24,"nextGrammarID":32}]},{"grammarID":"29","type":"elementContent","production":[{"event":"startElementNS","startElementNamespaceID":4,"nextGrammarID":29},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"30","type":"elementContent","production":[]},{"grammarID":"31","type":"elementContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":31},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"32","type":"elementContent","production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"33","type":"elementContent","production":[{"event":"startElementGeneric","nextGrammarID":33},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":33}]}]}}';
var jsonGrammarsObject = JSON.parse(jsonGrammars);

function JSONEventHandler() {

//	this.openTag;
//	this.openTagKey;
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
					var key = this.unescapeKey(top2);
					top3[key] = value;
				} else if(top2 instanceof Array) {
					top2.push(value);
				} else {
					throw new Error("Unexpected SE top3  instance = " + top3);
				}
				
			} else {
				this.jsonStack.push(localName);
			}
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
				var key = this.unescapeKey(top2);
				top3[key] = value;
			} else if(top2 instanceof Array) {
				top2.push(value);
			} else {
				throw new Error("Unexpected EE top3  instance = " + top3);
			}
			
			this.chars = null;
		}
		
		
		this.jsonStack.pop();
	}
	
	JSONEventHandler.prototype.unescapeKey = function(key){
		var sb = "";
		
		// conflicting names
		if(key.length > 2 && key.charAt(0) == "_" && key.charAt(1) == ".") {
			key = key.substring(2);
		} else {
			// check whether there is an escape character
			var i = 0;
			while(i < key.length) {
				var c = key.charAt(i);
				if(c == "_") {
					var endIndex = key.indexOf(".", i);
					if(endIndex <= 0) {
						throw new Error("Unexpected Escape Key: " + key);
					} else {
						var cp = parseInt(key.substring(i+1, endIndex));
						if(sb.length == 0)  {
							sb += key.substring(0, i);
						}
						sb += String.fromCharCode(cp);
						i += (endIndex-i);
					}
				} else {
					// ok
					if(sb.length != 0) {
						sb += c;
					}
				}
				i++;
			}
		}
		
		if(sb.length == 0)  {
			return key;
		} else {
			return sb;
		}
	}
	

		
	JSONEventHandler.prototype.attribute = function(namespace, localName, value){
	}
	
	
	
	JSONEventHandler.prototype.characters = function(chars){
		console.log("chars: " + chars);
		this.chars = chars;
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


