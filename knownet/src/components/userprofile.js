import React, { useEffect, useState } from 'react';
import Postdetail from "./Postdetail"
import '../css/profile.css';
import { useParams } from 'react-router-dom';
export default function UserProfile() {
    var picLink="https://cdn-icons-png.flaticon.com/128/3135/3135768.png"

    const { userid } = useParams()
    const [user, setUser] = useState("")
    const [posts, setPosts] = useState([])
    

    const [isFollow, setIsFollow] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/user/${userid}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setUser(result.user); // Set the user details
                setPosts(result.posts); // Set the posts

                // Check if the logged-in user is in the followers list
                const loggedInUserId = JSON.parse(localStorage.getItem("user"))._id;
                if (result.user.followers.includes(loggedInUserId)) {
                    setIsFollow(true); // Set isFollow to true if the user is a follower
                }
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
            });
    }, [userid]);

    const followUser = (userId) => {
        fetch("http://localhost:5000/follow", {
            method: "put", // Use uppercase "PUT" (though lowercase works, uppercase is a convention)
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                followId: userId, // Ensure the key matches your backend API
            }),
        })
            .then((res) => res.json()) // Convert response to JSON
            .then((data) => {
                if (data.error) {
                    console.error("Error following user:", data.error); // Handle API errors
                } else {
                    console.log("Followed user successfully:", data); // Log success
                }
            })
            .catch((err) => {
                console.error("An error occurred:", err); // Handle network or other errors
            });
    };

    const unfollowUser = (userId) => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            console.error("No JWT token found");
            return;
        }

        fetch("http://localhost:5000/unfollow", {
            method: "PUT", // Make sure it's uppercase for consistency
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                unfollowId: userId, // Make sure this matches the backend's expected field
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error unfollowing user:", data.error); // Log the error
                    alert("Error unfollowing user: " + data.error);
                } else {
                    console.log("Unfollowed user successfully:", data);
                    // Optionally update your state/UI here after successful unfollow
                }
            })
            .catch((err) => {
                console.error("An error occurred:", err);
                alert("An error occurred: " + err.message);
            });
    };

    return (

        <div className="profile" aria-label="User Profile">
            <div className="profile-frame">
                <div className="profile-pic" aria-label="Profile Picture">
                    <img src={user.Photo?user.Photo:picLink} alt="Profile" />
                </div>
                <div className="profile-data">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                        <h1>{user.username}</h1>
                        <button
                            className={`followBtn ${isFollow ? 'unfollow' : 'follow'}`} // Add conditional classes for styling
                            onClick={() => {
                                if (isFollow) {
                                    unfollowUser(user._id);
                                    setIsFollow(false); // Update state to reflect unfollowing
                                   // window.location.reload()
                                } else {
                                    followUser(user._id);
                                    setIsFollow(true); // Update state to reflect following
                                  //  window.location.reload()
                                }
                            }}
                        >
                            {isFollow ? "Un Link" : "Link"} {/* Change text dynamically based on state */}
                        </button>

                    </div>
                    <div className="profile-info">
                        <p>{posts.length}</p>
                        <p>{user.followers ? user.followers.length : "0"} followers</p>
                        <p>{user.following ? user.following.length : "0"} following</p>

                    </div>
                </div>
            </div>
            <hr style={{ width: "90%", margin: "25px auto", opacity: "0.8" }} />
            <div className="gallery">
                {posts.map((pics) => {
                    return <img key={pics._id} src={pics.photo} onClick={() => {
                        //   toggledetails(pics)
                    }} className="item"></img>
                })}
            </div>
            {/* {show &&
                <Postdetail item={posts} toggledetails={toggledetails} />
            } */}
        </div>
    );
}
