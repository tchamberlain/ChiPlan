//should also prolly make a modal to confirm
//make accept button insert event
//upon accept event, geocode before you insert

Router.route('/createEvent', {
    name: 'createEvent',
        waitOn: function(){
            return [Meteor.subscribe('get_all_invites'),Meteor.subscribe('get_admin')];
        }
        
    });


Template.createEvent.onRendered(function(){
    $('.ui.dropdown')
    .dropdown();
});


Template.createEvent.events({

	'click #submit': function(evt, template){
		console.log("clicked submit");
 		var title = template.find(".title").value;
 		var start_date = template.find(".start_date").value;
 		var end_date = template.find(".end_date").value;
 		var start_time = template.find(".start_time").value;
 		var end_time = template.find(".end_time").value;
 		var description = template.find(".description").value;
 		var address = template.find(".address").value;

 		var eventObject={
 			title:title,
 			start_date:start_date,
 			end_date:end_date,
 			start_time:start_time,
 			end_time:end_time,
 			description: description,
 			address: address,
 			source: "userCreated",
 			tags: [],
 			location: {
              "type" : "Point",
              "coordinates" : [ 
                0, 
                0
              ]
              }
 		}

    inviter=Meteor.user();
    invite_activity= eventObject;

     var admin_id=Meteor.users.find({'profile.name':"admin admin"}).fetch()[0]._id;
    //were gonna add an invite to the admin 
        //if the user has already been invited to something, we will do an update of their doc
    if (Invites.findOne(admin_id)){
        Invites.update({_id: admin_id}, {$addToSet: {activity_inviter: {activity:invite_activity, inviter:inviter}}});
    }

    //currently using extra colllection for this(since client side cant update users --- not sure if necessary, 
    //also not sure if a bad sercurity issue in future....
    else{
      Invites.insert({
        _id: admin_id,
        activity_inviter: [{activity:invite_activity, inviter:inviter }]
      });
    }
 		// then if admnin, well add an accept button in admin dashboard which adds teh activity to the event
 		alert("Thanks for creating an event! Your event will be reviewed and added to the website shortly");
 	}
});



Template.createEvent.helpers({
  'get_days':function(){
    days=[];
      for(i=1;i<32;i++){
        day=i;
        days[i]={day:i};
      }
    return days;
  },
    'get_month':function(){
    months=[];
      for(i=1;i<12;i++){
        months[i]=i;
      }
    return months;
  },
  'get_year':function(){
    years=[2015,2016];
    return months;
  }


});



