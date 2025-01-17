import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Home/Header";
import CardBoard from "../../components/Home/CardBoard";
import Summary from "../../components/Home/Summary";
import "./homePage.css";
import Scope from "../../components/Home/Scope";

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage__content">
        <Header />
        <CardBoard />
        <Summary />
        <Scope />
        <section className="home__note">
          <p>
            This web app is a personal project, not intended for comercial use.
            It integrates OpenAI GPT-4 model for enhanced functionality. No
            sensitive information should be added. Learn about OpenAI's
            policies:{" "}
            <a
              href="https://openai.com/policies/usage-policies/"
              style={{ textDecoration: "underline" }}
            >
              OpenAI Usage Policies
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
