document.getElementById("login").onclick = function(){
  location.href = "/input";
};

document.getElementById("newlogin").onclick = function(){
  
};

// ログイン処理
  // Get the username and password from the UI.
  var username = document.getElementById("username-field").value;
  var password = document.getElementById("password-field").value;

  // Create a KiiUser object.
  var user = KiiUser.userWithUsername(username, password);
  // Register the user asynchronously.
  user.register({
    // If the user was registered
    success: function(theUser) {
      console.log("User registered: " + JSON.stringify(theUser));

      // Go to the main screen.
      location.href = "/input";
    },
    // If the user was not registered
    failure: function(theUser, errorString) {
      alert("Unable to register user: " + errorString);
      console.log("Unable to register user: " + errorString);
    }
  });

