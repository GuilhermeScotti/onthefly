import React from "react";
import Card from "./Card";
import "./TripsDashboard.css";

const TripsDashboard = ({ userTrips }) => {
  return (
    <div>
      <h4>Trips you are added to:</h4>
      <div className="grid-container">
        {userTrips && userTrips.length > 0 ? (
          userTrips.map((post, index) => (
            <Card
              isSmall={true}
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
    </div>
  );
};

export default TripsDashboard;
