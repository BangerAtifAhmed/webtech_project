import React, { useEffect, useState } from 'react';
import Postdetail from "../components/Postdetail"
import '../css/profile.css';
import ProfilePic from '../components/ProfilePic';

export default function Profile() {
    var picLink="https://cdn-icons-png.flaticon.com/128/3135/3135768.png"
    const [pic, setPic] = useState([])
    const [show, setShow] = useState(false)
    const [posts, setPosts] = useState([])
    const [changePic,setChangePic]=useState(false)
    const [user,setUser] = useState("")
    const toggledetails = (posts) => {
        if (show) {
            setShow(false);

        } else {
            setShow(true);
            setPosts(posts);
        


        }
    }

    const changeprofile=()=>{
        if(changePic){
            setChangePic(false)
        }else{
            setChangePic(true)
        }
    }
    useEffect(() => {
        fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then((result) => {
            setPic(result.posts)
            setUser(result.user)
            console.log(pic)
        })
    }, [])
    return (

        <div className="profile" aria-label="User Profile">
            <div className="profile-frame">
                <div className="profile-pic" aria-label="Profile Picture">
                    <img onClick={changeprofile} src={user.Photo?user.Photo:picLink} alt="Profile" />
                </div>
                <div className="profile-data">
                    <h1>{JSON.parse(localStorage.getItem("user")).username}</h1>
                    <div className="profile-info">
                        <p>{pic ? pic.length:"0"} posts</p>
                        <p>{user.followers? user.followers.length:"0"} followers</p>
                        <p>{user.following? user.following.length:"0"} following </p>
                    </div>
                </div>
            </div>
            <hr style={{ width: "90%", margin: "25px auto", opacity: "0.8" }} />
            <div className="gallery">
                {pic.map((pics) => {
                    return <img key={pics._id} src={pics.photo} onClick={() => {
                        toggledetails(pics)
                    }} className="item"></img>
                })}
            </div>
            {show &&
                <Postdetail item={posts} toggledetails={toggledetails} />
            }
            {
                changePic&& <ProfilePic changeprofile={changeprofile}/>
            }
        </div>
    );
}
