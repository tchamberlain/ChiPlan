// js for home page
Router.route('/', function(){
  this.render('home');
},{name: 'home'});

Router.configure({
  layoutTemplate: 'main'
});

Meteor.startup(function() {
  var url      = window.location.href;  

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
});




Template.home.onRendered(function(){
  //initialize semantic ui check box/ dropdown for mobile
  this.$('.checkbox').checkbox();
  this.$('#weekend').checkbox('check');
  $('.ui.dropdown')
  .dropdown();
});

Template.home.helpers({
  'get_next_event': function(){
    //First manually sort all favorites (change this later when server side $sort is implemented)
    if((Meteor.user())&&(Meteor.user().profile.favorites.length)){
      favorites=Meteor.user().profile.favorites
      next_event= favorites[0]
      for(i=1; i<favorites.length; i++){
        if(favorites[i].start_date<next_event.start_date){
          next_event=favorites[i];
        }
      }
      Session.set('next_event', next_event);
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
      the_id = Session.get('next_event')._id
      Router.go('actInfo',{_id: the_id, button_info:[0,0,1]} );
    },
   'click #create': function(){
      Router.go('createEvent');
    },    
    'click #B_entertainment': function(){
      set_up_deck("entertainment");
    },

    'click #B_sports': function(){
      set_up_deck("sports");
    },

    'click #B_art': function(){
      set_up_deck("art");
    },

    'click #B_stayin': function(){
      set_up_deck("stayin");
    },

    'click #B_surpriseme': function(){
      set_up_deck("surpriseme");
    }

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


//FUNCTIONS
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



