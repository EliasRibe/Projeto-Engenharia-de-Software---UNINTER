# 02 — Requisitos (Funcionais e Não Funcionais)


## 2.1 Requisitos Funcionais (RF)  
|   ID  |                                Descrição                                   |            Atores           | Prioridade |                                                Critério de Aceite                                                |
|-------|----------------------------------------------------------------------------|-----------------------------|------------|------------------------------------------------------------------------------------------------------------------|
| RF001 | Cadastrar paciente (dados pessoais, clínicos e consentimento LGPD)         | Paciente/Adm                | Alta       | POST `/patients` → 201 com id; valida CPF/e-mail; registra consentimento; gera log de auditoria                  |
| RF002 | Autenticar usuário (paciente, profissional ou administrador)               | Todos                       | Alta       | POST `/auth/login` → token JWT; expiração configurada; cookies `HttpOnly/Secure`; falha com 401; log de acesso   |
| RF003 | Agendar consulta (presencial ou teleconsulta)                              | Paciente                    | Alta       | POST `/appointments` → 201; bloqueia slot; envia confirmação (e-mail/SMS in-app); aparece em Minhas consultas    |
| RF004 | Cancelar consulta                                                          | Paciente/Adm                | Média      | PATCH `/appointments/{id}/cancel` → 200; libera o slot; registro no histórico; notificação enviada               |
| RF005 | Gerenciar agenda profissional                                              | Profissional de Saúde       | Alta       | CRUD de janelas/slots; impede sobreposição; retorna disponibilidade para o agendamento; log de alteração         |
| RF006 | Registrar atendimento (presencial/telemedicina)                            | Profissional de Saúde       | Alta       | POST `/encounters` → 201; para telemedicina cria sessão segura com expiração; associa a consulta; log            |
| RF007 | Atualizar prontuário (versões e trilha de auditoria)                       | Profissional Saúde          | Alta       | PUT `/records/{id}` versionado; leitura GET `/records?patientId=`; qualquer alteração gera versão + log imutável |
| RF008	| Emitir prescrição digital                                                  | Profissional de Saúde	   | Alta	    | POST `/prescription` → 201; PDF/JSON assinado eletronicamente; vínculo à consulta/prontuário                     |
| RF009	| Visualizar histórico clínico / baixar documentos	                         | Paciente	                   | Alta	    | GET `/records/me` lista entradas; download de prescrições/exames; bloqueia se não houver consentimento LGPD      |
| RF010	| Gerenciar cadastros (pacientes e profissionais)	                         | Adm	                       | Alta	    | CRUD `/users`; perfis/roles atribuídos; 403 quando sem permissão; log de criação/edição/desativação              |
| RF011	| Gerenciar leitos e internações	                                         | Adm	                       | Média	    | CRUD `/beds`, `/hospitalizations`; estados (livre/ocupado/manutenção); histórico por unidade; transferências     | 
| RF012	| Gerir suprimentos/estoque hospitalar	                                     | Adm	                       | Média	    | CRUD `/supplies`; estoque mínimo; alerta interno quando < mínimo; movimentação entrada/saída auditada            |
| RF013	| Resultados de exames integrados ao prontuário	                             | Profissional de Saúde/Adm   | Média	    | POST `/exams/results` anexa ao paciente/consulta; aparece no histórico; notifica paciente                        |
| RF014	| Relatórios financeiros e operacionais (multiunidade) 	                     | Adm	                       | Média	    | GET `/reports` com filtros (unidade/período/tipo); exporta CSV/PDF; tempos de execução registrados               |
| RF015	| Notificações transacionais (agendamento, cancelamento, resultado de exame) | Adm/Paciente (recebe)	   | Alta	    | Agendamentos e cancelamentos disparam mensagens; histórico de envio e status por usuário                         |
| RF016	| Controle de acesso por perfil (RBAC)	                                     | Adm	                       | Alta	    | Associação usuário→perfil→permissões; rotas protegidas devolvem 403 quando não autorizado                        | 
| RF017	| Auditoria e logs de ações	                                                 | Adm                         | Alta	    | Toda operação CRUD registra usuário, IP, recurso, timestamp e sucesso/falha; consulta filtrável                  |
| RF018	| Backups e restauração	                                                     | Adm                         | Média	    | Rotina diária automática; checksum de integridade; restauração testada em ambiente controlado                    |
| RF019	| Dashboards de indicadores (ocupação, atendimentos, SLAs)	                 | Adm/Profissional de Saúde   |Baixa	    | `/analytics` retorna métricas agregadas por unidade/período; gráficos no front; exporta CSV                      |   


## 2.2 Requisitos Não Funcionais (RNF)
|   ID   |              Descrição                |    Categoria   | Prioridade |                   Critério de Aceite                          |
|--------|---------------------------------------|----------------|------------|---------------------------------------------------------------|
| RNF001 | Disponibilidade ≥ 99,5%               | Confiabilidade | Alta       | SLO mensal rastreado; plano de backup/restore testado         |
| RNF002 | Desempenho p95 < 1,5s (agendamento)   | Desempenho     | Alta       | Teste de carga 200 req/min, erro < 1%                         |
| RNF003 | Criptografia em trânsito e repouso    | Segurança      | Alta       | TLS 1.2+; dados sensíveis AES-256; rotação de chaves          |
| RNF004 | Controle de acesso por perfil         | Segurança      | Alta       | RBAC aplicado; tentativas não autorizadas registradas         |
| RNF005 | LGPD (minimização, masking, direitos) | Compliance     | Alta       | Dados sintéticos em teste; logs sem dados sensíveis completos |
| RNF006 | Acessibilidade WCAG 2.1 AA            | Usabilidade    | Média      | Zero violações critical/serious no axe-core                   |
| RNF007 | Observabilidade                       | Operação       | Média      | Métricas de latência/erros; trilhas de auditoria consultáveis |


## 2.3 Regras de Negócio
- CPF é obrigatório e único por paciente; mascarar em logs.
- Slots de agenda não podem ser duplamente alocados.
- Toda leitura/alteração de **prontuário** gera registro de auditoria (quem/quando/o quê).


## 2.4 Traços para Testes
Cada RF/RNF mapeado a casos de teste (CTxxx) e scripts automatizados (quando aplicável).