import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ action }) {
  const [content, setContent] = useState("");

  function submit(e) {
    e.preventDefault();
    action(content);
    console.log(content)
    setContent("");
  }

  return (
    <form onSubmit={submit} className="search-form">
      <p className="search-text"> Search for relevant content!</p><br />
      <input className="search-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter title, keywords, or author" />
      <button className="search-button">Search</button>
    </form>
  );
}