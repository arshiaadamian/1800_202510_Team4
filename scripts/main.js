function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            // Do something for the currently logged-in user here
            console.log(user.uid);
            console.log(user.displayName)
            userName = user.displayName;

            $('#name-goes-here').text(userName);
        } else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
}
getNameFromAuth();