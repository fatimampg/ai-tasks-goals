interface DateStartEndInputProps {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  handleRequestTasks: () => void;
}
const DateStartEndInput = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleRequestTasks,
}: DateStartEndInputProps) => {
  return (
    <div className="sidebar__search-box">
      <div className="sidebar__text-date-pair">
        <label htmlFor="date_start" style={{ fontSize: "16px" }}>
          From:
        </label>
        <input
          type="date"
          id="date_start"
          name="date-start"
          className="sidebar__date-input"
          value={startDate}
          data-testid="startDate"
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        />
      </div>
      <div className="sidebar__text-date-pair">
        <label
          htmlFor="date_end"
          style={{ fontSize: "16px", paddingRight: "19px" }}
        >
          {" "}
          to:
        </label>
        <input
          type="date"
          id="date_end"
          name="date_end"
          className="sidebar__date-input"
          value={endDate}
          data-testid="endDate"
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />
      </div>
      <button
        className="sidebar__button-secondary"
        style={{ marginTop: "15px" }}
        onClick={handleRequestTasks}
      >
        Search tasks{" "}
      </button>
    </div>
  );
};

export default DateStartEndInput;
