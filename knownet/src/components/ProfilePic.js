import React, { useState, useEffect, useRef } from "react"

export default function ProfilePic({ changeprofile }) {
    const hiddenFileInput = useRef(null)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
   

    const postDetails = () => {

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

    const postpic=()=>{
             
            fetch("http://localhost:5000/uploadProfilePic", {
                method: "PUT",
                headers: {  // Corrected "header" to "headers"
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    
                    pic: url
                })
            })
                .then(res => res.json())
                .then(data => {if(data.error){
                //    notifyA(data.error)
                }
                else{
                    console.log(data);
                    changeprofile()
                    window.location.reload()
                    //notifyB("Successfully Posted");
               //     navigate("/")
               }})
                .catch(err => console.log(err));
        
    }

    useEffect(() => {
        if (image) {

            postDetails()
        }
    }, [image])

    useEffect(()=>{
        if(url){
            postpic()
        }
    },[url]);

    const handlecClick = () => {
        hiddenFileInput.current.click()
    }
    return <div className="ProfilePic darkBg">
        <div className="changePic centered">
            <div>
                <h2>Change Profile Photo</h2>
            </div>
            <div style={{ borderTop: "1px solid #00000030" }}>
                <button className="upload-btn" onClick={handlecClick} style={{ marginTop: "10px", color: "purple" }}>upload Photo</button>
                <input onChange={(e) => { setImage(e.target.files[0]) }} type="file" ref={hiddenFileInput} accept="image/*" style={{ display: "none" }} />
            </div>
            <div style={{ borderTop: "1px solid #00000030" }}>
                <button className="upload-btn" onClick={()=>{
                    setUrl(null)
                    postpic();
                }}style={{ marginTop: "10px", color: "#ED4956" }}>Remove Current Photo</button>

            </div>
            <div style={{ borderTop: "1px solid #00000030" }}>
                <button onClick={changeprofile}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }}>Cancle</button>
            </div>
        </div>
    </div>
}