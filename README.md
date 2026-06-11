🏋️ EmpireFitness - Diário de Treino Inteligente
O EmpireFitness é um aplicativo web interativo projetado para atletas e entusiastas da musculação gerenciarem suas rotinas de treinos diários. A aplicação divide as fichas de exercícios pelos dias da semana, monitora a conclusão de cada atividade em tempo real e armazena anotações ou observações de desempenho (como cargas e repetições) de forma totalmente integrada à nuvem.

⚙️ Funcionalidades Principais
Identificação Automática do Dia: Ao inicializar, o sistema lê o calendário do dispositivo do usuário e ativa automaticamente a aba do treino correspondente ao dia atual da semana.

Persistência de Progresso Global (upsert): As caixas de seleção (checkboxes) de conclusão dos exercícios salvam seu estado de forma instantânea. O progresso não é perdido ao fechar o navegador ou recarregar a página.

Módulo de Observações por Dia: Permite criar, listar e remover anotações específicas para cada ficha de treino de maneira isolada (ex: notas criadas na segunda-feira só aparecem no painel de segunda-feira).

Feedback Dinâmico ao Usuário: Exibe pequenos alertas temporizados na tela indicando o sucesso ou falha nas operações com o banco de dados.

🛠️ Tecnologias e Arquitetura
Frontend: JavaScript Avançado (ES6+), HTML5 e CSS3 (Manipulação dinâmica de classes estruturais).

Banco de Dados (BaaS): Supabase (Integração via Client SDK para persistência NoSQL/PostgreSQL em nuvem).

📂 Modelagem de Dados (Tabelas do Supabase)
O script realiza operações assíncronas (SELECT, UPSERT, INSERT e DELETE) estruturadas em duas tabelas fundamentais:

1. Tabela: checkboxes_treino
Responsável por salvar quais exercícios foram concluídos.

id (text / primary key): O ID correspondente à tag HTML do checkbox.

marcado (boolean): Define se o exercício está concluído (true) ou pendente (false).

2. Tabela: observacoes_treino
Responsável pelo histórico de anotações diárias.

id (int8 / auto-increment): Chave primária da anotação.

dia (text): O dia da semana vinculado (ex: "segunda", "terca").

texto (text): O conteúdo escrito pelo usuário.

📄 Licença
Este projeto está sob a licença MIT.
