import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { reactStartCookies } from "better-auth/react-start";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [adminClient(), reactStartCookies()],
});

export default authClient;
