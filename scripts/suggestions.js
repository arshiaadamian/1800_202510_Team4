// Wait for Firebase to initialize and DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User logged in");
      findMatches(user);
    } else {
      console.log("No user signed in");
    }
  });
});

// Find users with matching genres
async function findMatches(user) {
  try {
    // Get current user's data
    const currentUser = await db.collection("users").doc(user.uid).get();
    const currentUserGenres = currentUser.data().genres;

    // Get all other users
    const allUsers = await db
      .collection("users")
      .where(firebase.firestore.FieldPath.documentId(), "!=", user.uid)
      .get();

    // Clear previous suggestions
    const container = document.getElementById("suggestions");

    // Check each user for matches
    for (const doc of allUsers.docs) {
      const otherUser = doc.data();
      otherUser.uid = doc.id; // Add the user ID for profile image

      // Count how many genres match between users
      let matchCount = 0;

      // Check each genre
      if (
        currentUserGenres.firstPersonShooter &&
        otherUser.genres.firstPersonShooter
      ) {
        matchCount++;
      }
      if (currentUserGenres.rolePlaying && otherUser.genres.rolePlaying) {
        matchCount++;
      }
      if (
        currentUserGenres.massMultiplayer &&
        otherUser.genres.massMultiplayer
      ) {
        matchCount++;
      }
      if (currentUserGenres.casual && otherUser.genres.casual) {
        matchCount++;
      }
      if (currentUserGenres.horror && otherUser.genres.horror) {
        matchCount++;
      }

      // If 2 or more matches, create a card
      if (matchCount >= 2) {
        const card = createUserCard(otherUser);
        container.appendChild(card);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Create a card for a matched user
function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "card card-display";
  card.style.width = "14rem";

  card.innerHTML = `
    <img src="${
      user.img || "/images/default.png"
    }" class="card-img-top" alt="Profile Picture" />
    <div class="card-body">
      <h5 class="card-title">${user.username}</h5>
      <p class="card-text">${user.description}</p>
      <a href="#" class="btn btn-primary contact">Contact</a>
    </div>
  `;

  const button = card.querySelector(".contact");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    applyNow(user.uid);
  });
  return card;
}

function applyNow(owner) {
  firebase.auth().onAuthStateChanged((user) => {
    if (owner != user.uid) {
      db.collection("users")
        .doc(owner)
        .get()
        .then((doc) => {
          ownername = doc.data().name;
          owneremail = doc.data().email;
          ownerAge = doc.data().age;
          ownerCountry = doc.data().country;

          window.open(
            "mailto:" + owneremail + 
            "?subject=Friend Request" + 
            "&body=" + encodeURIComponent(
              "Dear " + ownername + ",\r\n\r\n" +
              "Would you like to play video games together?\r\n\r\n" +
              "Sincerely,\r\n" +
              "[Your Name]\r\n" +
              "Age: " + ownerAge + "\r\nCountry: " + ownerCountry + "\r\n\r\n" +
              "Match. Chat. Game. Repeat.\r\n\r\n" +
              "Sponsored by JAC - Connecting Gamers Around the World\r\n\r\n" +
              "   (•ᴗ•)   \r\n" 
            ))
        });
    }
  });
}
