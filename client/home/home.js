Router.route('/', function(){
  this.render('home');
},{name: 'home'});

Router.configure({
  layoutTemplate: 'main'
});

Template.home.onRendered(function(){
  //initialize semantic ui check box/ dropdown for mobile
  $('.ui.dropdown').dropdown();
  this.$('.checkbox').checkbox();
  //set weekend as the default
  this.$('#weekend').checkbox('check');
  
});

Template.home.helpers({
  'get_next_event': function(){
    next_event=findNextEvent();
    //if the event exists return it's title
    if(next_event){
      //only want first part of the title to display
          next_event=next_event.title.substring(0,18)+"...";
          return next_event;
      }
      else{
       return 0;
      }
    }
});

Template.home.events({
    'click #next_event': function(){
      the_id = Session.get('next_event')._id;
      Session.set('current_activity',findNextEvent());
      Router.go('actInfo',{_id: the_id, button_info:[0,0,1]} );
    },
   'click #create': function(){
      Router.go('createEvent');
    },    
    'click #category': function(evt, temp){
       var category=""+($(evt.target).closest('img').data('value'));
       //get the category the user clicked on, then build a list of events with that category
      set_up_deck(category);
    },

 });


function get_search(){
  //date search
    if ($("#tomorrow").checkbox('is checked')){ date="tomorrow"}
    else if ($("#today").checkbox('is checked')){date="today"}
    else if ($("#week").checkbox('is checked')){date="week"}
    else if ($("#weekend").checkbox('is checked')){date="weekend"}
    else if (($("#date_dropdown").dropdown('get text'))=="Tomorrow"){date="tomorrow"}
    else if (($("#date_dropdown").dropdown('get text'))=="Today"){date="today"}
    else if (($("#date_dropdown").dropdown('get text'))=="This week"){date="week"}
    else if (($("#date_dropdown").dropdown('get text'))=="This weekend"){date="weekend"}
    else{date="any_date"}


  //distance search
  if ($("#five_mi").checkbox('is checked')){dist="five"}
  else if ($("#ten_mi").checkbox('is checked')){dist="ten"}
  else if (($("#dist_dropdown").dropdown('get text'))=="Within five miles"){dist="five"}
  else if (($("#dist_dropdown").dropdown('get text'))=="Within ten miles"){dist="ten"}
  else{dist="any_dist"}

  search=[date, dist]
  return(search)
}

set_up_deck=function(category){
    //reset the activity lists
      Session.set('activity_list_all',null);
      Session.set('activity_list',null);

      //if user has location, get it
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      //get users input parameters
      search=get_search();
      Router.go('eventsTemp',{category: category, date: search[0], distance: search[1],user_loc:user_loc})

  }


 // get and sort all of user's favorites in order to return the one closest in time
function findNextEvent(){
  if((Meteor.user())&&(Meteor.user().profile.favorites.length)){
    favorites=Meteor.user().profile.favorites;
    next_event= favorites[0]
    for(i=1; i<favorites.length; i++){
      if(favorites[i].start_date<next_event.start_date){
        next_event=favorites[i];
      }
    }
    //set the next event as a session variable
    Session.set('next_event',next_event)

    return next_event;
  }
  //if user isn't logged in, or they have no favorites, return 0
  else{
    return 0;
  }
}

//determine if these need to be here!!!!!!!

is_discard = function(act_id){
  user_id=Meteor.user()._id;
  if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
    return 1;
  }
  else{
    return 0;
  }
  };

is_favorite =function (act_id){
  user_id=Meteor.user()._id;
  if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
    return 1;
  }
  else{
  return 0;
  }
  };



