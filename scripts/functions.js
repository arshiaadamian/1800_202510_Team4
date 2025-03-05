function sendMessage(to_uid, from_uid, message) {
    let fromDocRef = db.collection("users").doc(from_uid);
    let toDocRef = db.collection("users").doc(to_uid);
    let msg_uid = from_uid + "-" + to_uid + "-" + firebase.firestore.FieldValue.serverTimestamp();
    db.collection("messages").doc(msg_uid).set({
        content: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        from_uid: from_uid,
        to_uid: to_uid
    }).then(() => {
        fromDocRef.update({
            sent_messages: firebase.firestore.FieldValue.arrayUnion(msg_uid)
        });
        toDocRef.update({
            received_messages: firebase.firestore.FieldValue.arrayUnion(msg_uid)
        });
    });
}
const storageRef = storage.ref();
function getUserPicture() {
    auth.onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            // Display the user's name
            console.log(user.uid);
            console.log(user.displayname);

            let imgs = document.querySelectorAll("#pfp");
            storageRef.child(`pfps/${user.uid}.png`).getDownloadURL()
                .then((url) => {
                    for (let img of imgs) {
                        img.src = url;
                        console.log("Tried to set the user's pfp");
                    }
                    
                }).catch((err) => {
                    if (err.code === 'storage/object-not-found') {
                        storageRef.child(`pfps/default.png`).getDownloadURL()
                            .then((url) => {
                                img.src = url;
                            });
                }});
        } else {
            // No user is signed in, go to the login page
            console.log("No user is signed in.");
            window.location.href = '/text/login.html';
        }
    });
}

getUserPicture();

