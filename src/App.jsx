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
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState(true);
  const [userFavorites, setUserFavorites] = useState([]);
  const articles = [
    {
      title: "Article 1",
      content:
        "this is content for the purposes of testing how articles are displayed",
      author: "author here",
      id: "35477eac-bab9-47c6-820c-ecdaef0c66f8",
      favorited: false

    },
    {
      title: "Article 2",
      content:
        "this website is designed to connect young girls and people interested in STEM with the right resources for them!",
      author: "Girls Who Code",
      id: "29d9ba6e-6d0f-4f01-b707-6f635a167a11",
      favorited: false

    },
    {
      title: "Article 3",
      content: "blah blah blah",
      author: "you! yes, you!",
      id: "blah",
      favorited: false
    },
  ];

  const [isLogin, setIsLogin] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(true);
  const [isFavorites, setIsFavorites] = useState(false);
  const [isAbout, setIsAbout] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [warning, setWarning] = useState("");

  const changePage = (page) => {
    setIsLogin(false);
    setIsBrowsing(false);
    setIsFavorites(false);
    setIsAbout(false);

    if (page == "login") {
      setIsLogin(true);
    } else if (page == "browse") {
      setIsBrowsing(true);
    } else if (page == "favorites") {
      setIsFavorites(true);
    } else if (page == "about") {
      setIsAbout(true);
    }
  };

  // some supabase stuff
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      console.log(user);
      if (currentUser) {
        setIsNewUser(false);
        getUserName(currentUser);
        showFavorites(currentUser);
      }
    });

    // Listen for future login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  //getting and setting user name
  async function getUserName(user) {
    const { data: profile, error } = await supabase
      .from("user profile")
      .select("name")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Failed to get user profile:", error.message);
    } else {
      setUserName(profile.name);
    }
  }

  // sign out user
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setIsSignedIn(false);
    setIsHome(true);
    if (error) console.error("Error signing out", error);
  }

  //favoriting article
  async function favorite(id) {
    const { data: userSession } = await supabase.auth.getSession();
    const user_id = userSession.session.user.id;
    const article_id = id;
    console.log(article_id);

    await supabase.from("favorites").upsert([{ user_id, article_id }]);
    await supabase.from("articles").update({favorited:true}).eq("id", article_id);
  }
  
  //unfavorite
  async function unfavorite(id) {
    const { data: userSession } = await supabase.auth.getSession();
    const user_id = userSession.session.user.id;
    const article_id = id;
    console.log(article_id);

    await supabase
  .from("favorites")
  .delete()
  .eq("user_id", user_id)
  .eq("article_id", article_id);
  await supabase.from("articles").update({favorited:false}).eq("id", article_id);

  }
  
  //getting user favorites

  async function showFavorites() {
    const { data: { session } } = await supabase.auth.getSession();
    const user_id = session?.user?.id;
  
    if (!user_id) {
      console.error("User not signed in");
      return;
    }
  
    const { data: favoriteArticles, error } = await supabase
      .from("favorites")
      .select(`
        article_id,
        articles (
          id,
          title,
          content,
          tags,
          author
        )
      `)
      .eq("user_id", user_id);
  
    if (error) {
      console.error("Error fetching favorites:", error.message);
      return;
    }
  
    setUserFavorites(favoriteArticles);
    console.log(favoriteArticles); 
  }
  

  return (
    <>
      <header>
        <h1>STEM-Spire</h1>
        <nav id="navBar">
          {/* checks if signed in, if not, shows log in, if logged in, shows log out */}

          <button onClick={() => changePage("browse")}>Browse</button>

          {user &&<button onClick={() => changePage("favorites")}>Favorites</button>}

          <button onClick={() => changePage("about")}>About</button>
          {!user && <button onClick={() => changePage("login")}>Log In</button>}
          {user && <button onClick={signOut}>Log Out</button>}
        </nav>
      </header>
      {isLogin && (
        <LogIn
          changePage={changePage}
          user={user}
          setUser={setUser}
          isNewUser={isNewUser}
          setIsNewUser={setIsNewUser}
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
          warning={warning}
          setWarning={setWarning}
        />
      )}
      {isAbout && <About />}
      {isBrowsing && (
        <div className="browse-page">
          <div className="page-header">
            <h2>Browse</h2>
            <p>Hi! {userName}</p>
          </div>
          <SearchBar action={setQuery} />
          {results && <Results articles={articles} user={user} favorite={favorite}unfavorite={unfavorite}/>}
        </div>
      )}
      {isFavorites && (
        <Favorites userName={userName} favorites={userFavorites}favorite={favorite}unfavorite={unfavorite} />
      )}
    </>
  );
}

export default App;
