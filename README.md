# SGHSS QA — VidaPlus


Este repositório contém o **Plano de Qualidade** e a **suíte de testes** (funcionais, desempenho, segurança e acessibilidade) do SGHSS.


## Estrutura
- `docs/` — Documentação do projeto (introdução, requisitos, estratégia e plano de testes, evidências).
- `test_functional/` — Testes funcionais (API/UI). Postman/Cypress.
- `test_performance/` — Testes de desempenho/carga. Locust/JMeter.
- `test_security/` — Varreduras e checklists de segurança. OWASP ZAP.
- `test_accessibility/` — Testes de acessibilidade com axe-core.
- `test_contract/` — Esquemas JSON e testes de contrato (Schemathesis, JSON Schema).


## Como executar (visão geral)
1. **Funcionais (API)**: Newman/Postman
2. **E2E Web**: Cypress
3. **Desempenho**: Locust
4. **Segurança**: ZAP Baseline
5. **Acessibilidade**: Cypress + axe
