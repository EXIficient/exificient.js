package exificient.js.tests;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.script.Bindings;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;

import org.junit.Test;

import com.siemens.ct.exi.EXIFactory;
import com.siemens.ct.exi.exceptions.EXIException;
import com.siemens.ct.exi.helpers.DefaultEXIFactory;
import com.siemens.ct.exi.json.EXIforJSONGenerator;
import com.siemens.ct.exi.json.EXIforJSONParser;

import junit.framework.TestCase;
import net.javacrumbs.jsonunit.JsonAssert;

public class TestJSON extends TestCase {

	static final double NUMBER_TOLERANCE = 0.000001;

	static List<String> SHARED_STRINGS_EXI_FOR_JSON = Arrays.asList(new String[] { "@context", "@id", "@type", "@value",
			"Brightness", "Car", "CoAP", "DecreaseColor", "Distance", "Door", "EXI", "EXI4JSON", "Fan", "HTTP",
			"IncreaseColor", "JSON", "Lamp", "Lighting", "Off", "On", "OnOff", "PowerConsumption", "RGBColor",
			"RGBColorBlue", "RGBColorGreen", "RGBColorRed", "Speed", "Start", "Stop", "Switch", "Temperature", "Thing",
			"Toggle", "TrafficLight", "WS", "actions", "associations", "celsius", "dogont", "encodings", "events",
			"hrefs", "http://w3c.github.io/wot/w3c-wot-td-context.jsonld",
			"https://w3c.github.io/wot/w3c-wot-common-context.jsonld", "inch", "inputData", "interactions", "joule",
			"kelvin", "kmh", "kwh", "lgdo", "m", "max", "mile", "min", "mm", "mph", "name", "outputData", "properties",
			"protocols", "qu", "reference", "schema", "security", "unit", "uris", "valueType", "writable",
			"xsd:boolean", "xsd:byte", "xsd:float", "xsd:int", "xsd:short", "xsd:string", "xsd:unsignedByte",
			"xsd:unsignedInt", "xsd:unsignedShort" });

	File fJS;

	// assigning the values
	protected void setUp() throws IOException {
		fJS = EXIficientForJSON.createMergedJS();
		System.out.println("File: " + fJS);
	}

