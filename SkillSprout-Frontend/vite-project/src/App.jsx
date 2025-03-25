import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import BlogHomePage from "./pages/blog-Home/blog-Home";
import Layout from "./component/layout.jsx";
import Login from "./pages/login/login.jsx";
import SingleBlogPage from "./component/single-blog-page/single-blog-page.jsx";

const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = localStorage.getItem("userDetails");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  console.log(isAuthenticated);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }, [isAuthenticated, userDetails]);

  console.log("userdetails:", userDetails);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setUserDetails={setUserDetails}
            />
          }
        />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout userDetails={userDetails} />}>
            <Route path="/" element={<BlogHomePage />} />
            <Route path="/SingleBlogPage" element={<SingleBlogPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
