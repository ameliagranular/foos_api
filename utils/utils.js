module.exports = {

	validatePass: function(str) {
		var re = /^([a-zA-Z0-9!#]{8,15})$/;
		return re.test(str);
	},
	validate: function(val) {
		if (val == null) return false;
		else if (val != null && val.length == 0) return false;
		else return true;
	}, 
	validateEmail: function(emailVal) {
    	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(emailVal);
	},
	validateCsrf: function(req, csrf) {
		
		var token = (req.body && req.body._csrf) || 
		(req.query && req.query._csrf) || 
		req.headers['x-access-token'];
	
    	//console.log(csrf );
    	//console.log(token);
    
	
		if (token != undefined && csrf != undefined && token  ==csrf){
			return true;
		}

	},
	getHashed: function(str) {
	  
	  	var ct = this.userHashBase;
	    
	    var userPass = str;
	    
	    var hash = 5931, len = userPass.length;

	    for (var i = 0; i < len;i++) {
	        var charCodeAt = userPass.charCodeAt(i);
	         hash = ((hash<<5)+hash) + charCodeAt;
	    }
    
      	return hash;
	}
    
}