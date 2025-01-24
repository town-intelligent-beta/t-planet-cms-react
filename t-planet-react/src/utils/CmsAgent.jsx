import { plan_submit, createFormData } from "./Plan";

const CMS_PROJECT_SUBMIT_PAGES = [
  "cms_plan_info",
  "cms_sdgs_setting",
  "cms_impact",
  "cms_contact_person",
];

const CMS_SUPPORT_FORMAT = ["cms_missions_display", "cms_deep_participation"];

const getPageIndex = (page) => {
  const supportFormatIndex = CMS_SUPPORT_FORMAT.indexOf(page);
  if (supportFormatIndex !== -1) return 3;

  return CMS_PROJECT_SUBMIT_PAGES.indexOf(page);
};

const getIndexPage = (index) => {
  return CMS_PROJECT_SUBMIT_PAGES[index];
};

const navigateTo = (path) => {
  window.location.href = path;
};

// Submit form data & preview
export const handlePreview = async (event, projectData, id) => {
  event.preventDefault();
  try {
    const formData = createFormData(projectData);

    // 提交表單邏輯
    const response = await plan_submit(formData, id);
    navigateTo(`/backend/cms_project_detail/${id}`);
    console.log("Form submission response:", response);
  } catch (error) {
    console.error("Error during form submission:", error);
  }
};

// Previous page
export const handlePrevious = (event, id) => {
  const path = window.location.pathname;
  const segments = path.split("/");
  const page = segments[2];
  const currentIndex = getPageIndex(page);

  event.preventDefault();
  if (page === "cms_missions_display") {
    navigateTo(`/backend/cms_impact`);
  } else if (currentIndex > 0) {
    navigateTo(`/backend/${getIndexPage(currentIndex - 1)}/${id}`);
  } else {
    navigateTo(`/backend/${getIndexPage(0)}/${id}`);
  }
};

// Submit form data & to next page
export const handleNextPage = async (event, projectData, id) => {
  const path = window.location.pathname;
  const segments = path.split("/");
  const page = segments[2];
  const currentIndex = getPageIndex(page);

  event.preventDefault();
  try {
    const formData = createFormData(projectData);
    // 提交表單邏輯
    const response = await plan_submit(formData, id);
    if (currentIndex < CMS_PROJECT_SUBMIT_PAGES.length - 1) {
      navigateTo(`/backend/${getIndexPage(currentIndex + 1)}/${id}`);
    } else {
      navigateTo(
        `/backend/${getIndexPage(CMS_PROJECT_SUBMIT_PAGES.length - 1)}/${id}`
      );
    }
    console.log("Form submission response:", response);
  } catch (error) {
    console.error("Error during form submission:", error);
  }
};

// Submit form data
export const handleSave = async (event, projectData, id) => {
  event.preventDefault();
  try {
    const formData = createFormData(projectData);

    // 提交表單邏輯
    const response = await plan_submit(formData, id);
    alert("儲存成功");
    console.log("Form submission response:", response);
  } catch (error) {
    console.error("Error during form submission:", error);
  }
};

// const ProjectNavigation = ({ projectData }) => {
//   const [currentPage, setCurrentPage] = useState("");
//   const [uuid, setUuid] = useState("");
//   //const [task, setTask] = useState("");

//   // get path and uuid
//   useEffect(() => {
//     const path = window.location.pathname;
//     const uuid = path.split("/").pop();
//     const segments = path.split("/");
//     const cmsSegment = segments[2];
//     setUuid(uuid);
//     setCurrentPage(cmsSegment);

//     // const params = new URLSearchParams(window.location.search);
//     // setUuid(params.get("uuid"));
//     // setTask(params.get("task"));
//   }, []);

//   const buildUrlParams = () => {
//     const params = new URLSearchParams();
//     if (uuid) params.append("uuid", uuid);
//     if (task) params.append("task", task);
//     return params.toString() ? `?${params.toString()}` : "";
//   };

//   // Previous page
//   const handlePrevious = (e) => {
//     e.preventDefault();
//     const currentIndex = getPageIndex(currentPage);

//     if (currentPage === "cms_missions_display") {
//       navigateTo(`/backend/cms_impact/${buildUrlParams()}`);
//     } else if (currentIndex > 0) {
//       navigateTo(
//         `/backend/${getIndexPage(currentIndex - 1)}${buildUrlParams()}`
//       );
//     } else {
//       navigateTo(`/backend/${getIndexPage(0)}${buildUrlParams()}`);
//     }
//   };

//   const handleSubmit = async ({ projectData }) => {
//     const currentIndex = getPageIndex(currentPage);

//     // Create and populate form data
//     // const formData = new FormData();
//     // if (typeof window.append_plan_submit_data === "function") {
//     //   window.append_plan_submit_data(currentPage, formData);
//     // }

