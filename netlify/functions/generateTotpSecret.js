import { authenticator } from "otplib";

export async function handler() {
  const secret = authenticator.generateSecret();
  return {
    statusCode: 200,
    body: JSON.stringify({ secret }),
  };
}
