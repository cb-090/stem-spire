import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import search from "./searchService.js";

import LogIn from "./LogIn.jsx";
import About from "./About.jsx";
import SearchBar from "./SearchBar.jsx";
import Results from "./Results.jsx";
import Favorites from "./Favorites.jsx";
import TagFilter from "./TagFilter.jsx";
import { supabase } from "./supabase";
import Recommended from "./Recommended.jsx";


function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [query, setQuery] = useState(null);
  const [articles, setArticles] = useState([]);
  const [recommendations,setRecommendations] = useState([])
  const [userFavorites, setUserFavorites] = useState([]);
  const availableTags = ["Highschool","College", "Internship", "study tips", "summer program", "career development"];
  const [selectedTags, setSelectedTags] = useState([]);
  const [click, setClick] = useState()

  // const articles = [{title: "Article 1", content: "this is content for the purposes of testing how articles are displayed", author: "author here", tags: ["college"]},
  //   {title: "Article 2", content:"this website is designed to connect young girls and people interested in STEM with the right resources for them!", author: "Girls Who Code", tags: ["summer program", "internship", "career development"]},
  // {title: "Article 3", content:"blah blah blah", author: "you! yes, you!", tags: ["college", "study tips", "internship"] }]

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
      console.log("Current user:", currentUser, currentUser?.id);
      if (currentUser) {
        setIsNewUser(false);
        getUserName(currentUser);
        showFavorites();
      }
      getArticles()
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

  useEffect(() => {
    getArticles()
  }, [selectedTags, query])

   useEffect(() => {
      // Set up real-time subscription
      if (user) {
        getUserName(user)

        const channel = supabase
          .channel('favorites')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'favorites',
            },
            async () => {
              console.log("Favorites updated")
              await getArticles()
              await showFavorites()
            }
          )
          .subscribe()

        return () => {
          channel.unsubscribe()
        }
      }
      else {
        setUserName(null)
      }
    }, [user])

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
    changePage("browse");
    if (error) console.error("Error signing out", error);
  }

  //favoriting article
  async function favorite(id) {
    const { data: userSession } = await supabase.auth.getSession();
    const user_id = userSession.session.user.id;
    const article_id = id;
    console.log("Favorited article", article_id);

    await supabase.from("favorites").upsert([{ user_id, article_id }]);
    return
  }
  
  //unfavorite
  async function unfavorite(id) {
    const { data: userSession } = await supabase.auth.getSession();
    const user_id = userSession.session.user.id;
    const article_id = id;
    console.log("Unfavorited article", article_id);

    await supabase
  .from("favorites")
  .delete()
  .eq("user_id", user_id)
  .eq("article_id", article_id);

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
          author,
          link
        )
      `)
      .eq("user_id", user_id);
  
    if (error) {
      console.error("Error fetching favorites:", error.message);
      return;
    }
  
    setUserFavorites(favoriteArticles);
    console.log("Favorites:", favoriteArticles); 
  }
  
  async function getArticles() {
      let { data: filtered, error } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        content,
        tags,
        author,
        link
      `)
    if (error) {
      console.error("Error fetching articles:", error.message);
      return;
    }
  
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q)
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered
        .map(article => {
          const matchCount = article.tags
            ? selectedTags.filter(tag => article.tags.includes(tag)).length
            : 0;
          return { ...article, matchCount };
        })
        .filter(article => article.matchCount > 0) 
        .sort((a, b) => b.matchCount - a.matchCount);
    }
    setArticles(filtered);
  }

  useEffect((query) => {
    search(query)
  }, [query])
   
  return (
    <>
    <nav className="navbar">
      <div className="nav-left">
        <h1>STEM-Spire</h1>
      </div>

      <div className="nav-center">
        <span className={`nav-link ${isBrowsing ? "active" : ""}`} onClick={() => changePage("browse")}>Browse</span>
        {user && <span className={`nav-link ${isFavorites ? "active" : ""}`} onClick={() => changePage("favorites")}>Favorites</span>}
        <span className={`nav-link ${isAbout ? "active" : ""}`} onClick={() => changePage("about")}>About</span>
      </div>

      <div className="nav-right">
        {!user && <button onClick={() => changePage("login")}>Log In</button>}
        {user && <button onClick={signOut}>Log Out</button>}
      </div>
    </nav>

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
          setRecommendations={setRecommendations}
        />
      )}
      {isAbout && <About />}
      {isBrowsing && (
        <div className="page">
          <div className="page-header">
            <h2>Browse</h2>
            {user && <p>Hi {userName}!</p>}
          </div>
          <Recommended user={user}favorites={userFavorites}  favorite={favorite} unfavorite={unfavorite} userName={userName} articles = {articles}recommendations={recommendations} setRecommendations={setRecommendations} click={click}/>

          <SearchBar action = {setQuery} />
          <TagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
            
          />
          {articles && <Results articles={articles} favorites={userFavorites} user={user} favorite={favorite} unfavorite={unfavorite} click={click} setClick={setClick}/>}
        </div>
      )}

      {isFavorites && (
        <Favorites userName={userName} favorites={userFavorites} unfavorite={unfavorite}recommendations={recommendations} setRecommendations={setRecommendations}articles = {articles} />
      )}
    </>
  );
}

export default App;
