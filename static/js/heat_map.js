import { initMap, pad, getGPS } from "./map.js";
import { plan_info } from "./plan.js";
import { get_task_info } from "./tasks.js";
import { getWeightMeta } from './api/weight.js';

const allWeights = [];
if (allWeights.length === 0) {
  for (let i = 0; i < WEIGHTS.length; i++) {
    try {
      const weightData = await getWeightMeta(WEIGHTS[i]);
      allWeights.push(...weightData.content.categories);
    } catch (error) {
      console.error("Error fetching or processing weight data:", error);
    }
  }
}

const getProjectUuid = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("uuid");
};

const getTasks = (gpsItems) => {
  const tasks = gpsItems.map((gps) => {
    const taskInfo = get_task_info(gps.uuid_task);
    const weights = JSON.parse(taskInfo.content);
    const [lat, lng] = gps.gps.split(",");
    const position = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    const sdgs = Object.keys(weights)
      .map((key, index) => {
        return {
          [key]: {
            key,
            value: parseInt(weights[key]),
            icon: allWeights[index].thumbnail,
          },
        };
      })
      .reduce((all, item) => ({ ...all, ...item }), {});

    const task = { ...taskInfo, position, sdgs };
    return task;
  });
  return tasks;
};

export function gotoHeatmap(next_site) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uuid = urlParams.get("uuid");
  window.location.replace(next_site + "?uuid=" + uuid);
}

const renderer = {
  render: ({ count, position }, stats) => {
    const color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";

    const currentSdgs = $("#sdgs-select").val();
    const currentSdgsImage = sdgsBase64Images[currentSdgs];

    const svg = `
      <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <circle cx="120" cy="120" opacity=".5" r="80" />
        <g transform="translate(50, 50) scale(0.5)">
          <image href="${currentSdgsImage}" height="200" width="200" x="0" y="0" />
        </g>
      </svg>`;

    const svgBase64 = window.btoa(svg);

    const marker = new google.maps.Marker({
      icon: {
        url: `data:image/svg+xml;base64,${svgBase64}`,
        scaledSize: new google.maps.Size(75, 75),
      },
      label: {
        text: String(count),
        color: "rgba(255,255,255,0.9)",
        fontSize: "14px",
        fontWeight: "bold",
      },
      position,
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    });
    return marker;
  },
};

let map = null;
let clusterer = null;
const tasks = [];
const markers = [];
let infowindow = null;

const sdgsBase64Images = {};
const clearMarkers = () => {
  while (markers.length > 0) {
    markers.pop().setMap(null);
  }
  clusterer.clearMarkers();
};

const addMarkers = (sdgsSelected) => {
  const markers = tasks
    .filter((task) => task.sdgs[sdgsSelected].value > 0)
    .map((task) => {
      const currentSdgs = task.sdgs[sdgsSelected];

      const marker = new google.maps.Marker({
        position: task.position,
        map: map,
        icon: {
          url: currentSdgs.icon,
          scaledSize: new google.maps.Size(30, 30),
        },
        title: task.uuid + " : " + task.name,
      });

      const container = $("<div />", { class: "container" });
      $("<h5 />", { html: task.name }).appendTo(container);
      $("<p />", { html: `日期: ${task.period}` }).appendTo(container);
      $("<p />", { html: task.name }).appendTo(container);

      const uuid = getProjectUuid();
      $("<p />")
        .append(
          $("<a />", {
            href: `/content.html?uuid=${uuid}`,
            html: "前往專案",
            target: "_blank",
          })
        )
        .appendTo(container);

      Object.values(task.sdgs)
        .filter((sdg) => sdg.value > 0)
        .map((sdg) => {
          const image = $("<img/>", { src: sdg.icon });
          image.appendTo(container);
        });

      marker.addListener("click", (e) => {
        infowindow.setContent(container.get(0));
        infowindow.open({
          anchor: marker,
          map,
        });
        e.stopPropagation();
      });

      return marker;
    });

  const bounds = new google.maps.LatLngBounds();
  markers.map((marker) => {
    bounds.extend(marker.position);
  });

  if (markers.length !== 0) {
    map.fitBounds(bounds);
  }

  clusterer.addMarkers(markers);
};

export async function set_page_info_heat_map() {
  const uuid = getProjectUuid();
  try {
    const obj_project = plan_info(uuid);
    document.getElementById("project_title").innerHTML = obj_project.name;
  } catch (e) {
    console.log(e);
  }

  // Get GPS record
  const obj_gps_result = getGPS(uuid);
  if (obj_gps_result.length === 0) {
    return;
  }

  // Init Google map
  map = initMap();
  clusterer = new markerClusterer.MarkerClusterer({ map, markers, renderer });
  infowindow = new google.maps.InfoWindow();
  tasks.push(...getTasks(obj_gps_result));

  const selector = $("#sdgs-select");
  let index = 1;
  
  for (const weight of allWeights) {
    (async (currentIndex) => {
      const value = `sdgs-${currentIndex}`;
      const label = weight.title;
      selector.append(`<option value="${value}">${label}</option>`);
  
      // Image save
      sdgsBase64Images[currentIndex] = weight.thumbnail;
    })(index);
    index++;
  }

  selector.on("change", (e) => {
    const value = $(e.currentTarget).val();
    clearMarkers();
    addMarkers(value);
  });

  selector.trigger("change");
}