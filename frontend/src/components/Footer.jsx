import React from "react";

function Footer(){
    return (
        <div className="footer">
          <div className="footer-section">
            <h4>Contact Us:</h4>
            <p>Email: support@budgetwisehub.com</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links:</h4>
            <p>
              <a href="#about">About Us</a> | <a href="#privacy">Privacy Policy</a> |{" "}
              <a href="#terms">Terms of Service</a> | <a href="#faq">FAQ</a>
            </p>
          </div>
          <div className="footer-section">
            <h4>Follow Us:</h4>
            <p>
              <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a> |{" "}
              <a href="#instagram">Instagram</a> | <a href="#linkedin">LinkedIn</a>
            </p>
          </div>
        </div>
      );
}

export default Footer;