import { useState } from "react";
import "./App.css";

import LogIn from "./LogIn.jsx";
import About from "./About.jsx";
import SearchBar from "./SearchBar.jsx";
import Results from "./Results.jsx";
import Favorites from "./Favorites.jsx";
import { supabase } from "./supabase";

function App() {
  const [user, setUser] = useState(false);
  const [results, setResults] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isFavorites, setIsFavorites] = useState(false);
  const [isAbout, setIsAbout] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const changePage = (page) => {
    setIsLogin(false);
    setIsHome(false);
    setIsFavorites(false);
    setIsAbout(false);

    if (page == "login") {
      setIsLogin(true);
    } else if (page == "home") {
      setIsHome(true);
    } else if (page == "favorites") {
      setIsFavorites(true);
    } else if (page == "about") {
      setIsAbout(true);
    }
  };

  return (
    <>
      <header>
        <h1>STEM-Spire</h1>
        <nav idName="navBar">
          <button onClick={() => changePage("login")}>Log In</button>
          <button onClick={() => changePage("home")}>Home</button>
          <button onClick={() => changePage("favorites")}>Favorites</button>
          <button onClick={() => changePage("about")}>About</button>
        </nav>
      </header>
      {isLogin && (
        <LogIn
          isSignUp = {isSignUp}
          setIsSignUp={setIsSignUp}
        />
      )}
      {isAbout && <About />}
      {isHome && (
        <div>
          <h2>Search</h2>
          <SearchBar />
          {results && <Results />}
        </div>
      )}
      {isFavorites && <Favorites />}
    </>
  );
}

export default App;
