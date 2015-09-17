Router.route('/dashboard',{
   waitOn: function(){
          nullGlobals();
        }
  });

Template.dashboard.onRendered( function(){    
  

  if(Meteor.user()){

        discards=Meteor.user().profile.discards;
      if(discards){
        discard_ids=get_list_of_ids(discards);
      }
      else{discard_ids=[];}

        favorites=Meteor.user().profile.favorites;
     if(favorites){
        favorite_ids=get_list_of_ids(favorites);
      }
      else{
        favorite_ids=[];

      }
        Session.set('current_activity', Activities.findOne());
      }
});


Template.dashboard.events({ 
      'click #accept': function(){
        console.log("u pushed accept",this.activity.title);
        this.activity.tags=[];
        acceptEvent(this.activity);

    },
    'click #activity': function(){
      var the_id = this._id;
      Session.set('current_activity',Meteor.subscribe('event_by_id',the_id));
      Session.set('actInfoEvent',this);
      Router.go('actInfo',{_id: the_id, isInvite:[0]});
    },
        'click #share': function(){
      var the_id = this._id;
      Session.set('current_activity',Meteor.subscribe('event_by_id',the_id));
      Router.go('share',{_id: the_id, fromEvents:0,fromYourEvents:1});
    },
      'click #invite_activity': function(){
      var the_id = this.activity._id;
      console.log(this.activity.title);
      //change how invites are viewed in actInfo!!!
      console.log('change how invites are viewed in actInfo!!!');
      //Router.go('actInfo',{_id: the_id, isInvite:[1]});
    },

    'click #fav_icon': function(){
      var act_id = this._id;

      Meteor.users.update({_id: user_id}, {$addToSet: {'profile.discarding': {_id: act_id}}});
      var act_id = this._id;

      setTimeout(function() {
        Meteor.users.update({_id: user_id}, {$pull: {'profile.discarding': {_id: act_id}}});
        Meteor.users.update({_id: user_id}, {$pull: {'profile.favorites': {_id: act_id}}});
        Meteor.users.update({_id: user_id}, {$addToSet: {'profile.discards': {_id: act_id}}});

            }, 800);

    },


    'click #remove_invite': function(){
      ///add stuff to remove invite
      console.log('add stuff to remove invite!');
    }

    });

  Template.dashboard.helpers({ 
      'get_fav_list': function(category){
            if (Meteor.user().profile.favorites.length==0)
              return false;
            return Meteor.user().profile.favorites;
  },


  'get_icon_text':function(){
      return Session.get('icon_text');
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
  'is_admin':function(){
    return isAdmin();
  },

    'get_invited_events': function(category){
        if(Meteor.user()){
            if (Meteor.user().profile.invitations.length >0) {
                return Meteor.user().profile.invitations;
            }
        }
    },
    'get_sentInvitations': function(category){
        if(Meteor.user()){
            if (Meteor.user().profile.sentInvitations.length >0) {
                return Meteor.user().profile.sentInvitations;
            }
        }
    }
             
  });



isAdmin=function(){
  return Meteor.user().profile.name=="admin admin";
}

function acceptEvent (obj){
    //call insert on the object
    console.log(obj);
    Activities.insert(obj);

  //call geocode function on the object
  geocode_update_db(obj);
}

