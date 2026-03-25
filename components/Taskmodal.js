import { useState, useEffect } from "react";

export default function TaskModal({ tarea, onGuardar, onCerrar }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [asignadoA, setAsignadoA] = useState("");
  const [cargando, setCargando] = useState(false);

  // Si viene una tarea a editar, llenar los campos
  useEffect(() => {
    if (tarea) {
      setTitulo(tarea.titulo || "");
      setDescripcion(tarea.descripcion || "");
      setAsignadoA(tarea.asignadoA || "");
    }
  }, [tarea]);

  async function handleGuardar() {
    if (!titulo.trim()) {
      alert("El título de la tarea es obligatorio");
      return;
    }

    setCargando(true);
    await onGuardar({ titulo, descripcion, asignadoA });
    setCargando(false);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{tarea ? "✏️ Editar Tarea" : "➕ Nueva Tarea"}</h2>

        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            placeholder="Ej: Diseñar pantalla de login"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            placeholder="Describe qué hay que hacer..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Asignado a</label>
          <input
            type="text"
            placeholder="Nombre del responsable"
            value={asignadoA}
            onChange={(e) => setAsignadoA(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="btn-guardar"
            onClick={handleGuardar}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}