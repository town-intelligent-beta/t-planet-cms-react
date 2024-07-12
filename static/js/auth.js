// Verify JWT
function verifyToken(token) {
    var result = false;
    var dataJSON = {};
    dataJSON.token =  token;
    $.ajax({
      url: HOST_URL_TPLANET_DAEMON + "/accounts/verify_jwt",
      type: "POST",
      async: false,
      crossDomain: true,
      data:  dataJSON,
      success: function(returnData) {
        const obj = JSON.parse(returnData);
        if (obj.result) {
          console.log("JWT still avliable");
          result = true;
	        // return true;
        } else {
	        console.log("JWT expired");

          // Clear all localstorage
          localStorage.clear();

          // Redirect signin page
          window.location.replace("/tplanet_signin.html");
        }
      },
      error: function(xhr, ajaxOptions, thrownError){
        console.log(thrownError);
      }
    });
    return true;
}

function checkAuth() {
  var result = false;
  if (getLocalStorage("jwt") == "") {
    console.log("Null value of JWT");
    var path = window.location.pathname;
    var page = path.split("/").pop();

    if (page != "/tplanet_signin.html" || page != "/tplanet_signup.html") {
      // console.log("Goto signin page");
      window.location.replace("/tplanet_signin.html?next=" + path);
    }
  } else {
    // Verify token
    console.log("Verifing JWT ...");
    result = verifyToken(getLocalStorage("jwt"));
  }

  return result;
}
