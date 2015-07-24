// js for home page



Template.home.onRendered(function(){
  this.$('.checkbox').checkbox();
  this.$('#weekend').checkbox('check');
  $('.ui.dropdown')
  .dropdown()
;

});


function is_discard(act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
      return 1;
    }
    else{
      return 0;
    }
  };

function is_favorite (act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
      return 1;
    }
   
    else{
    return 0;
    }
  };


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
      return next_event;
    }
    else{
      return 0;
    }
   }

});


  Template.home.events({

    'click #stay_in_test': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("entertainment",search[0],search[1]);
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      Router.go('eventsTemp',{category: "entertainment", date: search[0], distance: search[1],user_loc:user_loc});
  },  

    'click #next_event': function(){
      the_id = Session.get('next_event')._id
      Router.go('actInfo',{_id: the_id, button_info:[is_discard(the_id),is_favorite(the_id)]} );

  },  

    'click #B_entertainment': function(){
      search=get_search();
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      Router.go('eventsTemp',{category: "entertainment", date: search[0], distance: search[1],user_loc:user_loc})
    },


    'click #B_sports': function(){
      search=get_search();
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      Router.go('eventsTemp',{category: "sports", date: search[0], distance: search[1],user_loc:user_loc})
    },


    'click #B_art': function(){
      search=get_search();
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      Router.go('eventsTemp',{category: "art", date: search[0], distance: search[1],user_loc:user_loc})
    },


    'click #B_stayin': function(){
      search=get_search();
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      Router.go('eventsTemp',{category: "stayin", date: search[0], distance: search[1],user_loc:user_loc});
    },


    'click #B_surpriseme': function(){
      search=get_search();
      if(Session.get('lng')){
         user_loc=[Session.get('lng'),Session.get('lng') ];
      }
      else{
        user_loc=0;
      }
      Router.go('eventsTemp',{category: "surpriseme", date: search[0], distance: search[1],user_loc:user_loc})
    }

 });








function get_search(){

  //date search
    if ($("#tomorrow").checkbox('is checked')){ date="tomorrow"}
    else if ($("#today").checkbox('is checked')){date="today"}
    else if ($("#week").checkbox('is checked')){date="week"}
    else if ($("#weekend").checkbox('is checked')){date="weekend"}
  //trying  to add drop down items, might not work if comp screen accordion also checkED??? by default
    else if (($("#date_dropdown").dropdown('get text'))=="Tomorrow"){date="tomorrow"}
    else if (($("#date_dropdown").dropdown('get text'))=="Today"){date="today"}
    else if (($("#date_dropdown").dropdown('get text'))=="This week"){date="week"}
    else if (($("#date_dropdown").dropdown('get text'))=="This weekend"){date="weekend"}
    else{date="any_date"}


  //distance search
  if ($("#five_mi").checkbox('is checked')){dist="five"}
  else if ($("#ten_mi").checkbox('is checked')){dist="ten"}
  //trying  to add drop down items, might not work if comp screen accordion also checkED??? by default
  else if (($("#dist_dropdown").dropdown('get text'))=="Within five miles"){dist="five"}
  else if (($("#dist_dropdown").dropdown('get text'))=="Within ten miles"){dist="ten"}
  else{dist="any_dist"}

  search=[date, dist]
  return(search)
}




//this function will get your list of sorted ids!
//it takes your activity list as a parameter, which you get from your subscription
function get_id_list(act_list){

        id_list=[]
        x=0;
        discards=Meteor.user().profile.discards;
        second_best_event_ids=[];
        y=0;
        //set up the act list, ensuring that the first activities are those that are marked
        for (var i = 0; i < total; i++) {
          act_id=act_list[i]._id
          //check if the event has been discarded (so if the the discarded array does not contain its id)
          //if (! Meteor.users.find({_id: Meteor.user()._id} ,{'profile.discards':{_id: act_id }})){
            //if black one or black one or black 2 is marked, put it at the top of the list
            if (act_list[i].black1 || act_list[i].black2||act_list[i].red1||act_list[i].red2){
                id_list[y]=act_id;
                y+=1;
            }

            //if not save it for later
            else{
              second_best_event_ids[x]=act_id;
              x+=1;
            }
          //}
        }


        //goes through second rate activities and tacks them on to end of id_list

        z=id_list.length;
         for (i = 0; i < x; i++) {
             id_list[z]=second_best_event_ids[i];
             z+=1;

          }

        //gets the very first element in the list, sets it as the current activity
        //current_act= Activities.findOne(id_list[activity_index]);

        current_id=id_list[activity_index];
       //make sure first activity hasn't been discarded
        if(Meteor.user()){
           while(Meteor.users.find({_id:Meteor.user()._id, 'profile.discards._id':current_id}).count()){
              console.log("keep going?")
              activity_index+=1;
              current_id=id_list[activity_index];
            }
        }
        current_act= Activities.findOne(id_list[activity_index]);
        Session.set('current_activitiy', current_act);

        Session.set('id_list',id_list);
        Session.set('current_act_list',act_list);
        Session.set('current_activity',current_act);
}









//*************************
//ROUTER STUFF
//*************************
Router.route('/', function(){
  this.render('home');
},{
  name: 'home'
});


Router.route('/entertainment', {
    name: 'entertainment',
    data: function(){
      if(!Session.get('current_activity')){
        //then call the act function
      }
      random_function();
      act_list=Session.get('current_act_list')
      current_act=Session.get('current_activity')
        return {
            dontneedthis: current_act
        };
      }
    });


Router.route('/sports');
Router.route('/art');
Router.route('/stayin');
Router.route('/surpriseme');
Router.configure({
  layoutTemplate: 'main'
});



