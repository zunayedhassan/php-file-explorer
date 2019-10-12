"use strict";

class Ajax {
    static ON_BLOB_ACTION(url, data, callbackFunction) {
        let xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() {
            const COMPLETE = 4;
            const OK       = 200;
            
            if ((this.readyState === Ajax.COMPLETE) && (this.status === Ajax.OK)) {
                callbackFunction(this.responseText);
            }
        };
        
        xhttp.open("POST", url, true);   
        
        let blob = new Blob([data], {type: 'text/plain'});
        
        let formData = new FormData();
        formData.append('file', blob);
        xhttp.send(formData);
    }
    
    static ON_FILES_ACTION(url, data, callbackFunction) {
        var url      = url;
        var xhr      = new XMLHttpRequest();
        var formData = new FormData();
        formData.append('file', data);
        xhr.addEventListener('readystatechange', function(e) {
            // Done. Inform the user
            if ((xhr.readyState === Ajax.COMPLETE) && (xhr.status === Ajax.OK)) {
                let response = e.currentTarget.responseText;
                
                callbackFunction(response);

            }
            // Error. Inform the user
            else if ((xhr.readyState === Ajax.COMPLETE) && xhr.status !== Ajax.OK) {
                onsole.log("Ajax Error");
            }
        });
        xhr.open('POST', url, true);
        xhr.send(formData);
    }
    
    static ON_ACTION(url, formData, callbackFunction) {
        var url      = url;
        var xhr      = new XMLHttpRequest();
 
        xhr.addEventListener('readystatechange', function(e) {
            // Done. Inform the user
            if ((xhr.readyState === Ajax.COMPLETE) && (xhr.status === Ajax.OK)) {
                let response = e.currentTarget.responseText;
                
                callbackFunction(response);

            }
            // Error. Inform the user
            else if ((xhr.readyState === Ajax.COMPLETE) && xhr.status !== Ajax.OK) {
                console.log("Ajax Error");
            }
        });
        
        xhr.open('POST', url, true);
        xhr.send(formData);
    }
}

Ajax.COMPLETE = 4;
Ajax.OK       = 200;