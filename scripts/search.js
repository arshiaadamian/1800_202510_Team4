document.getElementById("searchButton").addEventListener("click", async () => {
  const searchInput = document.getElementById("searchInput").value;
  const user = auth.currentUser;

  if (!user) {
    console.log("User not logged in.");
    return;
  }

  const container = document.getElementById("suggestions");
  container.innerHTML = "";

  const query = db.collection("users").where("username", "==", searchInput);
  const results = await query.get();
  if (results.empty) {
    let cardNotFound = CreateUserNotFoundCard();
    container.appendChild(cardNotFound);
    return;
  }

  results.forEach(async (doc) => {
    const data = doc.data();
    data.uid = doc.id; // Add the user ID for profile image
    data.img = await getUserPicture(doc.id);
    const card = createUserCard(data);
    container.appendChild(card);
  });
});

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
      <a href="#" class="btn btn-primary contact">contact</a>
    </div>
  `;

  const button = card.querySelector(".contact");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    applyNow(user.uid);
  });

  return card;
}

function CreateUserNotFoundCard() {
  const card = document.createElement("div");
  card.className = "card card-display";
  card.style.width = "14rem";
  card.style.width = "100%";
  card.style.height = "100%";

  card.innerHTML = `<div class="alert alert-danger" role="alert">
  User not found!
</div>`;

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

          // window.open('mailto:test@example.com?subject=subject&body=body');

          window.open(
            "mailto:" +
              owneremail +
              "?subject=Friend Request&body=" +
              "Dear " +
              ownername +
              " Would you like to play video games together? " +
              "Sincerely "
          );
        });
    }
  });
}
