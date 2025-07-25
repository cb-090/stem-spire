import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

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
  const [recommendations, setRecommendations] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const availableTags = [
    "Highschool",
    "College",
    "Internship",
    "study tips",
    "summer program",
    "career development",
  ];
  const [selectedTags, setSelectedTags] = useState([]);
  const [click, setClick] = useState();
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    education_level: "",
    field_of_interest: "",
    resource_interests: [],
  });
  
  const surveyQuestions = [
    {
      id: "education_level",
      question: "What is your current level of education?",
      options: ["High School", "University", "Graduate", "Post-graduate"],
      multi: false,
    },
    {
      id: "field_of_interest",
      question: "What is your current field of study/major or career interest?",
      options: [
        "Engineering", "Computer Science", "Biology", "Chemistry", "Physics",
        "Medicine", "Environmental Science", "Statistics", "Data Science", "Applied Math"
      ],
      multi: false,
    },
    {
      id: "resource_interests",
      question: "What types of opportunities or resources are you most interested in? (Select all that apply)",
      options: [
        "Career exploration/development",
        "Skill-building workshops",
        "Academic tips, resources, and study strategies",
        "Scholarships and financial aid",
        "Summer programs and internships",
        "Research opportunities",
        "Mentorship or networking opportunities"
        ],
        multi: true,
      }
    ];

  
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
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!loading || !isNewUser) return;
  
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getUser();
  
      if (data?.user?.confirmed_at) {
        console.log("✅ Email confirmed!");
        clearInterval(interval);
        setLoading(false);
        changePage("browse");
  
        // Insert profile into 'user profile'
        const current_user = data.user;
        const { error: insertError } = await supabase
          .from("user profile")
          .insert([{ id: current_user.id, name: userName }]);
  
        if (insertError) {
          console.error("🚨 Insert error:", insertError.message);
          setWarning(insertError.message);
        } else {
          setUser(current_user); 
          submitSurvey(current_user);
          console.log("🎉 Survey submitted and user created!");
        }
      } else {
        console.log("⏳ Still waiting for email confirmation...");
      }
    }, 5000); // poll every 5 seconds
  
    return () => clearInterval(interval);
  }, [loading, isNewUser]);
  
  async function submitSurvey(current_user) {
    console.log("Submitting survey...");
    const { error } = await supabase
    .from("user profile")
    .update(surveyData)
    .eq("id", current_user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {

    const { data: articlesData, error: articleError } = await supabase
    .from("articles")
    .select("id, title, content, tags, author, link");
  
    if (articleError) {
    console.error("Failed to fetch articles for recommendations:", articleError);
    return;
    }
  
    const interestTags = [
      ...(surveyData.resource_interests || []),
      ...(surveyData.field_of_interest ? [surveyData.field_of_interest] : []),
      ...(surveyData.education_level ? [surveyData.education_level] : [])
    ].map(tag => tag.toLowerCase());
  
    const scoredArticles = articlesData.map(article => {
    const articleTags = (article.tags || []).map(tag => tag.toLowerCase());
    const matches = interestTags.filter(tag => articleTags.includes(tag));
    return { article, score: matches.length };
  });
  
  const surveyRecs = scoredArticles
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
    console.log("Interest Tags:", interestTags);
    console.log("Articles from Supabase:", articlesData);
    console.log("Scored Recommendations:", surveyRecs);
  
    console.log("Is setRecommendations a function?", typeof setRecommendations);
    setRecommendations(surveyRecs);
    
  }
}
  

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
      getArticles();
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
    getArticles();
  }, [selectedTags, query]);

  useEffect(() => {
    // Set up real-time subscription
    if (user) {
      getUserName(user);

      const channel = supabase
        .channel("favorites")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "favorites",
          },
          async () => {
            console.log("Favorites updated");
            await getArticles();
            await showFavorites();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    } else {
      setUserName(null);
    }
  }, [user]);

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
    return;
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("User not signed in");
      return;
    }

    const { data: favoriteArticles, error } = await supabase
      .from("favorites")
      .select(
        `
        article_id,
        articles (
          id,
          title,
          content,
          tags,
          author
        )
      `
      )
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching favorites:", error.message);
      return;
    }

    setUserFavorites(favoriteArticles);
    console.log("Favorites:", favoriteArticles);
  }

  async function getArticles() {
    let { data: filtered, error } = await supabase.from("articles").select(`
        id,
        title,
        content,
        tags,
        author,
        link
      `);
    if (error) {
      console.error("Error fetching articles:", error.message);
      return;
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.content.toLowerCase().includes(q)
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered
        .map((article) => {
          const matchCount = article.tags
            ? selectedTags.filter((tag) => article.tags.includes(tag)).length
            : 0;
          return { ...article, matchCount };
        })
        .filter((article) => article.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);
    }
    setArticles(filtered);
  }




  return (
    <>
      <header>
        <h1>STEM-Spire</h1>
        <nav id="navBar">
          {/* checks if signed in, if not, shows log in, if logged in, shows log out */}

          <button onClick={() => changePage("browse")}>Browse</button>

          {user && (
            <button onClick={() => changePage("favorites")}>Favorites</button>
          )}

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
          loading={loading}
          setLoading={setLoading}
          userName= {userName}
          setUserName = {setUserName}
          surveyStep = {surveyStep} 
          setSurveyStep = {setSurveyStep}
          surveyData = {surveyData} 
          setSurveyData = {setSurveyData}
          surveyQuestions = {surveyQuestions}
        />
      )}
      {isAbout && <About />}
      {isBrowsing && (
        <div className="browse-page">
          <div className="page-header">
            <h2>Browse</h2>
            <p>Hi {userName}!</p>
          </div>
          <Recommended
            user={user}
            favorites={userFavorites}
            favorite={favorite}
            unfavorite={unfavorite}
            userName={userName}
            articles={articles}
            recommendations={recommendations || []}
            setRecommendations={setRecommendations}
            click={click}
          />

          <SearchBar action={setQuery} />
          <TagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />

          {articles && (
            <Results
              articles={articles}
              favorites={userFavorites}
              user={user}
              favorite={favorite}
              unfavorite={unfavorite}
              click={click}
              setClick={setClick}
            />
          )}
        </div>
      )}

      {isFavorites && (
        <Favorites
          userName={userName}
          favorites={userFavorites}
          unfavorite={unfavorite}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          articles={articles}
        />
      )}
    </>
  );
}

export default App;
