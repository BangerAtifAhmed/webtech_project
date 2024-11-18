import './App.css';

import Navbar from './components/Navbar';
import About from './components/about';
import Home from './screens/Home';
import Signup from './components/signup';
import Signin from './components/signin';
import Profile from './screens/profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreatePost from './screens/createpost';
import React, { useState } from 'react';
import { LoginContext } from './context/logincontext';
import Modal from './components/modal';
import UserProfile from './components/userprofile';
import Myfollowingpost from './screens/Myfollowing';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [userlogin, setUserLogin] = useState(false);
  const [modalopen,setModalOpen]=useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        
<GoogleOAuthProvider clientId="1000185787059-02jivoqe32j4iim8djfnfi2ubpgb0ffi.apps.googleusercontent.com">
        <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
          <Navbar login={userlogin} />
          <Routes>
            <Route path="/about" element={<About/>}/>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/profile/:userid" element={<UserProfile />} />
            <Route path="/followingpost" element={<Myfollowingpost />} />
          </Routes>
          <ToastContainer theme="dark" />

          { modalopen && <Modal setModalOpen={setModalOpen}></Modal> }
        </LoginContext.Provider>
        </GoogleOAuthProvider>;
      </div>
    </BrowserRouter>
  );
}

export default App;
