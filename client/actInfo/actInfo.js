Router.route('/actInfo/:_id/:isInvite', {
    name: 'actInfo',
    waitOn: function(){
      currentID=this.params._id;
      if(!Session.get('actInfoEvent')){
          return Meteor.subscribe('event_by_id',this.params._id);
      }
    }
    });

Template.actInfo.onCreated( function(){
   if(!Session.get('actInfoEvent')){
    var actInfoEvent=Activities.findOne(currentID);
    Session.set('actInfoEvent', actInfoEvent);
    Meteor.subscribe('event_by_id',currentID);
    }
    else{
      var actInfoEvent=Session.get('actInfoEvent');
    }
    //default is no buttons
    setButtonsNone();

    //if this is neither a fav nor a discard, we need to show both buttons
    if((is_favorite(actInfoEvent._id)||is_discard(actInfoEvent._id))==false){
      console.log("is_favorite(actInfoEvent._id)",is_favorite(actInfoEvent._id));
      console.log("is_discard(actInfoEvent._id)",is_discard(actInfoEvent._id));
      setButtonsBoth();
    }
    else if(is_favorite(actInfoEvent._id)){
      setButtonsDiscard();
    }
    else{
      setButtonsFavorite();
    }
});

Template.actInfo.helpers({
   'chosen_activity': function(){
      return Session.get('actInfoEvent');
   },
  'is_favorite': function(){
          act_id=Session.get('actInfoEvent')._id;
         return is_favorite(act_id);
  },
    'showAttendance': function(){
    current_activity=Session.get('actInfoEvent');
    return (current_activity.attending>=5);
  }
});


  Template.actInfo.events({
    'click #favorite': function(){
        //if there is a user logged in, send them to the share page
        if( Meteor.user()){
          if(!Session.get('actInfoEvent')){
             current_act=Activities.findOne(currentID);
          }
          else{
           current_act=Session.get('actInfoEvent');

          }

          //update buttons
          setButtonsDiscard();
          //update user
          add_fav(current_act);
         
          Session.set('shareEvent',current_act);
          Router.go('share',{lastPlace: "actInfo", _id: current_act._id, fromEvents:0,fromYourEvents:0 });
        }
    //if there's no user, set up an error modal
    else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  },

   'click #discard': function(){
      if( Meteor.user()){
        current_act=Session.get('actInfoEvent');
        //update buttons
        setButtonsFavorite()

        //if there is a user logged in, send them to the share page
        add_discard(current_act);
      }
      else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  },

     'click #back': function(){
        //you either need to go back to seeAll, Dash, or Home
        //check current route and see where you need to go

    }

 });

Template.actInfo.helpers({
  'get_when': function(){
    return get_when(Session.get('actInfoEvent'));
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


//functions
setButtonsDiscard= function(){
  Session.set('discard_button_show',1);
  Session.set('favorite_button_show',0);
  Session.set('both_buttons_show',0);
};
setButtonsFavorite= function(){
  Session.set('discard_button_show',0);
  Session.set('favorite_button_show',1);
  Session.set('both_buttons_show',0); 
};
setButtonsBoth= function(){
  Session.set('discard_button_show',1);
  Session.set('favorite_button_show',1);
  Session.set('both_buttons_show',0);
};
setButtonsNone= function(){
  Session.set('discard_button_show',0);
  Session.set('favorite_button_show',0);
  Session.set('both_buttons_show',0);
  
};




Deps.autorun(function(){
    Meteor.subscribe('userData');
});