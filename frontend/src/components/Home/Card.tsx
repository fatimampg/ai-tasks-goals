import { getIconURL } from "../../utils/imageURL";

interface CardProps {
  cardNumber: string;
  title: string;
  description: string;
}

const Card = ({ cardNumber, title, description }: CardProps) => {
  return (
    <div className={`home__card card${cardNumber}`}>
      <img
        src={getIconURL(cardNumber)}
        alt={`card${cardNumber}ofFour`}
        className="icon__card"
      />
      <h3>{title}</h3>
      <h4>{description}</h4>
    </div>
  );
};
export default Card;
