Pre_activities = new Mongo.Collection('pre_activities');
Activities = new Mongo.Collection('activities');
Invites = new Mongo.Collection('invites');




//*************************
//ROUTER STUFF
//*************************
Router.route('/', function(){
  this.render('home');
},{
  name: 'home'
});
Router.route('/entertainment');
Router.route('/sports');
Router.route('/art');
Router.route('/stayin');
Router.route('/surpriseme');
Router.route('/seeAll');
Router.configure({
  layoutTemplate: 'main'
});
Router.route('/dashboard');
Router.route('/actInfo/:_id/share', {
    name: 'share',
    data: function(){
      current_act=Activities.findOne(this.params._id)
     Session.set('current_activity',current_act )
        return {
            chosen_activity: current_act
        };
      }
    });


Router.route('/actInfo/:_id', {
    name: 'actInfo',
    data: function(){
        return {
            chosen_activity: Activities.findOne(this.params._id)
        };
      }
    });

Router.route('/swipe/:_id', {
    name: 'actInfo',
    data: function(){
        return {
            act_list: Activities.findOne(this.params._id)
        };
      }
    });






//*************************
//CLIENT STUFF
//*************************
if (Meteor.isClient) {


  //tryna check for this on login
  Accounts.onLogin( function(){
    Session.set('name_modal',1)
    if(Session.get('name_modal')){
      if(!Meteor.user().profile.name){
        //does this search just within template? you want it to search whole doc
         $('.ui.modal.name_modal')
          .modal('show');
    }
  }
  });


Template.name_modal.events({
  'click #name_enter': function(evt, template){
    console.log("in the right function")
    var first_name = template.find(".first_name").value;
      var last_name = template.find(".last_name").value;
      var full_name= first_name+" "+last_name
      console.log(full_name)


       Meteor.users.update({_id: Meteor.user()._id}, {$set: {
                      'profile.name': full_name
                      }});
        console.log(Meteor.user().profile.name)
          }


});










  Meteor.startup(function() {
    // set the name modal so it exists
    Session.set('name_modal',0)
    GoogleMaps.load();
      // first get current location lat and lng

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
       print_eventually= "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
       Session.set('lat',position.coords.latitude);
       Session.set('lng',position.coords.longitude);
    }

  });



  Template.swipe.helpers({
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
      
    }
  },



    'set_up_act_list': function(){
      console.log("set up act list")


      // ************DATE QUERY SETUP************
      //here we get the current date and put it in a useable foramt
      //we want these dates to not have times (hours or seconds)
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth();
      var yr = today.getFullYear();
      today= new Date(yr,mm,dd);
      
      //if tomorrow is checked, get only tom events
      if ($("#tomorrow").checkbox('is checked')){
        //get tomorrows date using today's date, however don't get hours, only day month and year
        tomorrow=new Date(yr,mm,dd);     
        tomorrow.setDate(tomorrow.getDate() + 1); 
        date_query= { "start_date": tomorrow }
      } 

      else if ($("#today").checkbox('is checked')){
        date_query= { "start_date": today }
      } 
  
    // if this week is checked, get only events within the week
      else if ($("#week").checkbox('is checked')){
        end =new Date(yr,mm,dd);    
        end.setDate(end.getDate() + 7); 
        date_query= { $and: [
                {start_date: {$lt: end}},
                {start_date: {$gte: today}}
            ]}
         var category_query={tags: { $exists: true } }
      } 
     // if this weekend is checked, get only events within the weekend
      else if ($("#weekend").checkbox('is checked')){
        day_of_week =today.getDay()
        add_amount_start= 5-day_of_week
        end =new Date(yr,mm,dd);   
        start =new Date(yr,mm,dd);   
        start.setDate(start.getDate() + add_amount_start); 
        end.setDate(end.getDate() + add_amount_start+3); 
        date_query= { $and: [
                {start_date: {$lt: end}},
                {start_date: {$gte: start}}
            ]}
      }
      else{
        date_query={tags: { $exists: true } }

      }

      // ************CATEGORY QUERY SETUP************
      category=Session.get('category' )
      console.log(category)
      //if the category is "surpiseme", get all activities, if  not, get just the specified type of act.
      if(category=="surpriseme"){
        //this is a cheat, currently doing this query when we know they exist
        category_query={tags: { $exists: true } }
      }
      else{
        category_query={tags: category}
      }

      // ************DISTANCE QUERY SETUP************
    y= Session.get('lat')
    x=Session.get('lng')
    //need to add in something that sends warning if geolocation does work !!!!!!!! CHECK THIS print_eventually 

      if ($("#five_mi").checkbox('is checked')){
        var final_query= Activities.find({ location:
                                           { $near :
                                              {
                                                $geometry: { type: "Point",  coordinates: [x, y ] },
                                                $maxDistance: 8047
                                              }
                                           },
                                            $and:[ date_query, category_query]
                                          })

      }

      else if ($("#ten_mi").checkbox('is checked')){
        var final_query= Activities.find({ location:
                                           { $near :
                                              {
                                                $geometry: { type: "Point",  coordinates: [x, y ] },
                                                $maxDistance: 16093
                                              }
                                           },
                                            $and:[ date_query, category_query]
                                          })


      }

      else{
        //if you don't care about distance, query only date and category
         var final_query= Activities.find({$and:[ date_query, category_query]})
      }

        //creates an array of the id's of all activities
        var total= final_query.count();
        console.log(total)
        act_list=final_query.fetch();
        console.log(act_list)

        id_list=[]
        for (var i = 0; i < total; i++) {
          id_list[i]=act_list[i]._id;
        }
        //gets the very first element in the list, sets it as the current activity
        current_act= Activities.findOne(id_list[activity_index]);
        Session.set('id_list',id_list);
        Session.set('current_act_list',act_list);
        Session.set('current_activity',current_act);
        }
    });

  Template.display_activity.helpers({
    'current_activity': function(){
          return Session.get('current_activity') 
        }
  });

  Template.swipe.onRendered(function(){
    activity_index=0;

  });




  Template.swipe.events({


    'click .nexter': function(){
        //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index+=1;
         id_list=Session.get(id_list);
        //get current id, or id  of next activity
        current_id=id_list[activity_index];
        //get activity corresponds to current_id
        current_act= Activities.findOne(current_id)
        Session.set('current_activity', current_act);

      },

          'click #nexter': function(){
        //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index+=1;
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

Template.header.events({
  'click .heading': function(){
    Router.go('home');   
         function geocode_update_db (elem) {   

              geocoder = new google.maps.Geocoder();
              geocoder.geocode( { 'address': elem.address}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  lat = results[0].geometry.location.lat();
                  lng = results[0].geometry.location.lng();
                  console.log(lat);
                  console.log(lng);
              } else {
                  alert('Geocode was not successful for the following reason: ' + status);
              }



              Activities.update({_id: elem._id}, {$set: {
                  location: {
                    "type" : "Point",
                    "coordinates" : [ 
                      lng, 
                      lat
                    ]
                    } 
                  }});

          });
      }


      all_activities=Activities.find().fetch()
      //space out google maps api requests
      // update_all_db(0);
      // function update_all_db(i) {
      //   if(all_activities.length > i) {
      //       setTimeout(function() {
      //            geocode_update_db(all_activities[i]);
      //           i+=1;
      //           update_all_db(i);
      //           console.log(i);
      //       }, 4500);
      //   }
      // } 



  },

  
  'click #dashboard': function(){
    Router.go('dashboard');   
  }
 });


Template.home.onRendered(function(){
  this.$('.checkbox').checkbox()




});

Template.home.events({
  'click #activity': function(){
    console.log("hello")

  }

});

Template.share.helpers({
    'get_person': function(){
      return Session.get('query_name');
   }

});


Template.share.events = {

//if they press enter on the form, we save the name they have entered
  'keypress input.newLink': function (evt, template) {
    if (evt.which === 13) {
      var input_name = template.find(".newLink").value;

      //check for name in user DB
      query_name= Meteor.users.findOne({'profile.name': input_name})
      //if this query doesn't exist (this user not in DB), show modal saying so
      if(!query_name){
        $('.ui.modal.error_modal')
        .modal('show');
      }
      else{
        Session.set('query_name',query_name)
        $('.ui.modal.send_modal')
        .modal('show');
        return query_name;

      }


    }
  },

//if they press the search button on the form, we save the name they have entered
  'click #search_button': function (evt, template) {
    var name = template.find(".newLink").value;
      console.log(name)

  }
};



Template.invite_modal.helpers ({
'get_person': function(){
      return Session.get('query_name');
   }
});


Template.invite_modal.events({
     
     'click #invite': function () {
      user_id= Session.get('query_name')._id
      invite_activity= Session.get('current_activity')
      inviter= Meteor.user()

    //if the user has already been invited to something, we will do an update of their doc
    if (Invites.findOne(user_id)){
        //Invites.update({_id: user_id}, {$addToSet: {activity_inviter:{activity:invite_activity, inviter:inviter} }});
        Invites.update({_id: user_id}, {$addToSet: {activity_inviter: {activity:invite_activity, inviter:inviter }}});
    }

    //currently using extra colllection for this(since client side cant update users --- not sure if necessary, 
    //also not sure if a bad sercurity issue in future....
    //also should i be storing a document here for activity, or is this nested array the same???? in terms of efficiency
    else{
      Invites.insert({
        _id: user_id,
        activity_inviter: [{activity:invite_activity, inviter:inviter }]
        //activity_inviter: {activity:invite_activity, inviter:inviter }
      });
    }
  }

});


 Template.entertainment.helpers({
  'set_category': function(category){
    Session.set('category', category )
  }
 });

 Template.sports.helpers({
  'set_category': function(category){
    Session.set('category', category )
  }
 });

  Template.art.helpers({
  'set_category': function(category){
    Session.set('category', category )
  }
 });

   Template.stayin.helpers({
  'set_category': function(category){
    Session.set('category', category )
  }
 });

    Template.surpriseme.helpers({
  'set_category': function(category){
    Session.set('category', category )
  }
 });

       Template.seeAll.helpers({
  'get_act_list': function(category){
    return Session.get('current_act_list')
  }
 });

  Template.seeAll.events({ 
    'click #activity': function(){
      the_id = this._id;
      Router.go('actInfo',{_id: the_id});
    }
  });

    Template.dashboard.events({ 
    'click #activity': function(){
      var act_id = this._id;
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



  Template.actInfo.events({
    'click #favorite': function(){
      //if there is a user logged in, send them to the confirmation page
      if( Meteor.user()){
        current_act=Session.get('current_activity')
        Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})

        Router.go('share',{_id: current_act._id});
    }
    //if there's no user, set up an error modal
    else{
      console.log('not logged innnnnnnn')
      $('.ui.modal.not_logged_in_modal')
        .modal('show');
    }

  }

 });

  Deps.autorun(function(){
    Meteor.subscribe('userData');
});



  Template.home.events({
  // "mouseenter #sports": (event, template) ->
  //   return
  //   //console.log "mousehover", event
  // "mouseleave #sports": (event, template) ->
  //   console.log "mouseout", event

    'click #B_entertainment': function(){
      activity_index=0;
      Session.set('category', "entertainment" );
      Router.go('entertainment');
    },
    'click #B_sports': function(){
      activity_index=0;
      Session.set('category', "sports" );
      
      Router.go('sports');
    },
    'click #B_art': function(){
      activity_index=0
      Session.set('category', "art" )
      Router.go('art');
    },
    'click #B_stayin': function(){
      activity_index=0
      Session.set('category', "stayin" )
      Router.go('stayin');
    },
    'click #B_surpriseme': function(){
      activity_index=0
      Session.set('category', "surpriseme" )
      Router.go('surpriseme');
    }

 });

}


//*************************
//SERVER STUFF
//*************************
if (Meteor.isServer) {

//fixing fb and twitter login
Meteor.startup(function() {
  Accounts.loginServiceConfiguration.remove({
    service: "facebook"
  });
  Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: "1655047711391983",
    secret: "63d4d2c34e96b3765135c6e0f6d84979"
  }); 

  //this removes events that have already happened from the activity db
  // today = new Date();
  // remove_these=Activities.find({end_date: {$lt: today} })
  // console.log(remove_these.fetch())
  // Activities.remove({end_date: {$lt: today} })


});




