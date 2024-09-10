import React from "react";
import correctLogo from "../assets/correctLogo.png";

function WhyChooseUs() {
  return (
    <div style={{marginBottom:"8rem"}} className="whyChooseUs">
      <h2>Why Choose Us?</h2>
      <div>
        <ul>
          <li>
              <img src={correctLogo} width={20} alt="Logo" />
              <span>
                Personalized Advice: Tailored financial insights based on your
                goals
              </span>
          </li>
          <li>
            <img src={correctLogo} width={20} alt="Logo" />
            <span>
              Comprehensive Tools: All-in-one platform for budgeting and expense
              tracking
            </span>
          </li>
          <li>
            <img src={correctLogo} width={20} alt="Logo" />
            <span>
              Expert Support: Access to professional financial advice.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WhyChooseUs;
