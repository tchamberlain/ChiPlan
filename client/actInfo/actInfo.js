Router.route('/actInfo/:_id/:button_info', {
    name: 'actInfo',
    data: function(){

      button_info=this.params.button_info;
      console.log('button_info');
      console.log(this.params.button_info[0]);
      console.log(this.params.button_info[2]);
      console.log(this.params.button_info[4]);

      favorite_button_show= parseInt(this.params.button_info[0]);
      discard_button_show= parseInt(this.params.button_info[2]);
      only_info= parseInt(this.params.button_info[4]);

      Session.set('discard_button_show',0);
       Session.set('favorite_button_show',0);
        Session.set('both_buttons_show',0);

      if(only_info){
        Session.set('discard_button_show',0);
        Session.set('favorite_button_show',0);
        Session.set('both_buttons_show',0);
      }
      else  if(discard_button_show){
        Session.set('discard_button_show',1);
        Session.set('favorite_button_show',0);
        Session.set('both_buttons_show',0);
      }
      else if(favorite_button_show){
        Session.set('discard_button_show',0);
        Session.set('favorite_button_show',1);
        Session.set('both_buttons_show',0);
      }
      else {
        Session.set('discard_button_show',0);
        Session.set('favorite_button_show',0);
        Session.set('both_buttons_show',1);
      }

    },
        waitOn: function(){
          if(Session.get('current_activity')){
            subscribed=0;
            console.log('current_act in route',Session.get('current_activity'));
            return;
          }
          else{
            subscribed=1;
            return Meteor.subscribe('event_by_id',this.params._id);
        }
        }
    });

Template.actInfo.onCreated( function(){
    if(subscribed){
      console.log("are tyou heere? in created")
      Session.set('current_activity', Activities.findOne());
    }
    
});


Template.actInfo.helpers({
   'chosen_activity': function(){
      return Session.get('current_activity');
   },
    'BacktoMyEvents': function(){
      return Session.get('BacktoMyEvents');
   },


     'is_favorite': function(){
          if(favorite_ids){
            return (favorite_ids.indexOf(activity_list[activity_index]._id)!=-1);
          }
          else{
            return 0;
          }
  }

});



  Template.actInfo.events({
    'click #favorite': function(){
      //update buttons
       Session.set('discard_button_show',1);
        Session.set('favorite_button_show',0);
        Session.set('both_buttons_show',0);

      //if there is a user logged in, send them to the confirmation page
      if( Meteor.user()){
        current_act=Session.get('current_activity');
        Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
        Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}})
        Router.go('share',{_id: current_act._id, fromEvents:0,fromYourEvents:0 });
    }
    //if there's no user, set up an error modal
    else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  },

   'click #discard': function(){
      //update buttons
       Session.set('discard_button_show',0);
        Session.set('favorite_button_show',1);
        Session.set('both_buttons_show',0);

      //if there is a user logged in, send them to the confirmation page
      if( Meteor.user()){
        current_act=Session.get('current_activity');
        Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}});
        Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}});
    }
  }

 });

Template.actInfo.helpers({

  'get_when': function(){

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

  },
  
  'favorite_button_show':function(){
    return(Session.get('favorite_button_show'));
  },
  'discard_button_show':function(){
        return(Session.get('discard_button_show'));

  },
  'both_buttons_show':function(){
            return(Session.get('both_buttons_show'));

  }




});

Deps.autorun(function(){
    Meteor.subscribe('userData');
});