import React from "react";
import { Link } from "react-router-dom";
import "./Avatar.css";

const Avatar = (props) => {
  return (
    <Link to={`/user/${props.user.id}`}>
      <div className="Avatar">
        <span className="user-name">{props.user.username}</span>
        <img className="user-img" src={props.user.avatarurl} />
      </div>
    </Link>
  );
};

export default Avatar;
