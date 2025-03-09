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
const usersLocation = document.querySelector(".users");
const userTemplate = document.querySelector(".user-template");
function populateFriends() {
    auth.onAuthStateChanged((user) => {
        console.log(user.uid);
        usersLocation.innerHTML = "";
        userDoc = db.collection("users").doc(user.uid).get().then((doc) => {
            friends = doc.data().friends;
            friends.forEach((friend) => {
                db.collection("users").doc(friend).get().then((friendDoc) => {
                    let friendData = friendDoc.data();
                    let newUser = userTemplate.content.cloneNode(true);
                    getUserPicture(friend).then((img) => {
                    newUser.querySelector(".name").innerHTML = friendData.username;
                    newUser.querySelector(".pfp").src = img;
                    let curDate = new Date();
                    newUser.querySelector(".time").innerHTML = curDate.toLocaleString().split(",")[0];
                    usersLocation.insertBefore(newUser, usersLocation.firstChild);
                    });
                });
            });
        });
    });
}



searchButton.addEventListener("click", (event) => {
    cardLocation.innerHTML = "";
    let userCard = cardTemplate.content.cloneNode(true);
    let users = db.collection("users");
    let query = users.where("username", "==", searchTxt.value);
    query.get().then((result) => {
        result.forEach((user) => {
            let userData = user.data();
            getUserPicture(user.id).then((img) => {
                userCard.querySelector("#id-goes-here").id = user.id;
                userCard.querySelector(".pfp").src = img;
                userCard.querySelector("#username-goes-here").innerHTML = userData.username;
                userCard.querySelector("#description-goes-here").innerHTML = userData.description;
                cardLocation.appendChild(userCard);

            }).then(() => {
                document.querySelectorAll(".search-card").forEach((card) => {
                    card.addEventListener("click", (e) => {
                        auth.onAuthStateChanged((curUser) => {
                            db.collection("users").doc(curUser.uid).update({
                                friends: firebase.firestore.FieldValue.arrayUnion(card.id)
                            }).then(() => {
                                cardLocation.innerHTML = "";
                                populateFriends();
                            });
                        });
                    });
                });
            });

        });
        searchTxt.value = "";
    });

});

populateFriends();