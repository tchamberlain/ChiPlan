// check if user is on mobile device, so that the description can be made diff. lengths for mobile and for desktop
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
        //we want the default to be that more info is not showing
        Session.set('more_info',0);

        //get users lat and lng if it exists
        if(Globals.userLocation){
          lat=Globals.userLocation.lat;
          lng=Globals.userLocation.lng;
        }
        else{
          lat=null;
          lng=null;
        }
        return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance, lng,lat]);
    }
    });


Template.eventsTemp.onCreated( function(){
  if(!Globals.eventList){ 
    console.log("no activity_list detected, bouta make a new one");
    create_act_list();
  }
  Session.set('currentEvent',Globals.eventList[Globals.eventIndex]);

});


Template.eventsTemp.onRendered( function(){
    
    //initialize the popups that will cue swiping
      $('.button').popup({on: 'manual'});

      //if there is no user logged in, or if the user has not yet swiped, then show pop up to cue swiping
      if(hasSwiped==false){
            $('button')
           .popup('show');
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
      console.log(activity_list);
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
  //CHANGE TO FIVE SOON
  //determines whether or not attendence num will be displayed (if over five people are going)
  'showAttendance': function(){
    current_activity=Session.get('currentEvent');
    return (current_activity.attending>=1);
  },
  //we disable the more info button if the description isless than or equal to 3 lines
  'more_info_disabled': function(){
    num_lines=split_description().length;
    return (num_lines<=3);
  },

  //show only part of the event's address, if the address is too long
 'get_where': function(){
    where=Session.get('currentEvent').address;
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
    'hasntSwiped': function(){
      return (!hasSwiped);
},

//gestures for phone swiping
  templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {
        //update hasSwiped to true so the user isn't cued to swipe again
        hasSwiped=true;
        if(Meteor.user()){
          //update meteor user to reflect that they've swiped
          Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.hasSwiped":true}})

        }
        swipeLeft();
    },
    'swiperight #hammerDiv': function (event, templateInstance) {
        //update hasSwiped to true so the user isn't cued to swipe again
       hasSwiped=true;
        if(Meteor.user()){
          //update meteor user to reflect that they've swiped
          Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.hasSwiped":true}})

        }
        swiperight();
    },
  },
    'currentEvent': function(){
        //if the page refreshes, reset the current event using the global variables
          if(!Session.get('currentEvent')){
            Session.set('currentEvent',Globals.eventList[Globals.eventIndex]);
          }
          return Session.get('currentEvent');
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
        swipeLeft();
      },
    'click #favorite': function(){ 
        swipeRight();
      },
      
    'click #previous': function(){
    //make the deck move to indicate previous is coming
      $("#deck_slide")
        .transition('fly left')
      ;
     $("#deck_slide")
        .transition('fly right')
      ;
        
        Globals.eventIndex+=1;
        var currentEvent=Globals.eventList[Globals.eventIndex]
        Session.set('currentEvent', currentEvent);
    },

    'click #seeAll': function(){
        //setting activity_list to null, since we want to create a new one when re-rendering the eventsTemp page
         query_params=Router.current().params;
         Router.go('seeAll',{category: query_params.category, date: query_params.date, distance: query_params.distance});
      }
  });

//********************** FUNCTIONS **********************//
//********************** FUNCTIONS **********************//



function swipeLeft(){
  // get the current activity 
  var currentEvent=Globals.eventList[Globals.eventIndex];

  //transition deck
  transitionRightLeft();

  //increment which part of the list your on
  Globals.eventIndex+=1;

    setTimeout(function() {
      Session.set('currentEvent', Globals.eventList[Globals.eventIndex]);
    }, 200);

  //if logged in, add a discard
   if(Meteor.user()){
       add_discard(currentEvent);
    }


};

function swipeRight(){
  // get the current activity 
  var currentEvent=Globals.eventList[Globals.eventIndex];

  //increment which part of the list your on
  Globals.eventIndex+=1;

  //if logged in, add favorite
  if(Meteor.user()){
    add_fav(currentEvent);
    //route to share, coming from eventsTemp
    Router.go('share',{_id: currentEvent._id});
    var currentEvent=Globals.eventList[Globals.eventIndex];
    Session.set('currentEvent',currentEvent);

  }
  else{
    alert("You need to log in to favorite activites");
  }

};

add_fav= function(activity){
    //handle attendence  
   if(activity.attending==undefined){
      Activities.update({_id:activity._id}, {$set:{"attending":1}});
    }
    else{
      attendence=activity.attending+1;
      Activities.update({_id:activity._id}, {$set:{"attending":attendence}});
    }

  Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":activity}})
  Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":activity}})


};

add_discard= function(activity){

  //handle attendence --if the activity was a favorite, decrement attendence 
  if(is_favorite(activity)){
    attendence=activity.attending-1;
    Activities.update({_id:activity._id}, {$set:{"attending":attendence}});
  }
  Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":activity}})
  Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":activity}})
};



create_act_list= function(){
    //getting all of the activities, returns an array of events within the user specified distance
      activity_list=distance_query();
    
    

    //for_see_all will be true if seeAll is contained in the path
    var routeName = Router.current().route.getName();
    console.log(routeName);
    for_see_all= routeName.indexOf("seeAll")>-1;

    //if current route says see all, then you don't want to exclude favorites and discards
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

        //set the first activity, if were in the eventsTemp, if not, no need

        current_activity= activity_list[0];
        Session.set('currentEvent',current_activity);
       Globals.eventList=activity_list;
      }
           
      return activity_list;
};


distance_query=function(){
  
  distance_param= Router.current().params.distance;

  //if the user's loc doesn't exist, or they don't specify a distance, return all activities
  if(distance_param=="any_dist"||(Globals.userLocation==null)){
    act_list=Activities.find({}).fetch();
    console.log("in dist query, before narrowed down how many activites",Activities.find({}).fetch());
  }
  else if(distance_param=="five"){
      x=Globals.userLocation.lng;
      y=Globals.userLocation.lat;
    act_list=Activities.find({ location:
                                           { $near :
                                              {
                                                $geometry: { type: "Point",  coordinates: [x, y ] },
                                                $maxDistance: 8047
                                              }
                                           }}).fetch();

  }
  else if(distance_param=="ten"){
      x=Globals.userLocation.lng;
      y=Globals.userLocation.lat;
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
        description=Session.get('currentEvent').description;
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


is_discard = function(act_id){
  user_id=Meteor.user()._id;
  if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
    return true;
  }
  else{
    return false;
  }
  };

is_favorite =function (act_id){
  user_id=Meteor.user()._id;
  if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
    return true;
  }
  else{
  return false;
  }
  };



//uses current activity to return a nicely formated date string
get_when= function(){
    start_time=Session.get('currentEvent').start_time;
    start_date=Session.get('currentEvent').start_date;

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







