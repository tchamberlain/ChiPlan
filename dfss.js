
Activities = new Mongo.Collection('activities');


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
Router.route('/confirm');
Router.route('/seeAll');
Router.configure({
  layoutTemplate: 'main'
});
Router.route('/dashboard');


//*************************
//CLIENT STUFF
//*************************
if (Meteor.isClient) {

  Template.swipe.helpers({
    'set_up_act_list': function(){
        category=Session.get('category' )
        //if the category is "surpiseme", get all activities, if  not, get just the specified type of act.
        if(category=="surpriseme"){
          var total= Activities.find( {} ).count();
          act_list=Activities.find( {} ).fetch();
        }
        else{
          var total= Activities.find( { tags: category } ).count();
          act_list=Activities.find( { tags: category } ).fetch();
          console.log(act_list)
        }
        //creates an array of the id's of all activities
        id_list=[]
        for (var i = 0; i < total; i++) {
          id_list[i]=act_list[i]._id;
        }
        //gets the very first element in the list, sets it as the current activity
        current_act= Activities.findOne(id_list[activity_index])
        Session.set('current_act_list',act_list)
        Session.set('current_activity',current_act)
        }
    });

  Template.display_activity.helpers({
    'current_activity': function(){
          return Session.get('current_activity') 
        }
  });

  Template.display_activity_info.helpers({
    'current_activity': function(){
          return Session.get('current_activity') 
        }
  });



  Template.swipe.events({
    'click .nexter': function(){
        //increment index, so when funciton is called again, you retrieve subsequent activity
         activity_index+=1;
        //get current id, or id  of next activity
        current_id=id_list[activity_index];
        //get activity corresponds to current_id
        current_act= Activities.findOne(current_id)
        Session.set('current_activity', current_act);

      }
  });

  Template.home.helpers({
    'set_act_index': function(category){
    activity_index=0
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
    'click .activity': function(){
      var actId = this._id;
      //set surrent act
      current_act= Activities.findOne(actId)
      Session.set('current_activity', current_act);
      //route you to confirm 
      Router.go('confirm');
    }
  });

  Template.confirm.events({
    'click .favorite': function(){
      current_act=Session.get('current_activity')
      console.log(current_act.name)
      Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}})
  }
 });

  Deps.autorun(function(){
    Meteor.subscribe('userData');
});

}


//*************************
//SERVER STUFF
//*************************
if (Meteor.isServer) {
  //Meteor.startup(function () {

    Activities.remove({});

    Activities.insert({
      name: "Movie",
      time: "7:00 pm",
      location:"Harper Theater",
      description: "watch a movie",
      tags:["stayin","entertainment"]

    });

    Activities.insert({
      name: "painting class",
      location:"Hyde Park Arts center",
      time: new Date(),
      description: "Free oil painting class",
      tags:[ "art"]

    });

      Activities.insert({
      name: "Go rollerskating",
      time: new Date(),
      location:"roller rink",
      description: "roller  skate",
      tags:["sports"]

    });

      Activities.insert({
      name: "Museum",
      time: new Date(),
      location:" The Loop",
      description: "paintings n shit",
      tags:["art"]

    });

  Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};

    if (options.profile)
       user.profile = options.profile;

    //attempt to add favorites section
     _.extend(user.profile, { favorites : [] });
    return user;

  });

Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    profile: 1,
  }});
});



}
