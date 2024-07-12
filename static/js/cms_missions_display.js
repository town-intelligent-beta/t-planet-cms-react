import { list_children_tasks, get_task_info } from './tasks.js'

export function set_page_info_cms_missions_display(uuid, task) {
  // FIXME
  return;

  var list_tasks = list_children_tasks(task);

  for(var index = 0; index < list_tasks.length; index++) {
    var obj = get_task_info(list_tasks[index]);

    if (parseInt(obj.type_task) == 3) {
      document.getElementById("btn_cms_plan_add_form_task").hidden = true;
      break;
    } else if (parseInt(obj.type_task) == 0) {
      document.getElementById("btn_cms_plan_add_deep_task").hidden = true;
      break;
    }
  }
}
