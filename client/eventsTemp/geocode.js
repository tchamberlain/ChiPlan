geocode_all_activites=function(){

    all_activities=Activities.find().fetch()
      // space out google maps api requests
      update_all_db(970);
      function update_all_db(i) {
        if(all_activities.length > i) {
            setTimeout(function() {
                 geocode_update_db(all_activities[i]);
                i+=1;
                update_all_db(i);
                console.log(i);
            }, 4000);
        }
      } 

        function geocode_update_db (elem) {   

            //check if it's coordinates are 0, only update if they are bc those are the ones that havent been geocoded
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
      };
   