

Router.route('/seeAll/:category/:date/:distance', {
   name: 'seeAll',
    data: function(){

        },

        waitOn: function(){
           //set parameters as session variables to use in share page 
           Session.set('dist_param',this.params.distance);
           Session.set('date_param',this.params.date);
           Session.set('category_param',this.params.category);
          return Meteor.subscribe('events_query', [this.params.category, this.params.date, this.params.distance]);
    }
    });


//want to get user's favorites and non-favorites only at the begining of the session
Template.seeAll.onRendered( function(){
        // if(Session.get('activity_list')==null){
        //    create_act_list(1);
        // }
        create_act_list(1);
       activity_list=Session.get('activity_list');


    if(Meteor.user()){
          //get the user's favorites and discards in a list
          discard_ids=get_list_of_ids(Meteor.user().profile.discards);
          favorite_ids=get_list_of_ids(Meteor.user().profile.favorites);
          console.log("favorite_ids.count",favorite_ids.length);
          console.log("discard_ids.count",discard_ids.length);


          //get the favorites, discards, and unseens that are in the current activity list
          discard_list=get_objects_on_list(activity_list, discard_ids);
          favorite_list= get_objects_on_list(activity_list,favorite_ids);

          //returns ids missing from favorites and discards
          console.log(activity_list.length);
          unseen_list= get_objects_off_list(activity_list, favorite_ids);
                    console.log("unseen_list",unseen_list.length);

          unseen_list= get_objects_off_list(unseen_list, discard_ids);
                    console.log("unseen_list",unseen_list.length);
                     console.log("unseen_list",unseen_list);


          Session.set('unseen_list',unseen_list);
          Session.set('favorite_list',favorite_list);
          Session.set('discard_list',discard_list);


      }
      else {
        unseen_list=activity_ids;
        Session.set('unseen_list',unseen_list);

      }
    
  }
  );
  


  Template.seeAll.helpers({
  'get_act_list': function(category){
      return Session.get('current_act_list');
  },

    'get_favorites': function(category){
      return (Session.get('favorite_list'));
  },
    'get_discards': function(category){
      return (Session.get('discard_list'));
  },
    'get_unseens': function(category){
      return (Session.get('unseen_list'));
  },

 });


  Template.seeAll.events({ 
    'click #activity': function(){
       the_id= this._id;
      Router.go('actInfo',{_id: the_id, button_info:[is_discard(the_id),is_favorite(the_id)]} );
    },

        'click #back': function(){
       the_id= this._id;
      params=Router.current().params;
      category=params.category;
      distance=params.distance;
      date=params.date;
      Router.go('eventsTemp',{category:category,date:date,distance: distance})

    },

       'click #icon_label': function(){
        console.log('you clicked the icon');
        if( Meteor.user()){
          current_act=this;
          act_id=this._id;

          //if its a favorite, make it a discard
          if(is_favorite(act_id)){
        
            //removing this activity from the array of favorite objects
            favorite_list=remove_object(act_id,favorite_list);
            Session.set('favorite_list', favorite_list);

            //add it to the discards list
            discard_list[discard_list.length]=current_act;
            Session.set('discard_list', discard_list);

            //update the users profile
            Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.favorites":current_act}});
            Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.discards":current_act}});
       }
      
          //if its a discard or an unseen, make it a favorite
          else{
              //removing this activity from the array of discarded and unseen objects
              discard_list=remove_object(act_id,discard_list);
              unseen_list=remove_object(act_id,unseen_list);
              Session.set('discard_list', discard_list);
              Session.set('unseen_list', unseen_list);
              console.log('unseen_list length in icon',unseen_list.length)

             //add it to the favorites list
             favorite_list[favorite_list.length]=current_act;
             Session.set('favorite_list', favorite_list);

              //update the users profile
              Meteor.users.update({_id:Meteor.user()._id}, {$pull:{"profile.discards":current_act}});
              Meteor.users.update({_id:Meteor.user()._id}, {$addToSet:{"profile.favorites":current_act}});
         }
      }
    }


  });


// functions
get_missing_ids = function(our_list,comp_list){
  for(i=0;i<our_list; i++){
    //if this item from our list is in our comparison list, take it out of our list
    if(comp_list.indexOf(our_list[i])>-1){
      our_list.splice(i,1);
    }
  }
  return our_list;
};

get_shared_ids = function(our_list,comp_list){
  for(i=0;i<our_list; i++){
    //if this item from our list is NOT in our comparison list, take it out of our list
    if(comp_list.indexOf(our_list[i])==-1){
      our_list.splice(i,1);
    }
  }
  return our_list;
};



// CHECK IF THIS WORKS
get_objects_off_list = function(our_objs,comp_list){
  new_list=[];
  for(i=0;i<our_objs.length; i++){
    //if this item from our list not in our comp list, then add it
    if(comp_list.indexOf(our_objs[i]._id)==-1){
      new_list.push(our_objs[i]);

    }

  }
  return new_list;
};

get_objects_on_list = function(our_objs,comp_list){
    new_list=[];
  for(i=0;i<our_objs.length; i++){
    //if this item from our list is on in our comparison list, put it in the new list
    if((comp_list.indexOf(our_objs[i]._id))>-1){
      new_list.push(our_objs[i]);
    }
  }
  return new_list;
};

//removes an object from a list, given its id and the list
remove_object = function(id,object_list){
    for(i=0;i<object_list.length;i++){
      if(object_list[i]._id==id){
        break;

      }

    }
    object_list.splice(i,1);
    return object_list;

}

function is_discard(act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.discards._id':act_id}).count()){
      return 1;
    }
    else{
      return 0;
    }
  };

function is_favorite (act_id){
    user_id=Meteor.user()._id;
    if(Meteor.users.find({_id:user_id, 'profile.favorites._id':act_id}).count()){
      return 1;
    }
   
    else{
    return 0;
    }
  };

