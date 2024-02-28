import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import "./App.css";
import { SSO_DOMAIN, supabaseClient } from "./supabase-client";

function App() {
  async function ssoLogin(sso_domain: string = SSO_DOMAIN) {
    const { data, error } = await supabaseClient.auth.signInWithSSO({
      domain: sso_domain,
    });
    if (error) {
      alert(error.message);
      return;
    }
    if (data?.url) {
      // redirect the user to the identity provider's authentication flow
      window.location.href = data.url;
      return;
    } else {
      alert("Unable to open SSO login page.");
    }
  }

  const [authState, setAuthState] = useState<AuthChangeEvent | "">("");
  // const [user, setUser] = useState<null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, sessionValue) => {
      if (event === "INITIAL_SESSION") {
        setSession(sessionValue);
      } else {
        setAuthState(event);
      }
    });
  }, []);

  async function logout() {
    await supabaseClient.auth.signOut();
    setSession(null);
  }

  return (
    <>
      <h1>SSO Login Demo</h1>
      <p>Auth state: {JSON.stringify(authState)}</p>
      {/* <h2>User Info</h2> */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <h2>Session</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {authState === "SIGNED_IN" ? (
        <p>
          <button onClick={() => logout()}>Sign Out</button>
        </p>
      ) : (
        <p>
          <button onClick={() => ssoLogin()}>SSO Login</button>
        </p>
      )}
    </>
  );
}

export default App;
