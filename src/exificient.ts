/*! exificient.js v0.0.6-SNAPSHOT | (c) 2017 Siemens AG | The MIT License (MIT) */

// export * from './exificient'

const MAX_EXI_FLOAT_DIGITS = 6; // -1 indicates no rounding

/*******************************************************************************
 * 
 * S H A R E D - P A R T
 * 
 ******************************************************************************/

enum EventType {
	startDocument, 
	endDocument,
	startElement,
	startElementNS,
	startElementGeneric,
	endElement,
	endElementGeneric,
	characters,
	charactersGeneric,
	attribute,
	attributeGeneric
}


enum GrammarType {
	document,
	fragment,
	docContent,
	docEnd,
	fragmentContent,
	firstStartTagContent,
	startTagContent,
	elementContent,
	builtInStartTagContent,
	builtInElementContent
}

enum DatetimeType {
	/** gYear represents a gregorian calendar year */
	gYear,

	/**
	 * gYearMonth represents a specific gregorian month in a specific gregorian
	 * year
	 */
	gYearMonth,

	/**
	 * A date is an object with year, month, and day properties just like those
	 * of dateTime objects, plus an optional timezone-valued timezone property
	 */
	date,
	/**
	 * dateTime values may be viewed as objects with integer-valued year, month,
	 * day, hour and minute properties, a decimal-valued second property, and a
	 * boolean timezoned property.
	 */
	dateTime,

	/** gMonth is a gregorian month that recurs every year */
	gMonth,

	/**
	 * gMonthDay is a gregorian date that recurs, specifically a day of the year
	 * such as the third of May
	 */
	gMonthDay,

	/**
	 * gDay is a gregorian day that recurs, specifically a day of the month such
	 * as the 5th of the month
	 */
	gDay,

	/** time represents an instant of time that recurs every day */
	time
}


enum SimpleDatatypeType {
	STRING,
	FLOAT,
	UNSIGNED_INTEGER,
	INTEGER,
	BOOLEAN,
	DATETIME,
	LIST
}
// type SimpleDatatypeType = {"STRING", "FLOAT", "UNSIGNED_INTEGER", "INTEGER", "BOOLEAN", "DATETIME"};
/* class SimpleDatatypeType
{
    // boilerplate 
    constructor(public value:string){    
    }

    toString(){
        return this.value;
    }

    // values 
    static STRING = new SimpleDatatypeType("STRING");
	static FLOAT = new SimpleDatatypeType("FLOAT");
	static UNSIGNED_INTEGER = new SimpleDatatypeType("UNSIGNED_INTEGER");
	static INTEGER = new SimpleDatatypeType("INTEGER");
	static BOOLEAN = new SimpleDatatypeType("BOOLEAN");
	static DATETIME = new SimpleDatatypeType("DATETIME");
	static LIST = new SimpleDatatypeType("LIST");
}
*/



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
	strings: StringTableEntry[];
	
	constructor() {
		this.strings = new Array();
	}

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
		for (let i = 0; i < this.strings.length; i++) {
			if (this.strings[i].value === value) {
				return this.strings[i];
			}
		}

		return null;
	}
}

class QNameContext {
	uriID : number;
	localNameID : number;
	localName : string;
    

    globalElementGrammarID : number;
}
class NamespaceContext {
	uri : string;
	uriID : number;

    qnameContext : QNameContext[]
}
class QNames {
	namespaceContext : NamespaceContext[];
	// numberOfQNames : number;
}

class Production {
    event: EventType;
	nextGrammarID : number;
	
	startElementNamespaceID : number;
	startElementLocalNameID : number;
	attributeDatatypeID : number;
	attributeNamespaceID : number;
	attributeLocalNameID : number;
	charactersDatatypeID : number;
	startElementGrammarID : number;

    constructor(event: EventType, nextGrammarID : number) {
        this.event = event;
        this.nextGrammarID = nextGrammarID;
    }
}


class Grammar {
    grammarID : number;
    type : GrammarType;
	production : Production[];
	
	elementContent : Grammar;

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

class SimpleDatatype {
    simpleDatatypeID: number;

	type: SimpleDatatypeType;
	
	listType : SimpleDatatypeType;

	datetimeType : DatetimeType;

	constructor(type: SimpleDatatypeType) {
		this.type = type;
	}
}

/*
class DatetimeDatatype extends SimpleDatatype {
	datetimeType : DatetimeType;
}
*/

// export
class Grammars {
	qnames: QNames;
    simpleDatatypes : SimpleDatatype[];
	grs : Grs;
	numberOfQNames : number[]; // qnames per namespace for resetting qnames
	isSchemaLess : boolean;
	
	public static fromJson(json : any) : Grammars {
		let schemaLess = false;
		if(json == null || json == undefined) {
			// schema-less grammars
			json = JSON.parse('{"qnames":{"namespaceContext":[{"uriID":0,"uri":"","qnameContext":[]},{"uriID":1,"uri":"http://www.w3.org/XML/1998/namespace","qnameContext":[{"uriID":1,"localNameID":0,"localName":"base"},{"uriID":1,"localNameID":1,"localName":"id"},{"uriID":1,"localNameID":2,"localName":"lang"},{"uriID":1,"localNameID":3,"localName":"space"}]},{"uriID":2,"uri":"http://www.w3.org/2001/XMLSchema-instance","qnameContext":[{"uriID":2,"localNameID":0,"localName":"nil"},{"uriID":2,"localNameID":1,"localName":"type"}]}]},"simpleDatatypes":[],"grs":{"documentGrammarID":0,"fragmentGrammarID":3,"grammar":[{"grammarID":"0","type":"document","production":[{"event":"startDocument","nextGrammarID":1}]},{"grammarID":"1","type":"docContent","production":[{"event":"startElementGeneric","nextGrammarID":2}]},{"grammarID":"2","type":"docEnd","production":[{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"3","type":"fragment","production":[{"event":"startDocument","nextGrammarID":4}]},{"grammarID":"4","type":"fragmentContent","production":[{"event":"startElementGeneric","nextGrammarID":4},{"event":"endDocument","nextGrammarID":-1}]}]}}');
			schemaLess = true;
		}

		// copy content as is
		let grammars : Grammars = json;
		grammars.isSchemaLess = schemaLess;
		console.log("SchemaLess: " + grammars.isSchemaLess);

		// fix enum string to numbers
		if(grammars.simpleDatatypes != undefined) {
			for(let i=0; i<grammars.simpleDatatypes.length; i++) {
				// string to enum
				grammars.simpleDatatypes[i].type = SimpleDatatypeType["" + grammars.simpleDatatypes[i].type];
				//  listType
				if(grammars.simpleDatatypes[i].listType != null) {
					grammars.simpleDatatypes[i].listType = SimpleDatatypeType["" + grammars.simpleDatatypes[i].listType];
				}
				// datetimeType
				if(grammars.simpleDatatypes[i].datetimeType != null) {
					grammars.simpleDatatypes[i].datetimeType = DatetimeType["" + grammars.simpleDatatypes[i].datetimeType];
				}
			}
		}


		// fix GrammarType and EventType
		for(let i=0; i<grammars.grs.grammar.length; i++) {
			let gi : Grammar = grammars.grs.grammar[i];
			gi.type = GrammarType["" + gi.type];
			// grammars.grs.grammar[i].type = GrammarType["" + grammars.grs.grammar[i].type];

			let prods : Production[] = grammars.grs.grammar[i].production;
			for(let k=0; k<prods.length; k++) {
				prods[k].event  = EventType["" + prods[k].event];
			}
		}

		return grammars;
	}
}

abstract class AbtractEXICoder {
	grammars: Grammars; // any;
	// numberOfNamespaces : number;
	// numberOfQNames : number[]; // qnames per namespace

    // grammarsCopy: Grammars; // any;
    isStrict : boolean;
    isByteAligned : boolean; // default is false

    stringTable : StringTable;
	sharedStrings : string[];

	runtimeGlobalElements : any; // Map
	runtimeGrammars : Grammar[];

	static DEFAULT_SIMPLE_DATATYPE  : SimpleDatatype = new SimpleDatatype(SimpleDatatypeType.STRING);

    constructor(grammars: Grammars, options: any) {
		this.grammars = grammars;

		// this.grammarsCopy = Object.create(grammars);
        // Object.assign(this.grammars, grammars);

        // copy to allow extending grammars and do re-set them
		// TODO use a more elegant method
		/*
        if(grammars !== undefined) { // for test.js
            this.grammarsCopy = JSON.parse(JSON.stringify(grammars));
		}
		*/
		
 		this.stringTable = new StringTable();

        this.isStrict = true; // TODO
	    this.isByteAligned = false; // default is false

        if(options !== undefined) {
            if("byteAligned" in options) {
                this.isByteAligned = options["byteAligned"];
            }
        }
	}
	

	getGrammar(grammarID : number) : Grammar {
		let nextGrammar;
		if(grammarID >= 0) {
			// static grammars
			nextGrammar = this.grammars.grs.grammar[grammarID];
		} else {
			// runtime grammars
			var rid = (grammarID+1) *(-1);
			nextGrammar = this.runtimeGrammars[rid];
		}
		return nextGrammar;
	}

	getNumberOfQNames(grammars: Grammars) : number {
		let n = 0;
		for(let i=0; i<grammars.qnames.namespaceContext.length; i++) {
			n += grammars.qnames.namespaceContext[i].qnameContext.length;
		}
		
		return n;
	}

    // WARNING: not specified in EXI 1.0 core (is extension)
	public setSharedStrings(sharedStrings : string[]) {
		this.sharedStrings = sharedStrings;
		console.log("Set sharedStrings: " + this.sharedStrings);
	}

