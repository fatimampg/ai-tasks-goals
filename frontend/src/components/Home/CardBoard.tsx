import HomeCard from "./Card";

const CardBoard = () => {
  return (
    <div className="home__board">
      <HomeCard
        cardNumber="One"
        title="Task Management:"
        description="Add tasks, associating categories, priorities and deadlines."
      />
      <HomeCard
        cardNumber="Two"
        title="Goal setting:"
        description="Set monthly goals and categorize them accordingly."
      />
      <HomeCard
        cardNumber="Three"
        title="Progress Tracking:"
        description="Update task progress regularly."
      />
      <HomeCard
        cardNumber="Four"
        title="AI Progress Analysis:"
        description="Get task progress analysis and recommendations for goal alignement."
      />
    </div>
  );
};
export default CardBoard;
