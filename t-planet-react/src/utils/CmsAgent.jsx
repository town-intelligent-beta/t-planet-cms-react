import { plan_submit } from "./Plan";

const getPageIndex = (page) => {
  // Assuming these arrays are imported or defined elsewhere
  const cms_support_format = [];
  const cms_project_submit_pages = [];

  for (let index = 0; index < cms_support_format.length; index++) {
    if (page === cms_support_format[index]) {
      return 3;
    }
  }

  for (let index = 0; index < cms_project_submit_pages.length; index++) {
    if (page === cms_project_submit_pages[index]) {
      return index;
    }
  }
  return null;
};

const getIndexPage = (index) => {
  // Assuming this array is imported or defined elsewhere
  const cms_project_submit_pages = [];
  return cms_project_submit_pages[index];
};

// Preview button handler
export const handlePreviewClick = async (formData, uuid) => {
  await plan_submit(formData, uuid);
  //window.open(`/backend/cms_project_detail/${uuid}`, "_blank");
};

// Previous button handler
export const handlePrevClick = (e) => {
  e.preventDefault();

  // Get current page
  const path = window.location.pathname;
  const page = path.split("/").pop();

  // Get URL parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uuid = urlParams.get("uuid");
  const task = urlParams.get("task");

  // Build parameter string
  let param = "";
  if (uuid) {
    param = `?uuid=${uuid}`;
  }
  if (task) {
    param = param + `&task=${task}`;
  }

  // Get current page index
  const index = getPageIndex(page);

  // Handle navigation
  if (index > 0) {
    if (page === "cms_missions_display") {
      window.location.replace(`cms_impact.html${param}`);
    } else {
      window.location.replace(getIndexPage(index - 1) + param);
    }
  } else {
    window.location.replace(getIndexPage(0) + param);
  }
};

// Next button handler
//   export const handleNextClick = async (e, formData) => {
//     e.preventDefault();

//     // Get current page and parameters
//     const path = window.location.pathname;
//     const page = path.split("/").pop();
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const uuid = urlParams.get("uuid");
//     const task = urlParams.get("task");

//     // Build parameter string
//     let param = "";
//     if (uuid) {
//       param = `?uuid=${uuid}`;
//     }
//     if (task) {
//       param = param + `&task=${task}`;
//     }

//     // Get current page index
//     const index = getPageIndex(page);

//     // Handle form submission and special cases
//     try {
//       // Submit form data
//       await plan_submit(formData, uuid);

//       // Handle special cases
//       if (page === "cms_impact") {
//         await handleImpactPageSubmit(uuid);
//       }

//       if (page === "cms_deep_participation") {
//         if (false === await child_task_submit(page)) {
//           return;
//         }
//       }

//       // Handle navigation
//       if (page === "cms_contact_person") {
//         window.location.replace(`/backend/cms_project_detail/${uuid}`);
//       } else if (page === "cms_deep_participation") {
//         window.location.replace(`/backend/cms_impact.html${param}`);
//       } else if (index < cms_project_submit_pages.length - 1) {
//         window.location.replace(`/backend/${getIndexPage(index + 1)}${param}`);
//       } else {
//         window.location.replace(`/backend/${getIndexPage(cms_project_submit_pages.length - 1)}${param}`);
//       }
//     } catch (error) {
//       console.error("Error handling next click:", error);
//     }
//   };

// Save draft button handler
export const handleSaveDraftClick = async (e, formData) => {
  e.preventDefault();

  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uuid = urlParams.get("uuid");

    await plan_submit(formData, uuid);
    alert("儲存成功");
  } catch (error) {
    console.error("Error saving draft:", error);
    alert("儲存失敗");
  }
};
