package exificient.js.tests;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.script.Bindings;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;
import javax.xml.transform.Result;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXSource;
import javax.xml.transform.stream.StreamResult;

import org.custommonkey.xmlunit.XMLTestCase;
import org.custommonkey.xmlunit.XMLUnit;
import org.junit.Test;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import com.siemens.ct.exi.core.CodingMode;
import com.siemens.ct.exi.core.EXIFactory;
import com.siemens.ct.exi.core.FidelityOptions;
import com.siemens.ct.exi.core.exceptions.EXIException;
import com.siemens.ct.exi.core.grammars.SchemaInformedGrammars;
import com.siemens.ct.exi.core.helpers.DefaultEXIFactory;
import com.siemens.ct.exi.grammars.XSDGrammarsBuilder;
import com.siemens.ct.exi.grammars.persistency.Grammars2JSON;
import com.siemens.ct.exi.main.api.sax.EXIResult;
import com.siemens.ct.exi.main.api.sax.EXISource;

public class TestXML extends XMLTestCase {
	
	File fJS;
	static XSDGrammarsBuilder grammarBuilder = XSDGrammarsBuilder.newInstance();

	// assigning the values
	protected void setUp() throws IOException {
		fJS = EXIficientForJSON.createMergedJS();
		System.out.println("File: " + fJS);			
	}
	
	static String parseGrammars(String xsdPath) throws EXIException, IOException {
		grammarBuilder.loadGrammars(xsdPath);
		SchemaInformedGrammars grammarIn = grammarBuilder.toGrammars();
		Grammars2JSON g2j = new Grammars2JSON();
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		g2j.toGrammarsJSON(grammarIn, baos);
		String grammars = new String(baos.toByteArray());
		// grammars = grammars.replace("\n", "").replace("\r", "").replace("\n\r", "").replace("\r\n", "");
		grammars = sanitize(grammars);
		return grammars;
	}
	
	static String sanitize(String in) {
		String out = in.replace("\n", "").replace("\r", "").replace("\n\r", "").replace("\r\n", "");
		return out;
	}
	
	EXIFactory getEXIFactory(String xsdPath) throws EXIException {
		EXIFactory exiFactory = DefaultEXIFactory.newInstance();
		exiFactory.setFidelityOptions(FidelityOptions.createStrict());
		if(xsdPath != null) {
			grammarBuilder.loadGrammars(xsdPath);
			exiFactory.setGrammars(grammarBuilder.toGrammars());
		}

		return exiFactory;
	}

	@Test
	public void testTest1() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/test1.xml";
		String xsdPath = "./data/xml/test1.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testUnsignedInteger1() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/unsignedInteger.xml";
		String xsdPath = "./data/xml/unsignedInteger.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	
	@Test
	public void testNotebook() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/notebook.xml";
		String xsdPath = "../grammars/notebook.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	// @Test
	// Note: Diff issues 
	public void _testIssue2() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/issue2.xml";
		String xsdPath = "./data/xml/issue2.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	
	@Test
	public void testList() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/list.xml";
		String xsdPath = "./data/xml/list.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testWildcardsNS1() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/wildcardNS1.xml";
		String xsdPath = "./data/xml/wildcardNS.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	
	@Test
	public void testAny0() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/any0.xml";
		String xsdPath = "./data/xml/any0.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testAny1() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/any1.xml";
		String xsdPath = "./data/xml/any1.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	
	@Test
	public void _testBasic_rdf_query_v02() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/basic_rdf_query_v02.xml";
		String xsdPath = "./data/xml/basic_rdf_query_v02.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testEnumCar() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/enumCar.xml";
		String xsdPath = "./data/xml/enumCar.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testJson0() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/json0.xml";
		String xsdPath = "../grammars/exi4json.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testJson1() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/json1.xml";
		String xsdPath = "../grammars/exi4json.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testJson2() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/json2.xml";
		String xsdPath = "../grammars/exi4json.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testJson3() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/json3.xml";
		String xsdPath = "../grammars/exi4json.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}
	
