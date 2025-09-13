import React, { useState } from "react";
import { auth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

const ChangePassword = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("❌ Passwords do not match");
      return;
    }
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, oldPass);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);
      alert("✅ Password updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl mb-6">Change Password</h1>
      <form onSubmit={handleChangePassword} className="space-y-4 w-96">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />
        <button className="w-full bg-bloodred-500 hover:bg-bloodred-600 py-3 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