//     // // Submit form data
//     // if (typeof onSubmit === "function") {
//     //   await onSubmit(formData, uuid);
//     // }

//     // // Handle special cases for cms_impact.html
//     // if (currentPage === "cms_impact") {
//     //   await handleImpactPageSubmit();
//     // }

//     // Handle special cases for cms_deep_participation.html
//     if (currentPage === "cms_deep_participation") {
//       if (
//         typeof window.child_task_submit === "function" &&
//         !window.child_task_submit(currentPage)
//       ) {
//         return;
//       }
//     }

//     const formData = createFormData(projectData);
//     await plan_submit(formData, projectData.id);

//     // Handle navigation based on button clicked
//     // switch (buttonId) {
//     //   case "btn_ab_project_next":
//     //     handleNextNavigation(currentIndex);
//     //     break;
//     //   case "btn_cms_plan_save":
//     //     alert("儲存成功");
//     //     break;
//     //   case "btn_cms_plan_preview":
//     //     window.open(`/backend/cms_project_detail/${uuid}`, "_blank");
//     //     break;
//     // }
//   };

//   const handlePreview = async ({ projectData }) => {
//     await handleSubmit({ projectData });
//     alert("儲存成功");
//     //window.open(`/backend/cms_project_detail/${uuid}`, "_blank");
//   };

//   // Submit to next page
//   const handleNextNavigation = (currentIndex) => {
//     if (currentPage === "cms_contact_person") {
//       navigateTo(`/backend/cms_project_detail/${uuid}`);
//     } else if (currentPage === "cms_deep_participation") {
//       navigateTo(`/backend/cms_impact/${buildUrlParams()}`);
//     } else if (currentIndex < CMS_PROJECT_SUBMIT_PAGES.length - 1) {
//       navigateTo(
//         `/backend/${getIndexPage(currentIndex + 1)}${buildUrlParams()}`
//       );
//     } else {
//       navigateTo(
//         `/backend/${getIndexPage(
//           CMS_PROJECT_SUBMIT_PAGES.length - 1
//         )}${buildUrlParams()}`
//       );
//     }
//   };

//   const handleImpactPageSubmit = async () => {
//     try {
//       const result = await window.list_plan_tasks?.(uuid, 1);
//       if (!result?.result) return;

//       for (const taskId of result.tasks) {
//         const formData = new FormData();
//         try {
//           // Populate form data
//           formData.append("uuid", uuid);
//           formData.append("task", taskId);
//           formData.append("email", localStorage.getItem("email"));

//           // Get form field values
//           ["name", "task_start_date", "task_due_date", "overview"].forEach(
//             (field) => {
//               const element = document.getElementById(
//                 `parent_task_${field}_${taskId}`
//               );
//               if (element) formData.append(field, element.value);
//             }
//           );

//           const gpsFlag = document.getElementById(`gps_flag_${taskId}`);
//           if (gpsFlag) formData.append("gps_flag", gpsFlag.checked);

//           // Submit task
//           await window.task_submit?.(formData);

//           // Handle NFT creation
//           const taskName = document.getElementById(
//             `parent_task_name_${taskId}`
//           )?.value;
//           const overview = document.getElementById(
//             `parent_task_overview_${taskId}`
//           )?.value;

//           if (taskName && overview) {
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(overview, "text/html");
//             const description = doc.body.firstChild?.innerText;

//             if (
//               typeof window.make_attrubute === "function" &&
//               typeof window.mintNFT === "function"
//             ) {
//               const attribute = window.make_attrubute();
//               await window.mintNFT({
//                 uuid_project: uuid,
//                 uuid_task: taskId,
//                 name: taskName,
//                 description,
//                 attribute,
//               });
//             }
//           }
//         } catch (error) {
//           console.error("Error processing task:", error);
//         }
//       }
//     } catch (error) {
//       console.error("Error in impact page submission:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-4 w-full">
//       <button
//         type="submit"
//         id="btn_cms_plan_preview"
//         className="btn btn-secondary rounded-pill w-full md:w-1/5"
//         onClick={handlePreview}
//       >
//         檢視
//       </button>
//       <button
//         type="button"
//         id="btn_ab_project_prev"
//         onClick={handlePrevious}
//         className="btn btn-secondary rounded-pill w-full md:w-1/5"
//       >
//         上一步
//       </button>
//       <button
//         type="submit"
//         id="btn_ab_project_next"
//         className="btn btn-dark rounded-pill w-full md:w-1/5"
//       >
//         下一步
//       </button>
//       <button
//         type="submit"
//         id="btn_cms_plan_save"
//         className="btn btn-success rounded-pill w-full md:w-1/5"
//       >
//         儲存草稿
//       </button>
//     </div>
//   );
// };

// export default ProjectNavigation;
