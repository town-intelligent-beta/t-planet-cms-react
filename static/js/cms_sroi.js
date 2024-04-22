import { getSroiData, getSroiDataMeta, setSroiData } from "./api/sroi.js";
import { draw_doughnut_chart, isValidDoughnutChartData } from "./chart/bar.js";
import { plan_info } from "./plan.js";
import { renderHandlebars } from "./utils/handlebars.js";

let data = {};
export const showMore = () => {
  const btn = document.querySelector(".show-more-btn");
  const content = document.querySelector(".content");
  const filter = document.querySelector(".filter");

  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    btn.textContent = "顯示更多";
    filter.style.visibility = "visible";
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    btn.textContent = "隱藏";
    filter.style.visibility = "hidden";
  }
};


export function refresh() {
  const html = document.getElementById("tpl-cms-sroi").innerHTML;
  const template = Handlebars.compile(html);
  document.getElementById("tpl-cms-sroi").outerHTML = template({});
}

export const registerHandlebarsPartial = () => {
  Handlebars.registerPartial(
    "sroiTable",
    document.getElementById("tpl-partial-sroi-table").innerHTML
  );
};

export const renderSroiPage = (data) => {
  const html = document.getElementById("tpl-cms-sroi").innerHTML;
  const template = Handlebars.compile(html);
  document.getElementById("cms-sroi").innerHTML = template(data);
  document.querySelector('.show-more-btn').addEventListener('click', showMore);
  $(`.visible[value='${data.visible}']`).attr("checked", true);

  // 當還沒讀取到sroiData時，不顯示圓餅圖
  if (data.sroiData) {
    const { social_subtotal, economy_subtotal, environment_subtotal } =
      data.sroiData;
    const labels = ["社會價值", "經濟價值", "環境價值"];
    const datasetData = [
      social_subtotal,
      economy_subtotal,
      environment_subtotal,
    ];

    // 當社會價值、經濟價值、環境價值都為0時，不顯示圓餅圖
    if (isValidDoughnutChartData(datasetData)) {
      draw_doughnut_chart({
        element: document.querySelector("#cms-sroi #sroi_chart"),
        data: {
          labels,
          datasets: [
            {
              data: datasetData,
            },
          ],
        },
      });
    }
  }
};

export const set_page_info_cms_sroi = async (uuid) => {
  if (uuid == null) {
    return;
  }

  registerHandlebarsPartial();

  const obj_project = plan_info(uuid);
  const sroiData = await getSroiDataMeta(uuid);
  data = {
    ...obj_project,
    visible: sroiData.visible,
    spreadsheet_url: `https://docs.google.com/spreadsheets/d/${sroiData.file_id}?headers=false&chrome=false&single=true&widget=false&rm=minimal`,
  };

  renderSroiPage(data);

  $("#cms-sroi").on("click", "#refresh", async (e) => {
    e.preventDefault();

    renderHandlebars("sroi-section", "tpl-sroi-section-loading", {});
    const sroiData = await getSroiData(uuid);

    data = {
      ...data,
      sroiData,
      visible: sroiData.visible,
    };

    const { social_subtotal, economy_subtotal, environment_subtotal } =
      sroiData;

    if (
      social_subtotal == 0 &&
      economy_subtotal == 0 &&
      environment_subtotal == 0
    ) {
      return;
    }

    renderSroiPage(data);
  });

  $("#cms-sroi").on("click", ".visible", async (e) => {
    e.preventDefault();
    // const selectedValue = e.target.value;
    // let gid;

    // if (selectedValue === '社會面向') {
    //   gid = 874640826;
    // } else if (selectedValue === '經濟面向') {
    //   gid = 2040341016;
    // } else {
    //   gid = 553263877;
    // }

    const sroiData = await setSroiData(uuid, e.target.value);
    data = {
      ...data,
      visible: sroiData.visible,
      // spreadsheet_url: `https://docs.google.com/spreadsheets/d/${sroiData.file_id}#gid=${gid}`,
    };

    renderSroiPage(data);
  });

  $("#cms-sroi").on("hide.bs.collapse", ".collapse", function (e) {
    const id = e.target.id;
    $(`[aria-controls='${id}'] .fa`)
      .removeClass("fa-minus")
      .addClass("fa-plus");
  });
  $("#v-pills-tab a").on("click", function (e) {
    e.preventDefault();
    const selectedTab = $(this).attr("data-gid");
    const iframe = $(this).closest(".row").find(".tab-content").find("iframe");
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${sroiData.file_id}?headers=false&chrome=false&single=true&widget=false&rm=minimal#gid=${selectedTab}`;
    iframe.attr("src", spreadsheetUrl);
  });

  $("#cms-sroi").on("show.bs.collapse", ".collapse", function (e) {
    const id = e.target.id;
    $(`[aria-controls='${id}'] .fa`)
      .removeClass("fa-plus")
      .addClass("fa-minus");
  });

  const loadData = (sroiType, targetElementId) => {
    $.ajax({
      url: `${HOST_URL_TPLANET_DAEMON}/projects/get_sroi_table_values`,
      type: "POST",
      data: {
        uuid_project: obj_project.uuid,
        sroi_type: sroiType,
      },
      success: (response) => {
        const values = response.values;
        const jsonData = {
          values: values,
        };
        const generateTableHTML = (data) => {
          return `<div class='table-responsive-md'><table class='table'>
            ${data
              .map(
                (row) =>
                  `<tr>
                ${row
                  .map(
                    (cell) =>
                      `<td style="background-color: ${
                        cell.background_color || ""
                      }">
                    ${cell.value || ""}
                  </td>`
                  )
                  .join("")}
              </tr>`
              )
              .join("")}
          </table></div>`;
        };

        const tableHTML = generateTableHTML(jsonData.values);
        $("#" + targetElementId).html(tableHTML);
      },
      error: (error) => {
        console.error(error);
      },
    });
  };
  loadData("SOCIAL", "tableSocial");

  $("#v-pills-tab a").on("click", function (e) {
    e.preventDefault();
    const tabIndex = $(this).index();
    const sroiType = ["SOCIAL", "ECONOMY", "ENVIRONMENT", "EVIDENCE"];
    const dataType = sroiType[tabIndex];
    const targetElementId = $(this).attr("aria-controls");
    if (dataType === "EVIDENCE") {
      var url = "/backend/cms_sroi_evidence.html?uuid=" + uuid;
      window.open(url, "_blank");
    } else {
      loadData(dataType, targetElementId);
    }
  });
};
