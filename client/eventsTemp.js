
  Template.eventsTemp.helpers({
   // tryna get swipe to work
    templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {
      console.log("You swiped left!!")
      //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index+=1;
        //get current id, or id  of next activity
        current_id=id_list[activity_index];
        //get activity corresponds to current_id
        current_act= Activities.findOne(current_id)
        Session.set('current_activity', current_act);
      
    },
        'swiperight #hammerDiv': function (event, templateInstance) {
      console.log("You swiped right!!")
      //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index-=1;
        //get current id, or id  of next activity
        current_id=id_list[activity_index];
        //get activity corresponds to current_id
        current_act= Activities.findOne(current_id)
        Session.set('current_activity', current_act);
      
    },

    'doubletap #hammerDiv': function (event, templateInstance) {
      console.log("You doubletapped !!")
      var the_id=Session.get('current_activity')._id
      Router.go('actInfo',{_id: the_id});
    }

  },

      'current_activity': function(){
          return Session.get('current_activity') 
        }
});

  Template.eventsTemp.events({

        'click #nexter': function(){
        //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index+=1;
        //get current id, or id  of next activity
        current_id=id_list[activity_index];
        //get activity corresponds to current_id
        current_act= Activities.findOne(current_id)
        Session.set('current_activity', current_act);
      },

        'click #previous': function(){
        //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index-=1;
        //get current id, or id  of next activity
        current_id=id_list[activity_index];
        //get activity corresponds to current_id
        current_act= Activities.findOne(current_id)
        Session.set('current_activity', current_act);
      },

      'click #seeAll': function(){
        Router.go('seeAll');
      },

      'click #info': function(){ 
        var the_id=Session.get('current_activity')._id
          Router.go('actInfo',{_id: the_id});
      }
  });