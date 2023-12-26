export const getWeightTemplates = async () => {

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/weight/templates`,
    method: "GET",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
  };

  const data = await $.ajax(settings).promise();

  return JSON.parse(data);
};

export const getWeightList = async (domainName) => {
  var form = new FormData();
  form.append("site", domainName);

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/weight/list`,
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  const data = await $.ajax(settings).promise();

  return JSON.parse(data);
};

export const createWeight = async (domainName, listCustomWeight) => {
  var form = new FormData();
  form.append("site", domainName);
  form.append("list_template_folder_id", listCustomWeight);

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/weight/create`,
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  const data = await $.ajax(settings).promise();

  return JSON.parse(data);
};

export const getWeight = async (uuid) => {

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/weight/get/${uuid}`,
    method: "GET",
    timeout: 0,
  };

  const data = await $.ajax(settings).promise();

  return JSON.parse(data);
};