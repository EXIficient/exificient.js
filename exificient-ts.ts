/*! exificient.js v0.0.3-SNAPSHOT | (c) 2017 Siemens AG | The MIT License (MIT) */

const MAX_EXI_FLOAT_DIGITS = 6; // -1 indicates no rounding

/*******************************************************************************
 * 
 * S H A R E D - P A R T
 * 
 ******************************************************************************/

class StringTableEntry {
    namespaceID: number;
    localNameID: number;
    value: string;
    globalValueID: number;
    localValueID: number;
    constructor(namespaceID: number, localNameID: number, value: string, globalValueID: number, localValueID: number) {
         this.namespaceID = namespaceID;
         this.localNameID = localNameID;
         this.value = value;
         this.globalValueID = globalValueID;
         this.localValueID = localValueID;
    }
}
class StringTable {
    private strings: StringTableEntry[];

    public getNumberOfGlobalStrings() : number {
        return this.strings.length;
    }

    public getNumberOfLocalStrings(namespaceID : number, localNameID : number) : number {
		let cnt = 0;
		for (let i = 0; i < this.strings.length; i++) {
			if (this.strings[i].namespaceID === namespaceID && this.strings[i].localNameID === localNameID) {
				cnt++;
			}
		}

		return cnt;
    }

	public getLocalValue(namespaceID : number, localNameID : number, localValueID : number) : StringTableEntry {
		for (let i = localValueID; i < this.strings.length; i++) {
			if (this.strings[i].namespaceID === namespaceID && this.strings[i].localNameID === localNameID
					&& this.strings[i].localValueID === localValueID) {
				return this.strings[i];
			}
		}

		return null;
	}

	public getGlobalValue(globalValueID : number) : StringTableEntry {
		if (this.strings.length > globalValueID) {
			return this.strings[globalValueID];
		} else {
			return null;
		}
	}

    public addValue(namespaceID : number, localNameID : number, value : string) {
		let globalValueID = this.strings.length;
		let localValueID = this.getNumberOfLocalStrings(namespaceID, localNameID);
		this.strings.push(new StringTableEntry(namespaceID, localNameID, value, globalValueID,
				localValueID));
	}

	public getStringTableEntry(value: string) : StringTableEntry {
		for (var i = 0; i < this.strings.length; i++) {
			if (this.strings[i].value === value) {
				return this.strings[i];
			}
		}

		return null;
	}
}

class QNameContext {
    localName : string;
    uriID : number;
    localNameID : number;

    globalElementGrammarID : number;
}
class NamespaceContext {
    uri : string;

    qnameContext : QNameContext[]
}
class QNames {
    namespaceContext : NamespaceContext[];
}

class Production {
    event: EventType;
    nextGrammarID : number;

    constructor(event: EventType, nextGrammarID : number) {
        this.event = event;
        this.nextGrammarID = nextGrammarID;
    }
}

enum EventType {startElement, characters, endElement, attributeGeneric, startElementGeneric, charactersGeneric}


enum GrammarType {document, fragment, docContent, docEnd, fragmentContent, firstStartTagContent, startTagContent, elementContent, builtInStartTagContent, builtInElementContent}

class Grammar {
    grammarID : number;
    type : GrammarType;
    production : Production[];

    constructor(grammarID: number, type : GrammarType, production : Production[]) {
        this.grammarID = grammarID;
        this.type = type;
        this.production = production;
    }

    public isTypeCastable() : boolean {
        return false; // TODO
    }
    public isNillable() : boolean {
        return false; // TODO
    }
}

class Grs {
    documentGrammarID: number;
    fragmentGrammarID: number;

    grammar: Grammar[];
}

enum SimpleDatatypeType {STRING, FLOAT}


class SimpleDatatype {
    simpleDatatypeID: number;

    type: SimpleDatatypeType;
}

class Grammars {
    qnames: QNames;
    simpleDatatypes : SimpleDatatype[];
    grs : Grs;
}

