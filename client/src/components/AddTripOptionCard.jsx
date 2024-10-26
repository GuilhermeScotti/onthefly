import React from "react";
import { useParams } from "react-router-dom";
import "./Card.css";

const AddTripOptionCard = (props) => {
  const { destination_id } = useParams();
  const { api_url } = props;

  const addToTrip = async (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trip_id: props.id,
        destination_id: destination_id,
      }),
    };

    try {
      const response = await fetch(
        `${api_url}/api/trips_destinations`,
        options
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      console.log("Post created successfully:", response);

      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="Card" style={{ backgroundImage: `url(${props.img_url})` }}>
      <div className="card-info">
        <h2 className="title">{props.title}</h2>
        <p className="description">{props.description}</p>
        <button className="addToTrip" onClick={addToTrip}>
          + Add to Trip
        </button>
      </div>
    </div>
  );
};

export default AddTripOptionCard;
