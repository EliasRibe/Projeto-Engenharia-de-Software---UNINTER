# 03 — Modelagem UML do SGHSS (VidaPlus)

## 1. Diagrama de Casos de Uso
**Descrição:** Representa as principais interações entre os três atores e o sistema **SGHSS – VidaPlus**.

**Atores:**
- **Paciente**
- **Profissional de Saúde** (Médico, Enfermeiro ou Técnico)
- **Administrador**

**Principais Casos de Uso (baseados nos requisitos funcionais):**

|           Ator            |             Caso de Uso               |                                    Descrição                                          |
|---------------------------|---------------------------------------|---------------------------------------------------------------------------------------|
| **Paciente**              | Cadastrar-se / Atualizar dados (LGPD) | Registrar novo paciente e consentimento de uso de dados                               |
| **Paciente**              | Autenticar-se                         | Fazer login com credenciais seguras (token JWT)                                       |
| **Paciente**              | Agendar Consulta                      | Solicitar data e horário com um profissional disponível (presencial ou teleconsulta)  |
| **Paciente**              | Cancelar Consulta                     | Cancelar uma consulta previamente agendada                                            |
| **Paciente**              | Visualizar Histórico Clínico          | Consultar prontuários, exames e prescrições                                           |
| **Profissional de Saúde** | Gerenciar Agenda                      | Criar, editar e excluir horários de atendimento                                       |
| **Profissional de Saúde** | Registrar Atendimento                 | Registrar consulta presencial ou online (telemedicina)                                |
| **Profissional de Saúde** | Atualizar Prontuário                  | Inserir diagnósticos e observações clínicas                                           |
| **Profissional de Saúde** | Emitir Prescrição Digital             | Gerar receita eletrônica assinada digitalmente                                        |
| **Adm**                   | Gerenciar Cadastros                   | Controlar registros de pacientes e profissionais                                      |
| **Adm**                   | Gerenciar Leitos e Internações        | Controlar status de leitos, ocupações e transferências                                |
| **Adm**                   | Gerenciar Suprimentos / Estoque       | Controlar entradas, saídas e níveis mínimos de estoque hospitalar                     |
| **Adm**                   | Gerar Relatórios                      | Criar relatórios financeiros e operacionais por unidade                               |
| **Adm**                   | Controlar Perfis e Acessos (RBAC)     | Definir permissões e papéis de acesso ao sistema                                      |
| **Adm**                   | Auditoria e Logs                      | Monitorar atividades, IPs, horários e resultados de ações                             |
| **Adm / Profissional**    | Dashboard de Indicadores              | Consultar métricas de desempenho, ocupação e atendimentos                             |

**Relações:**
- *Agendar Consulta* «include» *Notificar Paciente*  
- *Cancelar Consulta* «include» *Notificar Paciente*  
- *Registrar Atendimento* «include» *Atualizar Prontuário*  
- *Atualizar Prontuário* «extend» *Emitir Prescrição Digital*  
- *Visualizar Histórico* «include» *Verificar Consentimento LGPD*  
- *Gerenciar Cadastros* «include» *Auditar Ações*  

![Diagrama de Casos de Uso](./uml_diagrams/casos_de_uso.png)

---

## 2. Diagrama de Classes (Visão Simplificada)
**Descrição:** Representa a estrutura de classes principais do SGHSS e seus relacionamentos.

```mermaid
classDiagram
direction LR

class Usuario {
  +id: UUID
  +nome: string
  +email: string
  +telefone: string
  +senhaHash: string
  +ativo: bool
  +perfil: string
}

class Paciente {
  +cpf: string
  +dataNascimento: date
  +endereco: string
  +consentimentoLGPD: bool
}

class Profissional {
  +tipo: string
  +registroConselho: string
  +especialidade: string
}

class Administrador {
  +nivelAcesso: string
}

class Consulta {
  +id: UUID
  +dataHora: datetime
  +tipo: enum /* Presencial, Telemedicina */
  +status: enum /* Agendada, Cancelada, Concluída */
}

class Prontuario {
  +id: UUID
  +diagnostico: string
  +observacoes: text
  +dataRegistro: datetime
  +versao: int
}

class Prescricao {
  +id: UUID
  +medicamento: string
  +dosagem: string
+assinaturaDigital: string
  +validade: date
}

class Leito {
  +id: UUID
  +numero: string
  +status: enum /* Livre, Ocupado, Manutenção */
}

class Internacao {
  +id: UUID
  +dataEntrada: datetime
  +dataAlta: datetime
  +status: enum /* Ativa, Alta */
}

class Suprimento {
  +id: UUID
  +nome: string
  +estoqueAtual: number
  +estoqueMinimo: number
}

class Auditoria {
  +id: UUID
  +usuario: string
  +acao: string
  +timestamp: datetime
  +ip: string
  +sucesso: bool
}

Usuario <|-- Paciente
Usuario <|-- Profissional
Usuario <|-- Administrador
Paciente "1" --> "*" Consulta
Profissional "1" --> "*" Consulta
Consulta "1" --> "1" Prontuario
Prontuario "1" --> "*" Prescricao
Administrador "1" --> "*" Auditoria
Administrador "1" --> "*" Suprimento
Administrador "1" --> "*" Leito
Leito "1" --> "*" Internacao
```

## 3. Diagrama de Sequência — Fluxo “Agendar Consulta”

```mermaid
sequenceDiagram
actor Paciente
participant Sistema
participant Profissional
participant Banco

Paciente->>Sistema: Solicita agendamento (data, especialidade)
Sistema->>Banco: Verifica disponibilidade
Banco-->>Sistema: Retorna horários disponíveis
Sistema-->>Paciente: Exibe opções
Paciente->>Sistema: Confirma horário
Sistema->>Banco: Registra consulta
Banco-->>Sistema: Confirma gravação
Sistema-->>Profissional: Notifica novo agendamento
Sistema-->>Paciente: Envia confirmação (e-mail/app)
```

## 4. Diagrama de Atividades — Fluxo “Login + Visualizar Prontuário”

```mermaid
flowchart TD
A[Início] --> B[Inserir credenciais]
B --> C{Credenciais válidas?}
C -->|Não| D[Exibir mensagem de erro]
D --> B
C -->|Sim| E[Gerar token e carregar dashboard]
E --> F[Selecionar 'Ver Prontuário']
F --> G[Consultar base de dados]
G --> H{Consentimento LGPD ativo?}
H -->|Não| I[Negar acesso e exibir aviso]
H -->|Sim| J[Exibir histórico clínico e prescrições]
J --> K[Fim]
```

## 5. Observações Técnicas

Diagramas desenvolvidos com PlantUML/Mermaid para prototipagem.

Baseados diretamente nos requisitos funcionais RF001–RF019 do documento 02_requisitos.md.

O foco é a rastreabilidade entre os casos de uso e os requisitos (cada RF tem um caso de uso correspondente).

Servem de suporte à fase de testes de qualidade (QA), incluindo automação e rastreio de conformidade LGPD.