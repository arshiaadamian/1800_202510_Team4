function getNameFromAuth() {
    auth.onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            // Do something for the currently logged-in user here
            console.log(user.uid);
            console.log(user.displayName)
            let docRef = db.collection("users").doc(user.uid);
            let userName;
            docRef.get().then((doc => {
                userName = doc.data().username;
                console.log(userName);
                document.getElementById('name-goes-here').innerText = userName;
            }))
            
            
        } else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
}
getNameFromAuth();