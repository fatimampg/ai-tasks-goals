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
          <p>Description:</p>
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
          <p>Priority:</p>
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
          <p>Category:</p>
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
          <p>Deadline:</p>
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
      <div style={{marginTop: "2rem"}}>     
        <button className="button button--primary" style={{fontSize: "0.875rem"}}  onClick={onSave}>
            Save
          </button>
          <button className="button button--primary" style={{fontSize: "0.875rem"}}  onClick={onClose}>
            Close
          </button>
      </div>
    </div>
  );
};

export default TaskAddEditModal;
