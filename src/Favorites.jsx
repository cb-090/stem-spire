import "./App.css";
import './Favorites.css'; 

export default function Favorites({userName, favorites, unfavorite}) {
  return (
    <div className="page">
      <div className="page-header">
        <h2>Favorites</h2>
        <p>Hi {userName}!</p>
      </div>
      <div className="results-list">
      {favorites.map((article) => (
        <li className="article-box" key={article.article_id}>
          <div className="article-header">
              <span className = "article-title">{article.articles.title}</span> {/* Title */}
              <div className="right-group">
                <span>{article.author}</span> 
                <button onClick={async () => unfavorite(article.article_id)}>⭐</button>
                  </div>
            </div>
            <p className="article-text">{article.articles.content}</p>
          </li>))}
     
        
      </div>
    </div>
  );
}
