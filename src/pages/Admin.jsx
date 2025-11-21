import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import AddMembers from "../components/AddMembers";
import EditMembers from "../components/EditMembers";
import AddWriteups from "../components/AddWriteups";
import EditWriteups from "../components/EditWriteups";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TOTP_VERIFICATION_KEY = "totpVerification";
const TOTP_SESSION_TTL = 10 * 60 * 1000; // 10 minutes

const Admin = () => {
  const [activeTab, setActiveTab] = useState("addMembers");
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const rejectAccess = async (message) => {
        if (message) {
          Swal.fire({
            icon: "warning",
            title: "Access denied",
            text: message,
          });
        }
        await auth.signOut().catch(() => {});
        setLoading(false);
        navigate("/login");
      };

      try {
        const userRecordRef = ref(database, `users/${u.uid}`);
        const userRecordSnap = await get(userRecordRef);

        if (!userRecordSnap.exists()) {
          return rejectAccess("User record missing. Please contact an administrator.");
        }

        const userRecord = userRecordSnap.val();

        if (userRecord.firstLogin) {
          return rejectAccess("Complete the initial password change before accessing the admin panel.");
        }

        const totpInfoRaw = sessionStorage.getItem(TOTP_VERIFICATION_KEY);
        let totpVerified = false;

        if (totpInfoRaw) {
          try {
            const parsed = JSON.parse(totpInfoRaw);
            totpVerified =
              parsed.uid === u.uid && Date.now() - parsed.timestamp < TOTP_SESSION_TTL;
          } catch (err) {
            console.warn("Invalid TOTP verification token:", err);
          }
        }

        if (!totpVerified) {
          return rejectAccess("Please re-verify your TOTP code.");
        }

        setUser(u);

        const snap = await get(ref(database, `admins`));
        if (snap.exists()) {
          const admins = snap.val();
          const email = u.email;
          const isAdminEmail = Object.values(admins).includes(email);
          setIsAdmin(isAdminEmail);
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error validating admin access:", error);
        rejectAccess("Unable to verify admin access. Please try again.");
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="text-center text-5xl text-white font-share my-10">Admin Panel</div>

      <div className="flex md:flex-row flex-col w-full text-white px-8 py-4 gap-8 font-share">
        <aside className="md:w-64 flex-shrink-0 md:sticky md:top-32 bg-[rgba(44,44,44,0.44)] p-6 text-2xl rounded-xl h-full space-y-4 *:cursor-pointer">
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
