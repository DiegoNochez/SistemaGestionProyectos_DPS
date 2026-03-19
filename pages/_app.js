import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import "../styles/login.css";
import "../styles/register.css";
import "../styles/dashboard.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}