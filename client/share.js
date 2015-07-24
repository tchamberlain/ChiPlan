Router.route('/share/:_id', {
    name: 'share',
        waitOn: function(){
          return [Meteor.subscribe('event_by_id',this.params._id),Meteor.subscribe('get_user_names')];
        }
    });


Template.share.onRendered(function(){
    //not sure if a session variable is the right way to do this page
      Session.set('current_activity', Activities.findOne());
      console.log(Session.get('current_activity'))
      console.log(Meteor.users)
   });


Template.share.helpers({
    'get_person': function(){
      return Session.get('query_name');
   },

   'get_link_fb':function(){
      act_id= Session.get('current_activity')._id;
      link="https://www.facebook.com/sharer/sharer.php?u="+"chiplan.meteor.com/actInfo/"+act_id
      console.log(link)
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
    }
};

