import React from "react";
import TripsDashboard from "../components/TripsDashboard";
import "./User.css";

const User = ({ api_url, userTrips, user }) => {
  const [bio, setBio] = React.useState(user.bio);

  const handleChange = (event) => {
    setBio(event.target.value);
  };

  const createPost = async (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio: bio }),
    };

    try {
      const response = await fetch(
        `${api_url}/api/users/bio/${user.id}`,
        options
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Post created successfully:", data);
      alert("Bio updated successfully");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="User">
      Your space 😁
      <TripsDashboard userTrips={userTrips} />
      <form>
        <label>Bio</label>
        <br />
        <textarea
          rows="5"
          cols="50"
          id="bio"
          name="bio"
          onChange={handleChange}
          value={bio}
        ></textarea>
        <br />
        <input type="submit" value="Submit Bio" onClick={createPost} />
      </form>
    </div>
  );
};

export default User;
