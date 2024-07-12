import { plan_info } from './plan.js'

export function set_page_info_cms_contact_person(uuid){
  if (uuid != null) {
    var obj_project = plan_info(uuid);

    // Set DOM
    document.getElementById("hoster").value = obj_project.hoster;
    document.getElementById("email").value = obj_project.email;
    document.getElementById("org").value = obj_project.org;
    document.getElementById("tel").value = obj_project.tel;

    var list_location = [];

    try {
      list_location = obj_project.location.split(",");
    } catch (e) {}

    for(var index = 0; index<list_location.length; index++) {
      if (parseInt(list_location[index]) != 0) {
        document.getElementById("location_" + (index+1)).checked = true;
      }
    }
    setLocalStorage("uuid_project", uuid);
  }
}
