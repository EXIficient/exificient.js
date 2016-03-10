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

public class EXIficientForJSON {

	static final String EXIFICIENT_JS_FOLDER = "./../";
	static final String EXIFICIENT_JS_NAME = "exificient.js";
	static final String EXIFICIENT_JS4JSON_NAME = "exificient-for-json.js";
	
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
		appendContent(new File(EXIFICIENT_JS_FOLDER + EXIFICIENT_JS4JSON_NAME), out);
		
		
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
		
		String jsonTest = "{\"test\": true}";
        
//		System.out.println(
		engine.eval("var exiEncoder = new EXI4JSONEncoder();");
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
        Object obj2 = inv.invokeMethod(obj, "encodeJsonText", jsonTest);
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