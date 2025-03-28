// Ensure file input exists before adding event listener
const fileInput = document.getElementById("pfp-input");
if (fileInput) {
  fileInput.addEventListener("change", async function (event) {
    const file = event.target.files[0]; // Get selected file
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("You need to be logged in to change your profile picture.");
      return;
    }

    const storageRef = storage
      .ref()
      .child(`pfps/${user.uid}.png`);

    try {
      // Upload file
      const snapshot = await storageRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();

      // Update Firestore with new image URL
      await db.collection("users").doc(user.uid).update({ img: downloadURL });

      // Update all profile picture elements at once
      document.querySelectorAll(".pfp").forEach((img) => {
        img.src = downloadURL + "?t=" + new Date().getTime(); // Force refresh
      });

      console.log("Profile picture updated successfully.");
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  });
}

// Load the profile picture on all pages with a sidebar
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      const doc = await db.collection("users").doc(user.uid).get();

      if (doc.exists) {
        const userData = doc.data();
        

        // Update username if the element exists
        const usernameField = document.getElementById("name-goes-here");
        if (usernameField) {
          usernameField.innerText = userData.username || "User";
        }
      }
    } catch (error) {
      console.error(" Error fetching user data:", error);
    }
  } else {
    console.log("No user is signed in.");
  }
});


const updateButton = document.getElementById("submit1");
if(updateButton){
  updateButton.addEventListener("click", async function(){

    // update name
    const fullNameField = document.getElementById("fullName");
    const fullName = fullNameField.value;
    
    // update email
    const emailField = document.getElementById("email");
    const newEmail = emailField.value;

    //update country
    const CountryField = document.getElementById("Country");
    const newCountry = CountryField.value;

    //update language
    const langField = document.getElementById("lang");
    const newLang = langField.value;

    //update age
    const ageField = document.getElementById("age");
    const newAge = ageField.value;

    if(!fullName || !newEmail || !newCountry || !newLang || !newAge){
      alert("Please fill in the required boxes.")
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You need to be logged in to change your profile picture.");
      return;
    }
    await db.collection("users").doc(user.uid).update({name: fullName, email: newEmail, country: newCountry, language: newLang, age: newAge});
  });
}

const updateButton2 = document.getElementById("submit2");
if(updateButton2){
  updateButton2.addEventListener("click", async function(){
    // checking the boolean values of checkboxes.
    const firstPersonShooter = document.getElementById("pref1");
    const firstPersonShooterValue = firstPersonShooter.checked;

    const rolePlay = document.getElementById("pref2");
    const rolePlayValue = rolePlay.checked;

    const mass = document.getElementById("pref3");
    const massValue = mass.checked;

    const casual = document.getElementById("pref4");
    const casualValue = casual.checked;

    const horror = document.getElementById("pref5");
    const horrorValue = horror.checked;

    const user = auth.currentUser;

    await db.collection("users").doc(user.uid).update({genres: {
      casual: casualValue,
      firstPersonShooter: firstPersonShooterValue,
      horror: horrorValue,
      massMultiplayer: massValue,
      rolePlaying: rolePlayValue
  }})
  })
}

function editUserInfo() {
  document.getElementById('profileInfo').disabled = false;
 }
 
 
 function editUserInfo2() {
  document.getElementById('profileInfo2').disabled = false;
 }
 
 
 var currentUser;               //points to the document of the user who is logged in
 function populateUserInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {
 
 
                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            let userName = userDoc.data().username;
                            let userEmail = userDoc.data().email;
                            let userAge = userDoc.data().age;
                            let userData = userDoc.data();
 
 
                            if (userName != null) {
                                document.getElementById("fullName").value = userName;
                            }
                            if (userEmail != null) {
                                document.getElementById("email").value = userEmail;
                            }
                            if (userData.genres) {
                              document.getElementById("pref1").checked
                              = userData.genres.firstPersonShooter;
                              document.getElementById("pref2").checked
                              = userData.genres.rolePlaying;
                              document.getElementById("pref3").checked
                               = userData.genres.massMultiplayer;
                              document.getElementById("pref4").checked
                              = userData.genres.casual;
                              document.getElementById("pref5").checked
                              = userData.genres.horror;
                            }
                          })} else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }
 
 
 //call the function to run it
 populateUserInfo();
 
 
 var currentUser;               //points to the document of the user who is logged in
 function populateUserAbout() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {
 
 
                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            //get the data fields of the user
                            let userInfo = userDoc.data().description;
 
 
                            //if the data fields are not empty, then write them in to the form.
                            if (userInfo != null) {
                                document.getElementById("description").value = userInfo;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }
 
 
 //call the function to run it
 populateUserAbout();
 