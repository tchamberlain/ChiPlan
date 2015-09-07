//*************************
//SERVER STUFF
//*************************

// Kadira.connect('tsiQkv3kndvwK6onb', '3f9ed325-5973-46ab-882f-48009e1af487');

Meteor.startup(function() {
  //this removes events that have already happened from the activity db
  yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); 
  remove_these=Activities.find({start_date: {$lt: yesterday} })
  Activities.remove({start_date: {$lt: yesterday} })


});



if(Activities.find({source:"survey"}).count()==0){

  Pre_activities.find().forEach( 
        function (elem) { 
      
        if(elem.source=="survey"){
          title=elem.title;
          console.log("in survey part",title);
          if(elem.description){
            description=elem.description;
          }
          else{description=" ";}

          lat=0;
          lng=0;
          tags=["stayin"];
          source="survey";

          //get in highschoolers tick marks --- since none, all zeros for now
          black1=0;
          black2=0;
          red1=0;
          address=" ";
          red2=0;
          strike1=0;
          strike2=0;
          start_date1=" ";
          end_date1=" ";
          start_time=" ";
          end_time=" ";
          
     }     
   Activities.insert({
          title: title,
          start_time: start_time,
          end_time: end_time,
          start_date: start_date1,
          end_date: end_date1,
          address: address,
          description: description,
          tags: tags,
          source: source,
          black1: black1,
          black2: black2,
          red1: red1,
          red2: red2,
          strike2: strike2,
          strike1: strike1,
          location: {
                "type" : "Point",
                "coordinates" : [ 
                  lng, 
                  lat
                ]
                }
        });
      }
   )};



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


//unclear what this does, I think just publishes this specific user's data?
Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    profile: 1,
  }});
});







getDatesTime= function(now, parks){
  var year    = now.getFullYear();
  var hour    = now.getHours();
    //correct for wrong time zone
      var hour    = now.getHours()+5;
    
    var minute  = now.getMinutes();

    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }  
     
    
    am_pm="AM";
    if(hour==12){
      am_pm="PM";
    }
    else if(hour>12){
      am_pm="PM";
      hour-=12;
      console.log("ohur 1",hour);
    }
    console.log("ohur 2",hour);


    time=""+hour+":"+minute+" "+am_pm;
     

    return time;
}