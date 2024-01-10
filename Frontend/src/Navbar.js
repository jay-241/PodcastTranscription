import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar.css';
function Navbar() {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle logout and navigate to the login page
  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/podcastupload">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/aboutus">About Us</Link>
        </li>
        <li className="navbar-item">
          <Link to="/contactus">Contact Us</Link>
        </li>
        {/* Logout button */}
        <li className="navbar-item">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
