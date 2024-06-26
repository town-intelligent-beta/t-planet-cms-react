const openBtn = document.querySelector("#open");
const closeBtn = document.querySelector("#close");
const header = document.querySelector("header");
const selectOne = document.querySelector("#selectOne");
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
  version: "AI-Gen-V1.0.0",
  username: "您",
  assistant_name: "Eva",
  message: "您好，我是您的 AI 永續顧問 Eva，有甚麼需要幫助的地方?",
};

const versionEl = document.querySelector("#version");
versionEl.textContent = `版本：` + settings.version;

const greetingsEl = document.querySelector("#greetings");
greetingsEl.textContent = settings.assistant_name + "：" + settings.message;

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
  icon.addEventListener("click", () => {
    removeSDGFromList(icon);
    icon.remove();
    updateInputValue();
  });
};

const btn_sdg = document.querySelectorAll("#btn_sdg");
btn_sdg.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleClickEvent(btn);
  });
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

const checkAndShowModal = () => {
  selectOne.value !== "---請選擇---" && selectTwo.value !== "---請選擇---"
    ? $("#SDGsModal").modal("show")
    : $("#SDGsModal").modal("hide");
};

const updateInputValue = () => {
  const sdgsText =
    list_target_sdgs.length > 0 ? " SDG" + list_target_sdgs.join(", SDG") : "";
  input.value = `我想請問，${selectOneText}列出${selectTwoText}，符合${sdgsText}。`;
};
const updateSubmitButtonState = () => {
  selectOne.value !== "---請選擇---" && selectTwo.value !== "---請選擇---"
    ? (submitBtn.disabled = false)
    : (submitBtn.disabled = true);
};

selectOne.addEventListener("change", () => {
  selectOneText = selectOne.options[selectOne.selectedIndex].text;
  updateInputValue();
  checkAndShowModal();
  updateSubmitButtonState();
});

selectTwo.addEventListener("change", () => {
  selectTwoText = selectTwo.options[selectTwo.selectedIndex].text;
  updateInputValue();
  checkAndShowModal();
  updateSubmitButtonState();
});

submitBtn.addEventListener("click", () => {
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

  const questionEl = document.createElement("p");
  const responseEl = document.createElement("p");
  questionEl.classList.add("p-lg-3", "p-1");
  responseEl.classList.add("bg-gpt-third", "p-lg-3", "p-1", "mb-5", "d-flex", "align-items-start");
  questionEl.id = "question";
  responseEl.id = "response";
  questionEl.textContent = `${settings.username}：${input.value}`;
  chat.appendChild(questionEl);
  chat.appendChild(responseEl);

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  responseEl.appendChild(spinner);

  console.log(JSON.stringify(requestBody))

  fetch("https://beta-llmtwins.4impact.cc/prompt", {
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
      selectOne.value = "---請選擇---";
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
