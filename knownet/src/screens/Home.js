import React, { useEffect, useState } from 'react';
import '../css/Home.css';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
    var picLink="https://cdn-icons-png.flaticon.com/128/3135/3135768.png"
    let limit=10;
    let skip=0;
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const [show, setShow] = useState(false);
    const [item, setItem] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/signin");
        } else {
       fetchPosts();
       window.addEventListener("scroll",handleScroll)
       return()=>{
           window.removeEventListener("scroll",handleScroll)
       }
        }
    },[navigate]);

    const fetchPosts=()=>{
        fetch(`http://localhost:5000/allposts?limit=${limit}&&skip=${skip}`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("jwt") },
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                setData((data)=>[...data,...result])
                
            })
            .catch(err => console.log(err));
    }
    const handleScroll = () => {
        if (
           document.documentElement.clientHeight+window.pageXOffset>=document.documentElement.scrollHeight
        ) {
            skip=skip+!0
            fetchPosts()
          
        }
    };
    
    const togglecomment = (posts) => {
        if (show) {
            setShow(false);

        } else {
            setShow(true);
            setItem(posts);
            console.log(item);


        }
    }

    const likepost = (id) => {
        fetch("http://localhost:5000/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ postId: id }),
        })
            .then(res => res.json())
            .then(result => {
                setData(prevData => prevData.map(post => post._id === result._id ? result : post));
            })
            .catch(err => console.log(err));
    };

    const unlikepost = (id) => {
        fetch("http://localhost:5000/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ postId: id }),
        })
            .then(res => res.json())
            .then(result => {
                setData(prevData => prevData.map(post => post._id === result._id ? result : post));
            })
            .catch(err => console.log(err));
    };

    const makecomment = (text, postId) => {
        fetch("http://localhost:5000/comment", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ text, postId }),
        })
            .then(res => res.json())
            .then(result => {
                setData(prevData => prevData.map(post => post._id === result._id ? result : post));
                setComment("");
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container">
            <div className="top">
                <div className="top-section">
                    {/* Add any top content here */}
                </div>
            </div>

            <div className="content-wrapper">
                <div className="main-content">
                    {data.map(post => (
                        <div className="card" key={post._id}>
                            <div className="card-header">
                                <div className="card-pic">
                                    <img src={post.postedBy.Photo ? post.postedBy.Photo:picLink} alt="User Profile" />
                                </div>
                              <Link to={`/profile/${post.postedBy._id}`}>  <h5>{post.postedBy.username}</h5></Link>
                            </div>
                            <div className="card-image">
                                <img src={post.photo} alt="Post" />
                            </div>
                            <div className="card-content">
                                {post.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? (
                                    <span className="material-symbols-outlined favorite-red" onClick={() => unlikepost(post._id)}>
                                        favorite
                                    </span>
                                ) : (
                                    <span className="material-symbols-outlined" onClick={() => likepost(post._id)}>
                                        favorite
                                    </span>
                                )}
                                <p>{post.likes.length} likes</p>
                                <p>{post.body}</p>
                                <p style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => togglecomment(post)}>view all comments</p>
                            </div>

                            <div className="add-comment">
                                <span className="material-symbols-outlined">mood</span>
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment"
                                />
                                <button className="comment" onClick={() => makecomment(comment, post._id)}>
                                    Post
                                </button>
                            </div>
                        </div>
                    ))}
                    {show && (
                        <div className='showcomment'>
                            <div className='container2'>
                                <div className='postPic'>
                                    <img src={item.photo} alt="Post" />
                                </div>
                                <div className='details'>
                                    <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                                        <div className="card-pic">
                                        <img src={item.postedBy.Photo ? item.postedBy.Photo:picLink} alt="User Profile" />

                                        </div>
                                        <h5>{item.postedBy.username}</h5>
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
                                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" />
                                        <button className="comment" onClick={()=>{
                                            makecomment(comment,item._id);
                                            togglecomment();
                                        }}>Post</button>
                                    </div>
                                </div>
                            </div>
                            <div className='close-comment'>
                                <span className="material-symbols-outlined material-symbols-outlined-comment" onClick={togglecomment}>close</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sidebar">
                    {/* <div className="trending">
                        <h2>Trending</h2>
                        <h3><a className="trending-item" href="#">Trending topic 1</a> - Brief info here.</h3>
                        <h3><a className="trending-item" href="#">Trending topic 2</a> - Brief info here.</h3>
                        <h3><a className="trending-item" href="#">Trending topic 3</a> - Brief info here.</h3>
                        <h3><a className="trending-item" href="#">Trending topic 4</a> - Brief info here.</h3>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Home;
