var loginForm = document.querySelector("#log-in-ui");
var signup = false;

async function createImage(url, fileName){
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: 'image/png'
  };
  let file = new File([data], fileName, metadata);
  return file
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get the user's info
  const email = loginForm['emailInput'].value;
  const password = loginForm['passwordInput'].value;
  if (signup) {
    if (password != loginForm['confirmPasswordInput'].value) {
      document.getElementById('warning-message').innerHTML = "Passwords do not match, please try again."
      return Promise.reject(new Error("Passwords do not match"));
    }
    const username = loginForm['usernameInput'].value;
    let uid;
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      console.log("Signed up", cred);
      cred.user.displayname = username;
      uid = cred.user.uid;
      db.collection("users").doc(uid).set({
        username: username,
        super: false,
        games: [],
        genres: {
          firstPersonShooter: false,
          rolePlaying: false,
          massMultiplayer: false,
          casual: false,
          horror: false
        },
        sent_messages: [],
        received_messages: [],
        friends: [],
        communities: [],
        owned_communities: [],
        description: "",
        name: "",
        email: email,
        country: "",
        language: "English",
        age: 0,
      }).then(() => {
        let pfpRef = storage.ref().child(`/pfps/${uid}.png`);
        createImage('/images/default.png', `${uid}.png`).then((img) => {
          pfpRef.put(img).then((img) => {
            console.log("Yay?");
            loginForm.submit();
          });
        });
      })
    });
  } else {
    auth.signInWithEmailAndPassword(email, password).then((cred) => {

      console.log("Signed in", cred);
    }).catch((err) => {
      if (err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
        signup = true;
        document.getElementById('username-placeholder').innerHTML = '<input id="usernameInput" type="text" class="form-control" placeholder="Username..." required>';
        document.getElementById('confirm-password-placeholder').innerHTML = '<input id="confirmPasswordInput" type="password" class="form-control" placeholder="Confirm Password..." required>';
        document.getElementById('login-message').innerText = "Sign up for JAC";
      }
      return Promise.reject(err);
    }).then(() => {
      loginForm.submit();
    });
  }
});
