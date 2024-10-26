import React, { useState } from "react";
import "./ActivityBtn.css";

const ActivityBtn = (props) => {
  const [num_votes, setNumVotes] = useState(props.num_votes);
  const { api_url } = props;

  const updateCount = async () => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      //the server increments current votes by the number provided.
      body: JSON.stringify({ num_votes: 1 }),
    };

    try {
      const response = await fetch(
        `${api_url}/api/activities/` + props.id,
        options
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Post created successfully:", data);

      setNumVotes((num_votes) => num_votes + 1);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <button className="activityBtn" id={props.id} onClick={updateCount}>
      {props.activity} <br /> {"△ " + num_votes + " Upvotes"}
    </button>
  );
};

export default ActivityBtn;
