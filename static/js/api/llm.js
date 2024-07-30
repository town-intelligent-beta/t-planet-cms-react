export function sdgsAutoGen(uuid) {
  return new Promise((resolve, reject) => {
    var formData = new FormData();
    formData.append("uuid", uuid);

    $.ajax({
      url: HOST_URL_TPLANET_DAEMON + "/llm/auto_gen_sdgs",
      type: "POST",
      contentType: false,
      processData: false,
      crossDomain: true,
      data: formData,
      success: function(returnData) {
        try {
          const dataJSON = JSON.parse(returnData);
          resolve(dataJSON);
        } catch (error) {
          reject(error);
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        reject(thrownError);
      }
    });
  });
}