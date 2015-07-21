
  Template.seeAll.helpers({
  'get_act_list': function(category){
    return Session.get('current_act_list')
  },

  'get_heart_icon': function(act_id){
    user_id=Meteor.user()._id;
    console.log(act_id)
    if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
      return 1;
    }
   
    else{
    return 0;
    }
  },

    'get_x_icon': function(act_id){
    user_id=Meteor.user()._id;
    console.log(act_id)
    if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
      return 1;
    }
    else{
      return 0;
    }
  }



 });


  Template.seeAll.events({ 
    'click #activity': function(){
      the_id = this._id;
      Router.go('actInfo',{_id: the_id});
    }
  });