# 04 — Estratégia de Testes (SGHSS – VidaPlus)

> Ênfase: **Qualidade de Software** (funcionais, não funcionais, segurança, acessibilidade e automação)

---

## 1. Introdução

**Contexto:**  
A VidaPlus administra hospitais, clínicas, laboratórios e equipes de home care.  
O **SGHSS** centraliza cadastro e atendimento de pacientes, gestão de profissionais, administração hospitalar (leitos, finanças, suprimentos) e **telemedicina** (atendimentos e prescrições online).

**Objetivo:**  
Definir a **visão de qualidade** do SGHSS, suas **metas mensuráveis** (SLOs), **estratégia de testes**, **planos** e **evidências** necessárias para demonstrar conformidade com requisitos funcionais, não funcionais e **LGPD**.

**Principais usuários:**  
Paciente, Profissional de Saúde (médico, enfermeiro, técnico) e Administrador.

---

## 2. Objetivos e Sucesso (SLOs/SLA/Qualidade)

- **Disponibilidade:** ≥ 99,5% mensal para serviços críticos (auth, agendamento, prontuário, telemedicina).  
- **Desempenho:** p95 < 1,5s para criação de agendamento sob 200 req/min; erro < 1%.  
- **Segurança:** sem falhas High/Critical em varredura ZAP Baseline; ausência de IDOR; cookies `HttpOnly`, `Secure`, `SameSite`.  
- **Acessibilidade:** zero violações critical/serious no axe-core nas telas de login, agendamento e prontuário.  
- **LGPD:** dados sensíveis mascarados em logs; trilha de auditoria completa e ambientes com dados sintéticos.

---

## 3. Escopo Inicial de Testes (MVP de Qualidade)

- **API/Contrato:** cadastro, autenticação, agendamento, prontuário (CRUD versionado), telemedicina (sessão segura), prescrição.  
- **E2E Web:** login → agendar consulta → confirmar → evidência no prontuário.  
- **Desempenho:** rampa de carga em `/appointments` e leitura em `/records`.  
- **Segurança:** ZAP Baseline passivo; validações IDOR, autenticação e cabeçalhos.  
- **Acessibilidade:** análise axe-core nas principais telas.  

---

## 4. Premissas e Restrições

- Protótipo/Mock com **OpenAPI** (Prism/Mockoon) para testes sem backend completo.  
- Dados de teste **fictícios** (LGPD).  
- Pipeline em **GitHub Actions** para execução automática.  

---

## 5. Níveis e Tipos de Teste

### 5.1 Contrato / Integração de API
- **Ferramentas:** Postman/Newman, JSON Schema, Schemathesis (opcional).  
- **Objetivo:** validar status, payloads, regras e compatibilidade entre serviços.  
- **Fonte:** `test_functional/postman/`

### 5.2 E2E Web (UI)
- **Ferramenta:** Cypress.  
- **Fluxos:** Login → Agendar → Confirmar → Registrar atendimento/Prescrição → Ver no prontuário.  
- **Acessibilidade:** axe-core integrado.  
- **Fonte:** `test_functional/cypress/`, `test_accessibility/cypress-axe/`

### 5.3 Desempenho e Carga
- **Ferramentas:** Locust (primário), JMeter (opcional).  
- **Cenários:** pico em `/appointments` e leitura em `/records`.  
- **Metas:** conforme SLO.  
- **Fonte:** `test_performance/locust/`

### 5.4 Segurança (DAST passivo + casos dirigidos)
- **Ferramenta:** OWASP ZAP Baseline.  
- **Casos dirigidos:** IDOR, sessão, headers de segurança, rate limit.  
- **Fonte:** `test_security/zap/`

### 5.5 Observabilidade e Confiabilidade
- **Medições:** latência, taxa de erro, uptime simulado.  
- **Evidências:** logs e prints de execução.

---

## 6. Ambientes, Dados e Segurança da Informação

- **Ambiente local:** mock de API (Prism/Mockoon) + UI prototipada (`mock-server.js`).  
- **Dados de teste:** sintéticos (nunca reais).  
- **Segurança:**
  - Não versionar segredos (usar GitHub Secrets).  
  - Mascarar CPF e dados sensíveis em logs.  
  - Garantir logs de auditoria para acessos a prontuário.

---

## 7. Critérios de Entrada e Saída

**Entrada:**
- RF/RNF priorizados e rastreáveis (`docs/02_requisitos.md`)  
- OpenAPI mínima + UI mock  
- Ambiente acessível  

**Saída:**
- 100% CTs Alta prioridade executados, 0 falhas críticas  
- p95 < 1,5s e erro < 1%  
- ZAP sem High/Critical  
- 0 violações critical/serious no axe-core  
- Evidências publicadas no Actions  

---

## 8. Automação e CI/CD

**Pipeline (GitHub Actions)** — `.github/workflows/ci.yml` executa:
1. Newman (API) → JUnit/HTML  
2. Cypress E2E (+axe) → vídeos/prints + JUnit  
3. Locust (smoke) → CSV/HTML  
4. ZAP Baseline → relatório  

**Saídas:**
- Badge de status (README)  
- Artifacts: `newman.xml`, vídeos, `locust_stats.csv`, `zap_report.html`  

---

## 9. Gestão de Risco

|               Risco              |  Impacto  | Prob. |                  Mitigação                       |
|----------------------------------|-----------|-------|--------------------------------------------------|
| IDOR em prontuários              | Altíssimo | Média | Casos dirigidos + revisão de autorização + ZAP   |
| Picos em /appointments           | Alto      | Alta  | Teste de carga/escala + tuning + cache           |
| Vazamento de dados em logs       | Alto      | Média | Mascaramento + revisão + testes de segurança     |
| Acessibilidade insuficiente      | Médio     | Média | axe-core em CI + checklist WCAG                  |
| Falta de auditoria rastreável    | Alto      | Baixa | Casos de auditoria + logs + evidências em CI     |

---

### Histórico de Versão
- **v1.0** — Documento base consolidado.
