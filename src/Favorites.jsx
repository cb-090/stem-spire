import './Favorites.css'; 

export default function Favorites() {
  const placeholderFavorites = Array.from({ length: 10 });

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>Favorites</h2>
      </div>
      <div className="scroll-container">
        {placeholderFavorites.map((_, index) => (
          <div className="article-box" key={index}>
            <div className="article-header">
              <span >Girls Who Code Program Shows Strong Outcomes in Closing Gender Gap In Tech</span> {/* Title */ }
              <div className="right-group">
                <span>Girls WHO Code authors</span> {/* author */ }
                <span>⭐</span> {/* bookmark */ }
              </div>
            </div>
            <p className="article-text">
            NEW YORK, NY – Girls Who Code, a nonprofit working to close the gender gap in tech, has released a 
            groundbreaking report with the American Institutes for Research (AIR) evaluating the effect of the Girls Who 
            Code’s Summer Programs. The study found that high school students who participate in Summer Programs are more 
            likely than their peers to major in computer-science related fields in college, and highlights the critical 
            role of targeted educational initiatives in fostering gender diversity in tech.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
