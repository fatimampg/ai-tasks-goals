import menu_vertical from "../../assets/icons/menu-vertical.svg";

const GoalsIdentifiers = () => {
  return (
    <div className="dashboard__identifiers--goals">
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
  );
};

export default GoalsIdentifiers;
