App.Util = (function(global, $, undefined) {

	/* ------------------------------------------------- */
	/* AJAX REQUEST */
	/* ------------------------------------------------- */

	var serverRequest = function(URL, jsonData, method, asyncStatus, callback) {
		App.Logger.log(App.Logger.levels.debug, "Request URL: " + URL
				+ ", Method: " + method);
		if (jsonData) {
			jsonData = JSON.stringify(jsonData);
			App.Logger.log(App.Logger.levels.debug, "POST Data : " + jsonData);
		}

		$.ajax({
			url : URL,
			type : method,
			async : asyncStatus,			
			data : jsonData,
			contentType : "application/json",
			dataType : "json",
			cache : false,
			success : function(response) {
				App.Logger.log(App.Logger.levels.debug, "ServerRequest", "Response Data: " + JSON.stringify(response));
				callback(response);
			},
			error : function(xhr, status, error) {
				App.Logger.log(App.Logger.levels.error, "ServerRequest", xhr.status + ', ' + status + ', ' + error.message);
				callback(null);
			}
		});
	};

	var getAllUrlParams = function(url) {
		var queryString = url ? url.split('?')[1] : window.location.search
				.slice(1);
		var obj = {};
		if (queryString) {
			queryString = queryString.split('#')[0];
			var arr = queryString.split('&');
			for (var i = 0; i < arr.length; i++) {
				var a = arr[i].split('=');
				var paramName = a[0];
				var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
				if (paramName.match(/\[(\d+)?\]$/)) {
					var key = paramName.replace(/\[(\d+)?\]/, '');
					if (!obj[key])
						obj[key] = [];
					if (paramName.match(/\[\d+\]$/)) {
						var index = /\[(\d+)\]/.exec(paramName)[1];
						obj[key][index] = paramValue;
					} else {
						obj[key].push(paramValue);
					}
				} else {
					if (!obj[paramName]) {
						obj[paramName] = paramValue;
					} else if (obj[paramName]
							&& typeof obj[paramName] === 'string') {
						obj[paramName] = [ obj[paramName] ];
						obj[paramName].push(paramValue);
					} else {
						obj[paramName].push(paramValue);
					}
				}
			}
		}
		return obj;
	}

	var httpGet = function(theUrl) {
		var request = new XMLHttpRequest();
		request.open('GET', theUrl, true);
		request.send(null);
		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
				var type = request.getResponseHeader('Content-Type');
				if (type.indexOf("text") !== 1) {
					return request.responseText;
				}
			}
		}
	}

	var wordWrap = function(the_string, width) {
		var nl;
		var pos = 0;
		var next;
		var _newline = "<br/>";
		var sb = "";
		if (width < 1)
			return the_string;

		nl = 0;
		for (; pos < the_string.length; pos = next) {
			var eol = the_string.indexOf(_newline, pos);
			if (eol == -1)
				next = eol = the_string.length;
			else
				next = eol + _newline.length;
			if (eol > pos) {
				do {
					var len = eol - pos;
					if (len > width) {
						len = App.Util.breakLine(the_string, pos, width);
					}
					sb += the_string.substr(pos, len)
					/*
					 * We make sure to produce max 3 lines, then add ellipsis
					 * otherwise 4th line goes out of the button div
					 */
					if (nl == 2 && (pos + len) < eol) {
						sb.slice(0, -2)
						sb += "..."
						break;
					}
					sb += _newline
					nl++;
					pos = pos + len;
					while (pos < eol && !/\S/.test(the_string.charAt(pos))) {
						pos++;
					}

				} while (eol > pos);
			} else {
				sb += _newline // Empty line
				nl++;
			}
		}
		return sb;
	}

	var breakLine = function(text, pos, max) {
		var i = max - 1;
		while (i >= 0 && /\S/.test(text.charAt(pos + i))) {
			i--;
		}
		if (i < 0)
			return max; // No whitespace found; break at maximum length
		// Find start of whitespace
		while (i >= 0 && !/\S/.test(text.charAt(pos + i))) {
			i--;
		}
		// Return length of text before whitespace
		return i + 1;
	};

	// For beep sound
	var _isEwb = (typeof __ewb__ !== "undefined");

	var soundBeep = function() {
		if (_isEwb) {
			__ewb__.beep("normal");
		}
	};

	// variable that holds the start key callback.
	var _startKeyCallback = null;

	// variable that holds the function clear key callback.
	var _fcKeyCallback = null;

	var registHardKeyCallback = function(startKeyCallback, fcKeyCallback) {
		App.Logger.log(App.Logger.levels.debug,
				"method : registHardkeyCallback()");
		App.Util._startKeyCallback = startKeyCallback;
		App.Util._fcKeyCallback = fcKeyCallback;
	};

	var unregistHardKeyCallback = function() {
		App.Logger.log(App.Logger.levels.debug,
				"method : unregistHardKeyCallback()");
		App.Util._startKeyCallback = null;
		App.Util._fcKeyCallback = null;
	};

	// Hard Key handler.
	$(document).on(
			"keydown",
			function(e) {
				var key = e.originalEvent.keyIdentifier;
				if (key === "F20") {
					App.Logger.log(App.Logger.levels.debug, "Press StartKey");
					if (typeof App.Util._startKeyCallback !== "function") {
						App.Logger.log(App.Logger.levels.debug,
								"This screen is not handled this key.");
						return;
					}
					App.Util._startKeyCallback();

				} else if (key === "F22") {
					App.Logger.log(App.Logger.levels.debug, "Press FCKey");
					if (typeof App.Util._fcKeyCallback !== "function") {
						App.Logger.log(App.Logger.levels.debug,
								"This screen is not handled this key.");
						return;
					}
					App.Util._fcKeyCallback();
				}
			});

	var validateApiUrl = function(serverAddress) {
		var tarea = serverAddress;
		if (tarea.indexOf("http://") == -1 && tarea.indexOf("https://") == -1) {
			return "https://" + App.Configuration.address + ":"
					+ (parseInt(App.Configuration.port) + 4)
		} else if (tarea.indexOf("http://") == 0) {
			return App.Configuration.address + ":"
					+ (parseInt(App.Configuration.port) + 3)
		} else if (tarea.indexOf("https://") == 0) {
			return App.Configuration.address + ":"
					+ (parseInt(App.Configuration.port) + 4)
		}
	};

	var subscribeSSE = function() {
		App.Logger.log(App.Logger.levels.debug, 'Subscribing for SSE');
		global.EventManager = new cAPIEventManager(App.appId,
				App.appToken['X-WebAPI-AccessToken']);
		global.EventManager.addEventListener(App.EventReceiver.eventReceiver);
		global.EventManager.startAPIEvents();
	};

	var unsubscribeSSE = function() {
		App.Logger.log(App.Logger.levels.debug, 'Unsubscribing for SSE');
		global.EventManager.stopAPIEvents();
		global.EventManager.removeEventListener(App.EventReceiver.eventReceiver);
	};

	// funzione per lo string.format
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number]
						: match;
			});
		};
	}

	var isEmpty = function(str) {
		return (!str || 0 === str.length);
	}
	
	var popUpMessage = function(title, message, buttonText) {
		var modal = $('#modalMessage');
		modal.find('.modal-title').text(title);
		modal.find('.modal-body').text(message);
		modal.find('.btn-secondary').text(buttonText);
		modal.modal();
	}
	
	var xml2json = function(xml, tab) {
	   var X = {
	      toObj: function(xml) {
	         var o = {};
	         if (xml.nodeType==1) {   // element node ..
	            if (xml.attributes.length)   // element with attributes  ..
	               for (var i=0; i<xml.attributes.length; i++)
	                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
	            if (xml.firstChild) { // element has child nodes ..
	               var textChild=0, cdataChild=0, hasElementChild=false;
	               for (var n=xml.firstChild; n; n=n.nextSibling) {
	                  if (n.nodeType==1) hasElementChild = true;
	                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
	                  else if (n.nodeType==4) cdataChild++; // cdata section node
	               }
	               if (hasElementChild) {
	                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
	                     X.removeWhite(xml);
	                     for (var n=xml.firstChild; n; n=n.nextSibling) {
	                        if (n.nodeType == 3)  // text node
	                           o["#text"] = X.escape(n.nodeValue);
	                        else if (n.nodeType == 4)  // cdata node
	                           o["#cdata"] = X.escape(n.nodeValue);
	                        else if (o[n.nodeName]) {  // multiple occurence of element ..
	                           if (o[n.nodeName] instanceof Array)
	                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
	                           else
	                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
	                        }
	                        else  // first occurence of element..
	                           o[n.nodeName] = X.toObj(n);
	                     }
	                  }
	                  else { // mixed content
	                     if (!xml.attributes.length)
	                        o = X.escape(X.innerXml(xml));
	                     else
	                        o["#text"] = X.escape(X.innerXml(xml));
	                  }
	               }
	               else if (textChild) { // pure text
	                  if (!xml.attributes.length)
	                     o = X.escape(X.innerXml(xml));
	                  else
	                     o["#text"] = X.escape(X.innerXml(xml));
	               }
	               else if (cdataChild) { // cdata
	                  if (cdataChild > 1)
	                     o = X.escape(X.innerXml(xml));
	                  else
	                     for (var n=xml.firstChild; n; n=n.nextSibling)
	                        o["#cdata"] = X.escape(n.nodeValue);
	               }
	            }
	            if (!xml.attributes.length && !xml.firstChild) o = null;
	         }
	         else if (xml.nodeType==9) { // document.node
	            o = X.toObj(xml.documentElement);
	         }
	         else
	            alert("unhandled node type: " + xml.nodeType);
	         return o;
	      },
	      toJson: function(o, name, ind) {
	         var json = name ? ("\""+name+"\"") : "";
	         if (o instanceof Array) {
	            for (var i=0,n=o.length; i<n; i++)
	               o[i] = X.toJson(o[i], "", ind+"\t");
	            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
	         }
	         else if (o == null)
	            json += (name&&":") + "null";
	         else if (typeof(o) == "object") {
	            var arr = [];
	            for (var m in o)
	               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
	            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
	         }
	         else if (typeof(o) == "string")
	            json += (name&&":") + "\"" + o.toString() + "\"";
	         else
	            json += (name&&":") + o.toString();
	         return json;
	      },
	      innerXml: function(node) {
	         var s = ""
	         if ("innerHTML" in node)
	            s = node.innerHTML;
	         else {
	            var asXml = function(n) {
	               var s = "";
	               if (n.nodeType == 1) {
	                  s += "<" + n.nodeName;
	                  for (var i=0; i<n.attributes.length;i++)
	                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
	                  if (n.firstChild) {
	                     s += ">";
	                     for (var c=n.firstChild; c; c=c.nextSibling)
	                        s += asXml(c);
	                     s += "</"+n.nodeName+">";
	                  }
	                  else
	                     s += "/>";
	               }
	               else if (n.nodeType == 3)
	                  s += n.nodeValue;
	               else if (n.nodeType == 4)
	                  s += "<![CDATA[" + n.nodeValue + "]]>";
	               return s;
	            };
	            for (var c=node.firstChild; c; c=c.nextSibling)
	               s += asXml(c);
	         }
	         return s;
	      },
	      escape: function(txt) {
	         return txt.replace(/[\\]/g, "\\\\")
	                   .replace(/[\"]/g, '\\"')
	                   .replace(/[\n]/g, '\\n')
	                   .replace(/[\r]/g, '\\r');
	      },
	      removeWhite: function(e) {
	         e.normalize();
	         for (var n = e.firstChild; n; ) {
	            if (n.nodeType == 3) {  // text node
	               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
	                  var nxt = n.nextSibling;
	                  e.removeChild(n);
	                  n = nxt;
	               }
	               else
	                  n = n.nextSibling;
	            }
	            else if (n.nodeType == 1) {  // element node
	               X.removeWhite(n);
	               n = n.nextSibling;
	            }
	            else                      // any other node
	               n = n.nextSibling;
	         }
	         return e;
	      }
	   };
	   if (xml.nodeType == 9) // document node
	      xml = xml.documentElement;
	   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
	   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

	return {
		serverRequest : serverRequest,
		getAllUrlParams : getAllUrlParams,
		popUpMessage : popUpMessage,
		validateApiUrl : validateApiUrl,
		wordWrap : wordWrap,
		breakLine : breakLine,
		isEmpty : isEmpty,
		httpGet : httpGet,
		soundBeep : soundBeep,
		subscribeSSE : subscribeSSE,
		unsubscribeSSE : unsubscribeSSE,		
		registHardKeyCallback : registHardKeyCallback,
		unregistHardKeyCallback : unregistHardKeyCallback,
		xml2json : xml2json
	};

})(window, jQuery);