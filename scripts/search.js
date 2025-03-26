const search = document.getElementById("searchButton");
search.addEventListener("click", async function () {
  const searchInputValue = document
    .getElementById("searchInput")
    .value;
  const user = auth.currentUser;
  if (!user) {
    console.log("user does not exist");
    return;
  }
  const container = document.getElementById("suggestions");
  container.innerHTML = "";
  let userQuery = db.collection("users").where("username", "==", searchInputValue);
  let foundUsers = await userQuery.get();
  foundUsers.forEach(async foundUser => {
    
    let userData = foundUser.data();
    userData.img = await getUserPicture(foundUser.id);
    let card = createUserCard(userData);
    container.appendChild(card);

    const addFriend = document.querySelector(".addFriend");
    addFriend.addEventListener("click", async function () {
      await db
        .collection("users")
        .doc(user.uid)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion(foundUser.id),
        });

      await db
        .collection("users")
        .doc(foundUser.id)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
    });
  });

  if (!foundUsers) {
    alert("no user found");
  } else {
    
  }
});

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "card card-display";
  card.style.width = "14rem";

  card.innerHTML = `
    <img src="${user.img || "/images/default.png"
    }" class="card-img-top" alt="Profile Picture" />
    <div class="card-body">
      <h5 class="card-title">${user.username}</h5>
      <p class="card-text">${user.description}</p>
      <a href="#" class="btn btn-primary addFriend">Add Friend</a>
    </div>
  `;

  return card;
}
