/*
 * General script that sets up event listeners for various key events that occur during the page loading process. 
 * It is designed to handle different stages of the document's lifecycle and log relevant information at each stage using the App.
 * Logger utility. It logs the events when the page is loaded, when the document's ready state changes, and when the DOM is fully loaded
 *
 *
 * Dynamic Script Loading: It loads language files (via JavaScript) and logs success or failure events.
 * Language Switching (switchLang): It dynamically loads the selected language file and updates the UI with localized content. The selected language is also stored in localStorage for persistence.
 * Copyright Label Interaction: When the user clicks the copyright label, a logging function (App.activateLog()) is called to toggle between different logging levels.
 * Snackbar Message: It shows temporary feedback messages to the user using a snackbar element.
 * Overall, this code is focused on managing language settings, displaying feedback, and enabling debug-level logging through user interactions. 
 * It enhances the user experience by providing real-time feedback and dynamic content updates based on language preferences.
 *
 */

/*
 * When the load event is fired, it executes the provided function, which logs an info level message to the console using App.Logger
 * This listener marks the complete loading of the page and is useful for logging when the whole page is ready for user interaction
 */
window.addEventListener("load", (event) => {
	App.Logger.log(App.Logger.levels.info, TAG, "load\n");  
	App.init();
});

/*
 * This listener responds to changes in the document's readyState. The readyState property can have one of the following values:
 *	loading: The document is still loading.
 *	interactive: The document has finished loading, but resources like images and stylesheets may still be loading.
 *	complete: The document and all resources have finished loading.
 *
 * This is useful for tracking the state of the document and knowing exactly at which point the document is during its loading process.
 */
document.addEventListener("readystatechange", (event) => {
	App.Logger.log(App.Logger.levels.info, TAG, 'readystate: ${document.readyState}\n');    
});

/*
 * The DOMContentLoaded event is fired when the HTML document has been completely loaded and parsed, without waiting for stylesheets, 
 * images, or subframes to finish loading.
 *
 * This listener helps to log the moment when the DOM content is fully loaded, meaning all the HTML structure is available, 
 * but external resources might still be in the process of loading
 */
document.addEventListener("DOMContentLoaded", (event) => {
	App.Logger.log(App.Logger.levels.info, TAG, 'DOMContentLoaded\n');      
});


/*
 * Dynamic loading of the script
 * In some situations, we want to load third-party script files dynamically in JavaScript.
 * Those files can be loaded asynchronously in JavaScript.	
 * To load a JavaScript file dynamically:
 *	Create a script element.
 *	Set the src, async, and type attributes.
 *  Append the script element to the body.
 * Check if the file loaded or not in the load event.
 */

function loadJS(FILE_URL, async = true, callback_succ) {
  let scriptEle = document.createElement("script");
  var succ = callback_succ;
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);	
  

 /* called when success */
  scriptEle.addEventListener("load", () => {
	App.Logger.log(App.Logger.levels.debug, TAG, "File languages loaded.")		        
	App.appMessages = messages;	
	succ();
  });
/* If there is an error in loading the script 
 * (e.g., the file is not found), an error-level log is generated using App.Logger, which logs the error event details.
 */
  scriptEle.addEventListener("error", (ev) => {
	  App.Logger.log(App.Logger.levels.error, TAG, {ev})		            
  });
}

/*
 * This function is used to switch the language of the application dynamically.
 * It first checks if the provided lang parameter is undefined. If so, it defaults to the app's current language (App.appLanguage)
 * It logs the language change event (for debugging purposes) and then stores the selected language in localStorage so the choice 
 * persists across sessions.
 *
 * This function enables the dynamic switching of the app's language, updating the page's content based on localized strings 
 * loaded from a JavaScript file.
 */
function switchLang(lang) {
	if (lang == 'undefined' || lang == undefined)
		lang = App.appLanguage
	App.Logger.log(App.Logger.levels.debug, TAG, "switchLang:" + lang)		        
	localStorage.setItem("lang", lang);
	if (lang) {
		App.appLanguage = lang;
		loadJS("./js/localization/" + App.appLanguage + "/messages.js",true, () => {		
			//App.appMessages = messages;		
			for (let key in App.appMessages) {
				try{ document.getElementById(key).innerHTML = App.appMessages[key]; } catch(e){};		
			}
		  })	
	} else {
		for (let key in App.appMessages) {
			try{ document.getElementById(key).innerHTML = App.appMessages[key]; } catch(e){};		
		}
	}
}

var lbl_copyright = document.getElementById('label_copyright');

lbl_copyright.style.cursor = 'pointer';
/*
 * When the user clicks on this element, an info-level log is generated with the message "Service button clicked...", 
 * and the App.activateLog() function is called to toggle logging levels
 */
lbl_copyright.onclick = function() {
    App.Logger.log(App.Logger.levels.debug, TAG, "Service button clicked...")		        
	App.activateLog();
};

/*
 * This function displays a snackbar message, which is typically a small popup that appears at the bottom of the screen 
 * to give feedback to the user.
 * It first finds the HTML element with the ID snackbar and sets its inner HTML to the provided message
 * It then adds a show class to the snackbar element, which presumably makes it visible (likely through CSS animations).
 * After 2 seconds (2000 milliseconds), the show class is removed from the snackbar, causing it to hide again.
 *
 * This function is used to display temporary messages to the user, typically for notifications or feedback.
 */
function showMessage(message) {
	var x = document.getElementById("snackbar");
	x.innerHTML = message;
	x.className = "show";
	setTimeout(function() {
		x.className = x.className.replace("show", "");
	}, 2000);
}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

/*
 * This function try to start a integration into Scanshare, get the email from the field check if it is a valid email using a RegExp and start an Ajax Post call
 * It's connect to python script server side that integrate and start the workflow inside Scanshare
 * For more info about Scanshare and our integration on it go to help.scanshare.com
 *
 * Note: I'm a developer inside Scanshare Applications B.V. since several years
 *
 */

function tryMe(){	
	var email = document.getElementById('email').value;	
	App.Logger.log(App.Logger.levels.debug, TAG, "Email: " + email);	   
	if (validateEmail(email)) {
		$.ajax({
		  type: "POST",
		  url: "https://lucascarpati.com/py/StartWorkflowThesis.py?" + encodeURIComponent(email),		  
		}).done(function( o ) {
		   App.Logger.log(App.Logger.levels.debug, TAG, "Called correctly!" + o);	   
		   showMessage(App.appMessages["msg_startworkflow"]);
		});
	} else {
		showMessage(App.appMessages["msg_emailnotvalid"]);
	}	
}