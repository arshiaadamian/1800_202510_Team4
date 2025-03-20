let params = new URL(window.location.href);
const communityID = params.searchParams.get("communityID");
const messageTemplate = document.getElementById("message-template");
const meesagesDiv = document.querySelector("#message-div");

function populateCommunity() {
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
                db.collection("users").doc(message.from).get().then(userDoc => {
                    newMessage.querySelector(".user-name").innerHTML = userDoc.data().username;
                    meesagesDiv.appendChild(newMessage);
                })
            });

        });
    });
}
populateCommunity();