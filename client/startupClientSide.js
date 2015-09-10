


//adds facebook as a login service 
Meteor.startup(function() {
  var url      = window.location.href;  
//(requires different app id and secret for chiplan.org and for the local host)
  if(url=="http://localhost:3000/"){
     Accounts.loginServiceConfiguration.remove({
    service: "facebook"
  });
  Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: "1655047711391983",
    secret: "63d4d2c34e96b3765135c6e0f6d84979"
  }); 
  }

  else{
         Accounts.loginServiceConfiguration.remove({
        service: "facebook"
      });
      Accounts.loginServiceConfiguration.insert({
        service: "facebook",
        appId: "1452040111772209",
        secret: "11ba0145478dbb9c321da18403060822"
      }); 
  }
  
  
  
   // set the name modal so it exists
    Session.set('name_modal',0)
    
    
    GoogleMaps.load();
      // first get current location lat and lng

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
       print_eventually= "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
       Session.set('lat',position.coords.latitude);
       Session.set('lng',position.coords.longitude);

    }
  
});