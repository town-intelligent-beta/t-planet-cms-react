import { getWeightMeta } from './api/weight.js';

const openBtn = document.querySelector("#open");
const closeBtn = document.querySelector("#close");
const header = document.querySelector("header");
// const selectOne = document.querySelector("#selectOne");
const selectTwo = document.querySelector("#selectTwo");
const input = document.querySelector("input.form-control");
const question = document.querySelector("#quesition");
const response = document.querySelector("#response");
const submitBtn = document.querySelector("#submit");
const chat = document.querySelector(".chat");
const inputFixed = document.querySelector(".input-fixed");
let selectOneText = "";
let selectTwoText = "";

const settings = {
  version: "AI-Gen-V1.1.0",
  username: "您",
  assistant_name: "Eva",
  message: "您好，我是您的 AI 永續顧問 Eva，有甚麼需要幫助的地方?",
};

const versionEl = document.querySelector("#version");
versionEl.textContent = `版本：` + settings.version;

const greetingsEl = document.querySelector("#greetings");
greetingsEl.textContent = settings.assistant_name + "：" + settings.message;


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

const toggleHeader = () => {
  header.classList.toggle("transform-open");
};

const btn_add_sdg_into_task = document.querySelector("#btn_add_sdg_into_task");
let list_target_sdgs = [];

const createSDGIcon = (btn) => {
  const icon = document.createElement("img");
  icon.className = "rounded-0 mt-3 mr-3 mb-3 mt-md-0 cursor-pointer";
  icon.style.height = "40px";
  icon.style.width = "40px";
  icon.src = btn.querySelector("img").src;
  icon.alt = btn.querySelector("img").alt;
  icon.setAttribute("data-sdg", btn.getAttribute("name"));
  return icon;
};

const addSDGToList = (icon) => {
  list_target_sdgs.push(icon.getAttribute("data-sdg"));
};

const removeSDGFromList = (icon) => {
  list_target_sdgs = list_target_sdgs.filter(
    (item) => item !== icon.getAttribute("data-sdg")
  );
};

const handleClickEvent = (btn) => {
  const icon_container = document.querySelector("#icon_container");
  const icon = createSDGIcon(btn);
  addSDGToList(icon);
  icon_container.appendChild(icon);
  updateInputValue();
  
  // 切換背景顏色
  const isSelected = btn.style.backgroundColor === "gray";
  btn.style.backgroundColor = isSelected ? "" : "gray";

  icon.addEventListener("click", () => {
    removeSDGFromList(icon);
    icon.remove();
    updateInputValue();
    
    // 恢復原來的背景顏色
    btn.style.backgroundColor = "";
  });
};

// 使用事件代理來處理動態添加的按鈕
document.addEventListener("click", (event) => {
  if (event.target.closest("#btn_sdg")) {
    handleClickEvent(event.target.closest("#btn_sdg"));
  }
});

const modleCloseBtn = document.querySelector("#closeSDGsModal");
modleCloseBtn.addEventListener("click", () => {
  const grayElements = document.querySelectorAll(
    "[style='background-color: gray;']"
  );
  grayElements.forEach((element) => {
    element.style.backgroundColor = "";
  });
});

openBtn.addEventListener("click", toggleHeader);
closeBtn.addEventListener("click", toggleHeader);

/* const checkAndShowModal = () => {
  selectOne.value !== "---請選擇---" && selectTwo.value !== "---請選擇---"
    ? $("#SDGsModal").modal("show")
    : $("#SDGsModal").modal("hide");
}; */

const checkAndShowModal = () => {
  selectTwo.value !== "---請選擇---"
    ? $("#SDGsModal").modal("show")
    : $("#SDGsModal").modal("hide");
};

const updateInputValue = (prompt=null) => {
  if (prompt !== null) {
    input.value = prompt;
    return;
  }
  
  let sdgsText = "";
  for (let i = 0; i < list_target_sdgs.length; i++) {
    sdgsText = sdgsText + allWeights[list_target_sdgs[i] - 1].title + "、";
  }
  input.value = `請${selectOneText}列出${selectTwoText}，符合${sdgsText}。`;
  // input.value = `請${selectOneText}列出${selectTwoText}。`;
};

const updateSubmitButtonState = () => {
  // Enable Free talk
  /*   selectOne.value !== "---請選擇---" && selectTwo.value !== "---請選擇---"
    ? (submitBtn.disabled = false)
    : (submitBtn.disabled = true); */
};

