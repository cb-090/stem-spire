import { useEffect } from "react";
export default function Recommended({
  userName,
  articles,
  recommendations,
  setRecommendations,
  click,
}) {
  useEffect(() => {
    //click in nested inside an array rn bc the parameter needs to be an array, if you change it to favorites, it would just be getRecommendations(favorites, articles);
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
      const clickedArticle = allArticles.find(
        (a) => a.id === ref.article_id || a.id === ref.id
      );
      if (!clickedArticle) return;

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
    <div>
      <h2>Recommended Articles for {userName}!</h2>
      {recommendations.length === 0 && (
        <p>No recommended articles yet.</p>
      )}
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
