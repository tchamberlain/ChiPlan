// check if mobile
isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


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
        Session.set('more_info',0);
        return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance, lng,lat]);
    }
    });

Template.eventsTemp.onRendered( function(){
    //geocodes the current db, use when you've clicked on surprise me to update all events
    //geocode_all_activites();
    //tryna make it so the act_list is only made once
    if(Session.get('make_act_list')||(!Session.get('activity_list')))
    { console.log("should create the act list now")
        create_act_list();
    } 

});

//********************** HELPERS **********************//
//********************** HELPERS **********************//
Template.eventsTemp.helpers({
  //   'split_description': function(){
  //       num_characters=73;
  //       //console.log('mobile',mobile);
  //       if (isMobile){num_characters=25;}
  //       description=Session.get('current_activity').description;
  //       part1=description.substring(0,num_characters-13);
  //       part2=description.substring(num_characters,num_characters*2);
  //       part3=description.substring(num_characters*2,num_characters*3);
  //       part4=description.substring(num_characters*3,num_characters*4);
  //       rest=description.substring(num_characters*4,description.length);
  //       description_pieces={part1:part1,part2:part2,part3:part3,part4:part4,rest:rest};
  //   return description_pieces;
  // },

  'get_rest': function(){
    lines=split_description();
    lines=lines.slice(1,split_description().length+1);
    line_obj=[];
    for(i=0;i<lines.length; i++){
      line_obj[i]={line:lines[i]}
    }
    return line_obj;
  }, 
  'get_first_line': function(){
    line=split_description();
    return line[0];
  },
    'get_second_line': function(){
    line=split_description();
    return line[1];
  },
  'get_third_line': function(){
    line=split_description();
    return line[2];
  },

  'get_when': function(){
    return get_when();
  },
    'setMobile': function(){
    Session.set('mobile',1);
  },
      'setMobileOff': function(){
    Session.set('mobile',0);
  },
    'more_info': function(){
      return Session.get('more_info');
  },

//gestures for phone swiping
  templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {

            $("#deck_slide")
        .transition('fly left')
      ;
     $("#deck_slide")
        .transition('fly right')
      ;
     
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
  if(Session.get('activity_list')){

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
            activity_list=Session.get('activity_list');
            Session.set('current_activity', activity_list[activity_index]);

            }, 200);

    }
    else{
      create_act_list();
      activity_list=Session.get('activity_list');
      discard();
      // Session.set('activity_index',1);
      // Session.set('current_activity',activity_list[1]);
    }

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

            Router.go('share',{_id: current_act._id, fromEvents:1, fromYourEvents:0});
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
    //activity_list= Activities.find().fetch();
    //getting all of the activities, returns an array of events within the user specified distance
    activity_list=distance_query();



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


  split_description= function(){       
        description=Session.get('current_activity').description;
        if(description[description.length-1]=="]"){
          description=description.substring(0,description.length-2);
        }
        description=description.split(" ");
        num_pieces=0;
        this_piece="";
        pieces=[];

        for(i=0;i<description.length;i++){
          if(num_pieces==0){num_characters=40}
          else{num_characters=55}
          if(this_piece.length<num_characters){
            this_piece+=" "+description[i];
            pieces[num_pieces]=this_piece;

          }
          else{
            this_piece+=" "+description[i];
            pieces[num_pieces]=this_piece;
            this_piece="";
            num_pieces+=1;

          }

        }
        return pieces;
  }


