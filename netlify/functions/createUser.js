const admin = require("firebase-admin");
const { getDatabase } = require("firebase-admin/database");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount
    ),
    databaseURL: "https://ex0rcists-site-default-rtdb.firebaseio.com"
  });
}

export const handler = async (event) => {
  try {
    const { email, displayName } = JSON.parse(event.body);

    const user = await admin.auth().createUser({
      email,
      password: "Ex0rcists@2025",
      displayName,
    });

    const db = getDatabase();
    await db.ref("users/" + user.uid).set({
      email,
      displayName,
      firstLogin: true,
      totpEnabled: false,
      totpSecret: null,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ uid: user.uid }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
