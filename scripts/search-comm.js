const maxDisplayedComms = 6;

function displayCardsDynamically(collection) {
    let figureTemplate = document.getElementById("communityTemplate");

    db.collection(collection).get()
        .then(allCommunity => {
            displayedComms = 0;
            allCommunity.forEach(doc => { //iterate thru each doc
                displayedComms++;
                if (displayedComms > maxDisplayedComms) { return; }
                var title = doc.data().name;       // get value of the "name" key 
                var members = doc.data().members;
                var detail = doc.data().detail;
                let newFigure = figureTemplate.content.cloneNode(true);

                //update title and text and image
                newFigure.querySelector('.figure-title').innerHTML = title;
                newFigure.querySelector('.figure-members').innerHTML = members.length + " Members Joined.";
                if (!detail) { detail = "No description provided"; }
                newFigure.querySelector('.figure-details').innerHTML = "Description: " + detail;
                let storageRef = storage.ref('community_pics/' + doc.id);
                storageRef.getDownloadURL().then(img => {
                    newFigure.querySelector('.com-img').src = img;
                    document.getElementById(collection + "-go-here").appendChild(newFigure);

                });

            });
        });
}

displayCardsDynamically("community");

<<<<<<< HEAD
var currentUser;
var currentCommunity;
function updateCommunity() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            currentUser = db.collection("users").doc(user.uid)
            currentCommunity = db.collection("community").doc(user.uid);
            currentUser.get()
                .then(userDoc => {
                    let community = userDoc.data().communities;
            currentCommunity.get();
                });
            } else {
                // No user is signed in.
                console.log ("No user is signed in");
            }
        });
    }
=======
>>>>>>> 5f985ef76ad5da7e02c4755467464f9b16df8202
