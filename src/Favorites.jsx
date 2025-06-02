import './Favorites.css'; 

export default function Favorites({userName, favorites, unfavorite}) {
  // const placeholderFavorites = Array.from({ length: 10 });
  // console.log("userName in Favorites.jsx:", userName.userName);


  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>Favorites</h2>
        <p>Hi! {userName}</p>
      </div>
      <div className="scroll-container">
      {favorites.map((article) => (
        <li className="article-box" key={article.article_id}>
          <div className="article-header">
              <span>{article.articles.title}</span> {/* Title */}
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
