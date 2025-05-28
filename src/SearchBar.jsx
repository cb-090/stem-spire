import { useState } from "react";

export default function SearchBar({ action }) {
  const [content, setContent] = useState("");

  function submit(e) {
    e.preventDefault();
    action(content);
    console.log(content)
    setContent("");
  }

  return (
    <form onSubmit={submit}>
      <p>Search for useful STEM-based resources!</p><br />
      <input value={content} onChange={(e) => setContent(e.target.value)} />
      <button>Search</button>
    </form>
  );
}