package exificient.js.tests;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;

import javax.script.Bindings;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class EXIficientForXML {

	static final String EXIFICIENT_JS_FOLDER = "./../";
	static final String EXIFICIENT_JS_NAME = "exificient.js";
//	static final String EXIFICIENT_JS4JSON_NAME = "exificient-for-json.js";
	
	static final String NEW_LINE =  System.getProperty("line.separator");
	
	private static void appendContent(File from, Writer to) throws IOException {
		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(from)));

		String aLine;
		while ((aLine = in.readLine()) != null) {
			to.write(aLine);
			to.write(NEW_LINE);
		}
		to.flush();

		in.close();
	}
	
	public static File createMergedJS() throws IOException {
		File mergedFile = File.createTempFile("exificient", ".js");
		
		BufferedWriter out = new BufferedWriter(new FileWriter(mergedFile));
		
		out.append("console = { log: print, warn: print, error: print};"); // avoids console warning
		appendContent(new File(EXIFICIENT_JS_FOLDER + EXIFICIENT_JS_NAME), out);
//		appendContent(new File(EXIFICIENT_JS_FOLDER + EXIFICIENT_JS4JSON_NAME), out);
		
		
		return mergedFile;
	}
	
	public static void main(String... args) throws Throwable {
		
		ScriptEngineManager engineManager = new ScriptEngineManager();
		// ScriptEngine engine = engineManager.getEngineByName("nashorn");
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");
		// engine.eval("function sum(a, b) { return a + b; }");
       
		// merge JS files
		File f =  createMergedJS();
		System.out.println("Created merged JS file: " + f);
		// evaluate JS code
		 engine.eval(new FileReader(f));
//		engine.eval(new FileReader(new File(EXIFICIENT_JS_FOLDER + EXIFICIENT_JS_NAME)));
//		engine.eval(new FileReader(new File(EXIFICIENT_JS_FOLDER + EXIFICIENT_JS4JSON_NAME)));
		
		 // notebook grammars
		String notebookGrammars = "{\"qnames\":{\"numberOfUris\":4,\"numberOfQNames\":59,\"namespaceContext\":[{\"uriID\":\"0\",\"uri\":\"\",\"numberOfLocalNames\":7,\"qnameContext\":[{\"qnameID\":0,\"localNameID\":0,\"localName\":\"Note\",\"globalTypeGrammarID\":6},{\"qnameID\":1,\"localNameID\":1,\"localName\":\"body\"},{\"qnameID\":2,\"localNameID\":2,\"localName\":\"category\"},{\"qnameID\":3,\"localNameID\":3,\"localName\":\"date\",\"globalAttributeDatatypeID\":0},{\"qnameID\":4,\"localNameID\":4,\"localName\":\"note\"},{\"qnameID\":5,\"localNameID\":5,\"localName\":\"notebook\",\"globalElementGrammarID\":5},{\"qnameID\":6,\"localNameID\":6,\"localName\":\"subject\"}]},{\"uriID\":\"1\",\"uri\":\"http://www.w3.org/XML/1998/namespace\",\"numberOfLocalNames\":4,\"qnameContext\":[{\"qnameID\":7,\"localNameID\":0,\"localName\":\"base\"},{\"qnameID\":8,\"localNameID\":1,\"localName\":\"id\"},{\"qnameID\":9,\"localNameID\":2,\"localName\":\"lang\"},{\"qnameID\":10,\"localNameID\":3,\"localName\":\"space\"}]},{\"uriID\":\"2\",\"uri\":\"http://www.w3.org/2001/XMLSchema-instance\",\"numberOfLocalNames\":2,\"qnameContext\":[{\"qnameID\":11,\"localNameID\":0,\"localName\":\"nil\"},{\"qnameID\":12,\"localNameID\":1,\"localName\":\"type\"}]},{\"uriID\":\"3\",\"uri\":\"http://www.w3.org/2001/XMLSchema\",\"numberOfLocalNames\":46,\"qnameContext\":[{\"qnameID\":13,\"localNameID\":0,\"localName\":\"ENTITIES\",\"globalTypeGrammarID\":8},{\"qnameID\":14,\"localNameID\":1,\"localName\":\"ENTITY\",\"globalTypeGrammarID\":9},{\"qnameID\":15,\"localNameID\":2,\"localName\":\"ID\",\"globalTypeGrammarID\":9},{\"qnameID\":16,\"localNameID\":3,\"localName\":\"IDREF\",\"globalTypeGrammarID\":9},{\"qnameID\":17,\"localNameID\":4,\"localName\":\"IDREFS\",\"globalTypeGrammarID\":8},{\"qnameID\":18,\"localNameID\":5,\"localName\":\"NCName\",\"globalTypeGrammarID\":9},{\"qnameID\":19,\"localNameID\":6,\"localName\":\"NMTOKEN\",\"globalTypeGrammarID\":9},{\"qnameID\":20,\"localNameID\":7,\"localName\":\"NMTOKENS\",\"globalTypeGrammarID\":8},{\"qnameID\":21,\"localNameID\":8,\"localName\":\"NOTATION\",\"globalTypeGrammarID\":9},{\"qnameID\":22,\"localNameID\":9,\"localName\":\"Name\",\"globalTypeGrammarID\":9},{\"qnameID\":23,\"localNameID\":10,\"localName\":\"QName\",\"globalTypeGrammarID\":9},{\"qnameID\":24,\"localNameID\":11,\"localName\":\"anySimpleType\",\"globalTypeGrammarID\":9},{\"qnameID\":25,\"localNameID\":12,\"localName\":\"anyType\",\"globalTypeGrammarID\":10},{\"qnameID\":26,\"localNameID\":13,\"localName\":\"anyURI\",\"globalTypeGrammarID\":9},{\"qnameID\":27,\"localNameID\":14,\"localName\":\"base64Binary\",\"globalTypeGrammarID\":11},{\"qnameID\":28,\"localNameID\":15,\"localName\":\"boolean\",\"globalTypeGrammarID\":12},{\"qnameID\":29,\"localNameID\":16,\"localName\":\"byte\",\"globalTypeGrammarID\":13},{\"qnameID\":30,\"localNameID\":17,\"localName\":\"date\",\"globalTypeGrammarID\":14},{\"qnameID\":31,\"localNameID\":18,\"localName\":\"dateTime\",\"globalTypeGrammarID\":15},{\"qnameID\":32,\"localNameID\":19,\"localName\":\"decimal\",\"globalTypeGrammarID\":16},{\"qnameID\":33,\"localNameID\":20,\"localName\":\"double\",\"globalTypeGrammarID\":17},{\"qnameID\":34,\"localNameID\":21,\"localName\":\"duration\",\"globalTypeGrammarID\":9},{\"qnameID\":35,\"localNameID\":22,\"localName\":\"float\",\"globalTypeGrammarID\":17},{\"qnameID\":36,\"localNameID\":23,\"localName\":\"gDay\",\"globalTypeGrammarID\":18},{\"qnameID\":37,\"localNameID\":24,\"localName\":\"gMonth\",\"globalTypeGrammarID\":19},{\"qnameID\":38,\"localNameID\":25,\"localName\":\"gMonthDay\",\"globalTypeGrammarID\":20},{\"qnameID\":39,\"localNameID\":26,\"localName\":\"gYear\",\"globalTypeGrammarID\":21},{\"qnameID\":40,\"localNameID\":27,\"localName\":\"gYearMonth\",\"globalTypeGrammarID\":22},{\"qnameID\":41,\"localNameID\":28,\"localName\":\"hexBinary\",\"globalTypeGrammarID\":23},{\"qnameID\":42,\"localNameID\":29,\"localName\":\"int\",\"globalTypeGrammarID\":24},{\"qnameID\":43,\"localNameID\":30,\"localName\":\"integer\",\"globalTypeGrammarID\":24},{\"qnameID\":44,\"localNameID\":31,\"localName\":\"language\",\"globalTypeGrammarID\":9},{\"qnameID\":45,\"localNameID\":32,\"localName\":\"long\",\"globalTypeGrammarID\":24},{\"qnameID\":46,\"localNameID\":33,\"localName\":\"negativeInteger\",\"globalTypeGrammarID\":24},{\"qnameID\":47,\"localNameID\":34,\"localName\":\"nonNegativeInteger\",\"globalTypeGrammarID\":25},{\"qnameID\":48,\"localNameID\":35,\"localName\":\"nonPositiveInteger\",\"globalTypeGrammarID\":24},{\"qnameID\":49,\"localNameID\":36,\"localName\":\"normalizedString\",\"globalTypeGrammarID\":9},{\"qnameID\":50,\"localNameID\":37,\"localName\":\"positiveInteger\",\"globalTypeGrammarID\":25},{\"qnameID\":51,\"localNameID\":38,\"localName\":\"short\",\"globalTypeGrammarID\":24},{\"qnameID\":52,\"localNameID\":39,\"localName\":\"string\",\"globalTypeGrammarID\":9},{\"qnameID\":53,\"localNameID\":40,\"localName\":\"time\",\"globalTypeGrammarID\":26},{\"qnameID\":54,\"localNameID\":41,\"localName\":\"token\",\"globalTypeGrammarID\":9},{\"qnameID\":55,\"localNameID\":42,\"localName\":\"unsignedByte\",\"globalTypeGrammarID\":27},{\"qnameID\":56,\"localNameID\":43,\"localName\":\"unsignedInt\",\"globalTypeGrammarID\":25},{\"qnameID\":57,\"localNameID\":44,\"localName\":\"unsignedLong\",\"globalTypeGrammarID\":25},{\"qnameID\":58,\"localNameID\":45,\"localName\":\"unsignedShort\",\"globalTypeGrammarID\":25}]}]},\"simpleDatatypes\":[{\"simpleDatatypeID\":0,\"type\":\"DATETIME\",\"datetimeType\":\"date\"},{\"simpleDatatypeID\":1,\"type\":\"STRING\"},{\"simpleDatatypeID\":2,\"type\":\"STRING\"},{\"simpleDatatypeID\":3,\"type\":\"LIST\",\"listType\":\"STRING\"},{\"simpleDatatypeID\":4,\"type\":\"LIST\",\"listType\":\"STRING\"},{\"simpleDatatypeID\":5,\"type\":\"STRING\"},{\"simpleDatatypeID\":6,\"type\":\"STRING\"},{\"simpleDatatypeID\":7,\"type\":\"BINARY_BASE64\"},{\"simpleDatatypeID\":8,\"type\":\"BOOLEAN\"},{\"simpleDatatypeID\":9,\"type\":\"NBIT_UNSIGNED_INTEGER\",\"lowerBound\":-128,\"upperBound\":127},{\"simpleDatatypeID\":10,\"type\":\"INTEGER\"},{\"simpleDatatypeID\":11,\"type\":\"DATETIME\",\"datetimeType\":\"dateTime\"},{\"simpleDatatypeID\":12,\"type\":\"DECIMAL\"},{\"simpleDatatypeID\":13,\"type\":\"FLOAT\"},{\"simpleDatatypeID\":14,\"type\":\"DATETIME\",\"datetimeType\":\"gDay\"},{\"simpleDatatypeID\":15,\"type\":\"DATETIME\",\"datetimeType\":\"gMonth\"},{\"simpleDatatypeID\":16,\"type\":\"DATETIME\",\"datetimeType\":\"gMonthDay\"},{\"simpleDatatypeID\":17,\"type\":\"DATETIME\",\"datetimeType\":\"gYear\"},{\"simpleDatatypeID\":18,\"type\":\"DATETIME\",\"datetimeType\":\"gYearMonth\"},{\"simpleDatatypeID\":19,\"type\":\"BINARY_HEX\"},{\"simpleDatatypeID\":20,\"type\":\"INTEGER\"},{\"simpleDatatypeID\":21,\"type\":\"INTEGER\"},{\"simpleDatatypeID\":22,\"type\":\"UNSIGNED_INTEGER\"},{\"simpleDatatypeID\":23,\"type\":\"INTEGER\"},{\"simpleDatatypeID\":24,\"type\":\"DATETIME\",\"datetimeType\":\"time\"},{\"simpleDatatypeID\":25,\"type\":\"NBIT_UNSIGNED_INTEGER\",\"lowerBound\":0,\"upperBound\":255},{\"simpleDatatypeID\":26,\"type\":\"UNSIGNED_INTEGER\"}],\"grs\":{\"documentGrammarID\":0,\"fragmentGrammarID\":3,\"grammar\":[{\"grammarID\":\"0\",\"type\":\"document\",\"production\":[{\"event\":\"startDocument\",\"nextGrammarID\":1}]},{\"grammarID\":\"1\",\"type\":\"docContent\",\"production\":[{\"event\":\"startElement\",\"startElementQNameID\":5,\"startElementGrammarID\":5,\"nextGrammarID\":2},{\"event\":\"startElementGeneric\",\"nextGrammarID\":2}]},{\"grammarID\":\"2\",\"type\":\"docEnd\",\"production\":[{\"event\":\"endDocument\",\"nextGrammarID\":-1}]},{\"grammarID\":\"3\",\"type\":\"fragment\",\"production\":[{\"event\":\"startDocument\",\"nextGrammarID\":4}]},{\"grammarID\":\"4\",\"type\":\"fragmentContent\",\"production\":[{\"event\":\"startElement\",\"startElementQNameID\":1,\"startElementGrammarID\":7,\"nextGrammarID\":4},{\"event\":\"startElement\",\"startElementQNameID\":4,\"startElementGrammarID\":6,\"nextGrammarID\":4},{\"event\":\"startElement\",\"startElementQNameID\":5,\"startElementGrammarID\":5,\"nextGrammarID\":4},{\"event\":\"startElement\",\"startElementQNameID\":6,\"startElementGrammarID\":7,\"nextGrammarID\":4},{\"event\":\"startElementGeneric\",\"nextGrammarID\":4},{\"event\":\"endDocument\",\"nextGrammarID\":-1}]},{\"grammarID\":\"5\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"attribute\",\"attributeQNameID\":3,\"attributeDatatypeID\":0,\"nextGrammarID\":28},{\"event\":\"startElement\",\"startElementQNameID\":4,\"startElementGrammarID\":6,\"nextGrammarID\":34}]},{\"grammarID\":\"6\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"attribute\",\"attributeQNameID\":2,\"attributeDatatypeID\":2,\"nextGrammarID\":29},{\"event\":\"attribute\",\"attributeQNameID\":3,\"attributeDatatypeID\":0,\"nextGrammarID\":30}]},{\"grammarID\":\"7\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":true,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":2,\"nextGrammarID\":31}]},{\"grammarID\":\"8\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":3,\"nextGrammarID\":31}]},{\"grammarID\":\"9\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":5,\"nextGrammarID\":31}]},{\"grammarID\":\"10\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"attributeGeneric\",\"nextGrammarID\":10},{\"event\":\"startElementGeneric\",\"nextGrammarID\":35},{\"event\":\"endElement\",\"nextGrammarID\":-1},{\"event\":\"charactersGeneric\",\"nextGrammarID\":35}]},{\"grammarID\":\"11\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":7,\"nextGrammarID\":31}]},{\"grammarID\":\"12\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":8,\"nextGrammarID\":31}]},{\"grammarID\":\"13\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":9,\"nextGrammarID\":31}]},{\"grammarID\":\"14\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":0,\"nextGrammarID\":31}]},{\"grammarID\":\"15\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":11,\"nextGrammarID\":31}]},{\"grammarID\":\"16\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":12,\"nextGrammarID\":31}]},{\"grammarID\":\"17\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":13,\"nextGrammarID\":31}]},{\"grammarID\":\"18\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":14,\"nextGrammarID\":31}]},{\"grammarID\":\"19\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":15,\"nextGrammarID\":31}]},{\"grammarID\":\"20\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":16,\"nextGrammarID\":31}]},{\"grammarID\":\"21\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":17,\"nextGrammarID\":31}]},{\"grammarID\":\"22\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":18,\"nextGrammarID\":31}]},{\"grammarID\":\"23\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":19,\"nextGrammarID\":31}]},{\"grammarID\":\"24\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":20,\"nextGrammarID\":31}]},{\"grammarID\":\"25\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":22,\"nextGrammarID\":31}]},{\"grammarID\":\"26\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":24,\"nextGrammarID\":31}]},{\"grammarID\":\"27\",\"type\":\"firstStartTagContent\",\"isTypeCastable\":false,\"isNillable\":false,\"production\":[{\"event\":\"characters\",\"charactersDatatypeID\":25,\"nextGrammarID\":31}]},{\"grammarID\":\"28\",\"type\":\"startTagContent\",\"production\":[{\"event\":\"startElement\",\"startElementQNameID\":4,\"startElementGrammarID\":6,\"nextGrammarID\":34}]},{\"grammarID\":\"29\",\"type\":\"startTagContent\",\"production\":[{\"event\":\"attribute\",\"attributeQNameID\":3,\"attributeDatatypeID\":0,\"nextGrammarID\":30}]},{\"grammarID\":\"30\",\"type\":\"startTagContent\",\"production\":[{\"event\":\"startElement\",\"startElementQNameID\":6,\"startElementGrammarID\":7,\"nextGrammarID\":33}]},{\"grammarID\":\"31\",\"type\":\"elementContent\",\"production\":[{\"event\":\"endElement\",\"nextGrammarID\":-1}]},{\"grammarID\":\"32\",\"type\":\"elementContent\",\"production\":[]},{\"grammarID\":\"33\",\"type\":\"elementContent\",\"production\":[{\"event\":\"startElement\",\"startElementQNameID\":1,\"startElementGrammarID\":7,\"nextGrammarID\":31}]},{\"grammarID\":\"34\",\"type\":\"elementContent\",\"production\":[{\"event\":\"startElement\",\"startElementQNameID\":4,\"startElementGrammarID\":6,\"nextGrammarID\":34},{\"event\":\"endElement\",\"nextGrammarID\":-1}]},{\"grammarID\":\"35\",\"type\":\"elementContent\",\"production\":[{\"event\":\"startElementGeneric\",\"nextGrammarID\":35},{\"event\":\"endElement\",\"nextGrammarID\":-1},{\"event\":\"charactersGeneric\",\"nextGrammarID\":35}]}]}}";
		// notebook xml
		String xmlTest = "<notebook date=\"2007-09-12\">\n <note category=\"EXI\" date=\"2007-07-23\">\n  <subject>EXI</subject>\n  <body>Do not forget it!</body>\n </note>\n <note date=\"2007-09-12\">\n  <subject>Shopping List</subject>\n  <body>milk, honey</body>\n </note>\n</notebook>";
		
		// var grammars = JSON.parse(jsonText);
		engine.eval("var jsonTextGrammar = '" + notebookGrammars + "';");
		engine.eval("var grammars = JSON.parse(jsonTextGrammar);");
		
//		System.out.println(
		engine.eval("var exiEncoder = new EXIEncoder(grammars);");
//				+ "exiEncoder.encodeJsonText('" + jsonTest + "');")
//				);
		
        // javax.script.Invocable is an optional interface.
        // Check whether your script engine implements or not!
        // Note that the JavaScript engine implements Invocable interface.
        Invocable inv = (Invocable) engine;

        // get script object on which we want to call the method
        Object obj = engine.get("exiEncoder");
        System.out.println(obj);
        
        // invoke the method named "hello" on the script object "obj"
        Object obj2 = inv.invokeMethod(obj, "encodeXmlText", xmlTest);
        System.out.println(obj2);
        
        System.out.println("----- obj3");
        Object obj3 = inv.invokeMethod(obj, "getUint8Array");
        System.out.println(obj3);
        System.out.println(obj3.getClass());
        
        if(obj3 instanceof javax.script.Bindings) {
        	javax.script.Bindings b = (Bindings) obj3;
        	// b.get("Uint8Array");
        	System.out.println(b.get("Uint8Array"));
        	// ScriptObjectMirror som = obj3;
        	System.out.println(b.get("object"));
        	System.out.println(b.entrySet());
        	System.out.println(b.keySet());
        	
//        	 int[] foo = (int[]) jdk.nashorn.api.scripting.ScriptUtils.convert(b, int[].class);
        }
        
        System.out.println("----- obj4");
        Object obj4 = inv.invokeMethod(obj, "getUint8ArrayLength");
        System.out.println(obj4);
        System.out.println(obj4.getClass());
		
	}
}