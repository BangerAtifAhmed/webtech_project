import React, { useState } from 'react'; // Removed useEffect as it's unused
import logo from "../img/knownetimg.png";
import "./sign.css";
import { Link, useNavigate } from 'react-router-dom';
import { Flip, toast } from 'react-toastify'; // Removed 'tost' typo

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    // Toast functions
    const notifyC = (error) => toast.warn(error, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
        transition: Flip,
    });

    const notifyA = (error) => toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
        transition: Flip,
    });

    const notifyB = (message) => toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
        transition: Flip,
    });

    // Regular expressions for validation
    const emailregex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%^&*])(?=.{8,})/;

    const postData = (e) => {
        e.preventDefault();
        if (!emailregex.test(email)) {
            notifyC("Invalid Email");
            return;
        } else if (!passregex.test(password)) {
            notifyC("Password must contain at least eight characters, including at least one number, uppercase and lowercase letters, and a special character.");
            return;
        }

        // Sending data to server
        fetch('http://localhost:5000/Signup', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password,
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                notifyB(data.message);
                navigate("/signin");
            } else {
                notifyA(data.error || "An error occurred");
            }
            console.log(data);
        });
    }

    return (
        <div className="signup">
            <div className="form-container">
                <div className='form'>
                    <img className="signuplogo" src={logo} alt="Knownet Logo" />
                    <p className='loginpara'>Sign up to grow knowledge of Tech</p>
                    <div><input type='email' name="email" onChange={(e) => setEmail(e.target.value)} id="email" placeholder='Email' /></div>
                    <div><input type='text' name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder='NAME' /></div>
                    <div><input type='text' name="username" onChange={(e) => setUserName(e.target.value)} id="username" placeholder='User name' /></div>
                    <div><input type='password' name="password" onChange={(e) => setPassword(e.target.value)} id="password" placeholder='Password' /></div>
                    <p className='loginpara' style={{ fontSize: "12px", margin: "3px 0px" }}>By signing up, you agree to our terms, privacy policy, and cookies policy.</p>
                    <button id="submit-btn" onClick={postData}>Sign up</button>
                </div>
                <div className='form2'>Already have an account? <Link to="/signin"><span style={{ color: "blue", cursor: "pointer" }}>Sign In</span></Link></div>
            </div>
        </div>
    );
}
