// Old login, I just want to make it work please :(
// function checkUser() {
//   console.log("Started checking the user.");
//   let userEmail = document.getElementById('emailInput').value;
//   let userPassword = document.getElementById('passwordInput').value;
//   console.log("Checking user: " + userEmail);
//   console.log("Checking password: " + userPassword);

//   let user
//   firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
//     .then((userCredential) => {
//       // Signed in 
//       user = userCredential.user;
//       // ...
//     })
//     .catch((error) => {
//       let errorCode = error.code;
//       let errorMessage = error.message;

//       // if (errorCode == 'ERROR_EMAIL_ALREADY_IN_USE') {
//       //   console.log("Email is in use");
//       //   firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
//       //     .then((userCredential) => {
//       //       // Signed in
//       //       user = userCredential.user;
//       //       // ...
//       //     })
//       //     .catch((error) => {
//       //       let errorCode = error.code;
//       //       let errorMessage = error.message;
//       //     });

//       // }
//       // ..
//     });
//     console.log("Finished checking the user.");
//     console.log(user);
// } 
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to the developer to handdle
            return true;
        },
        uiShown: function () {
            // The widget is rendered
            // Hide the loader
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Wil user popup for the IDP Providers sign in flow instead of the default, redirect
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Pricacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'

    
};
ui.start('#firebaseui-auth-container', uiConfig);
console.log("Login / Signup loaded succesfully!");