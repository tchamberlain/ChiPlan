// js for home page



Template.home.onRendered(function(){
  this.$('.checkbox').checkbox();
  this.$('#weekend').checkbox('check');
  this.$('#sidebar').sidebar('attach events','#sidebar_button');
  $('.ui.dropdown')
  .dropdown()
;

});


Template.home.helpers({
  'get_next_event': function(){
    //First manually sort all favorites (change this later when server side $sort is implemented)
    if((Meteor.user())&&(Meteor.user().profile.favorites.length)){
      favorites=Meteor.user().profile.favorites
      next_event= favorites[0]
      for(i=1; i<favorites.length; i++){
        if(favorites[i].start_date<next_event.start_date){
          next_event=favorites[i];
        }
      }
      Session.set('next_event', next_event);
      return next_event;
    }
    else{
      return 0;
    }
   }

});


  Template.home.events({

    'click #stay_in_test': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("entertainment",search[0],search[1]);
      Router.go('eventsTemp',{category: "entertainment", date: search[0], distance: search[1]});
  },  

    'click #next_event': function(){
      the_id = Session.get('next_event')._id
      Router.go('actInfo',{_id: the_id});
  },  

    'click #B_entertainment': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("entertainment",search[0],search[1]);
      Router.go('eventsTemp',{category: "entertainment", date: search[0], distance: search[1]});
    },


    'click #B_sports': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("sports",search[0],search[1]);
      Router.go('eventsTemp',{category: "sports", date: search[0], distance: search[1]});
    },


    'click #B_art': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("art",search[0],search[1]);
      Router.go('eventsTemp',{category: "art", date: search[0], distance: search[1]});
    },


    'click #B_stayin': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("stayin",search[0],search[1]);
      Router.go('eventsTemp',{category: "stayin", date: search[0], distance: search[1]});
    },


    'click #B_surpriseme': function(){
      activity_index=0;
      search=get_search();
      set_up_act_list("surpriseme",search[0],search[1]);
      Router.go('eventsTemp',{category: "surpriseme", date: search[0], distance: search[1]});
    }

 });








function get_search(){
  console.log($("#date_dropdown").dropdown('get value'))

  //date search
    if ($("#tomorrow").checkbox('is checked')){ date="tomorrow"}
    else if ($("#today").checkbox('is checked')){date="today"}
    else if ($("#week").checkbox('is checked')){date="week"}
    else if ($("#weekend").checkbox('is checked')){date="weekend"}
  //trying  to add drop down items, might not work if comp screen accordion also checkED??? by default
    else if (($("#date_dropdown").dropdown('get text'))=="Tomorrow"){date="tomorrow"}
    else if (($("#date_dropdown").dropdown('get text'))=="Today"){date="today"}
    else if (($("#date_dropdown").dropdown('get text'))=="This week"){date="week"}
    else if (($("#date_dropdown").dropdown('get text'))=="This weekend"){date="weekend"}
    else{date="any_date"}


  //distance search
  if ($("#five_mi").checkbox('is checked')){dist="five"}
  else if ($("#ten_mi").checkbox('is checked')){dist="ten"}
  //trying  to add drop down items, might not work if comp screen accordion also checkED??? by default
  else if (($("#dist_dropdown").dropdown('get text'))=="Within five miles"){dist="five"}
  else if (($("#dist_dropdown").dropdown('get text'))=="Within ten miles"){dist="ten"}
  else{dist="any_dist"}

  search=[date, dist]
  return(search)
}





function set_up_act_list(search_category, search_date, search_dist){
   //we gonna set up the act list
      console.log("setting up act list")
      activity_index=0;

      // ************DATE QUERY SETUP************
      //here we get the current date and put it in a useable foramt
      //we want these dates to not have times (hours or seconds)
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth();
      var yr = today.getFullYear();
      today= new Date(yr,mm,dd);
      
      //if tomorrow is checked, get only tom events
      if (search_date=="tomorrow"){
        //get tomorrows date using today's date, however don't get hours, only day month and year
        tomorrow=new Date(yr,mm,dd);     
        tomorrow.setDate(tomorrow.getDate() + 1); 
        date_query= { "start_date": tomorrow }
      } 

      else if (search_date=="today"){
        date_query= { "start_date": today }
      } 
  
    // if this week is checked, get only events within the week
      else if (search_date=="week"){
        end =new Date(yr,mm,dd);    
        end.setDate(end.getDate() + 7); 
        date_query= { $and: [
                {start_date: {$lt: end}},
                {start_date: {$gte: today}}
            ]}
         var category_query={tags: { $exists: true } }
      } 
     // if this weekend is checked, get only events within the weekend
      else if (search_date=="weekend"){
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
      category=search_category
      console.log(category)
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

      if (search_dist=="five"){
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

      else if (search_dist=="ten"){
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
        x=0;
        discards=Meteor.user().profile.discards;
        second_best_event_ids=[];
        y=0;
        //set up the act list, ensuring that the first activities are those that are marked
        for (var i = 0; i < total; i++) {
          act_id=act_list[i]._id
          //check if the event has been discarded (so if the the discarded array does not contain its id)
          //if (! Meteor.users.find({_id: Meteor.user()._id} ,{'profile.discards':{_id: act_id }})){
            //if black one or black one or black 2 is marked, put it at the top of the list
            if (act_list[i].black1 || act_list[i].black2||act_list[i].red1||act_list[i].red2){
                id_list[y]=act_id;
                y+=1;
            }

            //if not save it for later
            else{
              second_best_event_ids[x]=act_id;
              x+=1;
            }
          //}
        }


        //goes through second rate activities and tacks them on to end of id_list

        z=id_list.length;
         for (i = 0; i < x; i++) {
             id_list[z]=second_best_event_ids[i];
             z+=1;

          }

        //gets the very first element in the list, sets it as the current activity
        //current_act= Activities.findOne(id_list[activity_index]);

        current_id=id_list[activity_index];
       //make sure first activity hasn't been discarded
        if(Meteor.user()){
           while(Meteor.users.find({_id:Meteor.user()._id, 'profile.discards._id':current_id}).count()){
              console.log("keep going?")
              activity_index+=1;
              current_id=id_list[activity_index];
            }
        }
        current_act= Activities.findOne(id_list[activity_index]);
        Session.set('current_activitiy', current_act);

        Session.set('id_list',id_list);
        Session.set('current_act_list',act_list);
        Session.set('current_activity',current_act);


}



//*************************
//ROUTER STUFF
//*************************
Router.route('/', function(){
  this.render('home');
},{
  name: 'home'
});


Router.route('/entertainment', {
    name: 'entertainment',
    data: function(){
      if(!Session.get('current_activity')){
        //then call the act function
      }
      random_function();
      act_list=Session.get('current_act_list')
      current_act=Session.get('current_activity')
        return {
            dontneedthis: current_act
        };
      }
    });


// Router.route('/entertainment');
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
      console.log(this.params._id)
        return {
            chosen_activity: Activities.findOne(this.params._id)
        };
      }
    });


Router.route('/events/:category/:date/:distance', {
    name: 'eventsTemp',
    data: function(){
      console.log(this.params.category)
      console.log(this.params.date)
      console.log(this.params.distance)
      //if the page is refreshed, recreate the activity list
       if(!Session.get('current_activity')){
          set_up_act_list(this.params.category, this.params.date, this.params.distance);
       }
        return {
            category:  this.params.category

        };
      }
    });


