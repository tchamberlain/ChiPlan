Router.route('/share/:_id/:fromEvents/:fromYourEvents', {
    name: 'share',
    data: function(){
     Session.set('get_fromYourEvents',0);
     Meteor.subscribe('event_by_id',Router.current().params._id);
      if(this.params.fromEvents=="fromYourEvents"){
        Session.set('get_fromYourEvents',1);
      }
       Session.set('fromEvents',this.params.fromEvents);
   },
        waitOn: function(){
          if(Session.get('current_activity')){ 
            return  Meteor.subscribe('get_user_names')  ;}
            
          else{
            return [Meteor.subscribe('event_by_id',Router.current().params._id), Meteor.subscribe('get_user_names')]; }
        }
    });


Template.share.onRendered(function(){
 
  //subscriptions
    act_id=Router.current().params._id;
    Meteor.subscribe('event_by_id',act_id);
    Meteor.subscribe('get_all_invites');
    Meteor.subscribe('get_user_names');


    Session.set('fromEvents',Router.current().params.fromEvents);
    Session.set('current_activity', Activities.findOne(act_id));

    //get the parameters in case you need to re-populate the act_list 
    dist_param=Session.get('dist_param');
    date_param=Session.get('date_param');
    category_param=Session.get('category_param');

   });


Template.share.helpers({

  'get_when': function(){
    return get_when();
  },

  //used to determine which back button to show
  'get_fromEvents': function(){
        if (parseInt(Router.current().params.fromEvents)==1){ var fromEvents=true;}
        else{ var fromEvents=false;}

        return fromEvents;
   },
     'get_fromYourEvents': function(){
        if ((Router.current().params.fromYourEvents)==1){ var YourEvents=true;}
        else{ var YourEvents=false;}

        return YourEvents;
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
      return Session.get('current_activity');
   },

     'get_activity_date': function(){
      
      return Session.get('current_activity');
   },

   'get_link_fb':function(){
      act_id= Session.get('current_activity')._id;
      link="https://www.facebook.com/sharer/sharer.php?u="+"chiplan.meteor.com/actInfo/"+act_id+"/0%2C0%2C1";
      return link;
   },

   'get_link_twitter':function(){
      act_id= Session.get('current_activity')._id;
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

  'click #back_to_seeAll': function (evt, template) {
      var the_id=Session.get('current_activity')._id
      console.log("clicked back to see all");
      if(Session.get('activity_list')!=null){
      Router.go('seeAll',{category:Session.get('category'),date:Session.get('date'),distance: Session.get('dist')})
      }
      else{
        console.log('are you here');
        Router.go('seeAll',{category:category_param,date:date_param,distance: dist_param});
      }

    },

    'click #back_to_yourEvents': function (evt, template) {
        var the_id=Session.get('current_activity')._id
        console.log("clicked back_to_actInfo");
        Router.go('dashboard');

    },

      'click #seeAll': function (evt, template) {
        var the_id=Session.get('current_activity')._id
        Router.go('actInfo',{_id: the_id, button_info:[0,1,0]})
    },

      'click #back_to_eventsTemp': function (evt, template) {
        //update current activity
      

        if(Session.get('activity_list')!=null){
           activity_index=Session.get('activity_index')+1;
           activity_list=Session.get('activity_list');
        Session.set('activity_index',activity_index );
        Session.set('current_activity', activity_list[activity_index])
        params=Router.current().params;
        params=Router.current().params;
        Router.go('eventsTemp',{category:Session.get('category'),date:Session.get('date'),distance: Session.get('dist')})


        }
        else{
          //Session.set('create_act_list',0);
          Router.go(history.back());
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


Template.invite_modal.helpers({
  'get_current_activity': function () {
    console.log("doing this??",Session.get('current_activity'));
    return Session.get('current_activity');

  }

});







