import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userLogo from "./user.png";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function toggle() {
    setIsOpen(!isOpen);
    document.querySelector(".open-nav").classList.remove("hidden");
    if (isOpen) {
      document.querySelector(".open-nav").style.animation = "slide-right 0.5s ease-in-out forwards";
    } else {
      document.querySelector(".open-nav").style.animation = "slide-left 0.5s ease-in-out forwards";
    }
  }

  useEffect(() => {
    // Check local storage for a logged-in user
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  function handleLogout() {
    // Clear user information from local storage
    localStorage.removeItem("username");
    setUsername("");
    setIsLoggedIn(false);
    window.location.reload(false);
  }

  return (
    <nav>
      <h1>Gymance</h1>
      <div className="account" onClick={toggle}>
        <img src={userLogo} alt="user" />
      </div>
      <div className="open-nav hidden">
      <span className="close-button" onClick={toggle}>&#10005;</span>
        <ul className="nav-links">
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          {isLoggedIn && (
            <li>
              <span><div className="user">{username}</div></span>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
