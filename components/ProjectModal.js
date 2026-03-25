import { useState, useEffect } from "react";
import { getUsers } from "../services/api";

export default function ProjectModal({ proyecto, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [estado, setEstado] = useState("activo");
  const [usuariosAsignados, setUsuariosAsignados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Si viene un proyecto a editar, llenar los campos
  useEffect(() => {
    if (proyecto) {
      setNombre(proyecto.nombre || "");
      setDescripcion(proyecto.descripcion || "");
      setFechaLimite(proyecto.fechaLimite || "");
      setEstado(proyecto.estado || "activo");
      setUsuariosAsignados(proyecto.usuariosAsignados || []);
    }
  }, [proyecto]);

  // Cargar lista de usuarios
  useEffect(() => {
    getUsers().then((data) => setUsuarios(data));
  }, []);

  function toggleUsuario(id) {
    setUsuariosAsignados((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  }

  async function handleGuardar() {
    if (!nombre.trim()) {
      alert("El nombre del proyecto es obligatorio");
      return;
    }

    setCargando(true);
    const datos = {
      nombre,
      descripcion,
      fechaLimite,
      estado,
      usuariosAsignados,
      tareas: proyecto?.tareas || [],
    };

    await onGuardar(datos);
    setCargando(false);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{proyecto ? "✏️ Editar Proyecto" : "➕ Nuevo Proyecto"}</h2>

        <div className="form-group">
          <label>Nombre del proyecto *</label>
          <input
            type="text"
            placeholder="Ej: Sistema de inventario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            placeholder="Descripción breve del proyecto..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha límite</label>
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="activo">Activo</option>
            <option value="pausado">Pausado</option>
            <option value="completado">Completado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Asignar usuarios</label>
          {usuarios.map((u) => (
  <label key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", cursor: "pointer" }}>
    <input
      type="checkbox"
      checked={usuariosAsignados.includes(u.id)}
      onChange={() => toggleUsuario(u.id)}
      style={{ width: "16px", height: "16px", cursor: "pointer" }}
    />
    <span style={{ fontSize: "0.9rem", color: "#334155" }}>
      {u.nombre} — <em style={{ color: "#64748b" }}>{u.rol}</em>
    </span>
  </label>
))}
        </div>

        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar} disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}