 	public init() {
		// this.grammars = this.grammarsCopy;
		// re-init (qnames) 
		if(this.grammars.numberOfQNames === undefined || this.grammars.numberOfQNames == null ) {
			// first time..store information for resetting grammar qnames
			this.grammars.numberOfQNames = new Array();
			for(let i=0; i<this.grammars.qnames.namespaceContext.length; i++) {
				this.grammars.numberOfQNames.push(this.grammars.qnames.namespaceContext[i].qnameContext.length)
			}
		} else {
			// any other time --> reset
			while(this.grammars.numberOfQNames.length > this.grammars.qnames.namespaceContext.length) {
				this.grammars.qnames.namespaceContext.pop();
			}
			for(let i=0; i<this.grammars.qnames.namespaceContext.length; i++) {
				while(this.grammars.qnames.namespaceContext[i].qnameContext.length > this.grammars.numberOfQNames[i]) {
					this.grammars.qnames.namespaceContext[i].qnameContext.pop();
				}
			}
		}

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

	 getUri(namespace : string) : NamespaceContext {
		let namespaceContext; // undefined
		
		for(var i=0; i< this.grammars.qnames.namespaceContext.length; i++) {
			if(this.grammars.qnames.namespaceContext[i].uri === namespace) {
				return this.grammars.qnames.namespaceContext[i];
			}
		}
		
		return namespaceContext;
	}

	// returns the required number of bits for a given number of characteristics
	protected getCodeLength(characteristics: number) : number {
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
	

	getCodeLengthForGrammar(grammar: Grammar) {
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

	get2ndCodeLengthForGrammar(grammar : Grammar) {
		if (grammar.type === GrammarType.builtInStartTagContent) {
			// --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
			// 4 options
			return 2;
		} else if (grammar.type === GrammarType.builtInElementContent) {
			// --> second level SE(*), CH, ER?, [CM?, PI?]
			// 2 options
			return 1;
		} else {
			// unknown/unhandled grammar type
			throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
			// return -1;
		}
	}

    get2ndEventCode(grammar : Grammar, event : EventType) : number {
		if (grammar.type === GrammarType.builtInStartTagContent) {
			// --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
			// 4 options
			if(event === EventType.endElementGeneric) {
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
			// 2 options
			/*if(event === EventType.endElementGeneric) {
				return 0;
			} else */
			if(event === EventType.startElementGeneric) {
				return 0;
			} else if(event === EventType.charactersGeneric) {
				return 1;
			} else {
				throw new Error("Unknown/unhandled 2nd level event: " + event);
			}
		} else {
			// unknown/unhandled grammar type
			throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
		}
	}

	get2ndEvent(grammar : Grammar, ec2 : number) : EventType {
		if (grammar.type === GrammarType.builtInStartTagContent) {
			// --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
			// 4 options
			switch(ec2) {
			case 0:
				return EventType.endElementGeneric;
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
			/*case 0:
				return EventType.endElementGeneric;*/
			case 0:
				return EventType.startElementGeneric;
			case 1:
				return EventType.charactersGeneric;
			default:
				throw new Error("Unsupported event-code="+ ec2 + "in " + grammar);
			}
		} else {
			// unknown/unhandled grammar type
			throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
		}
	}

	getQNameContext(namespaceContext : NamespaceContext, localName: string) : QNameContext{
		let qnameContext : QNameContext = undefined; // undefined by default
		if(namespaceContext.qnameContext != undefined) {
			for (var i = 0; i < namespaceContext.qnameContext.length; i++) {
				if (namespaceContext.qnameContext[i].localName === localName) {
					qnameContext = namespaceContext.qnameContext[i];
					return qnameContext;
				}
			}
		} else {
			// init array
			namespaceContext.qnameContext = new Array(); // QNameContext[]
		}

		return qnameContext;
	}


	getGlobalStartElement(qnameContext : QNameContext) : Grammar {
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
				seGrammar = new Grammar(id, GrammarType.builtInStartTagContent, new Array()); //new Production[0]);
                let p : Array<Production> = new Array(); // Production[0];
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


	learnStartElement(grammar : Grammar, seGrammarID : number, seQname : QNameContext)  {
		// TODO builtIn FragmentGrammar
		if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
			// learn SE
			let ng = new Production(EventType.startElement, grammar.elementContent.grammarID);
			ng.startElementGrammarID = seGrammarID;
			ng.startElementNamespaceID = seQname.uriID;
			ng.startElementLocalNameID = seQname.localNameID;
			grammar.production.splice(0, 0, ng);
			// grammar.production.push(ng);
		}
	}



	learnAttribute(grammar : Grammar, atQname : QNameContext)  {
		// TODO xsi:type is not learned
		if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
			// learn AT
			let ng = new Production(EventType.attribute, grammar.grammarID);
			ng.attributeDatatypeID = undefined; // STRING default
			ng.attributeNamespaceID = atQname.uriID;
			ng.attributeLocalNameID = atQname.localNameID;
			grammar.production.splice(0, 0, ng);
			// grammar.production.push(ng);
		}
	}

	learnCharacters(grammar : Grammar)  {
		if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
			// learn CH
			let ng = new Production(EventType.characters, grammar.elementContent.grammarID);
			ng.charactersDatatypeID = undefined;
			grammar.production.splice(0, 0, ng);
			// grammar.production.push(ng);
		}
	}

	learnEndElement(grammar : Grammar)  {
		if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
			// learn EE
			let ng = new Production(EventType.endElement, grammar.elementContent.grammarID);
			grammar.production.splice(0, 0, ng);
			// grammar.production.push(ng);
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
			
			let bitsRead = 0;
			let result = 0;

			while (bitsRead < nbits) {
				// result = (result << 8) | is.read();
				result += (this.decodeNBitUnsignedInteger(8, false) << bitsRead);
				bitsRead += 8;
			}

			// console.log("\t" + " decodeNBitUnsignedInteger nbits=" + nbits + " --> " + result);
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
					let result : number = 0;
					if (nbits <= this.capacity) {
						/* read the bits in one step */
						this.capacity = this.capacity - nbits;
						result = (this.buffer >> this.capacity)
								& (0xff >> (8 - nbits));
					} else if (this.capacity === 0 && nbits === 8) {
						/* possible to read direct byte, nothing else to do */
						result = this.uint8Array[this.pos];
					} else {
						/* read bits as much as possible */
						result = this.buffer & (0xff >> (8 - this.capacity));
						nbits = nbits - this.capacity;
						this.capacity = 0;

						/* read whole bytes */
						while (this.errn === 0 && nbits >= 8) {
							this.readBuffer();
							result = (result << 8) | this.buffer;
							nbits = nbits - 8;
							this.capacity = 0;
						}

						/* read the spare bits in the buffer */
						if (this.errn === 0 && nbits > 0) {
							this.readBuffer();
							if (this.errn === 0) {
								result = (result << nbits) | (this.buffer >> (8 - nbits));
								this.capacity = 8 - nbits;
							}
						}
					}
					console.log("\t" + " decodeNBitUnsignedInteger --> " + result);
					return result;
				}

				if (this.errn !== 0) {
					throw new Error("InputStream error: EOF?");
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
		
        let intVal = 0;
        let mul = 1;
        let val = this.decodeNBitUnsignedInteger(8, false);
        while (val >= 128) {
            intVal = intVal + mul * (val - 128);
            val = this.decodeNBitUnsignedInteger(8, false);
            mul = mul * 128;
        }
		intVal = intVal + (mul * val);
		console.log("\t" + " decodeUnsignedInteger --> " + intVal);
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
		let i : number;
		if (this.decodeNBitUnsignedInteger(1, byteAligned) === 0) {
			// positive
			i = this.decodeUnsignedInteger();
		} else {
			// For negative values, the Unsigned Integer holds the
			// magnitude of the value minus 1
			i = (-(this.decodeUnsignedInteger() + 1));
		}

		console.log("\t" + " decodeInteger --> " + i);
		return i;
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


// export
class EXIDecoder extends AbtractEXICoder {

	private bitStream : BitInputStream;
	private eventHandler: EventHandler[];

	constructor(grammars: Grammars, options: any) { 
		super(grammars, options);
		this.eventHandler = new Array();
	}

	public registerEventHandler(handler: EventHandler) {
		this.eventHandler.push(handler);
	}

	decodeHeader() : number {
		// TODO cookie
		var distBits = this.bitStream.decodeNBitUnsignedInteger(2, false); // Distinguishing
		// Bits
		if (distBits != 2) {
			throw new Error("Distinguishing Bits are " + distBits);
		}
		var presBit = this.bitStream.decodeNBitUnsignedInteger(1, false); // Presence
		// Bit for EXI Options
		if (presBit != 0) {
			throw new Error("Do not support EXI Options in header");
		}
		// TODO continuos e.g., Final version 16 == 0 1111 0000
		var formatVersion = this.bitStream.decodeNBitUnsignedInteger(5, false); // Format
		// Version
		if (formatVersion != 0) {
			throw new Error("Do not support format version " + formatVersion);
		}

		return 0;
	}


	decodeDatatypeValue(datatype : SimpleDatatype, namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		// Note: qnameContext == null --> CHARACTERS event
		if (datatype.type === SimpleDatatypeType.STRING) {
			this.decodeDatatypeValueString(namespaceID, localNameID, isCharactersEvent);
		} else if (datatype.type === SimpleDatatypeType.UNSIGNED_INTEGER) {
			this.decodeDatatypeValueUnsignedInteger(namespaceID, localNameID, isCharactersEvent);
		} else if (datatype.type === SimpleDatatypeType.INTEGER) {
			this.decodeDatatypeValueInteger(namespaceID, localNameID, isCharactersEvent);
		} else if (datatype.type === SimpleDatatypeType.FLOAT) {
			this.decodeDatatypeValueFloat(namespaceID, localNameID, isCharactersEvent);
		} else if (datatype.type === SimpleDatatypeType.BOOLEAN) {
			this.decodeDatatypeValueBoolean(namespaceID, localNameID, isCharactersEvent);
		} else if (datatype.type === SimpleDatatypeType.DATETIME) {
			this.decodeDatatypeValueDateTime(datatype.datetimeType, namespaceID, localNameID, isCharactersEvent);
		} else if (datatype.type === SimpleDatatypeType.LIST) {
			var sList = "";
			var listLength = this.bitStream.decodeUnsignedInteger();
			console.log("\t" + " LIST with length " + listLength );
			
			for (var i = 0; i < this.eventHandler.length; i++) {
				var eh = this.eventHandler[i];
				if (isCharactersEvent) {
					// eh.characters(sList);
					
					for(var i=0; i < listLength; i++) {
						if (datatype.listType === SimpleDatatypeType.STRING) {
							this.decodeDatatypeValueString(namespaceID, localNameID, true);
							eh.characters(" ");
						} else if (datatype.listType === SimpleDatatypeType.UNSIGNED_INTEGER) {
							this.decodeDatatypeValueUnsignedInteger(namespaceID, localNameID, true);
							eh.characters(" ");
						} else if (datatype.listType === SimpleDatatypeType.INTEGER) {
							this.decodeDatatypeValueInteger(namespaceID, localNameID, true);
							eh.characters(" ");
						} else if (datatype.listType === SimpleDatatypeType.FLOAT) {
							this.decodeDatatypeValueFloat(namespaceID, localNameID, true);
							eh.characters(" ");
						} else if (datatype.listType === SimpleDatatypeType.BOOLEAN) {
							this.decodeDatatypeValueBoolean(namespaceID, localNameID, true);
							eh.characters(" ");
						} else {
							throw new Error("Unsupported list datatype: " + datatype.listType);
						}		
					}
				} else {
					// Note: we need to change the process so that a values is returned instead!!
					throw new Error("Unsupported LIST datatype attribute!!");
					
					// var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
					// var qnameContext = namespaceContext.qnameContext[localNameID];
					// eh.attribute(namespaceContext.uri, qnameContext.localName, sList);
				}
			}
			
		} else {
			throw new Error("Unsupported datatype: " + datatype.type);
		}
	}


	decodeDatatypeValueString(namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		var s;
		var i = this.bitStream.decodeUnsignedInteger();
		// console.log("\t" + " String i: " + i );
		switch (i) {
		case 0:
			/* local value hit */
			var n = this.getCodeLength(this.stringTable
					.getNumberOfLocalStrings(namespaceID, localNameID));
			var localID = this.bitStream.decodeNBitUnsignedInteger(n, this.isByteAligned);
			var lhit = this.stringTable.getLocalValue(namespaceID, localNameID, localID);
			console.log("\t" + " String localValue hit '" + lhit.value
					+ "'");
			s = lhit.value;
			break;
		case 1:
			/* global value hit */
			var n = this.getCodeLength(this.stringTable
					.getNumberOfGlobalStrings());
			var globalID = this.bitStream.decodeNBitUnsignedInteger(n, this.isByteAligned);
			var ghit = this.stringTable.getGlobalValue(globalID);
			console.log("\t" + " String globalValue hit '" + ghit.value
					+ "'");
			s = ghit.value;
			break;
		default:
			// not found in global value (and local value) partition
			// ==> string literal is encoded as a String with the length
			// incremented by two.
			i = i - 2;
			if (i === 0) {
				// empty string
				console.log("\t" + " String is empty string ''");
				s = "";
			} else {
				s = this.bitStream.decodeStringOnly(i);
				console.log("\t" + " String = " + s);
				this.stringTable.addValue(namespaceID, localNameID, s);
			}
			break;
		}
		for (var i = 0; i < this.eventHandler.length; i++) {
			var eh = this.eventHandler[i];
			if (isCharactersEvent) {
				eh.characters(s);
			} else {
				var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
				var qnameContext = namespaceContext.qnameContext[localNameID];
				eh.attribute(namespaceContext.uri, qnameContext.localName, s);
			}
		}
	}

	decodeDatatypeValueUnsignedInteger(namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		let uint = this.bitStream.decodeUnsignedInteger();
		console.log("\t" + " UNSIGNED_INTEGER = " + uint);
		for (let i = 0; i < this.eventHandler.length; i++) {
			var eh = this.eventHandler[i];
			if (isCharactersEvent) {
				eh.characters(uint + "");
			} else {
				var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
				var qnameContext = namespaceContext.qnameContext[localNameID];
				eh.attribute(namespaceContext.uri, qnameContext.localName, uint + "");
			}
		}
	}

	decodeDatatypeValueInteger(namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		var int = this.bitStream.decodeInteger(this.isByteAligned);
		console.log("\t" + " INTEGER = " + int);
		var i;
		for (i = 0; i < this.eventHandler.length; i++) {
			var eh = this.eventHandler[i];
			if (isCharactersEvent) {
				eh.characters(int + "");
			} else {
				var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
				var qnameContext = namespaceContext.qnameContext[localNameID];
				eh.attribute(namespaceContext.uri, qnameContext.localName, int + "");
			}
		}
	}

	decodeDatatypeValueFloat(namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		var mantissa = this.bitStream.decodeInteger(this.isByteAligned);
		var exponent = this.bitStream.decodeInteger(this.isByteAligned);
		console.log("\t" + " float = " + mantissa + "E" + exponent);
		var i;
		for (i = 0; i < this.eventHandler.length; i++) {
			var eh = this.eventHandler[i];
			if (isCharactersEvent) {
				eh.characters(mantissa + "E" + exponent);
			} else {
				var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
				var qnameContext = namespaceContext.qnameContext[localNameID];
				eh.attribute(namespaceContext.uri, qnameContext.localName, mantissa + "E"
						+ exponent);
			}
		}
	}

	decodeDatatypeValueBoolean(namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		var b = this.bitStream.decodeNBitUnsignedInteger(1, this.isByteAligned) === 0 ? false
				: true;
		console.log("\t" + " boolean = " + b);
		for (var i = 0; i < this.eventHandler.length; i++) {
			var eh = this.eventHandler[i];
			if (isCharactersEvent) {
				eh.characters(b + "");
			} else {
				var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
				var qnameContext = namespaceContext.qnameContext[localNameID];
				eh.attribute(namespaceContext.uri, qnameContext.localName, b + "");
			}
		}
	}

	
	decodeDatatypeValueDateTime(datetimeType : DatetimeType, namespaceID : number, localNameID : number, isCharactersEvent : boolean) {
		var year = 0, monthDay = 0, time = 0, fractionalSecs = 0;
		var presenceFractionalSecs = false;
		var sDatetime = "";
		if (datetimeType === DatetimeType.date
		// || datatype.datetimeType == "gYearMonth"
		) {
			// YEAR_OFFSET = 2000
			// NUMBER_BITS_MONTHDAY = 9
			// MONTH_MULTIPLICATOR = 32
			year = this.bitStream.decodeInteger(this.isByteAligned) + 2000;
			sDatetime += year;
			monthDay = this.bitStream.decodeNBitUnsignedInteger(9, this.isByteAligned);
			var month = Math.floor(monthDay / 32);
			if (month < 10) {
				sDatetime += "-0" + month;
			} else {
				sDatetime += "-" + month;
			}
			var day = monthDay - (month * 32);
			sDatetime += "-" + day;
		} else {
			throw new Error("Unsupported datetime type: " + datetimeType);
		}
		var presenceTimezone = this.bitStream.decodeNBitUnsignedInteger(1, this.isByteAligned) === 0 ? false
				: true;
		// console.log("\t" + " presenceTimezone = " + presenceTimezone);
		if (presenceTimezone) {
			var timeZone = this.bitStream.decodeNBitUnsignedInteger(11, this.isByteAligned) - 896;
		}

		console.log("\t" + " datetime = " + sDatetime);
		for (var i = 0; i < this.eventHandler.length; i++) {
			var eh = this.eventHandler[i];
			if (isCharactersEvent) {
				eh.characters(sDatetime);
			} else {
				var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
				var qnameContext = namespaceContext.qnameContext[localNameID];
				eh.attribute(namespaceContext.uri, qnameContext.localName, sDatetime);
			}
		}
	}


	decodeElementContext(grammar : Grammar, elementNamespaceID : number, elementLocalNameID : number) {

		let popStack = false;

		while (!popStack) {

			let codeLength = this.getCodeLengthForGrammar(grammar);
			console.log("\t" + "CodeLength == " + codeLength );
			let ec = this.bitStream.decodeNBitUnsignedInteger(codeLength, this.isByteAligned); //
			console.log("\t" + "EventCode == " + ec );
			
			let event : EventType;
			let prod : Production;
			if(ec >= grammar.production.length) {
				// second level
				let codeLength2 = this.get2ndCodeLengthForGrammar(grammar);
				let ec2 = this.bitStream.decodeNBitUnsignedInteger(codeLength2, this.isByteAligned); //
				event = this.get2ndEvent(grammar, ec2);
				// TODO prod
				// throw new Error("TODO Second event-code level " + grammar.type + ", ec2="+ec2 + " --> " + event);
			} else {
				prod = grammar.production[ec];
				event = prod.event;
			}
			
			
			let nextGrammar : Grammar;
			if(prod !== undefined) {
				nextGrammar = this.getGrammar(prod.nextGrammarID);
			}

			switch (event) {
			case EventType.startDocument:
				console.log("> SD");
				for (let i = 0; i < this.eventHandler.length; i++) {
					let eh : EventHandler = this.eventHandler[i];
					eh.startDocument();
				}
				break;
			case EventType.endDocument:
				console.log("< ED");
				for (let i = 0; i < this.eventHandler.length; i++) {
					let eh : EventHandler = this.eventHandler[i];
					eh.endDocument();
				}
				popStack = true;
				break;
			case EventType.startElement:
			case EventType.startElementNS:
			case EventType.startElementGeneric:
				// console.log("\t" + "StartElement qnameID " +
				// prod.startElementQNameID );
				// console.log("\t" + "StartElement name " +
				// getQNameContext(prod.startElementQNameID).localName);

				let seGrammar : Grammar;
				let qnameContext: QNameContext;
				let namespaceContext : NamespaceContext;
				if(prod !== undefined) {
					// SE and SE_NS
					namespaceContext = this.grammars.qnames.namespaceContext[prod.startElementNamespaceID];
				}
				
				if(event == EventType.startElement) {
					if(prod == undefined) {
						throw new Error("Undefined Production for StartElement");
					}
					seGrammar = this.getGrammar(prod.startElementGrammarID);
					qnameContext = namespaceContext.qnameContext[prod.startElementLocalNameID];
					console.log(">> SE (" + qnameContext.localName + ")");
				} else if (event == EventType.startElementNS) {
					// SE_NS
					// decode local-name
					qnameContext = this.decodeLocalName(namespaceContext);
					console.log(">> SE_NS (" + namespaceContext.uri + ", " + qnameContext.localName + ")");
					seGrammar = this.getGlobalStartElement(qnameContext);
				} else {
					// SE(*)
					qnameContext = this.decodeQName();

					console.log(">> SE_GENERIC (" + qnameContext.uriID + ", " + qnameContext.localName + ")");
					seGrammar = this.getGlobalStartElement(qnameContext);

//					seGrammar = this.getGlobalStartElement(qnameContext);
//					nextGrammar = grammar.elementContent; // TODO check which grammar it is (BuiltIn?)

					if(grammar.type === GrammarType.firstStartTagContent || 
						grammar.type === GrammarType.startTagContent ||
						grammar.type === GrammarType.elementContent ||
						grammar.type === GrammarType.docContent) {
						// schema-informed grammars
						seGrammar = this.getGlobalStartElement(qnameContext);

					} else if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
						seGrammar = this.getGlobalStartElement(qnameContext);
						nextGrammar = grammar.elementContent; // TODO check which grammar it is (BuiltIn?)
						console.log("NextGrammar after SE(*) is " + nextGrammar);
						
						// learn SE
						this.learnStartElement(grammar, seGrammar.grammarID, qnameContext);
					} else {
						throw new Error("Unsupported grammar-type = " + grammar.type + " for SE " +  qnameContext.localName);
					}
				}

				for (let i = 0; i < this.eventHandler.length; i++) {
					let eh : EventHandler = this.eventHandler[i];
					let ns : NamespaceContext = this.grammars.qnames.namespaceContext[qnameContext.uriID]; 
					let uri : string = ns.uri;
					// console.log("inform handler (" + uri + ", " + qnameContext.localName + ")");
					eh.startElement(uri, qnameContext.localName);
				}

				console.log("seGrammar=" + seGrammar+ ", startElementNamespaceID=" + qnameContext.uriID + ", startElementLocalNameID=" + qnameContext.localNameID);
				this.decodeElementContext(seGrammar, qnameContext.uriID, qnameContext.localNameID); // prod.startElementNamespaceID, prod.startElementLocalNameID
				break;
			case EventType.endElement:
			case EventType.endElementGeneric:
				var namespaceContextEE = this.grammars.qnames.namespaceContext[elementNamespaceID];
				var qnameContextEE = namespaceContextEE.qnameContext[elementLocalNameID];
				console.log("<< EE (" + qnameContextEE.localName + ")");
				
				for (let i = 0; i < this.eventHandler.length; i++) {
					let eh : EventHandler = this.eventHandler[i];
					eh.endElement(namespaceContextEE.uri, qnameContextEE.localName);
				}
				if(event === EventType.endElementGeneric) {
					this.learnEndElement(grammar);
				}
				popStack = true;
				break;
			case EventType.attribute:
				// console.log("\t" + "Attribute qnameID " +
				// prod.attributeQNameID );
				// console.log("\t" + "Attribute name " +
				// getQNameContext(prod.attributeQNameID).localName);
				// console.log("\t" + "Attribute datatypeID " +
				// prod.attributeDatatypeID );

				let datatypeA : SimpleDatatype;
				if(prod.attributeDatatypeID === undefined || prod.attributeDatatypeID < 0) {
					// learned AT
					datatypeA = EXIEncoder.DEFAULT_SIMPLE_DATATYPE;
				} else {
					datatypeA = this.grammars.simpleDatatypes[prod.attributeDatatypeID];
				}

				// console.log("\t" + "Attribute datatype " + datatype );
				let namespaceContextA : NamespaceContext = this.grammars.qnames.namespaceContext[prod.attributeNamespaceID];
				let qnameContextA : QNameContext = namespaceContextA.qnameContext[prod.attributeLocalNameID];
				console.log("\t" + "AT (" + qnameContextA.localName + ")");

				this.decodeDatatypeValue(datatypeA, prod.attributeNamespaceID, prod.attributeLocalNameID, false);
				break;
			case EventType.attributeGeneric:
				let atQName = this.decodeQName();
				console.log("\t" + "AT_Generic (" + atQName.localName + ")");
				this.decodeDatatypeValue(EXIDecoder.DEFAULT_SIMPLE_DATATYPE, atQName.uriID, atQName.localNameID, false);
				this.learnAttribute(grammar, atQName);
				nextGrammar = grammar;
				break;
			case EventType.characters:
				// console.log("\t" + "Characters datatypeID " +

				let datatypeC : SimpleDatatype;
				if(prod.charactersDatatypeID === undefined || prod.charactersDatatypeID < 0) {
					// learned AT
					datatypeC = EXIEncoder.DEFAULT_SIMPLE_DATATYPE;
				} else {
					datatypeC = this.grammars.simpleDatatypes[prod.charactersDatatypeID];
				}

				console.log("\t" + "CH");
				this.decodeDatatypeValue(datatypeC, elementNamespaceID, elementLocalNameID, true);
				break;
			case EventType.charactersGeneric:
				// console.log("\t" + "Characters datatype " + datatype );
				console.log("\t" + "CH_Generic");
				this.decodeDatatypeValue(EXIDecoder.DEFAULT_SIMPLE_DATATYPE, elementNamespaceID, elementLocalNameID, true);
				this.learnCharacters(grammar);
				nextGrammar = grammar.elementContent;
				break;
			default:
				console.log("\t" + "Unknown event " + event);
				throw new Error("Unknown event " + event);
				// TODO error!
				// popStack = true;
			}

			// console.log("\t" + "Event NextGrammarId " + prod.nextGrammarID);
			grammar = nextGrammar; // grammars.grs.grammar[prod.nextGrammarID];

		}
	}

	decodeQName() : QNameContext {
		// decode uri & local-name
		return this.decodeLocalName(this.decodeUri());
	}

	decodeUri() : NamespaceContext {
		let n = this.getCodeLength(this.grammars.qnames.namespaceContext.length + 1); // numberEntries+1
		let uriID = this.bitStream.decodeNBitUnsignedInteger(n, this.isByteAligned);
		console.log("n = " + n + ", uriID = " + uriID );

		let namespaceContext;

		if (uriID == 0) {
			// string value was not found
			// ==> zero (0) as an n-nit unsigned integer
			// followed by uri encoded as string
			var uri = this.bitStream.decodeString();
			console.log("decoded uri string = '" + uri + "'");
			// after encoding string value is added to table
			namespaceContext = {"uriID": this.grammars.qnames.namespaceContext.length, "uri": uri};
			this.grammars.qnames.namespaceContext.push(namespaceContext);
		} else {
			// string value found
			// ==> value(i+1) is encoded as n-bit unsigned integer
			namespaceContext = this.grammars.qnames.namespaceContext[uriID-1];
			console.log("found existing uri = '" + namespaceContext.uri + "'");
		}

		return namespaceContext;
	}


	decodeLocalName(namespaceContext : NamespaceContext) : QNameContext {
		let length = this.bitStream.decodeUnsignedInteger();

		let qnameContext;

		if (length > 0) {
			// string value was not found in local partition
			// ==> string literal is encoded as a String
			// with the length of the string incremented by one
			var localName = this.bitStream.decodeStringOnly(length - 1);
			// After encoding the string value, it is added to the string table
			// partition and assigned the next available compact identifier.
			qnameContext = {"uriID": namespaceContext.uriID, "localNameID": namespaceContext.qnameContext.length, "localName": localName};
			console.log("create new runtime qnameContext = '" + qnameContext + "'");
			namespaceContext.qnameContext.push(qnameContext);
		} else {
			// string value found in local partition
			// ==> string value is represented as zero (0) encoded as an
			// Unsigned Integer
			// followed by an the compact identifier of the string value as an
			// n-bit unsigned integer
			// n is log2 m and m is the number of entries in the string table
			// partition
			console.log("namespaceContext.qnameContext = '" + namespaceContext.qnameContext + "'");
			var n = this.getCodeLength(namespaceContext.qnameContext.length);
			var localNameID = this.bitStream.decodeNBitUnsignedInteger(n, this.isByteAligned);
			console.log("decoded localName id = " + localNameID + " of existing localName " + namespaceContext.qnameContext[localNameID].localName);
			qnameContext = namespaceContext.qnameContext[localNameID];
		}
		
		return qnameContext;
	}

	public decode(uint8Array : Uint8Array) {
		this.init();
		
		this.bitStream = new BitInputStream(uint8Array);

		console.log("JSON Grammars: " + this.grammars);
		console.log("\t" + "Number of NamespaceContexts"
				+ Object.keys(this.grammars.qnames.namespaceContext).length);
		// console.log("\t" + grammars.uris);

		console.log("\t" + "numberOfUris:  " + this.grammars.qnames.namespaceContext.length);
		console.log("\t" + "numberOfQNames:" + this.getNumberOfQNames(this.grammars));

		console.log("EXI: " + uint8Array + " len=" + uint8Array.byteLength);

		
		
		// process header
		var errn = this.decodeHeader();

		if (errn === 0) {
			// process EXI body

			// Document grammar
			console.log("\t" + "number of grammars: "
					+ this.grammars.grs.grammar.length);
			console.log("\t" + "Document grammar ID: "
					+ this.grammars.grs.documentGrammarID);
			var docGr = this.getGrammar(this.grammars.grs.documentGrammarID);

			this.decodeElementContext(docGr, -1, -1);
		}

		return errn;
	}

}

// export
abstract class EventHandler {
	abstract startDocument();
	abstract endDocument();
	abstract startElement(namespace : string, localName : string);
	abstract endElement(namespace : string, localName : string);
	abstract characters(chars : string);
	abstract attribute(namespace : string, localName : string, value : string);
}

/* allows to retrieve XML by registering it as decoder handler */

class PfxMapping {
	pfx: string;
	namespace: string;
	constructor(pfx: string, namespace: string) {
		this.pfx = pfx;
		this.namespace = namespace;
	}
}

/*
class Stack<T> {
	_store: T[] = [];
	push(val: T) {
		this._store.push(val);
	}
	pop(): T | undefined {
		return this._store.pop();
	}
	peek() : T  | undefined {
		return this._store[this._store.length-1];
	}
	clear() {
		this._store = [];
	}
}
*/

class XMLEventHandler extends EventHandler {

	xml : string;

	seOpen : boolean;

	// xmlDecls : PfxMapping[];//  {}; // : [string, string]; // namespace --> prefix
	// xmlDecls : XMLDeclarations[];
	xmlDecls : [string, string];

	nsDecls : Array<PfxMapping>[];

	constructor() {
		super();
		this.nsDecls = []; // new Array<PfxMapping>();
		// let people = new Map<string, Person>();
		// let map = new Map<string, string>(); 
		// this.xmlDecls = {}; // null; //  new Array(<string, string>); // new Map(); // new Array();
		// this.xmlDecls = new Array();
	}
	
	pushPfx() {
		this.nsDecls.push([]);
	}
	addPfx(namespace: string) : string {
		let pfx = "ns" + this.getPfxLength();
		let pm : PfxMapping = new PfxMapping(pfx, namespace);
		this.nsDecls[this.nsDecls.length-1].push(pm);
		return pfx;
	}
	popPfx(): Array<PfxMapping> {
		return this.nsDecls.pop();
	}
	clearPfx() {
		this.nsDecls = [];
	}
	getPfx(namespace : string) : string | undefined {
		let pfx = undefined;

		if(namespace === undefined || namespace.length === 0) {
			// default
			pfx = "";
		} else {
			// check if declared already
			for(let i=this.nsDecls.length-1; i>= 0; i--) {
				let pfxs : PfxMapping[] = this.nsDecls[i];
				for(let k=0; k<pfxs.length; k++) {
					let pm : PfxMapping = pfxs[k];
					if(pm.namespace == namespace) {
						return pm.pfx;
					}
				}
			}

			// none found --> undefined

			/*
			if(this.xmlDecls[namespace] != null) {
				// get existing prefix
				// TODO assumption declared already (Note: not always the case for nested elements!!!)
				pfx = this.xmlDecls[namespace];
			} else {
				// create new prefix
				pfx = "ns" + this.xmlDecls.length;
				this.xmlDecls[namespace]  = pfx;
			}
			*/
		}

		return pfx;
	}
	getPfxLength() : number {
		let n : number = 0;
		for(let i=this.nsDecls.length-1; i>= 0; i--) {
			let pfxs : PfxMapping[] = this.nsDecls[i];
			n += pfxs.length;
		}
		return n;
	}


	getXML() : string {
		return this.xml;
	}
	/*
	getPrefix(namespace : string) : string {
		// TODO more accurate namespace/prefix handling
		let pfx = "";
		if(namespace === undefined || namespace.length === 0) {
			// do nothing
		} else {
			// check if declared already
			if(this.xmlDecls[namespace] != null) {
				// get existing prefix
				// TODO assumption declared already (Note: not always the case for nested elements!!!)
				pfx = this.xmlDecls[namespace];
			} else {
				// create new prefix
				pfx = "ns" + this.xmlDecls.length;
				this.xmlDecls[namespace]  = pfx;
			}
		}
		
		return pfx;
	}
	*/



	startDocument() {
		this.xml = "";
		this.xmlDecls = [undefined, undefined]; // {"cnt": 0, "decls": {}};
		this.clearPfx();
		this.seOpen = false;
	}
	endDocument() {
	}
	startElement(namespace : string, localName : string) {
		this.pushPfx();
		if (this.seOpen) {
			this.xml += ">";
		}

		// old version
		// var pfx = this.getPrefix(namespace);
		// new version
		let printNS = false;
		let pfx = this.getPfx(namespace);
		if(pfx == undefined) {
			pfx = this.addPfx(namespace);
			printNS = true;
		}
		

		if(pfx.length > 0) {
			this.xml += "<" + pfx + ":" + localName;
		} else {
			this.xml += "<" + localName;
		}
		this.seOpen = true;
		
		if(pfx.length > 0 && printNS) {
			this.xml += " xmlns:" + pfx + "='"  + namespace + "'";
		}
	}
	endElement(namespace : string, localName : string) {
		if (this.seOpen) {
			this.xml += ">";
			this.seOpen = false;
		}
		
		// var pfx = this.getPrefix(namespace);
		var pfx = this.getPfx(namespace);
		if(pfx.length > 0) {
			this.xml += "</" + pfx + ":" + localName + ">";
		} else {
			this.xml += "</" + localName + ">";
		}
		this.popPfx();
	}
	characters(chars : string) {
		if (this.seOpen) {
			this.xml += ">";
			this.seOpen = false;
		}
		this.xml += chars;
	}
	attribute(namespace : string, localName : string, value : string) {
		this.xml += " " + localName + "=\"" + value + "\"";
	}
}


/*******************************************************************************
 * 
 * E N C O D E R - P A R T
 * 
 ******************************************************************************/

 
class BitOutputStream {
	/** array buffer */
	uint8Array = new Uint8Array(8); // initial size
	/** Current byte buffer */
	buffer = 0;
	/** Remaining bit capacity in current byte buffer */
	capacity = 8;
	/** Fully-written bytes */
	len = 0;
	/** error flag */
	errn = 0;

	/* internal: increases buffer if array is not sufficient anymore */
	checkBuffer() {
		if (this.len >= this.uint8Array.length) {
			// double size
			let uint8ArrayNew = new Uint8Array(this.uint8Array.length * 2);
			// copy (TODO is there a better way?)
			for (var i = 0; i < this.uint8Array.length; i++) {
				uint8ArrayNew[i] = this.uint8Array[i];
			}
			this.uint8Array = uint8ArrayNew;
		}
	}

	getUint8Array() : Uint8Array {
		return this.uint8Array;
	}
	getUint8ArrayLength() : number {
		return this.len;
	}

	/**
	 * If there are some unwritten bits, pad them if necessary and write them
	 * out.
	 */
	align() {
		if (this.capacity < 8) {
			this.checkBuffer();
			this.uint8Array[this.len] = this.buffer << this.capacity;
			this.capacity = 8;
			this.buffer = 0;
			this.len++;
		}
	}

	/**
	 * Encode n-bit unsigned integer. The n least significant bits of parameter
	 * b starting with the most significant, i.e. from left to right.
	 */
	encodeNBitUnsignedInteger(b : number, n : number, byteAligned : boolean) {		
		if(byteAligned !== undefined && byteAligned) {
			while(n % 8 !== 0) {
				n++;
			}
			
			// TODO to check why we can't combine bit and byteAligned
			if (n === 0) {
				// 0 bytes
			} else if (n < 9) {
				// 1 byte
				this.encodeNBitUnsignedInteger(b & 0xff, 8, false);
			} else if (n < 17) {
				// 2 bytes
				this.encodeNBitUnsignedInteger(b & 0x00ff, 8, false);
				this.encodeNBitUnsignedInteger((b & 0xff00) >> 8, 8, false);
			} else if (n < 25) {
				// 3 bytes
				this.encodeNBitUnsignedInteger(b & 0x0000ff, 8, false);
				this.encodeNBitUnsignedInteger((b & 0x00ff00) >> 8, 8, false);
				this.encodeNBitUnsignedInteger((b & 0xff0000) >> 16, 8, false);
			} else if (n < 33) {
				// 4 bytes
				this.encodeNBitUnsignedInteger(b & 0x000000ff, 8, false);
				this.encodeNBitUnsignedInteger((b & 0x0000ff00) >> 8, 8, false);
				this.encodeNBitUnsignedInteger((b & 0x00ff0000) >> 16, 8, false);
				this.encodeNBitUnsignedInteger((b & 0xff000000) >> 24, 8, false);
			} else {
				throw new Error("nbit = " + n + " exceeds supported value range");
			}
			
		} else {
			
			if (n === 0) {
				// nothing to write
			} else if (n <= this.capacity) {
				// all bits fit into the current buffer
				this.buffer = (this.buffer << n) | (b & (0xff >> (8 - n)));
				this.capacity -= n;
				if (this.capacity === 0) {
					this.checkBuffer();
					this.uint8Array[this.len] = this.buffer;
					this.capacity = 8;
					this.len++;
				}
			} else {
				// fill as many bits into buffer as possible
				this.buffer = (this.buffer << this.capacity)
						| ((b >>> (n - this.capacity)) & (0xff >> (8 - this.capacity)));
				n -= this.capacity;
				this.checkBuffer();
				this.uint8Array[this.len] = this.buffer;
				this.len++;

				// possibly write whole bytes
				while (n >= 8) {
					n -= 8;
					this.checkBuffer();
					this.uint8Array[this.len] = b >>> n;
					this.len++;
				}

				// put the rest of bits into the buffer
				this.buffer = b; // Note: the high bits will be shifted out
				// during
				// further filling
				this.capacity = 8 - n;
			}
		}
	}

	/**
	 * Returns the least number of 7 bit-blocks that is needed to represent the
	 * int <param>n</param>. Returns 1 if <param>n</param> is 0.
	 * 
	 * @param n
	 *            integer value
	 * 
	 */
	numberOf7BitBlocksToRepresent(n: number) : number {
		/* assert (n >= 0); */
		/* 7 bits */
		if (n < 128) {
			return 1;
		}
		/* 14 bits */
		else if (n < 16384) {
			return 2;
		}
		/* 21 bits */
		else if (n < 2097152) {
			return 3;
		}
		/* 28 bits */
		else if (n < 268435456) {
			return 4;
		}
		/* 35 bits */
		else if (n < 0x800000000) {
			return 5;
		}
		/* 42 bits */
		else if (n < 0x40000000000) {
			return 6;
		}
		/* 49 bits */
		else if (n < 0x2000000000000) {
			return 7;
		}
		/* 56 bits */
		else if (n < 0x100000000000000) {
			return 8;
		}
		/* 63 bits */
		else if (n < 0x8000000000000000) {
			return 9;
		}
		/* 70 bits */
		else {
			// long, 64 bits
			return 10;
		}
	}
	
	shiftRight(n : number, bits : number) {
		for(let i=0; i<bits; i++) {
			n /= 2;
		}
		n = Math.floor(n);
		return n;
	}

	/**
	 * Encode an arbitrary precision non negative integer using a sequence of
	 * octets. The most significant bit of the last octet is set to zero to
	 * indicate sequence termination. Only seven bits per octet are used to
	 * store the integer's value.
	 */
	 // Note: JavaScript shift operator works till 32 bits only!!
	encodeUnsignedInteger(n : number, byteAligned : boolean) {
		if (n < 128) {
			// write value as is
			this.encodeNBitUnsignedInteger(n, 8, byteAligned);
		} else {
			var n7BitBlocks = this.numberOf7BitBlocksToRepresent(n);

			switch (n7BitBlocks) {
			case 10:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				// n = n >>> 7;
				n = this.shiftRight(n, 7);
			case 9:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				// n = n >>> 7;
				n = this.shiftRight(n, 7);
			case 8:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				// n = n >>> 7;
				n = this.shiftRight(n, 7);
			case 7:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				// n = n >>> 7;
				n = this.shiftRight(n, 7);
			case 6:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				// n = n >>> 7;
				n = this.shiftRight(n, 7);
			case 5:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				// n = n >>> 7;
				n = this.shiftRight(n, 7);
			case 4:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				n = n >>> 7;
			case 3:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				n = n >>> 7;
			case 2:
				this.encodeNBitUnsignedInteger(128 | n, 8, byteAligned);
				n = n >>> 7;
			case 1:
				// 0 .. 7 (last byte)
				this.encodeNBitUnsignedInteger(0 | n, 8, byteAligned);
			}
		}
	}

	/**
	 * Encode an arbitrary precision integer using a sign bit followed by a
	 * sequence of octets. The most significant bit of the last octet is set to
	 * zero to indicate sequence termination. Only seven bits per octet are used
	 * to store the integer's value.
	 */
	encodeInteger(n : number, byteAligned : boolean) {
		// signalize sign
		if (n < 0) {
			this.encodeNBitUnsignedInteger(1, 1, byteAligned);
			// For negative values, the Unsigned Integer holds the
			// magnitude of the value minus 1
			this.encodeUnsignedInteger((-n) - 1, byteAligned);
		} else {
			this.encodeNBitUnsignedInteger(0, 1, byteAligned);
			this.encodeUnsignedInteger(n, byteAligned);
		}
	}

	/**
	 * Encode a string as a sequence of codepoints, each of which is encoded as
	 * an unsigned integer.
	 */
	encodeStringOnly(str : string, byteAligned : boolean) {
		// str.charCodeAt(0); // Return the Unicode of character in a string

		for (var i = 0; i < str.length; i++) {
			var cp = str.charCodeAt(i);
			this.encodeUnsignedInteger(cp, byteAligned);
			console.log("char encoded " + cp);
		}
	}
}


class ElementContextEntry {
	namespaceID : number;
	localNameID : number;
	grammar : Grammar;
	constructor(namespaceID : number, localNameID : number, grammar) { 
		this.namespaceID = namespaceID;
		this.localNameID = localNameID;
		this.grammar = grammar;
	}
}

class EXIFloat {
	exponent = 0;
	mantissa = 0
};

class DateTimeValue {
	year : number;
	monthDay : number;
	error = 0;
}

// export
class EXIEncoder extends AbtractEXICoder {

	bitStream : BitOutputStream;
	elementContext : ElementContextEntry [];

	constructor(grammars: Grammars, options: any) { 
		super(grammars, options);
	}


	// 	/*
	// 	 * should allow parsing XML string into an XML document in all major
	// 	 * browsers, including Internet Explorer 6 and Java Nashorn.
	// 	 */
	// 	encodeXmlText(textXML : string) {
	// 	let xmlDoc : XMLDocument;
	// 	if (typeof window !== 'undefined' && typeof window.DOMParser != "undefined") {
	// 		var parseXml = function(xmlStr) {
	// 			return (new window.DOMParser()).parseFromString(xmlStr,
	// 					"text/xml");
	// 		};
	// 		xmlDoc = parseXml(textXML);
	// 	} else if (typeof window !== 'undefined' && typeof window.ActiveXObject != "undefined"
	// 			&& new window.ActiveXObject("Microsoft.XMLDOM")) {
	// 		var parseXml = function(xmlStr) {
	// 			var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
	// 			xmlDoc.async = "false";
	// 			xmlDoc.loadXML(xmlStr);
	// 			return xmlDoc;
	// 		};
	// 		xmlDoc = parseXml(textXML);
	// 	} else if (typeof javax.xml.parsers.DocumentBuilderFactory != "undefined" ) {
    //         var factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
    //         factory.setNamespaceAware(true);
    //         var documentBuilder = factory.newDocumentBuilder();
    //         xmlDoc = documentBuilder.parse(new org.xml.sax.InputSource(new java.io.StringReader(textXML)));
    //         /* return doc; */
	// 	} else {
	// 		throw new Error("No XML parser found");
	// 	}
		
	// 	this.encodeXmlDocument(xmlDoc);
	// }

	encodeXmlDocument(xmlDoc : XMLDocument) {		
		this.startDocument();
		// documentElement always represents the root node
		this.processXMLElement(xmlDoc.documentElement);
		this.endDocument();
	}

	encodeHeader() : number {
		// TODO cookie

		// Distinguishing Bits 10
		this.bitStream.encodeNBitUnsignedInteger(2, 2, false);
		// Presence Bit for EXI Options 0
		this.bitStream.encodeNBitUnsignedInteger(0, 1, false);
		// EXI Format Version 0-0000
		this.bitStream.encodeNBitUnsignedInteger(0, 1, false); // preview false
		this.bitStream.encodeNBitUnsignedInteger(0, 4, false);

		return 0;
	}

	processXMLElement(el: Element) {
		// console.log("SE " + el.nodeName);
		this.startElement(el.namespaceURI, el.localName);

		if (el.attributes != null && el.attributes.length > 0) {
			if (el.attributes.length > 1) {
				if(this.grammars.isSchemaLess != undefined && this.grammars.isSchemaLess) {
					console.log("Do not sort attributes in schema-less mode");
					for (let i = 0; i < el.attributes.length; i++) {
						var ati = el.attributes.item(i);
						this.attribute(ati.namespaceURI, ati.localName, ati.nodeValue);
					}
				} else {
					// sorting
					console.log("Sort attributes in schema-informed mode");
					let atts = [];
					for (let i = 0; i < el.attributes.length; i++) {
						// console.log(" AT " + el.attributes[i].nodeName + " == " +
						// el.attributes[i].nodeValue);
						let at = el.attributes.item(i);
						atts.push(at.localName);

					}
					// sort according localName
					// TODO in case also for namespace URI
					atts.sort();
					// write in sorted order
					for (let i = 0; i < atts.length; i++) {
						let at = el.getAttributeNode(atts[i]);
						if (at != null) {
							this.attribute(at.namespaceURI, at.localName,
									at.nodeValue);
						} else {
							// when does this happen, only for schemaLocations and
							// such?
						}
					}
				}


			} else {
				// console.log("AT length: " + el.attributes.length);
				// console.log("AT all: " + el.attributes);
				// console.log("AT1 " + el.attributes.item(0));
				var at1 = el.attributes.item(0);
				// console.log("AT2 " + el.attributes[0]);
				this.attribute(at1.namespaceURI, at1.localName, at1.nodeValue);
			}
		}

		let childNodes = el.childNodes;
		if(childNodes != null) {
			// console.log("\tchildNodes.length" + childNodes.length);
			for (let i = 0; i < childNodes.length; i++) {
				// Attributes (type 1)
				// Text (type 3)
				let cn = childNodes.item(i);
				if (cn.nodeType === 3) {
					let text = cn.nodeValue;
					text = text.trim();
					if (text.length > 0) {
						// console.log(" Text '" + text + "'");
						this.characters(text);
					}
				}

				// Process only element nodes (type 1) further
				if (cn.nodeType === 1) {
					this.processXMLElement(<Element>cn);
					// console.log(childNodes[i].childNodes[0].nodeValue);
				}
			}
		}

		// console.log("EE " + el.nodeName);
		this.endElement();
	}

	getUint8Array() : Uint8Array {
		return this.bitStream.getUint8Array();
	}
	getUint8ArrayLength() : number {
		return this.bitStream.getUint8ArrayLength();
	}

	startDocument() {
		this.init();
		this.bitStream = new BitOutputStream();
		this.elementContext = [];
		console.log("numberOfQNames SD: " + this.getNumberOfQNames(this.grammars));
		// console.log("Grammar SD: " + JSON.stringify(this.grammars));
		
		this.encodeHeader();
		// set grammar position et cetera

		// Document grammar
		console
				.log("\t" + "number of grammars: "
						+ this.grammars.grs.grammar.length);
		console.log("\t" + "Document grammar ID: "
				+ this.grammars.grs.documentGrammarID);
		let docGr = this.getGrammar(this.grammars.grs.documentGrammarID);

		let ec = -1;
		let prod : Production;
		for (var i = 0; ec === -1 && i < docGr.production.length; i++) {
			prod = docGr.production[i];
			// if (prod.event === EventType["startDocument"] ) {
			// 	ec = i;
			// }
			// } else
			if (prod.event === EventType.startDocument) {
				ec = i;
			}
		}
		if (ec != -1) {
			// console.log("\t" + "Event Code == " + ec );
			var codeLength = this.getCodeLengthForGrammar(docGr);
			this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);

			let nextGrammar = this.getGrammar(prod.nextGrammarID);
			this.elementContext.push(new ElementContextEntry(-1, -1, nextGrammar));
		} else {
			throw new Error("No startDocument event found");
		}
	}

	endDocument() {
		let ec = -1;
		let prod : Production;
		let grammar : Grammar= this.elementContext[this.elementContext.length - 1].grammar;
		for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
			prod = grammar.production[i];
			if (prod.event === EventType.endDocument) {
				ec = i;
			}
		}
		if (ec != -1) {
			// console.log("\t" + "Event Code == " + ec );
			let codeLength = this.getCodeLengthForGrammar(grammar);
			this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);

			// pop element stack
			this.elementContext.pop();
		} else {
			throw new Error("No endDocument event found");
		}

		if (this.elementContext.length != 0) {
			throw new Error("Element context not balanced");
		}

		this.bitStream.align();

		console.log("numberOfQNames ED: " + this.getNumberOfQNames(this.grammars));
		// console.log("Grammar ED: " + JSON.stringify(this.grammars));
	}

