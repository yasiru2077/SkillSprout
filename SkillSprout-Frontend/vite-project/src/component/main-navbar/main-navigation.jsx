import axios from "axios";
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./main-navbar.css";
const imagePath = "http://localhost:5000/";

function MainNavigation({ userDetails }) {
  const [user, setUser] = useState({
    username: userDetails?.username || "",
    profilePic: userDetails?.profilePic || "",
  });

  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

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
            <h1>
              <span>.</span>SKILLSPROUT
            </h1>
          </div>
          <div className="nav-content">
            <li>
              <Link to={`/`}>Blog</Link>
            </li>
            <li>
              <Link to={`/about`}>About</Link>
            </li>
            <li>
              <Link to={`/Privacy`}>Personal Blogs</Link>
            </li>
          </div>
          <div className="personal-functions">
            <img src={`${imagePath}${user.profilePic}`} alt="Profile" />
            {/* <h2>{user.username}</h2> */}
            <button className="logout" onClick={handleLogOut}>
              Logout
              <div className="icon">
                <svg
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainNavigation;
