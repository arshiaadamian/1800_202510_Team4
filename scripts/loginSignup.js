const loginForm = document.querySelector("#log-in-ui");

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get the user's info
  const email = loginForm['emailInput'].value;
  const password = loginForm['passwordInput'].value;
  const username = "Testing...";

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    
    console.log("Signed in", cred);
  }).catch((err) => {
    if (err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
      // Otherwise, sign up the user
      auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log("Signed up", cred);
        db.collection("users").doc(cred.user.uid).set({
          username: username,
          games: [],
        });
      });
    }
  }).then((cred) => {
    document.querySelector('#log-in-ui').submit();
  });

  // let docRef = db.collection("users").doc(email);
  // docRef.get().then((doc) => {
  //   if (doc.exists) {
  //     // Sign in the user if they exist
  //     auth.signInWithEmailAndPassword(email, password).then((cred) => {
  //       cred.user.uid;
  //       console.log("Signed in", cred);
  //     });
  //   } else {
  //     // Otherwise, sign up the user
  //     auth.createUserWithEmailAndPassword(email, password).then(cred => {
  //       console.log("Signed up", cred);
  //       db.collection("users").doc(email).set({
  //         username: username,
  //         games: [],
  //       });
  //     });
  //   }
  //   //document.querySelector('#log-in-ui').submit();
  // });





});
// code: "auth/email-already-in-use", message: "The email address is already in use by another account."