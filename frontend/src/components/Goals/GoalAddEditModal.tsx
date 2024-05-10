import { formatMonthYear } from "../../utils/formatDate";

interface GoalAddEditModalProps {
  updatedDescription: string;
  updatedCategory: string;
  updatedMonth: number;
  updatedYear: number;
  onUpdateDescription: (value: string) => void;
  onUpdateCategory: (value: string) => void;
  onUpdateMonth: (value: number) => void;
  onUpdateYear: (value: number) => void;
  onSave: () => void;
  onClose: () => void;
}

const GoalAddEditModal: React.FC<GoalAddEditModalProps> = (
  props: GoalAddEditModalProps,
) => {
  const {
    updatedDescription,
    updatedCategory,
    updatedMonth,
    updatedYear,
    onUpdateDescription,
    onUpdateCategory,
    onUpdateMonth,
    onUpdateYear,
    onSave,
    onClose,
  } = props;

  //Format updatedMonth and updatedYear to be displayed as initial value ("YYYY-MM"):
  const fomattedMonth =
    updatedMonth < 10 ? `0${updatedMonth}` : `${updatedMonth}`;
  const monthYearFormat = `${updatedYear}-${fomattedMonth}`;

  //Extract from input (year-month) the month and year and update values to be sent to the DB:
  const handleMonthYearChange = (e: any) => {
    const { month, year } = formatMonthYear(e.target.value);
    onUpdateMonth(parseInt(month));
    onUpdateYear(parseInt(year));
  };

  return (
    <div>
      <div className="modal__container">
        <div className="modal__info-key-value">
          <h3>Description:</h3>
          <textarea
            form=""
            maxLength={150}
            name="goalDescription"
            id="goalDescription"
            wrap="soft"
            className="taskDescriptionModal"
            value={updatedDescription}
            onChange={(e) => onUpdateDescription(e.target.value)}
            placeholder="Enter description (max. 150 chars.)"
          />
        </div>

        <div className="modal__info-key-value">
          <h3>Category:</h3>
          <select
            id="category"
            name="category"
            className="taskCategoryModal"
            value={updatedCategory}
            onChange={(e) => onUpdateCategory(e.target.value)}
          >
            <option value="CAREER">Career</option>
            <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
            <option value="HEALTH_AND_WELLNESS">Health and Wellness</option>
            <option value="FINANCIAL">Financial</option>
            <option value="FAMILY_AND_FRIENDS">Family and Friends</option>
            <option value="LEISURE">Leisure</option>
          </select>
        </div>

        <div className="modal__info-key-value">
          <h3>Deadline:</h3>

          <input
            type="month"
            id="month"
            className="sidebar__month-input"
            value={monthYearFormat.toString()}
            onChange={(e) => handleMonthYearChange(e)}
          />
        </div>
      </div>

      <button className="button button--primary" onClick={onSave}>
        Save
      </button>
      <button className="button button--primary" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default GoalAddEditModal;
