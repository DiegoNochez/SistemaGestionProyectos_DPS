import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor llena todos los campos");
      return;
    }

    setCargando(true);

    try {
      const res = await axios.get("http://localhost:3001/users");
      const usuario = res.data.find(
        (u) => u.email === email && u.password === password
      );

      if (!usuario) {
        setError("Email o contraseña incorrectos");
        setCargando(false);
        return;
      }

      login(usuario);
      router.push("/dashboard");

    } catch (err) {
      setError("No se pudo conectar con el servidor.");
      setCargando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="registro-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}