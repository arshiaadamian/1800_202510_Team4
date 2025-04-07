// Function to limit the number of checkbox selections
function limitSelections(checkboxGroup, maxSelections) {
    let selectedCount = 0;
    for (let i = 0; i < checkboxGroup.length; i++) {
        if (checkboxGroup[i].checked) {
            selectedCount++;
            if (selectedCount > maxSelections) {
                checkboxGroup[i].checked = false;
                alert("Maximum " + maxSelections + " selections allowed.");
                break;
            }
        }
    }
}

// Add event listeners to checkboxes
const checkboxes = document.querySelectorAll('.btn-check');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        limitSelections(checkboxes, 5);
    });
});

// Function to populate checkbox selections based on user preferences
let currentUserRef;
function populateGamerInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUserRef = db.collection("users").doc(user.uid);

            currentUserRef.get()
                .then(userDoc => {
                    let genres = userDoc.data().genres;
                    // Pre-check checkboxes based on the genres object
                    for (let genre in genres) {
                        document.getElementById(`${genre}-check`).checked = genres[genre];
                    }
                });
        }
    });
}

populateGamerInfo();

function saveGamerInfo() {
    const casual = document.getElementById("casual-check").checked;
    const firstPersonShooter = document.getElementById("firstPersonShooter-check").checked;
    const horror = document.getElementById("horror-check").checked;
    const massMultiplayer = document.getElementById("massMultiplayer-check").checked;
    const rolePlaying = document.getElementById("rolePlaying-check").checked;
    auth.onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).update({
            genres: {
                casual: casual,
                firstPersonShooter: firstPersonShooter,
                horror: horror,
                massMultiplayer: massMultiplayer,
                rolePlaying: rolePlaying
            }
        }).then(() => {
            console.log("Genres updated successfully!");
            window.location.href = "/text/main.html"; // Redirect after saving
        });
    })
    
}

const submitButton = document.querySelector("#submitBtn");
submitButton.addEventListener("click", () => saveGamerInfo());