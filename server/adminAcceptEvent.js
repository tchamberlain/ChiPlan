Meteor.methods({
    
	 'acceptEvent': function(newEvent){
        //geocode this shit

        lat=0;
        lng=0;

		Activities.insert({
			title: newEvent.title,
			start_time: newEvent.start_time,
			end_time: newEvent.end_time,
			start_date: newEvent.start_date,
			end_date: newEvent.end_date,
			address: newEvent.address,
			description: newEvent.description,
			tags: newEvent.tags,
			source: "userInput",
			black1: 0,
			black2: 0,
			red1: 0,
			red2: 0,
			strike2: 0,
			strike1: 0,
			location: {
			    "type" : "Point",
			    "coordinates" : [ 
			      lng, 
			      lat
			    ]
			    }
		});


        console.log("Hello world, you've accepted this event!!! goooo job");
    }



});