# SGHSS (VidaPlus) — Plano de Qualidade — Rascunho v0.1

> Ênfase: **Qualidade de Software** (funcionais, não funcionais, segurança, acessibilidade e automação)

## 1. Introdução

**Contexto.** A VidaPlus administra hospitais, clínicas, laboratórios e equipes de home care. O **SGHSS** centraliza cadastro e atendimento de pacientes, gestão de profissionais, administração hospitalar (leitos, finanças, suprimentos) e **telemedicina** (atendimentos e prescrições online).

**Objetivo deste documento.** Definir a **visão de qualidade** do SGHSS, suas **metas mensuráveis** (SLOs), **estratégia de testes**, **planos** e **evidências** necessárias para demonstrar conformidade com requisitos funcionais, não funcionais e **LGPD**.

**Principais usuários:** Paciente; Profissional de Saúde (médico, enfermeiro, técnico); Administrador.

**Escopo de Qualidade (alto nível):**

* Funcionais (API e UI): cadastro/agenda/prontuário/telemedicina.
* Não funcionais: **desempenho**, **escala**, **disponibilidade 99,5%**, **acessibilidade** (WCAG 2.1 AA), **observabilidade**.
* Segurança/Compliance: **LGPD**, criptografia, controle de acesso por perfil, **auditoria** de acessos e alterações, **logs imutáveis**.
* Automação e CI: suíte executável (API/UI, desempenho, segurança passiva, acessibilidade) em pipeline.

## 2. Objetivos & Sucesso (SLOs/SLA/Qualidade)

* **Disponibilidade**: ≥ **99,5%** mensal para serviços críticos (auth, agendamento, prontuário, telemedicina).
* **Desempenho**: p95 **< 1,5s** para criação de agendamento sob 200 req/min; erro **< 1%**.
* **Segurança**: sem falhas **High/Critical** em varredura ZAP Baseline; ausência de **IDOR** em endpoints sensíveis; cookies `HttpOnly`, `Secure`, `SameSite`.
* **Acessibilidade**: zero violações **critical/serious** no axe-core nas telas-chave (login, agendamento, prontuário).
* **LGPD**: dados sensíveis mascarados em logs; ambientes de teste com dados sintéticos; trilha de auditoria completa.

## 3. Escopo inicial de testes (MVP de Qualidade)

* **API/Contrato**: cadastro de paciente, agendamento, prontuário, telemedicina.
* **E2E Web**: login → agendar consulta → confirmar → evidência no prontuário.
* **Desempenho**: rampa de carga no agendamento + leitura de prontuários.
* **Segurança**: ZAP Baseline (passive) no ambiente mock/UI; checagens de auth/IDOR por casos dirigidos.
* **Acessibilidade**: varredura axe-core nas principais telas.

## 4. Premissas & Restrições

* Protótipo/Mock com **OpenAPI** (Prism/Mockoon) para viabilizar automação sem back-end completo.
* Dados de teste **fictícios** (LGPD).
* Pipeline em GitHub Actions (ou similar) para evidenciar **execução automática**.

## 5. Entregáveis

1. **Documentos**: Introdução, Requisitos detalhados, Estratégia de Testes, Plano de Testes, Relatórios.
2. **Suíte automatizada**: Postman/Newman (API), Cypress (+axe), Locust/JMeter, ZAP Baseline.
3. **CI**: workflow rodando coleções e relatórios.
4. **Evidências**: prints, logs, relatórios JUnit/HTML e artefatos anexos.

## 6. Próximos passos

* **P1. Requisitos detalhados** (tabela RF/RNF com critérios de aceite).
* **P2. Casos de teste funcionais** (CT001…CT0XX) alinhados aos RFs.
* **P3. Arquitetura de testes & ferramentas** (decisões + setup inicial).
* **P4. Protótipo mock/API (OpenAPI)** para suportar automação.
* **P5. Pipeline CI mínimo** executando Postman + Cypress + axe.

---

> Histórico de versão: v0.1 — rascunho inicial criado.

---

# 03 — Estratégia de Testes (SGHSS)

> Objetivo: definir **como** vamos comprovar qualidade no SGHSS (VidaPlus) cobrindo funcional, não funcional, segurança, acessibilidade e conformidade LGPD, com **automação e CI**.

## 3.1 Escopo de Testes

* **Funcionais (API & UI):** cadastro de pacientes, autenticação, agendamento, prontuário (CRUD versionado), telemedicina (sala segura + prescrição), administração (profissionais, leitos, relatórios).
* **Não funcionais:** desempenho/escala, disponibilidade (evidências), observabilidade.
* **Segurança & LGPD:** autenticação/autorização (RBAC), IDOR, XSS, SQLi, armazenamento seguro, logs/auditoria, dados de teste sintéticos.
* **Acessibilidade:** conformidade WCAG 2.1 AA nas telas-chave.

