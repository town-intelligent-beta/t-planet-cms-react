export function make_attrubute(obj_task = null) {
  if (obj_task === null) {
    return [{"trait_type":"SDGs-1","value":"0"},
      {"trait_type":"SDGs-2","value":"0"},
      {"trait_type":"SDGs-3","value":"0"},
      {"trait_type":"SDGs-4","value":"0"},
      {"trait_type":"SDGs-5","value":"0"},
      {"trait_type":"SDGs-6","value":"0"},
      {"trait_type":"SDGs-7","value":"0"},
      {"trait_type":"SDGs-8","value":"0"},
      {"trait_type":"SDGs-9","value":"0"},
      {"trait_type":"SDGs-10","value":"0"},
      {"trait_type":"SDGs-11","value":"0"},
      {"trait_type":"SDGs-12","value":"0"},
      {"trait_type":"SDGs-13","value":"0"},
      {"trait_type":"SDGs-14","value":"0"},
      {"trait_type":"SDGs-15","value":"0"},
      {"trait_type":"SDGs-16","value":"0"},
      {"trait_type":"SDGs-17","value":"0"}];
  }
}

export function mintNFT (obj_input) {
  var form = new FormData();
  form.append("uuid_project", obj_input.uuid_project);
  form.append("uuid_task", obj_input.uuid_task);
  form.append("address", "0xE5b3c06873D4C2da2598b67535331A12a0cCc3f4");
  form.append("contract", "");
  form.append("callback", HOST_URL_TPLANET_DAEMON + "/NFT/set_token_id");
  form.append("description", obj_input.description);
  form.append("name", obj_input.name);
  form.append("attributes", JSON.stringify(obj_input.attribute));

  form.append("image", HOST_URL_TPLANET_DAEMON + "/static/project/" + obj_input.uuid_project + "/tasks/" + obj_input.uuid_task + "/cover.png");

  var settings = {
    "url": HOST_URL_TPLANET_DAEMON + "/NFT/create_nft",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

export function getNFT (uuid_task) {
  var resultJSON = null;

  var form = new FormData();
  form.append("uuid_task", uuid_task);
  var settings = {
    "url": HOST_URL_TPLANET_DAEMON + "/NFT/get_nft",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "async": false,
    "data": form
  };

  $.ajax(settings).done(function (response, textStatus, jqXHR) {
    // 檢查 HTTP 狀態碼
    if (jqXHR.status === 200) {
      resultJSON = JSON.parse(response);
    }
  });

  return resultJSON;
}