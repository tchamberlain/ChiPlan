
Router.route('/actInfo/:_id/:button_info', {
    name: 'actInfo',
    data: function(){

      button_info=this.params.button_info;
      console.log('button_info');
      console.log(this.params.button_info[0]);
      console.log(this.params.button_info[2]);
      favorite_button_show= parseInt(this.params.button_info[0]);
      discard_button_show= parseInt(this.params.button_info[2]);
      only_info= parseInt(this.params.button_info[4]);

      //using 2 bc it is a string, not an actual arrays
      if(only_info){
        Session.set('discard_button_show',0);
        Session.set('favorite_button_show',0);
        Session.set('both_buttons_show',0);
      }
      else if(discard_button_show){
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
          return Meteor.subscribe('event_by_id',this.params._id);
        }
    });


Template.actInfo.helpers({
   'chosen_activity': function(){
      return Activities.findOne();
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
        current_act=Activities.findOne();
        Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
        Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}})
        Router.go('share',{_id: current_act._id});
    }
    //if there's no user, set up an error modal
    else{
      console.log('we made it ooo ooo')
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
        current_act=Activities.findOne();
        Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}});
        Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}});
    }
  }

 });

Template.actInfo.helpers({
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


//WHY IS THIS HERE... DO I NEED IT...?
  Deps.autorun(function(){
    Meteor.subscribe('userData');
});

