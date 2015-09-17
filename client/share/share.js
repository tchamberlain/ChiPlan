Router.route('share/:_id/', {
    name: 'share',
    data: function(){
     Meteor.subscribe('event_by_id',Router.current().params._id);
       Session.set('fromEvents',this.params.fromEvents);
   },
        waitOn: function(){
          if(Session.get('currentEvent')){ 
            return  Meteor.subscribe('get_user_names')  ;}
            
          else{
            return [Meteor.subscribe('event_by_id',Router.current().params._id), Meteor.subscribe('get_user_names')]; }
        }
    });


Template.share.onCreated(function(){
 
  //subscriptions
    act_id=Router.current().params._id;
    Meteor.subscribe('event_by_id',act_id);
    Meteor.subscribe('get_all_invites');
    Meteor.subscribe('get_user_names');


    Session.set('fromEvents',Router.current().params.fromEvents);
    Session.set('currentEvent', Activities.findOne(act_id));

    //get the parameters in case you need to re-populate the act_list 
    dist_param=Session.get('dist_param');
    date_param=Session.get('date_param');
    category_param=Session.get('category_param');

   });


Template.share.helpers({

  'get_when': function(){
    return get_when();
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
      return Session.get('currentEvent');
   },

     'get_activity_date': function(){
      
      return Session.get('currentEvent');
   },

   'get_link_fb':function(){
      act_id= Session.get('currentEvent')._id;
      link="https://www.facebook.com/sharer/sharer.php?u="+"chiplan.meteor.com/actInfo/"+act_id+"/0%2C0%2C1";
      return link;
   },

   'get_link_twitter':function(){
      act_id= Session.get('currentEvent')._id;
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
    console.log("search_buttoned")
    //call_invite_modal();
    //call_invite_modal =function(){

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

    // 'click #back': function (evt, template) {

    //   },


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
      user_id= Session.get('query_name')._id
      invite_activity= Session.get('currentEvent')
      inviter= Meteor.user();

      Meteor.call('sendInvite',Meteor.user(),Session.get('query_name'), invite_activity);

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

Template.invite_modal.helpers({
  'get_currentEvent': function () {
    return Session.get('currentEvent');
  }
});