## 3.2 Abordagem Geral

* **Shift-left** (QA desde requisitos), **automação-first** (regressão confiável) e **evidências versionadas** no repositório.
* **Mock/Simulação** com contrato OpenAPI para permitir automação mesmo sem back-end completo.
* **Teste baseado em risco**: priorizar fluxos clínicos críticos (agendamento, prontuário, telemedicina).

## 3.3 Níveis e Tipos de Teste

1. **Contrato/Integração de API**

   * Ferramentas: Postman/Newman (coleções), **Schemathesis** (fuzz contra OpenAPI), JSON Schema.
   * Objetivo: validar formatos, códigos, regras e compatibilidade entre serviços.
2. **E2E Web (UI)**

   * Ferramenta: **Cypress**.
   * Fluxos: Login → Agendar consulta → Telemedicina → Registro no prontuário → Prescrição.
3. **Desempenho & Carga**

   * Ferramentas: **Locust** (primário) / JMeter (opcional).
   * Metas: p95 < 1,5s no agendamento sob 200 req/min; erro < 1% (RNF002).
4. **Segurança (DAST passivo + casos dirigidos)**

   * Ferramenta: **OWASP ZAP Baseline** + testes dirigidos (IDOR, sessão, headers, rate limit).
5. **Acessibilidade**

   * Ferramenta: **axe-core** integrada ao Cypress.
6. **Observabilidade/Confiabilidade**

   * Coletar métricas de latência, taxa de erro, disponibilidade simulada; logs de auditoria e trilhas de acesso a prontuário.

## 3.4 Ambientes & Dados

* **Ambiente local**: mock de API (Prism/Mockoon) + UI estática/protótipo.
* **Dados de teste**: 100% **sintéticos** (LGPD). Estratégias de seed/fixtures para cenários consistentes.
* **Segurança de dados**: mascarar CPF nos logs; não armazenar credenciais em repositório; usar variáveis de ambiente/secret do CI.

## 3.5 Critérios de Entrada/Saída

* **Entrada (para iniciar testes):**

  * Requisitos RF/RNF priorizados e rastreáveis (RF→CT).
  * OpenAPI publicada (mínima) e UI protótipo das telas-chave.
  * Ambiente de mock acessível.
* **Saída (para considerar aprovado o ciclo):**

  * 100% dos CTs **Alta** prioridade executados; **0 falhas** críticas.
  * Performance: p95 < 1,5s (agendamento) com erro < 1%.
  * ZAP Baseline: 0 achados **High/Critical**.
  * Acessibilidade: 0 violações **critical/serious** no axe-core nas telas-chave.
  * Evidências publicadas (relatórios + prints + logs de execução).

## 3.6 Automação & CI/CD

* **Pipeline (GitHub Actions)** executando:

  1. Newman (API) → export JUnit/HTML;
  2. Cypress E2E (+axe) → vídeos/prints + JUnit;
  3. Locust (smoke de carga) → CSV/HTML de métricas (quando possível);
  4. ZAP Baseline → relatório.
* Publicação de **artifacts** da execução e badges de status.

## 3.7 Gestão de Risco (amostra)

| Risco                            | Impacto   | Prob. | Mitigação                                            |
| -------------------------------- | --------- | ----- | ---------------------------------------------------- |
| IDOR em prontuários              | Altíssimo | Média | Casos dirigidos + revisão de autorização + ZAP       |
| Picos no endpoint de agendamento | Alto      | Alta  | Teste de carga/escala + tuning + cache               |
| Vazamento de dados em logs       | Alto      | Média | Mascaramento + revisão de logs + testes de segurança |
| Acessibilidade insuficiente      | Médio     | Média | axe-core em CI + checklist WCAG                      |
| Falta de evidência de auditoria  | Alto      | Baixa | Casos de auditoria + consultas de log                |

## 3.8 Rastreamento (Traceability)

* **Matriz RF/RNF → CT → Scripts** (mantida em `docs/`):

| Requisito                | Caso(s) de Teste    | Automação                      |
| ------------------------ | ------------------- | ------------------------------ |
| RF001 Cadastrar paciente | CT001, CT002        | Postman (Newman), Cypress (UI) |
| RF003 Agendar consulta   | CT010, CT011, CT012 | Postman, Cypress, Locust       |
| RF004 Prontuário         | CT030, CT031        | Postman, Cypress               |
| RF005 Telemedicina       | CT020, CT021        | Cypress                        |
| RNF002 Desempenho        | CT-PERF-01          | Locust/JMeter                  |
| RNF006 Acessibilidade    | CT-A11Y-01          | Cypress + axe                  |

## 3.9 Ferramentas & Padrões

