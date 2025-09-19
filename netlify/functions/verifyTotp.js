import { authenticator } from "otplib";

export async function handler(event) {
  try {
    const { token, secret } = JSON.parse(event.body);

    const isValid = authenticator.verify({ token, secret });

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
  }
}
