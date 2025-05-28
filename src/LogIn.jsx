import { supabase } from "./supabase"; // update this path
import './LogIn.css'; 

export default function LogIn({
  changePage,
  user,
  setUser,
  newUser,
  setNewUser,
  isSignedIn,
  setIsSignedIn,
  showWarning,
  setShowWarning,
}) {
  async function signUp(e) {
    console.log("hello?");
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email);
    console.log("Password:", password);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log("Error signing up", error);
      document.getElementById("warning").textContent = error.message;
    } else {
      setIsSignedIn(true);
    }
  }
  function createAccount(e) {
    e.preventDefault();
    setNewUser(true);
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
      setNewUser(true);
      setIsSignedIn(false);
      setShowWarning(true);
    } else {
      setUser(data.user);
      setIsSignedIn(true);
      changePage("home");
    }
  }

  return (
    <div className="login-page">
    <div className="login-header">
    </div>
      <div>
        {!isSignedIn && !newUser && (
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
        {!isSignedIn && newUser && showWarning && (
          <p id="warning">Oops! You're a new user, please sign up!</p>
        )}
        {!isSignedIn && newUser && (
          <form>
            <p>Sign Up!</p>   
            <label>Email</label>
            <input id="email" placeholder="Email"></input>
            <label>Password</label>
            <input id="password" placeholder="*************"></input>
            <button onClick={signUp}>Sign Up</button>
          </form>
        )}
        {/* this should just be the first time you sign up, otherwise it takes you to the home page */}
        {isSignedIn && newUser && (
          <form>
            <p>What are you looking for?</p>
            <p>What is your occupation?</p>
            <select>
              <option value={"Student"}>Student</option>
              <option value={"Professional"}>Professional</option>
              <option value={"Personal use"}>Personal Use</option>
            </select>
            <label>See your suggestions</label>
            <button onClick={() => changePage("home")}>Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
}