const windowForAnalysisProjectSROI = () => {
  return new Promise((resolve, reject) => {
    // 創建 Bootstrap Modal 容器
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.tabIndex = "-1";
    modal.role = "dialog";

    // 創建 Modal 內部結構
    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog modal-dialog-centered";
    modalDialog.role = "document";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // 創建 Modal 標題
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    const title = document.createElement("h5");
    title.className = "modal-title";
    title.innerText = "輸入專案編號";
    modalHeader.appendChild(title);

    // 創建關閉按鈕
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.setAttribute("data-bs-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    modalHeader.appendChild(closeButton);

    // 創建 Modal 內容（包括輸入框）
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.placeholder = "請輸入專案編號";
    input.value = "38896996"; // 預設專案編號
    modalBody.appendChild(input);

    // 創建確認按鈕
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn btn-primary";
    confirmBtn.innerText = "確認";
    confirmBtn.onclick = () => {
      const projectId = input.value;
      if (projectId) {
        resolve(projectId);  // 返回專案編號
        bootstrapModal.hide();
      } else {
        alert("請輸入專案編號");
      }
    };

    // 組裝 Modal 結構
    modalFooter.appendChild(confirmBtn);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    document.body.appendChild(modal);

    // 初始化並顯示 Bootstrap 模態框
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // 點擊背景時的處理邏輯
    modal.addEventListener("hidden.bs.modal", () => {
      document.body.removeChild(modal); // 移除模態框
      reject('視窗被關閉');
    });
  });
};

selectTwo.addEventListener("change", async () => {
  selectTwoText = selectTwo.options[selectTwo.selectedIndex].text;
  
  if (selectTwoText === "分析專案的 SROI 權重") {
    let uuid = await windowForAnalysisProjectSROI();   
    updateInputValue("請幫我分析專案編號為 " + uuid + " 的專案。");
  } else {
    updateInputValue();
    checkAndShowModal();
  }
  updateSubmitButtonState();
});

submitBtn.addEventListener("click", () => {
/*
  const requestBody = {
    role: "小鎮賦能",
    type: "RAG",
    format: "html",
    tools: [{ "tool": "agent", "load_tools": "custom" }],
    injection: [
      { key: "topic", value: selectOneText },
      { key: "topic", value: selectTwoText, weight: list_target_sdgs },
    ],
    message: input.value,
  };
  */
  const requestBody = {
   role: "小鎮賦能",
   message: input.value,
   weight: list_target_sdgs,
  };

  const questionEl = document.createElement("p");
  const responseEl = document.createElement("p");
  questionEl.classList.add("p-lg-3", "p-1");
  responseEl.classList.add("bg-gpt-third", "p-lg-3", "p-1", "mb-5", "d-flex", "align-items-start");
  questionEl.id = "question";
  responseEl.id = "response";
  questionEl.textContent = `${settings.username}：${input.value}`;
  chat.appendChild(questionEl);
  chat.appendChild(responseEl);

  // Clear input value
  input.value = "";

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  responseEl.appendChild(spinner);

  fetch(HOST_URL_LLMTWINS + "/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      spinner.remove();
      responseEl.innerHTML = `${settings.assistant_name}：${data.message}`;
      input.value = "";
      list_target_sdgs = [];
      // selectOne.value = "---請選擇---";
      selectTwo.value = "---請選擇---";
      const icon_container = document.querySelector("#icon_container");
      icon_container.innerHTML = "";
      updateSubmitButtonState();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

window.addEventListener("resize", () => {
  setInputFixedWidth();
});

window.addEventListener("load", () => {
  setInputFixedWidth();
});

const setInputFixedWidth = () => {
  const greetingsWidth = document.querySelector("#greetings").offsetWidth;
  inputFixed.style.width = `${greetingsWidth}px`;
};

// Set weight_container with allWeights
const weight_container = document.querySelector("#weight_container");
allWeights.forEach((category, idx) => {
  idx = idx + 1;
  // 創建包含卡片的 div
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card mt-2';
  
  // 創建卡片內部的 div
  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'card-body p-2';
  
  // 創建對齊方式的 div
  const alignDiv = document.createElement('div');
  alignDiv.className = 'd-flex align-items-center';
  alignDiv.id = 'btn_sdg';
  alignDiv.setAttribute('name', idx.toString().padStart(2, '0'));
  
  // 創建圖片元素
  const img = document.createElement('img');
  img.alt = '';
  img.className = 'mr-2';
  img.src = category.thumbnail;
  img.style.width = '50px';
  
  // 創建段落元素
  const p = document.createElement('p');
  p.className = 'mb-0';
  p.textContent = `${category.title}`;
  
  // 將圖片和段落添加到 alignDiv 中
  alignDiv.appendChild(img);
  alignDiv.appendChild(p);
  
  // 將 alignDiv 添加到 cardBodyDiv 中
  cardBodyDiv.appendChild(alignDiv);
  
  // 將 cardBodyDiv 添加到 cardDiv 中
  cardDiv.appendChild(cardBodyDiv);
  
  // 將 cardDiv 添加到目標容器中
  weight_container.appendChild(cardDiv);
});
