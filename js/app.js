/*
 * This code defines an IIFE (Immediately Invoked Function Expression) that creates the App object, 
 * encapsulating various properties and methods to handle app initialization, language settings, logging, and configuration.
 *
 * This code defines a JavaScript app object (App) that handles initialization, language selection, logging, and localization 
 * for a project (likely a thesis project on sustainability). It provides a basic structure for setting up the app's language 
 * and logging levels, allowing the user to toggle between logging modes based on their interactions. The app uses localStorage 
 * for persistence of language and logging settings across sessions.
 */

var App = (function (global, $, undefined) {	
	var name = "Sustainability reports" //name of the app
	var description = "Thesis - Project Work -> Laurea in Informatica per le aziende digitali L-31" //A short description of the project
	var version = "1.0.0";	//The app's version
    
    var appLanguage = ""; //Holds the current language of the app. Initially empty, it is set when the app initializes
    var appMessages = {}; //An object to store messages used in the app (such as localized strings)
    var appLog = false; //A boolean flag that determines if the app's logging is active
	
	/*
	 * Upon app initialization, it determines the user's preferred language and log level.
	 * If language and log level preferences are stored in localStorage, they are applied. If not, defaults are used.
	 * The correct localization file is then loaded (in the selected language) for messages, and the app logs the initialization details.
	 */
	var init = function(callback) {
		if (localStorage.getItem("lang") != undefined) {
			App.appLanguage = checkLangSupported(localStorage.getItem("lang"));
		} else {
			App.appLanguage = checkLangSupported(navigator.language || navigator.userLanguage);
		}
		if (localStorage.getItem("loglevel") != undefined && localStorage.getItem("loglevel") != "") {
			App.appLog = true;
			App.Logger.appLogLevel = localStorage.getItem("loglevel");
		} else {
			App.Logger.appLogLevel = App.Logger.levels.error;
		}
		
		App.Logger.log(App.Logger.levels.info, TAG, "Init App..." + App.appLanguage)
		/*
		 * This function is referenced, likely responsible for dynamically loading JavaScript files (like the localization files)
		 */
		loadJS("./js/localization/" + App.appLanguage + "/messages.js", true, switchLang)	
		
		App.Logger.log(App.Logger.levels.debug, TAG, "Hello I'm Project Work of Luca and I hope that all is good!");				
		
	};
	
	/*
	 * A function that takes a language code and checks whether it’s supported. 
	 * If the language is unsupported, it defaults to en-gb (English - Great Britain). 
	 * It supports English (en, en-gb) and Italian (it, it-it).
     *	
	 * The function returns either en-gb or it-it based on the detected or stored language.
	 */
	function checkLangSupported(language) {
		switch (language) {		  
		  case 'en':
		  case 'en-gb':
		  case 'en-GB':
		    return 'en-gb';		  
		  case 'it':
		  case 'it-it':
		  case 'it-IT':
		    return 'it-it';		  
		  default:
			App.Logger.log(App.Logger.levels.info, TAG, "Language not support switch to en-gb")		    
		    return 'en-gb';		    
		}
	};
	
	var countClick = 1; //A counter that tracks how many times a user has triggered the log activation function
	/*
	 * This function allows toggling between different log levels (error and debug).
	 * It uses the countClick variable to limit how many times the user can click before toggling the logging level.
	 * If the user clicks more than 9 times, it switches the logging between debug (verbose logging) and error (only error logging).
	 * When the log level is set to debug, it enables detailed logging and stores this preference in localStorage. 
	 * When switched to error, it disables detailed logging and reverts to error-level logs.
	 *
	 * The function tracks the number of clicks and allows toggling the log level between error and debug after a certain number of clicks.
	 * When switching to debug, more detailed logging is enabled, and the setting is saved to localStorage. 
	 * When switching back to error, only critical logs are shown.
	 */
	var activateLog = function () {
		if (countClick < 10) {
			countClick++;
		} 
		else {
			if (App.appLog) {
				App.appLog = false;
				App.Logger.log(App.Logger.levels.info, TAG, "Log returns to error level.")		    
				App.Logger.appLogLevel = App.Logger.levels.error;				
				localStorage.removeItem("loglevel");
				/*
				 * Another referenced function not defined in the provided code. 
				 * It appears to show a message to the user, possibly via a UI element like a modal or toast notification.
				 */
				showMessage(App.appMessages.msg_logsdisabled);		            					
			} else {
				App.appLog = true;
				App.Logger.appLogLevel = App.Logger.levels.debug;
				localStorage.setItem("loglevel", App.Logger.appLogLevel);
				App.Logger.log(App.Logger.levels.info, TAG, "Log in debug enabled.")					
				showMessage(App.appMessages.msg_logsenabled);		            			
			}		            		
			countClick = 1;		            		
		}
	}   
	
	/*
	 * The IIFE returns an object representing the App object with the following properties and methods
	 */
	return {
		init: init,
		name : name,
		version : version,
		appLanguage : appLanguage,
		appMessages : appMessages,
		appLog : appLog,
		activateLog : activateLog
	};
}(window, jQuery));