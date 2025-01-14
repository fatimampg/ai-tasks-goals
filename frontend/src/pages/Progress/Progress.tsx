import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch, RootState } from "../../store";
import { fetchGoals, updateGoalListStatus } from "../../store/goalsSlice";
import Sidebar from "../../components/Sidebar/Sidebar";
import GoalsList from "../../components/Goals/GoalsList";
import GoalsIdentifiers from "../../components/Goals/GoalsIdentifiers";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "../../components/Toasts/ToastManager";
import { Goal, GoalStatusUpdate } from "../../types";
import "../../components/Sidebar/sidebar.css";
import "./progress.css";
import "../Dashboard/tasksAndGoals.css";

const Progress = () => {
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [previousAnalysisExists, setPreviousAnalysisExists] = useState(false);
  const [progressId, setProgressId] = useState<number>();
  const [firstLoadProgress, setFirstLoadProgress] = useState(false);
  const [newResultsToBeSaved, setNewResultsToBeSaved] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const goalsMonth = useSelector(
    (state: RootState) => state.searchDates.goalsMonth,
  );
  useEffect(() => {
    if (goalsMonth) {
      setMonth(goalsMonth?.month);
      setYear(goalsMonth?.year);
    }
  }, [goalsMonth]);
  const header = useSelector((state: RootState) => state.auth.header);
  const isSideBarOpen = useSelector((state: RootState) => state.searchDates.sidebarOpen);
  const storeGoalList = useSelector((state: RootState) => state.goals.goalList);
  const [displayedGoalList, setDisplayedGoalList] =
    useState<Goal[]>(storeGoalList);
  
  useEffect(() => {
    setDisplayedGoalList(storeGoalList);
  }, [storeGoalList]);

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
      const params: { month: number; year: number } = {
        month: month as number,
        year: year as number,
      };
      await dispatch(fetchGoals(params));

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
            setProgressId(response.data.data[0].id);
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

  const handleRequestNewAnalysis = async () => {
    try {
      setIsDataLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/analyse`,
        {
          params: { month: month, year: year },
          headers: header,
        },
      );
      const analysis = response.data;
      setSummary(analysis.data.summary);
      setRecommendations(analysis.data.recommendations);
      setNewResultsToBeSaved(true);
      const updatedStatusList: GoalStatusUpdate[] = analysis.data.status;
      const updatedList: Goal[] = displayedGoalList.map((goal) => {
        const newGoalStatus = updatedStatusList.find(
          (updated: GoalStatusUpdate) => updated.id === goal.id,
        );
        return newGoalStatus ? { ...goal, status: newGoalStatus.status } : goal;
      });
      setDisplayedGoalList(updatedList);
      setIsDataLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsDataLoading(false);
    }
  };

  const handleSaveResults = async () => {
    setIsDataLoading(true);

    const params: Goal[] = displayedGoalList;
    dispatch(updateGoalListStatus(params));

    if (summary && recommendations) {
      try {
        const endpoint = previousAnalysisExists
          ? `/api/progress/${progressId}`
          : `/api/addprogress`;

        const method = previousAnalysisExists ? "put" : "post";

        const response = await axios[method](
          `${import.meta.env.VITE_REACT_APP_AUTH_URL}${endpoint}`,
          {
            month: month,
            year: year,
            summary: summary,
            recommendations: recommendations,
          },
          { headers: header },
        );
        console.log("Progress saved successfully", response.data);
      } catch (e) {
        console.log("Progress has not been updated. Please try again.", e);
      } finally {
        setIsDataLoading(false);
        setNewResultsToBeSaved(false);
      }
    } else {
      setIsDataLoading(false);
      setNewResultsToBeSaved(false);
    }
  };

  useEffect(() => {
    setFirstLoadProgress(false);
    setSummary("");
    setRecommendations("");
    setDisplayedGoalList([]);
    setNewResultsToBeSaved(false);
  }, [goalsMonth]);

  return (
    <div>
      {isDataLoading && <LoadingSpinner />}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className={`main-page-progress ${!isSideBarOpen ? '' : 'slide-up'}`}>
        <div className="dashboard__main-container">
          <div className="dashboard__progress-top-info">
            <div className="dashboard__title-welcome">
              {!firstLoadProgress ? (
                <>
                  <h4
                    className="message-warning"
                  >
                    Please choose the month you'd like to assess your progress
                    and click on "Load progress analysis":
                  </h4>
                </>
              ) : (
                <div style={{ flexDirection: "row" }}>
                  <h2 className="message-warning">
                    {previousAnalysisExists
                      ? "Results obtained from the previous analysis:"
                      : "AI progress analysis has not performed for this month."}
                    </h2>
                    {previousAnalysisExists && (
                      <h4 className="message-warning-secondary">
                        (If changes were made in task progress, it is recommended to
                        reanalize the progress by clicking on the "Run new AI
                        analysis" button).
                      </h4>
                    )}
                </div>
              )}
            </div>
            <div className="progress-container-buttons">
              <button
                className="button button--primary"
                id="load-progress-button"
                onClick={handleLoadProgress}
                disabled={firstLoadProgress}
              >
                {" "}
                Load progress analysis{" "}
              </button>
              {displayedGoalList.length > 0 && (
                <>
                  <button
                    className="button button--primary"
                    onClick={handleRequestNewAnalysis}
                    style={{
                      display: !firstLoadProgress ? "none" : "initial",
                    }}
                  >
                    {firstLoadProgress && previousAnalysisExists
                      ? "Run new AI analysis"
                      : "Run AI analysis"}
                  </button>
                  <button
                    className="button button--primary"
                    onClick={handleSaveResults}
                    style={{
                      display: !firstLoadProgress ? "none" : "initial",
                    }}
                    disabled={!newResultsToBeSaved}
                  >
                    Save results
                  </button>
                </>
              )}
            </div>
            <div className="progress__info-key-value">
              <h3>Summary:</h3>
              <p className="progressSummary">{summary}</p>
            </div>
            <div className="progress__info-key-value">
              <h3>Recommendations:</h3>
              <p className="progressRecommendations">{recommendations}</p>
            </div>
            {newResultsToBeSaved && (
              <h3 className="message-warning" style={{ paddingTop: "35px" }}>
                {" "}
                Updated goals' status:
              </h3>
            )}
            <div style={{ marginTop: summary ? "20px" : "80px" }}>
              <GoalsIdentifiers />
            </div>
          </div>
          {firstLoadProgress && (
            <div className="dashboard__progress-list-container">
              <GoalsList goals={displayedGoalList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;