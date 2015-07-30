//********************** ROUTE **********************//
//********************** ROUTE **********************//
Router.route('/events/:category/:date/:distance', {
    name: 'eventsTemp',
    data: function(){return {category:  this.params.category};},
    waitOn: function(){
          lat=null;
          lng=null;
          if(Session.get('lng')){
            lat=Session.get('lat');
            lng=Session.get('lng');
            }
        Session.set('category',this.params.category);
        Session.set('date',this.params.date);
        Session.set('dist',this.params.distance);
        return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance, lng,lat]);
    }
    });

Template.eventsTemp.onRendered( function(){
    //geocodes the current db, use when you've clicked on surprise me to update all events
    //geocode_all_activites();
    console.log("when does it render??")
    //tryna make it so the act_list is only made once
    if(Session.get('make_act_list')||(!Session.get('activity_list')))
    { console.log("should create the act list now")
        create_act_list();
    } 

});

//********************** HELPERS **********************//
//********************** HELPERS **********************//
Template.eventsTemp.helpers({
    'split_description': function(){
        num_characters=73;
        description=Session.get('current_activity').description;
        part1=description.substring(0,num_characters-13);
        part2=description.substring(num_characters,num_characters*2);
        part3=description.substring(num_characters*2,num_characters*3);
        part4=description.substring(num_characters*3,num_characters*4);
        rest=description.substring(num_characters*4,description.length);
        description_pieces={part1:part1,part2:part2,part3:part3,part4:part4,rest:rest};
        console.log(description_pieces);
    return description_pieces;
  },
  'get_when': function(){
    return get_when();
  },
  //getting half the activity descrption to show as default
  // 'get_half_description': function(){
  //   half_description=Session.get('current_activity').description.substring(0,100) + "...";
  //   return half_description;
  // },
  //lets template know if the user has clicked more info, so full description can be shown
    'more_info': function(){
      return Session.get('more_info');
  },

//gestures for phone swiping
  templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {
      //same as discard
      discard();
    },
    'swiperight #hammerDiv': function (event, templateInstance) {
         //same as favorite
         favorite();
    },
  },
    
    'current_activity': function(){
          return Session.get('current_activity');
      }
});

//********************** EVENTS **********************//
//********************** EVENTS **********************//
Template.eventsTemp.events({
    'click #more_info':function(){
      Session.set('more_info',1);
    },
    'click #less_info':function(){
      Session.set('more_info',0);
    },

    'click #discard': function(){
        Session.set('more_info',0);
        discard();
      },

    'click #favorite': function(){ 
          favorite();
      },
      
    'click #previous': function(){
    //make the deck move to indicate previous is coming
      $("#deck_slide")
        .transition('fly left')
      ;
     $("#deck_slide")
        .transition('fly right')
      ;
        activity_index-=1;
        Session.set('current_activity', activity_list[activity_index]);
    },

    'click #seeAll': function(){
        //setting more info to zero, since we want "less info" to be the default
        Session.set('more_info',0);
        //setting make_act_list to 1, since we want to create a new one when re-rendering the eventsTemp page
        Session.set('make_act_list',1);
         query_params=Router.current().params;
         Router.go('seeAll',{category: query_params.category, date: query_params.date, distance: query_params.distance});
       
      }
  });

//********************** FUNCTIONS **********************//
//********************** FUNCTIONS **********************//
function geocode_all_activites(){

    all_activities=Activities.find().fetch()
      // space out google maps api requests
      update_all_db(852);
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
   



get_when= function(){
    start_time=Session.get('current_activity').start_time
    start_date=Session.get('current_activity').start_date
     var month_names = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var day_names=["Sunday","Monday", "Tuesday","Wednesday", "Thursday","Friday","Saturday"];

    var dayIndex = start_date.getDay();
    var monthIndex = start_date.getMonth();
    var date = start_date.getDate();

    
    when=day_names[dayIndex]+", "+month_names[monthIndex]+"  "+date+ ", "+start_time;
    return when;

  }


discard= function(){
   $("#deck_slide")
            .transition('fly right')
          ;
                              $("#deck_slide")
            .transition('fly left')
          ;

          current_act=Session.get('current_activity')
          if( Meteor.user()){
            Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}})
            Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}})
          }          
          setTimeout(function() {
            activity_index=Session.get('activity_index')
            activity_index+=1;
            Session.set('activity_index', activity_index);
            Session.set('current_activity', activity_list[activity_index]);

            }, 200);

};

