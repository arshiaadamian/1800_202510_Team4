function sendMessage(to_uid, message) {
    auth.onAuthStateChanged((user) => {
        let fromDocRef = db.collection("users").doc(user.uid);
        let toDocRef = db.collection("users").doc(to_uid);
        let msg_uid = user.uid + "-" + to_uid + "-" + new Date().toLocaleString();
        db.collection("messages").doc(msg_uid).set({
            content: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            from_uid: user.uid,
            to_uid: to_uid
        }).then(() => {
            fromDocRef.update({
                sent_messages: firebase.firestore.FieldValue.arrayUnion(msg_uid)
            });
            toDocRef.update({
                received_messages: firebase.firestore.FieldValue.arrayUnion(msg_uid)
            });
            populateMessages(to_uid);
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
                        newUser.querySelector(".name").id = friend;
                        newUser.querySelector(".pfp").src = img;
                        let curDate = new Date();
                        newUser.querySelector(".time").innerHTML = curDate.toLocaleString().split(",")[0];
                        newUser.querySelector(".person-click").addEventListener("click", () => populateMessages(friend));
                        usersLocation.insertBefore(newUser, usersLocation.firstChild);
                    });
                });
            });
        });
    });
}

const messagesDiv = document.getElementById("messages");
const messageLeftTemplate = document.getElementById("chat-message-left-template");
const messageRightTemplate = document.getElementById("chat-message-right-template");
const toUsername = document.getElementById("to-username");
async function populateMessages(otherUserID) {
    
    messagesDiv.innerHTML = "";
    auth.onAuthStateChanged(async (thisUser) => {
        let messages = [];
        let messagesDoc = db.collection("messages").orderBy("timestamp", "asc");
        let sentQuery = messagesDoc.where("from_uid", "==", thisUser.uid).where("to_uid", "==", otherUserID);
        let sentResult = await sentQuery.get();

        sentResult.forEach((messageDoc) => {
            messages.push(messageDoc.data());
        });

        let receivedQuery = messagesDoc.where("from_uid", "==", otherUserID).where("to_uid", "==", thisUser.uid);
        let receivedResult = await receivedQuery.get();
        receivedResult.forEach((message) => {
            messages.push(message.data());
        })
        messages.sort((a, b) => {
            return a.timestamp.toDate().valueOf() - b.timestamp.toDate().valueOf();
        });

        let otherDoc = await db.collection("users").doc(otherUserID).get();
        let thisDoc = await db.collection("users").doc(thisUser.uid).get();
        toUsername.innerHTML = otherDoc.username;

        let thisImg = await getUserPicture(thisUser.uid);
        let otherImg = await getUserPicture(otherUserID);

        for (let messageData of messages) {
            let message;
            let img;

            if (messageData.from_uid == otherUserID) {
                message = messageLeftTemplate.content.cloneNode(true);
                img = otherImg;
                message.querySelector(".chat-name").innerHTML = otherDoc.data().username;
            } else {
                message = messageRightTemplate.content.cloneNode(true);
                img = thisImg;
                message.querySelector(".chat-name").innerHTML = thisDoc.data().username;
            }
            message.querySelector(".chat-picture").src = img;
            message.querySelector(".chat-hour").innerHTML = messageData.timestamp.toDate().toLocaleTimeString();
            message.querySelector(".chat-text").innerHTML = messageData.content;
            messagesDiv.appendChild(message);
        }
    });
}

searchTxt.addEventListener("change", (event) => {
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