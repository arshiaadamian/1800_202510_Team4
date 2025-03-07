function sendMessage(from_uid, to_uid, message) {
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

const searchButton = document.getElementById("searchButton");
const searchTxt = document.getElementById("searchTxt");
const cardTemplate = document.getElementById("user-card");
const cardLocation = document.getElementById("user-cards");
searchButton.addEventListener("click", (event) => {
    cardLocation.innerHTML = "";
    let userCard = cardTemplate.content.cloneNode(true);
    let users = db.collection("users");
    let query = users.where("username", "==", searchTxt.value);
    query.get().then((result) => {
        result.forEach((user) => {
            let userData = user.data();
            getUserPicture(user.id).then((img) => {
                userCard.querySelector(".pfp").src = img;
                userCard.querySelector("#username-goes-here").innerHTML = userData.username;
                userCard.querySelector("#description-goes-here").innerHTML = userData.description;
                cardLocation.appendChild(userCard);
            });
        });
        searchTxt.value = "";
    });

});
console.log("Loaded messages");