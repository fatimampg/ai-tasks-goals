import HomeCard from "./Card";
import { useState } from "react";

const cardData = [
  {
    cardNumber: "One",
    title: "Task Management:",
    short_description: "Easily manage and track your tasks from start to finish.",
    description: [
      "Add, edit and remove tasks as needed.",
      "Assign a category, a priority level and deadline.",
      "Update task progress based on its completion state (e.g.: To Do, In Progress or Completed)."
    ]
  },
  {
    cardNumber: "Two",
    title: "Goal setting:",
    short_description: "Break down your goals into achievable steps and track your progress.",
    description: [
      "Set monthly goals based on what you aim to achieve during that period.",
      "Assign a category to each goal and let us help you track your task progress to ensure you're working towards achieving those goals!",
    ]
  },
  {
    cardNumber: "Three",
    title: "Progress Evaluation:",
    short_description: "Evaluate and update your progress with the help of an AI model and get recommendations for goal alignement.",
    description: [
      "Your progress is analysed by aligning your tasks with set goals, powered by an integrated AI model (OpenAI model GPT-4).",
      "Get recommendations to prioritize tasks and stay on track to achieve your goals.",
    ]
  },

]

interface ExpandedCardState {
  [cardNumber: string]: boolean;
}

const CardBoard = () => {
  const [expandedCards, setExpandedCards] = useState<ExpandedCardState>({
    One: false,
    Two: false,
    Three: false
  })

  const toggleExpandedCard = (cardNumber: string) => {
    setExpandedCards((prevState) => ({
      ...prevState,
      [cardNumber]: !prevState[cardNumber],
    }))
  }
  
  return (
    <div className="home__board">
      {cardData.map(card => (
        <HomeCard
          key={card.cardNumber}
          cardNumber={card.cardNumber}
          title={card.title}
          short_description={card.short_description}
          description={card.description}
          toggleExpandedCard={toggleExpandedCard}
          isExpanded={expandedCards[card.cardNumber]}
        />
      ))}
    </div>
  );
};
export default CardBoard;
