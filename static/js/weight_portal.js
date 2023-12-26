import { getWeightTemplates, getWeightList, createWeight } from "./api/weight.js";

function executeCreateWeight(domainName, listCustomWeight) {
  // 顯示 loading
  document.getElementById('loading').style.display = 'block';

  createWeight(domainName, listCustomWeight).then(() => {
    // 隱藏 loading
    document.getElementById('loading').style.display = 'none';

    // 顯示成功訊息
    alert('載入成功');
  }).catch(error => {
    console.error('錯誤:', error);
    // 隱藏 loading
    document.getElementById('loading').style.display = 'none';
  });
}


function submit_custom_weights (formData) {
  var listCustomWeight = getLocalStorage("list_custom_weight");
  if (listCustomWeight === "") {
    return;
  } else {
    // listCustomWeight = JSON.parse(listCustomWeight);
    listCustomWeight = listCustomWeight;
  }

  var domainName = "https://" + window.location.hostname;
  // createWeight(domainName, listCustomWeight)
  executeCreateWeight(domainName, listCustomWeight);
}

// Function to add rows to the table
function addRowsToTable(templates, lists) {
  var tableBody = document.getElementById('table_wight_module_templates').getElementsByTagName('tbody')[0];

  templates.forEach(function(templateItem) {
    var row = tableBody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    // Insert checkbox in the first cell
    var checkbox = document.createElement('input');
    checkbox.id = templateItem.folder_id;
    checkbox.type = 'checkbox';
    checkbox.className = 'module-checkbox'; // 添加 class

    // Check if the template name is in the lists array
    if (lists.some(listItem => listItem.name === templateItem.name)) {
      checkbox.checked = true; // If found, check the checkbox
      checkbox.disabled = true;
    }

    cell1.appendChild(checkbox);

    // Insert module name in the second cell
    // cell2.textContent = templateItem.name;

    // Insert module name in the second cell
    var link = document.createElement('a');
    link.href = `https://drive.google.com/drive/folders/${templateItem.folder_id}`;
    link.textContent = templateItem.name;
    link.target = '_blank'; // 開啟新標籤頁
    cell2.appendChild(link);
  });
}

export const set_page_info_weight_portal = async () => {
  // Get Weight
  var domainName = "https://" + window.location.hostname;
  const result_weight = await getWeightList(domainName);

  // Get Templates
  const templates = await getWeightTemplates();

  // Render
  addRowsToTable(templates.content, result_weight.content);

  // Submit hook
  $(document).ready(function() {
    $("#wightsForm").on("submit", function(event) {
      event.preventDefault(); // 阻止表單的預設提交行為
      var formData = $(this).serialize(); // 取得表單數據
      submit_custom_weights(formData); // 調用函式
    });

    // 使用事件委派為動態生成的 checkbox 添加點擊事件處理
    $("body").on("click", ".module-checkbox", function() {
      var listCustomWeight = getLocalStorage("list_custom_weight");
      if (listCustomWeight === "") {
        listCustomWeight = [];
      } else {
        listCustomWeight = JSON.parse(listCustomWeight);
      }

      var index = listCustomWeight.indexOf(this.id);

      if (this.checked) {
        if (index === -1) { // 如果 list 中没有同名的成员
          listCustomWeight.push(this.id);
        }
      } else {
        if (index !== -1) { // 如果 list 中有这个成员
          listCustomWeight.splice(index, 1); // 删除成员
        }
      }

      // 更新 localStorage
      setLocalStorage("list_custom_weight", JSON.stringify(listCustomWeight));
    });

  });
}