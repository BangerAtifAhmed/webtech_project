import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../img/knownetimg.png";
import "../css/signin.css";
import { Link } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import { LoginContext } from '../context/logincontext';

export default function Signin() {
    const {setUserLogin}=useContext(LoginContext)
    const navigate = useNavigate();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;

    const notifyC = (error) => toast.warn(error, { position: "top-center", autoClose: 5000, theme: "dark", transition: Zoom });
    const notifyA = (error) => toast.error(error, { position: "top-center", autoClose: 5000, theme: "dark", transition: Zoom });
    const notifyB = (message) => toast.success(message, { position: "top-center", autoClose: 5000, theme: "dark", transition: Zoom });

    const postData = (e) => {
        e.preventDefault();

        const isEmailOrUsername = emailregex.test(username) || usernameRegex.test(username);
        if (!isEmailOrUsername) {
            notifyC("Invalid Email or Username");
            return;
        }

        if (password.trim() === "") {
            notifyC("Password cannot be empty");
            return;
        }

        const body = {
            password,
            ...(emailregex.test(username) ? { email: username } : { username })
        };

        fetch('http://localhost:5000/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("jwt", data.token); // Store the token
                localStorage.setItem("user",JSON.stringify( data.user)); // Store the token
                setUserLogin(true); // Update login state
                navigate("/"); // Navigate to the homepage
                notifyB("Logged in successfully"); // Notify the user
            }
            else {
                notifyA(data.error || "An error occurred during login.");
            }
        })
        .catch(error => {
            notifyA("An error occurred");
            console.error("Fetch error:", error);
        });
    };

    return (
        <div className='signin'>
            <div>
                <div className='loginform'>
                    <img className='signinlogo' src={logo} alt='logo' />
                    <div>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUserName(e.target.value)} 
                            placeholder='Email or Username' 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder='Password' 
                        />
                    </div>
                    <input 
                        type="submit" 
                        id="login-btn" 
                        value="Sign in" 
                        onClick={postData} 
                    />
                </div>
                <div className="loginform2">
                    Don't have an account? 
                    <Link to="/signup">
                        <span style={{color: "blue", cursor: "pointer"}}>Sign Up</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
