
function getXMLDocument(textXML) {
	/*
	 * should allow parsing XML string into an XML document in all major
	 * browsers, including Internet Explorer 6 and Java Nashorn.
	 */
	var xmlDoc;
	if (typeof window !== 'undefined' && typeof window.DOMParser != "undefined") {
		var parseXml = function(xmlStr) {
			return (new window.DOMParser()).parseFromString(xmlStr,
					"text/xml");
		};
		xmlDoc = parseXml(textXML);
	} else if (typeof window !== 'undefined' && typeof window.ActiveXObject != "undefined"
			&& new window.ActiveXObject("Microsoft.XMLDOM")) {
		var parseXml = function(xmlStr) {
			var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(xmlStr);
			return xmlDoc;
		};
		xmlDoc = parseXml(textXML);
	} else if (typeof javax.xml.parsers.DocumentBuilderFactory != "undefined" ) {
		var factory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
		factory.setNamespaceAware(true);
		var documentBuilder = factory.newDocumentBuilder();
		xmlDoc = documentBuilder.parse(new org.xml.sax.InputSource(new java.io.StringReader(textXML)));
		/* return doc; */
	} else {
		throw new Error("No XML parser found");
	}
	
	return xmlDoc;
}