// trying to fix weird _id in imported mongo docs
// // also turned dates into real java dates

//1204 is num of activities from the calendar and from the library
//452 from just lib
  if (Activities.find().count()==0){
    Pre_activities.find().forEach(     
    function (elem) {     

      if(elem.source=="library"){
        var start_date = new Date(elem.start_date_f);
        var dd = start_date.getDate();
        var mm = start_date.getMonth();
        var yr = start_date.getFullYear();
        start_date1= new Date(yr,mm,dd);
        var end_date = new Date(elem.end_date_f);
        var dd = end_date.getDate();
        var mm = end_date.getMonth();
        var yr = end_date.getFullYear();
        end_date1= new Date(yr,mm,dd);
        

        var start_time= start_date.getHours()
        am_pm= "am"
        if(start_time>12){
          am_pm="pm"
          start_time=start_time-12

        }
       if(start_time==12){
          am_pm="am"
          start_time=12

        }
        minutes= start_date.getMinutes()
        if (minutes<10){
          minutes=minutes+"0"
        }
        var start_time= start_time+":"+minutes


        var end_time= end_date.getHours()
        am_pm= "am"
        if(end_time>12){
          am_pm="pm"
          end_time=end_time-12

        }
       if(end_time==12){
          am_pm="am"
          end_time=12

        }
        minutes= end_date.getMinutes()
        if (minutes<10){
          minutes=minutes+"0"
        }
        var end_time= end_time+":"+minutes



        lat=elem.lat
        lng=elem.lng
        source="library"

        tags_array=elem.tags.split("/")
        tags=[]
        for (i=0;i<tags_array.length; i++){
          tags.push(tags_array[i])
        }
        
      }
      else{
        //split the dates into arrays that can be used later
        var start_date_array=elem.start_date.split("/");
        var end_date_array=elem.end_date.split("/");

        //create javascript date objects from these arrays, subtracting 1 from the month (january is 0)
        start_date1=new Date(Number(start_date_array[2]), Number(start_date_array[0])-1, Number(start_date_array[1]))
        end_date1=new Date(Number(end_date_array[2]), Number(end_date_array[0])-1, Number(end_date_array[1]))

        // these events coming from the calendar need to be geocoded, so for now we set lat lng as 0,0
        lat=0
        lng=0
        source= "calendar"
        tags=elem.tags
        start_time=elem.start_time
        end_time= elem.end_time

      }

      Activities.insert({
        title: elem.title,
        start_time: start_time,
        end_time: end_time,
        start_date: start_date1,
        end_date: end_date1,
        address:elem.address,
        description: elem.description,
        tags:tags,
        source: source,
        location: {
              "type" : "Point",
              "coordinates" : [ 
                lng, 
                lat
              ]
              }
      });

  } );

}




  Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};


    if (options.profile)
       user.profile = options.profile;

    //attempt to add favorites section
     _.extend(user.profile, { favorites : [] });

     Meteor.setTimeout(
     function(){ if(user.profile.first-name){
      var this_name= user.profile.first-name
      if(!(user.profile.name)){
     

      _.extend(user.profile, { name : this_name });
    } }},3000)

     

    return user;

  });


Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    profile: 1,
  }});
});



}
