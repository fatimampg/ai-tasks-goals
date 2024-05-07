import { RotatingLines } from "react-loader-spinner";
import "../styles/base.css";

const LoadingSpinner = () => (
  <div className="custom-loader">
    <RotatingLines
      strokeColor="var(--orange)"
      width="50"
      strokeWidth="5"
      animationDuration="0.85"
      visible={true}
    />
  </div>
);

export default LoadingSpinner;
