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
  function createAccount(e) {
    e.preventDefault();
    setIsNewUser(true);
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
      changePage("home");
    }
  }

  return (
    <div className="login-page">
      <div className="login-header"></div>
      <div>
        {!isSignedIn && !isNewUser && (
          <form>
            <h2>Log In</h2>
            <label>Email</label>
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
            <label>Name</label>
            <input id="name" placeholder="First Name, Last Name"></input>
            <label>Email</label>
            <input id="email" placeholder="Email"></input>
            <label>Password</label>
            <input id="password" placeholder="*************"></input>
            <button onClick={signUp}>Sign Up</button>
          </form>
        )}
        {/* this should just be the first time you sign up, otherwise it takes you to the home page */}
        {isSignedIn && isNewUser && (
          <form>
            <p>What are you looking for?</p>
            <p>What is your occupation?</p>
            <select>
              <option value={"Student"}>Student</option>
              <option value={"Professional"}>Professional</option>
              <option value={"Personal use"}>Personal Use</option>
            </select>
            <label>Sign up complete!</label>
            <button onClick={() => changePage("browse")}>See your suggestions</button>
          </form>
        )}
      </div>
    </div>
  );
}
