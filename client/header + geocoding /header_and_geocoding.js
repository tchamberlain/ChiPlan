Template.header.events({
  'click .heading': function(){
    Router.go('home');   
      //TESTING SORT, ATTEMPT AT METEOR METHODS
          //tryna check if server side sort works
      // if(Meteor.user()){
      //   console.log("did we get here")
      //   Meteor.call("tryna_sort", Meteor.user()._id);
      // }
      //TESTING SORT


         function geocode_update_db (elem) {   
            //check if it's coordinates are 0, only update if they are
            if(elem.location.coordinates[0]==0){
              geocoder = new google.maps.Geocoder();
              geocoder.geocode( { 'address': elem.address}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  lat = results[0].geometry.location.lat();
                  lng = results[0].geometry.location.lng();
                  console.log(lat);
                  console.log(lng);
              } else {
                  alert('Geocode was not successful for the following reason: ' + status);
              }

              Activities.update({_id: elem._id}, {$set: {
                  location: {
                    "type" : "Point",
                    "coordinates" : [ 
                      lng, 
                      lat
                    ]
                    } 
                  }});

          });
      }
    }

    

  },

  
  'click #dashboard': function(){
    Router.go('dashboard');   
  }
 });

