import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import "./main-navbar.css";

const imagePath = "http://localhost:5000/";

function MainNavigation({ userDetails }) {
  const [user, setUser] = useState({
    username: userDetails?.username || "",
    profilePic: userDetails?.profilePic || "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".hamburger-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <main>
      <section>
        <div className="nav">
          <div className="logo">
            <h1>
              <span>.</span>SKILLSPROUT
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-content">
            <li>
              <Link to="/">Blog</Link>
            </li>

            <li>
              <Link to="/Privacy">Personal Blogs</Link>
            </li>
            <li>
              <Link to="/AddBlogPage">Write</Link>
            </li>
          </div>

          <div className="personal-functions">
            <img src={`${imagePath}${user.profilePic}`} alt="Profile" />
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

          {/* Hamburger Menu Button */}
          <button className="hamburger-btn" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X size={28} color="white" className="menu-icon close-icon" />
            ) : (
              <Menu size={28} color="white" className="menu-icon" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu-container ${mobileMenuOpen ? "open" : ""}`}
        >
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <img src={`${imagePath}${user.profilePic}`} alt="Profile" />
              <h3>{user.username || "User"}</h3>
            </div>
            <div className="mobile-menu-items">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link to="/Privacy" onClick={() => setMobileMenuOpen(false)}>
                Personal Blogs
              </Link>
              <Link to="/AddBlogPage" onClick={() => setMobileMenuOpen(false)}>
                Write
              </Link>

              <button className="mobile-logout" onClick={handleLogOut}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainNavigation;
