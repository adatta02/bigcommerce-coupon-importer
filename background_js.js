var couponCodes = [ ];
var isStarted = false;
var configuredForm = [ ];
var withCats = false;
	
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	
		var resp = { };
		
		if( request.msg == "setCodes" && request.codes ){
			couponCodes = request.codes.split("\n");
			configuredForm = request.form;
			withCats = request.withCats;
			isStarted = true;
		}
		
		if( request.msg == "hasCode" ){
			resp.hasCodes = couponCodes.length > 0 ? true : false;
		}
			
		if( request.msg == "getCode" ){
			resp.left = couponCodes.length;
			resp.code = couponCodes.pop();
			resp.configuredForm = configuredForm;
			resp.isStarted = isStarted;
			resp.withCats = withCats;
		}
			
		sendResponse( resp );
});
