import { getIconURL } from "../../utils/imageURL";

interface CardProps {
  cardNumber: string;
  title: string;
  short_description: string;
  description: string[];
  toggleExpandedCard: (cardNumber: string) => void;
  isExpanded: boolean;
}

const Card = ({ cardNumber, title, short_description, description, toggleExpandedCard, isExpanded }: CardProps) => {
  const handleShowMore = () => {
    toggleExpandedCard(cardNumber);
  }

  return (
    <div className={`home__card card${cardNumber}`}>
      <div className="card__hover-area-trigger"></div>
      <div className="card__inner">
        <section className="card__front">
          <div style={{display:"flex", alignItems: "center"}}> 
            <img
              src={getIconURL(cardNumber)}
              alt={`card${cardNumber}ofFour`}
              className="icon__card"
            />
            <h3>{title}</h3>
          </div>
          <p>{short_description}</p>
          <button className="button-card__small-screen" onClick={handleShowMore}>
            {isExpanded ? "Show less" : "Show more"}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className="arrow-icon">
              <path d="M7 10l5 5 5-5z"/>
          </svg>
          </button>
        </section>
        <section className={`card__back ${isExpanded ? "card__back-visible" : "" }`}>
          <ul>
            {description.map((paragraph, index) => (
              <li key={index}>
              {paragraph}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
export default Card;