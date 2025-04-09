let params = new URL(window.location.href);
const communityID = params.searchParams.get("communityID");
const messageTemplate = document.getElementById("message-template");
const meesagesDiv = document.querySelector("#message-div");

function populateCommunity() {
    if (!communityID) {
        window.location.href = "/text/your-communities.html";
        return;
    }
    let communityDocRef = db.collection("community").doc(communityID);
    const storageRef = storage
        .ref()
        .child(`community_pics/${communityID}`);

    storageRef.getDownloadURL().then(img => {
        document.querySelector(".community-picture").src = img;
        communityDocRef.get().then(communityDoc => {
            document.getElementById("title").innerHTML = communityDoc.data().name;
            populateCommunityMessages();
        });
    });

}

function populateCommunityMessages() {
    meesagesDiv.innerHTML = "";
    db.collection("community").doc(communityID).onSnapshot(communityDoc => {
        meesagesDiv.innerHTML = "";
        let messages = communityDoc.data().messages;
        messages.forEach(message => {
            let newMessage = messageTemplate.content.cloneNode(true);
            getUserPicture(message.from).then(img => {
                newMessage.querySelector(".user-picture").src = img;
                newMessage.querySelector(".message-content").innerHTML = message.content;
                newMessage.querySelector(".time-ago").innerHTML = getTimeAgo(Date.now() - message.timestamp.toDate().valueOf());

                db.collection("users").doc(message.from).get().then(userDoc => {
                    newMessage.querySelector(".user-name").innerHTML = userDoc.data().username;
                    newMessage.querySelector(".user-name").addEventListener("click", event => {
                        event.preventDefault();
                        if (message.from == auth.currentUser.uid) { return; }

                        let newClick = document.querySelector(".click-user");
                        newClick.querySelector(".username").innerHTML = userDoc.data().username;
                        newClick.querySelector(".user-img").src = img;
                        newClick.querySelector(".messageInput").addEventListener("keypress", (keyEvent) => {
                            let key = keyEvent.code;
                            if (key === "Enter") {
                                keyEvent.preventDefault();
                                let id = message.from;
                                if (id) {
                                    console.log(id);
                                    msg_id = sendMessage(id, messageArea.value);
                                    newClick.querySelector(".messageInput").value = "";
                                    newClick.style.display = "none";
                                }
                            }
                        });
                        newClick.querySelector(".sendMessage").addEventListener("click", (clickEvent) => {
                            clickEvent.preventDefault();
                            let id = message.from;
                            if (id) {
                                msg_id = sendMessage(id, messageArea.value);
                                newClick.querySelector(".messageInput").value = "";
                                newClick.style.display = "none";
                            }
                        });
                        newClick.style.display = "";
                        let xPos = (event.clientX - newClick.offsetLeft - newClick.offsetWidth / 2);
                        let yPos = (event.clientY - newClick.offsetTop - newClick.offsetHeight / 2);
                        newClick.style.transform = `translate(${xPos}px, ${yPos}px)`;
                    });
                    meesagesDiv.appendChild(newMessage);
                });
            });

        });
    });
}
populateCommunity();

function sendCommunityMessage(content) {
    if (!communityID) { return; }
    let communityDocRef = db.collection("community").doc(communityID);
    communityDocRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            from: auth.currentUser.uid,
            content: content,
            timestamp: new Date(),
            replies: []
        })
    });
}

const messageArea = document.querySelector(".form-control");
messageArea.addEventListener("keypress", event => {
    let key = event.code;
    if (key === "Enter") {
        event.preventDefault();
        sendCommunityMessage(messageArea.value);
        messageArea.value = "";
    }
});

const shareBtn = document.getElementById("share");
shareBtn.addEventListener("click", event => {
    console.log("Click");
    event.preventDefault();
    sendCommunityMessage(messageArea.value);
    messageArea.value = "";
});

const leaveCom = document.querySelector(".leave-com");
leaveCom.addEventListener("click", event => {
    event.preventDefault();
    db.collection("users").doc(auth.currentUser.uid).update({
        communities: firebase.firestore.FieldValue.arrayRemove(communityID)
    }).then(() => {
        db.collection("community").doc(communityID).update({
            members: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
        }).then(() => {
            window.location.href = "/text/your-communities.html";
        }); 
    });
});