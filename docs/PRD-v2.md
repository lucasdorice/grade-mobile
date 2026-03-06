# Grade App — Product Requirements Document (MVP)

## 1. Visão Geral

O **Grade** é um aplicativo mobile para estudantes universitários que precisam de uma forma rápida e organizada de capturar anotações durante as aulas e controlar tarefas/trabalhos passados pelos professores.

### Problema

Na faculdade, é impossível anotar tudo que o professor fala. O aluno precisa de um lugar prático — no celular — para registrar pontos importantes de cada aula e não perder prazos de entregas.

### Solução

Um app simples e direto:

1. O aluno cadastra sua **grade de aulas** (matérias, dias e horários)
2. Ao abrir o app, vê as **aulas de hoje**
3. Clica em uma aula e entra na **sessão daquele dia**
4. **Anota** o que quiser sobre a aula
5. Se o professor passar um trabalho, cria uma **tarefa com prazo de entrega**

### Público-Alvo

Qualquer estudante universitário que quer organizar suas anotações de aula e prazos de entrega.

---

## 2. Funcionalidades do MVP

### 2.1 Onboarding (Cadastro da Grade)

- O usuário informa seu **nome**
- Cadastra suas **matérias manualmente**, uma a uma:
  - Nome da matéria
  - Dia(s) da semana
  - Horário de início e fim
  - Cor (para identificação visual)
- Ao finalizar, a grade está pronta para uso

### 2.2 Tela "Hoje" (Home)

- Tela principal do app
- Mostra uma **saudação** com o nome do aluno
- Lista as **aulas de hoje** em ordem cronológica, com:
  - Nome da matéria
  - Horário
  - Indicador visual de cor
- Se não tiver aula no dia (ex: fim de semana), mostra mensagem amigável
- Ao clicar em uma aula, abre a **sessão da aula daquele dia**

### 2.3 Sessão de Aula (por dia)

- Cada aula em cada dia gera uma **sessão única** (ex: "Cálculo — 05/03/2026")
- Dentro da sessão, o aluno pode:
  - **Escrever anotações** de texto livre
  - **Criar tarefas** relacionadas àquela aula, com:
    - Descrição da tarefa
    - Data de entrega
    - Status (pendente / concluída)
- As anotações anteriores de outros dias ficam acessíveis ao navegar no histórico da matéria

### 2.4 Visualização de Todas as Notas

- Uma tela que consolida **todas as anotações** de todas as matérias
- Permite navegar e pesquisar para encontrar algo anotado em qualquer aula
- Organizado por matéria e/ou data

### 2.5 Visualização de Todas as Tarefas (Calendário)

- Uma tela com visão de **calendário**
- Mostra as tarefas organizadas por **data de entrega**
- Permite ver rapidamente o que tem pendente nos próximos dias
- Possibilidade de marcar tarefas como concluídas

### 2.6 Configurações

- Editar nome do aluno
- Gerenciar matérias (adicionar, editar, remover)
- Gerenciar horários da grade

---

## 3. Navegação

O app terá uma **navegação por abas (Tab Bar)** na parte inferior com:

| Aba | Descrição |
|-----|-----------|
| 🏠 Hoje | Aulas do dia (tela principal) |
| 📝 Notas | Todas as anotações consolidadas |
| 📅 Tarefas | Calendário com tarefas e prazos |
| ⚙️ Config | Configurações e gerenciamento da grade |

---

## 4. Modelo de Dados (Conceitual)

### Aluno (Student)
- `id`, `name`

### Matéria (Course)
- `id`, `name`, `color`

### Horário (Schedule)
- `id`, `courseId`, `dayOfWeek`, `startTime`, `endTime`

### Sessão de Aula (ClassSession)
- `id`, `courseId`, `date`

### Anotação (Note)
- `id`, `classSessionId`, `content`, `createdAt`, `updatedAt`

### Tarefa (Task)
- `id`, `classSessionId`, `description`, `dueDate`, `isCompleted`, `createdAt`

---

## 5. Fluxo Principal do Usuário

```
[Abre o App]
     │
     ▼
[Primeira vez?] ──Sim──▶ [Onboarding: Nome → Cadastrar Matérias → Pronto!]
     │                                                              │
    Não                                                             │
     │◄─────────────────────────────────────────────────────────────┘
     ▼
[Tela "Hoje" — Lista de aulas do dia]
     │
     ▼
[Clica em uma aula]
     │
     ▼
[Sessão da Aula do Dia]
     │
     ├──▶ [Escrever anotações]
     │
     └──▶ [Criar tarefa com prazo]
```

---

## 6. Tecnologias (Sugestão)

| Camada | Tecnologia |
|--------|------------|
| Framework | React Native com Expo |
| Navegação | Expo Router |
| Banco de Dados | SQLite (local, via expo-sqlite) |
| State Management | Zustand (leve e simples) |
| UI/Estilo | Stylesheet nativo do React Native |
| Linguagem | TypeScript |

---

## 7. Fora do Escopo (MVP)

Os itens abaixo **não** fazem parte desta versão inicial:

- ❌ Push notifications / lembretes automáticos
- ❌ Importação de grade (arquivo/link)
- ❌ Sincronização na nuvem / backup
- ❌ Compartilhamento de anotações
- ❌ Gravação de áudio
- ❌ Modo offline avançado (o app já é local por natureza)
- ❌ Suporte a múltiplos semestres

---

## 8. Critérios de Sucesso

- [ ] Aluno consegue cadastrar sua grade de aulas
- [ ] Ao abrir o app, vê as aulas do dia
- [ ] Consegue clicar em uma aula e escrever anotações
- [ ] Consegue criar tarefas com data de entrega
- [ ] Consegue visualizar todas as notas em uma tela
- [ ] Consegue visualizar todas as tarefas em formato de calendário
- [ ] Consegue editar/gerenciar suas matérias
