const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../.netlify/functions/ex0rcists-site-firebase-adminsdk-fbsvc-31248a2735.json"))
  });
}

exports.handler = async (event) => {
  try {
    const { email, displayName } = JSON.parse(event.body);

    const user = await admin.auth().createUser({
      email,
      password: "Ex0rcists@2025",
      displayName,
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
