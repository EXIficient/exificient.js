/*! exificient.js v0.0.3-SNAPSHOT | (c) 2017 Siemens AG | The MIT License (MIT) */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MAX_EXI_FLOAT_DIGITS = 6; // -1 indicates no rounding
/*******************************************************************************
 *
 * S H A R E D - P A R T
 *
 ******************************************************************************/
var StringTableEntry = (function () {
    function StringTableEntry(namespaceID, localNameID, value, globalValueID, localValueID) {
        this.namespaceID = namespaceID;
        this.localNameID = localNameID;
        this.value = value;
        this.globalValueID = globalValueID;
        this.localValueID = localValueID;
    }
    return StringTableEntry;
}());
var StringTable = (function () {
    function StringTable() {
        this.strings = new Array();
    }
    StringTable.prototype.getNumberOfGlobalStrings = function () {
        return this.strings.length;
    };
    StringTable.prototype.getNumberOfLocalStrings = function (namespaceID, localNameID) {
        var cnt = 0;
        for (var i = 0; i < this.strings.length; i++) {
            if (this.strings[i].namespaceID === namespaceID && this.strings[i].localNameID === localNameID) {
                cnt++;
            }
        }
        return cnt;
    };
    StringTable.prototype.getLocalValue = function (namespaceID, localNameID, localValueID) {
        for (var i = localValueID; i < this.strings.length; i++) {
            if (this.strings[i].namespaceID === namespaceID && this.strings[i].localNameID === localNameID
                && this.strings[i].localValueID === localValueID) {
                return this.strings[i];
            }
        }
        return null;
    };
    StringTable.prototype.getGlobalValue = function (globalValueID) {
        if (this.strings.length > globalValueID) {
            return this.strings[globalValueID];
        }
        else {
            return null;
        }
    };
    StringTable.prototype.addValue = function (namespaceID, localNameID, value) {
        var globalValueID = this.strings.length;
        var localValueID = this.getNumberOfLocalStrings(namespaceID, localNameID);
        this.strings.push(new StringTableEntry(namespaceID, localNameID, value, globalValueID, localValueID));
    };
    StringTable.prototype.getStringTableEntry = function (value) {
        for (var i = 0; i < this.strings.length; i++) {
            if (this.strings[i].value === value) {
                return this.strings[i];
            }
        }
        return null;
    };
    return StringTable;
}());
var QNameContext = (function () {
    function QNameContext() {
    }
    return QNameContext;
}());
var NamespaceContext = (function () {
    function NamespaceContext() {
    }
    return NamespaceContext;
}());
var QNames = (function () {
    function QNames() {
    }
    return QNames;
}());
var Production = (function () {
    function Production(event, nextGrammarID) {
        this.event = event;
        this.nextGrammarID = nextGrammarID;
    }
    return Production;
}());
var EventType;
(function (EventType) {
    EventType[EventType["startDocument"] = 0] = "startDocument";
    EventType[EventType["endDocument"] = 1] = "endDocument";
    EventType[EventType["startElement"] = 2] = "startElement";
    EventType[EventType["startElementNS"] = 3] = "startElementNS";
    EventType[EventType["startElementGeneric"] = 4] = "startElementGeneric";
    EventType[EventType["endElement"] = 5] = "endElement";
    EventType[EventType["characters"] = 6] = "characters";
    EventType[EventType["charactersGeneric"] = 7] = "charactersGeneric";
    EventType[EventType["attribute"] = 8] = "attribute";
    EventType[EventType["attributeGeneric"] = 9] = "attributeGeneric";
})(EventType || (EventType = {}));
/*class EventType
{
    // boilerplate
    constructor(public value:string){
    }

    toString(){
        return this.value;
    }

    // values
    static startDocument = new EventType("startDocument");
    static endDocument = new EventType("endDocument");
    static startElement = new EventType("startElement");
    static startElementNS = new EventType("startElementNS");
    static startElementGeneric = new EventType("startElementGeneric");
    static endElement = new EventType("endElement");
    static characters = new EventType("characters");
    static charactersGeneric = new EventType("charactersGeneric");
    static attribute = new EventType("attribute");
    static attributeGeneric = new EventType("attributeGeneric");
}
*/
var GrammarType;
(function (GrammarType) {
    GrammarType[GrammarType["document"] = 0] = "document";
    GrammarType[GrammarType["fragment"] = 1] = "fragment";
    GrammarType[GrammarType["docContent"] = 2] = "docContent";
    GrammarType[GrammarType["docEnd"] = 3] = "docEnd";
    GrammarType[GrammarType["fragmentContent"] = 4] = "fragmentContent";
    GrammarType[GrammarType["firstStartTagContent"] = 5] = "firstStartTagContent";
    GrammarType[GrammarType["startTagContent"] = 6] = "startTagContent";
    GrammarType[GrammarType["elementContent"] = 7] = "elementContent";
    GrammarType[GrammarType["builtInStartTagContent"] = 8] = "builtInStartTagContent";
    GrammarType[GrammarType["builtInElementContent"] = 9] = "builtInElementContent";
})(GrammarType || (GrammarType = {}));
var DatetimeType;
(function (DatetimeType) {
    /** gYear represents a gregorian calendar year */
    DatetimeType[DatetimeType["gYear"] = 0] = "gYear";
    /**
     * gYearMonth represents a specific gregorian month in a specific gregorian
     * year
     */
    DatetimeType[DatetimeType["gYearMonth"] = 1] = "gYearMonth";
    /**
     * A date is an object with year, month, and day properties just like those
     * of dateTime objects, plus an optional timezone-valued timezone property
     */
    DatetimeType[DatetimeType["date"] = 2] = "date";
    /**
     * dateTime values may be viewed as objects with integer-valued year, month,
     * day, hour and minute properties, a decimal-valued second property, and a
     * boolean timezoned property.
     */
    DatetimeType[DatetimeType["dateTime"] = 3] = "dateTime";
    /** gMonth is a gregorian month that recurs every year */
    DatetimeType[DatetimeType["gMonth"] = 4] = "gMonth";
    /**
     * gMonthDay is a gregorian date that recurs, specifically a day of the year
     * such as the third of May
     */
    DatetimeType[DatetimeType["gMonthDay"] = 5] = "gMonthDay";
    /**
     * gDay is a gregorian day that recurs, specifically a day of the month such
     * as the 5th of the month
     */
    DatetimeType[DatetimeType["gDay"] = 6] = "gDay";
    /** time represents an instant of time that recurs every day */
    DatetimeType[DatetimeType["time"] = 7] = "time";
})(DatetimeType || (DatetimeType = {}));
var Grammar = (function () {
    function Grammar(grammarID, type, production) {
        this.grammarID = grammarID;
        this.type = type;
        this.production = production;
    }
    Grammar.prototype.isTypeCastable = function () {
        return false; // TODO
    };
    Grammar.prototype.isNillable = function () {
        return false; // TODO
    };
    return Grammar;
}());
var Grs = (function () {
    function Grs() {
    }
    return Grs;
}());
var SimpleDatatypeType;
(function (SimpleDatatypeType) {
    SimpleDatatypeType[SimpleDatatypeType["STRING"] = 0] = "STRING";
    SimpleDatatypeType[SimpleDatatypeType["FLOAT"] = 1] = "FLOAT";
    SimpleDatatypeType[SimpleDatatypeType["UNSIGNED_INTEGER"] = 2] = "UNSIGNED_INTEGER";
    SimpleDatatypeType[SimpleDatatypeType["INTEGER"] = 3] = "INTEGER";
    SimpleDatatypeType[SimpleDatatypeType["BOOLEAN"] = 4] = "BOOLEAN";
    SimpleDatatypeType[SimpleDatatypeType["DATETIME"] = 5] = "DATETIME";
    SimpleDatatypeType[SimpleDatatypeType["LIST"] = 6] = "LIST";
})(SimpleDatatypeType || (SimpleDatatypeType = {}));
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
var SimpleDatatype = (function () {
    function SimpleDatatype() {
    }
    return SimpleDatatype;
}());
/*
class DatetimeDatatype extends SimpleDatatype {
    datetimeType : DatetimeType;
}
*/
var Grammars = (function () {
    function Grammars() {
    }
    Grammars.fromJson = function (json) {
        // copy content as is
        var grammars = json;
        // fix enum string to numbers
        for (var i = 0; i < grammars.simpleDatatypes.length; i++) {
            // string to enum
            grammars.simpleDatatypes[i].type = SimpleDatatypeType["" + grammars.simpleDatatypes[i].type];
            //  listType
            if (grammars.simpleDatatypes[i].listType != null) {
                grammars.simpleDatatypes[i].listType = SimpleDatatypeType["" + grammars.simpleDatatypes[i].listType];
            }
            // datetimeType
            if (grammars.simpleDatatypes[i].datetimeType != null) {
                grammars.simpleDatatypes[i].datetimeType = DatetimeType["" + grammars.simpleDatatypes[i].datetimeType];
            }
        }
        // fix GrammarType and EventType
        for (var i = 0; i < grammars.grs.grammar.length; i++) {
            grammars.grs.grammar[i].type = GrammarType["" + grammars.grs.grammar[i].type];
            var prods = grammars.grs.grammar[i].production;
            for (var k = 0; k < prods.length; k++) {
                prods[k].event = EventType["" + prods[k].event];
            }
        }
        return grammars;
    };
    return Grammars;
}());
var AbtractEXICoder = (function () {
    function AbtractEXICoder(grammars, options) {
        this.grammars = grammars;
        // Object.assign(this.grammars, grammars);
        // copy to allow extending grammars and do re-set them
        // TODO use a more elegant method
        if (grammars !== undefined) {
            this.grammarsCopy = JSON.parse(JSON.stringify(grammars));
        }
        this.stringTable = new StringTable();
        this.isStrict = true; // TODO
        this.isByteAligned = false; // default is false
        if (options !== undefined) {
            if ("byteAligned" in options) {
                this.isByteAligned = options["byteAligned"];
            }
        }
    }
    // WARNING: not specified in EXI 1.0 core (is extension)
    AbtractEXICoder.prototype.setSharedStrings = function (sharedStrings) {
        this.sharedStrings = sharedStrings;
        console.log("Set sharedStrings: " + this.sharedStrings);
    };
    AbtractEXICoder.prototype.init = function () {
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
    };
    AbtractEXICoder.prototype.getUri = function (namespace) {
        var namespaceContext; // undefined
        for (var i = 0; i < this.grammars.qnames.namespaceContext.length; i++) {
            if (this.grammars.qnames.namespaceContext[i].uri === namespace) {
                return this.grammars.qnames.namespaceContext[i];
            }
        }
        return namespaceContext;
    };
    // returns the required number of bits for a given number of characteristics
    AbtractEXICoder.prototype.getCodeLength = function (characteristics) {
        if (characteristics < 0) {
            // error
            throw new Error("Error: Code length for " + characteristics + " not possible");
        }
        else if (characteristics < 2) {
            // 0 .. 1
            return 0;
        }
        else if (characteristics < 3) {
            // 2
            return 1;
        }
        else if (characteristics < 5) {
            // 3 .. 4
            return 2;
        }
        else if (characteristics < 9) {
            // 5 .. 8
            return 3;
        }
        else if (characteristics < 17) {
            // 9 .. 16
            return 4;
        }
        else if (characteristics < 33) {
            // 17 .. 32
            return 5;
        }
        else if (characteristics < 35) {
            // 33 .. 64
            return 6;
        }
        else if (characteristics < 129) {
            // 65 .. 128
            return 7;
        }
        else if (characteristics < 257) {
            // 129 .. 256
            return 8;
        }
        else if (characteristics < 513) {
            // 257 .. 512
            return 9;
        }
        else if (characteristics < 1025) {
            // 513 .. 1024
            return 10;
        }
        else if (characteristics < 2049) {
            // 1025 .. 2048
            return 11;
        }
        else if (characteristics < 4097) {
            // 2049 .. 4096
            return 12;
        }
        else if (characteristics < 8193) {
            // 4097 .. 8192
            return 13;
        }
        else if (characteristics < 16385) {
            // 8193 .. 16384
            return 14;
        }
        else if (characteristics < 32769) {
            // 16385 .. 32768
            return 15;
        }
        else {
            return Math.ceil(Math.log(characteristics) / Math.log(2));
        }
    };
    AbtractEXICoder.prototype.getCodeLengthForGrammar = function (grammar) {
        if (grammar.type === GrammarType.document || grammar.type === GrammarType.fragment) {
            return 0;
        }
        else if (grammar.type === GrammarType.docContent) {
            // TODO DT, CM, PI
            return this.getCodeLength(grammar.production.length);
        }
        else if (grammar.type === GrammarType.docEnd
            || grammar.type === GrammarType.fragmentContent) {
            // TODO CM, PI
            return 0;
        }
        else if (grammar.type === GrammarType.firstStartTagContent) {
            if (this.isStrict) {
                return this.getCodeLength(grammar.production.length
                    + ((grammar.isTypeCastable || grammar.isNillable) ? 1
                        : 0));
            }
            else {
                return this.getCodeLength(grammar.production.length + 1);
            }
        }
        else if (grammar.type === GrammarType.startTagContent || grammar.type === GrammarType.elementContent) {
            // Note: has always second level
            if (this.isStrict) {
                return this.getCodeLength(grammar.production.length);
            }
            else {
                return this.getCodeLength(grammar.production.length + 1);
            }
        }
        else if (grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
            // Note: has always second level
            return this.getCodeLength(grammar.production.length + 1);
        }
        else {
            // unknown grammar type
            throw new Error("Unknown grammar type: " + grammar.type);
        }
    };
    AbtractEXICoder.prototype.get2ndCodeLengthForGrammar = function (grammar) {
        if (grammar.type === GrammarType.builtInStartTagContent) {
            // --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
            // 4 options
            return 2;
        }
        else if (grammar.type === GrammarType.builtInElementContent) {
            // --> second level EE, SE(*), CH, ER?, [CM?, PI?]
            // 3 options
            return 2;
        }
        else {
            // unknown/unhandled grammar type
            throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
        }
    };
    AbtractEXICoder.prototype.get2ndEventCode = function (grammar, event) {
        if (grammar.type === GrammarType.builtInStartTagContent) {
            // --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
            // 4 options
            if (event === EventType.endElement) {
                return 0;
            }
            else if (event === EventType.attributeGeneric) {
                return 1;
            }
            else if (event === EventType.startElementGeneric) {
                return 2;
            }
            else if (event === EventType.charactersGeneric) {
                return 3;
            }
            else {
                throw new Error("Unknown/unhandled 2nd level event: " + event);
            }
        }
        else if (grammar.type === GrammarType.builtInElementContent) {
            // --> second level EE, SE(*), CH, ER?, [CM?, PI?]
            // 3 options
            if (event === EventType.endElement) {
                return 0;
            }
            else if (event === EventType.startElementGeneric) {
                return 1;
            }
            else if (event === EventType.charactersGeneric) {
                return 2;
            }
            else {
                throw new Error("Unknown/unhandled 2nd level event: " + event);
            }
        }
        else {
            // unknown/unhandled grammar type
            throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
        }
    };
    AbtractEXICoder.prototype.get2ndEvent = function (grammar, ec2) {
        if (grammar.type === GrammarType.builtInStartTagContent) {
            // --> second level EE, AT(*), NS?, SC?, SE(*), CH, ER?, [CM?, PI?]
            // 4 options
            switch (ec2) {
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
        }
        else if (grammar.type === GrammarType.builtInElementContent) {
            // --> second level EE, SE(*), CH, ER?, [CM?, PI?]
            // 3 options
            switch (ec2) {
                case 0:
                    return EventType.endElement;
                case 1:
                    return EventType.startElement;
                case 2:
                    return EventType.characters;
                default:
                    throw new Error("Unsupported event-code=" + ec2 + "in " + grammar);
            }
        }
        else {
            // unknown/unhandled grammar type
            throw new Error("Unknown/unhandled 2nd grammar type: " + grammar.type);
        }
    };
    AbtractEXICoder.prototype.getQNameContext = function (namespaceContext, localName) {
        var qnameContext; // undefined by default
        for (var i = 0; i < namespaceContext.qnameContext.length; i++) {
            if (namespaceContext.qnameContext[i].localName === localName) {
                qnameContext = namespaceContext.qnameContext[i];
                return qnameContext;
            }
        }
        return qnameContext;
    };
    AbtractEXICoder.prototype.getGlobalStartElement = function (qnameContext) {
        if (qnameContext.globalElementGrammarID !== undefined) {
            // there is a global (static) element grammar
            return this.grammars.grs.grammar[qnameContext.globalElementGrammarID];
        }
        else {
            // check runtime global element grammars
            var seGrammar; // undefined
            var key = qnameContext.uriID + "," + qnameContext.localNameID;
            if (key in this.runtimeGlobalElements) {
                return this.runtimeGlobalElements[key];
            }
            //			for (var i = 0; i < this.runtimeGlobalElements.length; i++) {
            //				// TODO retrieve the right one
            //			}
            //			if(seGrammar === undefined) {
            // create Built-in Element Grammar (ids smaller than zero)
            // var id = ((this.runtimeGrammars.length*2)+1) * (-1);
            var id = (this.runtimeGrammars.length + 1) * (-1);
            seGrammar = new Grammar(id, GrammarType.builtInStartTagContent, new Production[0]);
            var p = new Production[0];
            var p0 = new Production(EventType.endElement, -1);
            p.push(p0);
            var elementContent = new Grammar(id - 1, GrammarType.builtInElementContent, p);
            elementContent["elementContent"] = elementContent;
            seGrammar["elementContent"] = elementContent;
            this.runtimeGlobalElements[key] = seGrammar;
            this.runtimeGrammars.push(seGrammar); // e.g., -1
            this.runtimeGrammars.push(elementContent); // e.g., -2
            return seGrammar;
        }
    };
    return AbtractEXICoder;
}());
/*******************************************************************************
 *
 * D E C O D E R - P A R T
 *
 ******************************************************************************/
var BitInputStream = (function () {
    function BitInputStream(arrayBuffer) {
        // const
        this.ERROR_EOF = -3;
        /** Current byte buffer */
        this.buffer = 0;
        /** Remaining bit capacity in current byte buffer */
        this.capacity = 0;
        /** byte array next position in array */
        this.pos = 0;
        /** error flag */
        this.errn = 0;
        this.uint8Array = arrayBuffer;
    }
    /**
     * If buffer is empty, read byte from underlying byte array
     */
    BitInputStream.prototype.readBuffer = function () {
        if (this.capacity === 0) {
            if (this.uint8Array.length > this.pos) {
                this.buffer = this.uint8Array[this.pos++];
                this.capacity = 8; // bits
            }
            else {
                this.errn = this.ERROR_EOF; // EOF
            }
        }
    };
    /**
     * Decodes and returns an n-bit unsigned integer.
     */
    BitInputStream.prototype.decodeNBitUnsignedInteger = function (nbits, byteAligned) {
        if (byteAligned !== undefined && byteAligned) {
            while (nbits % 8 !== 0) {
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
        }
        else {
            if (nbits < 0) {
                throw new Error("Error in decodeNBitUnsignedInteger, nbits = " + nbits);
            }
            else if (nbits === 0) {
                return 0;
            }
            else {
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
                    }
                    else if (this.capacity === 0 && nbits === 8) {
                        /* possible to read direct byte, nothing else to do */
                        return this.uint8Array[this.pos];
                    }
                    else {
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
    };
    /**
     * Decode an arbitrary precision non negative integer using a sequence of
     * octets. The most significant bit of the last octet is set to zero to
     * indicate sequence termination. Only seven bits per octet are used to
     * store the integer's value.
     */
    BitInputStream.prototype.decodeUnsignedInteger = function () {
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
    };
    /**
     * Decode an arbitrary precision integer using a sign bit followed by a
     * sequence of octets. The most significant bit of the last octet is set to
     * zero to indicate sequence termination. Only seven bits per octet are used
     * to store the integer's value.
     */
    BitInputStream.prototype.decodeInteger = function (byteAligned) {
        if (this.decodeNBitUnsignedInteger(1, byteAligned) === 0) {
            // positive
            return this.decodeUnsignedInteger();
        }
        else {
            // For negative values, the Unsigned Integer holds the
            // magnitude of the value minus 1
            return (-(this.decodeUnsignedInteger() + 1));
        }
    };
    /**
     * Decode the characters of a string whose length (#code-points) has already
     * been read.
     *
     * @return The character sequence as a string.
     */
    BitInputStream.prototype.decodeStringOnly = function (length) {
        var s = "";
        var i;
        for (i = 0; i < length; i++) {
            var codePoint = this.decodeUnsignedInteger();
            s += String.fromCharCode(codePoint);
        }
        return s;
    };
    /**
     * Decode a string as a length-prefixed sequence of UCS codepoints, each of
     * which is encoded as an integer.
     *
     *  @return The character sequence as a string.
     */
    BitInputStream.prototype.decodeString = function () {
        return this.decodeStringOnly(this.decodeUnsignedInteger());
    };
    return BitInputStream;
}());
var EXIDecoder = (function (_super) {
    __extends(EXIDecoder, _super);
    function EXIDecoder(grammars, options) {
        var _this = _super.call(this, grammars, options) || this;
        _this.decodeElementContext = function (grammar, elementNamespaceID, elementLocalNameID) {
            var popStack = false;
            while (!popStack) {
                var codeLength = this.getCodeLengthForGrammar(grammar);
                var ec = this.bitStream.decodeNBitUnsignedInteger(codeLength, this.byteAligned); //
                // console.log("\t" + "Event Code == " + ec );
                var event_1 = void 0;
                var prod = void 0;
                if (ec >= grammar.production.length) {
                    // second level
                    var codeLength2 = this.get2ndCodeLengthForGrammar(grammar);
                    var ec2 = this.bitStream.decodeNBitUnsignedInteger(codeLength2, this.byteAligned); //
                    event_1 = this.get2ndEvent(grammar, ec2);
                }
                else {
                    prod = grammar.production[ec];
                    event_1 = prod.event;
                }
                var nextGrammar;
                if (prod !== undefined) {
                    if (prod.nextGrammarID >= 0) {
                        // static grammars
                        nextGrammar = this.grammars.grs.grammar[prod.nextGrammarID];
                    }
                    else {
                        // runtime grammars
                        var rid = (prod.nextGrammarID + 1) * (-1);
                        nextGrammar = this.runtimeGrammars[rid];
                    }
                }
                // console.log("\t" + "Event Production " + prod.event);
                switch (event_1) {
                    case EventType.startDocument:
                        console.log("> SD");
                        var i;
                        for (i = 0; i < this.eventHandler.length; i++) {
                            var eh = this.eventHandler[i];
                            eh.startDocument();
                        }
                        break;
                    case EventType.endDocument:
                        console.log("< ED");
                        var i;
                        for (i = 0; i < this.eventHandler.length; i++) {
                            var eh = this.eventHandler[i];
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
                        var seGrammar;
                        var qnameContext;
                        var namespaceContext;
                        if (prod !== undefined) {
                            // SE and SE_NS
                            namespaceContext = this.grammars.qnames.namespaceContext[prod.startElementNamespaceID];
                        }
                        if (event_1 == EventType.startElement) {
                            seGrammar = this.grammars.grs.grammar[prod.startElementGrammarID];
                            qnameContext = namespaceContext.qnameContext[prod.startElementLocalNameID];
                            console.log(">> SE (" + qnameContext.localName + ")");
                        }
                        else if (event_1 == EventType.startElementNS) {
                            // SE_NS
                            // decode local-name
                            qnameContext = this.decodeLocalName(namespaceContext);
                            console.log(">> SE_NS (" + namespaceContext.uri + ", " + qnameContext.localName + ")");
                            seGrammar = this.getGlobalStartElement(qnameContext);
                        }
                        else {
                            // SE(*)
                            qnameContext = this.decodeQName();
                            //					seGrammar = this.getGlobalStartElement(qnameContext);
                            //					nextGrammar = grammar.elementContent; // TODO check which grammar it is (BuiltIn?)
                            if (grammar.type === GrammarType.builtInStartTagContent || grammar.type === GrammarType.builtInElementContent) {
                                seGrammar = this.getGlobalStartElement(qnameContext);
                                nextGrammar = grammar.elementContent; // TODO check which grammar it is (BuiltIn?)
                                console.log("NextGrammar after SE(*) is " + nextGrammar);
                                // learn SE
                                var ngX = new Production(EventType.startElement, grammar.elementContent.grammarID);
                                grammar.production.push(ngX);
                                ngX.startElementGrammarID = seGrammar.grammarID;
                                ngX.startElementNamespaceID = qnameContext.uriID;
                                ngX.startElementLocalNameID = qnameContext.localNameID;
                                //ngX.nextGrammarID = grammar.elementContent.grammarID;
                                grammar.production.push(ngX);
                            }
                            else {
                                throw new Error("Unsupported grammar-type = " + grammar.type + " for SE " + qnameContext.localName);
                            }
                        }
                        var i;
                        for (i = 0; i < this.eventHandler.length; i++) {
                            var eh = this.eventHandler[i];
                            var uri = this.grammars.qnames.namespaceContext[qnameContext.uriID].uri;
                            // console.log("inform handler (" + uri + ", " + qnameContext.localName + ")");
                            eh.startElement(uri, qnameContext.localName);
                        }
                        console.log("seGrammar=" + seGrammar + ", startElementNamespaceID=" + qnameContext.uriID + ", startElementLocalNameID=" + qnameContext.localNameID);
                        this.decodeElementContext(seGrammar, qnameContext.uriID, qnameContext.localNameID); // prod.startElementNamespaceID, prod.startElementLocalNameID
                        break;
                    case EventType.endElement:
                        var namespaceContextEE = this.grammars.qnames.namespaceContext[elementNamespaceID];
                        var qnameContextEE = namespaceContextEE.qnameContext[elementLocalNameID];
                        console.log("<< EE (" + qnameContextEE.localName + ")");
                        var i;
                        for (i = 0; i < this.eventHandler.length; i++) {
                            var eh = this.eventHandler[i];
                            eh.endElement(namespaceContextEE.uri, qnameContextEE.localName);
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
                        var datatype = this.grammars.simpleDatatypes[prod.attributeDatatypeID];
                        // console.log("\t" + "Attribute datatype " + datatype );
                        var namespaceContextA = this.grammars.qnames.namespaceContext[prod.attributeNamespaceID];
                        var qnameContextA = namespaceContextA.qnameContext[prod.attributeLocalNameID];
                        console.log("\t" + "AT (" + qnameContextA.localName + ")");
                        this.decodeDatatypeValue(datatype, prod.attributeNamespaceID, prod.attributeLocalNameID, false);
                        break;
                    case EventType.characters:
                        // console.log("\t" + "Characters datatypeID " +
                        // prod.charactersDatatypeID );
                        var datatype = this.grammars.simpleDatatypes[prod.charactersDatatypeID];
                        // console.log("\t" + "Characters datatype " + datatype );
                        console.log("\t" + "CH");
                        this.decodeDatatypeValue(datatype, elementNamespaceID, elementLocalNameID, true);
                        break;
                    default:
                        console.log("\t" + "Unknown event " + event_1);
                        throw new Error("Unknown event " + event_1);
                }
                // console.log("\t" + "Event NextGrammarId " + prod.nextGrammarID);
                grammar = nextGrammar; // grammars.grs.grammar[prod.nextGrammarID];
            }
        };
        return _this;
    }
    EXIDecoder.prototype.registerEventHandler = function (handler) {
        this.eventHandler.push(handler);
    };
    EXIDecoder.prototype.decodeHeader = function () {
        // TODO cookie
        var distBits = this.bitStream.decodeNBitUnsignedInteger(2, this.isByteAligned); // Distinguishing
        // Bits
        if (distBits != 2) {
            throw new Error("Distinguishing Bits are " + distBits);
        }
        var presBit = this.bitStream.decodeNBitUnsignedInteger(1, this.isByteAligned); // Presence
        // Bit for EXI Options
        if (presBit != 0) {
            throw new Error("Do not support EXI Options in header");
        }
        // TODO continuos e.g., Final version 16 == 0 1111 0000
        var formatVersion = this.bitStream.decodeNBitUnsignedInteger(5, this.isByteAligned); // Format
        // Version
        if (formatVersion != 0) {
            throw new Error("Do not support format version " + formatVersion);
        }
        return 0;
    };
    EXIDecoder.prototype.decodeDatatypeValue = function (datatype, namespaceID, localNameID, isCharactersEvent) {
        // Note: qnameContext == null --> CHARACTERS event
        if (datatype.type === "STRING") {
            this.decodeDatatypeValueString(namespaceID, localNameID, isCharactersEvent);
        }
        else if (datatype.type === "UNSIGNED_INTEGER") {
            this.decodeDatatypeValueUnsignedInteger(namespaceID, localNameID, isCharactersEvent);
        }
        else if (datatype.type === "INTEGER") {
            this.decodeDatatypeValueInteger(namespaceID, localNameID, isCharactersEvent);
        }
        else if (datatype.type === "FLOAT") {
            this.decodeDatatypeValueFloat(namespaceID, localNameID, isCharactersEvent);
        }
        else if (datatype.type === "BOOLEAN") {
            this.decodeDatatypeValueBoolean(namespaceID, localNameID, isCharactersEvent);
        }
        else if (datatype.type === "DATETIME") {
            this.decodeDatatypeValueDateTime(datatype.datetimeType, namespaceID, localNameID, isCharactersEvent);
        }
        else if (datatype.type === "LIST") {
            var sList = "";
            var listLength = this.bitStream.decodeUnsignedInteger();
            console.log("\t" + " LIST with length " + listLength);
            for (var i = 0; i < this.eventHandler.length; i++) {
                var eh = this.eventHandler[i];
                if (isCharactersEvent) {
                    // eh.characters(sList);
                    for (var i = 0; i < listLength; i++) {
                        if (datatype.listType === "STRING") {
                            this.decodeDatatypeValueString(namespaceID, localNameID, true);
                            eh.characters(" ");
                        }
                        else if (datatype.listType === "UNSIGNED_INTEGER") {
                            this.decodeDatatypeValueUnsignedInteger(namespaceID, localNameID, true);
                            eh.characters(" ");
                        }
                        else if (datatype.listType === "INTEGER") {
                            this.decodeDatatypeValueInteger(namespaceID, localNameID, true);
                            eh.characters(" ");
                        }
                        else if (datatype.listType === "FLOAT") {
                            this.decodeDatatypeValueFloat(namespaceID, localNameID, true);
                            eh.characters(" ");
                        }
                        else if (datatype.listType === "BOOLEAN") {
                            this.decodeDatatypeValueBoolean(namespaceID, localNameID, true);
                            eh.characters(" ");
                        }
                        else {
                            throw new Error("Unsupported list datatype: " + datatype.listType);
                        }
                    }
                }
                else {
                    // Note: we need to change the process so that a values is returned instead!!
                    throw new Error("Unsupported LIST datatype attribute!!");
                }
            }
        }
        else {
            throw new Error("Unsupported datatype: " + datatype.type);
        }
    };
    EXIDecoder.prototype.decodeDatatypeValueString = function (namespaceID, localNameID, isCharactersEvent) {
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
                }
                else {
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
            }
            else {
                var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
                var qnameContext = namespaceContext.qnameContext[localNameID];
                eh.attribute(namespaceContext.uri, qnameContext.localName, s);
            }
        }
    };
    EXIDecoder.prototype.decodeDatatypeValueUnsignedInteger = function (namespaceID, localNameID, isCharactersEvent) {
        var uint = this.bitStream.decodeUnsignedInteger();
        console.log("\t" + " UNSIGNED_INTEGER = " + uint);
        for (var i = 0; i < this.eventHandler.length; i++) {
            var eh = this.eventHandler[i];
            if (isCharactersEvent) {
                eh.characters(uint + "");
            }
            else {
                var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
                var qnameContext = namespaceContext.qnameContext[localNameID];
                eh.attribute(namespaceContext.uri, qnameContext.localName, uint + "");
            }
        }
    };
    EXIDecoder.prototype.decodeDatatypeValueInteger = function (namespaceID, localNameID, isCharactersEvent) {
        var int = this.bitStream.decodeInteger(this.isByteAligned);
        console.log("\t" + " INTEGER = " + int);
        var i;
        for (i = 0; i < this.eventHandler.length; i++) {
            var eh = this.eventHandler[i];
            if (isCharactersEvent) {
                eh.characters(int + "");
            }
            else {
                var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
                var qnameContext = namespaceContext.qnameContext[localNameID];
                eh.attribute(namespaceContext.uri, qnameContext.localName, int + "");
            }
        }
    };
    EXIDecoder.prototype.decodeDatatypeValueFloat = function (namespaceID, localNameID, isCharactersEvent) {
        var mantissa = this.bitStream.decodeInteger(this.isByteAligned);
        var exponent = this.bitStream.decodeInteger(this.isByteAligned);
        console.log("\t" + " float = " + mantissa + "E" + exponent);
        var i;
        for (i = 0; i < this.eventHandler.length; i++) {
            var eh = this.eventHandler[i];
            if (isCharactersEvent) {
                eh.characters(mantissa + "E" + exponent);
            }
            else {
                var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
                var qnameContext = namespaceContext.qnameContext[localNameID];
                eh.attribute(namespaceContext.uri, qnameContext.localName, mantissa + "E"
                    + exponent);
            }
        }
    };
    EXIDecoder.prototype.decodeDatatypeValueBoolean = function (namespaceID, localNameID, isCharactersEvent) {
        var b = this.bitStream.decodeNBitUnsignedInteger(1, this.isByteAligned) === 0 ? false
            : true;
        console.log("\t" + " boolean = " + b);
        for (var i = 0; i < this.eventHandler.length; i++) {
            var eh = this.eventHandler[i];
            if (isCharactersEvent) {
                eh.characters(b + "");
            }
            else {
                var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
                var qnameContext = namespaceContext.qnameContext[localNameID];
                eh.attribute(namespaceContext.uri, qnameContext.localName, b + "");
            }
        }
    };
    EXIDecoder.prototype.decodeDatatypeValueDateTime = function (datetimeType, namespaceID, localNameID, isCharactersEvent) {
        var year = 0, monthDay = 0, time = 0, fractionalSecs = 0;
        var presenceFractionalSecs = false;
        var sDatetime = "";
        if (datetimeType === DatetimeType.date) {
            // YEAR_OFFSET = 2000
            // NUMBER_BITS_MONTHDAY = 9
            // MONTH_MULTIPLICATOR = 32
            year = this.bitStream.decodeInteger(this.isByteAligned) + 2000;
            sDatetime += year;
            monthDay = this.bitStream.decodeNBitUnsignedInteger(9, this.isByteAligned);
            var month = Math.floor(monthDay / 32);
            if (month < 10) {
                sDatetime += "-0" + month;
            }
            else {
                sDatetime += "-" + month;
            }
            var day = monthDay - (month * 32);
            sDatetime += "-" + day;
        }
        else {
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
            }
            else {
                var namespaceContext = this.grammars.qnames.namespaceContext[namespaceID];
                var qnameContext = namespaceContext.qnameContext[localNameID];
                eh.attribute(namespaceContext.uri, qnameContext.localName, sDatetime);
            }
        }
    };
    EXIDecoder.prototype.decodeQName = function () {
        // decode uri & local-name
        return this.decodeLocalName(this.decodeUri());
    };
    EXIDecoder.prototype.decodeUri = function () {
        var n = this.getCodeLength(this.grammars.qnames.namespaceContext.length + 1); // numberEntries+1
        var uriID = this.bitStream.decodeNBitUnsignedInteger(n, this.isByteAligned);
        console.log("n = " + n + ", uriID = " + uriID);
        var namespaceContext;
        if (uriID == 0) {
            // string value was not found
            // ==> zero (0) as an n-nit unsigned integer
            // followed by uri encoded as string
            var uri = this.bitStream.decodeString();
            console.log("decoded uri string = '" + uri + "'");
            // after encoding string value is added to table
            namespaceContext = { "uriID": this.grammars.qnames.namespaceContext.length, "uri": uri };
            this.grammars.qnames.namespaceContext.push(namespaceContext);
        }
        else {
            // string value found
            // ==> value(i+1) is encoded as n-bit unsigned integer
            namespaceContext = this.grammars.qnames.namespaceContext[uriID - 1];
            console.log("found existing uri = '" + namespaceContext.uri + "'");
        }
        return namespaceContext;
    };
    EXIDecoder.prototype.decodeLocalName = function (namespaceContext) {
        var length = this.bitStream.decodeUnsignedInteger();
        var qnameContext;
        if (length > 0) {
            // string value was not found in local partition
            // ==> string literal is encoded as a String
            // with the length of the string incremented by one
            var localName = this.bitStream.decodeStringOnly(length - 1);
            // After encoding the string value, it is added to the string table
            // partition and assigned the next available compact identifier.
            qnameContext = { "uriID": namespaceContext.uriID, "localNameID": namespaceContext.qnameContext.length, "localName": localName };
            console.log("create new runtime qnameContext = '" + qnameContext + "'");
            namespaceContext.qnameContext.push(qnameContext);
        }
        else {
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
    };
    EXIDecoder.prototype.decode = function (arrayBuffer) {
        this.init();
        this.bitStream = new BitInputStream(arrayBuffer);
        console.log("JSON Grammars: " + this.grammars);
        console.log("\t" + "Number of NamespaceContexts"
            + Object.keys(this.grammars.qnames.namespaceContext).length);
        // console.log("\t" + grammars.uris);
        console.log("\t" + "numberOfUris:  " + this.grammars.qnames.namespaceContext.length);
        console.log("\t" + "numberOfQNames:" + this.grammars.qnames.numberOfQNames);
        console.log("EXI: " + arrayBuffer + " len=" + arrayBuffer.byteLength);
        // process header
        var errn = this.decodeHeader();
        if (errn === 0) {
            // process EXI body
            // Document grammar
            console.log("\t" + "number of grammars: "
                + this.grammars.grs.grammar.length);
            console.log("\t" + "Document grammar ID: "
                + this.grammars.grs.documentGrammarID);
            var docGr = this.grammars.grs.grammar[this.grammars.grs.documentGrammarID];
            this.decodeElementContext(docGr, -1, -1);
        }
        return errn;
    };
    return EXIDecoder;
}(AbtractEXICoder));
var EventHandler = (function () {
    function EventHandler() {
    }
    return EventHandler;
}());
/* allows to retrieve XML by registering it as decoder handler */
var XMLEventHandler = (function (_super) {
    __extends(XMLEventHandler, _super);
    // xmlDecls : XMLDeclarations[];
    function XMLEventHandler() {
        return _super.call(this) || this;
    }
    XMLEventHandler.prototype.getXML = function () {
        return this.xml;
    };
    XMLEventHandler.prototype.getPrefix = function (namespace) {
        // TODO more accurate namespace/prefix handling
        var pfx = "";
        if (namespace === undefined || namespace.length === 0) {
        }
        else {
            // check if declared already
            if (this.xmlDecls[namespace] != null) {
                // get existing prefix
                // TODO assumption declared already (Note: not always the case for nested elements!!!)
                pfx = this.xmlDecls[namespace];
            }
            else {
                // create new prefix
                pfx = "ns" + this.xmlDecls.length;
                this.xmlDecls[namespace] = pfx;
            }
        }
        return pfx;
    };
    XMLEventHandler.prototype.startDocument = function () {
        this.xml = "";
        this.xmlDecls = null; //  [undefined, undefined]; // {"cnt": 0, "decls": {}};
        this.seOpen = false;
    };
    XMLEventHandler.prototype.endDocument = function () {
    };
    XMLEventHandler.prototype.startElement = function (namespace, localName) {
        if (this.seOpen) {
            this.xml += ">";
        }
        var pfx = this.getPrefix(namespace);
        if (pfx.length > 0) {
            this.xml += "<" + pfx + ":" + localName;
        }
        else {
            this.xml += "<" + localName;
        }
        this.seOpen = true;
        if (pfx.length > 0) {
            this.xml += " xmlns:" + pfx + "='" + namespace + "'";
        }
    };
    XMLEventHandler.prototype.endElement = function (namespace, localName) {
        if (this.seOpen) {
            this.xml += ">";
            this.seOpen = false;
        }
        var pfx = this.getPrefix(namespace);
        if (pfx.length > 0) {
            this.xml += "</" + pfx + ":" + localName + ">";
        }
        else {
            this.xml += "</" + localName + ">";
        }
    };
    XMLEventHandler.prototype.characters = function (chars) {
        if (this.seOpen) {
            this.xml += ">";
            this.seOpen = false;
        }
        this.xml += chars;
    };
    XMLEventHandler.prototype.attribute = function (namespace, localName, value) {
        this.xml += " " + localName + "=\"" + value + "\"";
    };
    return XMLEventHandler;
}(EventHandler));
/*******************************************************************************
 *
 * E N C O D E R - P A R T
 *
 ******************************************************************************/
var BitOutputStream = (function () {
    function BitOutputStream() {
        /** array buffer */
        this.uint8Array = new Uint8Array(8); // initial size
        /** Current byte buffer */
        this.buffer = 0;
        /** Remaining bit capacity in current byte buffer */
        this.capacity = 8;
        /** Fully-written bytes */
        this.len = 0;
        /** error flag */
        this.errn = 0;
    }
    /* internal: increases buffer if array is not sufficient anymore */
    BitOutputStream.prototype.checkBuffer = function () {
        if (this.len >= this.uint8Array.length) {
            // double size
            var uint8ArrayNew = new Uint8Array(this.uint8Array.length * 2);
            // copy (TODO is there a better way?)
            for (var i = 0; i < this.uint8Array.length; i++) {
                uint8ArrayNew[i] = this.uint8Array[i];
            }
            this.uint8Array = uint8ArrayNew;
        }
    };
    BitOutputStream.prototype.getUint8Array = function () {
        return this.uint8Array;
    };
    BitOutputStream.prototype.getUint8ArrayLength = function () {
        return this.len;
    };
    /**
     * If there are some unwritten bits, pad them if necessary and write them
     * out.
     */
    BitOutputStream.prototype.align = function () {
        if (this.capacity < 8) {
            this.checkBuffer();
            this.uint8Array[this.len] = this.buffer << this.capacity;
            this.capacity = 8;
            this.buffer = 0;
            this.len++;
        }
    };
    /**
     * Encode n-bit unsigned integer. The n least significant bits of parameter
     * b starting with the most significant, i.e. from left to right.
     */
    BitOutputStream.prototype.encodeNBitUnsignedInteger = function (b, n, byteAligned) {
        if (byteAligned !== undefined && byteAligned) {
            while (n % 8 !== 0) {
                n++;
            }
            // TODO to check why we can't combine bit and byteAligned
            if (n === 0) {
            }
            else if (n < 9) {
                // 1 byte
                this.encodeNBitUnsignedInteger(b & 0xff, 8, byteAligned);
            }
            else if (n < 17) {
                // 2 bytes
                this.encodeNBitUnsignedInteger(b & 0x00ff, 8, byteAligned);
                this.encodeNBitUnsignedInteger((b & 0xff00) >> 8, 8, byteAligned);
            }
            else if (n < 25) {
                // 3 bytes
                this.encodeNBitUnsignedInteger(b & 0x0000ff, 8, byteAligned);
                this.encodeNBitUnsignedInteger((b & 0x00ff00) >> 8, 8, byteAligned);
                this.encodeNBitUnsignedInteger((b & 0xff0000) >> 16, 8, byteAligned);
            }
            else if (n < 33) {
                // 4 bytes
                this.encodeNBitUnsignedInteger(b & 0x000000ff, 8, byteAligned);
                this.encodeNBitUnsignedInteger((b & 0x0000ff00) >> 8, 8, byteAligned);
                this.encodeNBitUnsignedInteger((b & 0x00ff0000) >> 16, 8, byteAligned);
                this.encodeNBitUnsignedInteger((b & 0xff000000) >> 24, 8, byteAligned);
            }
            else {
                throw new Error("nbit = " + n + " exceeds supported value range");
            }
        }
        else {
            if (n === 0) {
            }
            else if (n <= this.capacity) {
                // all bits fit into the current buffer
                this.buffer = (this.buffer << n) | (b & (0xff >> (8 - n)));
                this.capacity -= n;
                if (this.capacity === 0) {
                    this.checkBuffer();
                    this.uint8Array[this.len] = this.buffer;
                    this.capacity = 8;
                    this.len++;
                }
            }
            else {
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
    };
    /**
     * Returns the least number of 7 bit-blocks that is needed to represent the
     * int <param>n</param>. Returns 1 if <param>n</param> is 0.
     *
     * @param n
     *            integer value
     *
     */
    BitOutputStream.prototype.numberOf7BitBlocksToRepresent = function (n) {
        /* assert (n >= 0); */
        /* 7 bits */
        if (n < 128) {
            return 1;
        }
        else if (n < 16384) {
            return 2;
        }
        else if (n < 2097152) {
            return 3;
        }
        else if (n < 268435456) {
            return 4;
        }
        else if (n < 0x800000000) {
            return 5;
        }
        else if (n < 0x40000000000) {
            return 6;
        }
        else if (n < 0x2000000000000) {
            return 7;
        }
        else if (n < 0x100000000000000) {
            return 8;
        }
        else if (n < 0x8000000000000000) {
            return 9;
        }
        else {
            // long, 64 bits
            return 10;
        }
    };
    BitOutputStream.prototype.shiftRight = function (n, bits) {
        for (var i = 0; i < bits; i++) {
            n /= 2;
        }
        n = Math.floor(n);
        return n;
    };
    /**
     * Encode an arbitrary precision non negative integer using a sequence of
     * octets. The most significant bit of the last octet is set to zero to
     * indicate sequence termination. Only seven bits per octet are used to
     * store the integer's value.
     */
    // Note: JavaScript shift operator works till 32 bits only!!
    BitOutputStream.prototype.encodeUnsignedInteger = function (n, byteAligned) {
        if (n < 128) {
            // write value as is
            this.encodeNBitUnsignedInteger(n, 8, byteAligned);
        }
        else {
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
    };
    /**
     * Encode an arbitrary precision integer using a sign bit followed by a
     * sequence of octets. The most significant bit of the last octet is set to
     * zero to indicate sequence termination. Only seven bits per octet are used
     * to store the integer's value.
     */
    BitOutputStream.prototype.encodeInteger = function (n, byteAligned) {
        // signalize sign
        if (n < 0) {
            this.encodeNBitUnsignedInteger(1, 1, byteAligned);
            // For negative values, the Unsigned Integer holds the
            // magnitude of the value minus 1
            this.encodeUnsignedInteger((-n) - 1, byteAligned);
        }
        else {
            this.encodeNBitUnsignedInteger(0, 1, byteAligned);
            this.encodeUnsignedInteger(n, byteAligned);
        }
    };
    /**
     * Encode a string as a sequence of codepoints, each of which is encoded as
     * an unsigned integer.
     */
    BitOutputStream.prototype.encodeStringOnly = function (str, byteAligned) {
        // str.charCodeAt(0); // Return the Unicode of character in a string
        for (var i = 0; i < str.length; i++) {
            var cp = str.charCodeAt(i);
            this.encodeUnsignedInteger(cp, byteAligned);
        }
    };
    return BitOutputStream;
}());
var ElementContextEntry = (function () {
    function ElementContextEntry(namespaceID, localNameID, grammar) {
        this.namespaceID = namespaceID;
        this.localNameID = localNameID;
        this.grammar = grammar;
    }
    return ElementContextEntry;
}());
var EXIFloat = (function () {
    function EXIFloat() {
        this.exponent = 0;
        this.mantissa = 0;
    }
    return EXIFloat;
}());
;
var DateTimeValue = (function () {
    function DateTimeValue() {
        this.error = 0;
    }
    return DateTimeValue;
}());
var EXIEncoder = (function (_super) {
    __extends(EXIEncoder, _super);
    function EXIEncoder(grammars, options) {
        var _this = _super.call(this, grammars, options) || this;
        _this.encodeDatatypeValueUnsignedInteger = function (value, namespaceID, localNameID) {
            console.log("\t" + " UNSIGNED_INTEGER = " + value);
            this.bitStream.encodeUnsignedInteger(value);
        };
        _this.encodeDatatypeValueInteger = function (value, namespaceID, localNameID) {
            console.log("\t" + " INTEGER = " + value);
            this.bitStream.encodeInteger(value, this.byteAligned);
        };
        _this.encodeDatatypeValueFloat = function (value, namespaceID, localNameID) {
            var f = parseFloat(value);
            // 
            console.log("\t" + " floatA = " + f);
            // var fl = decodeIEEE64(f);
            // var fl = getNumberParts(f);
            var fl = this.getEXIFloat(f);
            // mantissa followed by exponent
            this.bitStream.encodeInteger(fl.mantissa, this.byteAligned);
            this.bitStream.encodeInteger(fl.exponent, this.byteAligned);
            console
                .log("\t" + " floatB = " + fl.mantissa + " E "
                + fl.exponent);
        };
        return _this;
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
    EXIEncoder.prototype.encodeXmlDocument = function (xmlDoc) {
        this.startDocument();
        // documentElement always represents the root node
        this.processXMLElement(xmlDoc.documentElement);
        this.endDocument();
    };
    EXIEncoder.prototype.encodeHeader = function () {
        // TODO cookie
        // Distinguishing Bits 10
        this.bitStream.encodeNBitUnsignedInteger(2, 2, this.isByteAligned);
        // Presence Bit for EXI Options 0
        this.bitStream.encodeNBitUnsignedInteger(0, 1, this.isByteAligned);
        // EXI Format Version 0-0000
        this.bitStream.encodeNBitUnsignedInteger(0, 1, this.isByteAligned); // preview false
        this.bitStream.encodeNBitUnsignedInteger(0, 4, this.isByteAligned);
        return 0;
    };
    EXIEncoder.prototype.processXMLElement = function (el) {
        // console.log("SE " + el.nodeName);
        this.startElement(el.namespaceURI, el.localName);
        if (el.attributes != null && el.attributes.length > 0) {
            if (el.attributes.length > 1) {
                // sorting
                var atts = [];
                for (var i = 0; i < el.attributes.length; i++) {
                    // console.log(" AT " + el.attributes[i].nodeName + " == " +
                    // el.attributes[i].nodeValue);
                    var at = el.attributes.item(i);
                    atts.push(at.localName);
                }
                // sort according localName
                // TODO in case also for namespace URI
                atts.sort();
                // write in sorted order
                for (var i = 0; i < atts.length; i++) {
                    var at = el.getAttributeNode(atts[i]);
                    if (at != null) {
                        this.attribute(at.namespaceURI, at.localName, at.nodeValue);
                    }
                    else {
                    }
                }
            }
            else {
                // console.log("AT length: " + el.attributes.length);
                // console.log("AT all: " + el.attributes);
                // console.log("AT1 " + el.attributes.item(0));
                var at1 = el.attributes.item(0);
                // console.log("AT2 " + el.attributes[0]);
                this.attribute(at1.namespaceURI, at1.localName, at1.nodeValue);
            }
        }
        var childNodes = el.childNodes;
        if (childNodes != null) {
            // console.log("\tchildNodes.length" + childNodes.length);
            for (var i_1 = 0; i_1 < childNodes.length; i_1++) {
                // Attributes (type 1)
                // Text (type 3)
                var cn = childNodes.item(i_1);
                if (cn.nodeType === 3) {
                    var text = cn.nodeValue;
                    text = text.trim();
                    if (text.length > 0) {
                        // console.log(" Text '" + text + "'");
                        this.characters(text);
                    }
                }
                // Process only element nodes (type 1) further
                if (cn.nodeType === 1) {
                    this.processXMLElement(cn);
                }
            }
        }
        // console.log("EE " + el.nodeName);
        this.endElement();
    };
    EXIEncoder.prototype.getUint8Array = function () {
        return this.bitStream.getUint8Array();
    };
    EXIEncoder.prototype.getUint8ArrayLength = function () {
        return this.bitStream.getUint8ArrayLength();
    };
    EXIEncoder.prototype.startDocument = function () {
        this.init();
        this.bitStream = new BitOutputStream();
        this.elementContext = [];
        this.encodeHeader();
        // set grammar position et cetera
        // Document grammar
        console
            .log("\t" + "number of grammars: "
            + this.grammars.grs.grammar.length);
        console.log("\t" + "Document grammar ID: "
            + this.grammars.grs.documentGrammarID);
        var docGr = this.grammars.grs.grammar[this.grammars.grs.documentGrammarID];
        var ec = -1;
        var prod;
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
            var nextGrammar = this.grammars.grs.grammar[prod.nextGrammarID];
            this.elementContext.push(new ElementContextEntry(-1, -1, nextGrammar));
        }
        else {
            throw new Error("No startDocument event found");
        }
    };
    EXIEncoder.prototype.endDocument = function () {
        var ec = -1;
        var prod;
        var grammar = this.elementContext[this.elementContext.length - 1].grammar;
        for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
            prod = grammar.production[i];
            if (prod.event === EventType.endDocument) {
                ec = i;
            }
        }
        if (ec != -1) {
            // console.log("\t" + "Event Code == " + ec );
            var codeLength = this.getCodeLengthForGrammar(grammar);
            this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
            // pop element stack
            this.elementContext.pop();
        }
        else {
            throw new Error("No endDocument event found");
        }
        if (this.elementContext.length != 0) {
            throw new Error("Element context not balanced");
        }
        this.bitStream.align();
    };
    EXIEncoder.prototype.startElement = function (namespace, localName) {
        if (namespace === null) {
            namespace = "";
        }
        console.log("SE {" + namespace + "}" + localName);
        var isSE = false;
        var isSE_NS = false;
        var isSE_GENERIC = false;
        var namespaceContext;
        var ec = -1;
        var prod;
        var grammar = this.elementContext[this.elementContext.length - 1].grammar;
        var qnameContext;
        for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
            prod = grammar.production[i];
            if (prod.event === EventType.startElement) {
                namespaceContext = this.grammars.qnames.namespaceContext[prod.startElementNamespaceID];
                qnameContext = namespaceContext.qnameContext[prod.startElementLocalNameID];
                if (qnameContext.localName === localName && namespaceContext.uri === namespace) {
                    ec = i;
                    isSE = true;
                }
            }
            else if (prod.event === EventType.startElementNS) {
                namespaceContext = this.grammars.qnames.namespaceContext[prod.startElementNamespaceID];
                if (namespaceContext.uri === namespace) {
                    ec = i;
                    isSE_NS = true;
                }
            }
            else if (prod.event === EventType.startElementGeneric) {
                ec = i;
                isSE_GENERIC = true;
            }
        }
        if (ec != -1) {
            // event-code found
            // console.log("\t" + "Event Code == " + ec );
            var codeLength_1 = this.getCodeLengthForGrammar(grammar);
            this.bitStream.encodeNBitUnsignedInteger(ec, codeLength_1, this.isByteAligned);
            var startElementGrammar = void 0;
            if (isSE || isSE_NS) {
            }
            else if (isSE_GENERIC) {
                throw new Error("TODO StartElement Generic not implemented yet for " + localName);
            }
            else {
                throw new Error("No startElement event found for " + localName);
            }
            // update current element context
            var nextGrammar;
            if (prod.nextGrammarID >= 0) {
                // static grammars
                nextGrammar = this.grammars.grs.grammar[prod.nextGrammarID];
            }
            else {
                // runtime grammars
                var rid = (prod.nextGrammarID + 1) * (-1);
                nextGrammar = this.runtimeGrammars[rid];
            }
            this.elementContext[this.elementContext.length - 1].grammar = nextGrammar;
            console.log("NextGrammar after SE/SE_NS " + localName + " is " + nextGrammar);
            // push new element context
            if (isSE) {
                // SE(uri:localname)
                startElementGrammar = this.grammars.grs.grammar[prod.startElementGrammarID];
            }
            else if (isSE_NS) {
                // SE(uri:*)
                // encode local-name
                qnameContext = this.encodeLocalName(namespaceContext, localName);
                startElementGrammar = this.getGlobalStartElement(qnameContext);
            }
            this.elementContext.push(new ElementContextEntry(namespaceContext.uriID, qnameContext.localNameID, startElementGrammar));
        }
        else {
            // NO event-code found
            if (grammar.type === GrammarType.builtInStartTagContent) {
                // 1st level
                var codeLength = this.getCodeLengthForGrammar(grammar);
                this.bitStream.encodeNBitUnsignedInteger(grammar.production.length, codeLength, this.isByteAligned);
                // 2nd level
                var codeLength = this.get2ndCodeLengthForGrammar(grammar);
                var ec2 = this.get2ndEventCode(grammar, EventType.startElementGeneric);
                this.bitStream.encodeNBitUnsignedInteger(ec2, codeLength, this.isByteAligned); //2 in 2 bits
                // encode qname
                var qnameContext_1 = this.encodeQName(namespace, localName);
                var startElementGrammar = this.getGlobalStartElement(qnameContext_1);
                // learn SE
                var ng = new Production(EventType.startElement, grammar.elementContent.grammarID);
                ng.startElementGrammarID = startElementGrammar.grammarID;
                ng.startElementNamespaceID = qnameContext_1.uriID;
                ng.startElementLocalNameID = qnameContext_1.localNameID;
                ng.nextGrammarID = grammar.elementContent.grammarID;
                // var ng = {"event": "startElement", "startElementGrammarID" : startElementGrammar.grammarID, "startElementNamespaceID" : qnameContext.uriID, "startElementLocalNameID" : qnameContext.localNameID, "nextGrammarID" : grammar.elementContent.grammarID};
                grammar.production.push(ng);
                // update current element context
                this.elementContext[this.elementContext.length - 1].grammar = grammar.elementContent;
                console.log("NextGrammar after SE_Generic_Undefined " + localName + " is " + this.elementContext[this.elementContext.length - 1].grammar);
                this.elementContext.push(new ElementContextEntry(qnameContext_1.uriID, qnameContext_1.localNameID, startElementGrammar));
            }
            else if (grammar.type === GrammarType.builtInElementContent) {
                throw new Error("TODO SE elementContent grammar. grammar.type = " + grammar.type);
            }
            else {
                throw new Error("No startElement event found for " + localName + ". grammar.type = " + grammar.type);
            }
        }
    };
    EXIEncoder.prototype.encodeQName = function (namespace, localName) {
        var namespaceContext = this.encodeUri(namespace);
        return this.encodeLocalName(namespaceContext, localName);
    };
    EXIEncoder.prototype.encodeUri = function (namespace) {
        var n = this.getCodeLength(this.grammars.qnames.namespaceContext.length + 1); // numberEntries+1
        var namespaceContext = this.getUri(namespace);
        if (namespaceContext === undefined) {
            // uri string value was not found
            // ==> zero (0) as an n-nit unsigned integer
            // followed by uri encoded as string
            this.bitStream.encodeNBitUnsignedInteger(0, n, this.isByteAligned);
            this.bitStream.encodeStringOnly(namespace, this.isByteAligned);
            // after encoding string value is added to table
            namespaceContext = new NamespaceContext();
            namespaceContext.uriID = this.grammars.qnames.namespaceContext.length;
            namespaceContext.uri = namespace;
            // namespaceContext = {"uriID": this.grammars.qnames.namespaceContext.length, "uri": namespace};
            this.grammars.qnames.namespaceContext.push(namespaceContext);
        }
        else {
            // string value found
            // ==> value(i+1) is encoded as n-bit unsigned integer
            this.bitStream.encodeNBitUnsignedInteger(namespaceContext.uriID + 1, n, this.isByteAligned);
        }
        return namespaceContext;
    };
    EXIEncoder.prototype.encodeLocalName = function (namespaceContext, localName) {
        var qnameContext = this.getQNameContext(namespaceContext, localName);
        if (qnameContext === undefined) {
            // string value was not found in local partition
            // ==> string literal is encoded as a String
            // with the length of the string incremented by one
            this.bitStream.encodeUnsignedInteger(localName.length + 1, this.isByteAligned);
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
            console.log("create new runtime qnameContext = '" + qnameContext + "'");
            // this.runtimeQNameContexts.push(qnameContext);
            namespaceContext.qnameContext.push(qnameContext);
        }
        else {
            // string value found in local partition
            // ==> string value is represented as zero (0) encoded as an
            // Unsigned Integer followed by an the compact identifier of the
            // string value as an n-bit unsigned integer n is log2 m and m is
            // the number of entries in the string table partition
            this.bitStream.encodeUnsignedInteger(0, this.isByteAligned);
            var n = this.getCodeLength(namespaceContext.qnameContext.length);
            this.bitStream.encodeNBitUnsignedInteger(qnameContext.localNameID, n, this.isByteAligned);
        }
        return qnameContext;
    };
    EXIEncoder.prototype.endElement = function () {
        console.log("EE");
        var ec = -1;
        var prod;
        var grammar = this.elementContext[this.elementContext.length - 1].grammar;
        for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
            prod = grammar.production[i];
            if (prod.event === EventType.endElement) {
                ec = i;
            }
        }
        if (ec != -1) {
            // console.log("\t" + "Event Code == " + ec );
            var codeLength = this.getCodeLengthForGrammar(grammar);
            this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
            // pop element stack
            this.elementContext.pop();
        }
        else {
            throw new Error("No endElement event found");
        }
    };
    EXIEncoder.prototype.attribute = function (namespace, localName, value) {
        if (namespace === null) {
            namespace = "";
        }
        console.log("\tAT {" + namespace + "}" + localName + " == '" + value
            + "'");
        if ("http://www.w3.org/2000/xmlns/" === namespace) {
        }
        else if ("http://www.w3.org/2001/XMLSchema-instance" === namespace) {
        }
        else {
            // normal attribute
            var ec = -1;
            var prod = void 0;
            var grammar = this.elementContext[this.elementContext.length - 1].grammar;
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
                var codeLength = this.getCodeLengthForGrammar(grammar);
                this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
                // write value
                var datatype = this.grammars.simpleDatatypes[prod.attributeDatatypeID];
                this
                    .encodeDatatypeValue(value, datatype, prod.attributeNamespaceID, prod.attributeLocalNameID);
                // update current element context with revised grammar
                var nextGrammar = this.grammars.grs.grammar[prod.nextGrammarID];
                this.elementContext[this.elementContext.length - 1].grammar = nextGrammar;
            }
            else {
                throw new Error("No attribute event found for " + localName);
            }
        }
    };
    EXIEncoder.prototype.characters = function (chars) {
        console.log("\tCharacters '" + chars + "'");
        var ec = -1;
        var prod;
        var grammar = this.elementContext[this.elementContext.length - 1].grammar;
        for (var i = 0; ec === -1 && i < grammar.production.length; i++) {
            prod = grammar.production[i];
            if (prod.event === EventType.characters) {
                ec = i;
            }
        }
        if (ec != -1) {
            // console.log("\t" + "Event Code == " + ec );
            var codeLength = this.getCodeLengthForGrammar(grammar);
            this.bitStream.encodeNBitUnsignedInteger(ec, codeLength, this.isByteAligned);
            // write value
            var datatype = this.grammars.simpleDatatypes[prod.charactersDatatypeID];
            var elementContext = this.elementContext[this.elementContext.length - 1];
            this
                .encodeDatatypeValue(chars, datatype, elementContext.namespaceID, elementContext.localNameID);
            // update current element context with revised grammar
            var nextGrammar = this.grammars.grs.grammar[prod.nextGrammarID];
            this.elementContext[this.elementContext.length - 1].grammar = nextGrammar;
        }
        else {
            //			if(grammar.type === "builtInStartTagContent" || grammar.type === "builtInElementContent" ) {
            //				// 1st level
            //				var codeLength = this.getCodeLengthForGrammar(grammar);
            //				this.bitStream.encodeNBitUnsignedInteger(grammar.production.length, codeLength, this.byteAligned);
            //				// 2nd level
            //				var codeLength = this.get2ndCodeLengthForGrammar(grammar);
            //				var ec2 = this.get2ndEventCode(grammar, "charactersGeneric");
            //				this.bitStream.encodeNBitUnsignedInteger(ec2, codeLength, this.byteAligned);
            //				
            //				// write value
            //				var datatype = {"type": "STRING"};
            //				var elementContext = this.elementContext[this.elementContext.length - 1];
            //				this
            //						.encodeDatatypeValue(
            //								chars,
            //								datatype,
            //								elementContext.namespaceID, elementContext.localNameID);
            //				
            //				// learn CH
            //				// TODO check charactersDatatypeID is STRING
            //				if(this.grammars.simpleTypes[0].type !== "STRING") {
            //					throw new Error("TODO simpleType ID 0 is not STRING");
            //				}
            //				var ng = {"event": "characters",  "charactersDatatypeID" : 0, "nextGrammarID" : grammar.elementContent.grammarID};
            //				grammar.production.push(ng);
            //				
            //				// update current element context
            //				this.elementContext[this.elementContext.length - 1].grammar = grammar.elementContent;
            //			} else {
            throw new Error("No characters event found for '" + chars + "'");
        }
    };
    EXIEncoder.prototype.decimalPlaces = function (num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
            return 0;
        }
        return Math.max(0, 
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
            - (match[2] ? +match[2] : 0));
    };
    EXIEncoder.prototype.isInteger = function (value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
    ;
    // inspired by https://blog.coolmuse.com/2012/06/21/getting-the-exponent-and-mantissa-from-a-javascript-number/
    EXIEncoder.prototype.getEXIFloat = function (value) {
        if (typeof value !== "number") {
            throw new TypeError("value must be a Number");
        }
        var result = new EXIFloat();
        if (value === 0) {
            return result;
        }
        // if ( Number.isInteger(value) ) { // no type-script support
        if (value % 1 === 0) {
            result.mantissa = value;
            return result;
        }
        // not finite?
        if (!isFinite(value)) {
            result.exponent = -16384;
            if (isNaN(value)) {
                result.mantissa = 0;
            }
            else {
                if (value === -Infinity) {
                    result.mantissa = -1;
                }
                else {
                    result.mantissa = +1;
                }
            }
            return result;
        }
        // value = (Number(value)).doubleValue();
        if (MAX_EXI_FLOAT_DIGITS >= 0) {
            value = Number(Number(value).toFixed(MAX_EXI_FLOAT_DIGITS)); // at most XX digits
        }
        // negative?
        var isNegative = false;
        if (value < 0) {
            isNegative = true;
            value = -value;
        }
        var dp = this.decimalPlaces(value);
        // calculate exponent
        if (dp > 0) {
            result.exponent = -dp;
        }
        // calculate mantissa
        var m = value;
        while (dp > 0) {
            m = m * 10;
            dp -= 1;
        }
        result.mantissa = Math.round(m);
        if (isNegative) {
            result.mantissa = -result.mantissa;
        }
        return result;
    };
    /*
    function equalFloat(f1, f2) {
        return ((f1 > f2 ? f1 - f2 : f2 - f1) < (1e-4));
    }
    */
    EXIEncoder.prototype.parseYear = function (sb, dateTimeValue) {
        var sYear;
        var len;
        if (sb.charAt(0) === '-') {
            sYear = sb.substring(0, 5);
            len = 5;
        }
        else {
            sYear = sb.substring(0, 4);
            len = 4;
        }
        var year = parseInt(sYear);
        dateTimeValue.year = year;
        return len;
    };
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
    EXIEncoder.prototype.checkCharacter = function (sb, pos, c, dateTimeValue) {
        if (sb.length > pos && sb.charAt(pos) === c) {
        }
        else {
            dateTimeValue.error = -1;
        }
        return (pos + 1);
    };
    EXIEncoder.prototype.parseMonthDay = function (sb, pos, dateTimeValue) {
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
    };
    EXIEncoder.prototype.encodeDatatypeValue = function (value, datatype, namespaceID, localNameID) {
        if (datatype.type === SimpleDatatypeType.STRING) {
            this.encodeDatatypeValueString(value, namespaceID, localNameID);
        }
        else if (datatype.type === SimpleDatatypeType.UNSIGNED_INTEGER) {
            this.encodeDatatypeValueUnsignedInteger(value, namespaceID, localNameID);
        }
        else if (datatype.type === SimpleDatatypeType.INTEGER) {
            this.encodeDatatypeValueInteger(value, namespaceID, localNameID);
        }
        else if (datatype.type === SimpleDatatypeType.FLOAT) {
            this.encodeDatatypeValueFloat(value, namespaceID, localNameID);
        }
        else if (datatype.type === SimpleDatatypeType.BOOLEAN) {
            this.encodeDatatypeValueBoolean(value, namespaceID, localNameID);
        }
        else if (datatype.type === SimpleDatatypeType.DATETIME) {
            // let dtd = <DatetimeDatatype>datatype;
            // this.encodeDatatypeValueDateTime(value, dtd.datetimeType, namespaceID, localNameID);
            this.encodeDatatypeValueDateTime(value, datatype.datetimeType, namespaceID, localNameID);
        }
        else if (datatype.type === SimpleDatatypeType.LIST) {
            var resArray = value.split(" ");
            this.bitStream.encodeUnsignedInteger(resArray.length, this.isByteAligned);
            console.log("\t" + " LIST with length " + resArray.length + ": " + resArray);
            for (var i = 0; i < resArray.length; i++) {
                var v = resArray[i];
                if (datatype.listType === SimpleDatatypeType.STRING) {
                    this.encodeDatatypeValueString(v, namespaceID, localNameID);
                }
                else if (datatype.listType === SimpleDatatypeType.UNSIGNED_INTEGER) {
                    this.encodeDatatypeValueUnsignedInteger(v, namespaceID, localNameID);
                }
                else if (datatype.listType === SimpleDatatypeType.INTEGER) {
                    this.encodeDatatypeValueInteger(v, namespaceID, localNameID);
                }
                else if (datatype.listType === SimpleDatatypeType.FLOAT) {
                    this.encodeDatatypeValueFloat(v, namespaceID, localNameID);
                }
                else if (datatype.listType === SimpleDatatypeType.BOOLEAN) {
                    this.encodeDatatypeValueBoolean(v, namespaceID, localNameID);
                }
                else {
                    throw new Error("Unsupported list datatype: " + datatype.listType + " for value " + value);
                }
            }
        }
        else {
            throw new Error("Unsupported datatype: " + datatype.type + " for value " + value);
        }
    };
    EXIEncoder.prototype.encodeDatatypeValueString = function (value, namespaceID, localNameID) {
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
        }
        else {
            if (stEntry.namespaceID === namespaceID && stEntry.localNameID === localNameID) {
                // local hit
                this.bitStream.encodeUnsignedInteger(0, this.isByteAligned);
                var n = this.getCodeLength(this.stringTable
                    .getNumberOfLocalStrings(namespaceID, localNameID));
                this.bitStream.encodeNBitUnsignedInteger(stEntry.localValueID, n, this.isByteAligned);
            }
            else {
                // global hit
                this.bitStream.encodeUnsignedInteger(1, this.isByteAligned);
                var n = this.getCodeLength(this.stringTable
                    .getNumberOfGlobalStrings());
                this.bitStream.encodeNBitUnsignedInteger(stEntry.globalValueID, n, this.isByteAligned);
            }
        }
    };
    EXIEncoder.prototype.encodeDatatypeValueBoolean = function (value, namespaceID, localNameID) {
        var b = new Boolean(value);
        if (b) {
            this.bitStream.encodeNBitUnsignedInteger(1, 1, this.isByteAligned);
        }
        else {
            this.bitStream.encodeNBitUnsignedInteger(0, 1, this.isByteAligned);
        }
    };
    EXIEncoder.prototype.encodeDatatypeValueDateTime = function (value, datetimeType, namespaceID, localNameID) {
        var year = 0, monthDay = 0, time = 0, fractionalSecs = 0;
        var presenceFractionalSecs = false;
        var presenceTimezone = false;
        var sDatetime = "";
        if (datetimeType === DatetimeType.date) {
            // [TimeZone]
            // YEAR_OFFSET = 2000
            // NUMBER_BITS_MONTHDAY = 9
            // MONTH_MULTIPLICATOR = 32
            var dateTimeValue = new DateTimeValue();
            var pos = this.parseYear(value, dateTimeValue);
            pos = this.checkCharacter(value, pos, '-', dateTimeValue); // hyphen
            pos = this.parseMonthDay(value, pos, dateTimeValue);
            // TODO timezone
            this.bitStream.encodeInteger(dateTimeValue.year - 2000, this.isByteAligned);
            this.bitStream.encodeNBitUnsignedInteger(dateTimeValue.monthDay, 9, this.isByteAligned);
        }
        else {
            throw new Error("Unsupported datetime type: " + datetimeType);
        }
        // var presenceTimezone = false; // TODO
        if (presenceTimezone) {
            this.bitStream.encodeNBitUnsignedInteger(1, 1, this.isByteAligned);
            throw new Error("Unsupported datetime timezone");
        }
        else {
            this.bitStream.encodeNBitUnsignedInteger(0, 1, this.isByteAligned);
        }
        // console.log("\t" + " presenceTimezone = " + presenceTimezone);
        console.log("\t" + " datetime = " + sDatetime);
    };
    return EXIEncoder;
}(AbtractEXICoder));
