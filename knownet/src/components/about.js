import React from 'react';
import '../css/about.css';

const About = () => {
  return (
    <div>
      <header>
        <h1 >About Us - Knownet</h1>
        <p>Your gateway to collaborative learning and discussion in Computer Science & AI/ML</p>
      </header>

      <section className="about-section">
        <h2>Welcome to Knownet!</h2>
        <p>
          Knownet is a vibrant community designed for computer science engineers and AI/ML enthusiasts to connect, 
          learn, and grow. Our platform enables users to create their profiles, share their ideas, and discuss the 
          latest advancements in technology. By combining the power of collaboration with the convenience of modern 
          web technology, we aim to build a space for meaningful discussions and knowledge sharing.
        </p>
      </section>

      <section className="features-section">
        <div className="feature">
          <h3>Interactive and Informative Discussions</h3>
          <p>Engage with like-minded individuals on trending topics and share your expertise through comments and posts.</p>
        </div>
        <div className="feature">
          <h3>Stay Updated</h3>
          <p>Explore our home page to find the latest trending topics, research breakthroughs, and user-generated posts.</p>
        </div>
        <div className="feature">
          <h3>Share Your Voice</h3>
          <p>Create posts to share your insights, receive feedback, and spark new ideas in the community.</p>
        </div>
        <div className="feature">
          <h3>Collaboration</h3>
          <p>Our clean interface makes it easy for users to connect, learn, and innovate together.</p>
        </div>
      </section>

      <section className="team-section">
        <h2>Project Team</h2>
        <div className="team-container">
          <div className="team-member">
            <h3>Ganesh Jayadev</h3>
            <p>SRN: PES2UG23AM038</p>
          </div>
          <div className="team-member">
            <h3>ATHIF AHEMED</h3>
            <p>SRN: PES2UG23AM019</p>
          </div>
          <div className="team-member">
            <h3>SYED JUNED</h3>
            <p>SRN:</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
