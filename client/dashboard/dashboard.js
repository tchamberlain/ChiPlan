Router.route('/dashboard',{
   waitOn: function(){
          nullGlobals();
          Session.set('acceptEvent',null);


         return[ Meteor.subscribe('getInvitations', Meteor.user()),Meteor.subscribe('getSentInvitations', Meteor.user())];
        }
  });

Template.dashboard.onCreated( function(){    
      acceptedInvites=[];
      declinedInvites=[];
      unseenInvites=[];
     sentInvitations= makeAcceptedLists("sent");
    invitations= makeAcceptedLists("incoming");


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
        this.activity.tags=[];
        acceptEvent(this.activity);
    },
    'click #activity': function(){
      var the_id = this._id;
      if(isAdmin){
        Session.set('actInfoEvent',this.activity);
      }
      else{
          Session.set('current_activity',Meteor.subscribe('event_by_id',the_id));
          Session.set('actInfoEvent',this);
      }
      Router.go('actInfo',{_id: the_id, isInvite:[0]});
    },
    'click #share': function(){
      var the_id = this._id;
      Session.set('shareEvent',this);
      Router.go('share',{_id: the_id, fromEvents:0,fromYourEvents:1});
    },
      'click #invite_activity': function(){
      var the_id = this.activity;
      console.log(this.activity._id, "in invite activity");
            console.log(this);
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
      ///add stuff to remove invite
      console.log('add stuff to remove invite!');
    },
       'click #acceptInvite': function(){
      /// update accept in invitation object
      this.accepted=true;
      acceptedInvites.push(this.inviteStr);

      console.log("cliecked accept invite!");
      //if this has been declined prior, this will remove it from the list
      if(declinedInvites.indexOf(this.inviteStr)>-1){
        declinedInvites.splice(declinedInvites.indexOf(this.inviteStr),1); 
      }
      else if(unseenInvites.indexOf(this.inviteStr)>-1){
        unseenInvites.splice(unseenInvites.indexOf(this.inviteStr),1); 
      }

            console.log('acceptedInvites',acceptedInvites);

      Session.set('acceptedInvites',acceptedInvites);
      Session.set('declinedInvites',declinedInvites);
      Session.set('unseenInvites',unseenInvites);


      Invitations.update({_id:this._id}, {$set:{accepted:true}});


      if(isAdmin){
          //call insert on the object
          Activities.insert(this.activity);
          //call geocode function on the object
          geocode_update_db(this.activity);
      }

    },
        'click #declineInvite': function(){
      /// update accept in invitation object
        this.accepted=false;
     //if this has been declined prior, this will remove it from the list
      if(acceptedInvites.indexOf(this.inviteStr)>-1){
        acceptedInvites.splice(acceptedInvites.indexOf(this.inviteStr),1); 
      }
      else if(unseenInvites.indexOf(this.inviteStr)>-1){
        unseenInvites.splice(unseenInvites.indexOf(this.inviteStr),1); 
      }

      console.log('declinedInvites',declinedInvites);
       declinedInvites.push(this.inviteStr);

       Session.set('declinedInvites',declinedInvites);
       Session.set('acceptedInvites',acceptedInvites);
       Session.set('unseenInvites',unseenInvites);
        Invitations.update({_id:this._id}, {$set:{accepted:false}});


    }

    });

  Template.dashboard.helpers({ 
    'get_fav_list': function(category){
            if (Meteor.user().profile.favorites.length==0)
              return false;
            return Meteor.user().profile.favorites;
  },
      'getProp': function(invite_id, prop){
          invite=Invites.findOne(invite_id);
            return invite.activity[prop];
  },
    'isAccepted': function(){
            console.log("is acceoted",(Session.get('acceptedInvites').indexOf(this.inviteStr)>-1));
            return (Session.get('acceptedInvites').indexOf(this.inviteStr)>-1);
  },
    'isUnseen': function(){
          console.log("is unseenInvites",(Session.get('unseenInvites').indexOf(this.inviteStr)>-1));
          return (Session.get('unseenInvites').indexOf(this.inviteStr)>-1);
    },
    'isDeclined': function(){   
      console.log(Session.get('declinedInvites').indexOf(this.inviteStr)>-1, "IND DECLINED, IS?")
      console.log(this.inviteStr);
          return(Session.get('declinedInvites').indexOf(this.inviteStr)>-1);
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
          return invitations;
        }
    },
    'get_sentInvitations': function(category){
        if(Meteor.user()){
            return sentInvitations;
        }
    }
             
  });



isAdmin=function(){
  return Meteor.user().profile.name=="admin admin";
}

function acceptEvent (obj){
   //call insert on the object
    Activities.insert(obj);

  //call geocode function on the object
  geocode_update_db(obj);
}


function makeAcceptedLists(sent){

      //redo query
      if(sent=="sent"){
          listEvents= Invitations.find({inviterID: Meteor.user()._id}).fetch();
        }
      else{
          listEvents= Invitations.find({inviteeID: Meteor.user()._id}).fetch();
        }
      for(var i=0;i<listEvents.length; i++){
        if(listEvents[i].accepted=="unseen"){
          unseenInvites.push(listEvents[i].inviteStr);
        }
        else if(listEvents[i].accepted==true){
          acceptedInvites.push(listEvents[i].inviteStr);
        }
        else{
          declinedInvites.push(listEvents[i].inviteStr);
        }

        }
        if("sent")
      Session.set('declinedInvites',declinedInvites);
      Session.set('acceptedInvites',acceptedInvites);
      Session.set('unseenInvites',unseenInvites);
      console.log(sent,declinedInvites,"declinedInvites" );
       // console.log(Session.get('declinedInvites'), "did this set not work???");
      console.log(sent,declinedInvites,"unseenInvites" );
      console.log(sent,acceptedInvites,"acceptedInvites" );
      return listEvents;
}