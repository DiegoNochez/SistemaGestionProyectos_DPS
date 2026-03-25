import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";
import TaskModal from "../../components/Taskmodal";
import { useAuth } from "../../context/AuthContext";
import { getProjects, updateProject } from "../../services/api";

export default function TasksPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const esGerente = user?.rol === "gerente";

  const [proyecto, setProyecto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

  useEffect(() => {
    if (!id) return;
    cargarProyecto();
  }, [id]);

  async function cargarProyecto() {
    setCargando(true);
    try {
      const todos = await getProjects();
      const encontrado = todos.find((p) => p.id === id);
      setProyecto(encontrado);
    } catch (err) {
      console.error("Error al cargar proyecto:", err);
    } finally {
      setCargando(false);
    }
  }

  async function guardarTareas(nuevasTareas) {
    const proyectoActualizado = { ...proyecto, tareas: nuevasTareas };
    await updateProject(proyecto.id, proyectoActualizado);
    setProyecto(proyectoActualizado);
  }

  function handleNuevaTarea() {
    setTareaEditando(null);
    setMostrarModal(true);
  }

  function handleEditar(tarea) {
    setTareaEditando(tarea);
    setMostrarModal(true);
  }

  async function handleEliminar(tareaId) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    const nuevasTareas = proyecto.tareas.filter((t) => t.id !== tareaId);
    await guardarTareas(nuevasTareas);
  }

  async function handleCambiarEstado(tareaId, nuevoEstado) {
    const nuevasTareas = proyecto.tareas.map((t) =>
      t.id === tareaId ? { ...t, estado: nuevoEstado } : t
    );
    await guardarTareas(nuevasTareas);
  }

  async function handleGuardarTarea(datos) {
    let nuevasTareas;
    if (tareaEditando) {
      nuevasTareas = proyecto.tareas.map((t) =>
        t.id === tareaEditando.id ? { ...t, ...datos } : t
      );
    } else {
      const nuevaTarea = {
        id: Date.now().toString(),
        ...datos,
        estado: "pendiente",
      };
      nuevasTareas = [...(proyecto.tareas || []), nuevaTarea];
    }
    await guardarTareas(nuevasTareas);
    setMostrarModal(false);
    setTareaEditando(null);
  }

  function getEstadoClase(estado) {
    if (estado === "completada") return "tarea-estado estado-completada";
    if (estado === "en progreso") return "tarea-estado estado-progreso";
    return "tarea-estado estado-pendiente";
  }

  if (cargando) {
    return (
      <ProtectedRoute>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando...</p>
      </ProtectedRoute>
    );
  }

  if (!proyecto) {
    return (
      <ProtectedRoute>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
          Proyecto no encontrado.
        </p>
      </ProtectedRoute>
    );
  }

  const tareas = proyecto.tareas || [];

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="tasks-container">
        <div className="tasks-header">
          <div>
            <button className="btn-volver" onClick={() => router.push("/dashboard")}>
              ← Volver
            </button>
            <h1>{proyecto.nombre}</h1>
            <p className="proyecto-desc">{proyecto.descripcion}</p>
          </div>
          {esGerente && (
            <button className="btn-nuevo" onClick={handleNuevaTarea}>
              + Nueva Tarea
            </button>
          )}
        </div>

        {tareas.length === 0 ? (
          <p className="no-tareas">
            {esGerente
              ? "No hay tareas aún. ¡Agrega la primera!"
              : "No hay tareas en este proyecto."}
          </p>
        ) : (
          <div className="tareas-lista">
            {tareas.map((tarea) => (
              <div key={tarea.id} className="tarea-card">
                <div className="tarea-info">
                  <h3>{tarea.titulo}</h3>
                  {tarea.descripcion && <p>{tarea.descripcion}</p>}
                  {tarea.asignadoA && (
                    <span className="tarea-asignado">👤 {tarea.asignadoA}</span>
                  )}
                </div>
                <div className="tarea-acciones">
                  <select
                    className={getEstadoClase(tarea.estado)}
                    value={tarea.estado}
                    onChange={(e) => handleCambiarEstado(tarea.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en progreso">En progreso</option>
                    <option value="completada">Completada</option>
                  </select>
                  {esGerente && (
                    <>
                      <button className="btn-editar-tarea" onClick={() => handleEditar(tarea)}>
                        Editar
                      </button>
                      <button className="btn-eliminar-tarea" onClick={() => handleEliminar(tarea.id)}>
                        Borrar 🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModal && (
        <TaskModal
          tarea={tareaEditando}
          onGuardar={handleGuardarTarea}
          onCerrar={() => {
            setMostrarModal(false);
            setTareaEditando(null);
          }}
        />
      )}
    </ProtectedRoute>
  );
}