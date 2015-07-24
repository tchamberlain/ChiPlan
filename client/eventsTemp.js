
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

Template.eventsTemp.onCreated( function(){
  activity_nexter=0;
});


Template.eventsTemp.onRendered( function(){

      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
   // function geocode_update_db (elem) {   
   //          //check if it's coordinates are 0, only update if they are bc those are the ones that havent been geocoded
   //          if(elem.location.coordinates[0]==0){
   //            geocoder = new google.maps.Geocoder();
   //            geocoder.geocode( { 'address': elem.address}, function(results, status) {
   //            if (status == google.maps.GeocoderStatus.OK) {
   //                lat = results[0].geometry.location.lat();
   //                lng = results[0].geometry.location.lng();
   //                console.log(lat);
   //                console.log(lng);
   //            } else {
   //                alert('Geocode was not successful for the following reason: ' + status);
   //            }

   //            Activities.update({_id: elem._id}, {$set: {
   //                location: {
   //                  "type" : "Point",
   //                  "coordinates" : [ 
   //                    lng, 
   //                    lat
   //                  ]
   //                  } 
   //                }});

   //        });
   //    }
   //  }


   //        all_activities=Activities.find().fetch()
   //    // space out google maps api requests
   //    update_all_db(150);
   //    function update_all_db(i) {
   //      if(all_activities.length > i) {
   //          setTimeout(function() {
   //               geocode_update_db(all_activities[i]);
   //              i+=1;
   //              update_all_db(i);
   //              console.log(i);
   //          }, 4000);
   //      }
   //    } 

      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################
      //GEOOOOOOOCODINGNGGGG@@@@@@@@@@@@@@@@@############################################


    activity_index=0;
    activity_list= Activities.find().fetch();

    //tryna make it so the act_list is only made once
    //when you come back to this temp, after going home, will rendered still be true? need to destroy template?
    if (!this.rendered){
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
          activity_list_new=[];
            for(i=0;i<activity_list.length;i++){
              //if this id isn't in the list of discards, added it to the good list
              if(discard_ids.indexOf(activity_list[i]._id)==-1){
                activity_list_new[x]=activity_list[i];
                x+=1;
              }
            }
            activity_list=activity_list_new;

        }

         
      }
      //set the first activity
      activity_index=0;
      current_activity= activity_list[activity_index];
      Session.set('current_activity',current_activity);
      console.log(Session.get('current_activity').title)


      this.rendered = true;
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





Template.eventsTemp.helpers({
  templateGestures: {
    'swipeleft #hammerDiv': function (event, templateInstance) {
      //same as discard
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
                     setTimeout(function() {
           activity_index+=1;
          Session.set('current_activity', activity_list[activity_index]);

            }, 200);
    },
        'swiperight #hammerDiv': function (event, templateInstance) {
          //same as favorite
          if( Meteor.user()){
            Session.set('is_favorite',1);
            current_act=Session.get('current_activity');
            console.log("is this working??")
            Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
            Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}})
            Router.go('share',{_id: current_act._id});
            activity_nexter=1;
            Session.set('current_activity', activity_list[activity_index])
          }
        else{
          alert("You must be logged in to favorite activities");
        }
      
    },
  },

    'is_favorite': function(){
      return Session.get('is_favorite');
    // if(Meteor.user().profile.favorites){
    //   return (favorite_ids.indexOf(Session.get('current_activity')._id)!=-1);
    // }
    // else{
    //   return 0;
    // }
  },



    'doubletap #hammerDiv': function (event, templateInstance) {
      console.log("You doubletapped more info!!")
        var the_id=Session.get('current_activity')._id
          Router.go('actInfo',{_id: the_id, button_info:[0,0,1]})

  },
    
  'current_activity': function(){
          return Session.get('current_activity');
      }

});



  Template.eventsTemp.events({
    'click #next':function(){
      Session.set('is_favorite',0);
     $("#deck_slide")
            .transition('fly right')
          ;
                              $("#deck_slide")
            .transition('fly left')
          ;
        setTimeout(function() {
           activity_index+=1;
          Session.set('current_activity', activity_list[activity_index]);

            }, 200);
        },

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
                     setTimeout(function() {
           activity_index+=1;
          Session.set('current_activity', activity_list[activity_index]);

            }, 200);
          

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
          Router.go('actInfo',{_id: the_id, button_info:[0,0,1]});
      },


      'click #favorite': function(){ 
          if( Meteor.user()){
            Session.set('is_favorite',1);
            current_act=Session.get('current_activity');
            console.log("is this working??")
            Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
            Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}})
            Router.go('share',{_id: current_act._id});
            activity_nexter=1;
            Session.set('current_activity', activity_list[activity_index])
          }
        else{
          alert("You must be logged in to favorite activities");
        }
      }
  });





