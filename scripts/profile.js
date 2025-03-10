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
