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
import About from "./pages/about.jsx";
import PersonalBlogs from "./pages/personal-blogs/personal-blogs.jsx";
import AddBlogPage from "./component/single-blog-page/single-blog-page.jsx";
import BlogSinglePage from "./pages/blog-single-page/blog-single-page.jsx";
import Register from "./pages/register/register.jsx";

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
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout userDetails={userDetails} />}>
            <Route
              path="/Privacy"
              element={<PersonalBlogs userDetails={userDetails} />}
            />
            <Route path="/" element={<BlogHomePage />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/AddBlogPage"
              element={<AddBlogPage userDetails={userDetails} />}
            />{" "}
            <Route
              path={"/BlogSinglePage/:id"}
              element={<BlogSinglePage userDetails={userDetails} />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