	startElement(namespace : string, localName : string) {
		if (namespace === null) {
			namespace = "";
		}
		console.log("SE {" + namespace + "}" + localName);

		let isSE : boolean = false;
		let isSE_NS : boolean = false;
		let isSE_GENERIC : boolean = false;
		let namespaceContext : NamespaceContext;
		
		let ec = -1;
		let prod : Production;
		let grammar : Grammar = this.elementContext[this.elementContext.length - 1].grammar;
		let qnameContext : QNameContext;
		for (let i = 0; ec === -1 && i < grammar.production.length; i++) {
			prod = grammar.production[i];
			// console.log("\t" + "Prod " + i + prod.event);
			if (prod.event === EventType.startElement) {
				namespaceContext = this.grammars.qnames.namespaceContext[prod.startElementNamespaceID];
				qnameContext = namespaceContext.qnameContext[prod.startElementLocalNameID];
				if (qnameContext.localName === localName && namespaceContext.uri === namespace) {
					ec = i;
					isSE = true;
				}
			} else if (prod.event === EventType.startElementNS) {
				namespaceContext = this.grammars.qnames.namespaceContext[prod.startElementNamespaceID];
				if (namespaceContext.uri === namespace) {
					ec = i;
					isSE_NS = true;
				}
			} else if (prod.event === EventType.startElementGeneric) {
				ec = i;
				isSE_GENERIC = true;
			}
		}
		if(ec != -1) {
			// event-code found
			// console.log("\t" + "Event Code == " + ec );
			let codeLength = this.getCodeLengthForGrammar(grammar);
			this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
			console.log("SE encoded " + ec + " in " + codeLength);
			
			let startElementGrammar : Grammar;
			
			if (isSE || isSE_NS || isSE_GENERIC) {
				// ok
			// } else if (isSE_GENERIC) {
			// 	throw new Error("TODO StartElement Generic not implemented yet for " + localName);
			} else {
				throw new Error("No startElement event found for " + localName);
			}
			
			// update current element context
			let nextGrammar : Grammar = this.getGrammar(prod.nextGrammarID);
			this.elementContext[this.elementContext.length - 1].grammar = nextGrammar;
			
			console.log("NextGrammar after SE/SE_NS " + localName + " is " + nextGrammar);
			
			// push new element context
			if (isSE) {
				// SE(uri:localname)
				startElementGrammar = this.getGrammar(prod.startElementGrammarID);
			} else if (isSE_NS) {
				// SE(uri:*)
				// encode local-name
				qnameContext = this.encodeLocalName(namespaceContext, localName);
				startElementGrammar = this.getGlobalStartElement(qnameContext);
			} else if(isSE_GENERIC) {
				// SE(*:*)
				// encode uri & local-name
				namespaceContext = this.encodeUri(namespace);
				qnameContext = this.encodeLocalName(namespaceContext, localName);
				startElementGrammar = this.getGlobalStartElement(qnameContext);
			}
			this.elementContext.push(new ElementContextEntry(
					namespaceContext.uriID, qnameContext.localNameID, startElementGrammar));
//			this.elementContext.push(new ElementContextEntry(
//			prod.startElementNamespaceID, prod.startElementLocalNameID, startElementGrammar));
			
		} else {
			// NO event-code found
			if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
				// 1st level
				let codeLength1 = this.getCodeLengthForGrammar(grammar);
				this.bitStream.encodeNBitUnsignedInteger(grammar.production.length, codeLength1, this.isByteAligned);
				console.log("SE1 encoded " + grammar.production.length + " in " + codeLength1);
				// 2nd level
				let codeLength2 = this.get2ndCodeLengthForGrammar(grammar);
				let ec2 = this.get2ndEventCode(grammar, EventType.startElementGeneric);
				this.bitStream.encodeNBitUnsignedInteger(ec2, codeLength2, this.isByteAligned); //2 in 2 bits
				console.log("SE2 encoded " + ec2 + " in " + codeLength2);
				
				// encode qname
				let qnameContext = this.encodeQName(namespace, localName);
				console.log("SE qname encoded");

				let startElementGrammar = this.getGlobalStartElement(qnameContext);
				
				// learn SE
				this.learnStartElement(grammar, startElementGrammar.grammarID, qnameContext);
				
				// update current element context
				this.elementContext[this.elementContext.length - 1].grammar = grammar.elementContent;
				console.log("NextGrammar after SE_Generic_Undefined " + localName + " is " + this.elementContext[this.elementContext.length - 1].grammar);
				
				this.elementContext.push(new ElementContextEntry(
						qnameContext.uriID, qnameContext.localNameID, startElementGrammar));
				
			// } else if(grammar.type === GrammarType.builtInElementContent) {
			// 	throw new Error("TODO SE elementContent grammar. grammar.type = " + grammar.type);
			} else {
				throw new Error("No startElement event found for " + localName + ". grammar.type = " + grammar.type);
			}
		}
	}
	
