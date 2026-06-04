import React from "react";
import "../styles/About.css";

// FIX: Changed lowercase "about" to uppercase "About"
function About() {
  return (
    <div className="About-page">

      {/* Bubbles */}
      <div className="bubbles">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>

      {/* About Content wrapped in a Glass Card */}
      <div className="about glass-card fade-in delay-1">
        <h2 className="float-anim">🌊 About Underwater Garbage Detection</h2>

        <p className="fade-in delay-2">
          Underwater Garbage Detection is an AI-based project designed to identify
          and classify waste materials present in oceans and water bodies.
        </p>

        <p className="fade-in delay-3">
          This system uses advanced object detection technology based on YOLOv8
          to detect garbage such as plastic bottles, bags, and other pollutants.
        </p>

        <p className="fade-in delay-4">
          The goal of this project is to help protect marine life and maintain
          a clean aquatic environment by enabling automated waste detection.
        </p>

        <h3 className="fade-in delay-5">🚀 Key Features</h3>

        <ul className="feature-list fade-in delay-6">
          <li>📷 Image Upload for Detection</li>
          <li>🤖 AI-based Garbage Identification</li>
          <li>📦 Bounding Box Visualization</li>
          <li>⚡ Fast and Accurate Detection</li>
        </ul>
      </div>

    </div>
  );
}

export default About;