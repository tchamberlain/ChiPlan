
Router.route('/events/:category/:date/:distance', {
    name: 'eventsTemp',
    data: function(){

      console.log(this.params.category)
      console.log(this.params.date)
      console.log(this.params.distance)
      return {
            category:  this.params.category

        };

        },

        waitOn: function(){
        return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance, this.params.user_loc]);
    }
    });



Template.eventsTemp.onRendered( function(){
    activity_index=0;
    activity_list= Activities.find().fetch();

   

    //taking out discards from what you display
    if(Meteor.user()){
      discards=Meteor.user().profile.discards;
      if(discards){
        //get array of all discard ids
        discard_ids=[];
        for(i=0; i<discards.length; i++){
          discard_ids[i]=discards[i]._id;
        }

        x=0;
        activity_list=[];
          for(i=0;i<activity_list.length;i++){
            //if this id isn't in the list of discards, added it to the good list
            if(discard_ids.indexOf(activity_list[i]._id)==-1){
              activity_list_new[x]=activity_list[i];
              x+=1;
            }
          }
      }

       
    activity_list=activity_list_new;
    }
    //set the first activity
    activity_index=0;
    current_activity= activity_list[activity_index];
    Session.set('current_activity',current_activity);

});



Template.eventsTemp.helpers({
  templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {
      console.log("You swiped left--- dislike")
       current_act=Session.get('current_activity')
       if(Meteor.user()){
           Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}})
          Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}})
       }
         
          activity_index+=1;
          Session.set('current_activity', activity_list[activity_index]);
     
    },
        'swiperight #hammerDiv': function (event, templateInstance) {
          var the_id=Session.get('current_activity')._id
          Router.go('actInfo',{_id: the_id});
      
      
    },
  },

  //   'doubletap #hammerDiv': function (event, templateInstance) {
  //     console.log("You doubletapped more info!!")
      


  // },
    
  'current_activity': function(){
          return Session.get('current_activity');
      }

});



  Template.eventsTemp.events({

        'click #discard': function(){

          $("#deck_slide")
            .transition('fly right')
          ;
                              $("#deck_slide")
            .transition('fly left')
          ;
          current_act=Session.get('current_activity')
          if( Meteor.user()){
            Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}})
            Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}})
          }          
          activity_index+=1;
          Session.set('current_activity', activity_list[activity_index]);

      },

        'click #previous': function(){
          activity_index-=1;
        Session.set('current_activity', activity_list[activity_index]);
      },

      'click #seeAll': function(){
         query_params=Router.current().params;
         Router.go('seeAll',{category: query_params.category, date: query_params.date, distance: query_params.distance});
       
      },

      'click #info': function(){ 
        var the_id=Session.get('current_activity')._id
          Router.go('actInfo',{_id: the_id});
      }
  });





