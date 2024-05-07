import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch } from "../store";
import { RootState } from "../store";
import { fetchGoals, updateGoalListStatus } from "../store/goalsSlice";
import { fetchTasks } from "../store/tasksSlice";
import Sidebar from "../components/Sidebar";
import GoalsList from "../components/GoalsList";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Goal,
  Task,
  FetchGoalsParams,
  FetchTasksParams,
  GoalStatusUpdate,
} from "../types";
import { RotatingLines } from "react-loader-spinner";
import "../styles/sidebar.css";
import "../styles/dashboard.css";
import "../styles/progress.css";
import menu_vertical from "../assets/icons/menu-vertical.svg";

const Progress = () => {
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [previousAnalysisExists, setPreviousAnalysisExists] = useState(false);
  const [firstLoadProgress, setFirstLoadProgress] = useState(false);
  const [newAnalisisDone, setNewAnalisisDone] = useState(false);
  const [analysisRequested, setAnalysisRequested] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // 1. Start with an empty array of goals:
  const [goalList, setGoalList] = useState<Goal[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [goalStatusUpdateList, setGoalStatusUpdateList] = useState<
    GoalStatusUpdate[]
  >([]);

  const [id, setId] = useState<number>(); // id of the progress stored in the database

  // 2. Get the month and year selected by the user in the Sidebar (and update local constants month and year):
  const goalsMonth = useSelector(
    (state: RootState) => state.searchDates.goalsMonth,
  );
  useEffect(() => {
    console.log("PROGRESS: goalsMonth CHECK in progress", goalsMonth);
    if (goalsMonth) {
      setMonth(goalsMonth?.month);
      setYear(goalsMonth?.year);
    }
  }, [goalsMonth]);

  // 3. Get auth header, needed to request progress info to the database:
  const header = useSelector((state: RootState) => state.auth.header);

  // 4. Get TaskList and GoalList from Redux Store and allow updating the updatedGoalList (rendered) when the stored GoalList changes:
  const storeGoalList = useSelector((state: RootState) => state.goals.goalList);
  const storeTaskList = useSelector((state: RootState) => state.tasks.taskList);
  const [updatedGoalList, setUpdatedGoalList] = useState<Goal[]>(storeGoalList);
  useEffect(() => {
    console.log("Stored Goal List (Redux)", storeGoalList);
    setUpdatedGoalList(storeGoalList);
  }, [storeGoalList]);

  // 5. LOAD PROGRESS ANALYSIS - Fetch previous AI progress analysis (summary and recommendations) for a specific month and year (in case it exists in the database):
  const handleLoadProgress = async () => {
    setIsDataLoading(true);
    if (!month || !year) {
      alert("Please insert month and year");
      console.log("Please insert month and year");
      return;
    } else {
      // 5.1. Request list of goals for that month-year:
      const params: FetchGoalsParams = {
        month: month,
        year: year,
      };
      await dispatch(fetchGoals(params));

      // 5.2. Fetch summary and recommendations (progress analysis available in the database):
      const fetchSummaryAndRecommendations = async ({
        month,
        year,
      }: {
        month: number;
        year: number;
      }) => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/progressmonth`,
            {
              params: { month: month, year: year },
              headers: header,
            },
          );
          // console.log(
          //   "Response in Progress request for summary and recommendations - data stored:",
          //   response.data.data,
          // );
          setFirstLoadProgress(true);

          if (response.data.data && response.data.data.length > 0) {
            setPreviousAnalysisExists(true);
            console.log(
              "Progress analysis has already been done for this month.",
            );
            setSummary(response.data.data[0].summary);
            setRecommendations(response.data.data[0].recommendations);
            setId(response.data.data[0].id);
          } else {
            setPreviousAnalysisExists(false);
            console.log(
              "No progress analysis was made for this month. Run analysis and check the results!",
            );
          }
          setIsDataLoading(false);
        } catch (error: any) {
          console.log(error);
          setIsDataLoading(false);
        }
      };
      console.log("handleLoadProgress --> storedGoalList:", storeGoalList);

      fetchSummaryAndRecommendations({ month, year });
    }
  };

  // useEffect(() => {
  //   console.log(
  //     "Previous Analysis Available in the Database?",
  //     previousAnalysisExists,
  //   );
  // }, [previousAnalysisExists]);
  // useEffect(() => {
  //   console.log("First load progress state:", firstLoadProgress);
  // }, [firstLoadProgress]);
  // useEffect(() => {
  //   console.log("newAnalisisDone state:", newAnalisisDone);
  // }, [newAnalisisDone]);

  // 6. RUN NEW AI ANALYSIS: Request new AI progress analysis:
  const handleRequestNewProgress = async () => {
    try {
      setIsDataLoading(true);
      setAnalysisRequested(true);
      if (!month || !year) {
        alert("Please insert month and year");
        console.log("Please insert month and year");
        return;
      } else {
        console.log("REQUESTING NEW AI ANALYSIS!");
        // 6.1. Request list of goals for that month-year:
        const params: FetchGoalsParams = {
          month: month,
          year: year,
        };
        await dispatch(fetchGoals(params));

        // 6.2. Request list of tasks with deadline within that month-year:
        const startMonth = String(month).padStart(2, "0");
        const startDate = `${year}-${startMonth}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${startMonth}-${lastDay}`;
        const dateObjStartDate = new Date(startDate);
        const dateObjEndDate = new Date(endDate);
        const paramsT: FetchTasksParams = {
          gte: dateObjStartDate,
          lte: dateObjEndDate,
        };
        await dispatch(fetchTasks(paramsT));
        setInitialFetchCompleted(true); // Flag used to update the goalList and taskList only after the previous async actions are resolved
        console.log("REQUESTING NEW AI ANALYSIS! - 1) TASKS AND GOALS FETCHED");

        console.log(
          "initialFetchCompleted (fetch tasks and goals lists fulfilled) TRUE",
        );
      }
    } catch (error) {
      console.log(
        "Error fetching goals and tasks to be sent to progress analysis",
        error,
      );
      setIsDataLoading(false);
    }
  };

  // Update local goalList and tasksList after fetching from database:
  useEffect(() => {
    console.log(
      "initialFetchCompleted (fetch tasks and goals lists fulfilled) ?",
      initialFetchCompleted,
    );
    console.log(
      "REQUESTING NEW AI ANALYSIS! - 2) UPDATING LOCAL GOAL AND TASKS LIST BASED ON THE STATE ON REDUX STORE",
    );
    if (initialFetchCompleted) {
      setGoalList(storeGoalList);
      setUpdatedGoalList(storeGoalList);
      setTaskList(storeTaskList);
      // console.log(
      //   "Updating goalList after fetch tasks and goals lists are fulfilled",
      //   storeGoalList,
      // );
      // console.log(
      //   "Updating taskList after fetch tasks and goals lists are fulfilled",
      //   storeTaskList,
      // );
    }
  }, [initialFetchCompleted]);

  // useEffect(() => {
  //   console.log(
  //     "Updated goalList after fetch tasks and goals lists are fulfilled",
  //     goalList,
  //   );
  //   console.log(
  //     "Updated taskList after fetch tasks and goals lists are fulfilled",
  //     taskList,
  //   );
  // }, [goalList, taskList]);
  // useEffect(() => {
  //   console.log("Initial fetch completed?", initialFetchCompleted);
  //   console.log("storedGoalList", storeGoalList);
  //   console.log("storedTaskList", storeTaskList);
  // }, [initialFetchCompleted]);

  // 6.3. Send the fetched goals and tasks list to the BE and request new AI progress analysis:
  useEffect(() => {
    console.log(
      "REQUESTING NEW AI ANALYSIS! - 3) SENDING GOAL AND TASKS LIST AND RUN AI ANALYSIS",
    );
    if (
      storeGoalList.length > 0 &&
      storeTaskList.length > 0 &&
      analysisRequested
    ) {
      // console.log(
      //   "tasks and goalsList length",
      //   goalList.length,
      //   taskList.length,
      // );
      const fetchNewProgress = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/analyse`,
            {
              tasks: storeTaskList,
              goals: storeGoalList,
            },
            { headers: header },
          );

          const analysis = response.data;
          setNewAnalisisDone(true);
          // console.log("summary", analysis.data.summary);
          setSummary(analysis.data.summary);
          // console.log("recommendations", analysis.data.recommendations);
          setRecommendations(analysis.data.recommendations);
          console.log("status array to update", analysis.data.status);
          setGoalStatusUpdateList(analysis.data.status);
          console.log(
            "REQUESTING NEW AI ANALYSIS! - 4) UPDATE LOCAL SUMMARY AND RECOMMENDATIONS",
          );
          // 6.4. Update the status of each goal, in goalList (updatedList):
          const updatedStatusList = analysis.data.status;
          // console.log("UPDATED STATUS LENGHT", updatedStatusList.length);
          // console.log("GOAL LIST LENGHT", updatedGoalList.length);
          // console.log("UPDATED STATUS ", updatedStatusList);
          // console.log("UPDATED GOAL LIST", updatedGoalList);

          if (updatedGoalList?.length === updatedStatusList?.length) {
            console.log("INSIDE THE FIRST IF");
            // const updatedList = goalList.map((goal: Goal) => {
            const updatedList = updatedGoalList.map((goal: Goal) => {
              const updatedGoalStatus = updatedStatusList.find(
                (update: GoalStatusUpdate) => update.id === goal.id,
              );
              if (updatedGoalStatus) {
                console.log("INSIDE THE SECOND IF");
                return { ...goal, status: updatedGoalStatus.status };
              }
              return goal;
            });
            console.log(
              "REQUESTING NEW AI ANALYSIS! - 5) UPDATING THE STATUS IN GOAL LIST",
            );
            setUpdatedGoalList(updatedList);
            console.log(
              "GOAL LIST WITH UPDATED STATUS - after AI progress analysis",
              updatedList,
            );
          }
          setIsDataLoading(false);

          return analysis;
        } catch (error: any) {
          console.log(error);
          setIsDataLoading(false);
        }
      };
      fetchNewProgress();
      setInitialFetchCompleted(false);
      setAnalysisRequested(false);
    } else {
      console.log("NO TASKS AND/OR GOALS WHERE SET FOR THIS MONTH");
      setNewAnalisisDone(false);
      setAnalysisRequested(false);
    }
  }, [initialFetchCompleted]);

  // useEffect(() => {
  //   console.log("summary local", summary);
  //   console.log("recommendations local", recommendations);
  //   console.log("updated goals status local", goalStatusUpdateList);
  // }, [summary, recommendations, goalStatusUpdateList]);

  // 7. SAVE RESULTS - Save results from the AI analysis:
  const handleSaveResults = () => {
    setIsDataLoading(true);
    console.log("SAVING RESULTS FROM THE LAST AI ANALYSIS");
    // 7.1. Send to the database the updated goals list (status):
    const params: Goal[] = updatedGoalList;

    dispatch(updateGoalListStatus(params));
    // console.log(
    //   "Updated Status Goal List - sent to Redux store to update the DB [updateGoalListStatus]",
    //   params,
    // );
    // console.log("summary and recomendations - local", summary, recommendations);

    // 7.2. Send to the database the summary and recommendations
    if (summary && recommendations) {
      if (previousAnalysisExists) {
        //PUT request - update existing progress in the DB if the entry already exists:
        // console.log("Need to update entry in the database");
        // console.log("id of the progress entry to be updated", id);
        console.log(
          "SAVING RESULTS FROM THE LAST AI ANALYSIS - UPDATING PROGRESS",
        );
        const updateProgress = async () => {
          try {
            console.log(
              "starting to ask request to update the DB in recommendations and summary",
            );
            const response = await axios.put(
              `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/progress/${id}`,
              {
                month: month,
                year: year,
                summary: summary,
                recommendations: recommendations,
              },
              { headers: header },
            );

            const updatedProgress = response.data;
            console.log(
              "Progress successfully stored/updated in the database",
              updatedProgress,
            );
            setIsDataLoading(false);
          } catch (error: any) {
            console.log(
              "Error - progress summary and recommendation were not updated",
              error,
            );
            setIsDataLoading(false);
          }
        };
        updateProgress();
      } else {
        // POST request - Add new entry to the database:
        console.log("Create new entry in the database");
        console.log(
          "SAVING RESULTS FROM THE LAST AI ANALYSIS - ADD NEW ENTRY (PROGRESS)",
        );
        const addNewProgress = async () => {
          try {
            console.log("Inside addNewProgress");
            const response = await axios.post(
              `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/addprogress`,
              {
                month: month,
                year: year,
                summary: summary,
                recommendations: recommendations,
              },
              { headers: header },
            );
            const addedNewProgress = response.data.data;
            console.log(
              "response obtained after adding new progress entry",
              response,
            );
            console.log("New Progress added into the database:", response.data);
            return addedNewProgress;
            setIsDataLoading(false);
          } catch (error) {
            console.log(
              "Progress has not been updated. Please try again.",
              error,
            );
            setIsDataLoading(false);
          }
        };
        addNewProgress();
      }
    }
    setNewAnalisisDone(false);
  };

  // useEffect(() => {
  //   console.log("Analysis requested status:", analysisRequested);
  // }, [analysisRequested]);
  useEffect(() => {
    console.log("UPDATED GOAL LIST:", updatedGoalList);
  }, [updatedGoalList]);
  // useEffect(() => {
  //   console.log("STORE GOAL LIST:", storeGoalList);
  // }, [storeGoalList]);

  // 8. Clear all fields when month and year are changed:
  useEffect(() => {
    setFirstLoadProgress(false);
    setSummary("");
    setRecommendations("");
    setUpdatedGoalList([]);
    setGoalList([]);
    setNewAnalisisDone(false);
    console.log("month and year changed...");
  }, [goalsMonth]);

  return (
    <div>
      {isDataLoading && <LoadingSpinner />}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="tasks-page">
        <div className="dashboard__main-container">
          <div className="dashboard__progress-top-info">
            <div className="dashboard__title-welcome">
              {!firstLoadProgress ? (
                <>
                  <h2
                    className="message-warning"
                    style={{ marginBottom: "24px" }}
                  >
                    "Please choose the month you'd like to assess your progress
                    and click on "Load progress analysis":
                  </h2>
                </>
              ) : (
                <div style={{ flexDirection: "row" }}>
                  <h2 className="message-warning">
                    {previousAnalysisExists
                      ? "Results obtained from the previous analysis:"
                      : "AI progress analysis has not been done for this month:"}
                  </h2>
                  <h4 className="message-warning-secondary">
                    (If changes were made in task progress, it is recommended to
                    reanalize the progress by clicking on the "Run new AI
                    analysis" button).
                  </h4>
                </div>
              )}
            </div>
            <div className="sidebar__progress-button">
              <button
                className="sidebar__button-primary"
                onClick={handleLoadProgress}
                style={{
                  backgroundColor: !firstLoadProgress
                    ? "var(--color-button-primary-bg)"
                    : "var(--light-grey-bg)",
                  borderColor: !firstLoadProgress
                    ? "var(--color-button-primary-bg)"
                    : !firstLoadProgress
                      ? "var(--color-button-primary-bg)"
                      : "var(--light-grey-bg)",
                }}
              >
                {" "}
                Load progress analysis{" "}
              </button>
              <button
                className="sidebar__button-primary"
                onClick={handleRequestNewProgress}
                style={{
                  display: !firstLoadProgress ? "none" : "initial",
                }}
              >
                {firstLoadProgress && previousAnalysisExists
                  ? "Run new AI analysis"
                  : "Run AI analysis"}
              </button>
              <button
                className="sidebar__button-primary"
                onClick={handleSaveResults}
                style={{
                  display: !firstLoadProgress ? "none" : "initial",
                  backgroundColor: newAnalisisDone
                    ? "var(--purple)"
                    : "var(--light-grey-bg)",
                  borderColor: newAnalisisDone
                    ? "var(--purple)"
                    : "var(--light-grey-bg)",
                }}
              >
                Save results
              </button>
            </div>
            <div className="progress__info-key-value">
              <h3>Summary:</h3>
              <h3 className="progressSummary">{summary}</h3>
            </div>
            <div className="progress__info-key-value">
              <h3>Recommendations:</h3>
              <h3 className="progressRecommendations">{recommendations}</h3>
            </div>
            {newAnalisisDone && (
              <h3 className="message-warning" style={{ paddingTop: "35px" }}>
                {" "}
                Updated goals' status:
              </h3>
            )}
            <div
              className="dashboard__identifiers__goals"
              style={{ marginTop: summary ? "20px" : "80px" }}
            >
              <h3 style={{ paddingLeft: "4px" }}>Categ.:</h3>
              <h3>Description:</h3>
              <h3>Achieved:</h3>
              <h3>
                In <br />
                progress:
              </h3>
              <h3>
                Needs <br />
                improvement:
              </h3>
              <img src={menu_vertical} alt="menu_vertical" id="menu_vertical" />
            </div>
          </div>
          <div className="dashboard__progress-list-container">
            <GoalsList goals={updatedGoalList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
