Router.route('/yourEventsActInfo/:_id/:isInvite', {
    name: 'yourEventsActInfo',
    data: function(){

      if((parseInt(this.params.isInvite))==1) { setButtonsNone(); }
      else { setButtonsDiscard(); }
    },

        waitOn: function(){
          return Meteor.subscribe('event_by_id',this.params._id);
        }
    });

Template.yourEventsActInfo.onRendered( function(){
    Session.set('current_activity', Activities.findOne());
    current_activity=Activities.findOne();
});

Template.yourEventsActInfo.helpers({
   'chosen_activity': function(){
      return Activities.findOne();
   },
    'BacktoMyEvents': function(){
      return Session.get('BacktoMyEvents');
   },

  'is_favorite': function(){
      act_id=Session.get('current_activity')._id;
      return is_favorite(act_id);
  }

});

Template.yourEventsActInfo.events({
    'click #favorite': function(){
      //update buttons
      setButtonsDiscard();

      //if there is a user logged in, send them to the confirmation page
      if( Meteor.user()){
        current_act=Activities.findOne();
        add_fav(Meteor.user(),current_act);
        Router.go('share',{_id: current_act._id, fromEvents:0, fromYourEvents:1});
    }
    //if there's no user, set up an error modal
    else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  },

   'click #discard': function(){
      //update buttons
       setButtonsFavorite();
      //if there is a user logged in, send them to the confirmation page
      if( Meteor.user()){
        current_act=Activities.findOne();
        add_discard(Meteor.user(),current_act);
    }
  }
 });

Template.yourEventsActInfo.helpers({

  'get_when': function(){
    return get_when();
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