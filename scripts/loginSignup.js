const loginForm = document.querySelector("#log-in-ui");

loginForm.addEventListener('submit', (e) => {
  // Get the user's info
  const email = loginForm['emailInput'].value;
  const password = loginForm['passwordInput'].value;


    // Sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      console.log(cred);
    });
  

});
// code: "auth/email-already-in-use", message: "The email address is already in use by another account."