class AbtractEXICoder {
    grammars: Grammars; // any;
    grammarsCopy: Grammars; // any;
    isStrict : boolean;
    byteAligned : boolean; // default is false

    stringTable : StringTable;
	sharedStrings : string[];

	runtimeGlobalElements : any; // Map
	runtimeGrammars : Grammar[];

    constructor(grammars: Grammars, options: any) {
        this.grammars = grammars;
        // Object.assign(this.grammars, grammars);

        // copy to allow extending grammars and do re-set them
        // TODO use a more elegant method
        if(grammars !== undefined) { // for test.js
            this.grammarsCopy = JSON.parse(JSON.stringify(grammars));
        }
        this.isStrict = true; // TODO
	    this.byteAligned = false; // default is false

        if(options !== undefined) {
            if("byteAligned" in options) {
                this.byteAligned = options["byteAligned"];
            }
        }
    }

    // WARNING: not specified in EXI 1.0 core (is extension)
	public setSharedStrings(sharedStrings : string[]) {
		this.sharedStrings = sharedStrings;
		console.log("Set sharedStrings: " + this.sharedStrings);
	}

 	public init() {
		this.grammars = this.grammarsCopy;
		this.stringTable = new StringTable();
		// console.log("SharedStringsX: " + this.sharedStrings + Object.prototype.toString.call(this.sharedStrings));
		if (this.sharedStrings != null && this.sharedStrings instanceof Array) {
			console.log("SharedStrings: " + this.sharedStrings);
			for (var i = 0; i < this.sharedStrings.length; i++) {
				this.stringTable.addValue(-1, -1, this.sharedStrings[i]);
			}
		}
		// TODO init grammars that have been extended before by learning
		// this.runtimeQNameContexts = [];
		this.runtimeGlobalElements = {};
		this.runtimeGrammars = [];
	}

	 private getUri(namespace : string) : NamespaceContext {
		let namespaceContext; // undefined
		
		for(var i=0; i< this.grammars.qnames.namespaceContext.length; i++) {
			if(this.grammars.qnames.namespaceContext[i].uri === namespace) {
				return this.grammars.qnames.namespaceContext[i];
			}
		}
		
		return namespaceContext;
	}

	// returns the required number of bits for a given number of characteristics
	private getCodeLength(characteristics: number) : number {
		if (characteristics < 0) {
			// error
			throw new Error("Error: Code length for " + characteristics + " not possible");
			// return -1;
		} else if (characteristics < 2) {
			// 0 .. 1
			return 0;
		} else if (characteristics < 3) {
			// 2
			return 1;
		} else if (characteristics < 5) {
			// 3 .. 4
			return 2;
		} else if (characteristics < 9) {
			// 5 .. 8
			return 3;
		} else if (characteristics < 17) {
			// 9 .. 16
			return 4;
		} else if (characteristics < 33) {
			// 17 .. 32
			return 5;
		} else if (characteristics < 35) {
			// 33 .. 64
			return 6;
		} else if (characteristics < 129) {
			// 65 .. 128
			return 7;
		} else if (characteristics < 257) {
			// 129 .. 256
			return 8;
		} else if (characteristics < 513) {
			// 257 .. 512
			return 9;
		} else if (characteristics < 1025) {
			// 513 .. 1024
			return 10;
		} else if (characteristics < 2049) {
			// 1025 .. 2048
			return 11;
		} else if (characteristics < 4097) {
			// 2049 .. 4096
			return 12;
		} else if (characteristics < 8193) {
			// 4097 .. 8192
			return 13;
		} else if (characteristics < 16385) {
			// 8193 .. 16384
			return 14;
		} else if (characteristics < 32769) {
			// 16385 .. 32768
			return 15;
		} else {
			return Math.ceil(Math.log(characteristics) / Math.log(2));
		}
	}
	

