

Router.route('/seeAll/:category/:date/:distance', {
   name: 'seeAll',
    data: function(){

      console.log(this.params.category)
      console.log(this.params.date)
      console.log(this.params.distance)

        },

        waitOn: function(){
        return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance]);
    }
    });
  
   Template.seeAll.onRendered( function(){
             //LATER LOOK you will want to move this so it doesn't keep calling it (only need to call it once after your subscriptions have come)
          //ALSO LATER, make this sort by highschoolers tick marks, so that you get the good items first
          // activity_list= Activities.find().fetch();
          // current_activity= activity_list[activity_index];

          //do we need to set this as a reactive variable.... prolly not???? 
         Session.set('current_act_list', Activities.find().fetch());

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




   }
  );



  Template.seeAll.helpers({
  'get_act_list': function(category){
    return Session.get('current_act_list')
  },

  'get_heart_icon': function(act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
      return 1;
    }
   
    else{
    return 0;
    }
  },

    'get_x_icon': function(act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
      return 1;
    }
    else{
      return 0;
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

  Template.seeAll.events({ 
    'click #activity': function(){
       the_id= this._id;
      Router.go('actInfo',{_id: the_id, button_info:[is_discard(the_id),is_favorite(the_id)]} );
    },

       'click .icon': function(){
      console.log("you clicked an icon")
      console.log(this._id)
      act_id=this._id;
      current_act=Activities.findOne(act_id)

      //if its a favorite, make it a discard
      if(is_favorite (act_id)){
        if( Meteor.user()){
          Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}});
          Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}});
       }
      }
     //if its a discard or a nothing, make it a favorite
      else{
         if( Meteor.user()){
          Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}});
          Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}});
       }

      }




    }





  });