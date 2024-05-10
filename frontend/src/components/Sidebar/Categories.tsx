const Categories = () => {
  return (
    <div className="sidebar__categories">
      <h3 style={{ paddingBottom: "5px" }}>Categories:</h3>
      <ul>
        <div className="sidebar__icon-title-pair">
          <div
            className="square"
            style={{ borderColor: "var(--CAREER)" }}
          ></div>
          <li>Career</li>
        </div>
        <div className="sidebar__icon-title-pair">
          <div
            className="square"
            style={{ borderColor: "var(--PERSONAL_DEVELOPMENT)" }}
          ></div>
          <li>Personal development</li>
        </div>
        <div className="sidebar__icon-title-pair">
          <div
            className="square"
            style={{ borderColor: "var(--HEALTH_AND_WELLNESS)" }}
          ></div>
          <li>Health and wellness</li>
        </div>
        <div className="sidebar__icon-title-pair">
          <div
            className="square"
            style={{ borderColor: "var(--FINANCIAL)" }}
          ></div>
          <li>Financial</li>
        </div>
        <div className="sidebar__icon-title-pair">
          <div
            className="square"
            style={{ borderColor: "var(--FAMILY_AND_FRIENDS)" }}
          ></div>
          <li>Family and friends</li>
        </div>
        <div className="sidebar__icon-title-pair">
          <div
            className="square"
            style={{ borderColor: "var(--LEISURE)" }}
          ></div>
          <li>Leisure</li>
        </div>
      </ul>
    </div>
  );
};

export default Categories;
