import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Gestión de Proyectos</span>

      <div className="navbar-user">
        <span>👤 {user?.nombre}</span>
        <span className="rol-badge">{user?.rol}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}