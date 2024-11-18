import React, { useState, useEffect } from 'react';
import "../css/createpost.css";
import { toast,Zoom,Bounce} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
 
export default function CreatePost() {
    const [body, setBody] = useState("")
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const navigate=useNavigate()
    const notifyA = (error) => toast.error(error, { position: "top-center", autoClose: 5000, theme: "dark", transition: Zoom });
    const notifyB = (message) => toast(`🦄 ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });

    useEffect(() => {
        //when url change it rerender component
        if (url) {
            fetch("http://localhost:5000/create", {
                method: "POST",
                headers: {  // Corrected "header" to "headers"
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            })
                .then(res => res.json())
                .then(data => {if(data.error){notifyA(data.error)}else{notifyB("Successfully Posted");navigate("/")}})
                .catch(err => console.log(err));
        }
    }, [url])
    //posting image to cloundinary
    const postDetails = () => {
        console.log(body, image);
        const data = new FormData()
        data.append("file", image);
        data.append("upload_preset", "project");
        data.append("cloud_name", "knownet");
        fetch("https://api.cloudinary.com/v1_1/knownet/image/upload",
            {
                method: "post",
                body: data
            }
        ).then(res => res.json()).then(data => setUrl(data.url)).catch(err => console.log(err));

        //saving post

    }
    const loadfile = (event) => {
        var output = document.getElementById('output');
        const file = event.target.files[0];
        
        if (file) {
            output.src = URL.createObjectURL(file);
            output.onload = function () {
                URL.revokeObjectURL(output.src);  // Clean up the object URL to release memory
            };
        } else {
            console.log("No file selected or file selection was canceled.");
        }
    }
    return (
        <div className="createpost">
            <div className="post-header">
                <h4>Create New Post</h4>
                <button id="post-btn" onClick={() => { postDetails() }}>Share</button>
            </div>
            <div className="main-div">
                <img id="output" src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png' />
                <input type="file" id="file-upload" accept="image/*" onChange={(event) => { loadfile(event); setImage(event.target.files[0]) }} />
            </div>
            <div className="details">
                {/* <div className="card-header">
                    <div className="card-img">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1727967290081-c50ae33dbc3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2OHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Default Preview"
                        />
                    </div>
                    <h5>Atif</h5>
                </div> */}
                <textarea value={body} onChange={(e) => {
                    setBody(e.target.value)
                }} id="post-content" placeholder="What's on your mind?"></textarea>
            </div>
        </div>
    );
}
