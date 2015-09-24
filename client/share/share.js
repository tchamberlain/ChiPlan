Router.route('share/:_id/', {
    name: 'share',
    data: function(){
     Meteor.subscribe('event_by_id',Router.current().params._id);
       Session.set('fromEvents',this.params.fromEvents);
   },
        waitOn: function(){
          //only subscribe if share event doesnt exist
          if(Session.get('shareEvent')){ 
            //you may need to change this so that it searches for user names at the beginning, or, put a loader button for the 
            //user search to check if the subscription worked
            //return  Meteor.subscribe('get_user_names')  ;
          }
            
          else{
            return [Meteor.subscribe('event_by_id',Router.current().params._id), Meteor.subscribe('get_user_names')]; }
        }
    });


Template.share.onCreated(function(){
 
  //subscriptions
    act_id=Router.current().params._id;
    Meteor.subscribe('event_by_id',act_id);
    Meteor.subscribe('get_user_names');


    Session.set('fromEvents',Router.current().params.fromEvents);
    Session.set('shareEvent', Activities.findOne(act_id));

    //get the parameters in case you need to re-populate the act_list 
    dist_param=Session.get('dist_param');
    date_param=Session.get('date_param');
    category_param=Session.get('category_param');

   });


Template.share.helpers({

  'get_when': function(){
    return get_when(Session.get('shareEvent'));
  },

     'get_back_button': function(){
        if (parseInt(Router.current().params.fromEvents)==1){ var fromEvents=true;}
        else{ var fromEvents=false;}

        return fromEvents;
   },
    'get_person': function(){
      return Session.get('query_name');
   },

    'get_activity': function(){
      return Session.get('shareEvent');
   },

     'get_activity_date': function(){
      
      return Session.get('shareEvent');
   },

   'get_link_fb':function(){
      act_id= Session.get('shareEvent')._id;
      link="https://www.facebook.com/sharer/sharer.php?u="+"chiplan.meteor.com/actInfo/"+act_id+"/0%2C0%2C1";
      return link;
   },

   'get_link_twitter':function(){
      act_id= Session.get('shareEvent')._id;
      link="https://twitter.com/intent/tweet?text="+"https://chiplan.meteor.com/actInfo/"+act_id+"/0%2C0%2C1";
      return link;
   }
});


Template.share.events = {
//if they press enter on the form, we save the name they have entered
  'keypress input.inviteForm': function (evt, template) {
    if (evt.which === 13) {
     //call_invite_modal();

  var input_name = template.find('.inviteForm').value;
      //check for name in user DB
      query_name= Meteor.users.findOne({'profile.name': input_name});
      console.log(query_name,input_name);
      Session.set('query_name', input_name);
      //if this query doesn't exist (this user not in DB), show modal saying so
      if(!query_name){
        $('.ui.modal.error_modal')
        .modal('show');
      }
      else{
        Session.set('query_name',query_name)
        $('.ui.modal.send_modal')
        .modal('show');
        return query_name;
      }


    }
  },

//if they press the search button on the form, we save the name they have entered
  'click #search_button': function (evt, template) {

  var input_name = template.find('.inviteForm').value;
      //check for name in user DB
      query_name= Meteor.users.findOne({'profile.name': input_name});
      console.log(query_name,input_name);
      Session.set('query_name', input_name);
      //if this query doesn't exist (this user not in DB), show modal saying so
      if(!query_name){
        $('.ui.modal.error_modal')
        .modal('show');
      }
      else{
        Session.set('query_name',query_name)
        $('.ui.modal.send_modal')
        .modal('show');
        return query_name;
      }


    },


    'call_invite_modal':function(evt, template){
      var input_name = invite_modal.find(".inviteForm").value;
      //check for name in user DB
      query_name= Meteor.users.findOne({'profile.name': input_name})

      //if this query doesn't exist (this user not in DB), show modal saying so
      if(!query_name){
        $('.ui.modal.error_modal')
        .modal('show');
      }
      else{
        Session.set('query_name',query_name)
        $('.ui.modal.send_modal')
        .modal('show');
        return query_name;
      }

}
};



Template.invite_modal.helpers ({
'get_person': function(){
      return Session.get('query_name');
   }
});

Template.invite_modal.events({
     
     'click #invite': function () {
      invitee= Session.get('query_name');
      invite_activity= Session.get('shareEvent');
      inviter= Meteor.user();

      //Were going to insert an invitation into the db
      Invitations.insert({
                     inviteStr:""+inviter._id+invitee._id+invite_activity.title,
                     activity: invite_activity,
                     actTitle: invite_activity.title,
                     inviterName: inviter.profile.name,
                     inviteeName:invitee.profile.name,
                     inviterID: inviter._id,
                     inviteeID:invitee._id,
                     accepted:"unseen"
        });

    }

});


Template.invite_modal.helpers({
  'get_shareEvent': function () {
    return Session.get('shareEvent');
  }
});







