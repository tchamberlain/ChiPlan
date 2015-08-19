// Activities.find({source:"parks"}).forEach(    
//      function (event) {

//      	old_time=event.start_time;
//      	old_time=old_time.split(":");
//      	hour=parseInt(old_time[0]);
//      	hour+=5;
//      	new_time=hour+":"+old_time[1];
//      	Activities.update({_id: event._id},{$set:{start_time:new_time}},{multi:true});

//      })

// Activities.find({source:"parks"}).forEach(    
//      function (event) {

//      	old_time=event.end_time;
//      	old_time=old_time.split(":");
//      	hour=parseInt(old_time[0]);
//      	hour+=5;
//      	new_time=hour+":"+old_time[1];
//      	Activities.update({_id: event._id},{$set:{end_time:new_time}},{multi:true});

//      })

// Activities.find({source:"parks"}).forEach(    
//      function (event) {
   
//      	old_time=event.start_time;
//      		console.log(event.title,old_time);
//      	old_time=old_time.split(":");
//      	hour=parseInt(old_time[0]);
//      	if(hour==0){
//      		new_time="12:00 pm";
//      	}
//      	else if(hour>11){
//      		console.log('yes??')
//      		pm=true;
//      		new_time=(hour-12)+":"+old_time[1].substring(0,2)+"pm";
//      	}
//      	else{new_time=old_time;}
     	
//      	Activities.update({_id: event._id},{$set:{start_time:new_time}},{multi:true});

//      })





// Activities.find({source:"parks"}).forEach(    
//      function (event) {

//      	old_time=event.start_time;
//      	if((typeof old_time)=="string"){
// 	     	old_time=event.start_time;
// 	     	old_time=old_time.split(":");
// 	     	hour=parseInt(old_time[0]);
// 	     	if(hour==0){
// 	     		new_time="12:00 pm";
// 	     	}
// 	     	else if(hour>11){
// 	     		console.log('yes??')
// 	     		pm=true;
// 	     		new_time=(hour-12)+":"+old_time[1].substring(0,2)+"pm";
// 	     	}
// 	     	else{new_time=event.start_time;}
	     	
// 	     	Activities.update({_id: event._id},{$set:{start_time:new_time}},{multi:true});
// 	     }

//      })










