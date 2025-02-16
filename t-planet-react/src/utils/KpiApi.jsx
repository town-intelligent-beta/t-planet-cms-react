import { useState, useEffect } from "react";
import { plan_info, list_plan_tasks, getProjectWeight } from "./Plan";

export const fetchTotalProjectWeight = async (listProjectUuids) => {
  return {
    "sdgs-1": 24,
    "sdgs-2": 5,
    "sdgs-3": 1,
    "sdgs-4": 41,
    "sdgs-5": 23,
    "sdgs-6": 19,
    "sdgs-7": 1,
    "sdgs-8": 0,
    "sdgs-9": 0,
    "sdgs-10": 0,
    "sdgs-11": 34,
    "sdgs-12": 25,
    "sdgs-13": 17,
    "sdgs-14": 2,
    "sdgs-15": 19,
    "sdgs-16": 0,
    "sdgs-17": 23,
    "sdgs-18": 18,
    "sdgs-19": 17,
    "sdgs-20": 17,
    "sdgs-21": 37,
    "sdgs-22": 17,
    "sdgs-23": 18,
    "sdgs-24": 18,
    "sdgs-25": 37,
    "sdgs-26": 19,
    "sdgs-27": 17,
  };
};

const useProjectCounts = (listProjectUuids) => {
  const [projectCounts, setProjectCounts] = useState({});

  useEffect(() => {
    const updateCounts = async () => {
      const counts = {};
      for (const uuid of listProjectUuids) {
        try {
          const projectInfo = await plan_info(uuid); // 獲取項目資訊
          const parentTasks = await list_plan_tasks(projectInfo.uuid, 1); // 獲取父任務
          const weight = getProjectWeight(parentTasks.tasks); // 獲取權重

          // 累加權重
          for (let i = 1; i <= 27; i++) {
            const key = `sdgs-${i}`;
            if (weight[key] && weight[key] !== "0") {
              counts[key] = (counts[key] || 0) + 1;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setProjectCounts(counts);
    };

    if (listProjectUuids.length > 0) {
      updateCounts();
    }
  }, [listProjectUuids]);

  return projectCounts;
};
