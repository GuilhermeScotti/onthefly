import React, { useState, useEffect } from "react";
import Card from "../components/Card";

const ReadTrips = (props) => {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    setTrips(props.data);
    setDestinations(props.destinations);
  }, [props]);

  const handleSelectChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedDestination(selectedId);

    // Fetch additional data based on the selected destination's id
    if (selectedId) {
      try {
        const response = await fetch(
          `/api/trips_destinations/trips/${selectedId}`
        );
        const tripsData = await response.json();
        console.log("Selected destination details:", tripsData);
        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching destination details:", error);
      }
    } else {
      const response = await fetch("/api/trips");
      const data = await response.json();
      setTrips(data);
    }
  };

  return (
    <div className="ReadTrips">
      {destinations && destinations.length > 0 ? (
        <div>
          <label htmlFor="destinationSelect">Choose a Destination: </label>
          <select id="destinationSelect" onChange={handleSelectChange}>
            <option value="">Select a destination</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.destination}
              </option>
            ))}
          </select>

          {selectedDestination && (
            <p>Selected Destination ID: {selectedDestination}</p>
          )}
        </div>
      ) : (
        <h4>No selected</h4>
      )}
      {trips && trips.length > 0 ? (
        trips.map((post, index) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            img_url={post.img_url}
            num_days={post.num_days}
            start_date={post.start_date}
            end_date={post.end_date}
            total_cost={post.total_cost}
          />
        ))
      ) : (
        <h3 className="noResults">{"No Trips Yet 😞"}</h3>
      )}
    </div>
  );
};

export default ReadTrips;
