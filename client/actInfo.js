

  Template.actInfo.events({
    'click #favorite': function(){
      //if there is a user logged in, send them to the confirmation page
      if( Meteor.user()){
        current_act=Session.get('current_activity')
        Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
        Router.go('share',{_id: current_act._id});
    }
    //if there's no user, set up an error modal
    else{
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }
  },

  'click #back': function(){
    Router.go()
  }



 });

  Deps.autorun(function(){
    Meteor.subscribe('userData');
});

