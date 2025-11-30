import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const userEmail = useSelector((state) => state.userProfile.userName);
  console.log(userEmail);
  
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/getuserData/${userEmail}`
      );
      setUserData(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (userEmail) getUserData();
  }, [userEmail]);

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Profile Page</h1>

      {userData ? (
        <pre className="mt-6 bg-zinc-800 p-4 rounded-xl">
          {JSON.stringify(userData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-400 mt-4">Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
