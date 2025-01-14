import smart_img from "../../assets/images/smart_goals_orig.jpg";

const Scope = () => {
  return (
    <div className="home__scope">
      <section>
        <h2 id="features-summary" style={{ fontWeight: "600" }}>
          WHAT'S THE IDEA BEHIND IT?
        </h2>
        <p>
          In today's fast-paced world, achieving meaningful objectives requires more than just motivation — it demands <b>structure and clarity</b>. </p>
        <p>
          There are several tools and methodologies that could be used to help us on the way, such as the <b>SMART goals methodology</b>. It was introduced by George Doran in 1981 and aims to improve performance and outcomes by enhancing goal clarity, facilitating measurable progress, and ensuring that objectives are realistic and time-bound. It also helps fostering motivation and a sense of direction, making it a valuable tool in both professional and personal contexts.
        </p>
        <p>
          Although originally defined for corporate settings, it has been widely applied accross various fields - including business, sports, education, and healthcare — to provide a clear framework for setting and achieving objectives. The effectiveness will vary depending on its implementation and it should be applied thoughfully and considering individual circunstances to maximize effectiveness.</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
          src={smart_img}
          alt="img smart goals"
          className="home__smart-img"
          loading="lazy"
          />
        </div>
        <div className="smart-goals_identification">
          <p><span><b style={{color: "#4B0790"}}>S</b>pecific</span> - The goal should be clear, detailed and well defined.</p>
          <p><span><b style={{color: "#4B0790"}}>M</b>easurable</span> - Goal progress should be easy to demonstrate and evaluate.</p>
          <p><span><b style={{color: "#4B0790"}}>A</b>chievable</span> - The goal chould be challenging but realistic and achievable.</p>
          <p><span><b style={{color: "#4B0790"}}>R</b>elevant</span> - The goal should relate to other overarching objectives.</p>
          <p><span><b style={{color: "#4B0790"}}>T</b>imed</span> - The goal goal should have a clear timeline</p>
        </div>
      </section>

      <section>
        <h2 id="features-summary" style={{ fontWeight: "600", paddingTop: "5rem" }}>
          HOW CAN WE HELP?
        </h2>
        <p>
          If this makes sense to you, we challenge you to think about your main goals, linked to your values, ambitions and overall objectives. Then, break them down into specific, measurable, achievable, relevant and time bounded goals. Define specific tasks aligned with those short-term goals, track progress and regularly self-evaluate your performance and alignement with your goals.</p>
        <p><b>Goalsync</b> can be used as a tool to structure and organize your tasks and goals, track progress and ensure alignement between tasks and goals.
        </p>
        <p>
          Here are some resources that can help you on that process: <a href="https://psychologicalsciences.unimelb.edu.au/__data/assets/pdf_file/0010/4575493/SMART-Goals-MCBC-Resource_Final.pdf"> SMART GOALS by the Melbourne Centre for Behaviour Change</a>.
        </p>
      </section>
    </div>
  );
};
export default Scope;
