import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [rol, setRol] = useState("usuario");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setExito("");

    if (!nombre || !email || !password || !confirmar) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    try {
      const check = await axios.get("http://localhost:3001/users", {
        params: { email: email },
      });

      if (check.data.length > 0) {
        setError("Ese email ya está registrado");
        setCargando(false);
        return;
      }

      await axios.post("http://localhost:3001/users", {
        nombre: nombre,
        email: email,
        password: password,
        rol: rol,
      });

      setExito("¡Cuenta creada! Redirigiendo al login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError("No se pudo conectar con el servidor. Verifica que json-server esté corriendo.");
      setCargando(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Crear Cuenta</h2>

        {error && <p className="error-msg">{error}</p>}
        {exito && <p className="exito-msg">{exito}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

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
              placeholder="Mínimo 4 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="usuario">Usuario</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>

          <button type="submit" className="btn-register" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}