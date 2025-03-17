var currentUser
function writeCommunityInfo() {

    event.preventDefault(); // Prevent page refresh
    var name = document.getElementById("name").value;
    var detail = document.getElementById("details").value;
    var communityRef = db.collection("community");
    var user = firebase.auth().currentUser;
    var currentUser = db.collection("users").doc(user.uid);
    var userID = user.uid;
    firebase.auth().onAuthStateChanged(user => {

    if (user) {
        communityRef.add({
            code: 'I2',
            userID: userID,
            name: name,
            detail: detail,
            location: "North America",
            members: 1,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "community1.html"; // Redirect to the thanks page
        });
    } else {
        console.log("user has not logged in.");
    }
    });
}

writeCommunityInfo();