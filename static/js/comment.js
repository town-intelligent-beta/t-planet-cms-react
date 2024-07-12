export function comment_list() {
  var dataJSON = {};
  dataJSON.owner = SITE_HOSTERS[0];
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/portal/comment_list",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON;
}

export function delComment(uuid_comment) {
  var dataJSON = {};
  dataJSON.uuid = uuid_comment;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/portal/comment_delete",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  // return dataJSON;
  // Reload page
  if (dataJSON.result == true) {
    alert("刪除成功！");
    location.reload();
  } else {
    alert("刪除失敗！")
  }
}

export function comment_get(uuid) {
  var dataJSON = {};
  dataJSON.uuid = uuid;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/portal/comment_get",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON;
}
