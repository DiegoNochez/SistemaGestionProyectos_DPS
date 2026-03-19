import { useAuth } from "../context/AuthContext";

export default function ProjectCard({ proyecto, onEditar, onEliminar }) {
  const { user } = useAuth();
  const esGerente = user?.rol === "gerente";

  // Calcular progreso basado en tareas
  const totalTareas = proyecto.tareas?.length || 0;
  const tareasCompletadas =
    proyecto.tareas?.filter((t) => t.estado === "completada").length || 0;
  const progreso =
    totalTareas === 0 ? 0 : Math.round((tareasCompletadas / totalTareas) * 100);

  function getEstadoClase(estado) {
    if (estado === "activo") return "estado-badge estado-activo";
    if (estado === "pausado") return "estado-badge estado-pausado";
    if (estado === "completado") return "estado-badge estado-completado";
    return "estado-badge";
  }

  return (
    <div className="project-card">
      <h3>{proyecto.nombre}</h3>
      <p>{proyecto.descripcion}</p>

      <div className="project-meta">
        <span>📅 {proyecto.fechaLimite || "Sin fecha"}</span>
        <span className={getEstadoClase(proyecto.estado)}>
          {proyecto.estado || "activo"}
        </span>
      </div>

      <div className="progreso-label">
        <span>Progreso</span>
        <span>{progreso}%</span>
      </div>
      <div className="progreso-bar-bg">
        <div
          className="progreso-bar-fill"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {esGerente && (
        <div className="project-actions">
          <button className="btn-editar" onClick={() => onEditar(proyecto)}>
            ✏️ Editar
          </button>
          <button className="btn-eliminar" onClick={() => onEliminar(proyecto.id)}>
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}