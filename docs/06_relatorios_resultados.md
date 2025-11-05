# SGHSS – VidaPlus  
## 06. Relatórios e Resultados dos Testes

---

### 🧪 1. Resumo Geral dos Testes

|           Tipo de Teste          |   Caso / ID   |     Ferramenta     |               Status              |                Evidência                   |
|----------------------------------|---------------|--------------------|-----------------------------------|--------------------------------------------|
| **Funcionais (API)**             | CT001 – CT007 | Postman / Newman   |  Sucesso (201, 200, 409, etc.)    | `artifacts/newman.xml`                     |
| **Desempenho (Performance)**     | CT-PERF-01    | Locust             |  Aprovado (0.08% falhas)          | `test_performance/locust/locust_stats.csv` |
| **Segurança (OWASP)**            | CT-SEC-01     | ZAP Baseline       |  Avisos leves (headers ausentes)  | `artifacts/zap_report.html`                | 
| **Acessibilidade (WCAG 2.1 AA)** | CT-A11Y-01    | Cypress + axe-core |  3/3 telas sem violações críticas | `artifacts/videos/accessibility.cy.js.mp4` |

---

### ⚙️ 2. Detalhamento dos Resultados

#### 2.1 Testes Funcionais – API (Postman/Newman)

Os testes cobriram os principais fluxos do sistema mockado, conforme requisitos funcionais:

|   ID  |             Cenário            |               Resultado             | Status HTTP |
|-------|--------------------------------|-------------------------------------|-------------|
| CT001 | Criar paciente (dados válidos) | Sucesso, ID gerado com LGPD = true  |     201     |
| CT002 | Bloquear CPF inválido          | Rejeitado corretamente              |     400     |
| CT003 | Login de paciente ativo        | Token JWT gerado                    |     200     |
| CT004 | Agendar consulta               | Agendamento salvo sem conflito      |     201     |
| CT005 | Cancelar consulta              | Status alterado p/ “Cancelada”      |     200     |
| CT006 | Atualizar prontuário           | Versão incrementada corretamente    |     200     |
| CT007 | Prescrição digital             | PDF e assinatura digital retornados |     201     |

🧩 **Conclusão:** Todos os endpoints responderam conforme esperado.  
Logs de auditoria (rota `/audit`) registraram ações simuladas corretamente.

---

#### 2.2 Teste de Desempenho – Locust

Simulação de **10 usuários simultâneos / 30 segundos**, requisitando `/auth/login`, `/appointments`, e `/records`.

|        Métrica       |    Valor    |
|----------------------|-------------|
| Total de requisições | 9.567       |
| Falhas               | 8 (0.08%)   |
| Tempo médio (ms)     | 2           |
| Pico máximo (ms)     | 41          |
| Throughput (req/s)   | 80.4        |

### 📈 Gráficos (Performance)

![Requisições por endpoint](./artifacts/graphs/requests_per_endpoint.png)
![Tempo médio por endpoint (ms)](./artifacts/graphs/avg_time_per_endpoint.png)
![Sucesso x Falhas](./artifacts/graphs/success_vs_fail.png)


📊 **Conclusão:** Desempenho excelente, latência mínima e falhas desprezíveis (0.08%).  
Indicativo de boa escalabilidade da API simulada.

---

#### 2.3 Teste de Segurança – OWASP ZAP Baseline

Varredura passiva executada via Docker (`ghcr.io/zaproxy/zaproxy:stable`):

|  Severidade  | Ocorrências |                        Exemplo                            |
|--------------|-------------|-----------------------------------------------------------|
|   WARN       | 5           | Headers de segurança ausentes (ex: `X-Powered-By`, `CSP`) |
|   PASS       | 65          | Nenhuma vulnerabilidade crítica detectada                 |

📁 Relatório completo: [`artifacts/zap_report.html`](../artifacts/zap_report.html)

🛡️ **Conclusão:** Nenhum risco crítico. Os avisos são cabeçalhos faltantes comuns em mocks (baixo impacto real).

---

#### 2.4 Teste de Acessibilidade – WCAG 2.1 AA

Testes com **Cypress + axe-core** em três telas HTML simuladas:

|              Tela             | Resultado | Impactos Encontrados |
|---- --------------------------|-----------|----------------------|
| `/` (Login)                   |    OK     | Nenhum               |
| `/appointments` (Agendamento) |    OK     | Nenhum               |
| `/records` (Prontuário)       |    OK     | Nenhum                |

📹 Evidência em vídeo: `artifacts/videos/accessibility.cy.js.mp4`

♿ **Conclusão:** Todas as telas cumprem os critérios WCAG 2.1 AA para impacto *critical* e *serious*.  
Sem violações de contraste, labels ou semântica HTML.

---

### 📊 3. Indicadores Consolidados

|          Métrica          |    Valor   |   Status   |
|---------------------------|------------|------------|
| Casos executados          | 12         |    100%    |
| Casos aprovados           | 12         |    100%    |
| Casos com falhas críticas | 0          |   Nenhuma  |
| Falhas de performance     | <1%        |  Aceitável |
| Falhas de segurança       | 0 críticas |     OK     |
| Violações WCAG            | 0          |  Aprovado  |

---

### 🧾 4. Conclusão Geral

O ciclo de testes do **SGHSS – VidaPlus (Ambiente Mock)** demonstrou:
- **Conformidade funcional** com os requisitos definidos (CT001–CT007);
- **Desempenho excelente**, sem gargalos significativos;
- **Boa segurança base**, sem vulnerabilidades críticas OWASP;
- **Acessibilidade em conformidade WCAG 2.1 AA**;
- Todos os **artefatos e logs** devidamente armazenados em `artifacts/`.

💡 **Função Final:** manter os testes integrados no pipeline CI/CD para execução automática a cada *push* em `main`, garantindo regressão contínua e rastreabilidade.

---

**Autor:** *Elias Ribeiro*  
**Data da execução:** Novembro/2025  
**Versão do mock:** v1.0.0  
**Ambiente:** Node.js 20 + Newman + Cypress + Locust + ZAP

---