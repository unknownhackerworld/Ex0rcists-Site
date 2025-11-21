import React, { useEffect, useState } from "react";
import { auth, database as db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, get, set, update } from "firebase/database";
import { QRCodeSVG } from "qrcode.react";
import Swal from "sweetalert2";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const TOTP_VERIFICATION_KEY = "totpVerification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [totpSecret, setTotpSecret] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem(TOTP_VERIFICATION_KEY);
  }, []);

  const loginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    sessionStorage.removeItem(TOTP_VERIFICATION_KEY);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setCurrentUser(user);

      // Fetch user data from realtime db
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // First time login
        const res = await fetch("/.netlify/functions/generateTotpSecret");
        const { secret } = await res.json();
        await set(userRef, {
          email: user.email,
          firstLogin: true,
          totpSecret: secret,
        });
        setTotpSecret(secret);
        setStep("changePassword");
      } else {
        const data = snapshot.val();
        setTotpSecret(data.totpSecret);

        if (data.firstLogin) {
          setStep("changePassword");
        } else {
          setStep("totp");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.message,
      });
    }
    setLoading(false);
  };

  // ---------- Change Password ----------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password mismatch",
          text: "Passwords do not match.",
        });
        return;
      }

      await updatePassword(currentUser, newPassword);

      // Mark firstLogin = false
      await update(ref(db, `users/${currentUser.uid}`), {
        firstLogin: false,
      });

      Swal.fire({
        icon: "success",
        title: "Password updated",
        text: "Scan the QR and then enter your TOTP.",
      });
      setNewPassword("");
      setConfirmPassword("");
      setStep("showQR");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to update password",
        text: error.message,
      });
    }
  };

  const handleVerifyTOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/.netlify/functions/verifyTotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: totp, secret: totpSecret }),
      });

      const { valid } = await res.json();

      if (valid) {
        Swal.fire({
          icon: "success",
          title: "TOTP verified",
          text: "Access granted.",
        });
        sessionStorage.setItem(
          TOTP_VERIFICATION_KEY,
          JSON.stringify({ uid: currentUser.uid, timestamp: Date.now() })
        );
        setTotp("");
        navigate("/admin");
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid code",
          text: "Please try again.",
        });
      }
    } catch (err) {
      console.error("TOTP verification error:", err);
    }
  };


  // ---------- Login with Google/GitHub ----------
  const loginWithProvider = async (provider) => {
    try {
      setLoading(true);
      sessionStorage.removeItem(TOTP_VERIFICATION_KEY);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        Swal.fire({
          icon: "warning",
          title: "Account not linked",
          text: "Social login is not linked to any admin account.",
        });
        await auth.signOut();
        return;
      }

      const data = snapshot.val();

      if (data.email !== user.email) {
        Swal.fire({
          icon: "warning",
          title: "Email mismatch",
          text: "Please contact an administrator.",
        });
        await auth.signOut();
        return;
      }

      if (data.firstLogin) {
        Swal.fire({
          icon: "warning",
          title: "Action required",
          text: "Complete the initial password change via email login first.",
        });
        await auth.signOut();
        return;
      }

      if (!data.totpSecret) {
        Swal.fire({
          icon: "warning",
          title: "TOTP secret missing",
          text: "Please contact an administrator.",
        });
        await auth.signOut();
        return;
      }

      setCurrentUser(user);
      setTotpSecret(data.totpSecret);
      setStep("totp");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getOtpAuthInfo = () => {
    if (!totpSecret || !currentUser) return { url: "", secret: "" };
    return {
      url: `otpauth://totp/Ex0rcists:${currentUser.email}?secret=${totpSecret}&issuer=Ex0rcists&image=https://ex0rcists.maattraan.xyz/assets/logo_dragon-BsFihXED.png`,
      secret: totpSecret,
    };
  };

  const handleCopySecret = async () => {
    const { secret } = getOtpAuthInfo();
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      Swal.fire({
        icon: "success",
        title: "Copied",
        text: "Secret copied to clipboard.",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Copy failed",
        text: "Unable to copy the secret automatically.",
      });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen font-share text-white">
      <h1 className="text-4xl mb-6">Admin Login</h1>

      {/* Step 1: Normal Login */}
      {step === "login" && (
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
      )}

      {/* Step 2: Change Password */}
      {step === "changePassword" && (
        <form onSubmit={handleChangePassword} className="space-y-4 w-80">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          />
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded"
          >
            Update Password
          </button>
        </form>
      )}

      {/* Step 3: Show QR for Authenticator */}
      {step === "showQR" && (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-gray-300">
            Scan this QR in Google Authenticator / Authy
          </p>
          <QRCodeSVG value={getOtpAuthInfo().url || "Ex0rcists"} size={180} bgColor="#fff" fgColor="#000" />
          {getOtpAuthInfo().secret && (
            <div className="text-center space-y-2">
              <h2 className="font-semibold text-lg">Enter Code Manually:</h2>
              <p className="font-mono text-xl">{getOtpAuthInfo().secret}</p>
              <button
                type="button"
                onClick={handleCopySecret}
                className="w-80 bg-gray-800 hover:bg-gray-700 py-2 rounded"
              >
                Copy Secret
              </button>
            </div>
          )}
          <button
            onClick={() => setStep("totp")}
            className="w-80 bg-blue-500 hover:bg-blue-600 py-3 rounded"
          >
            Next: Enter TOTP
          </button>
        </div>
      )}

      {/* Step 4: Verify TOTP */}
      {step === "totp" && (
        <form onSubmit={handleVerifyTOTP} className="space-y-4 w-80">
          <input
            type="text"
            placeholder="Enter TOTP code"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded"
          >
            Verify TOTP
          </button>
        </form>
      )}

      {/* Social login (only in login step) */}
      {step === "login" && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Login;