	@Test
	public void testJSON1() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		String jsonTest = "{\"test\": true}";
		_testJSONCode(jsonTest);
	}

	@Test
	public void testJSON2() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		String jsonTest = "{\"menu\": {\r\n  \"id\": \"file\",\r\n  \"value\": \"File\",\r\n  \"popup\": {\r\n    \"menuitem\": [\r\n      {\"value\": \"New\", \"onclick\": \"CreateNewDoc()\"},\r\n      {\"value\": \"Open\", \"onclick\": \"OpenDoc()\"},\r\n      {\"value\": \"Close\", \"onclick\": \"CloseDoc()\"}\r\n    ]\r\n  }\r\n}}";
		_testJSONCode(jsonTest);
	}

	@Test
	public void testJSON3() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		String jsonTest = "{\"menu\": {\r\n    \"header\": \"SVG Viewer\",\r\n    \"items\": [\r\n        {\"id\": \"Open\"},\r\n        {\"id\": \"OpenNew\", \"label\": \"Open New\"},\r\n        null,\r\n        {\"id\": \"ZoomIn\", \"label\": \"Zoom In\"},\r\n        {\"id\": \"ZoomOut\", \"label\": \"Zoom Out\"},\r\n        {\"id\": \"OriginalView\", \"label\": \"Original View\"},\r\n        null,\r\n        {\"id\": \"Quality\"},\r\n        {\"id\": \"Pause\"},\r\n        {\"id\": \"Mute\"},\r\n        null,\r\n        {\"id\": \"Find\", \"label\": \"Find...\"},\r\n        {\"id\": \"FindAgain\", \"label\": \"Find Again\"},\r\n        {\"id\": \"Copy\"},\r\n        {\"id\": \"CopyAgain\", \"label\": \"Copy Again\"},\r\n        {\"id\": \"CopySVG\", \"label\": \"Copy SVG\"},\r\n        {\"id\": \"ViewSVG\", \"label\": \"View SVG\"},\r\n        {\"id\": \"ViewSource\", \"label\": \"View Source\"},\r\n        {\"id\": \"SaveAs\", \"label\": \"Save As\"},\r\n        null,\r\n        {\"id\": \"Help\"},\r\n        {\"id\": \"About\", \"label\": \"About Adobe CVG Viewer...\"}\r\n    ]\r\n}}";
		_testJSONCode(jsonTest);
	}

	@Test
	public void testIssue1() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		// https://github.com/EXIficient/exificient.js/issues/1
		String jsonTest = "{\n\"type\": \"FeatureCollection\",\n\"totalFeatures\": 2,\n\"features\": [\n{\n\"type\": \"Feature\",\n\"id\": \"poi.1\",\n\"geometry\": {\n\"type\": \"Point\",\n\"coordinates\": [\n40.707587626256554,\n-74.01046109936333\n]\n},\n\"geometry_name\": \"the_geom\",\n\"properties\": {\n\"NAME\": \"museam\",\n\"THUMBNAIL\": \"pics/22037827-Ti.jpg\",\n\"MAINPAGE\": \"pics/22037827-L.jpg\"\n}\n},\n{\n\"type\": \"Feature\",\n\"id\": \"poi.2\",\n\"geometry\": {\n\"type\": \"Point\",\n\"coordinates\": [\n40.70754683896324,\n-74.0108375113659\n]\n},\n\"geometry_name\": \"the_geom\",\n\"properties\": {\n\"NAME\": \"stock\",\n\"THUMBNAIL\": \"pics/22037829-Ti.jpg\",\n\"MAINPAGE\": \"pics/22037829-L.jpg\"\n}\n}\n],\n\"crs\": {\n\"type\": \"EPSG\",\n\"properties\": {\n\"code\": \"4326\"\n}\n}\n}";
		_testJSONCode(jsonTest);
	}
	
	@Test
	public void testSample1() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		String jsonPath = "./data/json/sample1.json";
		String jsonTest = file2String(jsonPath, StandardCharsets.UTF_8);
		_testJSONCode(jsonTest);
	}
	
	@Test
	public void testSample1_Simple() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		String jsonPath = "./data/json/sample1_simple.json";
		String jsonTest = file2String(jsonPath, StandardCharsets.UTF_8);
		_testJSONCode(jsonTest);
	}

	protected static String url2String(URL url) throws IOException {
		BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

		StringBuilder response = new StringBuilder();
		String inputLine;

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}

		in.close();

		return response.toString();
	}

	static String file2String(String path, Charset encoding) throws IOException {
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return new String(encoded, encoding);
	}

	@Test
	public void testJSONLD_URL1() throws IOException, ScriptException, NoSuchMethodException, EXIException {
		URL jsonld = new URL("https://raw.githubusercontent.com/w3c/wot/master/TF-TD/TD%20Samples/led.jsonld");
		String jsonTest = url2String(jsonld);
		_testJSONCode(jsonTest);
	}

	protected void _testJSONCode(String jsonTest)
			throws NoSuchMethodException, IOException, ScriptException, EXIException {
		int enc1 = _testJSONEncode(jsonTest);
		int enc2 = _testJSONEncode(jsonTest, SHARED_STRINGS_EXI_FOR_JSON);
		System.out.println("Encode JSON into " + enc1 + " Bytes and into " + enc2 + " Bytes with shared strings");
		_testJSONDecode(jsonTest);
		_testJSONDecode(jsonTest, SHARED_STRINGS_EXI_FOR_JSON);
	}

	protected int _testJSONEncode(String jsonTest)
			throws IOException, ScriptException, NoSuchMethodException, EXIException {
		return _testJSONEncode(jsonTest, null);
	}

	protected int _testJSONEncode(String jsonTest, List<String> sharedStrings)
			throws IOException, ScriptException, NoSuchMethodException, EXIException {
		ScriptEngineManager engineManager = new ScriptEngineManager();
		ScriptEngine engine = engineManager.getEngineByName("JavaScript");

		// evaluate JS code
		engine.eval(new FileReader(fJS));

		engine.eval("var exiEncoder = new EXI4JSONEncoder();");
		Object obj = engine.get("exiEncoder");
		Invocable inv = (Invocable) engine;
		if (sharedStrings != null) {
			Object o = inv.invokeMethod(engine.get("Java"), "from", sharedStrings);
			inv.invokeMethod(obj, "setSharedStrings", o);
		}
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

				EXIforJSONParser e4jParser;
				if (sharedStrings != null) {
					EXIFactory ef = DefaultEXIFactory.newInstance();
					ef.setSharedStrings(sharedStrings);
					e4jParser = new EXIforJSONParser(ef);
				} else {
					e4jParser = new EXIforJSONParser();
				}
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				e4jParser.parse(new ByteArrayInputStream(foo), baos);

				byte[] bytes = baos.toByteArray();
				// assertTrue(ni == bytes.length); // does not need to be the
				// case
				String jsonTestResult = new String(bytes);

				System.out.println(jsonTestResult);

				// compare both JSON documents
				// JSONAssert.assertEquals(jsonTest, jsonTestResult, true);

				JsonAssert.setTolerance(NUMBER_TOLERANCE);
				JsonAssert.assertJsonEquals(jsonTest, jsonTestResult);
				// JsonAssert.assertJsonEquals("1", "\n1.009\n"); // ,
				// withTolerance(0.01));

				return ni;
			} else {
				fail("getUint8Array not an array");
			}
		} else {
			fail("getUint8ArrayLength not a number");
		}

		return -1;
	}

	protected void _testJSONDecode(String jsonTest)
			throws IOException, ScriptException, NoSuchMethodException, EXIException {
		_testJSONDecode(jsonTest, null);
	}

	protected void _testJSONDecode(String jsonTest, List<String> sharedStrings)
			throws IOException, ScriptException, NoSuchMethodException, EXIException {

		EXIforJSONGenerator e4jGenerator;

		if (sharedStrings != null) {
			EXIFactory ef = DefaultEXIFactory.newInstance();
			ef.setSharedStrings(sharedStrings);
			e4jGenerator = new EXIforJSONGenerator(ef);
		} else {
			e4jGenerator = new EXIforJSONGenerator();
		}

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

		Object obj = engine.get("exiDecoder");
		Invocable inv = (Invocable) engine;
		if (sharedStrings != null) {
			Object o = inv.invokeMethod(engine.get("Java"), "from", sharedStrings);
			inv.invokeMethod(obj, "setSharedStrings", o);

			// inv.invokeMethod(obj, "setSharedStrings", sharedStrings);
			// inv.invokeMethod(obj, "setSharedStrings", "['metadata',
			// 'interactions']");
		}

		engine.eval("var jsonHandler = new JSONEventHandler();");
		engine.eval("exiDecoder.registerEventHandler(jsonHandler);");

		engine.eval("var arrayBuffer = new ArrayBuffer(" + bytes.length + ");");
		engine.eval("var arrayBufferView = new Uint8Array(arrayBuffer);");

		List<Integer> ilist = new ArrayList<>();
		javax.script.Bindings b = new SimpleBindings();
		for (int i = 0; i < bytes.length; i++) {
			int bb = bytes[i];
			if (bb < 0) {
				bb += 256;
			}
			b.put(i + "", bb);
			ibytes[i] = bb;
			ilist.add(bb);

			engine.eval("arrayBufferView[" + i + "] = " + bb + ";"); // parseInt(sp[i],
																		// 16)
		}

		Object o = engine.eval("exiDecoder.decode(arrayBuffer);");
		System.out.println("resultErrn: " + o);

		// Object objJsonHandler = engine.get("jsonHandler");
		// Invocable invJsonHandler = (Invocable) engine;
		// Object oo = invJsonHandler.invokeMethod(objJsonHandler, "getJSON");

		// var jsonText = JSON.stringify(jsonHandler.getJSON(), null, "\t");
		Object jtext = engine.eval("JSON.stringify(jsonHandler.getJSON(), null);");

		// compare both JSON documents
		JsonAssert.setTolerance(NUMBER_TOLERANCE);
		JsonAssert.assertJsonEquals(jsonTest, jtext.toString());
		// JSONAssert.assertEquals(jsonTest, jtext.toString(), true);

		// /////////////////////////////////////////////////
		// // TODO how to call function properly!?
		// System.out.println("resultOO: " + oo);
		// jdk.nashorn.api.scripting.ScriptUtils.unwrap(oo);
		// Object oib = jdk.nashorn.api.scripting.ScriptUtils.wrapArray(ibytes);
		//
		// Object obj = engine.get("exiDecoder");
		// Invocable inv = (Invocable) engine;
		//// inv.invokeMethod(obj, "decode", b);
		//// inv.invokeMethod(obj, "decode", bytes);
		//// inv.invokeMethod(obj, "decode", ibytes);
		//// inv.invokeMethod(obj, "decode", oib);
		//// inv.invokeMethod(obj, "decode(arrayBuffer)");
		//// inv.invokeMethod(obj, "decode", ilist);
		// // System.out.println(obj2);

	}

	public static void main(String[] args) throws EXIException, IOException, NoSuchMethodException, ScriptException {
		// String jsonPath = "./data/json/ais.json";
		String jsonPath = "./data/json/sample1.json";
		String jsonTest = file2String(jsonPath, StandardCharsets.UTF_8);
		TestJSON tj = new TestJSON();
		tj.setUp();
		int i = tj._testJSONEncode(jsonTest);
		System.out.println(i);
	}

}
