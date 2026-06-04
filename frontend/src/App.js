import React from "react";
import "./App.css";
import Upload from "./components/Upload";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* We use a wrapper div to make sure the footer stays at the bottom */}
      <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <div className="app-container">
                  
                  {/* --- UPDATED: Centered Hero Header --- */}
                  <div className="hero-header">
                    <h1>Ocean Clean: YOLOv8 Garbage Identification</h1>
                    <p>Detect ocean waste using YOLOv8</p>
                  </div>

                  {/* --- INFORMATION SECTION --- */}
                  <div className="info-section">
                    <div className="info-grid">
                      <div className="info-card">
                        <div className="icon">🌊</div>
                        <h3>Ocean Conservation</h3>
                        <p>Identify hazardous plastic and debris to help clean up marine ecosystems and protect wildlife.</p>
                      </div>

                      <div className="info-card">
                        <div className="icon">⚡</div>
                        <h3>Powered by YOLOv8</h3>
                        <p>Utilizing state-of-the-art YOLOv8 object detection for high-speed, accurate underwater analysis.</p>
                      </div>

                      <div className="info-card">
                        <div className="icon">📊</div>
                        <h3>Real-Time Results</h3>
                        <p>Get instant visual feedback with bounding boxes and confidence scores for every detected item.</p>
                      </div>
                    </div>
                  </div>
                  {/* ----------------------------------------- */}

                  {/* Upload Box now sits below the info cards */}
                  <section className="upload">
                    <Upload />
                  </section>

                  {/* Bubbles */}
                  <div className="bubbles">
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span>
                  </div>
                </div>
              }
            />

            {/* About Page */}
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;