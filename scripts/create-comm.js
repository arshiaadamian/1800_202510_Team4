var currentUser;
var communityImg;
const submitForm = document.getElementById("submitter");
const fileUpload = document.getElementById("banners");

fileUpload.addEventListener("change", (event) => {
    communityImg = event.target.files[0];
});

submitForm.addEventListener("click", event => {

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
        }).then((doc) => {
            let storageRef = storage.ref("community_pics/" + doc.id);
            if (!communityImg) {
                fetch("./images/default.png").then(((img) => {
                    storageRef.put(img).then(() => {
                        window.location.href = "community1.html";
                    });
                    
                }));
            } else {
                storageRef.put(communityImg).then(() => {
                    window.location.href = "community1.html";
                });
                
            }
        });
    } else {
        console.log("user has not logged in.");
    }
    });
})
