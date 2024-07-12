export function accountDelete() {
  var dataJSON={};
  var resultJSON={};
  dataJSON.email = getLocalStorage("email");

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/delete",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
      /* dataJSON = obj
      window.location.replace("/index.html"); */
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  })
  return resultJSON;
}
