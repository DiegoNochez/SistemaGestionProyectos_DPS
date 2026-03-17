import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// usuarios
export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

// proyectos - persona 2 usa estas
export async function getProjects() {
  const res = await api.get("/projects");
  return res.data;
}

export async function createProject(data) {
  const res = await api.post("/projects", data);
  return res.data;
}

export async function updateProject(id, data) {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id) {
  await api.delete(`/projects/${id}`);
}

// tareas - persona 3 usa estas
export async function getTasks() {
  const res = await api.get("/tasks");
  return res.data;
}

export async function createTask(data) {
  const res = await api.post("/tasks", data);
  return res.data;
}

export async function updateTask(id, data) {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}