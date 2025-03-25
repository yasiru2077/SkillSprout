import React from "react";
import "./write-icon.css";
import Write from "../../assets/write-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";

function WriteIcon() {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/SingleBlogPage");
  };

  return (
    <div onClick={handleOnClick} className="write-icon">
      <img src={Write} alt="" />
    </div>
  );
}

export default WriteIcon;
