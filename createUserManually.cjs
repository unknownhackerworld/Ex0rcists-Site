// createUser.js
const admin = require("firebase-admin");
const readline = require("readline");
const { getDatabase } = require("firebase-admin/database");


// Load service account JSON from file (recommended)
const serviceAccount = require("./ex0rcists-site-firebase-adminsdk-fbsvc-31248a2735.json");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ex0rcists-site-default-rtdb.firebaseio.com"
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

(async () => {
  try {
    console.log("\n=== Create Firebase User (Auth + Database) ===\n");

    const email = await ask("Enter Email: ");
    const password = await ask("Enter Password: ");
    const displayName = await ask("Enter Display Name: ");

    rl.close();

    console.log("\n⏳ Creating user…");

    // Create user in Firebase Auth
    // const user = await admin.auth().createUser({
    //   email,
    //   password,
    //   displayName,
    // });

    const user = await admin.auth().getUserByEmail("rlearning6@gmail.com");
    await admin.auth().updateUser(user.uid, {
      displayName: "uh4ck3r",
    });





    console.log("✔ User created:", user.uid);

    // Store in Realtime Database

    console.log("\n🎉 Done! User successfully created.\n");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
})();
