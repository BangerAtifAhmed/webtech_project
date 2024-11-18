const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Jwt_secret } = require("../key");

// POST route for user signin
router.post('/signin', (req, res) => {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
        return res.status(422).json({ error: "Please provide email or username and password." });
    }

    User.findOne({ $or: [{ email }, { username }] }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Username." });
        }

        bcrypt.compare(password, savedUser.password).then(match => {
            if (match) {
                const token = jwt.sign({ _id: savedUser._id }, Jwt_secret);
                const {_id,name,email,username}=savedUser
                console.log({token,user:{_id,name,email,username}});
                
                res.json({ message: "Logged in successfully", token,user:{_id,name,email,username} });
            } else {
                return res.status(422).json({ error: "Invalid Password." });
            }
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error." });
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    });
});

// POST route for user signup
router.post("/signup", (req, res) => {
    const { email, name, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(422).json({ error: "Please fill in all fields." });
    }

    User.findOne({ $or: [{ email }, { username }] }).then(savedUser => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email or username." });
        }

        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                email,
                name,
                username,
                password: hashedPassword
            });

            user.save()
                .then(() =>{
                    let userId=user.id.toString()
                    const token = jwt.sign({ _id: userId }, Jwt_secret);
                    const {_id,name,email,username}=user
                    console.log({token,user:{_id,name,email,username}});
                    
                    res.json({ message: "Logged in successfully", token,user:{_id,name,email,username} });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal server error." });
                });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: "Error hashing password." });
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    });
});


router.post("/googleLogin", (req, res) => {
    const { email_verified, email, name, clientId, username, Photo } = req.body;

    if (!email_verified || !email || !name || !clientId || !username) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    if (email_verified) {
        User.findOne({ $or: [{ email }, { username }] })
            .then(savedUser => {
                if (savedUser) {
                    const token = jwt.sign({ _id: savedUser._id }, Jwt_secret);
                    const { _id, name, email, username } = savedUser;
                    return res.json({ token, user: { _id, name, email, username } });
                } else {
                    const password = email + clientId; // Simple password logic for new users
                    const user = new User({
                        email,
                        name,
                        username,
                        password,
                        Photo
                    });

                    user.save()
                        .then(() => res.json({ message: "Registered successfully." }))
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ error: "Internal server error." });
                        });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: "Internal server error." });
            });
    } else {
        res.status(400).json({ error: "Email not verified." });
    }
});

module.exports = router;
