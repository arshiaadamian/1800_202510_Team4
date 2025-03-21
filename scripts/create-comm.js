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
    var userDoc = db.collection("users").doc(user.uid);
    var userID = user.uid;
    firebase.auth().onAuthStateChanged(user => {

    if (user) {
        communityRef.add({
            code: 'I2',
            userID: userID,
            name: name,
            detail: detail,
            location: "North America",
            members: [userID],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            messages: []
        }).then((doc) => {
            let storageRef = storage.ref("community_pics/" + doc.id);
            if (!communityImg) {
                fetch("/images/default.png").then(((requestFile) => {
                    requestFile.blob().then(img => {
                        console.log(img)
                        storageRef.put(img).then(() => {
                            userDoc.update({
                                communities: firebase.firestore.FieldValue.arrayUnion(doc.id)
                            });
                            //window.location.href = `community.html?communityID=${doc.id}`;
                        });
                    });
                    
                    
                }));
            } else {
                storageRef.put(communityImg).then(() => {
                    userDoc.update({
                            communities: firebase.firestore.FieldValue.arrayUnion(doc.id)
                        });
                        console.log(communityImg);
                        //window.location.href = `community.html?communityID=${doc.id}`;
                });
                
            }
        });
    } else {
        console.log("user has not logged in.");
    }
    });
})
