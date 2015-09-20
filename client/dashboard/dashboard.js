Router.route('/dashboard',{
   waitOn: function(){
          nullGlobals();
          Session.set('acceptEvent',null);
         return[ Meteor.subscribe('getInvitations', Meteor.user()),Meteor.subscribe('getSentInvitations', Meteor.user())];
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
      Session.set('shareEvent',this);
      Router.go('share',{_id: the_id, fromEvents:0,fromYourEvents:1});
    },
      'click #invite_activity': function(){
      var the_id = this.activity._id;
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

      // //update accept in actual db
      // //make new invitation
      // newInvite=  {
      //            inviterName: this.inviterName,
      //            inviteeName:this.inviteeName,
      //            inviterID: this.inviterID,
      //            inviteeID:this.inviteeID,
      //            accepted:true
      //               } ;
      // //remove old inivitation
      // Activities.update({_id:this.activity._id}, {$pull:{invitations:{inviterID:this.inviterID,inviteeID:this.inviteeID}}})
      // //change it to accepted, and re-add it, 
      // Activities.update({_id:this.activity._id}, {$addToSet:{invitations:newInvite}});
      // console.log(newInvite);
      // buildInviteObjects('inviteeID');
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
       //Activities.update({_id:this.activity._id}, {invitations.:newInvite});

          //make new invitation
    //   newInvite=  {
    //              inviterName: this.inviterName,
    //              inviteeName:this.inviteeName,
    //              inviterID: this.inviterID,
    //              inviteeID:this.inviteeID,
    //              accepted:false
    //                 } ;
    //   //remove old inivitation wait to do this until person leaves page?????
    //  Activities.update({_id:this.activity._id}, {$pull:{invitations:{inviterID:this.inviterID,inviteeID:this.inviteeID}}})
    //  // change it to accepted, and re-add it, 
    //  Activities.update({_id:this.activity._id}, {$addToSet:{invitations:newInvite}});
    //  console.log(newInvite);

    // buildInviteObjects('inviteeID');


    }

    });

  Template.dashboard.helpers({ 
    'get_fav_list': function(category){
            if (Meteor.user().profile.favorites.length==0)
              return false;
            return Meteor.user().profile.favorites;
  },
    'isAccepted': function(){
            this.accepted==true;
            console.log("is acceoted",(Session.get('acceptedInvites').indexOf(this.inviteStr)>-1));
            return (Session.get('acceptedInvites').indexOf(this.inviteStr)>-1);
  },
    'isUnseen': function(){
          this.accepted==true;
          console.log("is unseenInvites",(Session.get('unseenInvites').indexOf(this.inviteStr)>-1));
          return (Session.get('unseenInvites').indexOf(this.inviteStr)>-1);
    },
    'isDeclined': function(){   
          console.log("is declined",(Session.get('acceptedInvites').indexOf(this.inviteStr)>-1));
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
          return buildInviteObjects('inviteeID');
        }
    },
    'get_sentInvitations': function(category){
        if(Meteor.user()){
            return buildInviteObjects('inviterID');
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


function buildInviteObjects(person){
      acceptedInvites=[];
      declinedInvites=[];
      unseenInvites=[];
      //redo query
       listEvents= Activities.find({}).fetch();

      var invitationObjects=[];
      for (var x=0; x<listEvents.length;x++){
          activity=listEvents[x];
          actInvitations=activity.invitations;
          //console.log("activity, act's invitations --outer loop",activity, actInvitations);

          for(var i=0;i<actInvitations.length;i++){
            if(actInvitations[i][person]==Meteor.user()._id){

              var newInvite={     actTitle: activity.title,
                                  activity: activity, 
                                  accepted: actInvitations[i].accepted,
                                  inviterID:actInvitations[i].inviterID,
                                  inviteeID: actInvitations[i].inviteeID,
                                  inviterName:actInvitations[i].inviterName,
                                  inviteStr:""+actInvitations[i].inviteeID+actInvitations[i].inviterID+activity.title,
                                  inviteeName: actInvitations[i].inviteeName}
              invitationObjects.push(newInvite);


               if(actInvitations[i].accepted==null){
              unseenInvites.push(newInvite.inviteStr);

            }

            else if(actInvitations[i].accepted){
                acceptedInvites.push(newInvite.inviteStr);
            }
            else{
              declinedInvites.push(newInvite.inviteStr);
            }
            }
           

          }
          Session.set('declinedInvites',declinedInvites);
          Session.set('acceptedInvites',acceptedInvites);
          Session.set('unseenInvites',unseenInvites);
            //console.log( Session.get('unseenInvites',unseenInvites).indexOf(newInvite)," Session.set('unseenInvites',unseenInvites);")
        }
        return invitationObjects;

}