	encodeQName(namespace : string, localName : string) : QNameContext {
		let namespaceContext = this.encodeUri(namespace);
		
		return this.encodeLocalName(namespaceContext, localName);
	}
	
	encodeUri(namespace : string) : NamespaceContext {
		let n = this.getCodeLength(this.grammars.qnames.namespaceContext.length + 1); // numberEntries+1
		
		let namespaceContext = this.getUri(namespace);

		if (namespaceContext === undefined) {
			// uri string value was not found
			// ==> zero (0) as an n-nit unsigned integer
			// followed by uri encoded as string
			this.bitStream.encodeNBitUnsignedInteger(0, n, this.isByteAligned);
			console.log("Uri miss encoded " + 0 + " in " + n);
			this.bitStream.encodeStringOnly(namespace, this.isByteAligned);
			// after encoding string value is added to table
			namespaceContext = new NamespaceContext();
			namespaceContext.uriID = this.grammars.qnames.namespaceContext.length;
			namespaceContext.uri = namespace;
			// namespaceContext = {"uriID": this.grammars.qnames.namespaceContext.length, "uri": namespace};
			this.grammars.qnames.namespaceContext.push(namespaceContext);
		} else {
			// string value found
			// ==> value(i+1) is encoded as n-bit unsigned integer
			this.bitStream.encodeNBitUnsignedInteger(namespaceContext.uriID + 1, n, this.isByteAligned);
			console.log("Uri hit encoded " + (namespaceContext.uriID + 1) + " in " + n);
		}
		
		return namespaceContext;
	}
	
