# PRD - Grade: Diário de Bordo Digital Acadêmico

## 1. Visão Geral

### 1.1 Resumo Executivo
O Grade é um "diário de bordo" digital e inteligente, focado na produtividade acadêmica para estudantes de tecnologia. Ele centraliza a rotina universitária conectando a grade de horários com anotações ricas, gestão de blocos de código e controle de prazos em um único ambiente mobile. É o ponto de encontro perfeito entre o que acontece na sala de aula e o que precisa ser feito em casa.

### 1.2 Problema
- **Desorganização** e conteúdos fragmentados (anotações em cadernos, fotos do quadro, links perdidos no WhatsApp).
- **Perda de contexto** de matérias e explicações técnicas complexas.
- **Esquecimento de prazos** importantes, fazendo com que os alunos percam entregas essenciais (como projetos e Challenges).
- **Tempo ocioso subutilizado** no transporte público, dificultando a revisão de conceitos e o planejamento de tarefas pelo celular.

### 1.3 Solução
Aplicativo mobile que automatiza e centraliza a organização acadêmica, oferecendo:
- Importação da grade de aulas para formar uma timeline diária automática.
- Criação rápida de cards de aulas com suporte a trechos de código (Syntax Highlighting).
- Extração e unificação automática de tarefas geradas dentro das anotações das aulas para um gerenciador integrado.

### 1.4 Objetivos do Produto
- Evitar que estudantes percam prazos de entregas e projetos.
- Reduzir o tempo gasto procurando anotações fragmentadas.
- Permitir revisão eficiente de materiais (especialmente código) diretamente do celular durante o trajeto casa-faculdade.
- Oferecer uma experiência de captura de informações tão ágil quanto o Google Keep, mas tão estruturada quanto o Notion.

---

## 2. Stakeholders

### 2.1 Equipe do Produto
- **Product Manager / Owner**: Lucas
- **Designer UX/UI**: [Nome]
- **Desenvolvedores (Mobile & Backend)**: [Times/Indivíduos]

### 2.2 Stakeholders Externos
- **Estudantes Universitários**: Usuários finais que utilizam a ferramenta no dia a dia.
- **Instituições de Ensino (Futuro)**: Potenciais parceiros para integração direta de grades e avisos.

---

## 3. Personas

### 3.1 Persona Primária: O Estudante de Tecnologia
**Nome**: Rafael, 21 anos  
**Ocupação**: Estudante de Engenharia de Software e Estagiário  
**Contexto**: Passa 2h diárias no transporte público e lida com muitas matérias práticas.  
**Motivações**:
- Manter as entregas de projetos (Challenges, trabalhos em grupo) sempre em dia.
- Ter fácil acesso a trechos de código (snippets) que os professores passaram na lousa ou projetor.

**Dores**:
- Perde links importantes que os colegas mandam no WhatsApp.
- Tira foto do quadro na sala de aula e depois nunca mais encontra a imagem ou não entende o contexto.
- Esquece o que tem para fazer na semana devido ao volume de informações.

**Comportamento**:
- Usa o celular intensamente no trajeto.
- Gosta de ferramentas como Notion e Todoist, mas sente dificuldade em configurá-las para o fluxo rápido da sala de aula.

---

## 4. Requisitos Funcionais

### 4.1 Módulo de Grade e Calendário

#### RF-001: Integração de Calendário (Timeline diária)
**Prioridade**: Alta (MVP)  
**Descrição**: Sistema deve importar ou permitir o cadastro rápido da grade de aulas do semestre, gerando uma timeline diária.
**Critérios de Aceitação**:
- Visualização da grade por dia da semana (Segunda a Sexta/Sábado).
- Notificação antes do início da aula com um atalho para criar o "Card da Aula".
- Interface clara mostrando as aulas de "Hoje".
- Suporte a Importação de Calendário (Google Calendar, Outlook, Apple) através de leitura de arquivo .ICS ou Sync/OAuth nos primeiros passos do Onboarding. Ao concluir a importação, a grade de aulas e horários do aluno será estruturada e definida automaticamente no aplicativo.

### 4.2 Módulo de Anotações (Card da Aula)

