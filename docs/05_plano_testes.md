# 05 — Plano de Testes (SGHSS – VidaPlus)

> Documento complementar à Estratégia de Testes (`docs/04_estrategia_testes.md`), com **casos de teste (CTs)**, **rastreamento** e **evidências**.

---

## 1. Introdução

Este plano detalha **o que será testado** no SGHSS – VidaPlus, descrevendo os **casos de teste**, **pré-condições**, **dados**, **resultados esperados** e **método de automação**, conforme os Requisitos Funcionais e Não Funcionais definidos em `docs/02_requisitos.md`.

---

## 2. Casos de Teste Funcionais

|   ID   | Requisito |   Descrição do Caso de Teste   |         Pré-condição          |          Passos Principais        |           Resultado Esperado          |     Automação    |
|--------|-----------|--------------------------------|-------------------------------|-----------------------------------|---------------------------------------|------------------|
| CT001  | RF001     | Criar paciente (dados válidos) | API mock ativa                | Enviar POST `/patients`           | Retorna 201 + ID + consentimento LGPD | Postman          |
| CT002  | RF001     | Bloquear CPF inválido          | Enviar POST com CPF incorreto | Enviar POST `/patients`           | Retorna 400                           | Postman          |
| CT003  | RF002     | Login com credenciais válidas  | Usuário ativo                 | POST `/auth/login`                | Retorna token JWT + 200               | Cypress          |
| CT004  | RF003     | Agendar consulta (presencial)  | Paciente autenticado          | POST `/appointments`              | Retorna 201 + status “Agendada”       | Postman/Cypress  |
| CT005  | RF004     | Cancelar consulta              | Consulta agendada             | PATCH `/appointments/{id}/cancel` | Retorna 200 + status “Cancelada”      | Cypress          |
| CT006  | RF007     | Atualizar prontuário           | Paciente existente            | PUT `/records/{id}`               | Retorna 200 + versão incrementada     | Postman          |
| CT007  | RF008     | Emitir prescrição digital      | Profissional logado           | POST `/prescriptions`             | Retorna PDF assinado + 201            | Cypress          |

---

## 3. Casos de Teste Não Funcionais

|     ID     |    Categoria   |                 Descrição               |          Métrica Esperada        |   Ferramenta   |
|------------|----------------|-----------------------------------------|----------------------------------|----------------|
| CT-PERF-01 | Desempenho     | p95 < 1,5s no agendamento (200 req/min) | ≤ 1,5s / erro < 1%               | Locust         |
| CT-A11Y-01 | Acessibilidade | Nenhuma violação crítica WCAG 2.1 AA    | 0 violations                     | Cypress + axe  |
| CT-SEC-05  | Segurança      | Cookies seguros, headers corretos       | `HttpOnly`, `Secure`, `SameSite` | ZAP Baseline   |

---

## 4. Matriz de Rastreabilidade

| Requisito | Caso(s) de Teste |         Automação        |
|-----------|------------------|--------------------------|
| RF001     | CT001, CT002     | Postman, Cypress         |
| RF002     | CT003            | Postman, Cypress         |
| RF003     | CT004            | Postman, Cypress, Locust |
| RF004     | CT005            | Cypress                  |
| RF007     | CT006            | Postman                  |
| RF008     | CT007            | Cypress                  |
| RNF001    | CT-PERF-01       | Locust/JMeter            |
| RNF006    | CT-A11Y-01       | Cypress + axe            |
| RNF003    | CT-SEC-05        | ZAP                      |

---

## 5. Evidências e Logs

- Resultados exportados em **JUnit/HTML/CSV**.  
- Evidências de UI (Cypress) armazenadas em `/videos/` e `/screenshots/`.  
- Logs e métricas de carga (Locust) versionados em `artifacts/`.  
- Relatórios ZAP (`zap_report.html`) e Newman (`newman.xml`) anexados ao pipeline.

---

## 6. Critérios de Aceitação

- 100% dos casos de **alta prioridade** executados.  
- Nenhuma falha crítica.  
- Evidências publicadas em Actions.  
- Cumprimento dos SLOs definidos na Estratégia de Testes.

---

## 7. Próximos Passos

1. Integrar coleta automática de métricas de execução no CI.  
2. Publicar relatório consolidado de qualidade (`docs/06_relatorios_resultados.md`).  

---

### Histórico de Versão
- **v1.0** — Primeira versão do Plano de Testes, derivado da Estratégia de Testes (v1.0).