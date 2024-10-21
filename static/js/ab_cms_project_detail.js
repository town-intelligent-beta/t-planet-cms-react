function get_project_data(uuid) {
  var project_data = {};

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/projects/info/" + uuid,
    type: "GET",
    async: false,
    crossDomain: true,
    //data:  ,
    success: function(returnData) {
      project_data = JSON.parse(returnData);
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return project_data;
}

function init() {
   // Get path
   var url = new URL(window.location.href);
   var uuid = url.searchParams.get("uuid");

  // Load project data from backend
  obj_project_data = get_project_data(uuid);

  // Set value
  document.getElementById("uuid").textContent += obj_project_data.uuid;

  if (obj_project_data.is_budget_revealed === true)
    document.getElementById("budget").textContent += obj_project_data.budget;
  else
    document.getElementById("budget").textContent = "(暫不揭露)";
  
  document.getElementById("relate_people").textContent += obj_project_data.relate_people;
  document.getElementById("hoster").textContent += obj_project_data.hoster;
  document.getElementById("period").textContent += obj_project_data.period;
  document.getElementById("email").textContent += obj_project_data.email;
}
