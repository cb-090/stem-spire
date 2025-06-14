import './About.css';
import "./App.css";

export default function About() {
  return (
    <div className="page">
      <div className='page-header' >
        <h2>About STEM-Spire</h2>
      </div>
      <p className="mission-blurb"> The underrepresentation of women and gender-nonconforming individuals in STEM fields 
      remains a significant barrier to inclusivity, often due to a lack of accessible resources, mentorship, and 
      encouragement. Our website aims to collect, categorizes,and curates STEM-related resources for high school and middle school students who may not see themselves represented 
      in the field.</p>

      <h2 className="section-title">About The Team</h2>
      <div className="team-grid">
        <div className="team-member">
          <h3>Amelie</h3>
          <img src="/amelie.png" alt="Member 1" />
          <p>about member 1 blah blah blah. member 1 is from here and they enjoy doing this and they are passionate about this website because blah blah blah</p>
        </div>
        <div className="team-member">
          <h3>Cara</h3>
          <img src="/profile-placeholder.png" alt="Member 2" />
          <p>about member 2 blah blah blah. member 2 is from here and they enjoy doing this and they are passionate about this website because blah blah blah</p>
        </div>
        <div className="team-member">
          <h3>Tara</h3>
          <img src="/profile-placeholder.png" alt="Member 3" />
          <p>about member 3 blah blah blah. member 3 is from here and they enjoy doing this and they are passionate about this website because blah blah blah</p>
        </div>
      </div>
    </div>
  );
}
