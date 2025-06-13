import { useState } from "react";
import { supabase } from "./supabase"; // update this path
import "./LogIn.css";
import "./App.css";

export default function LogIn({
  changePage,
  user,
  setUser,
  isNewUser,
  setIsNewUser,
  isSignedIn,
  setIsSignedIn,
  warning,
  setWarning,
  setRecommendations
}) {
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

  async function signUp(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email);
    console.log("Password:", password);
    const { data, error } = await supabase.auth.signUp({ email, password });
    // if (!data.user) {
    //   // User needs to confirm email first
    //   setWarning("Check your email to confirm your account.");
    //   return;
    // }

    if (error) {
      console.log("Error signing up", error);
      setWarning(error.message);
    } else {
      const current_user = data.user;
      const { nameError } = await supabase
      .from("user profile")
      .insert([{ id: current_user.id, name: name }]);
      console.log("User ID:", current_user?.id);
      if (nameError) {
        console.error("🚨 Insert error:", nameError);
        setWarning(error.message);
      } else {
        setUser(current_user);
        setIsSignedIn(true); 
        setIsNewUser(true); 
      }
    }
  }

  async function signIn(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Error signing in", error);
      setWarning("Invalid email or password.");
      setIsSignedIn(false);
    } else {
      setUser(data.user);
      setIsSignedIn(true);
      changePage("browse");
      location.reload()
    }
  }
  
  function createAccount(e) {
    e.preventDefault();
    setWarning("");
    setIsNewUser(true);
  }

  function handleSurveyChange(id, value) {
    setSurveyData((prev) => {
      if (id === "resource_interests") {
        const updated = prev.resource_interests.includes(value)
          ? prev.resource_interests.filter((v) => v !== value)
          : [...prev.resource_interests, value];
        return { ...prev, [id]: updated };
      }
      return { ...prev, [id]: value };
    });
  }

  async function submitSurvey() {
    console.log("Submitting survey...");
    const { error } = await supabase
    .from("user profile")
    .update(surveyData)
    .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
    
    const { data: profile, error: profileError } = await supabase
      .from("user profile")
      .select("field_of_interest, resource_interests, education_level")
      .eq("id", user.id)
      .single();

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
  
  // store in App state through props if passed down:
    console.log("Is setRecommendations a function?", typeof setRecommendations);
    setRecommendations(surveyRecs);
    setTimeout(() => {
        changePage("browse");
      }, 50);
    changePage("browse");
  }
}

  return (
  <div className="login-page">
    <div>
      {!isSignedIn && !isNewUser && (
        <div className="form-box">
          {warning && <p id="warning">{warning}</p>}
          <form>
            <h2>Log In</h2>
            <label>Email</label>
            <input id="email" placeholder="Email" />
            <label>Password</label>
            <input id="password" type="password" placeholder="*************" />
            <button onClick={signIn}>Log In</button>
            <p>If you don't have an account,</p>
            <button type="button" onClick={createAccount}>Sign Up</button>
          </form>
        </div>
      )}

      {!isSignedIn && isNewUser && (
        <div className="form-box">
          {warning && <p id="warning">{warning}</p>}
          <form>
            <h2>Sign Up</h2>
            <label>Name</label>
            <input id="name" placeholder="First & Last Name" />
            <label>Email</label>
            <input id="email" placeholder="Email" />
            <label>Password</label>
            <input id="password" type="password" placeholder="*************" />
            <button onClick={signUp}>Sign Up</button>
            <p>Already have an account?</p>
            <button type="button" onClick={() => {
                setWarning("");
                setIsNewUser(false);
            }}>Log In</button>
          </form>
        </div>
      )}
    
      {isSignedIn && isNewUser && (
        <div className="form-box">
          <form>
            <p>{surveyQuestions[surveyStep].question}</p>
            {surveyQuestions[surveyStep].options.map((option, idx) => (
              <div key={idx}>
                <label>
                  <input
                    type={surveyQuestions[surveyStep].multi ? "checkbox" : "radio"}
                    name={surveyQuestions[surveyStep].id}
                    value={option}
                    checked={
                      surveyQuestions[surveyStep].multi
                        ? surveyData[surveyQuestions[surveyStep].id].includes(option)
                        : surveyData[surveyQuestions[surveyStep].id] === option
                    }
                    onChange={() =>
                      handleSurveyChange(surveyQuestions[surveyStep].id, option)
                    }
                  />
                  {option}
                </label>
              </div>
            ))}

            <div>
              {surveyStep > 0 && (
                <button type="button" onClick={() => setSurveyStep((prev) => prev - 1)}>Back</button>
              )}
              {surveyStep < surveyQuestions.length - 1 ? (
                <button type="button" onClick={() => setSurveyStep((prev) => prev + 1)}>Next</button>
              ) : (
                <button type="button" onClick={submitSurvey}>Submit</button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  </div>
)}