	private getCodeLengthForGrammar(grammar: Grammar) {
		if (grammar.type === GrammarType.document || grammar.type === GrammarType.fragment) {
			return 0;
		} else if (grammar.type === GrammarType.docContent) {
			// TODO DT, CM, PI
			return this.getCodeLength(grammar.production.length);
		} else if (grammar.type === GrammarType.docEnd
				|| grammar.type === GrammarType.fragmentContent) {
			// TODO CM, PI
			return 0;
		} else if (grammar.type === GrammarType.firstStartTagContent) {
			if (this.isStrict) {
				return this.getCodeLength(grammar.production.length
						+ ((grammar.isTypeCastable || grammar.isNillable) ? 1
								: 0));
			} else {
				return this.getCodeLength(grammar.production.length + 1);
			}
		} else if (grammar.type === GrammarType.startTagContent || grammar.type === GrammarType.elementContent) {
			// Note: has always second level
			if (this.isStrict) {
				return this.getCodeLength(grammar.production.length);
			} else {
				return this.getCodeLength(grammar.production.length + 1);
			}
		} else if (grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
			// Note: has always second level
			return this.getCodeLength(grammar.production.length + 1);
		} else {
			// unknown grammar type
			throw new Error("Unknown grammar type: " + grammar.type);
			// return -1;
		}
	}

	private get2ndCodeLengthForGrammar(grammar : Grammar) {
		if (grammar.type === GrammarType.builtInStartTagContent) {
			// --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
			// 4 options
			return 2;
		} else if (grammar.type === GrammarType.builtInElementContent) {
			// --> second level EE, SE(*), CH, ER?, [CM?, PI?]
			// 3 options
			return 2;
		} else {
			// unknown/unhandled grammar type
			throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
			// return -1;
		}
	}

    private get2ndEventCode(grammar : Grammar, event : EventType) : number {
		if (grammar.type === GrammarType.builtInStartTagContent) {
			// --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
			// 4 options
			if(event === EventType.endElement) {
				return 0;
			} else  if(event === EventType.attributeGeneric) {
				return 1;
			} else if(event === EventType.startElementGeneric) {
				return 2;
			} else if(event === EventType.charactersGeneric) {
				return 3;
			} else {
				throw new Error("Unknown/unhandled 2nd level event: " + event);
			}
		} else if (grammar.type === GrammarType.builtInElementContent) {
			// --> second level EE, SE(*), CH, ER?, [CM?, PI?]
			// 3 options
			if(event === EventType.endElement) {
				return 0;
			} else  if(event === EventType.startElementGeneric) {
				return 1;
			} else if(event === EventType.charactersGeneric) {
				return 2;
			} else {
				throw new Error("Unknown/unhandled 2nd level event: " + event);
			}
		} else {
			// unknown/unhandled grammar type
			throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
		}
	}

	private get2ndEvent(grammar : Grammar, ec2 : number) : EventType {
		if (grammar.type === GrammarType.builtInStartTagContent) {
			// --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
			// 4 options
			switch(ec2) {
			case 0:
				return EventType.endElement;
			case 1:
				return EventType.attributeGeneric;
			case 2:
				return EventType.startElementGeneric;
			case 3:
				return EventType.charactersGeneric;
			default:
				throw new Error("Unsupported event-code=" + ec2 + "in " + grammar);
			}
		} else if (grammar.type === GrammarType.builtInElementContent) {
			// --> second level EE, SE(*), CH, ER?, [CM?, PI?]
			// 3 options
			switch(ec2) {
			case 0:
				return EventType.endElement;
			case 1:
				return EventType.startElement;
			case 2:
				return EventType.characters;
			default:
				throw new Error("Unsupported event-code="+ ec2 + "in " + grammar);
			}
		} else {
			// unknown/unhandled grammar type
			throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
		}
	}

