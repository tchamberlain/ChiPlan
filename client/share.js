//Router.route('/share/:_id/:category/:date/:distance/:fromEvents', {
Router.route('/share/:_id/:fromEvents', {

    name: 'share',
   data: function(){
     Session.set('get_fromYourEvents',0);
      if(this.params.fromEvents=="YourEvents"){
        Session.set('get_fromYourEvents',1);
      }
       Session.set('fromEvents',this.params.fromEvents);
   },
        waitOn: function(){
            return [Meteor.subscribe('event_by_id',this.params._id),Meteor.subscribe('get_user_names')];
        }
    });


Template.share.onRendered(function(){
   Session.set('fromEvents',Router.current().params.fromEvents);
    //not sure if a session variable is the right way to do this page
      Session.set('current_activity', Activities.findOne());
      console.log(Session.get('current_activity'))
      console.log(Meteor.users)
   });


Template.share.helpers({
  //used to determine which back button to show
  'get_fromEvents': function(){
        //return Session.get('fromEvents');
        if (parseInt(Router.current().params.fromEvents)==1){ var fromEvents=true;}
        else{ var fromEvents=false;}

        return fromEvents;
   },
     'get_fromYourEvents': function(){
        //return Session.get('fromEvents');
        if ((Router.current().params.fromEvents)=="YourEvents"){ var YourEvents=true;}
        else{ var YourEvents=false;}

        return YourEvents;
   },
     'get_back_button': function(){
        //return Session.get('fromEvents');
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
      link="https://www.facebook.com/sharer/sharer.php?u="+"chiplan.meteor.com/actInfo/"+act_id
      return link;
   },

   'get_link_twitter':function(){
      act_id= Session.get('current_activity')._id;
      link="https://twitter.com/intent/tweet?text="+"https://chiplan.meteor.com/actInfo/"+act_id
      return link;
   }



});


Template.share.events = {
//if they press enter on the form, we save the name they have entered
  'keypress input.newLink': function (evt, template) {
    if (evt.which === 13) {
      var input_name = template.find(".newLink").value;
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
  },

//if they press the search button on the form, we save the name they have entered
  'click #search_button': function (evt, template) {
    console.log("search_buttoned")
    var input_name = template.find(".newLink").value;
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
    },

  'click #back_to_seeAll': function (evt, template) {
      var the_id=Session.get('current_activity')._id
        console.log("clicked back_to_eventsTemp");
     Router.go('seeAll',{category:Session.get('category'),date:Session.get('date'),distance: Session.get('dist')})

    },

      'click #seeAll': function (evt, template) {
        var the_id=Session.get('current_activity')._id
        Router.go('actInfo',{_id: the_id, button_info:[0,1,0]})
    },

      'click #back_to_eventsTemp': function (evt, template) {
        //update current activity
        activity_index=Session.get('activity_index')+1;
        Session.set('activity_index',activity_index );
        Session.set('current_activity', activity_list[activity_index])
        params=Router.current().params;
        Router.go('eventsTemp',{category:Session.get('category'),date:Session.get('date'),distance: Session.get('dist')})
    }



};