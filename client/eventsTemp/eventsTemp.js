// check if user is on mobile device
//initiate as false
isMobile = false; 
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


//********************** ROUTES **********************//
//********************** ROUTES **********************//
Router.route('/events/:category/:date/:distance', {
    name: 'eventsTemp',
    data: function(){return {category:  this.params.category};},
    waitOn: function(){
        Session.set('category',this.params.category);
        Session.set('date',this.params.date);
        Session.set('dist',this.params.distance);
        Session.set('more_info',0);
        lng=Session.get('lng');
        lat=Session.get('lat');
        return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance, lng,lat]);
    }
    });

Template.eventsTemp.onRendered( function(){
    //GEOCODE the current db, use when you've clicked on surprise me to update all events
    geocode_all_activites();

    if(!Session.get('activity_list')){ 
      console.log("no activity_list detected, bouta make a new one");
      create_act_list();
    } 
});

//********************** HELPERS **********************//
//********************** HELPERS **********************//
Template.eventsTemp.helpers({
  //gets the remainder of the event description
  'get_rest': function(){
    lines=split_description();
    lines=lines.slice(1,split_description().length+1);
    line_obj=[];
    for(i=0;i<lines.length; i++){
      line_obj[i]={line:lines[i]}
    }
    return line_obj;
  }, 
  //gets first, second, third lines of event description
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

  'more_info_disabled': function(){
    num_lines=split_description().length;
    console.log("num_lines",num_lines);
    return (num_lines<=3);
  },

 'get_where': function(){
    where=Session.get('current_activity').address;
    if(isMobile){num_char=30}
    else{num_char=40}

    if(where.length>num_char){
      where=where.substring(0,num_char)+"..."
    }
    return where;
  },
    'more_info': function(){
      return Session.get('more_info');
},

//gestures for phone swiping
  templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {
      //not sure why you have to put this in a second time for the phone transition
        transitionRightLeft();
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
    //when the user clicks discard button, want to move to the next event, and hide the rest of the info
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
        //setting make_act_list to 1, since we want to create a new one when re-rendering the eventsTemp page
        Session.set('activity_list',null);
         query_params=Router.current().params;
         Router.go('seeAll',{category: query_params.category, date: query_params.date, distance: query_params.distance});
       
      }
  });

//********************** FUNCTIONS **********************//
//********************** FUNCTIONS **********************//
geocode_all_activites=function(){

    all_activities=Activities.find().fetch()
      // space out google maps api requests
      //update_all_db(210);
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
   


//uses current activity to return a pretty formated date string
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

  activity_list=Session.get('activity_list');
  current_act=Session.get('current_activity');

  //make sure there's an activity list
  if(!activity_list){
    activity_list=create_act_list(0);
    Session.set('activity_list',activity_list);
  }

  //make the deck slide away
  transitionRightLeft();

  //update the user, if there is one
  if( Meteor.user()){
    add_discard(Meteor.user(),current_act);
  }

  //update the current activity, but wait until deck has slide away
  setTimeout(function() {
    activity_index=Session.get('activity_index')+1;
    Session.set('activity_index', activity_index);
    Session.set('current_activity', activity_list[activity_index]);

    }, 200);

};

favorite =function(){
  activity_list=Session.get('activity_list');
  current_act=Session.get('current_activity');

  //make sure there's an activity list
  if(!activity_list){
    activity_list=create_act_list(0);
    Session.set('activity_list',activity_list);
  }    

  //update the user, if there is one
  if( Meteor.user()){
    add_fav(Meteor.user(),current_act);

    //route to the "Share" page
    Router.go('share',{_id: current_act._id, fromEvents:1, fromYourEvents:0});

    //update current activity
    activity_index=Session.get('activity_index')+1;
    Session.set('activity_index', activity_index);
    Session.set('current_activity', activity_list[activity_index]);

}
else{
    alert("You must be logged in to favorite activities");
  }
};

create_act_list= function(for_see_all){
    //getting all of the activities, returns an array of events within the user specified distance
    activity_list=distance_query();

    //taking out discards and favorites from what you display
    //first check if there is a meteor user who has favorites
    if(!for_see_all){
      if(Meteor.user()){

        discards=Meteor.user().profile.discards;
        favorites=Meteor.user().profile.favorites;

        //x is a counter, allowing you to make a new, shorter activity list while you loop through the old one using i
          x=0;
          activity_list_new=[];
            for(i=0;i<activity_list.length;i++){
              this_act=activity_list[i];
              if(!(is_discard(this_act._id))&&(!is_favorite(this_act._id))){
                activity_list_new[x]=this_act;
                x+=1;
              }                
            }
            activity_list=activity_list_new;
        }
      }
      
      //set the first activity, if were in the eventsTemp, if not, no needs
      if(!for_see_all){
        activity_index=0;
        current_activity= activity_list[activity_index];
        Session.set('activity_list',activity_list);
        Session.set('current_activity',current_activity);
        Session.set('activity_index',activity_index);
      }
      return activity_list;
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

//uses current activities description, returns an array with a line of the description in each element
  split_description= function(){       
        description=Session.get('current_activity').description;
        if(description[description.length-1]=="]"){
          description=description.substring(0,description.length-2);
        }
        description=description.split(" ");
        num_pieces=0;
        this_piece="";
        pieces=[];
        
        first_line_characters=40;
        other_line_characters=55;

        //mobile can fit less characters on the screen in one line
        if(isMobile){
          first_line_characters=10;
          other_line_characters=20;
        };


        for(i=0;i<description.length;i++){
          if(num_pieces==0){num_characters=first_line_characters}
          else{num_characters=other_line_characters}
          if (description[i].length<20){
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
        }
        return pieces;
  };

  transitionRightLeft= function(){
   $("#deck_slide")
        .transition('fly right');
                           
    $("#deck_slide")
            .transition('fly left')
          ;
};

add_fav= function(user,activity){
  Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
  Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}})
};

add_discard= function(user,activity){
  Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":activity}})
  Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":activity}})
};
