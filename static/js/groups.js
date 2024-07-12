
export function list_accounts(group) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.email = getLocalStorage("email");
  dataJSON.group = group;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/list_accounts",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return resultJSON;
}

export function set_group(email, group) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.email = email;
  dataJSON.group = group;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/set_group",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      resultJSON = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return resultJSON;
}
