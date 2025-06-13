import './Recommend.css'; 
import './App.css';
import { useEffect } from "react";

export default function Recommended({
  userName,
  favorites,
  user,
  favorite,
  unfavorite,
  articles,
  recommendations,
  setRecommendations,
  click,
}) {
  console.log("Incoming recommendations:", recommendations);
  if (!Array.isArray(recommendations)) {
    console.error("recommendations is not an array:", recommendations);
    return <p>Error: Recommendations is not an array.</p>;
  }
    
  useEffect(() => {
    //click in nested inside an array rn bc the parameter needs to be an array, if you change it to favorites, it would just be getRecommendations(favorites, articles);
    if (!click) return; // prevent running on initial render
    const recs = getRecommendations([click], articles);
    setRecommendations(recs);
  }, [click]);
  // Calculates Jaccard similarity between two tag arrays
  function calculateJaccardSimilarity(tags1, tags2) {
    const set1 = new Set(tags1);
    const set2 = new Set(tags2);

    const intersection = [...set1].filter((tag) => set2.has(tag));
    const union = new Set([...tags1, ...tags2]);

    if (union.size === 0) return 0;
    return intersection.length / union.size;
  }
  function getRecommendations(
    referenceArticles = [],
    allArticles = [],
    numRecs = 3
  ) {
    const recsMap = new Map();

    referenceArticles.forEach((ref) => {
      if (!ref) return;
        const clickedArticle = allArticles.find(
          (a) => a.id === ref?.article_id || a.id === ref?.id
        );

      allArticles.forEach((article) => {
        if (article.id === clickedArticle.id) return;

        const similarity = calculateJaccardSimilarity(
          clickedArticle.tags || [],
          article.tags || []
        );

        if (similarity > 0) {
          const existing = recsMap.get(article.id) || {
            article,
            similarity: 0,
          };
          existing.similarity += similarity;
          recsMap.set(article.id, existing);
        }
      });
    });

    //maps the similarity and returns an array of articles sorted by most similar

    return [...recsMap.values()]
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, numRecs);
  }

  return (
    userName && (
      <div className="recommend-wrapper">
        <div className="recommend-header">
          <h2>Recommended Articles for {userName}:</h2>
          {recommendations.length > 0 ? (
            <p>Here's some articles you might like!</p>
          ) : (
            <p>No recommended articles yet.</p>
          )}
        </div>
  
        <ul className="recommend-grid">
          {recommendations
            .filter((rec) => rec && rec.article)
            .map((rec, key) => (
              <li className="article-box" key={key}>
                <div className="article-header-r">
                  <span className="article-title-r">{rec.article.title}</span>
                  <div className="right-group">
                    <p id="articleId" hidden>{rec.article.id}</p>
                    {userName && (
                      <button
                        onClick={() =>
                          favorites.find(
                            (favorite) => favorite.article_id == rec.article.id
                          )
                            ? unfavorite(rec.article.id)
                            : favorite(rec.article.id)
                        }
                      >
                        {favorites.find(
                          (favorite) => favorite.article_id == rec.article.id
                        )
                          ? "⭐"
                          : "☆"}
                      </button>
                    )}
                  </div>
                </div>
                <p className="article-text">{rec.article.content}</p>
                {rec.article.tags?.length > 0 && (
                  <div className="article-tags">
                    {rec.article.tags.map((tag, index) => (
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
    )
  );  
}  
