


//adds facebook as a login service 
Meteor.startup(function() {
    Globals= {}; 
    hasSwiped=false;

    GoogleMaps.load();
      // first get current location lat and lng
       Globals.userLocation=null;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
       var print_eventually= "Geolocation is not supported by this browser.";
       console.log(print_eventually);
    }

    function showPosition(position) {
       Globals.userLocation={lat:position.coords.latitude, lng:position.coords.longitude};
    }
    console.log(Globals.userLocation,"userLocation");


  console.log("in the startup function!!!");

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
    
  
});