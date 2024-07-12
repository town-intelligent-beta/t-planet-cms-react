export async function mockup_upload(form) {
  return new Promise((resolve, reject) => {
    var resultJSON = {};
    var settings = {
      "url": HOST_URL_TPLANET_DAEMON + "/mockup/new",
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

export function mockup_get(form) {
  var resultJSON = {};

  var settings = {
    "url": HOST_URL_TPLANET_DAEMON + "/mockup/get",
    "method": "POST",
    "timeout": 0,
    "async": false,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };

  $.ajax(settings).done(function (response) {
    resultJSON = JSON.parse(response);
  });

  return resultJSON;
}
