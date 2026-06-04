import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        {/* Added onClick to snap to the top */}
        <Link to="/" className="nav-logo" onClick={() => window.scrollTo(0, 0)}>
          🌊 Garbage Detection
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
        </li>
        <li>
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>Upload</Link>
        </li>
        <li>
          <Link to="/about" onClick={() => window.scrollTo(0, 0)}>About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;