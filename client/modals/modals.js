//

Template.invite_modal.helpers ({
'get_person': function(){
      return Session.get('query_name');
   }
});


Template.invite_modal.events({
     
     'click #invite': function () {
      user_id= Session.get('query_name')._id
      invite_activity= Session.get('current_activity')
      inviter= Meteor.user()

    //if the user has already been invited to something, we will do an update of their doc
    if (Invites.findOne(user_id)){
        Invites.update({_id: user_id}, {$addToSet: {activity_inviter: {activity:invite_activity, inviter:inviter }}});
    }

    //currently using extra colllection for this(since client side cant update users --- not sure if necessary, 
    //also not sure if a bad sercurity issue in future....
    else{
      Invites.insert({
        _id: user_id,
        activity_inviter: [{activity:invite_activity, inviter:inviter }]
      });
    }
  }

});





  //tryna check for this on login
  Accounts.onLogin( function(){
    //removing events from favorites and from discards that already occurred
    //get yesterdays date, if the event was before yesterday, pull it
    yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 
    if(Meteor.user()){
        user_id=Meteor.user()._id
       Meteor.users.update({_id: user_id}, {$pull: {'profile.favorites': {start_date: {$lt: yesterday} }}});
       console.log("pulled?")
       //Meteor.users.update({_id: user_id}, {$pull: {'profile.discards': {start_date: {$lt: yesterday} }}});
    }
   

    Session.set('name_modal',1)
    if(Session.get('name_modal')){
      if(!Meteor.user().profile.DOB){
        //does this search just within template? you want it to search whole doc
         $('.ui.modal.name_modal')
          .modal('setting', 'closable', false)
          .modal('show')
    }
  }
  });


Template.name_modal.events({
  'click #name_enter': function(evt, template){
    console.log("in the right function")
    var first_name = template.find(".first_name").value;
    var last_name = template.find(".last_name").value;
    var full_name= first_name+" "+last_name
      console.log(full_name)
    var month = template.find(".month").value;
    var year = template.find(".year").value;
    var day = template.find(".day").value;
  
    var DOB= month+"/"+day+"/"+year;


       Meteor.users.update({_id: Meteor.user()._id}, {$set: {
                      'profile.name': full_name,
                      'profile.DOB': DOB,
                      'profile.hasSwiped':false
                      }});
        console.log(Meteor.user().profile.name)
        console.log(Meteor.user().profile.DOB)
          }


});