* **Funcional/Contrato:** Postman/Newman, JSON Schema, Schemathesis.
* **UI/E2E/A11y:** Cypress, axe-core.
* **Desempenho:** Locust (Python) / JMeter.
* **Segurança (DAST passivo):** OWASP ZAP Baseline.
* **Gestão:** GitHub Actions, versionamento de evidências (artifacts), Markdown em `docs/`.

## 3.10 Entregáveis desta fase

* `docs/03_estrategia_testes.md` (este documento).
* Par de exemplos mínimos de automação em `test_functional/`, `test_performance/`, `test_security/`, `test_accessibility/`.
* Workflow inicial em `.github/workflows/ci.yml`.

---

> Próximo arquivo: **`docs/04_plano_testes.md`** — Casos de Teste detalhados (CT001…); critérios de aceite por CT; roteiros de desempenho, segurança e acessibilidade; e plano de evidências.

# 04 — Plano de Testes (SGHSS)

> Objetivo: especificar **casos de teste**, **critérios de aceitação**, **roteiros** de desempenho/segurança/acessibilidade e **evidências** para o SGHSS (VidaPlus).

## 4.1 Escopo e Prioridade

* **Alta**: Cadastro/Autenticação, Agendamento, Prontuário, Telemedicina.
* **Média**: Profissionais/Agendas, Leitos, Relatórios.
* **Baixa**: Exportações não críticas, telas informativas.

## 4.2 Matriz RF/RNF → CT

| Requisito                      | Casos de Teste      | Observações                                    |
| ------------------------------ | ------------------- | ---------------------------------------------- |
| RF001 Cadastrar paciente       | CT001, CT002, CT003 | Válido/ausência de campos/CPF inválido         |
| RF002 Autenticar usuário       | CT004, CT005        | Sucesso/credenciais inválidas + lock de sessão |
| RF003 Agendar consulta         | CT010, CT011, CT012 | Slot livre/conflito/cancelamento               |
| RF004 Prontuário (CRUD+versão) | CT030, CT031, CT032 | Create/Read com trilha de auditoria            |
| RF005 Telemedicina             | CT020, CT021, CT022 | Criar sala, encerrar, prescrição digital       |
| RF006 Profissionais/Agendas    | CT040, CT041        | CRUD e conflito de agenda                      |
| RF007 Leitos                   | CT050, CT051        | Estados e histórico                            |
| RF008 Relatórios               | CT060               | Filtros e exportação                           |
| RNF002 Desempenho              | CT-PERF-01          | p95 < 1,5s em agendamento                      |
| RNF006 Acessibilidade          | CT-A11Y-01          | axe-core sem violations serious/critical       |
| Segurança/LGPD                 | CT-SEC-01..05       | IDOR, sessão, headers, SQLi, logs              |

## 4.3 Casos de Teste Funcionais (detalhes)

**CT001 — Cadastrar paciente (válido)**

* **Pré-condição:** API disponível; dados de teste sintéticos.
* **Passos:** POST `/patients` com nome, cpf (11 dígitos), contato.
* **Esperado:** 201 com `id` e `createdAt`; logs sem CPF completo; registro de auditoria.
* **Evidências:** resposta JSON, print do log/auditoria.

**CT002 — Cadastrar paciente sem CPF**

* **Passos:** POST `/patients` sem `cpf`.
* **Esperado:** 400 com mensagem clara; nenhum registro criado.
* **Evidências:** payload, resposta, consulta de inexistência.

**CT003 — Cadastrar paciente com CPF inválido**

* **Esperado:** 400 e mensagem “CPF inválido”.

**CT004 — Login com credenciais válidas**

* **Passos:** POST `/auth/login`.
* **Esperado:** 200 com token; cookie `HttpOnly`/`Secure`; expiração configurada.
* **Evidências:** headers e corpo (sem dados sensíveis).

**CT005 — Login inválido (senha errada)**

* **Esperado:** 401 sem revelar motivo específico (mensagem genérica); contador de tentativas.

**CT010 — Agendar consulta (slot livre)**

* **Passos:** POST `/appointments` com slot disponível.
* **Esperado:** 201; bloqueio do slot; notificação ao paciente.
* **Evidências:** GET do slot mostra ocupado; log de notificação.

**CT011 — Agendar em slot já ocupado**

* **Esperado:** 409 (conflito) e mensagem clara.

**CT012 — Cancelar agendamento**

* **Passos:** DELETE `/appointments/{id}`.
* **Esperado:** 200/204; slot liberado; log de auditoria.

**CT020 — Telemedicina: criar sala**

* **Passos:** POST `/telemed/rooms`.
* **Esperado:** 201; token/URL com expiração; somente participantes autorizados acessam.
* **Evidências:** tentar acessar como terceiro → 403.

**CT021 — Telemedicina: encerrar e registrar**

* **Passos:** PATCH `/telemed/rooms/{id}/end`.
* **Esperado:** 200; registro no prontuário com horário/duração.
* **Evidências:** GET `/records` contém entrada.

