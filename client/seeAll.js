
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