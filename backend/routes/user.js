const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST=mongoose.model("POST")
const User=mongoose.model("User")
const requirelogin = require("../middlewares/requirelogin");


router.get("/user/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            POST.find({ postedBy: req.params.id }) // Fixed typo here
                .populate("postedBy", "_id username")
                .then(posts => {
                    res.json({ user, posts }); // Send user and posts data together
                })
                .catch(err => {
                    console.error("Error fetching posts:", err);
                    res.status(500).json({ error: "Failed to fetch posts" });
                });
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            res.status(500).json({ error: "Failed to fetch user" });
        });
});
router.put("/follow", requirelogin, async (req, res) => {
    try {
        // Update the followers array of the user being followed
        const updatedUser = await User.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User to follow not found" });
        }

        // Update the following array of the current user
        const updatedCurrentUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json({ updatedUser, updatedCurrentUser });
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});



//unfollow

router.put("/unfollow", requirelogin, async (req, res) => {
    try {
        const { unfollowId } = req.body; // Expecting the correct field "unfollowId"
        const loggedInUserId = req.user._id; // The logged-in user's ID (from JWT)

        // Ensure that the user to unfollow exists
        const userToUnfollow = await User.findById(unfollowId);
        if (!userToUnfollow) {
            return res.status(404).json({ error: "User to unfollow not found" });
        }

        // Remove logged-in user from the followers list of the user to unfollow
        const updatedUser = await User.findByIdAndUpdate(
            unfollowId,
            { $pull: { followers: loggedInUserId } },
            { new: true }
        );

        // Remove the user being unfollowed from the logged-in user's following list
        const updatedCurrentUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { $pull: { following: unfollowId } },
            { new: true }
        );

        // Send the updated users back to the client
        res.json({ updatedUser, updatedCurrentUser });
    } catch (err) {
        console.error("Error in unfollow route:", err.message);
        res.status(422).json({ error: err.message });
    }
});



router.put("/uploadProfilePic", requirelogin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, // Find the user by their ID
            { $set: { Photo: req.body.pic } }, // Update the 'Photo' field
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" }); // Handle case where user is not found
        }

        res.json(updatedUser); // Send the updated user object as the response
    } catch (err) {
        res.status(500).json({ error: "An error occurred while updating the profile picture" });
    }
});

module.exports=router;