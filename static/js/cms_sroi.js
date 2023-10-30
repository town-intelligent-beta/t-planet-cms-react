import { getSroiData, getSroiDataMeta, setSroiData } from "./api/sroi.js";
import { draw_doughnut_chart, isValidDoughnutChartData } from "./chart/bar.js";
import { plan_info } from "./plan.js";
import { renderHandlebars } from "./utils/handlebars.js";

let data = {};

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
    spreadsheet_url: `https://docs.google.com/spreadsheets/d/${sroiData.file_id}`,
  };

  renderSroiPage(data);

  $("#cms-sroi").on("click", "#refresh", async (e) => {
    e.preventDefault();

    renderHandlebars("sroi-section", "tpl-sroi-section-loading", {});


    // 開始計時
    const startTime = performance.now();
    const sroiData = await getSroiData(uuid);
    // 結束計時
    const endTime = performance.now();
    // 計算執行時間
    const duration = (endTime - startTime) / 1000;
    console.log(`getSroiData 程式碼執行時間: ${duration} 秒`);

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
    const sroiData = await setSroiData(uuid, e.target.value);
    data = {
      ...data,
      visible: sroiData.visible,
    };

    renderSroiPage(data);
  });

  $("#cms-sroi").on("hide.bs.collapse", ".collapse", function (e) {
    const id = e.target.id;
    $(`[aria-controls='${id}'] .fa`)
      .removeClass("fa-minus")
      .addClass("fa-plus");
  });

  $("#cms-sroi").on("show.bs.collapse", ".collapse", function (e) {
    const id = e.target.id;
    $(`[aria-controls='${id}'] .fa`)
      .removeClass("fa-plus")
      .addClass("fa-minus");
  });
};
