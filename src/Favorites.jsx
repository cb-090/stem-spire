import { useState } from "react";
import "./App.css";
import './Favorites.css'; 

export default function Favorites({userName, favorites, unfavorite}) {
  const [clickedArticles, setClickedArticles] = useState(new Set());

  const handleArticleClick = (article) => {
    if (article.articles?.link) {
      window.open(article.articles.link, "_blank", "noreferrer");
      setClickedArticles((prev) => new Set(prev).add(article.article_id));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Favorites</h2>
        <p>Hi {userName}!</p>
      </div>
      <ul className="results-list">
      {favorites.map((article) => (
        <li className="article-box" key={article.article_id}>
          <div className="article-header">
            <span
              className={`article-title ${clickedArticles.has(article.article_id) ? "clicked-title" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleArticleClick(article);
                if (article.articles?.link) {
                  window.open(article.articles.link, "_blank", "noreferrer");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {article.articles?.title || article.title} <span className="external-icon">↗️</span>
            </span>
              <div className="right-group">
                <span>{article.articles.author}</span> 
                <button onClick={async () => unfavorite(article.article_id)}>⭐</button>
                  </div>
            </div>
            <p className="article-text">{article.articles.content}</p>
            {article.articles.tags && Array.isArray(article.articles.tags) && (
              <div className="article-tags">
                {article.articles.tags.map((tag, index) => (
                  <span className="tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>))}
      </ul>
    </div>
  );
}