favorite =function(){
          //make the deck move to indicate previous is coming
      $("#deck_slide")
        .transition('fly left')
      ;
     $("#deck_slide")
        .transition('fly right')
      ;
     

          if( Meteor.user()){
            //update favorites and discards
            current_act=Session.get('current_activity');
            Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
            Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}})
            
            //route to the "Share" page
            params=Router.current().params;

            Router.go('share',{_id: current_act._id, fromEvents:1});
            activity_index=Session.get('activity_index')+1;
        Session.set('activity_index',activity_index );
        Session.set('current_activity', activity_list[activity_index])
            
            //update activity index 
            Session.set('activity_index',activity_index );
          }
        else{
          alert("You must be logged in to favorite activities");
        }
};



create_act_list= function(for_see_all){

    console.log("in create_act_list");

    //activity_list= Activities.find().fetch();
    //getting all of the activities, returns an array of events within the user specified distance
    activity_list=distance_query();

    console.log("for_see_all",for_see_all);

    //taking out discards and favorites from what you display
    //first check if there is a meteor user who has favorites
    if(!for_see_all){
    if(Meteor.user()){
        discards=Meteor.user().profile.discards;
        if(discards){
            discard_ids=get_list_of_ids(discards);
        }
        favorites=Meteor.user().profile.favorites;
        if(favorites){
            favorite_ids=get_list_of_ids(favorites);
        }

        //x is a counter, allowing you to make a new, shorter activity list while you loop through the old one using i
          x=0;
          activity_list_new=[];
            for(i=0;i<activity_list.length;i++){
              //if this id isn't in the list of discards, or favorites added it to the good list
              if(favorites&&discards){
                    if((discard_ids.indexOf(activity_list[i]._id)==-1)&&(favorite_ids.indexOf(activity_list[i]._id)==-1)){
                      activity_list_new[x]=activity_list[i];
                      x+=1;
                    }                
              }
              //if there are no discards, just take out favorites
              else if (favorites){
                if(favorite_ids.indexOf(activity_list[i]._id)==-1){
                      activity_list_new[x]=activity_list[i];
                      x+=1;
                    }         
              }
             //if there are no favorites, just take out discards
              else{
                if(discard_ids.indexOf(activity_list[i]._id)==-1){
                      activity_list_new[x]=activity_list[i];
                      x+=1;
                    }                
              }
            }
            activity_list=activity_list_new;
        }
      }
      
      //set the first activity
      activity_index=0;
      current_activity= activity_list[activity_index];
      Session.set('activity_list',activity_list);
      Session.set('current_activity',current_activity);
      Session.set('activity_index',activity_index);
    //set this variable to 0, so you know you have already created the activity list
      Session.set('make_act_list',0);
      console.log("the list in create_act_list", Session.get('activity_list'));
};


distance_query=function(){
  
  distance_param= Router.current().params.distance;
  x=Session.get('lng');
  y=Session.get('lat');

  //if the user's loc doesn't exist, or they don't specify a distance, return all activities
  if(distance_param=="any_dist"||(!x)){
    act_list=Activities.find({}).fetch();
  }
  else if(distance_param=="five"){
    act_list=Activities.find({ location:
                                           { $near :
                                              {
                                                $geometry: { type: "Point",  coordinates: [x, y ] },
                                                $maxDistance: 8047
                                              }
                                           }}).fetch();

  }
  else if(distance_param=="ten"){
    act_list=Activities.find({ location:
                                           { $near :
                                              {
                                                $geometry: { type: "Point",  coordinates: [x, y ] },
                                                $maxDistance: 16093
                                              }
                                           }}).fetch();
  }

  console.log("how many activiites (in dist_query)",act_list.length);
  return act_list;

}



//takes an array of event objects, returns array of ids
get_list_of_ids =function(event_array){
    ids=[];
    for(i=0; i<event_array.length; i++)
    {
        ids[i]=event_array[i]._id;
    }
    return ids;
}



get_fav_and_discard_ids= function(){
   if(Meteor.user()){
        discards=Meteor.user().profile.discards;
        if(discards){
          //get array of all discard ids


          discard_ids=[];
          for(i=0; i<discards.length; i++){
            discard_ids[i]=discards[i]._id;
          }
        }

          //get array of all favorite ids
          favorite_ids=[];
        favorites=Meteor.user().profile.favorites;
        if(favorites){
          favorite_ids=[];
           for(i=0; i<favorites.length; i++){
              favorite_ids[i]=favorites[i]._id;
            }
        }
      }

      return [favorite_ids, discard_ids];
}


