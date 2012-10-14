var addCouponDiv = "";

$(document).ready( function( $ ){

  if( $("#frmCoupons .actionBar").length ){
	$("#frmCoupons .actionBar")
			.html( $("#frmCoupons .actionBar").html() 
			+ "<input type='button' id='sfBigCommImport' value='Bulk Import' />");
  
	$("#sfBigCommImport").click( function(){
				
		$(".ContentContainer")
			.append( "<form id='sfBigCommForm'>" + addCouponDiv + "</form>"
					+ "Generate codes: <input type='text' placeholder='how many?' id='sfGenerateNum' /><input type='button' id='sfGenerateCodes' value='Generate Codes' /><br>"
					+ "Already have codes? Enter them below (1 per line)<br><textarea style='width:500px; height: 300px' id='sfBigcCommCodes' placeholder='Enter codes here...'></textarea>" 
					+ "<input type='button' id='sfBigCommStart' value='Start Import' />");
		
		$(".ContentContainer").find(".Panel:last").remove();
		
		$("#couponcode").parents("tr:first").remove();
		$("#couponname").parents("tr:first").remove();
		$("#dc1").attr("onfocus", null);
		$("#dc1").attr("readonly", null);
		
		$("#CouponMaxUsesNode, #CouponMaxUsesPerCustomerNode").show();
		
		$("#sfBigCommForm input:first").focus();
		
		return false;
	});
  
    $("#sfBigCommStart").live( "click", function(){
		var form = $("#sfBigCommForm").serializeArray();	
		chrome.extension.sendRequest({ msg: "setCodes", codes: $("#sfBigcCommCodes").val(), form: form });
		window.location = "/admin/index.php?ToDo=createCoupon";
       return false;
    });
  
	$("#sfGenerateCodes").live("click", function(){
		
		var howMany = $("#sfGenerateNum").val();
		if( !howMany.length ){
			alert("Sorry! You need to enter a number to generate.");
		}		
		
		var codes = [];
		var code;
		
		for(var i=0; i < howMany; i++){
			
			code = "";
			for(var j=0; j < 15; j++){
				
				if( Math.random() > .3 ){
					code += String.fromCharCode( Math.floor( ( Math.random() * 26 ) + 65) );
				}else{
					code += Math.floor( (Math.random() * 9) + 1 );
				}
				
			}
			
			codes.push( code );
		}
		
		$("#sfBigcCommCodes").val( codes.join("\n") );
		
		return false;
	});
  
    $.get("/admin/index.php?ToDo=createCoupon", function(data){
		addCouponDiv = $(data).find("#div0").html();
	});
  
	chrome.extension.sendRequest( {msg: "hasCode"}, function(resp){
		if( resp.hasCodes == true ){
			window.location = "/admin/index.php?ToDo=createCoupon";
		}
	});
  
  }
  
  if( $("#couponcode").length ){
	  chrome.extension.sendRequest( {msg: "getCode"}, function(resp){
		
		if( !resp.isStarted ){
			return false;
		}
		
		if( resp.left == 0 && !resp.code ){
			$("#content > h1").html( "No codes to import!");
			return false;
		}
				
		$("#content > h1").html( resp.left );
		
		$("#couponcode").val( resp.code );
		$("#couponname").val( "IMPORTED: " + resp.code );
		
		$.each( resp.configuredForm, function(i, val){
			$("input[name='" + val.name + "']").val( val.value );
		});
				
		$("input[name='SaveButton1']:last").click();
		
	  });
  }
  
});
