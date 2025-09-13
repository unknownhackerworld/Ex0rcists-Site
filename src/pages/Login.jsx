import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // for Email/Password login
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("❌ Login failed: " + error.message);
    }
    setLoading(false);
  };

  const loginWithProvider = async (provider) => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if this email exists in Email/Password provider
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
      if (!methods.includes("password")) {
        alert(
          "⚠️ User not found in Email/Password login. Please link your social login first."
        );
        await auth.signOut();
        setLoading(false);
        return;
      }

      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("❌ Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black font-share text-white">
      <h1 className="text-4xl mb-6">Admin Login</h1>

      <form onSubmit={loginWithEmail} className="space-y-4 w-80">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-bloodred-500 hover:bg-bloodred-600 py-3 rounded"
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <div className="my-4 text-gray-400">OR</div>

      <button
        onClick={() => loginWithProvider(new GoogleAuthProvider())}
        className="w-80 bg-blue-500 py-3 mb-3 rounded"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => loginWithProvider(new GithubAuthProvider())}
        className="w-80 bg-gray-700 py-3 rounded"
      >
        Sign in with GitHub
      </button>
    </div>
  );
};

export default Login;
