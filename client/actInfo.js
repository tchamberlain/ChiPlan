
Router.route('/actInfo/:_id', {
    name: 'actInfo',
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

  'click #back': function(){
    Router.go()
  }



 });

//WHY IS THIS HERE... DO I NEED IT...?
  Deps.autorun(function(){
    Meteor.subscribe('userData');
});

