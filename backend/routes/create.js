const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requirelogin = require("../middlewares/requirelogin");
const POST = mongoose.model("POST");

// Get all posts
router.get("/allposts", requirelogin, async (req, res) => {
    let limit=req.query.limit
    let skip=req.query.skip
    try {
        const posts = await POST.find()
            .populate("postedBy", "_id name username Photo")
            .populate("comments.postedBy", "_id name username")
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort("-createdAt");
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});
// Create a new post
router.post("/create", requirelogin, async (req, res) => {
    const { body, pic } = req.body;

    if (!pic || !body) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    try {
        const post = new POST({
            body,
            photo: pic,
            postedBy: req.user,
        });
        const result = await post.save();
        res.json({ post: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

// Get all posts by the logged-in user
router.get("/myposts", requirelogin, async (req, res) => {
    try {
        const myposts = await POST.find({ postedBy: req.user._id }).populate("postedBy", "_id name username")
        .populate("comments.postedBy", "_id name username")
        .sort("-createdAt");
        ;
        res.json(myposts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});

// Like a post
router.put("/like", requirelogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name username Photo");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: err });
    }
});

// Unlike a post
router.put("/unlike", requirelogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name username Photo");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: err });
    }
});


// comment a post
router.put("/comment", requirelogin, async (req, res) => {
    const comment = {
        comment: req.body.text,
        postedBy: req.user._id
    };
    
    try {
        const updatedPost = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true } // Option to return the updated document
        )
        .populate("comments.postedBy", "_id username") // Populate user details in the comment
        .populate("postedBy", "_id username Photo"); // Populate post creator details

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found." });
        }

        res.json(updatedPost);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});
router.delete("/deletePost/:postId", requirelogin, async (req, res) => {
    try {
        const post = await POST.findOne({ _id: req.params.postId }).populate("postedBy", "_id");
        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await POST.findByIdAndDelete(req.params.postId); // Direct deletion
            return res.json({ success: true, message: "Post deleted successfully" });
        } else {
            return res.status(403).json({ error: "Unauthorized action" });
        }
    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ error: "Failed to delete the post" });
    }
});


// to show following post

router.get("/myfollowingpost", requirelogin, (req, res) => {
    // Check if the user has any following, if not return an empty array
    if (req.user.following.length === 0) {
        return res.json([]); // If no following, return empty posts
    }

    POST.find({ postedBy: { $in: req.user.following } })  // Find posts where postedBy is in the following list
        .populate("postedBy", "_id username")  // Populate the user info of the poster (id and username)
        .populate("comments.postedBy", "_id username")  // Populate the user info for comments (id and username)
        .then(posts => {
            res.json(posts);  // Send posts back as response
        })
        .catch(err => {
            console.error("Error fetching posts from following:", err);
            res.status(500).json({ error: "Error fetching posts" });  // Return a 500 error if something goes wrong
        });
});

module.exports = router;
