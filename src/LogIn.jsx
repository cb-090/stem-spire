import { useState } from "react";
import { supabase } from "./supabase"; // update this path
import "./LogIn.css";

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
      options: ["High School", "College", "Graduate", "Post-graduate"],
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
        "Skill-building workshops (e.g., coding, interview tips, etc.)",
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
      console.log("User ID:", user?.id);
      if (nameError) {
        console.error("🚨 Insert error:", nameError);
        setWarning(error.message);
      } else {
        setIsSignedIn(true);
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
      setIsNewUser(true);
      setIsSignedIn(false);
      setWarning("Oops! You're a new user, please sign up!");
    } else {
      setUser(data.user);
      setIsSignedIn(true);
      changePage("browse");
      location.reload()
    }
  }
  
  function createAccount(e) {
    e.preventDefault();
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
    const { error } = await supabase
      .from("user profile")
      .update(surveyData)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      changePage("browse");
      location.reload();
    }
  }


  return (
    <div className="login-page">
      <div className="login-header"></div>
      <div>
        {!isSignedIn && !isNewUser && (
          <form>
            <h2>Log In</h2>
            <label>Email: </label>
            <input id="email" placeholder="Email"></input>
            <label>Password: </label>
            <input id="password" placeholder="*************"></input>
            <button onClick={signIn}>Sign In</button>
            <p>If you don't have an account,</p>
            <button onClick={createAccount}>Sign Up</button>
          </form>
        )}
        {!isSignedIn && isNewUser && warning && <p id="warning">{warning}</p>}
        {!isSignedIn && isNewUser && (
          <form>
            <p>Sign Up!</p>
            <label>Name: </label>
            <input id="name" placeholder="First & Last Name"></input>
            <label>Email: </label>
            <input id="email" placeholder="Email"></input>
            <label>Password: </label>
            <input id="password" placeholder="*************"></input>
            <button onClick={signUp}>Sign Up</button>
          </form>
        )}
        {/* this should just be the first time you sign up, otherwise it takes you to the home page */}
        {isSignedIn && isNewUser && (
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
                <button
                  type="button"
                  onClick={() => setSurveyStep((prev) => prev - 1)}
                >
                  Back
                </button>
              )}
              {surveyStep < surveyQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setSurveyStep((prev) => prev + 1)}
                >
                  Next
                </button>
              ) : (
                <button type="button" onClick={submitSurvey}>
                  Submit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
