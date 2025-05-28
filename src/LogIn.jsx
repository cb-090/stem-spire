import { supabase } from "./supabase"; // update this path
import './LogIn.css'; 

export default function LogIn({
  changePage,
  newUser,
  setNewUser,
  isSignedIn,
  setIsSignedIn,
}) {
  async function signUp(e) {
    e.preventDefault();
    setIsSignedIn(true);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Email:", email);
    console.log("Password:", password);
    if (isSignedIn) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) console.error("Error signing up", error);
    }
  }
  function logIn(e) {
    e.preventDefault();
    setNewUser(false);
  }

  async function signIn(e) {
    e.preventDefault();
    setIsSignedIn(true);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) console.error("Error signing in", error);
    changePage("home");
  }

  return (
    <div className="login-page">
    <div className="login-header">
      <h2>Log In</h2>
    </div>
      <div>
        {!isSignedIn && newUser && (
          <form>
            <p>Sign Up!</p>
            <label>Email: </label>
            <input id="email" placeholder="Email"></input>
            <label>Password: </label>
            <input id="password" placeholder="*************"></input>
            <button onClick={signUp}>Sign Up</button>
            <p>If you already have an account,</p>
            <button onClick={logIn}>Log In</button>
          </form>
        )}
        {!newUser && (
          <form>
              <h2>Log In!</h2>
            <label>Email</label>
            <input id="email" placeholder="Email"></input>
            <label>Password</label>
            <input id="password" placeholder="*************"></input>
            <button onClick={signIn}>Sign In</button>
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
