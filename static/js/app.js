import { convert_project_weight_to_render_json } from './render.js'
import { getProjectWeight, list_plan_tasks } from './plan.js'
import { getTaskWeight } from './tasks.js'
import { draw_bar } from './chart/bar.js'

import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from  "https://api.observablehq.com/d/4fa2bd8dea76886a@517.js?v=3";//";//@508.js?v=3";

export function draws(id_project) {
  var arr_task_uuid = list_plan_tasks(id_project);//[id_project];
  if (arr_task_uuid.tasks.length == 0)
    return;

  var weight_project = getProjectWeight(arr_task_uuid.tasks);
  var input_for_render = convert_project_weight_to_render_json(weight_project);
  const runtime = new Runtime();
  const main = runtime.module(notebook, name => {
    if (name === "chart") {
      // return new Inspector(document.querySelector("#observablehq-chart-4bac1ac8"));
      return new Inspector(document.querySelector("#observablehq-chart-" + id_project));
    }
    return ["udpdate","trigger"].includes(name);
  });
  main.redefine("alphabet", input_for_render);
}


export function draw_sdgs_chart(totalTaskWeight, elementID) {
  // Draw
  var array_weight_colors = ["#e5243b", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1"]
  draw_bar(elementID, totalTaskWeight, 580, 400, array_weight_colors, true, false)
}

export function draws_task_weight_chart(uuid_task) {
  var weight_task = getTaskWeight(uuid_task);
  draw_sdgs_chart(weight_task, "observablehq-chart-" + uuid_task);
}
