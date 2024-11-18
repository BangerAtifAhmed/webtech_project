import React, { useState, useEffect, useContext } from 'react';//hook 
import logo from "../img/knownetimg.png";
import "../css/sign.css"
import { Link, useNavigate } from 'react-router-dom';
import { Flip, toast, tost } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { LoginContext } from '../context/logincontext';

export default function Signup() {
    const { setUserLogin } = useContext(LoginContext)
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    //toast function 
    const notifyC = (error) => toast.warn(`${error}`,
        {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Flip,
        })
    const notifyA = (error) => toast.error(`${error}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
    })//run after data save
    const notifyB = (message) => toast.success(`${message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
    })//run after data save
    //////////////////////////////////////////
    const emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const usernameregex = /^[a-zA-Z0-9_]{3,15}$/; // Alphanumeric, underscores, 3-15 characters
    const postData = (e) => {
        e.preventDefault();  // Prevent the form from refreshing the page
        if (!emailregex.test(email)) {
            notifyC("Invalid Email")
            return; // Exit if email is invalid
        }
        else if (!passregex.test(password)) {
            notifyC("Password must contain at least eight characters,including at least one number and includes both lower and uppercase letters and special characters for example #,?!")
            return; // Exit if pass is invalid
        } else if (!usernameregex.test(username)) {
            notifyC("username must contain Alphanumeric, underscores, 3-15 characters")
            return; // Exit if username is invalid
        }
        //sending data to server
        //in auth.js has /Signup
        fetch('http://localhost:5000/Signup', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                //send in json formate
                name: name,
                username: username,
                email: email,
                password: password,

            })
        }).then(res => res.json()).then(data => {
            if (data.message) {  // Adjust according to your API response structure
                notifyB(data.message);  // Show success toast if data is saved successfully
                navigate("/signin")
            } else {
                notifyA(data.error || "An error occurred");  // Show error toast if something goes wrong
            }
            console.log(data)
        })//displaying data or error
    }

    const continuewithgoogle = (credentialResponse) => {
        console.log(credentialResponse);
        const jwtDetail = jwt_decode(credentialResponse.credential)
        console.log((jwtDetail));
        fetch('http://localhost:5000/googleLogin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email_verified: jwtDetail.email_verified,
                email: jwtDetail.email,
                name: jwtDetail.name,
                clientId: jwtDetail.sub,
                username: jwtDetail.email.split('@')[0], // Generate a username
                Photo: jwtDetail.picture
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    console.log("Login successful:", data);
                    localStorage.setItem("jwt", data.token); // Store the token
                    localStorage.setItem("user", JSON.stringify(data.user)); // Store the token
                    setUserLogin(true); // Update login state
                    navigate("/"); // Navigate to the homepage
                    // Save token, redirect, etc.
                } else {
                    console.error("Login error:", data.error);
                }
            })
            .catch(err => console.error("Request failed:", err));

    }

    return (
        <div className="signup">
            <div className="form-container">
                <div className='form'>
                    <img className="signuplogo" src={logo} alt="Knownet Logo" />
                    <p className='loginpara'>Sign up to grow knowledge of Tech</p>
                    <div><input type='email' name="email" onChange={(e) => { setEmail(e.target.value) }} id="email" placeholder='Email' /></div>
                    <div><input type='text' name="name" onChange={(e) => { setName(e.target.value) }} id="name" placeholder='NAME' /></div>
                    <div><input type='text' name="username" onChange={(e) => { setUserName(e.target.value) }} id="username" placeholder='User name' /></div>
                    <div><input type='password' name="password" onChange={(e) => { setPassword(e.target.value) }} id="password" placeholder='Password' /></div>
                    <p className='loginpara' style={{ fontSize: "12px", margin: "3px 0px" }}>By signing up, you agree to our terms ,<br /> privacy policy and cookies policy</p>
                    <hr/>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <input 
        type="submit" 
        id="submit-btn" 
        onClick={postData} 
        value="Sign up" 
        style={{
            border: "none", // No border
            color: "white", // White text
            padding: "12px 20px", // Padding for button
            textAlign: "center", // Center the text
            textDecoration: "none", // Remove underline
            display: "inline-block", // Keep inline-block for layout
            fontSize: "16px", // Font size
            cursor: "pointer", // Pointer cursor on hover
            borderRadius: "4px", // Rounded corners
            marginBottom: "20px" // Margin between the input button and Google login button
        }}
    />

    <GoogleLogin
        onSuccess={credentialResponse => {
            continuewithgoogle(credentialResponse);
        }}
        onError={() => {
            console.log("Login Failed");
        }}
        useOneTap
        style={{
            display: "block", // Ensure it is block for alignment
            width: "fit-content", // Automatically adjust width
            padding: "10px", // Add padding
            borderRadius: "5px", // Rounded corners
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
            cursor: "pointer", // Pointer cursor on hover
            marginTop: "10px" // Margin to add space above the Google login button
        }}
    />
</div>


                </div>
                <div className='form2'>Already have an account ? <Link to="/signin"><span style={{ color: "blue", cursor: "pointer" }}>Sign In</span></Link></div>
            </div>
        </div>
    );
}
