import React from "react";
import "../styles/Footer.css"; // We'll create this next!

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2026 Underwater Garbage Detection Team</p>
        <div className="footer-links">
          <span>🌊 Save Our Oceans</span>
          <span className="divider">|</span>
          <span>🤖 Powered by YOLOv8</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;