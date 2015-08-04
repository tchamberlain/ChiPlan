Router.route('/actInfo/:_id/:button_info', {
    name: 'actInfo',
    data: function(){
      favorite_button_show= parseInt(this.params.button_info[0]);
      discard_button_show= parseInt(this.params.button_info[2]);
      only_info= parseInt(this.params.button_info[4]);

      //no buttons by default
      setButtonsNone();
      if(only_info){setButtonsNone();}
      else if(discard_button_show){ setButtonsDiscard();}
      else if(favorite_button_show){setButtonsFavorite();}
      else {setButtonsBoth();}
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
      console.log("actInfo, subscribed and re-setting current activity")
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
          act_id=Session.get('current_activity')._id;
         return is_favorite(act_id);
  }
});


  Template.actInfo.events({
    'click #favorite': function(){
        //if there is a user logged in, send them to the share page
        if( Meteor.user()){
         current_act=Session.get('current_activity');

          //update buttons
          setButtonsDiscard();
          //update user
          add_fav(Meteor.user(),current_act);
          
          Router.go('share',{_id: current_act._id, fromEvents:0,fromYourEvents:0 });
        }
    //if there's no user, set up an error modal
    else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  },

   'click #discard': function(){
      if( Meteor.user()){
        current_act=Session.get('current_activity');
        //update buttons
        setButtonsFavorite()

        //if there is a user logged in, send them to the share page
        add_discard(Meteor.user(),current_act);
      }
      else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  }

 });

Template.actInfo.helpers({
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