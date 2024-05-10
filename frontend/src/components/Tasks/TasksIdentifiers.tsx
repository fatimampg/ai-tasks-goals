import menu_vertical from "../../assets/icons/menu-vertical.svg";

const TasksIdentifiers = () => {
  return (
    <div className="dashboard__identifiers--tasks">
      <h3 style={{ paddingLeft: "4px" }}>Categ.:</h3>
      <h3> Description:</h3>
      <h3> To do:</h3>
      <h3>
        {" "}
        In progress
        <br />
        [% completed]:
      </h3>
      <h3> Done:</h3>
      <img src={menu_vertical} alt="menu_vertical" id="menu_vertical" />
    </div>
  );
};

export default TasksIdentifiers;
