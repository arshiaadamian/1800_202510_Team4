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

      // Show success message
      const messageDiv = document.getElementById("upload-message");
      if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.textContent = "Profile uploaded!";
        setTimeout(() => {
          messageDiv.style.display = "none";
        }, 3000);
      }

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
updateButton.addEventListener("click", async () => {

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

  if (!fullName || !newEmail || !newCountry || !newLang || !newAge) {
    alert("Please fill in the required boxes.")
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You need to be logged in to change your profile picture.");
    return;
  }
  await db.collection("users").doc(user.uid).update({
    name: fullName,
    email: newEmail,
    country: newCountry,
    language: newLang,
    age: newAge
  });
  updateButton.innerHTML = "Submitted!";
  updateButton.style = "background-color: green;";
  updateButton.disabled = true;
  document.getElementById('profileInfo').disabled = true;
});


const updateButton2 = document.getElementById("submit2");
const firstPersonShooter = document.getElementById("pref1");
const rolePlay = document.getElementById("pref2");
const mass = document.getElementById("pref3");
const casual = document.getElementById("pref4");
const horror = document.getElementById("pref5");

updateButton2.addEventListener("click", async () => {
  // Checking the boolean values of checkboxes.
  const firstPersonShooterValue = firstPersonShooter.checked;
  const rolePlayValue = rolePlay.checked;
  const massValue = mass.checked;
  const casualValue = casual.checked;
  const horrorValue = horror.checked;

  const user = auth.currentUser;

  await db.collection("users").doc(user.uid).update({
    genres: {
      casual: casualValue,
      firstPersonShooter: firstPersonShooterValue,
      horror: horrorValue,
      massMultiplayer: massValue,
      rolePlaying: rolePlayValue
    }
  });
  updateButton2.innerHTML = "Submitted!";
  updateButton2.style = "background-color: green;";
  updateButton2.disabled = true;
  // document.getElementById('profileInfo2').disabled = true;
});



window.onload = function () {
  document.getElementById('profileInfo').disabled = true;
  document.getElementById('profileInfo1').disabled = true;
  document.getElementById('submit1').disabled = true;
  document.getElementById('submit2').disabled = true;
};

function editUserInfo() {
  var form = document.getElementById('profileInfo');
  form.disabled = !form.disabled;
  document.getElementById('submit1').disabled = !form.disabled;
}

function editUserInfo2() {
  var form = document.getElementById('profileInfo1');
  form.disabled = !form.disabled;
  document.getElementById('submit2').disabled = !form.disabled;
}


var currentUser;
function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.get()
        .then(userDoc => {
          let userData = userDoc.data();
          // Populate all fields
          if (userData.username) document.getElementById("fullName").value = userData.username;
          if (userData.email) document.getElementById("email").value = userData.email;
          if (userData.age) document.getElementById("age").value = userData.age;
          if (userData.country) document.getElementById("Country").value = userData.country;
          if (userData.language) document.getElementById("lang").value = userData.language;

          if (userData.genres) {
            firstPersonShooter.checked = userData.genres.firstPersonShooter;
            rolePlay.checked = userData.genres.rolePlaying;
            mass.checked = userData.genres.massMultiplayer;
            casual.checked = userData.genres.casual;
            horror.checked = userData.genres.horror;
          }
        })
    } else {
      console.log("No user is signed in");
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
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          //get the data fields of the user
          let userInfo = userDoc.data().description;

          //if the data fields are not empty, then write them in to the form.
          if (userInfo != null) {
            // document.getElementById("description").value = userInfo;
          }
        })
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

// Function to limit the number of checkbox selections
function limitSelections(checkboxGroup, maxSelections) {
  let selectedCount = 0;
  const errorMessage = document.getElementById("error-message");

  for (let i = 0; i < checkboxGroup.length; i++) {
    if (checkboxGroup[i].checked) {
      selectedCount++;
      if (selectedCount > maxSelections) {
        checkboxGroup[i].checked = false;
        errorMessage.style.display = "block";
        break;
      } else {
        errorMessage.style.display = "none";
      }
    }
  }
}

const checkboxes = document.querySelectorAll('#profileInfo1 .form-check-input');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    limitSelections(checkboxes, 5);
  });
});

const submitButton = document.getElementById("submit2");
submitButton.addEventListener("click", async () => {
  const errorMessage = document.getElementById("error-message");
  const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

  if (checkedCount > 5) {
    errorMessage.style.display = "block";
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    await db.collection("users").doc(user.uid).update({
      genres: {
        firstPersonShooter: document.getElementById("pref1").checked,
        rolePlaying: document.getElementById("pref2").checked,
        massMultiplayer: document.getElementById("pref3").checked,
        casual: document.getElementById("pref4").checked,
        horror: document.getElementById("pref5").checked
      }
    });

    submitButton.innerHTML = "Submitted!";
    submitButton.style.backgroundColor = "green";
    submitButton.disabled = true;
    document.getElementById('profileInfo1').disabled = true;
  } catch (error) {
    console.error("Error updating preferences:", error);
  }
});


function editUserInfo2() {
  const profileInfo = document.getElementById('profileInfo1');
  profileInfo.disabled = !profileInfo.disabled;

  const submitBtn = document.getElementById("submit2");
  submitBtn.innerHTML = "Save";
  submitBtn.style.backgroundColor = "";
  submitBtn.disabled = profileInfo.disabled;
}


//call the function to run it
populateUserAbout();
editUserInfo();
editUserInfo2();