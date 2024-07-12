function get_group(email) {
  var dataJSON = {};
  dataJSON.email = email;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/get_group",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Set LocalStorage
       setLocalStorage("group", obj.group);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return getLocalStorage("group");
}

function logout() {
  // Modify account
  var dataJSON = {};
  dataJSON.token = getLocalStorage("jwt");
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/verify_jwt",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Clear local storage
       localStorage.clear();
       window.location.replace("/index.html");
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
}
