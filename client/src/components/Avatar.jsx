import React from "react";
import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className="Avatar">
      <span className="user-name">{props.user.username}</span>
      <img className="user-img" src={props.user.avatarurl} />
    </div>
  );
};

export default Avatar;