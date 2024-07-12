export function news_list() {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.email = SITE_HOSTERS[0];

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/news/news_list",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       resultJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

export function news_get(uuid) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.uuid = uuid;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/news/news_get",
    type: "GET",
    async: false,
    crospsDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       resultJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

export function news_delete(uuid) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.email = SITE_HOSTERS[0];
  dataJSON.uuid = uuid;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/news/news_delete",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       resultJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return resultJSON;
}

export async function news_add(form) {
  return new Promise((resolve, reject) => {
    var resultJSON = {};
    var settings = {
      "url": HOST_URL_TPLANET_DAEMON + "/news/news_create",
      "method": "POST",
      "async": true,
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };

    $.ajax(settings).done(function (response) {
      resultJSON = JSON.parse(response);
      resolve(resultJSON); // 在响应解析后解析 Promise
    }).fail(function (error) {
      reject(error); // 在发生错误时拒绝 Promise
    });
  });
}
