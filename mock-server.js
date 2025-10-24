// mock-server.js
const express = require("express");
const app = express();
app.use(express.json());

// Login simulado
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    return res.status(200).json({ token: "fake-jwt-token", user: { id: 1, email } });
  }
  return res.status(400).json({ message: "Credenciais inválidas" });
});

// Prontuários (GET)
app.get("/records", (req, res) => {
  res.json([
    { id: 1, patientId: 123, doctor: "Dr. Silva", date: "2025-10-24" },
    { id: 2, patientId: 123, doctor: "Dr. Souza", date: "2025-09-20" },
  ]);
});

// Agendamento (POST)
app.post("/appointments", (req, res) => {
  const { patientId, doctorId, slot } = req.body;
  if (patientId && doctorId && slot) {
    return res.status(201).json({ message: "Consulta agendada", appointmentId: 99 });
  }
  res.status(400).json({ message: "Dados inválidos" });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Mock API rodando em http://localhost:${PORT}`));
