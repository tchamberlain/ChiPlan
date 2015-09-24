//********************** ROUTES **********************//
//********************** ROUTES **********************//
Router.route('/directions', {
    name: 'directions',
    waitOn: function(){
        //get users lat and lng if it exists
        // if(Globals.userLocation){
        //   lat=Globals.userLocation.lat;
        //   lng=Globals.userLocation.lng;
        // }
        // else{
        //   lat=null;
        //   lng=null;
        // }
       // return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance, lng,lat]);
    }
    });

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.directions.helpers({
     pathGoogleMaps: function(){
        // I put the latitude and longitude in the session of the page
        var origin ;
        // if (Session.get('lat= null && Session.get('lon= null) {
        //     origin= Session.get('lat "," +Session.get('lon        }

        var path = "";
        if ( origin != undefined && origin != null ) {
            // When have the origen defined 
            var destination = 83 + "," + 37;
            path = "https://www.google.com/maps/embed/v1/directions"
                + "?key=AIzaSyAV81LKkE54IYEu7kEfPwpHTP0nx5IQa68";
            path+= "&origin=" + origin;
            path+=  "&destination="+ destination;
            path+=  "&avoid=tolls|highways";
        } else {
            // When I don't have the origen and destination
            path = "https://www.google.com/maps/embed/v1/place"
                + "?key=AIzaSyAV81LKkE54IYEu7kEfPwpHTP0nx5IQa68";
            path+= "&q=" + this.street + "," + this.addressNumber + "," + this.neighborhood + "," + this.city ;
            path+= "&zoom=14&maptype=roadmap";
        }
        return path;
    }
    // exampleMapOptions: function() {
    //   // Make sure the maps API has loaded
    //   if (GoogleMaps.loaded()) {
    //     // Map initialization options
    //       var map = new GMap2(document.getElementById("map"));
    //       var panel = document.getElementById("panel");
    //       var dir = new GDirections(map, panel);
    //       dir.load("San Francisco to Los Angeles");


    //     return {
    //       center: new google.maps.LatLng(-37.8136, 144.9631),
    //       zoom: 8
    //     };
    //   }
    // }
  });

  // Template.directions.onCreated(function() {
  //   // We can use the `ready` callback to interact with the map API once the map is ready.
  //   GoogleMaps.ready('exampleMap', function(map) {
  //     // Add a marker to the map once it's ready
  //     var marker = new google.maps.Marker({
  //       position: map.options.center,
  //       map: map.instance
  //     });
  //   });
  // });





  
