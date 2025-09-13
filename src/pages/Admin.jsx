import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import AddMembers from "../components/AddMembers";
import EditMembers from "../components/EditMembers";
import AddWriteups from "../components/AddWriteups";
import EditWriteups from "../components/EditWriteups";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("addMembers");
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }

      setUser(u);

      try {
        const snap = await get(ref(database, `admins`));
        if (snap.exists()) {
          const admins = snap.val();
          // ✅ Check if current user's email is in admins
          const email = u.email;
          const isAdminEmail = Object.values(admins).includes(email);
          setIsAdmin(isAdminEmail);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="text-center text-5xl text-white font-share my-10">Admin Panel</div>

      <div className="flex md:flex-row flex-col w-full text-white px-8 py-4 gap-8 font-share">
        <aside className="hidden md:flex flex-col gap-y-5 bg-[rgba(44,44,44,0.44)] p-6 sticky top-24 text-2xl rounded-xl">
          {isAdmin && (
            <>
              <button onClick={() => setActiveTab("addMembers")}>Add Members</button>
              <button onClick={() => setActiveTab("editMembers")}>Edit Members</button>
            </>
          )}
          <button onClick={() => setActiveTab("addWriteups")}>Add Writeups</button>
          <button onClick={() => setActiveTab("editWriteups")}>Edit Writeups</button>
        </aside>

        <main className="flex-1">
          {activeTab === "addMembers" && isAdmin && <AddMembers />}
          {activeTab === "editMembers" && isAdmin && <EditMembers />}
          {activeTab === "addWriteups" && <AddWriteups currentUser={user} />}
          {activeTab === "editWriteups" && <EditWriteups currentUser={user} />}
        </main>
      </div>
    </>
  );
};

export default Admin;
