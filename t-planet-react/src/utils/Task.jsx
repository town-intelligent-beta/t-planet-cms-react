export const getTaskWeight = async (list_task_UUIDs) => {
  const formdata = new FormData();
  formdata.append("uuid", list_task_UUIDs[0]);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/task_weight`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
};

export const getTaskInfo = async (uuid) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get/${uuid}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
};

export const listChildrenTasks = async (taskUuid) => {
  const formdata = new FormData();
  formdata.append("uuid", taskUuid);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get_child_tasks`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const submitTask = async (formdata) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/new`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const deleteTask = async (uuid) => {
  const formdata = new FormData();
  formdata.append("email", localStorage.getItem("email"));
  formdata.append("uuid", uuid);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/del_task`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const submitTaskCover = async (base64Img, uuid) => {
  const formdata = new FormData();
  formdata.append("uuid", uuid);
  formdata.append("img", base64Img);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/push_task_cover`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
