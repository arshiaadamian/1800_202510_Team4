const storageRef = storage.ref();
async function getUserPicture(user_uid) {
    let url = await storageRef.child(`pfps/${user_uid}.png`).getDownloadURL();
    return url;
}

function setUserPicture() {
    auth.onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            // Display the user's name
            console.log(user.uid);
            console.log(user.displayname);
            let imgs = document.querySelectorAll("#pfp");
            getUserPicture(user.uid).then((url) => {
                imgs.forEach(img => {
                    img.setAttribute("src", url);
                });
            });
        } else {
            console.log("Not logged in, redirecting");
            window.location.href = "/text/login.html"
        }


    });
}

setUserPicture();
