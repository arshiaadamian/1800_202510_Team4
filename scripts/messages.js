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