	private getQNameContext(namespaceContext : NamespaceContext, localName: string) : QNameContext{
		let qnameContext; // undefined by default
		for (var i = 0; i < namespaceContext.qnameContext.length; i++) {
			if (namespaceContext.qnameContext[i].localName === localName) {
				qnameContext = namespaceContext.qnameContext[i];
				return qnameContext;
			}
		}

		return qnameContext;
	}


	private getGlobalStartElement(qnameContext : QNameContext) : Grammar {
		if(qnameContext.globalElementGrammarID !== undefined) {
			// there is a global (static) element grammar
			return this.grammars.grs.grammar[qnameContext.globalElementGrammarID];
			// throw new Error("Todo get global element grammar for : " + qnameContext);
		} else {
			// check runtime global element grammars
			var seGrammar : Grammar; // undefined
			
			let key = qnameContext.uriID + "," + qnameContext.localNameID;
			if(key in this.runtimeGlobalElements) {
				return this.runtimeGlobalElements[key];
			}
			
//			for (var i = 0; i < this.runtimeGlobalElements.length; i++) {
//				// TODO retrieve the right one
//			}
			
//			if(seGrammar === undefined) {
				// create Built-in Element Grammar (ids smaller than zero)
				// var id = ((this.runtimeGrammars.length*2)+1) * (-1);
				let id = (this.runtimeGrammars.length+1) * (-1);
				seGrammar = new Grammar(id, GrammarType.builtInStartTagContent, new Production[0]);
                let p = new Production[0];
                let p0 = new Production(EventType.endElement,-1);
                p.push(p0);
				let elementContent = new Grammar(id-1, GrammarType.builtInElementContent, p);
				elementContent["elementContent"] = elementContent;
				seGrammar["elementContent"] = elementContent;
				
				this.runtimeGlobalElements[key] = seGrammar;
				
				this.runtimeGrammars.push(seGrammar); // e.g., -1
				this.runtimeGrammars.push(elementContent);  // e.g., -2
				
				return seGrammar;
//			}
		}
	}
}

/*******************************************************************************
 * 
 * D E C O D E R - P A R T
 * 
 ******************************************************************************/

class BitInputStream {

	// const
    readonly ERROR_EOF = -3;

	/** array buffer */
	uint8Array : Uint8Array;
	/** Current byte buffer */
	buffer = 0;
	/** Remaining bit capacity in current byte buffer */
	capacity = 0;
	/** byte array next position in array */
	pos = 0;
	/** error flag */
	errn = 0;

    constructor(arrayBuffer: Uint8Array) {
        this.uint8Array = arrayBuffer;
    }

    /**
	 * If buffer is empty, read byte from underlying byte array
	 */
	readBuffer() {
		if (this.capacity === 0) {
			if (this.uint8Array.length > this.pos) {
				this.buffer = this.uint8Array[this.pos++];
				this.capacity = 8; // bits
			} else {
				this.errn = this.ERROR_EOF; // EOF
			}
		}
	}

	/**
	 * Decodes and returns an n-bit unsigned integer.
	 */
	public decodeNBitUnsignedInteger(nbits : number, byteAligned : boolean) : number {
		if(byteAligned !== undefined && byteAligned) {
			while(nbits % 8 !== 0) {
				nbits++;
			}
			
			var bitsRead = 0;
			var result = 0;

			while (bitsRead < nbits) {
				// result = (result << 8) | is.read();
				result += (this.decodeNBitUnsignedInteger(8, byteAligned) << bitsRead);
				bitsRead += 8;
			}
			return result;
			
		} else {
			if (nbits < 0) {
				throw new Error("Error in decodeNBitUnsignedInteger, nbits = " + nbits);
				// this.errn = -1;
				// return -1;
			} else if (nbits === 0) {
				return 0;
			} else {
				// check buffer
				this.readBuffer();

				// read bits
				if (this.errn === 0) {
					if (nbits <= this.capacity) {
						/* read the bits in one step */
						this.capacity = this.capacity - nbits;
						var b = (this.buffer >> this.capacity)
								& (0xff >> (8 - nbits));
						return b;
					} else if (this.capacity === 0 && nbits === 8) {
						/* possible to read direct byte, nothing else to do */
						return this.uint8Array[this.pos];
					} else {
						/* read bits as much as possible */
						var b = this.buffer & (0xff >> (8 - this.capacity));
						nbits = nbits - this.capacity;
						this.capacity = 0;

						/* read whole bytes */
						while (this.errn === 0 && nbits >= 8) {
							this.readBuffer();
							b = (b << 8) | this.buffer;
							nbits = nbits - 8;
							this.capacity = 0;
						}

						/* read the spare bits in the buffer */
						if (this.errn === 0 && nbits > 0) {
							this.readBuffer();
							if (this.errn === 0) {
								b = (b << nbits) | (this.buffer >> (8 - nbits));
								this.capacity = 8 - nbits;
							}
						}

						return b;
					}
				}
			}
		}

		return -1;
	}


