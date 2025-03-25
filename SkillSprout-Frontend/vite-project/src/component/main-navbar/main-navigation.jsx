import axios from "axios";
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./main-navbar.css";
const imagePath = "http://localhost:5000/";

function MainNavigation({ userDetails }) {
  const [user, setUser] = useState({
    username: userDetails.user.username,
    profilePic: userDetails.user.profilePic,
  });

  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");

      navigate("/login");
    } catch (err) {
      console.error("logout failed:", err.response?.data || err);
    }
  };

  return (
    <main>
      <section>
        <div className="nav">
          <div className="logo">
            <h1>SKILLSPROUT</h1>
          </div>
          <div className="nav-content">
            <li>
              <Link to={`/`}>Blog</Link>
            </li>
            <li>About</li>
            <li>Privacy Policy</li>
          </div>
          <div className="personal-functions">
            <img src={`${imagePath}${user.profilePic}`} alt="" />
            <h2>{user.username}</h2>
            <button onClick={handleLogOut}>logout</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainNavigation;
