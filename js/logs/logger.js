/*
 * App.Logger: A Simple Logger Utility for Logging Messages with Different Severity Levels
 *
 * This code defines an object called App.Logger which is a logger utility designed to log messages with different severity levels, 
 * format them with timestamps, and display them  on the console. It supports four severity levels: no_log, error, warning, info, and debug.
 * The logger displays messages on the console depending on the application's configured logging level.
 *
 * This code implements a flexible logger that allows the application to control what type of logs are displayed based on the configured log level 
 * (appLogLevel). By default, it will show logs of higher priority (e.g., error before warning, etc.). You can configure the logger to be as verbose
 * or minimal as needed, making it useful for both development and production environments.
 */
App.Logger = (function (global, $, undefined) {
	
	var levels = {
			  no_log : 0, //No logging
			  error : 1, //For error messages
			  warning : 2, //For warning messages
			  info : 3, //For informational messages
			  debug : 4, //For detailed debugging messages
			};
			
	var appLogLevel;
	
	/*
	 * The log function accepts the following parameters:
     *
	 * 	level: The severity level of the log message (one of levels.error, levels.warning, levels.info, or levels.debug).
	 *	scope: A string that defines where the log message is coming from (e.g., a module or function).
	 *	message: The log message itself
	 *	
	 *	The function checks the current application log level (appLogLevel) and outputs the message to the console accordingly:
	 *		- It formats the timestamp for the log message in a specific pattern (yyyy-mm-dd hh:mm:ss), and adjusts the time by subtracting 
	 *		50 minutes (3000000 milliseconds).
	 *		- based on the severity level set (appLogLevel)
	 */
	var log = function(level, scope, message) {		
		var d = new Date();
		d = new Date(d.getTime() - 3000000);
		var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";		
		var msg = date_format_str + "\t|\t"; 
		var int_appLogLevel = parseInt(App.Logger.appLogLevel);
		switch (int_appLogLevel) {    	  
		  case levels.error:
			  if (level == levels.error) {
				  msg = msg + 'ERROR' + "|\t" + scope + "\t|\t" + message;
				  console.error(msg);  
			  } 		      		  
			  break;  
		  case levels.warning:
			  if (level == levels.error) {
				  msg = msg + 'ERROR' + "\t|\t" + scope + "\t|\t" + message;
				  console.error(msg);  
			  } 
			  else if (level == levels.warning) {
				  msg = msg + 'WARNING' + "\t|\t" + scope + "\t|\t" + message;
				  console.warn(msg);  
			  } 		  
			  break;  
		  case levels.info:
			  if (level == levels.error) {
				  msg = msg + 'ERROR' + "\t|\t" + scope + "\t|\t" + message;
				  console.error(msg);  
			  } 
			  else if (level == levels.warning) {
				  msg = msg + 'WARNING' + "\t|\t" + scope + "\t|\t" + message;
				  console.warn(msg);  
			  } 
			  else if (level == levels.info) {
				  msg = msg + 'INFO' + "\t|\t" + scope + "\t|\t" + message;
				  console.log(msg);  
			  }    		    
			  break;  
		  case levels.debug:
			  if (level == levels.error) {
				  msg = msg + 'ERROR' + "\t|\t" + scope + "\t|\t" + message;
				  console.error(msg);  
			  } 
			  else if (level == levels.warning) {
				  msg = msg + 'WARNING' + "\t|\t" + scope + "\t|\t" + message;
				  console.warn(msg);  
			  } 
			  else if (level == levels.info) {
				  msg = msg + 'INFO' + "\t|\t" + scope + "\t|\t" + message;
				  console.log(msg);  
			  }  
			  else if (level == levels.debug) {
				  msg = msg + 'DEBUG' + "\t|\t" + scope + "\t|\t" + message;
				  console.debug(msg);  
			  }       		  
			  break;    	  	    	
		}		
    };
    
    
    var getAppLogLevel = function() {				
		//get the setted logs level
	};    
    
    return {
    	levels : levels,
    	getAppLogLevel : getAppLogLevel,
    	appLogLevel : appLogLevel,
    	log : log       
    };
}(window, jQuery));