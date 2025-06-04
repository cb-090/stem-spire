
export default function Recommended({
    userName,
    articles,
    favorites,
    recommendations,
    setRecommendations,
  }) {
    
    // Calculates Jaccard similarity between two tag arrays
    function calculateJaccardSimilarity(tags1, tags2) {
      const set1 = new Set(tags1);
      const set2 = new Set(tags2);
  
      const intersection = [...set1].filter((tag) => set2.has(tag));
      const union = new Set([...tags1, ...tags2]);
  
      if (union.size === 0) return 0;
      return intersection.length / union.size;
    }
  
    // Recommends articles similar to favorited ones
    function getRecommendations(favoriteArticles, allArticles, numRecs = 3) {

        if (!Array.isArray(favoriteArticles)) {
            console.warn("favoriteArticles is not an array:", favoriteArticles);
            return;
          }
      const recsMap = new Map();
  
      favoriteArticles.forEach((fav) => {
        const clickedArticle = allArticles.find((a) => a.id === fav.article_id);
  
        if (!clickedArticle) return;
  
        allArticles.forEach((article) => {
          if (article.id === clickedArticle.id) return;
  
          const similarity = calculateJaccardSimilarity(
            clickedArticle.tags || [],
            article.tags || []
          );
  
          if (similarity > 0) {
            const existing = recsMap.get(article.id) || { article, similarity: 0 };
            existing.similarity += similarity;
            recsMap.set(article.id, existing);
          }
        });
      });
  
      const sortedRecs = [...recsMap.values()].sort(
        (a, b) => b.similarity - a.similarity
      );
  
      setRecommendations(sortedRecs.slice(0, numRecs));
      console.log(recommendations)
    }
  
    return (
      <div>
        <h2>Recommended Articles for {userName}!</h2>
        <button onClick={() => getRecommendations(favorites, articles)}>
          Generate Recommendations
        </button>
  
        {recommendations.map((rec, key) => (
          <li className="article-box" key={key}>
            <div className="article-header">
              <span>{rec.article.title}</span>
              <div className="right-group">
                <span>{rec.article.author}</span>
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
      </div>
    );
  }
  