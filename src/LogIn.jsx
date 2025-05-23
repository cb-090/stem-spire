import { supabase } from './supabase'; // update this path

export default function LogIn({isSignUp, setIsSignUp}) {

  async function signUp(e) {
    e.preventDefault();
    setIsSignUp(true);
    const email= document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Email:', email);
    console.log('Password:', password);
    if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        // if (error) setMessage(error.message)
        // else setMessage('Check your email to confirm sign up.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        // if (error) setMessage(error.message)
        // else setMessage('Logged in!')
      }

    }

  return (
    <>
      <h2>Log In</h2>
      <div>
        <form>
          <p>Sign Up!</p>
          <label>Email</label>
          <input id="email" placeholder="Email"></input>
          <label>Password</label>
          <input
            id="password"
            placeholder="*************"
          ></input>
          <button onClick={signUp}>Sign Up</button>
          <p>If you already have an account,</p>
          <button>Log In</button>
        </form>
      </div>
    </>
  );
}
