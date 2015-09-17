//meteor methods


//adds an invite to a user's profile


Meteor.methods({
    'sendInvite': function(inviter,invitee,activity){
        var invite= {};
        invite.invitee=invitee;
        invite.inviter=inviter;
        invite.activity=activity;
        console.log('weve entered send invite');

        //add invite to inviter's profile
        //if they do not have a sent invitations list, add it
        if(!inviter.profile.sentInvitations){
        	console.log('did ya make it into sentInvitations',inviter._id, invitee._id);
        	//update this user
        	Meteor.users.update({_id: inviter._id}, {$set: {'profile.sentInvitations': [invite]}});
        }
        else{
        	Meteor.users.update({_id: inviter._id}, {$addToSet: {'profile.sentInvitations': invite}});
        }

        //add invite to invitee's profile
        if(!invitee.profile.invitations||invitee.profile.invitations.length==0){
        	//update this user
        	Meteor.users.update({_id: invitee._id}, {$set: {'profile.invitations': [invite]}});
        	 // console.log('inside first if..?',invitee.profile);
        	 //  console.log('inside first if..?',invitee);

        }
        else{
        	Meteor.users.update({_id: invitee._id}, {$addToSet: {'profile.invitations': invite}});
        }

        //console.log('invitee profile',invitee.profile.invitations);

    }
});