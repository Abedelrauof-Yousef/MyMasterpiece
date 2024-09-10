import React from "react";
import AboutPicture from '../assets/AboutPicture.png';

function AboutBudgetWizeHub() {
    return ( 
      <div style={{marginBottom:"7rem"}} className="aboutBudgetWizeHub">
        <div className="text-content">
          <h3>About BudgetWiseHub</h3>
          <p className="aboutBudgetParagraph">
            Welcome to <strong>BudgetWiseHub</strong>, your ultimate companion for mastering personal finance. Our mission is to empower individuals to take control of their financial future through intuitive budgeting, comprehensive expense tracking, and achievable goal setting. We understand that managing personal finances can be overwhelming, which is why we offer tailored advice and tools to simplify your journey towards financial stability and growth.
          </p>
        </div>
        <div className="image-content">
          <img src={AboutPicture} alt="BudgetWiseHub" />
        </div>
      </div>
    );
  }
  
  export default AboutBudgetWizeHub;