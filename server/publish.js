
//publish only events from a given query
Meteor.publish('events_query', function(query_parameters){
    
	//set up act list
  console.log("user_loc?", query_parameters[3],query_parameters[4]);
	
    return set_up_act_list(query_parameters[0],query_parameters[1],query_parameters[2],query_parameters[3],query_parameters[4]);

});

Meteor.publish('get_admin', function(){
        return Meteor.users.find({'profile.name': "admin admin"});
});

Meteor.publish('event_by_id', function(id){
        return Activities.find({_id: id});
});

Meteor.publish('get_user_invites', function(id){
        return Invites.find({_id: id});
});


Meteor.publish('get_user_names', function(id){
        return Meteor.users.find({});
});

Meteor.publish('get_all_invites', function(id){
        return Invites.find({});
});


Meteor.publish('user_by_name', function(name){
        console.log(Meteor.users.find({'profile.name':name}).fetch());
        return Meteor.users.find({'profile.name':name});
});





function set_up_act_list(search_category, search_date, search_dist, user_lng, user_lat){
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
        date_query= { start_date: tomorrow }
      } 

      else if (search_date=="today"){
        date_query= { start_date: today }
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
        category_query={tags: [category]}
      }

      
      
      var final_query= Activities.find({$and:[ date_query, category_query]})
      var total= final_query.count();
      console.log(total)
      return final_query;


}