	encodeLocalName(namespaceContext : NamespaceContext, localName : string) : QNameContext{
		let qnameContext = this.getQNameContext(namespaceContext, localName);
		if(qnameContext === undefined) {
			// string value was not found in local partition
			// ==> string literal is encoded as a String
			// with the length of the string incremented by one
			this.bitStream.encodeUnsignedInteger(localName.length + 1, this.isByteAligned);
			console.log("localName miss encoded " + (localName.length + 1) );
			this.bitStream.encodeStringOnly(localName, this.isByteAligned);
			// After encoding the string value, it is added to the string
			// table partition and assigned the next available compact
			// identifier
			// TODO add to qname context
			// qnc = ruc.addQNameContext(localName);
			qnameContext = new QNameContext();
			qnameContext.uriID = namespaceContext.uriID;
			qnameContext.localNameID = namespaceContext.qnameContext.length;
			qnameContext.localName = localName;
			// qnameContext = {"uriID": namespaceContext.uriID, "localNameID": namespaceContext.qnameContext.length, "localName": localName};
			console.log("create new runtime qnameContext for '" + localName + "', uriId=" + qnameContext.uriID + " and localNameID=" + qnameContext.localNameID );
			// this.runtimeQNameContexts.push(qnameContext);
			// NOTE: Java Nahsorn seems to add an "undefined" entry up-front!?
			let qnameContextLengthBefore = namespaceContext.qnameContext.length;
			// console.log("QName length before: " + qnameContextLengthBefore)
			if(qnameContextLengthBefore == 0) {
				namespaceContext.qnameContext = new Array();
			}
			namespaceContext.qnameContext.push(qnameContext);
			for(let i=0; i<namespaceContext.qnameContext.length; i++) {
				console.log("\t" + i + "\t" + namespaceContext.qnameContext[i].localName)
			}
			// console.log("QName length after: " + namespaceContext.qnameContext.length);
		} else {
			// string value found in local partition
			// ==> string value is represented as zero (0) encoded as an
			// Unsigned Integer followed by an the compact identifier of the
			// string value as an n-bit unsigned integer n is log2 m and m is
			// the number of entries in the string table partition
			this.bitStream.encodeUnsignedInteger(0, this.isByteAligned);
			console.log("localName hit1 encoded " + 0);
			var n = this.getCodeLength(namespaceContext.qnameContext.length);
			this.bitStream.encodeNBitUnsignedInteger(qnameContext.localNameID, n, this.isByteAligned);
			console.log("localName hit2 encoded " + qnameContext.localNameID + " in " + n);
		}
		
		return qnameContext;
	}

