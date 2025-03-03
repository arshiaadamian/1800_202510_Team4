function getNameFromAuth() {
    auth.onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            // Display the user's name
            console.log(user.uid);
            console.log(user.displayname);
            let docRef = db.collection("users").doc(user.uid);
            docRef.get().then((doc => {
                let userName = doc.data().username;
                console.log(userName);
                document.getElementById('name-goes-here').innerText = userName;
            }));
        } else {
            // No user is signed in, go to the login page
            console.log("No user is signed in.");
            window.location.href = '/text/login.html';
        }
    });
}
getNameFromAuth();