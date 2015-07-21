
// //*************************
// //ROUTER STUFF
// //*************************
// Router.route('/', function(){
//   this.render('home');
// },{
//   name: 'home'
// });


// Router.route('/entertainment', {
//     name: 'entertainment',
//     data: function(){
//       if(!Session.get('current_activity')){
//         //then call the act function
//       }
//       random_function();
//       act_list=Session.get('current_act_list')
//       current_act=Session.get('current_activity')
//         return {
//             dontneedthis: current_act
//         };
//       }
//     });


// // Router.route('/entertainment');
// Router.route('/sports');
// Router.route('/art');
// Router.route('/stayin');
// Router.route('/surpriseme');
// Router.route('/seeAll');
// Router.configure({
//   layoutTemplate: 'main'
// });
// Router.route('/dashboard');
// Router.route('/actInfo/:_id/share', {
//     name: 'share',
//     data: function(){
//       current_act=Activities.findOne(this.params._id)
//      Session.set('current_activity',current_act )
//         return {
//             chosen_activity: current_act
//         };
//       }
//     });


// Router.route('/actInfo/:_id', {
//     name: 'actInfo',
//     data: function(){
//       console.log(this.params._id)
//         return {
//             chosen_activity: Activities.findOne(this.params._id)
//         };
//       }
//     });


// Router.route('/events/:category/:date/:distance', {
//     name: 'eventsTemp',
//     data: function(){
//       console.log(this.params.category)
//       console.log(this.params.date)
//       console.log(this.params.distance)
//       //if the page is refreshed, recreate the activity list
//        if(!Session.get('current_activity')){
//           set_up_act_list(this.params.category, this.params.date, this.params.distance);
//        }
//         return {
//             category:  this.params.category

//         };
//       }
//     });

