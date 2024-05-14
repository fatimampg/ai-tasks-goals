import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch } from "../../store";
import { RootState } from "../../store";
import { fetchGoals, updateGoalListStatus } from "../../store/goalsSlice";
import { fetchTasks } from "../../store/tasksSlice";
import Sidebar from "../../components/Sidebar/Sidebar";
import GoalsList from "../../components/Goals/GoalsList";
import GoalsIdentifiers from "../../components/Goals/GoalsIdentifiers";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "../../components/Toasts/ToastManager";
import {
  Goal,
  Task,
  FetchGoalsParams,
  FetchTasksParams,
  GoalStatusUpdate,
} from "../../types";
import "../../components/Sidebar/sidebar.css";
import "./progress.css";
import "../Dashboard/tasksAndGoals.css";

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

  // 1. Initialize with an empty array of goals:
  const [goalList, setGoalList] = useState<Goal[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [goalStatusUpdateList, setGoalStatusUpdateList] = useState<
    GoalStatusUpdate[]
  >([]);

  const [id, setId] = useState<number>(); // id of the progress stored in the database

  // 2. Get the month and year selected by the user in the Sidebar:
  const goalsMonth = useSelector(
    (state: RootState) => state.searchDates.goalsMonth,
  );
  useEffect(() => {
    if (goalsMonth) {
      setMonth(goalsMonth?.month);
      setYear(goalsMonth?.year);
    }
  }, [goalsMonth]);

  // 3. Get auth header:
  const header = useSelector((state: RootState) => state.auth.header);

  // 4. Get TaskList and GoalList from Redux Store and allow updating the updatedGoalList (rendered) based on redux store:
  const storeGoalList = useSelector((state: RootState) => state.goals.goalList);
  const storeTaskList = useSelector((state: RootState) => state.tasks.taskList);
  const [updatedGoalList, setUpdatedGoalList] = useState<Goal[]>(storeGoalList);
  useEffect(() => {
    setUpdatedGoalList(storeGoalList);
  }, [storeGoalList]);

  // 5. LOAD PROGRESS ANALYSIS - Fetch previous AI progress analysis (summary and recommendations):
  const handleLoadProgress = async () => {
    setIsDataLoading(true);
    if (!month || !year) {
      toast.show({
        message: "Please select month and year.",
        duration: 2500,
        type: "error",
      });
      setIsDataLoading(false);
      return;
    } else {
      // 5.1. Request goals list:
      const params: FetchGoalsParams = {
        month: month,
        year: year,
      };
      await dispatch(fetchGoals(params));

      // 5.2. Fetch summary and recommendation:
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
          setFirstLoadProgress(true);

          if (response.data.data && response.data.data.length > 0) {
            setPreviousAnalysisExists(true);
            setSummary(response.data.data[0].summary);
            setRecommendations(response.data.data[0].recommendations);
            setId(response.data.data[0].id);
          } else {
            setPreviousAnalysisExists(false);
          }
          setIsDataLoading(false);
        } catch (error: any) {
          console.log(error);
          setIsDataLoading(false);
        }
      };
      fetchSummaryAndRecommendations({ month, year });
    }
  };

  // 6. RUN NEW AI ANALYSIS: Request new AI progress analysis:
  const handleRequestNewProgress = async () => {
    try {
      setIsDataLoading(true);
      setAnalysisRequested(true);
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
    if (initialFetchCompleted) {
      setGoalList(storeGoalList);
      setUpdatedGoalList(storeGoalList);
      setTaskList(storeTaskList);
    }
  }, [initialFetchCompleted]);

  // 6.3. Send the goals and tasks list to the BE and request new AI progress analysis:
  useEffect(() => {
    console.log("REQUESTING NEW AI ANALYSIS!");
    if (
      storeGoalList.length > 0 &&
      storeTaskList.length > 0 &&
      analysisRequested
    ) {
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
          setSummary(analysis.data.summary);
          setRecommendations(analysis.data.recommendations);
          console.log("status array to update", analysis.data.status);
          setGoalStatusUpdateList(analysis.data.status);
          // 6.4. Update the status of each goal, in goalList (updatedList):
          const updatedStatusList = analysis.data.status;

          if (updatedGoalList?.length === updatedStatusList?.length) {
            const updatedList = updatedGoalList.map((goal: Goal) => {
              const updatedGoalStatus = updatedStatusList.find(
                (update: GoalStatusUpdate) => update.id === goal.id,
              );
              if (updatedGoalStatus) {
                return { ...goal, status: updatedGoalStatus.status };
              }
              return goal;
            });
            setUpdatedGoalList(updatedList);
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

  // 7. SAVE RESULTS - Save results from the AI analysis:
  const handleSaveResults = () => {
    setIsDataLoading(true);
    // 7.1. Send to the database the updated goals list (status):
    const params: Goal[] = updatedGoalList;
    dispatch(updateGoalListStatus(params));

    // 7.2. Send to the database the summary and recommendations
    if (summary && recommendations) {
      if (previousAnalysisExists) {
        //Update existing progress in the DB if the entry already exists:
        const updateProgress = async () => {
          try {
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
        // Add new entry to the database:
        const addNewProgress = async () => {
          try {
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

  // 8. Clear all fields when month and year are changed:
  useEffect(() => {
    setFirstLoadProgress(false);
    setSummary("");
    setRecommendations("");
    setUpdatedGoalList([]);
    setGoalList([]);
    setNewAnalisisDone(false);
  }, [goalsMonth]);

  return (
    <div>
      {isDataLoading && <LoadingSpinner />}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="main-page">
        <div className="dashboard__main-container">
          <div className="dashboard__progress-top-info">
            <div className="dashboard__title-welcome">
              {!firstLoadProgress ? (
                <>
                  <h2
                    className="message-warning"
                    style={{ marginBottom: "24px" }}
                  >
                    Please choose the month you'd like to assess your progress
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
            <div style={{ marginTop: summary ? "20px" : "80px" }}>
              <GoalsIdentifiers />
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
