import { RotatingLines } from "react-loader-spinner";
import "../base.css";

const LoadingSpinner = () => (
  <div className="custom-loader" data-testid="loading-spinner">
    <RotatingLines
      strokeColor="var(--color-button-primary-bg)"
      width="50"
      strokeWidth="5"
      animationDuration="0.85"
      visible={true}
    />
  </div>
);

export default LoadingSpinner;
