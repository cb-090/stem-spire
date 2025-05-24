import { useState } from "react";
import { useEffect } from "react";
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
  const [isHome, setIsHome] = useState(true);
  const [isFavorites, setIsFavorites] = useState(false);
  const [isAbout, setIsAbout] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  // some supabase stuff
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // sign out user
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setIsSignedIn(false);
    if (error) console.error("Error signing out", error);
  }

  return (
    <>
      <header>
        <h1>STEM-Spire</h1>
        <nav idName="navBar">
          {/* checks if signed in, if not, shows log in, if logged in, shows log out */}
          {!isSignedIn && (
            <button onClick={() => changePage("login")}>Log In</button>
          )}
          {isSignedIn && <button onClick={signOut}>Log Out</button>}
          <button onClick={() => changePage("home")}>Home</button>
          <button onClick={() => changePage("favorites")}>Favorites</button>
          <button onClick={() => changePage("about")}>About</button>
        </nav>
      </header>
      {isLogin && (
        <LogIn
          changePage={changePage}
          newUser={newUser}
          setNewUser={setNewUser}
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
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
