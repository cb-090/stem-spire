import './About.css';
import "./App.css";

export default function About() {
  return (
    <div className="page">
      <div className='page-header' >
        <h2>About STEM-Spire</h2>
        <p>♡ Built by girls in STEM, for girls in STEM ♡</p>
      </div>
      <p className="mission-blurb"> The underrepresentation of women and gender-nonconforming individuals in STEM fields 
      remains a significant barrier to inclusivity, often stemming from a lack of accessible resources, mentorship, and 
      encouragement. STEM-Spire aims to address these challenges by empowering those who may face barriers to accessing 
      or envisioning a future in STEM. Our website collects, categorizes, and curates STEM-related resources to support the 
      journey of underrepresented individuals in STEM. As women in STEM ourseleves we are commmited to increasing access to relevant resources 
      and making STEM-based fields more welcoming and inclusive for future generations! </p>

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
          <img src="/tara.png" alt="Member 3" />
          <p>Tara is a rising junior in college majoring in Computer Science. She loves programming websites, 
            designing things, and working on projects she's passionate about. Outside of academics, Tara enjoys hiking, baking, spending time with
            her cat, and hanging out with friends. She's especially passionate about STEM-Spire because, as a woman in STEM, 
            she relates to the feeling of not belonging in tech spaces due to the lack of representation. She's absolutely 
            thrilled to be part of a project that encourages and supports other women and gender-nonconforming individuals in 
            STEM. Tara hopes this platform can inspire girls to explore STEM fields and make it easier for others already in STEM
            to find the kinds of resources she wishes she had known about earlier - all accessible in one place.
        </p>
        </div>
      </div>
    </div>
  );
}
