import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const esGerente = user?.rol === "gerente";

  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);

  // Cargar proyectos al iniciar
  useEffect(() => {
    cargarProyectos();
  }, []);

  async function cargarProyectos() {
    setCargando(true);
    try {
      const data = await getProjects();
      setProyectos(data);
    } catch (err) {
      console.error("Error al cargar proyectos:", err);
    } finally {
      setCargando(false);
    }
  }

  // Abrir modal para crear
  function handleNuevoProyecto() {
    setProyectoEditando(null);
    setMostrarModal(true);
  }

  // Abrir modal para editar
  function handleEditar(proyecto) {
    setProyectoEditando(proyecto);
    setMostrarModal(true);
  }

  // Eliminar proyecto
  async function handleEliminar(id) {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    try {
      await deleteProject(id);
      setProyectos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  // Guardar (crear o editar)
  async function handleGuardar(datos) {
    try {
      if (proyectoEditando) {
        const actualizado = await updateProject(proyectoEditando.id, datos);
        setProyectos((prev) =>
          prev.map((p) => (p.id === proyectoEditando.id ? actualizado : p))
        );
      } else {
        const nuevo = await createProject(datos);
        setProyectos((prev) => [...prev, nuevo]);
      }
      setMostrarModal(false);
      setProyectoEditando(null);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  }

  // Filtrar proyectos según el rol
  const proyectosFiltrados =
    esGerente
      ? proyectos
      : proyectos.filter((p) =>
          p.usuariosAsignados?.includes(user?.id)
        );

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>📁 Proyectos</h1>
          {esGerente && (
            <button className="btn-nuevo" onClick={handleNuevoProyecto}>
              + Nuevo Proyecto
            </button>
          )}
        </div>

        {cargando ? (
          <p className="no-proyectos">Cargando proyectos...</p>
        ) : proyectosFiltrados.length === 0 ? (
          <p className="no-proyectos">
            {esGerente
              ? "No hay proyectos aún. ¡Crea el primero!"
              : "No tienes proyectos asignados."}
          </p>
        ) : (
          <div className="proyectos-grid">
            {proyectosFiltrados.map((proyecto) => (
              <ProjectCard
                key={proyecto.id}
                proyecto={proyecto}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}
      </div>

      {mostrarModal && (
        <ProjectModal
          proyecto={proyectoEditando}
          onGuardar={handleGuardar}
          onCerrar={() => {
            setMostrarModal(false);
            setProyectoEditando(null);
          }}
        />
      )}
    </ProtectedRoute>
  );
}