import './Results.css'; 

export default function Results({articles}) {
    return (
        <div className="scroll-container">
        <ul className="results-list">
            {articles.map((article, key) =>
            (<li className="article-box" key={key}>
                <div className="article-header">
                <span>{article.title}</span> {/* Title */ }
                <div className="right-group">
                    <span>{article.author}</span> {/* author */ }
                    <span>⭐</span> {/* bookmark */ }
                </div>
                </div>
                <p className="article-text">
                {article.content}
                </p>
                {article.tags && Array.isArray(article.tags) && (
                  <div className="article-tags">
                    {article.tags.map((tag, index) => (
                      <span className="tag" key={index}>{tag}</span>
                    ))}
                  </div>
                )}
              </li>)
            )}
        </ul>
        </div>
    )
}