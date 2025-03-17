async function sendMessage(to_uid, message) {
    let user = auth.currentUser;
    let userList = [to_uid, user.uid].sort();
    let docID = userList[0] + userList[1];
    let docRef = db.collection("messages").doc(docID);

    docRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            from: user.uid,
            content: message,
            timestamp: new Date()
        })
    });
}

const searchButton = document.getElementById("searchButton");
const searchTxt = document.getElementById("searchTxt");
const cardTemplate = document.getElementById("user-card");
const cardLocation = document.getElementById("user-cards");
const usersLocation = document.querySelector(".users");
const userTemplate = document.querySelector(".user-template");
async function populateFriends() {
    auth.onAuthStateChanged(async (user) => {
        let userID = user.uid;
        db.collection("users").doc(userID).onSnapshot(async (userDoc) => {
            let messageRooms = userDoc.data().messageRooms;
            usersLocation.innerHTML = "";
            messageRooms.forEach(async (roomID) => {
                let roomDoc = await db.collection("messages").doc(roomID).get();
                let roomUsers = roomDoc.data().users;
                let friends = roomUsers.filter((user) => { return user != userID });
                friends.forEach(async (friend) => {
                    let newUser = userTemplate.content.cloneNode(true);
                    let friendDoc = await db.collection("users").doc(friend).get();
                    let img = await getUserPicture(friend);
                    newUser.querySelector(".name").innerHTML = friendDoc.data().username;
                    newUser.querySelector(".name").id = friend;
                    newUser.querySelector(".pfp").src = img;
                    let messages = roomDoc.data().messages.sort((a, b) => {
                        return a.timestamp.toDate().valueOf() - b.timestamp.toDate().valueOf();
                    });
                    let curDate = new Date();
                    if (messages.length > 0) {
                        curDate = messages[0].timestamp.toDate();
                    }
                    // let curDate = new Date();
                    newUser.querySelector(".time").innerHTML = curDate.toLocaleString().split(",")[0];
                    newUser.querySelector(".person-click").addEventListener("click", () => populateMessages(friend));
                    usersLocation.insertBefore(newUser, usersLocation.firstChild);
                    await populateMessages(friend);
                    
                });
                
            });
        });

    });

}

const messagesDiv = document.getElementById("messages");
const messageLeftTemplate = document.getElementById("chat-message-left-template");
const messageRightTemplate = document.getElementById("chat-message-right-template");
const toUsername = document.getElementById("to-username");
const toID = document.querySelector(".send-id");
async function populateMessages(otherUserID) {
    toID.id = otherUserID;

    auth.onAuthStateChanged(async (thisUser) => {
        let otherDoc = await db.collection("users").doc(otherUserID).get();
        let thisDoc = await db.collection("users").doc(thisUser.uid).get();
        let thisImg = await getUserPicture(thisUser.uid);
        let otherImg = await getUserPicture(otherUserID);

        toUsername.innerHTML = otherDoc.data().username;
        messageRooms = thisDoc.data().messageRooms;
        messageRooms.forEach(roomID => {
            let roomRef = db.collection("messages").doc(roomID);
            roomRef.onSnapshot((roomDoc) => {
                
                if (roomDoc.id.includes(otherUserID)) {
                    messagesDiv.innerHTML = "";
                    let messages = roomDoc.data().messages.sort((a, b) => {
                        return a.timestamp.toDate().valueOf() - b.timestamp.toDate().valueOf();
                    });
                    
                    console.log(roomDoc.id, roomDoc.data(), messages.length);
                    messages.forEach(message => {
                        let newMessage;
                        let img;
    
                        if (message.from_uid == otherUserID) {
                            newMessage = messageLeftTemplate.content.cloneNode(true);
                            img = otherImg;
                            newMessage.querySelector(".chat-name").innerHTML = otherDoc.data().username;
                        } else {
                            newMessage = messageRightTemplate.content.cloneNode(true);
                            img = thisImg;
                            newMessage.querySelector(".chat-name").innerHTML = thisDoc.data().username;
                        }
                        newMessage.querySelector(".chat-picture").src = img;
                        newMessage.querySelector(".chat-hour").innerHTML = message.timestamp.toDate().toLocaleTimeString();
                        newMessage.querySelector(".chat-text").innerHTML = message.content;
                        messagesDiv.appendChild(newMessage);
                    });
                }
                
            })
            db.collection("messages").doc(roomID).update({});

        });
        
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
                                friends: firebase.firestore.FieldValue.arrayUnion({ id: card.id, lastMessage: new Date() }),
                            }).then(() => {
                                cardLocation.innerHTML = "";
                                let users = [auth.currentUser.uid, card.id].sort();
                                let docID = users[0] + users[1];
                                db.collection("messages").doc(docID).set({
                                    users: users,
                                    messages: []
                                });
                                db.collection("users").doc(curUser.uid).update({
                                    messageRooms: firebase.firestore.FieldValue.arrayUnion(docID)
                                });
                                db.collection("users").doc(card.id).update({
                                    messageRooms: firebase.firestore.FieldValue.arrayUnion(docID)
                                });
                            });
                        });
                    });
                });
            });

        });
        searchTxt.value = "";
    });

});

const messageArea = document.getElementById("message-area");
messageArea.addEventListener("keypress", (event) => {
    let key = event.code;
    if (key === "Enter") {
        event.preventDefault();
        let id = toID.id;
        if (id) {
            msg_id = sendMessage(id, messageArea.value);
        }
        messageArea.value = "";
    }
});

populateFriends();