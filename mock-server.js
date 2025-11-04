// mock-server.js
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// --- logger de requisição (debug) ---
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// ------- memória "fake" -------
const db = {
  users: [{ id: 'u1', email: 'paciente@vida.plus', password: '123456', role: 'PACIENTE', active: true }],
  patients: [],
  appointments: [], // {id, patientId, date, type, status}
  records: [{ id: 'r1', patientId: 'p1', diagnostico: '', observacoes: '', versao: 1 }],
  audit: [],
  tokens: new Set()
};

const genId = (p) => `${p}_${crypto.randomBytes(4).toString('hex')}`;
const logAudit = (acao, sucesso = true, usuario = 'mock', ip = '127.0.0.1') =>
  db.audit.push({ id: genId('aud'), usuario, acao, timestamp: new Date().toISOString(), ip, sucesso });

// ------- helpers -------
const isValidCPF = (cpf) => {
  if (!cpf) return false;
  const digits = cpf.replace(/\D/g, '');
  return digits.length === 11; // simplificado p/ CT002
};

// ========== PÁGINAS HTML (para Cypress + axe) ==========
const page = (title, body) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
</head>
<body>
  <header><h1>${title}</h1></header>
  <main>${body}</main>
  <footer><small>SGHSS Mock</small></footer>
</body>
</html>`;

app.get("/", (_req, res) => {
  res.type("html").send(page("Login", `
    <form aria-label="login">
      <label for="email">E-mail</label>
      <input id="email" name="email" type="email" required />
      <label for="pwd">Senha</label>
      <input id="pwd" name="pwd" type="password" required />
      <button type="submit">Entrar</button>
    </form>
  `));
});

app.get("/appointments", (_req, res) => {
  res.type("html").send(page("Agendamento", `
    <form aria-label="agendamento">
      <label for="date">Data</label>
      <input id="date" name="date" type="date" required />
      <label for="type">Tipo</label>
      <select id="type" name="type" required>
        <option value="Presencial">Presencial</option>
        <option value="Telemedicina">Telemedicina</option>
      </select>
      <button type="submit">Agendar</button>
    </form>
  `));
});

app.get("/records", (_req, res) => {
  res.type("html").send(page("Prontuário", `
    <section aria-label="histórico clínico">
      <h2>Entradas</h2>
      <ul>
        <li>Consulta 01/11 - Diagnóstico: OK</li>
        <li>Exame 02/11 - Resultado: Normal</li>
      </ul>
    </section>
  `));
});

// Servir artifacts estáticos
app.use("/artifacts", express.static("artifacts"));

// ========== APIs (Postman/Locust/Cypress) ==========
app.get('/health', (_req, res) => res.json({ ok: true }));

// CT001/CT002 – criar paciente
app.post('/patients', (req, res) => {
  const { nome, email, cpf, consentimentoLGPD } = req.body || {};
  if (!isValidCPF(cpf)) {
    logAudit('patients:create:cpf_invalido', false);
    return res.status(400).json({ error: 'CPF inválido' });
  }
  if (!consentimentoLGPD) {
    logAudit('patients:create:lgpd_ausente', false);
    return res.status(422).json({ error: 'Consentimento LGPD ausente' });
  }
  const id = genId('p');
  db.patients.push({ id, nome, email, cpf, consentimentoLGPD });
  logAudit('patients:create', true);
  return res.status(201).json({ id, consentimentoLGPD: true });
});

// CT003 – login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    logAudit('auth:login:falha', false);
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  if (!user.active) {
    logAudit('auth:login:inativo', false);
    return res.status(403).json({ error: 'Conta inativa' });
  }
  const token = genId('jwt');
  db.tokens.add(token);
  logAudit('auth:login', true, email);
  res.cookie?.('sid', token, { httpOnly: true, secure: true, sameSite: 'lax' }) ?? null;
  return res.status(200).json({ token, role: user.role });
});

// middleware auth fake
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  if (!token || !db.tokens.has(token)) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  next();
};

// CT004 – agendar consulta
app.post('/appointments', requireAuth, (req, res) => {
  const { patientId, date, type } = req.body || {};
  const conflict = db.appointments.find((a) => a.patientId === patientId && a.date === date && a.status === 'Agendada');
  if (conflict) {
    logAudit('appointments:conflict', false);
    return res.status(409).json({ error: 'Conflito de horário' });
  }
  const id = genId('a');
  const appt = { id, patientId, date, type: type || 'Presencial', status: 'Agendada' };
  db.appointments.push(appt);
  logAudit('appointments:create', true);
  return res.status(201).json(appt);
});

// CT005 – cancelar
app.patch('/appointments/:id/cancel', requireAuth, (req, res) => {
  const { id } = req.params;
  const appt = db.appointments.find((a) => a.id === id);
  if (!appt) return res.status(404).json({ error: 'Não encontrada' });
  appt.status = 'Cancelada';
  logAudit('appointments:cancel', true);
  return res.status(200).json(appt);
});

// CT006 – prontuário versionado
app.put('/records/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { diagnostico, observacoes } = req.body || {};
  let rec = db.records.find((r) => r.id === id);
  if (!rec) {
    rec = { id, patientId: 'p1', diagnostico: '', observacoes: '', versao: 0 };
    db.records.push(rec);
  }
  rec.diagnostico = diagnostico ?? rec.diagnostico;
  rec.observacoes = observacoes ?? rec.observacoes;
  rec.versao += 1;
  logAudit('records:update', true);
  return res.status(200).json({ id: rec.id, versao: rec.versao });
});

// CT007 – prescrição
app.post('/prescriptions', requireAuth, (req, res) => {
  const id = genId('rx');
  logAudit('prescription:create', true);
  return res.status(201).json({ id, pdf: `/artifacts/prescricao_${id}.pdf`, assinaturaDigital: true });
});

// util – auditoria
app.get('/audit', (_req, res) => res.json(db.audit));

// ---------- start ----------
const PORT = process.env.PORT || 3000;
console.log(`[DEBUG] __filename = ${__filename}`);
console.log(`[DEBUG] process.cwd() = ${process.cwd()}`);

app.get("/__routes", (_req, res) => {
  const seen = [];
  const walk = (stack, prefix = "") => {
    (stack || []).forEach((layer) => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods || {}).map(m => m.toUpperCase()).join(",");
        seen.push(`${methods} ${prefix}${layer.route.path}`);
      } else if (layer.name === "router" && layer.handle && layer.handle.stack) {
        walk(layer.handle.stack, prefix + (layer.regexp?.fast_slash ? "" : "")); // mantém simples
      }
    });
  };
  walk(app._router?.stack);
  res.json(seen);
});

app.listen(PORT, () => console.log(`Mock SGHSS rodando em http://localhost:${PORT}`));

