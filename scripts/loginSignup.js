function checkUser() {
  console.log("Started checking the user.");
  let userEmail = document.getElementById('emailInput').value;
  let userPassword = document.getElementById('passwordInput').value;
  console.log("Checking user: " + userEmail);
  console.log("Checking password: " + userPassword);

  let user
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
    .then((userCredential) => {
      // Signed in 
      user = userCredential.user;
      // ...
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;

      if (errorCode == 'ERROR_EMAIL_ALREADY_IN_USE') {
        console.log("Email is in use");
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
          .then((userCredential) => {
            // Signed in
            user = userCredential.user;
            // ...
          })
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
          });

      }
      // ..
    });
    console.log("Finished checking the user.");
    console.log(user);
} 
