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
│       └── ci.yml                   # Pipeline QA completo (Newman, Cypress, Locust, ZAP)
│
├── artifacts/                       # Saída dos testes automáticos
│   ├── graphs/                      # Gráficos gerados pelo Locust
│   ├── videos/                      # Vídeos Cypress
│   ├── screenshots/                 # Prints Cypress
│   ├── locust/                      # CSV/HTML do teste de performance
│   ├── newman.xml                   # Relatório JUnit do Postman
│   └── zap_report.html              # Relatório OWASP ZAP
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
│   ├── 05_plano_testes.md
│   └── 06_relatorios_resultados.md  # Relatório consolidado (QA cycle)
│
├── test_functional/
│   ├── postman/
│   │   ├── SGHSS_API.postman_collection.json
│   │   └── SGHSS_ENV.json
│   └── cypress/
│       ├── e2e/
│       │   └── login.cy.js
│       ├── support/
│       │   └── e2e.js
│       └── cypress.config.js
│
├── test_accessibility/
│   └── cypress-axe/
│       └── accessibility.cy.js
│
├── test_performance/
│   └── locust/
│       ├── locustfile.py
│       └── requirements.txt
│
├── test_security/
│   └── zap/
│       └── zap-baseline.target
│
├── mock-server.js                   # Mock backend para os testes
├── package.json
├── package-lock.json
├── LICENCE
└── README.md

``` 

## 🧰 Pré‑requisitos
- **Node.js 18+** (Cypress, Newman)
- **Python 3.9+** (Locust)


## ▶️ Execução Local

1) CT001–CT002 | Testes de API (Postman / Newman)  # Verifica a criação e validação de pacientes (CPF e LGPD).
```bash
npm i -g newman
newman run test_functional/postman/SGHSS_API.postman_collection.json \
  -e test_functional/postman/SGHSS_ENV.json \
  --reporters cli,junit --reporter-junit-export artifacts/newman.xml
```

2) CT003–CT007 | Testes End-to-End + Acessibilidade (Cypress + axe-core)  # Valida login, agendamento, prontuário, prescrição e checa acessibilidade conforme WCAG 2.1 AA.
```bash
$env:CYPRESS_baseUrl="http://localhost:3000"
npx cypress run --config-file "test_functional/cypress/cypress.config.js"
```

3) CT-PERF-01 | Testes de Desempenho (Locust)  # Simula usuários simultâneos acessando o sistema (login, agendamento, prontuário).
```bash
pip install -r requirements.txt
cd test_performance/locust
locust -f .\locustfile.py --headless -u 100 -r 10 -t 2m --host http://localhost:3000 --csv=.\locust_stats
```

4) CT-A11Y-01 | Acessibilidade (Cypress + axe-core)  # Validação WCAG 2.1 AA nas telas mock (/, /appointments, /records).
```bash
npx cypress run --spec "test_accessibility/cypress-axe/**/*.cy.js" \
  --config-file "test_functional/cypress/cypress.config.js"
```


5) CT-SEC-05 | Testes de Segurança (OWASP ZAP Baseline)  # Executa uma varredura de segurança passiva para identificar riscos OWASP.
```bash
 docker run --rm -t `
   -v "${PWD}.Path\artifacts:/zap/wrk" `
   ghcr.io/zaproxy/zaproxy:stable `
   /zap/zap-baseline.py -t http://host.docker.internal:3000 -a -r zap_report.html
```



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