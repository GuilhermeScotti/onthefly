import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import TripsDashboard from "../components/TripsDashboard";

const ReadTrips = (props) => {
  const [trips, setTrips] = useState([]);
  const [tripsStorage, setTripsStorage] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [maxDays, setMaxDays] = useState();

  const { api_url, userTrips } = props;

  useEffect(() => {
    setTripsStorage(props.data);
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
          `${api_url}/api/trips_destinations/trips/${selectedId}`
        );
        const tripsData = await response.json();
        console.log("Selected destination details:", tripsData);
        setTripsStorage(tripsData);
        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching destination details:", error);
      }
    } else {
      const response = await fetch(`${api_url}/api/trips`);
      const data = await response.json();
      setTripsStorage(data);
      setTrips(data);
    }
  };

  const handleBudgetChange = async (e) => {
    const days = e.target.value;
    setMaxDays(days);

    // Filter destinations based on max budget
    if (days) {
      const num = parseInt(days);
      const filtered = tripsStorage.filter((trip) => trip.num_days <= num);
      setTrips(filtered);
    } else {
      if (selectedDestination) {
        try {
          const response = await fetch(
            `${api_url}/api/trips_destinations/trips/${selectedDestination}`
          );
          const tripsData = await response.json();
          console.log("Selected destination details:", tripsData);
          setTripsStorage(tripsData);
          setTrips(tripsData);
        } catch (error) {
          console.error("Error fetching destination details:", error);
        }
      } else {
        const response = await fetch(`${api_url}/api/trips`);
        const data = await response.json();
        setTripsStorage(data);
        setTrips(data);
      }
    }
  };

  return (
    <div className="ReadTrips">
      <div className="dash">
        <TripsDashboard userTrips={userTrips} />
      </div>
      <div>
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
        <div>
          <input
            type=""
            id="maxBudget"
            value={maxDays}
            onChange={handleBudgetChange}
            placeholder="Max Budget"
          />
        </div>
      </div>
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