#### RF-002: Criação Ágil de Card de Aula
**Prioridade**: Alta (MVP)  
**Descrição**: Um formulário de registro segmentado e rápido para capturar o contexto da aula em andamento.
**Critérios de Aceitação**:
- Abertura rápida do card vinculado à matéria atual.
- Seção de resumo em texto rico.

#### RF-003: Área de Syntax Highlighting
**Prioridade**: Alta (MVP)  
**Descrição**: Bloco específico para salvamento de trechos de código com formatação adequada.
**Critérios de Aceitação**:
- Suporte a linguagens iniciais: JavaScript, HTML, CSS, Python, Java.
- Renderização visual clara no mobile em modo dark/light.

#### RF-004: Mapeamento de Links e Radar de Termos
**Prioridade**: Média (MVP)  
**Descrição**: Captura estruturada de referências e palavras-chave.
**Critérios de Aceitação**:
- Área para colar URLs de referências.
- Geração de tags (radar de termos) dinâmicas para facilitar a busca posterior por conceito (ex: #API, #React).

### 4.3 Módulo de Gestão de Tarefas (Hub)

#### RF-005: Hub de Tarefas Integrado
**Prioridade**: Alta (MVP)  
**Descrição**: Gerenciador que extrai automaticamente (ou manualmente com um clique) as lições de casa e projetos anotados dentro do "Card da Aula" e os coloca num painel unificado.
**Critérios de Aceitação**:
- Visões similares ao Todoist ("Fazer Hoje", "Nesta Semana", "Sem Prazo").
- Checkbox para marcar como concluído.
- Vinculação automática com o Card da matéria que gerou a tarefa, permitindo ao usuário voltar ao contexto rapidamente.

---

## 5. Requisitos Não-Funcionais

### 5.1 Usabilidade e Design
- **RNF-001**: O app deve ter abertura extremamente rápida (< 2 segundos) para garantir a agilidade de captura (inspiração Google Keep/Apple Notes).
- **RNF-002**: Suporte obrigatório a Dark Mode, visto que o público-alvo (devs) consome ativamente este padrão.

### 5.2 Performance e Mobile
- **RNF-003**: O app deve investir em modo offline-first, permitindo que o aluno anote em ambientes sem Wi-Fi (salas isoladas) ou no metrô (transporte público), sincronizando assim que tiver rede.
- **RNF-004**: Plataformas alvo: iOS e Android nativo ou multi-plataforma (React Native / Flutter).

### 5.3 Segurança
- **RNF-005**: Autenticação segura via E-mail/Senha, Google Login ou Apple SignIn.

---

## 6. User Stories

### 6.1 Épico: Organização Diária (Aulas)

**US-001**: Como estudante, quero importar meu calendário acadêmico (Google Calendar / Apple) ou cadastrar minhas aulas para que o app crie uma timeline diária automática.
**Prioridade**: Must Have | **Estimativa**: 5 pontos  
**Critérios**:
- [ ] No onboarding, ter opção clara: "Importar do Calendário Digital", que, ao ser concluída, deve preencher automaticamente toda a grade de aulas do estudante (disciplinas, dias e horários).
- [ ] O app mostra a timeline com as aulas do dia atual na home.
- [ ] Cada aula card indica a matéria, horário e eventual local.

### 6.2 Épico: Captura de Conhecimento

**US-002**: Como estudante de tecnologia, quero salvar o código que o professor demonstrou em sala com syntax colorida para não me perder revisando arquivos de texto plano no celular.  
**Prioridade**: Must Have | **Estimativa**: 8 pontos  
**Critérios**:
- [ ] O Card da Aula deve oferecer inserção do "Code Block".
- [ ] Deve existir dropdown para escolher a linguagem.
- [ ] O código deve respeitar recuo e formatação na visualização e não quebrar layout de telas pequenas.

**US-003**: Como aluno rápido, preciso abrir a anotação da aula com um clique e salvar um link que foi mandado no grupo da sala.  
**Prioridade**: Must Have | **Estimativa**: 3 pontos  
**Critérios**:
- [ ] Inserção de link não deve travar o fluxo e deve extrair o favicon/titulo se houver internet.

### 6.3 Épico: Gestão de Produtividade

**US-004**: Como aluno esquecido, quero que tarefas que eu crio no meu Card da Aula vão automaticamente para minha "To-Do list" unificada, para que eu não precise checar matéria por matéria do que tenho de lição.  
**Prioridade**: Must Have | **Estimativa**: 8 pontos  
**Critérios**:
- [ ] Blocos marcados como 'Tarefa' dentro das anotações surgem no Hub de Tarefas.
- [ ] Posso definir uma data de vencimento da tarefa no Hub.
- [ ] Tarefas concluídas no Hub refletem como concluídas no card da anotação (e vice-versa).

---

## 7. Fluxos de Uso (MVP)

### 7.1 Fluxo: Criando uma nota no meio da aula
```
1. Usuário desbloqueia celular durante a aula.
2. Abre o Grade app.
3. Home exibe a aula que está rolando agora no topo: "Desenvolvimento Web - 19:00".
4. Toca em "Anotar agora".
5. O Card da aula se abre.
6. Usuário dita ou digita textualmente "Professor revisou hooks do React".
7. Professor passa um exemplo de código "useEffect".
8. Usuário clica em [+] e seleciona "Code Snippet" -> Linguagem JS.
9. Cola ou digita o código.
10. O professor fala: "Entregar o Challenge da API até sexta".
11. Usuário clica em [+] -> "Nova Tarefa" -> Digita "Challenge API", seleciona sexta-feira.
12. Fecha a nota. Arquivada automaticamente e tarefa vai pro Hub.
```

### 7.2 Fluxo: Revisando no Ônibus
```
1. Usuário entra no ônibus, pega o celular.
2. Abre o Grade app.
3. Clica na tab "Hub de Tarefas".
4. Vê as tarefas "Para esta semana": "Challenge API - Sexta".
5. Clica na tarefa para visualizar o contexto.
6. É levado para o "Card da Aula" respectivo.
7. Relembra o snippet de código do "useEffect" que o professor passou.
8. Já começa a pensar na lógica enquanto está no trânsito.
```

---

## 8. Arquitetura Técnica (Sugestão para o MVP)

### 8.1 Stack Recomendada
- **Mobile**: React Native (facilita o desenvolvimento para ambas as lojas simultaneamente e tem boas libs de Syntax Highlighting com `react-native-syntax-highlighter`).
- **Backend / Database**: Supabase ou Firebase.
  - O Supabase (PostgreSQL) é muito forte no modelo offline e estruturado relacional, encaixando muito bem com a visão "Notion-like" de blocos.
- **State Management**: Zustand ou Redux Toolkit.
- **Armazenamento Offline**: WatermelonDB ou o mecanismo de persistência local da stack escolhida, para resolver o RNF-003.

---

## 9. Modelo de Dados (Simplificado)

**users**
```sql
id: UUID (PK)
name: VARCHAR
email: VARCHAR
created_at: TIMESTAMP
```

**courses (Matérias/Disciplinas)**
```sql
id: UUID (PK)
user_id: UUID (FK)
name: VARCHAR
color_hex: VARCHAR
```

**class_schedules (Horários da Grade)**
```sql
id: UUID (PK)
course_id: UUID (FK)
day_of_week: INTEGER (0-6)
start_time: TIME
end_time: TIME
```

**class_cards (Cards de Aula)**
```sql
id: UUID (PK)
course_id: UUID (FK)
user_id: UUID (FK)
title: VARCHAR
created_at: TIMESTAMP
```

**blocks (Conteúdos da Anotação Notion-like)**
```sql
id: UUID (PK)
card_id: UUID (FK -> class_cards)
type: ENUM (text, code, link, task)
content: JSONB (armazena código da linguagem, raw text, url, etc)
order_index: INTEGER
```

**tasks (Hub de Tarefas Extraídas)**
```sql
id: UUID (PK)
user_id: UUID (FK)
block_id: UUID (FK -> blocks) -- Vinculação com a origem
title: VARCHAR
due_date: TIMESTAMP
is_completed: BOOLEAN
```
