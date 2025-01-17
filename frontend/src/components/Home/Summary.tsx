const Summary = () => {
  return (
    <div className="home__main-description">
      <h3 id="features-summary" style={{ fontWeight: "600" }}>
        AI Tasks Manager was designed to help you align tasks with predefined
        goals, thereby boosting your productivity and goal achievement!
      </h3>
      <p>
        Start by envisioning your goals across various life domains - from career milestones to personal growth, health and wellness, finances, leisure, and more. Then, break down these aspirations into manageable monthly goals, setting the state for a productive journey ahead!
      </p>
      <p>
        Plan your week, aligning tasks with your overarching objectives.
        Identifying their individual priority levels will help you to ensure that critical tasks receive the attention they deserve.
      </p>
      <p>
        {" "}
        As you progress, update your task status to track your journey
        effectively. By splitting larger tasks into smaller actionable steps, you'll enhance productivity and maintain motivation.
      </p>
      <p>
        Throughout your journey, monitor your progress and check the analysis generated by an AI model{" "}
        <span style={{ fontWeight: "500" }}>(OpenAI model GPT-4)</span> and
        receive personalized insights to stay aligned with your goals.
      </p>
      <p>
        Are you ready to elevate your productivity? Start your journey with AI
        Task Manager today!
      </p>
    </div>
  );
};
export default Summary;