	endElement() {
		console.log("EE");

		let ec = -1;
		let prod : Production;
		let grammar : Grammar = this.elementContext[this.elementContext.length - 1].grammar;
		for (let i = 0; ec === -1 && i < grammar.production.length; i++) {
			prod = grammar.production[i];
			if (prod.event === EventType.endElement) {
				ec = i;
			}
		}
		if (ec != -1) {
			// console.log("\t" + "Event Code == " + ec );
			let codeLength = this.getCodeLengthForGrammar(grammar);
			this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
			console.log("EE encoded " + ec + " in " + codeLength);

			// pop element stack
			this.elementContext.pop();
		} else {
			if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent ) {
				// 1st level
				let codeLength1 = this.getCodeLengthForGrammar(grammar);
				this.bitStream.encodeNBitUnsignedInteger(grammar.production.length, codeLength1, this.isByteAligned);
				console.log("EE1 encoded " + grammar.production.length + " in " + codeLength1);
				// 2nd level
				let codeLength2 = this.get2ndCodeLengthForGrammar(grammar);
				let ec2 = this.get2ndEventCode(grammar, EventType.endElementGeneric);
				this.bitStream.encodeNBitUnsignedInteger(ec2, codeLength2, this.isByteAligned);
				console.log("EE2 encoded " + ec2 + " in " + codeLength2);
				
				// learn EE
				this.learnEndElement(grammar);

				// pop element stack
				this.elementContext.pop();
			} else {
				throw new Error("No endElement event found");
			}
		}
	}

	attribute(namespace : string, localName : string, value : string) {
		if (namespace === null) {
			namespace = "";
		}
		console.log("\tAT {" + namespace + "}" + localName + " == '" + value
				+ "'");
		if ("http://www.w3.org/2000/xmlns/" === namespace) {
			// TODO namespace declaration
		} else if ("http://www.w3.org/2001/XMLSchema-instance" === namespace) {
			// TODO schemaLocation et cetera
		} else {
			// normal attribute
			let ec = -1;
			let prod : Production;
			let grammar : Grammar = this.elementContext[this.elementContext.length - 1].grammar;
			for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
				prod = grammar.production[i];
				if (prod.event === EventType.attribute) {
					var namespaceContext = this.grammars.qnames.namespaceContext[prod.attributeNamespaceID];
					var qnameContext = namespaceContext.qnameContext[prod.attributeLocalNameID];
					if (qnameContext.localName === localName && namespaceContext.uri === namespace) {
						ec = i;
					}
				}
			}
			if (ec != -1) {
				// console.log("\t" + "Event Code == " + ec );
				let codeLength = this.getCodeLengthForGrammar(grammar);
				this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
				// write value
				let datatype : SimpleDatatype;
				if(prod.attributeDatatypeID === undefined || prod.attributeDatatypeID < 0) {
					// learned AT
					datatype = EXIEncoder.DEFAULT_SIMPLE_DATATYPE;
				} else {
					datatype = this.grammars.simpleDatatypes[prod.attributeDatatypeID];
				}
				this.encodeDatatypeValue(value, datatype,
					prod.attributeNamespaceID, prod.attributeLocalNameID);
				// update current element context with revised grammar
				let nextGrammar : Grammar = this.getGrammar(prod.nextGrammarID);
				this.elementContext[this.elementContext.length - 1].grammar = nextGrammar;
			} else {
				if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent ) {
					// 1st level
					let codeLength1 = this.getCodeLengthForGrammar(grammar);
					this.bitStream.encodeNBitUnsignedInteger(grammar.production.length, codeLength1, this.isByteAligned);
					// 2nd level
					let codeLength2 = this.get2ndCodeLengthForGrammar(grammar);
					let ec2 = this.get2ndEventCode(grammar, EventType.attributeGeneric);
					this.bitStream.encodeNBitUnsignedInteger(ec2, codeLength2, this.isByteAligned);

					// encode qname
					let qnAT : QNameContext = this.encodeQName(namespace, localName);

					// encode value
					let elementContext = this.elementContext[this.elementContext.length - 1];
					this.encodeDatatypeValue(value, EXIEncoder.DEFAULT_SIMPLE_DATATYPE,
						qnAT.uriID, qnAT.localNameID);

					// learn AT
					this.learnAttribute(grammar, qnAT);

				} else {
					throw new Error("No attribute event found for " + localName);
				}
			}
		}
	}

	characters(chars : string) {
		console.log("\tCharacters '" + chars + "'");

		let ec = -1;
		let prod : Production;
		let grammar : Grammar = this.elementContext[this.elementContext.length - 1].grammar;
		for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
			prod = grammar.production[i];
			if (prod.event === EventType.characters) {
				ec = i;
			}
		}
		if (ec != -1) {
			// console.log("\t" + "Event Code == " + ec );
			let codeLength = this.getCodeLengthForGrammar(grammar);
			this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
			// write value
			let datatype : SimpleDatatype;
			if(prod.charactersDatatypeID === undefined || prod.charactersDatatypeID < 0) {
				// learned CH
				datatype = EXIEncoder.DEFAULT_SIMPLE_DATATYPE;
			} else {
				datatype = this.grammars.simpleDatatypes[prod.charactersDatatypeID];
			}
			let elementContext : ElementContextEntry = this.elementContext[this.elementContext.length - 1];
			this.encodeDatatypeValue(chars, datatype,
				elementContext.namespaceID, elementContext.localNameID);
			// update current element context with revised grammar
			let nextGrammar : Grammar = this.getGrammar(prod.nextGrammarID);
			this.elementContext[this.elementContext.length - 1].grammar = nextGrammar;
		} else {
			if(grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent ) {
				// 1st level
				let codeLength1 = this.getCodeLengthForGrammar(grammar);
				this.bitStream.encodeNBitUnsignedInteger(grammar.production.length, codeLength1, this.isByteAligned);
				// 2nd level
				let codeLength2 = this.get2ndCodeLengthForGrammar(grammar);
				let ec2 = this.get2ndEventCode(grammar, EventType.charactersGeneric);
				this.bitStream.encodeNBitUnsignedInteger(ec2, codeLength2, this.isByteAligned);
				
				// write value
				let elementContext = this.elementContext[this.elementContext.length - 1];
				this.encodeDatatypeValue(chars, EXIEncoder.DEFAULT_SIMPLE_DATATYPE,
					elementContext.namespaceID, elementContext.localNameID);
				
				// learn CH
				this.learnCharacters(grammar);
				
				// update current element context
				this.elementContext[this.elementContext.length - 1].grammar = grammar.elementContent;
			} else {
				throw new Error("No characters event found for '" + chars + "'");
			}
		}
	}
	
	decimalPlaces(num : number) : number {
		  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		  if (!match) { return 0; }
		  return Math.max(
		       0,
		       // Number of digits right of decimal point.
		       (match[1] ? match[1].length : 0)
		       // Adjust for scientific notation.
		       - (match[2] ? +match[2] : 0));
	}
	
	isInteger(value) {
	    return typeof value === "number" && 
	           isFinite(value) && 
	           Math.floor(value) === value;
	};
	
	
	// inspired by https://blog.coolmuse.com/2012/06/21/getting-the-exponent-and-mantissa-from-a-javascript-number/
	getEXIFloat(value : number) : EXIFloat {
		if (typeof value !== "number") {
			throw new TypeError("value must be a Number");
		}
		
		let result = new EXIFloat();

		if ( value === 0 ) {	
		    return result;
		}
		
		// if ( Number.isInteger(value) ) { // no type-script support
		if(value % 1 === 0) {
			result.mantissa = value;
			return result;
		}
		
		// not finite?
		if (!isFinite(value)) {
			result.exponent = -16384;
			if (isNaN(value)) {
				result.mantissa = 0;
			} else {
				if (value === -Infinity) {
					result.mantissa = -1;
				} else {
					result.mantissa = +1;
				}
			}
			return result;
		}
		
		// value = (Number(value)).doubleValue();
		if(MAX_EXI_FLOAT_DIGITS >= 0) {
			value = Number(Number(value).toFixed(MAX_EXI_FLOAT_DIGITS)); // at most XX digits
		}
		
		// negative?
		var isNegative = false;
		if ( value < 0 ) {
			isNegative = true;
			value = -value;
		}
		
		var dp = this.decimalPlaces(<number>value);
		
		// calculate exponent
		if(dp > 0) {
			result.exponent = -dp;
		}
		
		// calculate mantissa
		var m = value;
		while(dp > 0) {
			m = m * 10;
			dp -= 1;
		}
		result.mantissa = Math.round(m);
  
		if ( isNegative ) {
			result.mantissa = -result.mantissa;
		}
		
		return result;
	}

	/*
	function equalFloat(f1, f2) {
		return ((f1 > f2 ? f1 - f2 : f2 - f1) < (1e-4));
	}
	*/

	parseYear(sb : string, dateTimeValue : DateTimeValue) : number {
		var sYear;
		var len;
		if (sb.charAt(0) === '-') {
			sYear = sb.substring(0, 5);
			len = 5;
		} else {
			sYear = sb.substring(0, 4);
			len = 4;
		}
		var year = parseInt(sYear);
		dateTimeValue.year = year;

		return len;
	}

	/*
	 * function parseMonth(sb, pos, dateTimeValue) { var month =
	 * parseInt(sb.substring(pos, pos+2)); // adjust buffer // sb.delete(0, 2);
	 * sb = sb.substring(pos+ 2);
	 * 
	 * return month; }
	 */
	/*
	 * function parseDay(sb, pos) { var sDay = sb.substring(pos, pos+2); var day =
	 * parseInt(sDay); return (pos+2); }
	 */

	checkCharacter(sb : string, pos : number, c : string, dateTimeValue : DateTimeValue)  : number {
		if (sb.length > pos && sb.charAt(pos) === c) {
			// ok
		} else {
			dateTimeValue.error = -1;
		}

		return (pos + 1)
	}

	parseMonthDay(sb : string, pos : number, dateTimeValue : DateTimeValue) : number {
		// pos = parseMonth(sb, pos, dateTimeValue); // month
		var month = parseInt(sb.substring(pos, pos + 2));
		pos += 2;
		pos = this.checkCharacter(sb, pos, '-', dateTimeValue); // hyphen
		// var day = parseDay(sb); // day
		var day = parseInt(sb.substring(pos, pos + 2));
		pos += 2;

		// MONTH_MULTIPLICATOR == 32
		dateTimeValue.monthDay = month * 32 + day;
		return pos;
	}

	encodeDatatypeValue(value : string, datatype : SimpleDatatype,
			namespaceID, localNameID) {
		if (datatype.type === SimpleDatatypeType.STRING) {
			this.encodeDatatypeValueString(value, namespaceID, localNameID);
		} else if (datatype.type === SimpleDatatypeType.UNSIGNED_INTEGER) {
			this.encodeDatatypeValueUnsignedInteger(value, namespaceID, localNameID);
		} else if (datatype.type === SimpleDatatypeType.INTEGER) {
			this.encodeDatatypeValueInteger(value, namespaceID, localNameID);
		} else if (datatype.type === SimpleDatatypeType.FLOAT) {
			this.encodeDatatypeValueFloat(value, namespaceID, localNameID);
		} else if (datatype.type === SimpleDatatypeType.BOOLEAN) {
			this.encodeDatatypeValueBoolean(value, namespaceID, localNameID);
		} else if (datatype.type === SimpleDatatypeType.DATETIME) {
			// let dtd = <DatetimeDatatype>datatype;
			// this.encodeDatatypeValueDateTime(value, dtd.datetimeType, namespaceID, localNameID);
			this.encodeDatatypeValueDateTime(value, datatype.datetimeType, namespaceID, localNameID);
		} else if (datatype.type === SimpleDatatypeType.LIST) {
			var resArray = value.split(" ");
			this.bitStream.encodeUnsignedInteger(resArray.length, this.isByteAligned);
			console.log("\t" + " LIST with length " + resArray.length + ": " + resArray);
			for(var i=0; i <  resArray.length; i++) {
				var v = resArray[i];
				if (datatype.listType === SimpleDatatypeType.STRING) {
					this.encodeDatatypeValueString(v, namespaceID, localNameID);
				} else if (datatype.listType === SimpleDatatypeType.UNSIGNED_INTEGER) {
					this.encodeDatatypeValueUnsignedInteger(v, namespaceID, localNameID);
				} else if (datatype.listType === SimpleDatatypeType.INTEGER) {
					this.encodeDatatypeValueInteger(v, namespaceID, localNameID);
				} else if (datatype.listType === SimpleDatatypeType.FLOAT) {
					this.encodeDatatypeValueFloat(v, namespaceID, localNameID);
				} else if (datatype.listType === SimpleDatatypeType.BOOLEAN) {
					this.encodeDatatypeValueBoolean(v, namespaceID, localNameID);
				} else {
					throw new Error("Unsupported list datatype: " + datatype.listType + " for value " + value );
				}		
			}
		} else {
			throw new Error("Unsupported datatype: " + datatype.type + " for value " + value );
		}
	}

	
	encodeDatatypeValueString(value : string, namespaceID : number, localNameID : number) {
		var stEntry = this.stringTable.getStringTableEntry(value);
		if (stEntry === null) {
			// miss
			var slen = value.length;
			this.bitStream.encodeUnsignedInteger(2 + slen, this.isByteAligned);
			// TODO characters
			if (slen > 0) {
				this.bitStream.encodeStringOnly(value, this.isByteAligned);
				this.stringTable.addValue(namespaceID, localNameID, value);
			}
		} else {
			if (stEntry.namespaceID === namespaceID && stEntry.localNameID === localNameID) {
				// local hit
				this.bitStream.encodeUnsignedInteger(0, this.isByteAligned);
				var n = this.getCodeLength(this.stringTable
						.getNumberOfLocalStrings(namespaceID, localNameID));
				this.bitStream.encodeNBitUnsignedInteger(
						stEntry.localValueID, n, this.isByteAligned);
			} else {
				// global hit
				this.bitStream.encodeUnsignedInteger(1, this.isByteAligned);
				var n = this.getCodeLength(this.stringTable
						.getNumberOfGlobalStrings());
				this.bitStream.encodeNBitUnsignedInteger(
						stEntry.globalValueID, n, this.isByteAligned);
			}
		}
	}
	
	encodeDatatypeValueUnsignedInteger(value : string, namespaceID : number, localNameID : number) {
		console.log("\t" + " UNSIGNED_INTEGER = " + value);
		this.bitStream.encodeUnsignedInteger(parseInt(value), this.isByteAligned);
	}
	
	encodeDatatypeValueInteger(value : string, namespaceID : number, localNameID : number) {
		console.log("\t" + " INTEGER = " + value);
		this.bitStream.encodeInteger(parseInt(value), this.isByteAligned);
	}
	
	encodeDatatypeValueFloat(value : string, namespaceID : number, localNameID : number) {
		var f = parseFloat(value);
		// 
		console.log("\t" + " floatA = " + f);
		// var fl = decodeIEEE64(f);
		// var fl = getNumberParts(f);
		var fl = this.getEXIFloat(f);
		// mantissa followed by exponent
		this.bitStream.encodeInteger(fl.mantissa, this.isByteAligned);
		this.bitStream.encodeInteger(fl.exponent, this.isByteAligned);
		console
				.log("\t" + " floatB = " + fl.mantissa + " E "
						+ fl.exponent);
	}
	
	encodeDatatypeValueBoolean(value : string, namespaceID : number, localNameID : number) {
		let b = (value == 'true');
		if (b) { // == "true" || value == "1"
			this.bitStream.encodeNBitUnsignedInteger(1, 1, this.isByteAligned);
		} else {
			this.bitStream.encodeNBitUnsignedInteger(0, 1, this.isByteAligned);
		}
	}
	
	encodeDatatypeValueDateTime(value : string, datetimeType : DatetimeType, namespaceID : number, localNameID : number) {
		let year = 0, monthDay = 0, time = 0, fractionalSecs = 0;
		let presenceFractionalSecs = false;
		let presenceTimezone = false;
		let sDatetime = "";
		if (datetimeType === DatetimeType.date) { // // date: Year, MonthDay,
			// [TimeZone]
			// YEAR_OFFSET = 2000
			// NUMBER_BITS_MONTHDAY = 9
			// MONTH_MULTIPLICATOR = 32
			let dateTimeValue = new DateTimeValue();
			let pos = this.parseYear(value, dateTimeValue);
			pos = this.checkCharacter(value, pos, '-', dateTimeValue); // hyphen
			pos = this.parseMonthDay(value, pos, dateTimeValue);
			// TODO timezone
			this.bitStream.encodeInteger(dateTimeValue.year - 2000, this.isByteAligned);
			this.bitStream.encodeNBitUnsignedInteger(
					dateTimeValue.monthDay, 9, this.isByteAligned);
		} else {
			throw new Error("Unsupported datetime type: " + datetimeType);
		}

		// var presenceTimezone = false; // TODO
		if (presenceTimezone) {
			this.bitStream.encodeNBitUnsignedInteger(1, 1, this.isByteAligned);
			throw new Error("Unsupported datetime timezone");
		} else {
			this.bitStream.encodeNBitUnsignedInteger(0, 1, this.isByteAligned);
		}
		// console.log("\t" + " presenceTimezone = " + presenceTimezone);
		console.log("\t" + " datetime = " + sDatetime);
	}

}



