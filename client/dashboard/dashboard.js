Router.route('/dashboard',{
   waitOn: function(){

          return Meteor.subscribe('get_user_invites',Meteor.user()._id);
        }
  });

Template.dashboard.onRendered( function(){    
  Meteor.subscribe('get_user_invites', Meteor.user()._id);

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

        Session.set('current_activity', Activities.findOne());
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
      Router.go('yourEventsActInfo',{_id: the_id, is_invite:0});
    },
      'click #invite_activity': function(){
      var the_id = this.activity._id;
      console.log(this.activity.title);
      Router.go('yourEventsActInfo',{_id: the_id, is_invite:1});
    },

    'click #remove': function(){
      var act_id = this._id;
      var user_id =Meteor.user()._id
      Meteor.users.update({_id: user_id}, {$pull: {'profile.favorites': {_id: act_id}}});
    },
    'click #fav_icon': function(){
            var act_id = this._id;

       Meteor.users.update({_id: user_id}, {$addToSet: {'profile.discarding': {_id: act_id}}});
      var act_id = this._id;
      console.log("clicked icon")

     setTimeout(function() {
           Meteor.users.update({_id: user_id}, {$pull: {'profile.discarding': {_id: act_id}}});
           Meteor.users.update({_id: user_id}, {$pull: {'profile.favorites': {_id: act_id}}});
            Meteor.users.update({_id: user_id}, {$addToSet: {'profile.discards': {_id: act_id}}});

            }, 800);

    },

    'click #remove_invite': function(){
      var user_id =Meteor.user()._id
       Meteor.users.update({_id: user_id}, {$addToSet: {'profile.discarding': {_id: act_id}}});
      var act_id = this._id;
      console.log("clicked icon")
     setTimeout(function() {
           Meteor.users.update({_id: user_id}, {$pull: {'profile.discarding': {_id: act_id}}});
        Invites.update({_id: user_id}, {$pull: {'activity_inviter': {activity: this.activity,inviter: this.inviter}}});


            }, 800);      

    }
  });

    Template.dashboard.helpers({ 
        'get_fav_list': function(category){
            if (Meteor.user().profile.favorites.length==0)
              return false;
            return Meteor.user().profile.favorites;
  },

    'get_heart_icon': function(act_id){
          user_id=Meteor.user()._id;
          if(Meteor.users.find({_id:user_id, 'profile.discarding._id':act_id}).count()){
            return 0;
          }
          else{
            return 1;
          }
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