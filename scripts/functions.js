const storageRef = storage.ref();
async function getUserPicture(user_uid) {
    let url = await storageRef.child(`pfps/${user_uid}.png`).getDownloadURL();
    return url;
}
function loadNavbar() {
    fetch("/text/navbar.html").then(navbar => {
        navbar.text().then(navHtml => {
            document.querySelector(".custom-navbar").innerHTML = navHtml;
            setUserPicture();
        });

    });
}
loadNavbar();

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
                    console.log(url);
                    img.setAttribute("src", url);
                });
            });
        } else {
            console.log("Not logged in, redirecting");
            window.location.href = "/text/login.html"
        }
    });
}

const docExists = async (docName, docId) => (await db.collection(docName).doc(docId).get()).exists;

document.title = "JAC";