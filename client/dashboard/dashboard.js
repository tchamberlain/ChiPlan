Router.route('/dashboard',{
   waitOn: function(){
          nullGlobals();
          return Meteor.subscribe('get_user_invites',Meteor.user()._id);
        }
  });

Template.dashboard.onRendered( function(){    
  
  Meteor.subscribe('get_user_invites', Meteor.user()._id);



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
        acceptEvent(this.activity);
        Activities.insert({title: this.activity.title, start_date: this.activity.start_date, tags:[]});

      // thing that inserts activity into db after geocoding
    // Meteor.call('acceptEvent');

    },
    'click #activity': function(){
      var the_id = this._id;
      Session.set('current_activity',Meteor.subscribe('event_by_id',the_id));
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
      Router.go('actInfo',{_id: the_id, isInvite:[1]});
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

      var user_id =Meteor.user()._id
      var act_id = this.activity._id;
      var inviter_id=this.inviter._id;

      console.log("act, inviter",act_id,inviter_id );
      Meteor.users.update({_id: user_id}, {$addToSet: {'profile.discarding': {_id: act_id}}}); 

      setTimeout(function() {
        Meteor.users.update({_id: user_id}, {$pull: {'profile.discarding': {_id: act_id}}});
        Invites.update({_id: user_id}, {$pull: {'activity_inviter': {'activity._id': act_id,'inviter._id':inviter_id }}});
            }, 800);      

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



isAdmin=function(){
  return Meteor.user().profile.name=="admin admin";
}

function acceptEvent (obj){
  //geocode
  //call geocode function
    //- can;t call geocode function bc the activity needs to be already in the db??
  //call insert on the object, as is?
  

}