**CT022 — Prescrição digital pós-teleconsulta**

* **Passos:** POST `/prescriptions` linkada à sala.
* **Esperado:** 201; assinatura digital; anexada ao prontuário.
* **Evidências:** artefato da prescrição; verificação de integridade.

**CT030 — Prontuário: criar registro**

* **Esperado:** 201 com versão `v1`; log de auditoria (quem/quando/o quê).

**CT031 — Prontuário: leitura autorizada**

* **Passos:** GET `/records?patientId={id}` como profissional do caso.
* **Esperado:** 200; somente registros do paciente; sem dados de terceiros.
* **Negativo:** outro profissional sem vínculo → 403.

**CT032 — Prontuário: atualização versionada**

* **Passos:** PUT `/records/{id}`.
* **Esperado:** 200; cria `v2`; mantém histórico; auditoria registrada.

**CT040 — Profissionais: CRUD**

* **Esperado:** CRUD ok; validação de especialidade/unidade.
* **CT041 — Conflito de agenda do profissional** → 409.

**CT050 — Leitos: estados**

* **Esperado:** transições válidas (livre→ocupado→manutenção→livre); histórico persistido.
* **CT051 — Histórico de leito**: GET histórico retorna linha do tempo.

**CT060 — Relatórios**

* **Esperado:** filtros por período/unidade; exportação CSV/PDF; consistência de totais.

## 4.4 Testes Não Funcionais

### 4.4.1 Desempenho & Carga — **CT-PERF-01**

* **Ferramenta:** Locust (preferencial) / JMeter.
* **Cenário:** rampa até **200 req/min** no endpoint de **agendamento** por 10 min.
* **Métricas alvo:** p95 < **1,5s**; erro < **1%**; throughput estável.
* **Passos (Locust):**

  * Autenticar no `on_start`.
  * 3x peso para `GET /records` e 1x para `POST /appointments`.
* **Saída:** CSV/HTML de métricas anexado em `docs/06_relatorios_resultados.md`.

### 4.4.2 Acessibilidade — **CT-A11Y-01**

* **Ferramenta:** Cypress + axe-core.
* **Telas:** login, agendamento, prontuário.
* **Esperado:** 0 violações **serious/critical**; navegação por teclado completa; labels e aria-* corretos; contraste adequado.
* **Evidências:** relatório do axe, prints.

### 4.4.3 Segurança — **CT-SEC-01..05**

* **Ferramentas:** OWASP ZAP Baseline (+ casos dirigidos manuais/automatizados via API/UI).
* **Casos:**

  * **CT-SEC-01 (IDOR):** tentar `/patients/{id}` de terceiros → 403; idem para `/records`.
  * **CT-SEC-02 (Sessão/Headers):** cookies `HttpOnly/Secure/SameSite`; expiração; sem cache indevido.
  * **CT-SEC-03 (SQLi/XSS básico):** payloads notórios são bloqueados/escapados.
  * **CT-SEC-04 (Rate limiting):** múltiplas tentativas de login → bloqueio/atraso exponencial.
  * **CT-SEC-05 (Logs/LGPD):** logs não contêm CPF completo nem dados sensíveis; mascaramento ativo.
* **Critério de aceite:** sem achados **High/Critical** no ZAP Baseline; casos dirigidos aprovados.

## 4.5 Critérios de Aceitação Gerais

* 100% CTs de **Alta** prioridade executados e aprovados.
* RNF de desempenho e acessibilidade atendidos.
* Segurança sem falhas High/Critical.
* Evidências publicadas em `docs/06_relatorios_resultados.md`.

## 4.6 Plano de Evidências & Relatórios

* **Funcionais (API/UI):** JUnit/HTML do Newman e Cypress + prints/vídeos.
* **Desempenho:** CSV/HTML (Locust/JMeter) com p95/p99/throughput/erros.
* **Segurança:** relatório ZAP Baseline (HTML/MD) + checklist OWASP.
* **Acessibilidade:** saída axe-core (JSON/MD) + prints.
* **Checklist LGPD:** planilha/MD com verificação de minimização, masking, consentimento e direitos do titular.

## 4.7 Rastreabilidade (amostra)

| CT            | Requisito associado | Automação                    |
| ------------- | ------------------- | ---------------------------- |
| CT001         | RF001               | Postman (API) / Cypress (UI) |
| CT010         | RF003               | Postman/Cypress/Locust       |
| CT020         | RF005               | Cypress                      |
| CT030         | RF004               | Postman/Cypress              |
| CT-PERF-01    | RNF002              | Locust/JMeter                |
| CT-A11Y-01    | RNF006              | Cypress + axe                |
| CT-SEC-01..05 | Segurança/LGPD      | ZAP + casos dirigidos        |

---
