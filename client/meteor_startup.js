
  Meteor.startup(function() {
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