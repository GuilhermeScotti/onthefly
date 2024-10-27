import React from "react";
import "./Avatar.css";

const Avatar = (props) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = `/user/${props.user.id}`;
  };

  return (
    <div className="Avatar" onClick={handleClick}>
      <span className="user-name">{props.user.username}</span>
      <img className="user-img" src={props.user.avatarurl} />
    </div>
  );
};

export default Avatar;
