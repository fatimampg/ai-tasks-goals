import { useState, useEffect } from "react";
import axios from "axios";
import waving_hand from "../assets/icons/waving-hand.svg";

interface DashboardHeaderParams {
  header: { [key: string]: string };
}
const DashboardHeader = ({ header }: DashboardHeaderParams) => {
  const [userName, setUserName] = useState("");

  const getUserName = async (header: { [key: string]: string }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/username`,
        {
          headers: header,
        },
      );
      const userName = response.data.userName;
      setUserName(userName);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserName(header);
  }, [header]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="dashboard__title-welcome">
        <h2 data-testid="username"> Hello {userName}</h2>
        <img
          src={waving_hand}
          alt="waving-hand"
          className="icon__waving-hand"
        />
      </div>

      <h3 className="dashboard__sub-title">Today, {formattedDate}</h3>
    </>
  );
};

export default DashboardHeader;
