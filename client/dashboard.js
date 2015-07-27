Router.route('/dashboard',{
   waitOn: function(){

          return Meteor.subscribe('get_user_invites',Meteor.user()._id);
        }
  });


Template.dashboard.onRendered( function(){    
  if(Meteor.user()){
        discards=Meteor.user().profile.discards;
        if(discards){
          //get array of all discard ids
          discard_ids=[];
          for(i=0; i<discards.length; i++){
            discard_ids[i]=discards[i]._id;
          }
        }

          //get array of all favorite ids
          favorite_ids=[];
        favorites=Meteor.user().profile.favorites;
        if(favorites){
          favorite_ids=[];
           for(i=0; i<favorites.length; i++){
              favorite_ids[i]=favorites[i]._id;
            }
        }
      }

});


function is_discard(act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
      return 1;
    }
    else{
      return 0;
    }
  };

function is_favorite (act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
      return 1;
    }
   
    else{
    return 0;
    }
  };


Template.dashboard.events({ 
    'click #activity': function(){
      var the_id = this._id;
      Router.go('actInfo',{_id: the_id, button_info:[is_discard(the_id),is_favorite(the_id)]});
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

        'get_string_title': function(category){
          
            return " ____            Your Events ___";
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