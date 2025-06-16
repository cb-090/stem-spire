import { useState } from "react";
import "./App.css";
import "./Results.css";

export default function Results({
  articles,
  favorites,
  user,
  favorite,
  unfavorite,
  click,
  setClick,
}) {
  const [clickedIds, setClickedIds] = useState(new Set());

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  
  return (
    <div className="scroll-container">
      <ul className="results-list">
        {articles.map((article, key) => (
          <li className="article-box" key={key}>
            <div className="article-header"
            >
              <span
                className={`article-title ${clickedIds.has(article.id) ? "clicked-title" : ""}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent any parent click events, if needed
                  openInNewTab(article.link);
                  setClick(article);
                  setClickedIds(new Set([...clickedIds, article.id]));
                }}
                  style={{ cursor: "pointer" }}
              >
                {article.title} <span className="external-icon">↗️</span>
            </span>
              <div className="right-group">
                <span>{article.author}</span> {/* author */}
                <p id="articleId" hidden>
                  {article.id}
                </p>
                {user && (
                  <button
                    onClick={() =>
                      favorites.find(
                        (favorite) => favorite.article_id == article.id
                      )
                        ? unfavorite(article.id)
                        : favorite(article.id)
                    }
                  >
                    {favorites.find(
                      (favorite) => favorite.article_id == article.id
                    )
                      ? "🩷"
                      : "♡"}
                  </button>
                )}
              </div>
            </div>
            <p className="article-text">{article.content}</p>
            {article.tags && Array.isArray(article.tags) && (
              <div className="article-tags">
                {article.tags.map((tag, index) => (
                  <span className="tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
