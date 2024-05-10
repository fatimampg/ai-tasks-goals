// import "./sidebar.css";

interface MonthInputProps {
  monthYear: string;
  setMonthYear: (value: string) => void;
}
const MonthInput = ({ monthYear, setMonthYear }: MonthInputProps) => {
  return (
    <div className="sidebar__search-box">
      <div className="sidebar__insert--date">
        <label htmlFor="month" style={{ fontSize: "16px" }}>
          {" "}
          Month:
        </label>
        <input
          type="month"
          id="month"
          className="sidebar__month-input"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MonthInput;
