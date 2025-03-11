var currentUser;

var currentUser;               //points to the document of the user who is logged in
function populateCommunityInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {

                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("Community").collection("owned_userid").doc(user.uid)
                    //get the document for current user.
                    currentUser.add()
                        .then(userDoc => {
                            //get the data fields of the user
                            let communityName = userDoc.data().name;
                            let communityDetails = userDoc.data().details;
                            let communityLogo = userDoc.data().code;
                            let communityUser = user.uid;

                            //if the data fields are not empty, then write them in to the form.
                            if (communityName != null) {
                                document.getElementById("nameInput").value = communityName;
                            }
                            if (communityDetails != null) {
                                document.getElementById("detailInput").value = communityDetails;
                            }
                            if (communityLogo != null) {
                                document.getElementById("logoInput").value = communityLogo;
                            }
                            if (communityUser != null) {
                                document.getElementById("logoInput").value = communityUser;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateCommunityInfo();