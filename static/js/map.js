// import { setLocalStorage, getLocalStorage } from './localStorage.js'

export function getGPS(project_UUID) {
  var resultJSON = {};
  var dataJSON = {};
  dataJSON.uuid = project_UUID;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/gps_get",
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

export function pad(d) {
   return (d < 10) ? '0' + d.toString() : d.toString();
}
export function initMap() {
  // var streIDLocastion = randomNumber(23.678041, 23.678091).toString() + "," + randomNumber(120.790983, 120.790183).toString()
  var streIDLocastion = "23.678041, 120.790983";//getLocalStorage("eIDLocastion");
  var listeIDLocastion = streIDLocastion.split(",")

  // The location of Uluru
  const uluru = { lat: parseFloat(listeIDLocastion[0]), lng: parseFloat(listeIDLocastion[1]) };

  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 20,
    center: uluru,
  });

  return map;
}
