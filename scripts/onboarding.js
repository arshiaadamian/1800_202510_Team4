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
        limitSelections(checkboxes, 2);
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
                    const genres = userDoc.data().genres;

                    // Pre-check checkboxes based on the genres object
                    if (genres.casual === true) {
                        document.getElementById("btncheck1").checked = true;
                    } else {
                        document.getElementById("btncheck1").checked = false;
                    }

                    if (genres.firstPersonShooter === true) {
                        document.getElementById("btncheck2").checked = true;
                    } else {
                        document.getElementById("btncheck2").checked = false;
                    }

                    if (genres.horror === true) {
                        document.getElementById("btncheck3").checked = true;
                    } else {
                        document.getElementById("btncheck3").checked = false;
                    }

                    if (genres.massMultiplayer === true) {
                        document.getElementById("btncheck4").checked = true;
                    } else {
                        document.getElementById("btncheck4").checked = false;
                    }

                    if (genres.rolePlaying === true) {
                        document.getElementById("btncheck5").checked = true;
                    } else {
                        document.getElementById("btncheck5").checked = false;
                    }
                });
        }
    });
}

populateGamerInfo();

function saveGamerInfo() {

    const casual1 = document.getElementById("btncheck1").checked;
    const firstPersonShooter1 = document.getElementById("btncheck2").checked;
    const horror1 = document.getElementById("btncheck3").checked;
    const massMultiplayer1 = document.getElementById("btncheck4").checked;
    const rolePlaying1 = document.getElementById("btncheck5").checked;
currentUserRef.update({
    genres: {
        casual: casual1,
        firstPersonShooter: firstPersonShooter1,
        horror: horror1,
        massMultiplayer: massMultiplayer1,
        rolePlaying: rolePlaying1
    }
})
.then(() => {
    console.log("Genres updated successfully!");
    window.location.href = "/text/main.html"; // Redirect after saving
})
}