	/**
	 * Decode an arbitrary precision non negative integer using a sequence of
	 * octets. The most significant bit of the last octet is set to zero to
	 * indicate sequence termination. Only seven bits per octet are used to
	 * store the integer's value.
	 */
	public decodeUnsignedInteger() : number {
		// 0XXXXXXX ... 1XXXXXXX 1XXXXXXX
		
        var intVal = 0;
        var mul = 1;
        var val = this.decodeNBitUnsignedInteger(8, false);
        while (val >= 128) {
            intVal = intVal + mul * (val - 128);
            val = this.decodeNBitUnsignedInteger(8, false);
            mul = mul * 128;
        }
        intVal = intVal + (mul * val);
        return intVal;
        
		/*
		var result = this.decodeNBitUnsignedInteger(8);

		// < 128: just one byte, optimal case
		// ELSE: multiple bytes...

		if (result >= 128) {
			result = (result & 127);
			var mShift = 7;
			var b;

			do {
				// 1. Read the next octet
				b = this.decodeNBitUnsignedInteger(8);
				// 2. Multiply the value of the unsigned number represented by
				// the 7 least significant
				// bits of the octet by the current multiplier and add the
				// result to the current value.
				result += (b & 127) << mShift;
				// 3. Multiply the multiplier by 128
				mShift += 7;
				// 4. If the most significant bit of the octet was 1, go back to
				// step 1
			} while (b >= 128);
		}
		

		return result;
		*/
	}


	/**
	 * Decode an arbitrary precision integer using a sign bit followed by a
	 * sequence of octets. The most significant bit of the last octet is set to
	 * zero to indicate sequence termination. Only seven bits per octet are used
	 * to store the integer's value.
	 */
	public decodeInteger(byteAligned) : number {
		if (this.decodeNBitUnsignedInteger(1, byteAligned) === 0) {
			// positive
			return this.decodeUnsignedInteger();
		} else {
			// For negative values, the Unsigned Integer holds the
			// magnitude of the value minus 1
			return (-(this.decodeUnsignedInteger() + 1));
		}
	}


	/**
	 * Decode the characters of a string whose length (#code-points) has already
	 * been read.
	 * 
	 * @return The character sequence as a string.
	 */
	public decodeStringOnly(length : number) : string {
		let s = "";
		let i;
		for (i = 0; i < length; i++) {
			var codePoint = this.decodeUnsignedInteger();
			s += String.fromCharCode(codePoint);
		}

		return s;
	}

	/**
	 * Decode a string as a length-prefixed sequence of UCS codepoints, each of
	 * which is encoded as an integer. 
	 * 
	 *  @return The character sequence as a string.
	 */
	public decodeString() : string {
		return this.decodeStringOnly(this.decodeUnsignedInteger());
	}
}


class EXIDecoder extends AbtractEXICoder {
}

class EXIEncoder extends AbtractEXICoder {
}