/*******************************************************************************
 * 
 * E X I 4 J S O N - P A R T
 * 
 ******************************************************************************/

 // Note: The reason why it is all put together is to avoid export in TSC which
 // causes issue in the browser without using RequireJS or SystemJS 


 
const exiForJsonUri = "http://www.w3.org/2015/EXI/json";


// see minified schema-for-json.xsd.grs with thing grammars
// Note: the idea would be to have this optimized (currently all schema information, even unnecessary stuff is there...)
const jsonGrammars = '{"qnames":{"namespaceContext":[{"uriID":0,"uri":"","qnameContext":[]},{"uriID":1,"uri":"http://www.w3.org/XML/1998/namespace","qnameContext":[{"uriID":1,"localNameID":0,"localName":"base"},{"uriID":1,"localNameID":1,"localName":"id"},{"uriID":1,"localNameID":2,"localName":"lang"},{"uriID":1,"localNameID":3,"localName":"space"}]},{"uriID":2,"uri":"http://www.w3.org/2001/XMLSchema-instance","qnameContext":[{"uriID":2,"localNameID":0,"localName":"nil"},{"uriID":2,"localNameID":1,"localName":"type"}]},{"uriID":3,"uri":"http://www.w3.org/2001/XMLSchema","qnameContext":[{"uriID":3,"localNameID":0,"localName":"ENTITIES","globalTypeGrammarID":18},{"uriID":3,"localNameID":1,"localName":"ENTITY","globalTypeGrammarID":7},{"uriID":3,"localNameID":2,"localName":"ID","globalTypeGrammarID":7},{"uriID":3,"localNameID":3,"localName":"IDREF","globalTypeGrammarID":7},{"uriID":3,"localNameID":4,"localName":"IDREFS","globalTypeGrammarID":18},{"uriID":3,"localNameID":5,"localName":"NCName","globalTypeGrammarID":7},{"uriID":3,"localNameID":6,"localName":"NMTOKEN","globalTypeGrammarID":7},{"uriID":3,"localNameID":7,"localName":"NMTOKENS","globalTypeGrammarID":18},{"uriID":3,"localNameID":8,"localName":"NOTATION","globalTypeGrammarID":7},{"uriID":3,"localNameID":9,"localName":"Name","globalTypeGrammarID":7},{"uriID":3,"localNameID":10,"localName":"QName","globalTypeGrammarID":7},{"uriID":3,"localNameID":11,"localName":"anySimpleType","globalTypeGrammarID":7},{"uriID":3,"localNameID":12,"localName":"anyType","globalTypeGrammarID":19},{"uriID":3,"localNameID":13,"localName":"anyURI","globalTypeGrammarID":7},{"uriID":3,"localNameID":14,"localName":"base64Binary","globalTypeGrammarID":12},{"uriID":3,"localNameID":15,"localName":"boolean","globalTypeGrammarID":9},{"uriID":3,"localNameID":16,"localName":"byte","globalTypeGrammarID":20},{"uriID":3,"localNameID":17,"localName":"date","globalTypeGrammarID":15},{"uriID":3,"localNameID":18,"localName":"dateTime","globalTypeGrammarID":13},{"uriID":3,"localNameID":19,"localName":"decimal","globalTypeGrammarID":17},{"uriID":3,"localNameID":20,"localName":"double","globalTypeGrammarID":8},{"uriID":3,"localNameID":21,"localName":"duration","globalTypeGrammarID":7},{"uriID":3,"localNameID":22,"localName":"float","globalTypeGrammarID":8},{"uriID":3,"localNameID":23,"localName":"gDay","globalTypeGrammarID":21},{"uriID":3,"localNameID":24,"localName":"gMonth","globalTypeGrammarID":22},{"uriID":3,"localNameID":25,"localName":"gMonthDay","globalTypeGrammarID":23},{"uriID":3,"localNameID":26,"localName":"gYear","globalTypeGrammarID":24},{"uriID":3,"localNameID":27,"localName":"gYearMonth","globalTypeGrammarID":25},{"uriID":3,"localNameID":28,"localName":"hexBinary","globalTypeGrammarID":26},{"uriID":3,"localNameID":29,"localName":"int","globalTypeGrammarID":16},{"uriID":3,"localNameID":30,"localName":"integer","globalTypeGrammarID":16},{"uriID":3,"localNameID":31,"localName":"language","globalTypeGrammarID":7},{"uriID":3,"localNameID":32,"localName":"long","globalTypeGrammarID":16},{"uriID":3,"localNameID":33,"localName":"negativeInteger","globalTypeGrammarID":16},{"uriID":3,"localNameID":34,"localName":"nonNegativeInteger","globalTypeGrammarID":27},{"uriID":3,"localNameID":35,"localName":"nonPositiveInteger","globalTypeGrammarID":16},{"uriID":3,"localNameID":36,"localName":"normalizedString","globalTypeGrammarID":7},{"uriID":3,"localNameID":37,"localName":"positiveInteger","globalTypeGrammarID":27},{"uriID":3,"localNameID":38,"localName":"short","globalTypeGrammarID":16},{"uriID":3,"localNameID":39,"localName":"string","globalTypeGrammarID":7},{"uriID":3,"localNameID":40,"localName":"time","globalTypeGrammarID":14},{"uriID":3,"localNameID":41,"localName":"token","globalTypeGrammarID":7},{"uriID":3,"localNameID":42,"localName":"unsignedByte","globalTypeGrammarID":28},{"uriID":3,"localNameID":43,"localName":"unsignedInt","globalTypeGrammarID":27},{"uriID":3,"localNameID":44,"localName":"unsignedLong","globalTypeGrammarID":27},{"uriID":3,"localNameID":45,"localName":"unsignedShort","globalTypeGrammarID":27}]},{"uriID":4,"uri":"http://www.w3.org/2015/EXI/json","qnameContext":[{"uriID":4,"localNameID":0,"localName":"array","globalElementGrammarID":5},{"uriID":4,"localNameID":1,"localName":"arrayType","globalTypeGrammarID":5},{"uriID":4,"localNameID":2,"localName":"base64Binary"},{"uriID":4,"localNameID":3,"localName":"boolean","globalElementGrammarID":9},{"uriID":4,"localNameID":4,"localName":"booleanType","globalTypeGrammarID":9},{"uriID":4,"localNameID":5,"localName":"date"},{"uriID":4,"localNameID":6,"localName":"dateTime"},{"uriID":4,"localNameID":7,"localName":"decimal"},{"uriID":4,"localNameID":8,"localName":"integer"},{"uriID":4,"localNameID":9,"localName":"map","globalElementGrammarID":6},{"uriID":4,"localNameID":10,"localName":"mapType","globalTypeGrammarID":6},{"uriID":4,"localNameID":11,"localName":"null","globalElementGrammarID":10},{"uriID":4,"localNameID":12,"localName":"nullType","globalTypeGrammarID":10},{"uriID":4,"localNameID":13,"localName":"number","globalElementGrammarID":8},{"uriID":4,"localNameID":14,"localName":"numberType","globalTypeGrammarID":8},{"uriID":4,"localNameID":15,"localName":"other","globalElementGrammarID":11},{"uriID":4,"localNameID":16,"localName":"otherType","globalTypeGrammarID":11},{"uriID":4,"localNameID":17,"localName":"string","globalElementGrammarID":7},{"uriID":4,"localNameID":18,"localName":"stringType","globalTypeGrammarID":7},{"uriID":4,"localNameID":19,"localName":"time"}]}]},"simpleDatatypes":[{"simpleDatatypeID":0,"type":"STRING"},{"simpleDatatypeID":1,"type":"STRING"},{"simpleDatatypeID":2,"type":"FLOAT"},{"simpleDatatypeID":3,"type":"FLOAT"},{"simpleDatatypeID":4,"type":"BOOLEAN"},{"simpleDatatypeID":5,"type":"BOOLEAN"},{"simpleDatatypeID":6,"type":"BINARY_BASE64"},{"simpleDatatypeID":7,"type":"DATETIME","datetimeType":"dateTime"},{"simpleDatatypeID":8,"type":"DATETIME","datetimeType":"time"},{"simpleDatatypeID":9,"type":"DATETIME","datetimeType":"date"},{"simpleDatatypeID":10,"type":"INTEGER"},{"simpleDatatypeID":11,"type":"DECIMAL"},{"simpleDatatypeID":12,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":13,"type":"LIST","listType":"STRING"},{"simpleDatatypeID":14,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":-128,"upperBound":127},{"simpleDatatypeID":15,"type":"INTEGER"},{"simpleDatatypeID":16,"type":"DATETIME","datetimeType":"gDay"},{"simpleDatatypeID":17,"type":"STRING"},{"simpleDatatypeID":18,"type":"DATETIME","datetimeType":"gMonth"},{"simpleDatatypeID":19,"type":"DATETIME","datetimeType":"gMonthDay"},{"simpleDatatypeID":20,"type":"DATETIME","datetimeType":"gYear"},{"simpleDatatypeID":21,"type":"DATETIME","datetimeType":"gYearMonth"},{"simpleDatatypeID":22,"type":"BINARY_HEX"},{"simpleDatatypeID":23,"type":"UNSIGNED_INTEGER"},{"simpleDatatypeID":24,"type":"NBIT_UNSIGNED_INTEGER","lowerBound":0,"upperBound":255},{"simpleDatatypeID":25,"type":"UNSIGNED_INTEGER"}],"grs":{"documentGrammarID":0,"fragmentGrammarID":3,"grammar":[{"grammarID":"0","type":"document","production":[{"event":"startDocument","nextGrammarID":1}]},{"grammarID":"1","type":"docContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":2},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":2},{"event":"startElementGeneric","nextGrammarID":2}]},{"grammarID":"2","type":"docEnd","production":[{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"3","type":"fragment","production":[{"event":"startDocument","nextGrammarID":4}]},{"grammarID":"4","type":"fragmentContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":12,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":15,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":13,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":17,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":16,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":4},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":14,"nextGrammarID":4},{"event":"startElementGeneric","nextGrammarID":4},{"event":"endDocument","nextGrammarID":-1}]},{"grammarID":"5","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":31},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"6","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElementNS","startElementNamespaceID":4,"nextGrammarID":29},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"7","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":0,"nextGrammarID":32}]},{"grammarID":"8","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":2,"nextGrammarID":32}]},{"grammarID":"9","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":4,"nextGrammarID":32}]},{"grammarID":"10","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"11","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":2,"startElementGrammarID":12,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":6,"startElementGrammarID":13,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":19,"startElementGrammarID":14,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":5,"startElementGrammarID":15,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":8,"startElementGrammarID":16,"nextGrammarID":32},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":7,"startElementGrammarID":17,"nextGrammarID":32}]},{"grammarID":"12","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":6,"nextGrammarID":32}]},{"grammarID":"13","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":7,"nextGrammarID":32}]},{"grammarID":"14","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":8,"nextGrammarID":32}]},{"grammarID":"15","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":9,"nextGrammarID":32}]},{"grammarID":"16","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":10,"nextGrammarID":32}]},{"grammarID":"17","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":11,"nextGrammarID":32}]},{"grammarID":"18","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":12,"nextGrammarID":32}]},{"grammarID":"19","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"attributeGeneric","nextGrammarID":19},{"event":"startElementGeneric","nextGrammarID":33},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":33}]},{"grammarID":"20","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":14,"nextGrammarID":32}]},{"grammarID":"21","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":16,"nextGrammarID":32}]},{"grammarID":"22","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":18,"nextGrammarID":32}]},{"grammarID":"23","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":19,"nextGrammarID":32}]},{"grammarID":"24","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":20,"nextGrammarID":32}]},{"grammarID":"25","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":21,"nextGrammarID":32}]},{"grammarID":"26","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":22,"nextGrammarID":32}]},{"grammarID":"27","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":23,"nextGrammarID":32}]},{"grammarID":"28","type":"firstStartTagContent","isTypeCastable":false,"isNillable":false,"production":[{"event":"characters","charactersDatatypeID":24,"nextGrammarID":32}]},{"grammarID":"29","type":"elementContent","production":[{"event":"startElementNS","startElementNamespaceID":4,"nextGrammarID":29},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"30","type":"elementContent","production":[]},{"grammarID":"31","type":"elementContent","production":[{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":9,"startElementGrammarID":6,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":0,"startElementGrammarID":5,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":17,"startElementGrammarID":7,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":13,"startElementGrammarID":8,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":3,"startElementGrammarID":9,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":11,"startElementGrammarID":10,"nextGrammarID":31},{"event":"startElement","startElementNamespaceID":4,"startElementLocalNameID":15,"startElementGrammarID":11,"nextGrammarID":31},{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"32","type":"elementContent","production":[{"event":"endElement","nextGrammarID":-1}]},{"grammarID":"33","type":"elementContent","production":[{"event":"startElementGeneric","nextGrammarID":33},{"event":"endElement","nextGrammarID":-1},{"event":"charactersGeneric","nextGrammarID":33}]}]}}';
const jsonGrammarsObject = Grammars.fromJson(JSON.parse(jsonGrammars));


