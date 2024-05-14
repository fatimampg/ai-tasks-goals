import Navbar from "../../components/Navbar/Navbar";
import "./features.css";
import ai from "../../assets/images/ai.jpg";

const Features = () => {
  return (
    <div className="features-page">
      <Navbar />
      <div className="features-container">
        <div className="feature-card">
          <div className="features__img-right">
            <img
              src={ai}
              alt="img ai"
              className="features__img"
              loading="lazy"
            />
          </div>
          <div className="features__text-left">
            <h2> Features: </h2>

            <ul>
              <li>
                {" "}
                Task Management:
                <p> Add, edit and remove tasks.</p>
                <p> Assign a category, priority level and deadline.</p>
                <p> Update task progress.</p>
              </li>
              <li>
                {" "}
                Goal Setting:
                <p> Add, edit and remove monthly goals.</p>
                <p> Assign a category.</p>
                <p> Goal status is determined by the AI analysis.</p>
              </li>
              <li>
                {" "}
                Categories:
                <p>
                  {" "}
                  To each task and goal is assigned a Category, such as
                  "Career","Personal Development", "Health and Wellness",
                  "Financial", Family and Friends" and "Leisure".
                </p>
              </li>
              <li>
                {" "}
                AI Progress Analysis:
                <p>
                  {" "}
                  Goals set for a specific month, as well as tasks with
                  deadlines within that time period, are analysed by the
                  integrated OpenAI model GPT-4, an artificial intelligence
                  model. The progress analysis provides a summary,
                  recommendations and updated goals statuses, reflecting your
                  progresss towards achieveing those goals.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
