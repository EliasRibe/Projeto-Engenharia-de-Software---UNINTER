# 02 — Requisitos (Funcionais e Não Funcionais)


## 2.1 Requisitos Funcionais (RF) 
|   ID  |                Descrição                       |        Atores         | Prioridade |                          Critério de Aceite                                          |
|-------|------------------------------------------------|-----------------------|------------|--------------------------------------------------------------------------------------|
| RF001 | Cadastrar paciente (dados pessoais e contato)  | Adm                   | Alta       | POST `/patients` retorna 201, ID gerado; validações de campos; log de auditoria      |
| RF002 | Autenticar usuário (paciente/profissional/adm) | Todos                 | Alta       | POST `/auth/login` retorna token; sessão expira; cookies `HttpOnly/Secure`           |
| RF003 | Agendar consulta online                        | Paciente              | Alta       | POST `/appointments` retorna 201 e bloqueia slot; notificação enviada                |
| RF004 | Gerenciar prontuário (CRUD + histórico)        | Profissional          | Alta       | PUT/GET `/records` versionados; logs imutáveis de acesso/alteração                   |
| RF005 | Telemedicina (sala segura + registro)          | Paciente/Profissional | Alta       | Criação de sala com expiração; registro automático no prontuário; prescrição digital |
| RF006 | Gerir profissionais e agendas                  | Adm                   | Média      | CRUD `/staff` e agenda por unidade; conflitos impedidos                              |
| RF007 | Administração de leitos                        | Adm                   | Média      | CRUD leitos; estados (livre/ocupado/manut.) e histórico                              |
| RF008 | Relatórios financeiros e operacionais          | Adm                   | Média      | Exportações parametrizadas; filtros por período/unidade                              |


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