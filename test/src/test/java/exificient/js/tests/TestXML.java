package exificient.js.tests;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
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
import org.json.JSONException;
import org.junit.Test;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import com.siemens.ct.exi.EXIFactory;
import com.siemens.ct.exi.FidelityOptions;
import com.siemens.ct.exi.api.sax.EXIResult;
import com.siemens.ct.exi.api.sax.EXISource;
import com.siemens.ct.exi.exceptions.EXIException;
import com.siemens.ct.exi.grammars.SchemaInformedGrammars;
import com.siemens.ct.exi.grammars.XSDGrammarsBuilder;
import com.siemens.ct.exi.grammars.persistency.Grammars2JSON;
import com.siemens.ct.exi.helpers.DefaultEXIFactory;

public class TestXML extends XMLTestCase {
	
	File fJS;
	XSDGrammarsBuilder grammarBuilder = XSDGrammarsBuilder.newInstance();

	// assigning the values
	protected void setUp() throws IOException {
		fJS = EXIficientForJSON.createMergedJS();
		System.out.println("File: " + fJS);
	}
	
	String parseGrammars(String xsdPath) throws EXIException, IOException {
		grammarBuilder.loadGrammars(xsdPath);
		SchemaInformedGrammars grammarIn = grammarBuilder.toGrammars();
		Grammars2JSON g2j = new Grammars2JSON();
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		g2j.toGrammarsJSON(grammarIn, baos);
		String grammars = new String(baos.toByteArray());
		grammars = grammars.replace("\n", "").replace("\r", "").replace("\n\r", "").replace("\r\n", "");
		return grammars;
	}
	
	EXIFactory getEXIFactory(String xsdPath) throws EXIException {
		EXIFactory exiFactory = DefaultEXIFactory.newInstance();
		exiFactory.setFidelityOptions(FidelityOptions.createStrict());
		grammarBuilder.loadGrammars(xsdPath);
		exiFactory.setGrammars(grammarBuilder.toGrammars());
		
		return exiFactory;
	}

	@Test
	public void testNotebook() throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException, TransformerException, SAXException {
		String xmlPath = "./data/xml/notebook.xml";
		String xsdPath = "../grammars/notebook.xsd"; 
		
		String xmlTest = new String(Files.readAllBytes(Paths.get(xmlPath)));
		
		_testXMLCode(xmlTest, xsdPath);
	}

	
	protected void _testXMLCode(String xmlTest, String xsdPath) throws NoSuchMethodException, IOException, ScriptException, EXIException, JSONException, TransformerException, SAXException {
		_testXMLEncode(xmlTest, xsdPath);
		_testXMLDecode(xmlTest, xsdPath);
	}

	protected void _testXMLEncode(String xmlTest, String xsdPath)
			throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException, TransformerException, SAXException {
		String grammars = parseGrammars(xsdPath);
		
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");

		// evaluate JS code
		engine.eval(new FileReader(fJS));

		engine.eval("var jsonTextGrammar = '" + grammars + "';");
		engine.eval("var grammars = JSON.parse(jsonTextGrammar);");
		
		engine.eval("var exiEncoder = new EXIEncoder(grammars);");
		Object obj = engine.get("exiEncoder");
		Invocable inv = (Invocable) engine;
		inv.invokeMethod(obj, "encodeXmlText", xmlTest);
		// System.out.println(obj2);

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
				
				// decode
				EXIFactory exiFactory = getEXIFactory(xsdPath);
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
				assertXMLEqual(xmlTest, sw.toString());
			} else {
				fail("getUint8Array not an array");
			}
		} else {
			fail("getUint8ArrayLength not a number");
		}
	}
	
	
	protected void _testXMLDecode(String xmlTest, String xsdPath)
			throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException, SAXException {
		
		EXIFactory exiFactory = getEXIFactory(xsdPath);
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
		String grammars = parseGrammars(xsdPath);
		
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");

		// evaluate JS code
		engine.eval(new FileReader(fJS));
		
		engine.eval("var jsonTextGrammar = '" + grammars + "';");
		engine.eval("var grammars = JSON.parse(jsonTextGrammar);");

		engine.eval("var exiDecoder = new EXIDecoder(grammars);");
		engine.eval("var xmlHandler = new XMLEventHandler();");
		engine.eval("exiDecoder.registerEventHandler(xmlHandler);");
		
		
		engine.eval("var arrayBuffer = new ArrayBuffer("+ bytes.length + ");");
		engine.eval("var arrayBufferView = new Uint8Array(arrayBuffer);");
		
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
			
			engine.eval("arrayBufferView[" + i + "] = "  + bb +  ";"); // parseInt(sp[i], 16)
		}
		

		Object o = engine.eval("exiDecoder.decode(arrayBuffer);");
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

}
