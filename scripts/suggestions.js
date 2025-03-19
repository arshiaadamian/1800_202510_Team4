window.addEventListener("load", async function () {
  const user = auth.currentUser;
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log("logged");
      work();
    } else {
      console.log("No user is signed in.");
    }
  });

  //  Get current user's genres from Firestore
  async function work() {
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();
    const userPreference = userData.genres;

    //  Now compare with all other users
    const allUsersSnapShot = await db.collection("users").get();
    allUsersSnapShot.forEach(function (doc) {
      if (doc.id === user.uid) return; // Skip current user

      const otherUserData = doc.data();
      const otherPreferences = otherUserData.genres;

      let matchCount = 0;
      userPreference.forEach((pref) => {
        if (otherPreferences.includes(pref)) {
          matchCount++;
        }
      });

      if (matchCount >= 2) {
        console.log(
          `User ${doc.id} has ${matchCount} matching genres:`,
          otherPreferences
        );
      }
    });
  }
});