class EXI4JSONDecoder extends EXIDecoder  {
	constructor() {
		// Note: JSON grammars (see variable jsonGrammarsObject) is implicit
		super(jsonGrammarsObject, {});
	}
}


class EXI4JSONEncoder extends EXIEncoder {

	constructor() {
		// Note: JSON grammars (see variable jsonGrammarsObject) is implicit
		super(jsonGrammarsObject, {});
	}

	encodeJsonText(textJSON : string){
		let jsonObj = JSON.parse(textJSON);
		this.encodeJsonObject(jsonObj);
	}

	encodeJsonObject(jsonObj : Object){
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

	processJSONArray(jsonArray : Array<any>){
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
				this.characters(val + "");
				this.endElement();
			} else if (typeof val === "boolean") {
				this.startElement(exiForJsonUri, "boolean");
				this.characters(val + "");
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

	processJSONObject(jsonObj : Object){
		let keys = Object.keys(jsonObj);
		
		for (let key in jsonObj) {
			if (jsonObj.hasOwnProperty(key)) {
				/* useful code here */
				let val = jsonObj[key];
				console.log("JSON " + key + ": " + val);
				
				if (val instanceof Array) {
					this.startElement(exiForJsonUri, EXI4JSONEncoder.escapeKey(key));
					this.startElement(exiForJsonUri, "array");
					this.processJSONArray(val);
					this.endElement();
					this.endElement();
				} else if (val instanceof Object) {
					this.startElement(exiForJsonUri, EXI4JSONEncoder.escapeKey(key));
					this.startElement(exiForJsonUri, "map");
					this.processJSONObject(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "string") {
					this.startElement(exiForJsonUri, EXI4JSONEncoder.escapeKey(key));
					this.startElement(exiForJsonUri, "string");
					this.characters(val);
					this.endElement();
					this.endElement();
				} else if (typeof val === "number") {
					this.startElement(exiForJsonUri, EXI4JSONEncoder.escapeKey(key));
					this.startElement(exiForJsonUri, "number");
					this.characters(val + "");
					this.endElement();
					this.endElement();
				} else if (typeof val === "boolean") {
					this.startElement(exiForJsonUri, EXI4JSONEncoder.escapeKey(key));
					this.startElement(exiForJsonUri, "boolean");
					// this.attribute("", "key", key);
					this.characters(val + "");
					this.endElement();
					this.endElement();
				} else if (val === null) {
					this.startElement(exiForJsonUri, EXI4JSONEncoder.escapeKey(key));
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
	
	static escapeKey(key : string) : string{
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


	static escapeNCNamePlus(name : string) : string {
		if (name === null || name.length == 0) {
			throw new Error("Unsupported NCName: " + name);
		}

		let sb = "";

		for (let i = 0; i < name.length; i++) {
			let c = name.charAt(i);
			let cc : number = name.charCodeAt(i);
			// String.fromCharCode(10);
			
			if (i == 0) {
				// first character (special)
				if (this.isLetter(cc)) {
					// OK
					// if (sb != null) {
						sb += c;
					// }
				} else if (cc == '_'.charCodeAt(0)) {
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
				if (this.isNCNameChar(cc)) {
					if(cc == '_'.charCodeAt(0)) {
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
	
	static isNCNameChar(c : number) : boolean {
		return this._isAsciiBaseChar(c) || this._isAsciiDigit(c) || c == '.'.charCodeAt(0) || c == '-'.charCodeAt(0) || c == '_'.charCodeAt(0) || this._isNonAsciiBaseChar(c)
				|| this._isNonAsciiDigit(c) || this.isIdeographic(c) || this.isCombiningChar(c) || this.isExtender(c);
	}
	
	static isLetter(c : number) : boolean {
		return this._isAsciiBaseChar(c) || this._isNonAsciiBaseChar(c) || this.isIdeographic(c);
	}
	
	static _isAsciiBaseChar(c : number) : boolean  {
		return this._charInRange(c, 0x0041, 0x005A) || this._charInRange(c, 0x0061, 0x007A);
	}
	
	static _isNonAsciiBaseChar(c : number) : boolean {
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
				|| c == 0x0CDE || this._charInRange(c, 0x0CE0, 0x0CE1) || this._charInRange(c, 0x0D05, 0x0D0C)
				|| this._charInRange(c, 0x0D0E, 0x0D10) || this._charInRange(c, 0x0D12, 0x0D28) || this._charInRange(c, 0x0D2A, 0x0D39)
				|| this._charInRange(c, 0x0D60, 0x0D61) || this._charInRange(c, 0x0E01, 0x0E2E) || c == 0x0E30
				|| this._charInRange(c, 0x0E32, 0x0E33) || this._charInRange(c, 0x0E40, 0x0E45) || this._charInRange(c, 0x0E81, 0x0E82)
				|| c == 0x0E84 || this._charInRange(c, 0x0E87, 0x0E88) || c == 0x0E8A || c == 0x0E8D
				|| this._charInRange(c, 0x0E94, 0x0E97) || this._charInRange(c, 0x0E99, 0x0E9F) || this._charInRange(c, 0x0EA1, 0x0EA3)
				|| c == 0x0EA5 || c == 0x0EA7 || this._charInRange(c, 0x0EAA, 0x0EAB) || this._charInRange(c, 0x0EAD, 0x0EAE)
				|| c == 0x0EB0 || this._charInRange(c, 0x0EB2, 0x0EB3) || c == 0x0EBD || this._charInRange(c, 0x0EC0, 0x0EC4)
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
	
	static isIdeographic(c : number) : boolean {
		return this._charInRange(c, 0x4E00, 0x9FA5) || c == 0x3007 || this._charInRange(c, 0x3021, 0x3029);
	}
	
	static isCombiningChar(c : number) : boolean {
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
	
	
	static isDigit(c : number) : boolean {
		return this._isAsciiDigit(c) || this._isNonAsciiDigit(c);
	}

	static _isAsciiDigit(c : number) : boolean {
		return this._charInRange(c, 0x0030, 0x0039);
	}

	static _isNonAsciiDigit(c : number) : boolean {
		return this._charInRange(c, 0x0660, 0x0669) || this._charInRange(c, 0x06F0, 0x06F9) || this._charInRange(c, 0x0966, 0x096F)
				|| this._charInRange(c, 0x09E6, 0x09EF) || this._charInRange(c, 0x0A66, 0x0A6F) || this._charInRange(c, 0x0AE6, 0x0AEF)
				|| this._charInRange(c, 0x0B66, 0x0B6F) || this._charInRange(c, 0x0BE7, 0x0BEF) || this._charInRange(c, 0x0C66, 0x0C6F)
				|| this._charInRange(c, 0x0CE6, 0x0CEF) || this._charInRange(c, 0x0D66, 0x0D6F) || this._charInRange(c, 0x0E50, 0x0E59)
				|| this._charInRange(c, 0x0ED0, 0x0ED9) || this._charInRange(c, 0x0F20, 0x0F29);
	}

	static isExtender(c : number) : boolean {
		return c == 0x00B7 || c == 0x02D0 || c == 0x02D1 || c == 0x0387 || c == 0x0640 || c == 0x0E46 || c == 0x0EC6
				|| c == 0x3005 || this._charInRange(c, 0x3031, 0x3035) || this._charInRange(c, 0x309D, 0x309E)
				|| this._charInRange(c, 0x30FC, 0x30FE);
	}

	static _charInRange(c : number, start : number, end : number) {
		let ccode = c ; // c.charCodeAt(0);
		return ccode >= start && ccode <= end;
		
		// charCodeAt
	}
}




class JSONEventHandler extends EventHandler {

//	this.openTag;
//	this.openTagKey;
	json : Object;
	jsonStack : Array<any>;
	// this.lastElement;
	chars : string;

	constructor() {
		super();
	}
	
	getJSON() : Object {
		return this.json;
	}
	
	startDocument(){
		// this.openTag = null;
		// this.openTagKey = null;
		this.json = null;
		this.jsonStack = [];
	}
	
	endDocument(){
	}
	
	startElement(namespace : string, localName : string){
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
				let value;
				
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
	endElement(namespace : string, localName : string) {
		
		var top = this.jsonStack[this.jsonStack.length-1];
		
		
		var value;
		
		if(top === "number") {
			value = new Number(this.chars);
		} else if (top === "string") {
			value = new String(this.chars);
		} else if (top === "boolean") {
			value = (this.chars == 'true');
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
	
	unescapeKey = function(key){
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
	

		
	attribute(namespace : string, localName : string, value : string){
	}
	
	
	characters(chars : string){
		console.log("chars: " + chars);
		this.chars = chars;
	}

	
}






export class EXI4JSON {
	encoder : EXI4JSONEncoder = new EXI4JSONEncoder();
	decoder : EXI4JSONDecoder = new EXI4JSONDecoder();
	public exify(jsonObj : Object) {	
		this.encoder.encodeJsonObject(jsonObj);
		// EXI4JSON.encoder.encodeJsonObject(jsonObj);
		let uint8ArrayLength = this.encoder.getUint8ArrayLength();
		let uint8Array = this.encoder.getUint8Array();
		return uint8Array;
	}

	public parse(uint8Array : Uint8Array){
		let jsonHandler = new JSONEventHandler();
		this.decoder.registerEventHandler(jsonHandler);
		this.decoder.decode(uint8Array);
		// var jsonText = JSON.stringify(jsonHandler.getJSON(), null, "\t");
		return jsonHandler.getJSON();
	}

}

export function exify(jsonObj : Object): Uint8Array {
	let encoder : EXI4JSONEncoder = new EXI4JSONEncoder();
	encoder.encodeJsonObject(jsonObj);
	let uint8Array = encoder.getUint8Array();
	return uint8Array;
}

export function parse(uint8Array : Uint8Array): Object {
	let decoder : EXI4JSONDecoder = new EXI4JSONDecoder();
	let jsonHandler = new JSONEventHandler();
	decoder.registerEventHandler(jsonHandler);
	decoder.decode(uint8Array);
	return jsonHandler.getJSON();
}



