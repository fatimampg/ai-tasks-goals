interface TaskAddEditModalProps {
  updatedDescription: string;
  updatedDeadline: Date;
  updatedPriority: string;
  updatedCategory: string;
  onUpdateDescription: (value: string) => void;
  onUpdatePriority: (value: string) => void;
  onUpdateCategory: (value: string) => void;
  onUpdateDeadline: (value: Date) => void;
  onSave: () => void;
  onClose: () => void;
}

const TaskAddEditModal: React.FC<TaskAddEditModalProps> = (
  props: TaskAddEditModalProps,
) => {
  const {
    updatedDescription,
    updatedDeadline,
    updatedPriority,
    updatedCategory,
    onUpdateDescription,
    onUpdatePriority,
    onUpdateCategory,
    onUpdateDeadline,
    onSave,
    onClose,
  } = props;

  return (
    <div>
      <div className="modal__container">
        <div className="modal__info-key-value">
          <h3>Description:</h3>
          <textarea
            form=""
            maxLength={150}
            name="taskDescription"
            id="taskDescription"
            wrap="soft"
            className="taskDescriptionModal"
            value={updatedDescription}
            onChange={(e) => onUpdateDescription(e.target.value)}
            placeholder="Enter description (max. 150 chars.)"
          />
        </div>
        <div className="modal__info-key-value">
          <h3>Priority:</h3>
          <select
            id="priority"
            name="priority"
            className="taskPriorityModal"
            value={updatedPriority}
            onChange={(e) => onUpdatePriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High</option>
          </select>
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
            type="date"
            id="deadline"
            name="deadline"
            className="taskDeadlineModal"
            value={new Date(updatedDeadline).toISOString().split("T")[0]} // Date obj to ISOString ("YYYY-MM-DDTHH:mm:ss.sssZ") - select the 1st part ("YYYY-MM-DD").
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              onUpdateDeadline(selectedDate);
              console.log(e.target.value);
            }}
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

export default TaskAddEditModal;
