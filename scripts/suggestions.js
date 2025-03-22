// Wait for Firebase to initialize and DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  auth.onAuthStateChanged(user => {
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
    const allUsers = await db.collection("users")
      .where(firebase.firestore.FieldPath.documentId(), "!=", user.uid)
      .get();

    // Clear previous suggestions
    const container = document.getElementById("suggestions");
    

    // Check each user for matches
    for (const doc of allUsers.docs) {
      const otherUser = doc.data();
      otherUser.uid = doc.id;  // Add the user ID for profile image
      
      // Count matching genres
      const matchCount = Object.entries(currentUserGenres)
        .filter(([genre, isSelected]) => 
          isSelected && otherUser.genres[genre]
        ).length;

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
  const card = document.createElement('div');
  card.className = 'card card-display';
  card.style.width = '14rem';
  
  card.innerHTML = `
    <img src="${user.img || '/images/default.png'}" class="card-img-top" alt="Profile Picture" />
    <div class="card-body">
      <h5 class="card-title">${user.username}</h5>
      <p class="card-text">${user.description}</p>
      <a href="#" class="btn btn-primary">Add Friend</a>
    </div>
  `;

  return card;
}