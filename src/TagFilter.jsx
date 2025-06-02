import './TagFilter.css';

export default function TagFilter({ availableTags, selectedTags, onChange }) {
  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  }

  return (
    <div className="tag-filter">
      {availableTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}



