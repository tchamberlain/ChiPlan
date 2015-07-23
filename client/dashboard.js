Router.route('/dashboard',{
   waitOn: function(){
          return Meteor.subscribe('get_user_invites',Meteor.user()._id);
        }
  });



Template.dashboard.events({ 
    'click #activity': function(){
      var act_id = this._id;
      Router.go('actInfo',{_id: act_id});
    },
      'click #invite_activity': function(){
      var act_id = this.activity._id;
      Router.go('actInfo',{_id: act_id});
    },

    'click #remove': function(){
      var act_id = this._id;
      var user_id =Meteor.user()._id
      Meteor.users.update({_id: user_id}, {$pull: {'profile.favorites': {_id: act_id}}});
    },

    'click #remove_invite': function(){
      var user_id =Meteor.user()._id
      Invites.update({_id: user_id}, {$pull: {'activity_inviter': {activity: this.activity,inviter: this.inviter}}});
    }
  });

    Template.dashboard.helpers({ 
        'get_fav_list': function(category){
            if (Meteor.user().profile.favorites.length==0)
              return false;
            return Meteor.user().profile.favorites;
  },
        'get_invited_events': function(category){
            if(Meteor.user()){
                user_id= Meteor.user()._id
                if (Invites.find({_id: user_id}).count() >0) {
                    user_entry= Invites.findOne(user_id)
                    console.log(user_entry)
                    activities= user_entry.activity_inviter
                    return activities;
                }
                if (Invites.find({_id: user_id}).count() ==0){
                  return false;
                }
            }
  }
          
  });
