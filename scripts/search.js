const search = document.getElementById("searchButton");
search.addEventListener("click", async function () {
  const searchInputValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const user = auth.currentUser;
  if (!user) {
    console.log("user does not exist");
    return;
  }

  const allUsersSnapShot = await db.collection("users").get();
  let foundUser = null;
  allUsersSnapShot.forEach(function (doc) {
    const userData = doc.data();
    //console.log(userData);
    const currentUserName = userData.username.toLowerCase();
    if (currentUserName === searchInputValue) {
      foundUser = userData;
    }
  });

  if (!foundUser) {
    alert("no user found");
  } else {
    const container = document.getElementById("suggestions");
    const card = createUserCard(foundUser);
    container.appendChild(card);
  }
});

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
