# SGHSS — VidaPlus (Qualidade de Software)


![build](https://img.shields.io/github/actions/workflow/status/EliasRibe/Projeto-Engenharia-de-Software---UNINTER/ci.yml?label=CI%2FQA)
![license](https://img.shields.io/badge/license-MIT-informational)
![status](https://img.shields.io/badge/status-MVP-blue)


Sistema de Gestão Hospitalar e de Serviços de Saúde (**SGHSS**) — repositório focado em **Qualidade de Software**: estratégia, plano de testes, automação (API/UI), desempenho, segurança e acessibilidade, com evidências e pipeline de CI.


## 🚀 Objetivos
- Garantir **confiabilidade** (≥ 99,5%), **desempenho** (p95 < 1,5s no agendamento), **segurança/LGPD**, e **acessibilidade** (WCAG 2.1 AA).
- Versionar artefatos de QA (docs, coleções, scripts, relatórios) e executá-los em **CI**.


## 📁 Estrutura
docs/ 01_introducao.md 02_requisitos.md 03_estrategia_testes.md 04_plano_testes.md 06_relatorios_resultados.md (evidências)

test_functional/ postman/ # coleções/ambientes cypress/ # e2e UI

test_performance/ locust/ # cenários de carga jmeter/ # opcional

test_security/ zap/ # ZAP baseline/full configs checklists/

test_accessibility/ cypress-axe/ # specs axe-core

.github/workflows/ ci.yml

## 🧰 Pré‑requisitos
- **Node.js 18+** (Cypress, Newman)
- **Python 3.9+** (Locust)
- **Java 8+** (se usar JMeter)


## ▶️ Como executar localmente

1) Testes de API (Postman/Newman)
```bash
npm i -g newman
newman run test_functional/postman/SGHSS_API.postman_collection.json \
-e test_functional/postman/SGHSS_ENV.json \
--reporters cli,junit --reporter-junit-export newman.xml

2) E2E Web (Cypress)
cd test_functional/cypress
npm ci || npm i
npx cypress open # modo interativo
# ou
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

🤖 CI (GitHub Actions)

Workflow: .github/workflows/ci.yml

Jobs: Newman, Cypress (+axe), ZAP Baseline e (opcional) Locust smoke.

Relatórios exportados como artifacts.

📚 Documentação

docs/01_introducao.md — contexto e metas

docs/02_requisitos.md — RF/RNF + critérios de aceite

docs/03_estrategia_testes.md — níveis, ferramentas, critérios de entrada/saída

docs/04_plano_testes.md — casos de teste, roteiros e evidências

🔒 LGPD & Segurança

Dados de teste sintéticos; mascaramento de dados sensíveis em logs; auditoria de acessos a prontuário.

👥 Créditos

Autor: Elias Ribe

- Área: Qualidade de Software (ênfase em testes, automação e LGPD)

📄 Licença

MIT — veja LICENSE (a definir).