	@Test
	public void testNestedJson() throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		String xmlPath = "./data/xml/nestedJson.xml";
		String xsdPath = "../grammars/exi4json.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}


	
	protected void _testXMLCode(String xmlTest, String xsdPath) throws NoSuchMethodException, IOException, ScriptException, EXIException, TransformerException, SAXException {
		// schema-informed
		_testXMLEncode(xmlTest, xsdPath, CodingMode.BYTE_PACKED);
		_testXMLEncode(xmlTest, xsdPath, CodingMode.BIT_PACKED);
		_testXMLDecode(xmlTest, xsdPath, CodingMode.BYTE_PACKED);
		_testXMLDecode(xmlTest, xsdPath, CodingMode.BIT_PACKED);
		// TODO schema-less coding
//		_testXMLEncode(xmlTest, null, CodingMode.BYTE_PACKED);
//		_testXMLEncode(xmlTest, null, CodingMode.BIT_PACKED);
		//_testXMLDecode(xmlTest, null, CodingMode.BYTE_PACKED);
		//_testXMLDecode(xmlTest, null, CodingMode.BIT_PACKED);
	}

	protected void _testXMLEncode(String xmlTest, String xsdPath, CodingMode codingMode)
			throws IOException, ScriptException, NoSuchMethodException, EXIException, TransformerException, SAXException {
		
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");
		// evaluate JS code
		engine.eval(new FileReader(fJS));
		
		if(xsdPath != null) {
			String grammars = parseGrammars(xsdPath);
			engine.eval("var jsonTextGrammar = '" + grammars + "';");
			engine.eval("var grammars = JSON.parse(jsonTextGrammar);");
		} else {
			// schema-less
			engine.eval("var grammars = null;");
		}
		
		engine.eval("var options = {};");
		if(codingMode == CodingMode.BYTE_PACKED) {
			engine.eval("options['byteAligned'] = true;");
		}
//		if(EXIficientForJSON.USE_TS) {
			engine.eval("var exiEncoder = new EXIEncoder(Grammars.fromJson(grammars), options);");
			xmlTest = sanitize(xmlTest);
			engine.eval("var xmlDoc = getXMLDocument('" + xmlTest + "');");	
//		} else {
//			engine.eval("var exiEncoder = new EXIEncoder(grammars, options);");
//		}
		Object obj = engine.get("exiEncoder");
		Invocable inv = (Invocable) engine;
//		if(EXIficientForJSON.USE_TS) {
			engine.eval("exiEncoder.encodeXmlDocument(xmlDoc);");
//		} else {
//			inv.invokeMethod(obj, "encodeXmlText", xmlTest);
//			// System.out.println(obj2);	
//		}


		Object oGetUint8ArrayLength = inv.invokeMethod(obj, "getUint8ArrayLength");
		System.out.println(oGetUint8ArrayLength);
		System.out.println(oGetUint8ArrayLength.getClass());

		if (oGetUint8ArrayLength instanceof Number) {
			Number n = (Number) oGetUint8ArrayLength;
			int ni = n.intValue();

			Object oGetUint8Array = inv.invokeMethod(obj, "getUint8Array");
			if (oGetUint8Array instanceof javax.script.Bindings) {
				javax.script.Bindings b = (Bindings) oGetUint8Array;
				// b.get("Uint8Array");
				// System.out.println(b.get("Uint8Array"));
				// ScriptObjectMirror som = obj3;
				// System.out.println(b.get("object"));
				// System.out.println(b.entrySet());
				// System.out.println(b.keySet());
				System.out.println(b.values());

				byte[] foo = new byte[ni];

				for (int i = 0; i < ni; i++) {
					Object oi = b.get(i + "");
					if (oi instanceof Number) {
						foo[i] = ((Number) oi).byteValue();
					}
					// System.out.println(oi.getClass());
				}
				
				// write to file
				if(true) {
					File f = File.createTempFile("exificient-js", ".exi");
					FileOutputStream fos = new FileOutputStream(f);
					fos.write(foo);
					fos.close();
					System.out.println("Wrote to file: " + f);
				}
				
				// decode
				EXIFactory exiFactory = getEXIFactory(xsdPath);
				exiFactory.setCodingMode(codingMode);
				StringWriter sw = new StringWriter();
				Result result = new StreamResult(sw);
				InputSource is = new InputSource(new ByteArrayInputStream(foo));
				SAXSource exiSource = new EXISource(exiFactory);
				exiSource.setInputSource(is);
				TransformerFactory tf = TransformerFactory.newInstance();
				Transformer transformer = tf.newTransformer();
				transformer.transform(exiSource, result);
				
				// compare both XML documents
				XMLUnit.setIgnoreWhitespace(true);
				XMLUnit.setIgnoreAttributeOrder(true);
				XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
				XMLUnit.setIgnoreComments(true);
				
				assertXMLEqual(xmlTest, sw.toString());
			} else {
				fail("getUint8Array not an array");
			}
		} else {
			fail("getUint8ArrayLength not a number");
		}
	}
	
	
	protected void _testXMLDecode(String xmlTest, String xsdPath, CodingMode codingMode)
			throws IOException, ScriptException, NoSuchMethodException, EXIException, SAXException {
		
		EXIFactory exiFactory = getEXIFactory(xsdPath);
		exiFactory.setCodingMode(codingMode);
		ByteArrayOutputStream osEXI = new ByteArrayOutputStream();
		EXIResult exiResult = new EXIResult(exiFactory);
		exiResult.setOutputStream(osEXI);
		XMLReader xmlReader = XMLReaderFactory.createXMLReader();
		xmlReader.setContentHandler( exiResult.getHandler() );
		xmlReader.parse(new InputSource(new ByteArrayInputStream(xmlTest.getBytes()))); // parse XML input
		
		byte[] bytes = osEXI.toByteArray();
		Integer[] ibytes = new Integer[bytes.length];
		System.out.println("size: " + bytes.length);

		////////////////////////
		//String grammars = parseGrammars(xsdPath);
		
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");

		// evaluate JS code
		engine.eval(new FileReader(fJS));
		
		if(xsdPath != null) {
			String grammars = parseGrammars(xsdPath);
			engine.eval("var jsonTextGrammar = '" + grammars + "';");
			engine.eval("var grammars = JSON.parse(jsonTextGrammar);");
		} else {
			// schema-less
			engine.eval("var grammars = null;");
		}
//		engine.eval("var jsonTextGrammar = '" + grammars + "';");
//		engine.eval("var grammars = JSON.parse(jsonTextGrammar);");
		
		
		engine.eval("var options = {};");
		if(codingMode == CodingMode.BYTE_PACKED) {
			engine.eval("options['byteAligned'] = true;");
		}
//		if(EXIficientForJSON.USE_TS) {
			engine.eval("var exiDecoder = new EXIDecoder(Grammars.fromJson(grammars), options);");
//		} else {
//			engine.eval("var exiDecoder = new EXIDecoder(grammars, options);");
//		}
		
		engine.eval("var xmlHandler = new XMLEventHandler();");
		engine.eval("exiDecoder.registerEventHandler(xmlHandler);");
		
		
		engine.eval("var arrayBuffer = new ArrayBuffer("+ bytes.length + ");");
		engine.eval("var uint8Array = new Uint8Array(arrayBuffer);");
		
		List<Integer> ilist = new ArrayList<>();
		javax.script.Bindings b = new SimpleBindings();
		for(int i=0; i<bytes.length; i++) {
			int bb = bytes[i];
			if(bb < 0) {
				bb += 256;
			}
			b.put(i+"", bb);
			ibytes[i] = bb;
			ilist.add(bb);
			
			engine.eval("uint8Array[" + i + "] = "  + bb +  ";"); // parseInt(sp[i], 16)
		}
		

		Object o = engine.eval("exiDecoder.decode(uint8Array);");
		System.out.println("resultErrn: " + o);
		
		
		Object objJsonHandler = engine.get("xmlHandler");
		Invocable invJsonHandler = (Invocable) engine;
		Object oo = invJsonHandler.invokeMethod(objJsonHandler, "getXML");
		
		// compare both XML documents

		XMLUnit.setIgnoreWhitespace(true);
		XMLUnit.setIgnoreAttributeOrder(true);
		XMLUnit.setIgnoreDiffBetweenTextAndCDATA(true);
		assertXMLEqual(xmlTest, oo.toString());
		
		
//		/////////////////////////////////////////////////
//		// TODO how to call function properly!?
//		System.out.println("resultOO: " + oo);
//		jdk.nashorn.api.scripting.ScriptUtils.unwrap(oo);
//		Object oib = jdk.nashorn.api.scripting.ScriptUtils.wrapArray(ibytes);
//		
//		Object obj = engine.get("exiDecoder");
//		Invocable inv = (Invocable) engine;
////		inv.invokeMethod(obj, "decode", b);
////		inv.invokeMethod(obj, "decode", bytes);
////		inv.invokeMethod(obj, "decode", ibytes);
////		inv.invokeMethod(obj, "decode", oib);
////		inv.invokeMethod(obj, "decode(arrayBuffer)");
////		inv.invokeMethod(obj, "decode", ilist);
//		// System.out.println(obj2);

	}
	
	public static void main(String[] args) throws EXIException, IOException {
		String xsdPath = "./data/xml/list.xsd"; 
		String s = parseGrammars(xsdPath);
		PrintWriter out = new PrintWriter(xsdPath + ".grs");
		out.write(s);
		out.close();
		
//		byte[]d = {(byte) 0xe8, (byte) 0xd8};
		
	}

}
