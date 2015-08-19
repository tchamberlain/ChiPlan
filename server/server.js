//*************************
//SERVER STUFF
//*************************


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



// Kadira.connect('tsiQkv3kndvwK6onb', '3f9ed325-5973-46ab-882f-48009e1af487');

Meteor.startup(function() {
  //this removes events that have already happened from the activity db
  yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); 
  remove_these=Activities.find({start_date: {$lt: yesterday} })
  Activities.remove({start_date: {$lt: yesterday} })


});


// get in parks activities and sports (only those from espn with the time)
if (Activities.find({source:"espn"}).count()==0){
    Pre_activities.find().forEach( 
      function (elem) {  
   if ((elem.source=="parks")||(elem.source=="espn")){
     if (elem.source=="parks"){
        lat=0
        lng=0
        tags=elem.tags
        source=elem.source

        //get in highschoolers tick marks --- since none, all zeros for now
        black1=0;
        black2=0;
        red1=0;
        red2=0;
        strike1=0;
        strike2=0;

        //get date
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

        var title = elem.title.replace("Night Out: ", "");


        start_time= getDatesTime(start_date,"parks");
        end_time= getDatesTime( end_date,"parks");
                console.log(start_time,"parks");


        description=(elem.description).replace(']',"");

        address=elem.address;

      }  

      if(elem.source=="espn"){
        address=elem.address;
          black1=0;
        black2=0
        red1=0
        red2=0
        strike1=0
        strike2=0

        source=elem.source;
        description=elem.description;
        title=elem.title
        var start_date = new Date(elem.start_date_f);
        console.log(start_date);
        var dd = start_date.getDate();
        var mm = start_date.getMonth();
        var yr = start_date.getFullYear();
        start_date1= new Date(yr,mm,dd);
        var end_date = new Date(elem.end_date_f);
        var dd = end_date.getDate();
        var mm = end_date.getMonth();
        var yr = end_date.getFullYear();
        end_date1= new Date(yr,mm,dd);
        
        start_time= getDatesTime(start_date,0);
        end_time= getDatesTime(end_date,0);

        console.log(start_time,"espn");

        lat=elem.lat
        lng=elem.lng

        if(lat=="none"){
          lat=0;
          lng=0
        };

        tags=elem.tags;
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
  } );
}










//   if (Activities.find().count()==99999){
//     Pre_activities.find().forEach(    
//     function (elem) {  
//     console.log("elem")   ;
//       //you prolly wanna add this back in?
//       elem.title = elem.title.replace("&amp;", "&");
//       elem.description = elem.description.replace("&amp;", "&");
//       elem.description = elem.description.replace("This calendar is not affiliated with any section of the City of Chicago", "");
//       elem.description = elem.description.replace("Calendar: http://www.thrillhouse.com","");
//       elem.description = elem.description.replace("If you'd like to make a small donation to help keep the calendar running, you can Paypal chicagosummercalendar@gmail.com","");
//       elem.description =elem.description.replace("Map:","");

      //  if(elem.source=="choosechicago"||elem.source=="espn"||elem.source=="Sports & Fitness"){
      //   address=elem.address;
      //     black1=0;
      //   black2=0
      //   red1=0
      //   red2=0
      //   strike1=0
      //   strike2=0

      //   source=elem.source;
      //   title=elem.title
      //   var start_date = new Date(elem.start_date_f);
      //   var dd = start_date.getDate();
      //   var mm = start_date.getMonth();
      //   var yr = start_date.getFullYear();
      //   start_date1= new Date(yr,mm,dd);
      //   var end_date = new Date(elem.end_date_f);
      //   var dd = end_date.getDate();
      //   var mm = end_date.getMonth();
      //   var yr = end_date.getFullYear();
      //   end_date1= new Date(yr,mm,dd);
        

      //   start_time


      //   lat=elem.lat
      //   lng=elem.lng

      //   if(lat=="none"){
      //     lat=0;
      //     lng=0
      //   };

      //   tags=elem.tags;
      // }


//       else if(elem.source=="library"){
//         title=elem.title
//         var start_date = new Date(elem.start_date_f);
//         var dd = start_date.getDate();
//         var mm = start_date.getMonth();
//         var yr = start_date.getFullYear();
//         start_date1= new Date(yr,mm,dd);
//         var end_date = new Date(elem.end_date_f);
//         var dd = end_date.getDate();
//         var mm = end_date.getMonth();
//         var yr = end_date.getFullYear();
//         end_date1= new Date(yr,mm,dd);


//         //get in highschoolers tick marks
//         black1=elem.black1
//         black2=elem.black2
//         red1=elem.red1
//         red2=elem.red2
//         strike1=elem.strike1
//         strike2=elem.strike2

        

//         var start_time= start_date.getHours()
//         am_pm= "am"
//         if(start_time>12){
//           am_pm="pm"
//           start_time=start_time-12

//         }
//        if(start_time==12){
//           am_pm="am"
//           start_time=12

//         }
//         minutes= start_date.getMinutes()
//         if (minutes<10){
//           minutes=minutes+"0"
//         }
//         var start_time= start_time+":"+minutes+am_pm


//         var end_time= end_date.getHours()
//         am_pm= "am"
//         if(end_time>12){
//           am_pm="pm"
//           end_time=end_time-12

//         }
//        if(end_time==12){
//           am_pm="am"
//           end_time=12

//         }
//         minutes= end_date.getMinutes()
//         if (minutes<10){
//           minutes=minutes+"0"
//         }
//         var end_time= end_time+":"+minutes+am_pm



//         lat=elem.lat
//         lng=elem.lng
//         source="library"

//         tags_array=elem.tags.split("/")
//         tags=[]
//         for (i=0;i<tags_array.length; i++){
//           tags.push(tags_array[i])
//         }

//         address=elem.address;
        
//       }
//       else if (elem.source=="parks"){
//         lat=0
//         lng=0
//         tags=elem.tags
//         source=elem.source



//         //get in highschoolers tick marks --- since none, all zeros for now
//         black1=0;
//         black2=0;
//         red1=0;
//         red2=0;
//         strike1=0;
//         strike2=0;

//         var start_date = new Date(elem.start_date_f);
//         var dd = start_date.getDate();
//         var mm = start_date.getMonth();
//         var yr = start_date.getFullYear();
//         start_date1= new Date(yr,mm,dd);
//         var end_date = new Date(elem.end_date_f);
//         var dd = end_date.getDate();
//         var mm = end_date.getMonth();
//         var yr = end_date.getFullYear();
//         end_date1= new Date(yr,mm,dd);

//         var title = elem.title.replace("Night Out: ", "");

//         start_time= getDatesTimeParks( elem.start_date_f);
//         end_time= getDatesTimeParks( elem.end_date_f);
//         description=(elem.description).replace(']',"");

//         address=elem.address;

//       }
//       //if events are from chi summer calendar
//       else{
//         title=elem.title;

//         //split the dates into arrays that can be used later
//         var start_date_array=elem.start_date.split("/");
//         var end_date_array=elem.end_date.split("/");

//         //create javascript date objects from these arrays, subtracting 1 from the month (january is 0)
//         start_date1=new Date();
//         end_date1=new Date();
//         start_date1.setFullYear(2015, Number(start_date_array[0])-1, Number(start_date_array[2]));
//         end_date1.setFullYear(2015, Number(start_date_array[0])-1, Number(start_date_array[2]));
//         // start_date1=new Date(Number(start_date_array[2]), Number(start_date_array[0])-1, Number(start_date_array[1]))
//         // end_date1=new Date(Number(end_date_array[2]), Number(end_date_array[0])-1, Number(end_date_array[1]))

//         // these events coming from the calendar need to be geocoded, so for now we set lat lng as 0,0
//         lat=0;
//         lng=0;
//         source= "calendar";
//         console.log("calendar event",elem.title,start_date1)
//         tags=elem.tags;
//         start_time=elem.start_time;
//         end_time= elem.end_time;


//         //get in highschoolers tick marks
//         black1=elem.black1;
//         black2=elem.black2;
//         red1=elem.red1;
//         red2=elem.red2;
//         strike1=elem.strike1;
//         strike2=elem.strike2;



//         //location is now called address
//         address=elem.location;

//       }

//       Activities.insert({
//         title: title,
//         start_time: start_time,
//         end_time: end_time,
//         start_date: start_date1,
//         end_date: end_date1,
//         address: address,
//         description: description,
//         tags: tags,
//         source: source,
//         black1: black1,
//         black2: black2,
//         red1: red1,
//         red2: red2,
//         strike2: strike2,
//         strike1: strike1,
//         location: {
//               "type" : "Point",
//               "coordinates" : [ 
//                 lng, 
//                 lat
//               ]
//               }
//       });
//   } );
// }


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







