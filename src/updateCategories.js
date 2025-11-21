import admin from "firebase-admin";
import path from "path";

const serviceAccount = path.resolve("ex0rcists-site-firebase-adminsdk-fbsvc-31248a2735.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ex0rcists-site-default-rtdb.firebaseio.com"
});

async function updateCategories(categories) {
  try {
    const db = admin.database();
    const ref = db.ref("categories");

    await ref.set(categories);

    console.log("✅ Categories updated successfully!");
  } catch (error) {
    console.error("❌ Error updating categories:", error);
  }
}

const categories = {
  all: "All",
  web: "Web Exploitation",
  osint: "OSINT",
  re: "Reverse Engineering",
  pwn: "Pwn",
  steg: "Steganography",
  forensics: "Forensics",
  crypto: "Cryptography"
};

// Run the update
updateCategories(categories);
