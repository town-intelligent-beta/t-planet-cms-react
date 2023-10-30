import { formatCurrency } from "../utils/format.js";

export const getSroiDataMeta = async (uuid) => {
  const form = new FormData();
  form.append("email", "400@gmail.com");
  form.append("uuid_project", uuid);

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/projects/get_sroi_meta`,
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  const content = await $.ajax(settings).promise();
  let data = JSON.parse(content);
  data = {
    ...data,
    computed: {
      social_subtotal: formatCurrency(data.social_subtotal),
      economy_subtotal: formatCurrency(data.economy_subtotal),
      environment_subtotal: formatCurrency(data.environment_subtotal),
      total_cost: formatCurrency(data.total_cost),
      total_benefit: formatCurrency(data.total_benefit),
    },
  };

  return data;
};

export const getSroiData = async (uuid) => {
  const form = new FormData();
  form.append("email", "400@gmail.com");
  form.append("uuid_project", uuid);

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/projects/get_sroi`,
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  const content = await $.ajax(settings).promise();
  let data = JSON.parse(content);
  data = {
    ...data,
    computed: {
      social_subtotal: formatCurrency(data.social_subtotal),
      economy_subtotal: formatCurrency(data.economy_subtotal),
      environment_subtotal: formatCurrency(data.environment_subtotal),
      total_cost: formatCurrency(data.total_cost),
      total_benefit: formatCurrency(data.total_benefit),
    },
  };

  return data;
};

export const setSroiData = async (uuid, visible) => {
  var form = new FormData();
  form.append("uuid_project", uuid);
  form.append("email", "400@gmail.com");
  form.append("visible", visible);

  const settings = {
    url: `${HOST_URL_TPLANET_DAEMON}/projects/set_sroi`,
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
