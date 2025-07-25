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
  loading,
  setLoading,
  userName, 
  setUserName,
  surveyStep, 
  setSurveyStep,
  surveyData, 
  setSurveyData,
  surveyQuestions
}) {
 
  
  async function signUp(e) {
    e.preventDefault();
    setUserName(document.getElementById("name").value)
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email);
    console.log("Password:", password);
    const { data, error } = await supabase.auth.signUp({ email, password });
    

    if (error) {
      console.log("Error signing up", error);
      setWarning(error.message);
    } else {
        setLoading(true)
        console.log(loading)
        setWarning("Please check email for confirmation and close this tab once confirmed!")

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
      // setIsNewUser(true);
      // setIsSignedIn(false);
      // setWarning(error.message);
      
      setWarning("Oops! Invalid email or password. You're a new user, please sign up!");
  

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
  function goToSignUp (e){
    e.preventDefault();
    setIsSignedIn(true); 
    setIsNewUser(true); 
    setWarning("")
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

  return (
    <div className="login-page">
      <div className="login-header"></div>
      <div>
      {!isSignedIn && !isNewUser && warning && <p id="warning">{warning}</p>}

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
        {!isSignedIn && isNewUser && (
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
              <button type="button" onClick={goToSignUp}>
                Submit
              </button>
            )}
          </div>
        </form>
        )}
        {/* this should just be the first time you sign up, otherwise it takes you to the home page */}
        {isSignedIn && isNewUser && warning && <p id="warning">{warning}</p>}

        {isSignedIn && isNewUser && !loading&&(
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
      </div>
    </div>
  );
}
