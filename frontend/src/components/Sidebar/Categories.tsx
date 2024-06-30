const Categories = () => {
  const categories = [
    { title: "Career", color: "--CAREER" },
    { title: "Personal development", color: "--PERSONAL_DEVELOPMENT" },
    { title: "Health and wellness", color: "--HEALTH_AND_WELLNESS" },
    { title: "Financial", color: "--FINANCIAL" },
    { title: "Family and friends", color: "--FAMILY_AND_FRIENDS" },
    { title: "Leisure", color: "--LEISURE" },
  ];

  return (
    <div className="sidebar__categories">
      <h3 style={{ paddingBottom: "5px" }}>Categories:</h3>
      <ul>
        {categories.map((category, index) => (
          <div className="sidebar__icon-title-pair" key={index}>
            <div
              className="square"
              style={{ borderColor: `var(${category.color})` }}
            ></div>
            <li>{category.title}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Categories;