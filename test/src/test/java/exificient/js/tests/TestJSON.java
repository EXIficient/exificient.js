package exificient.js.tests;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.script.Bindings;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;

import org.json.JSONException;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import com.siemens.ct.exi.exceptions.EXIException;
import com.siemens.ct.exi.json.EXIforJSONGenerator;
import com.siemens.ct.exi.json.EXIforJSONParser;

import junit.framework.TestCase;

public class TestJSON extends TestCase {
	
	File fJS;

	// assigning the values
	protected void setUp() throws IOException {
		fJS = EXIficientForJSON.createMergedJS();
		System.out.println("File: " + fJS);
	}

	@Test
	public void testJSON1() throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException {
		String jsonTest = "{\"test\": true}";
		_testJSONCode(jsonTest);
	}

	@Test
	public void testJSON2() throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException {
		String jsonTest = "{\"menu\": {\r\n  \"id\": \"file\",\r\n  \"value\": \"File\",\r\n  \"popup\": {\r\n    \"menuitem\": [\r\n      {\"value\": \"New\", \"onclick\": \"CreateNewDoc()\"},\r\n      {\"value\": \"Open\", \"onclick\": \"OpenDoc()\"},\r\n      {\"value\": \"Close\", \"onclick\": \"CloseDoc()\"}\r\n    ]\r\n  }\r\n}}";
		_testJSONCode(jsonTest);
	}

	@Test
	public void testJSON3() throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException {
		String jsonTest = "{\"menu\": {\r\n    \"header\": \"SVG Viewer\",\r\n    \"items\": [\r\n        {\"id\": \"Open\"},\r\n        {\"id\": \"OpenNew\", \"label\": \"Open New\"},\r\n        null,\r\n        {\"id\": \"ZoomIn\", \"label\": \"Zoom In\"},\r\n        {\"id\": \"ZoomOut\", \"label\": \"Zoom Out\"},\r\n        {\"id\": \"OriginalView\", \"label\": \"Original View\"},\r\n        null,\r\n        {\"id\": \"Quality\"},\r\n        {\"id\": \"Pause\"},\r\n        {\"id\": \"Mute\"},\r\n        null,\r\n        {\"id\": \"Find\", \"label\": \"Find...\"},\r\n        {\"id\": \"FindAgain\", \"label\": \"Find Again\"},\r\n        {\"id\": \"Copy\"},\r\n        {\"id\": \"CopyAgain\", \"label\": \"Copy Again\"},\r\n        {\"id\": \"CopySVG\", \"label\": \"Copy SVG\"},\r\n        {\"id\": \"ViewSVG\", \"label\": \"View SVG\"},\r\n        {\"id\": \"ViewSource\", \"label\": \"View Source\"},\r\n        {\"id\": \"SaveAs\", \"label\": \"Save As\"},\r\n        null,\r\n        {\"id\": \"Help\"},\r\n        {\"id\": \"About\", \"label\": \"About Adobe CVG Viewer...\"}\r\n    ]\r\n}}";
		_testJSONCode(jsonTest);
	}
	
	protected void _testJSONCode(String jsonTest) throws NoSuchMethodException, IOException, ScriptException, EXIException, JSONException {
		_testJSONEncode(jsonTest);
		_testJSONDecode(jsonTest);
	}

	protected void _testJSONEncode(String jsonTest)
			throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException {
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");

		// evaluate JS code
		engine.eval(new FileReader(fJS));

		engine.eval("var exiEncoder = new EXI4JSONEncoder();");
		Object obj = engine.get("exiEncoder");
		Invocable inv = (Invocable) engine;
		inv.invokeMethod(obj, "encodeJsonText", jsonTest);
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
				
				EXIforJSONParser e4jParser = new EXIforJSONParser();
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				e4jParser.parse(new ByteArrayInputStream(foo), baos);

				byte[] bytes = baos.toByteArray();
				// assertTrue(ni == bytes.length); // does not need to be the
				// case
				String jsonTestResult = new String(bytes);

				System.out.println(jsonTestResult);

				// compare both JSON documents
				JSONAssert.assertEquals(jsonTest, jsonTestResult, true);
			} else {
				fail("getUint8Array not an array");
			}
		} else {
			fail("getUint8ArrayLength not a number");
		}
	}
	
	
	protected void _testJSONDecode(String jsonTest)
			throws IOException, ScriptException, NoSuchMethodException, EXIException, JSONException {
		
		EXIforJSONGenerator e4jGenerator = new EXIforJSONGenerator();
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		e4jGenerator.generate(new ByteArrayInputStream(jsonTest.getBytes()), baos);
		
		byte[] bytes = baos.toByteArray();
		Integer[] ibytes = new Integer[bytes.length];
		System.out.println("size: " + bytes.length);

		
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");

		// evaluate JS code
		engine.eval(new FileReader(fJS));

		engine.eval("var exiDecoder = new EXI4JSONDecoder();");
		engine.eval("var jsonHandler = new JSONEventHandler();");
		engine.eval("exiDecoder.registerEventHandler(jsonHandler);");
		
		
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
		
		
//		Object objJsonHandler = engine.get("jsonHandler");
//		Invocable invJsonHandler = (Invocable) engine;
//		Object oo = invJsonHandler.invokeMethod(objJsonHandler, "getJSON");
		
		// var jsonText = JSON.stringify(jsonHandler.getJSON(), null, "\t");
		Object jtext = engine.eval("JSON.stringify(jsonHandler.getJSON(), null);");
		
		
		// compare both JSON documents
		JSONAssert.assertEquals(jsonTest, jtext.toString(), true);
		
		
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
