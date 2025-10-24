# 01 — Introdução


## Contexto
A VidaPlus administra hospitais, clínicas, laboratórios e equipes de home care. O **SGHSS** centraliza cadastro e atendimento de pacientes, gestão de profissionais, administração hospitalar (leitos, finanças, suprimentos) e **telemedicina** (atendimentos e prescrições online).


## Objetivo deste documento
Definir a **visão de qualidade** do SGHSS, metas mensuráveis (SLOs), estratégia de testes, planos e evidências para demonstrar conformidade com requisitos funcionais, não funcionais e **LGPD**.


## Usuários-alvo
- **Paciente** — cadastro, histórico, agendamento, teleconsulta, notificações.
- **Profissional de Saúde** — agenda, prontuário, prescrição digital.
- **Administrador** — cadastros, internações/leitos, relatórios e auditoria.


## Metas de Qualidade (SLOs)
- **Disponibilidade**: ≥ 99,5% mensal para serviços críticos.
- **Desempenho**: p95 < **1,5s** no endpoint de agendamento sob 200 req/min; erro < 1%.
- **Segurança**: sem achados **High/Critical** em varreduras ZAP Baseline; ausência de IDOR.
- **Acessibilidade**: zero violações **critical/serious** no axe-core nas telas-chave.
- **LGPD**: dados sensíveis mascarados em logs; ambientes de teste com dados sintéticos; trilha de auditoria completa.


## Escopo de Qualidade
Funcionais (API e UI), não funcionais (desempenho, disponibilidade, acessibilidade), segurança/compliance (LGPD, criptografia, perfis de acesso, auditoria), automação e CI/CD.