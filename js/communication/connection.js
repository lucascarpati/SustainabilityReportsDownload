const request_Ping = "/api/Clients/Ping";
const request_GetServerVersion = "/api/Service/GetServerVersion";
const request_Disconnect = "/api/Clients/Disconnect";
const request_AllowedToConnect3 = "/api/Clients/AllowedToConnect3";
const request_UserLogin2 = "/api/Clients/UserLogin2";
const request_UserLoginSilent2 = "/api/Clients/UserLoginSilent2";
const request_UserLoginSilent3 = "/api/Clients/UserLoginSilent3";
const request_GetConfiguration = "/api/Clients/GetConfiguration";
const request_GetWorkflowList = "/api/Clients/GetWorkflowList";
const request_GetWorkflowList2 = "/api/Clients/GetWorkflowList2";
const request_GetItemList = "/api/Clients/GetItemList";
const request_GetItemList2 = "/api/Clients/GetItemList2";
const request_GetItemList3 = "/api/Clients/GetItemList3";
const request_saveVariableValues = "/api/Clients/SaveVariableValues";
const request_ExecuteXeroxStore = "/api/Clients/ExecuteXeroxStore";
const request_SaveVariableFile = "/api/Clients/SaveVariableFile";
const cTAG = "Connection";
    
function Connection(serverAddress, serverPort, clientAddress, clientType, ssl) {
		this.serverAddress = serverAddress;
		this.serverPort = parseInt(serverPort);
		this.clientAddress = clientAddress;
		this.clientType = clientType;
		this.ssl = ssl;
		if (this.ssl) {
			this.serverPort = this.serverPort + 4;
			if (this.serverAddress.lastIndexOf("https://", 0) === 0) {
				this.apiUrl = this.serverAddress + ":" + this.serverPort;
			} 
			else {
				this.apiUrl = "https://" + this.serverAddress + ":" + this.serverPort
			}
		} 
		else {
			this.serverPort = this.serverPort + 3;
			if (this.serverAddress.lastIndexOf("http://", 0) === 0) {
				this.apiUrl = this.serverAddress + ":" + this.serverPort
			}
			else {
				this.apiUrl = "http://" + this.serverAddress + ":" + this.serverPort
			}
		}
		App.Logger.log(App.Logger.levels.debug, cTAG, "Api url: " + this.apiUrl);
		this.username = "";
		this.password = "";
		this.connected = false;
		this.loginRequired = false;
		this.ssoRequired = false;				
		this.lastError = "";
		
	
	this.getApiURLScan = function(serverAddress, serverPort, ssl) {
		this.serverAddress = serverAddress;
		this.serverPort = parseInt(serverPort);		
		this.ssl = ssl;
		if (this.ssl) {
			this.serverPort = this.serverPort + 4;
			return this.serverAddress + ":" + this.serverPort;			
		} 
		else {
			this.serverPort = this.serverPort + 3;
			return this.serverAddress + ":" + this.serverPort;
		}		
	}
	
	this.checkConnection = function(mycallback_success, mycallback_failure) {
		App.Logger.log(App.Logger.levels.debug, cTAG, "Check connection...");
		var jsonData = {};
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_Ping, dataBody, "POST", true, mycallback_success, mycallback_failure);			
	}
	
	this.checkConnection_success = function (ws_request, ws_response) {
		App.Logger.log(App.Logger.levels.debug, cTAG, "Check connection success!");
		var result = false;
		if (ws_response) {
			if (ws_response.lastIndexOf("{\"Message\":", 0) === 0 ) {
				this.lastError = ws_response;					
			} else {
				App.Logger.log(App.Logger.levels.debug, cTAG, "PONG");
				this.lastError = "";
				this.connected = true;
				result = true;
			}
		}
		return result;		
	}	
	
	this.general_failure = function(ws_request, ws_response, ws_status){
		alert("error: " + ws_status + ", " + ws_response);
	}	
	
	this.disconnect = function(clientAddress, mycallback_success, mycallback_failure) {
		App.Logger.log(App.Logger.levels.debug, cTAG, "Disconnect...");
		this.clientAddress = clientAddress;
		var jsonData = {
				"Address": this.clientAddress
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];		
		App.Util.serverRequest(this.apiUrl + request_Disconnect, dataBody, "POST", true, mycallback_success, mycallback_failure);		
	}
	
	this.disconnect_success = function (ws_request, ws_response) {
		App.Logger.log(App.Logger.levels.debug, cTAG, "Disconnect success!");				
		return true;		
	}	
	
	this.getServerVersion = function(callback_success, callback_failure) {		
		var dataBody = "";
		var headers = [["content-type", "application/json"]];	
		App.Util.serverRequest(this.apiUrl + request_GetServerVersion, dataBody, "GET", true, callback_success, callback_failure);
	}
	
	this.clientIsAllowed3 = function(clientAddress, username, password, email, domain, name, model, sn, macaddress, accounting, mycallback_success, mycallback_failure) {
		App.Logger.log(App.Logger.levels.debug, cTAG, "Client is allowed...");
		this.clientAddress = clientAddress;
		this.username = username;        	        	
        this.password = password;
        this.email = email;        	
        this.domain = domain;        	
		var jsonData = {
				"Address": clientAddress,
				"ClientType": "Xerox",
				"Email": email,
				"Password": password,
				"Username": username,
				"Name": name,
				"Model": model,
				"SN": sn,
				"MACAddress": macaddress,
				"Accounting": accounting
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];		
		App.Util.serverRequest(this.apiUrl + request_AllowedToConnect3, dataBody, "POST", true, mycallback_success, mycallback_failure);		
	}
	
	this.login2 = function(username, password, domain, mycallback_success, mycallback_failure) {
		var jsonData = {
				"Address": this.clientAddress,				
				"Username": username,
				"Password": password,
				"Domain": domain
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_UserLogin2, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.silentLogin2 = function(username, password, domain, mycallback_success, mycallback_failure) {
		var jsonData = {
				"Address": this.clientAddress,				
				"Username": username,
				"Password": password,
				"Domain": domain
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_UserLoginSilent2, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.silentLogin3 = function(username, password, domain, mycallback_success, mycallback_failure) {
		var jsonData = {
				"Address": this.clientAddress,				
				"Username": username,
				"Password": password,
				"Domain": domain
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_UserLoginSilent3, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.getConfiguration = function(clientAddress, parameters, mycallback_success, mycallback_failure) {
		this.clientAddress = clientAddress;
		var jsonData = {
				"Address": this.clientAddress,
				"ClientType": "Xerox",
				"Parameters": parameters
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_GetConfiguration, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.isConnected = function() {
        return this.connected;
    }
    
    this.getWorkflows = function(clientAddress, reloadFromTheServer, mycallback_success, mycallback_failure) {
		this.clientAddress = clientAddress;
		var jsonData = {
				"Address": this.clientAddress,				
				"Client": 15
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_GetWorkflowList2, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}	
	
	this.saveVariables = function(clientAddress,  workflow, mycallback_success, mycallback_failure) {
		this.clientAddress = clientAddress;
		var jsonData = {
				"Address": this.clientAddress,				
				"Workflow": workflow	
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_saveVariableValues, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.getItemList2 = function(clientAddress,  workflowId, questionId, variables, mycallback_success, mycallback_failure) {
		this.clientAddress = clientAddress;
		var jsonData = {
				"ClientAddress": this.clientAddress,				
				"QuestionId": questionId,
				"WorkflowId": workflowId,
				"Variables": variables	
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_GetItemList2, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.getItemList3 = function(clientAddress,  workflowId, questionId, parent, variables, mycallback_success, mycallback_failure) {
		this.clientAddress = clientAddress;
		var jsonData = {
				"ClientAddress": this.clientAddress,				
				"QuestionId": questionId,
				"WorkflowId": workflowId,
				"Parent": parent,
				"Variables": variables	
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_GetItemList3, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
	
	this.saveVariableFile = function(clientAddress, MACAddress, workflowId, filename, ftpStore, singlePages, ftpBaseFile, ftpExtension, variables, mycallback_success, mycallback_failure) {
		this.clientAddress = clientAddress;
		var jsonData = {
				"Address": this.clientAddress,				
				"MACAddress": MACAddress,
				"Workflowid": workflowId,
				"Filename": filename,
				"FtpTransfer": ftpStore,
				"SinglePages": singlePages,
				"FtpBaseFile": ftpBaseFile,
				"FtpImageExtension": ftpExtension,
				"Variables": variables
			}
		var dataBody = JSON.stringify(jsonData);
		var headers = [["content-type", "application/json"]];
		App.Util.serverRequest(this.apiUrl + request_SaveVariableFile, dataBody, "POST", true, mycallback_success, mycallback_failure);
	}
    
}