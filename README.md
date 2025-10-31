# SGHSS — VidaPlus (Qualidade de Software)


![build](https://img.shields.io/github/actions/workflow/status/EliasRibe/Projeto-Engenharia-de-Software---UNINTER/ci.yml?label=CI%2FQA)
![license](https://img.shields.io/badge/license-MIT-informational)
![status](https://img.shields.io/badge/status-MVP-blue)


Sistema de Gestão Hospitalar e de Serviços de Saúde (**SGHSS**) — repositório focado em **Qualidade de Software**: estratégia, plano de testes, automação (API/UI), desempenho, segurança e acessibilidade, com evidências e pipeline de CI.

## 📖 Sumário
- [🚀 Objetivos](#-objetivos)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🧰 Pré-requisitos](#-prérequisitos)
- [▶️ Execução Local](#️-execução-local)
- [🤖 Integração Contínua (CI/CD)](#-integração-contínua-cicd)
- [📚 Documentação Técnica](#-documentação-técnica)
- [🔒 LGPD & Segurança](#-lgpd--segurança)
- [👥 Créditos](#-créditos)
- [📄 Licença](#-licença)


## 🚀 Objetivos
- Garantir **confiabilidade** (≥ 99,5%), **desempenho** (p95 < 1,5s no agendamento), **segurança/LGPD**, e **acessibilidade** (WCAG 2.1 AA).
- Versionar artefatos de QA (docs, coleções, scripts, relatórios) e executá-los em **CI**.


## 📁 Estrutura do Projeto
``` 
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   ├── PlantUML/
│   │   ├── atividade_login.puml
│   │   ├── classDiagram.puml
│   │   ├── sequencia.puml
│   │   └── usecase.puml
│   ├── uml_diagrams/
│   │   ├── atividade_login.png
│   │   ├── casos_de_uso.png
│   │   ├── diagrama_classes.png
│   │   └── sequencia_agendamento.png
│   ├── 01_introducao.md
│   ├── 02_requisitos.md
│   ├── 03_modelagem_uml.md
│   ├── 04_estrategia_testes.md
│   └── 05_plano_testes.md
│
├── test_functional/
│   ├── cypress/e2e/login.cy.js
│   └── postman/SGHSS_API.postman_collection.json
│
├── test_performance/locust/locustfile.py
├── test_security/zap/zap-baseline.target
├── test_accessibility/cypress-axe/accessibility.cy.js
├── LICENCE
├── mock-server.js
├── package.json
├── package-lock.json
└── README.md
``` 

## 🧰 Pré‑requisitos
- **Node.js 18+** (Cypress, Newman)
- **Python 3.9+** (Locust)
- **Java 8+** (se usar JMeter)


## ▶️ Execução Local

1) Testes de API (Postman/Newman)
```bash
npm i -g newman
newman run test_functional/postman/SGHSS_API.postman_collection.json \
-e test_functional/postman/SGHSS_ENV.json \
--reporters cli,junit --reporter-junit-export newman.xml
```

2) E2E Web (Cypress)
cd test_functional/cypress
npm ci || npm i
npx cypress open # modo interativo
ou
npx cypress run # modo headless

3) Desempenho (Locust)
cd test_performance/locust
pip install -r requirements.txt
locust -f locustfile.py --headless -u 200 -r 20 -t 10m --host http://localhost:3000

4) Segurança (OWASP ZAP Baseline)
# Exemplo com GitHub Action ou Docker
# docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000 -a -r zap_report.html

5) Acessibilidade (axe-core via Cypress)
npx cypress run --spec "test_accessibility/cypress-axe/**/*.cy.js"


## 🤖 Integração Contínua (CI/CD)

Workflow: .github/workflows/ci.yml
Jobs: Newman · Cypress (+axe) · ZAP Baseline · Locust (Smoke)
Resultados: exportados automaticamente como artifacts no GitHub Actions.

## 📚 Documentação Técnica

docs/01_introducao.md — contexto e metas

docs/02_requisitos.md — RF/RNF + critérios de aceite

docs/03_modelagem_uml.md — diagramas UML e relacionamentos

docs/04_plano_testes.md — abordagem, níveis e ferramentas

docs/05_plano_testes.md — casos de teste, roteiros e evidências


## 🔒 LGPD & Segurança

- Uso de dados sintéticos em todos os testes
- Mascaramento de dados sensíveis em logs
- Auditoria de acessos a prontuário
- Controle de perfis e permissões (RBAC)
- Conformidade total com a LGPD

## 👥 Créditos

Autor: Elias Ribeiro

- Área: Qualidade de Software (ênfase em testes, automação e LGPD)

## 📄 Licença

MIT — veja LICENSE.