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

const minuteMillis = 60_000;
const hourMillis = minuteMillis * 60;
const dayMillis = hourMillis * 24;
const weekMillis = dayMillis * 7;
const monthMillis =  weekMillis * 4.345;
const yearMillis = monthMillis * 12;
function getTimeAgo(millisecondsAgo) {
    if (millisecondsAgo / yearMillis >= 1) {
        return Math.floor(millisecondsAgo / yearMillis) + " years";
    }
    else if (millisecondsAgo / monthMillis >= 1) {
        return Math.floor(millisecondsAgo / monthMillis) + " months";
    }
    else if (millisecondsAgo / weekMillis >= 1) {
        return Math.floor(millisecondsAgo / weekMillis) + " weeks";
    }
    else if (millisecondsAgo / dayMillis >= 1) {
        return Math.floor(millisecondsAgo / dayMillis) + " days";
    }
    else if (millisecondsAgo / hourMillis >= 1) {
        return Math.floor(millisecondsAgo / hourMillis) + " hours";
    }
    else {
        return Math.floor(millisecondsAgo / minuteMillis) + " minutes";
    }
}

const docExists = async (docName, docId) => (await db.collection(docName).doc(docId).get()).exists;

document.title = "JAC";