import React from "react"
import '../css/Postdetail.css'
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from 'react-toastify';
export default function Postdetail({ item, toggledetails }) {

    const navigate=useNavigate()
    const notifyB = (message) => toast.success(message, { position: "top-center", autoClose: 5000, theme: "dark", transition: Zoom });
    const removepost = (postId) => {
        if(window.confirm("Do you Want To delete The Post ?")){

            fetch(`http://localhost:5000/deletePost/${postId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                },
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log("Post deleted successfully");
                    toggledetails()
                  navigate("/")
                    notifyB("Deleted Sucessfully")
                    // Add logic to update the UI here, like removing the post from the UI
                } else {
                    console.error("Failed to delete post", data.error);
                }
            })
            .catch((error) => {
                console.error("Error deleting post:", error);
            });
        }
    };
    
    return (
        <div className='showcomment'>
            <div className='container2'>
                <div className='postPic'>
                    <img src={item.photo} alt="Post" />
                </div>
                <div className='details'>
                    <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                        <div className="card-pic">
                            <img src={"defaultPic.png"} alt="User Profile" />
                        </div>
                        <h5>{item.postedBy.username}</h5>
                        <div className="deletePost"   onClick={()=>{removepost(item._id)}}>
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </div>
                    </div>
                    <div className='comment-section' style={{ borderBottom: "1px solid #00000029" }}>
                        {item.comments.map((comment) => (
                            <p className="comm" key={comment._id}>
                                <span className="commenter" style={{ fontWeight: "bolder" }}>
                                    {comment.postedBy.username}{" "}
                                </span>
                                <span className="commentText">{comment.comment}</span>
                            </p>
                        ))}

                    </div>
                    <div className="card-content">
                        <p>{item.likes.length} Links</p>
                        <p> {item.body}</p>
                    </div>
                    <div className="add-comment">
                        <span className="material-symbols-outlined">mood</span>
                        <input type="text" /*value={comment} onChange={(e) => setComment(e.target.value)}*/ placeholder="Add a comment" />
                        <button className="comment"
                        // onClick={()=>{
                        //     // makecomment(comment,item._id);
                        //     // togglecomment();
                        // }}
                        >Post</button>
                    </div>
                </div>
            </div>
            <div className='close-comment'>
                <span className="material-symbols-outlined material-symbols-outlined-comment"
                    onClick={toggledetails}
                >close</span>
            </div>
        </div>
    )
}