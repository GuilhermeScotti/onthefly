import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ActivityBtn from "../components/ActivityBtn";
import DestinationBtn from "../components/DestinationBtn";
import "./TripDetails.css";

const TripDetails = ({ data, api_url }) => {
  const { id } = useParams();
  const [post, setPost] = useState({
    id: 0,
    title: "",
    description: "",
    img_url: "",
    num_days: 0,
    start_date: "",
    end_date: "",
    total_cost: 0.0,
  });
  const [travelers, setTravelers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [mediaFile, setMediaFile] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      comment: "Of green nothing tonight season later if option.",
      mediaUrl:
        "https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      comment: "Authority big door language billion group federal.",
      mediaUrl:
        "https://cdn.pixabay.com/video/2020/08/14/47179-450995679_large.mp4",
    },
  ]);

  useEffect(() => {
    const fetchTravelers = async () => {
      const response = await fetch(`${api_url}/api/users-trips/users/` + id);
      const travelersData = await response.json();
      setTravelers(travelersData);
    };
    fetchTravelers();
  }, [id]);

  useEffect(() => {
    const result = data.filter((item) => item.id === parseInt(id))[0];

    if (!data || !result) {
      return;
    }

    setPost({
      id: parseInt(result.id),
      title: result.title,
      description: result.description,
      img_url: result.img_url,
      num_days: parseInt(result.num_days),
      start_date: result.start_date.slice(0, 10),
      end_date: result.end_date.slice(0, 10),
      total_cost: result.total_cost,
    });

    const fetchActivities = async () => {
      const response = await fetch(`${api_url}/api/activities/` + id);
      const actsData = await response.json();
      setActivities(actsData);
    };

    const fetchDestinations = async () => {
      const response = await fetch(
        `${api_url}/api/trips_destinations/destinations/` + id
      );
      const destData = await response.json();
      setDestinations(destData);
    };

    fetchActivities();
    fetchDestinations();
  }, [data, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newId = comments.length + 1;
    const updatedComment = {
      id: newId,
      comment: commentText,
      mediaUrl: mediaFile,
    };
    // Update the comments state
    setComments((prevComments) => [...prevComments, updatedComment]);

    // Clear the input fields after submission
    setCommentText("");
    setMediaFile("");
  };

  return (
    <div className="out">
      <div className="flex-container">
        <div className="left-side">
          <h3>{post.title}</h3>
          <p>{"🗓️ Duration: " + post.num_days + " days "}</p>
          <p>{"🛫 Depart: " + post.start_date}</p>
          <p>{"🛬 Return: " + post.end_date}</p>
          <p>{post.description}</p>
        </div>

        <div
          className="right-side"
          style={{ backgroundImage: `url(${post.img_url})` }}
        ></div>

        <div className="travelers">
          {travelers && travelers.length > 0
            ? travelers.map((traveler, index) => (
                <p
                  key={index}
                  style={{ textAlign: "center", lineHeight: 0, paddingTop: 20 }}
                >
                  {traveler.username}
                </p>
              ))
            : ""}

          <br />
          <Link to={"/users/add/" + id}>
            <button className="addActivityBtn">+ Add Traveler</button>
          </Link>
        </div>
      </div>

      <div className="flex-container">
        <div className="activities">
          {activities && activities.length > 0
            ? activities.map((activity, index) => (
                <ActivityBtn
                  key={activity.id}
                  id={activity.id}
                  activity={activity.activity}
                  num_votes={activity.num_votes}
                  api_url={api_url}
                />
              ))
            : ""}
          <br />
          <Link to={"../../activity/create/" + id}>
            <button className="addActivityBtn">+ Add Activity</button>
          </Link>
        </div>
        <div className="destinations">
          {destinations && destinations.length > 0
            ? destinations.map((destination, index) => (
                <DestinationBtn
                  key={destination.id}
                  id={destination.id}
                  destination={destination.destination}
                />
              ))
            : ""}
          <br />
          <Link to={"../../destination/new/" + id}>
            <button className="addDestinationBtn">+ Add Destination</button>
          </Link>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="comment">Add a comment:</label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                required
              />
            </div>

            <div>
              <label htmlFor="media">Upload a photo or video:</label>
              <input
                type="text"
                id="mediaFile"
                value={mediaFile}
                onChange={(e) => setMediaFile(e.target.value)}
                placeholder="Enter image or video URL"
              />
              {mediaFile && (
                <div>
                  <h3>Preview:</h3>
                  {mediaFile.match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img src={mediaFile} alt="Preview" width="400" />
                  ) : (
                    <video src={mediaFile} controls width="400" />
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="addActivityBtn">
              Submit Comment
            </button>
          </form>
        </div>
      </div>
      <div className="comments-section">
        <h4>Comments</h4>
        {comments &&
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.comment}</p>
              {comment.mediaUrl && (
                <div>
                  {comment.mediaUrl.includes("video") ? (
                    <video src={comment.mediaUrl} controls width="400" />
                  ) : (
                    <img
                      src={comment.mediaUrl}
                      alt="Comment media"
                      width="400"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TripDetails;
