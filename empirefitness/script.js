const CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_KEY: "",
  TABELA_CHECKBOXES: "",
  TABELA_OBSERVACOES: ""
};

const db = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

const elementos = {
  checkboxes: document.querySelectorAll("input[type='checkbox']"),
  botoesDias: document.querySelectorAll(".dias button"),
  treinos: document.querySelectorAll(".treino"),
  textareaObs: document.getElementById("observacoes"),
  btnAdicionarObs: document.getElementById("adicionarObs"),
  listaObs: document.getElementById("listaObservacoes"),
  mensagem: document.getElementById("mensagem")
};

const estado = {
  diaAtual: null
};

function mostrarMensagem(texto, tipo = "sucesso") {
  elementos.mensagem.textContent = texto;
  elementos.mensagem.className = tipo;

  setTimeout(() => {
    elementos.mensagem.textContent = "";
    elementos.mensagem.className = "";
  }, 3000);
}

function obterDiaAtual() {
  const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  return dias[new Date().getDay()];
}

function mostrarTreino(dia) {
  estado.diaAtual = dia;

  elementos.treinos.forEach(treino => {
    treino.classList.remove("ativo");
  });

  elementos.botoesDias.forEach(botao => {
    botao.classList.remove("ativo-dia");
  });

  const treinoSelecionado = document.getElementById(dia);
  const botaoSelecionado = document.querySelector(`[data-dia="${dia}"]`);

  if (treinoSelecionado) treinoSelecionado.classList.add("ativo");
  if (botaoSelecionado) botaoSelecionado.classList.add("ativo-dia");

  carregarObservacoes();
}

async function carregarCheckboxes() {
  const { data, error } = await db
    .from(CONFIG.TABELA_CHECKBOXES)
    .select("*");

  if (error) {
    mostrarMensagem("Erro ao carregar checkboxes.", "erro");
    console.error(error);
    return;
  }

  elementos.checkboxes.forEach(checkbox => {
    const checkboxSalvo = data.find(item => item.id === checkbox.id);
    checkbox.checked = checkboxSalvo ? checkboxSalvo.marcado : false;
  });
}

async function salvarCheckbox(checkbox) {
  const { error } = await db
    .from(CONFIG.TABELA_CHECKBOXES)
    .upsert({
      id: checkbox.id,
      marcado: checkbox.checked
    });

  if (error) {
    mostrarMensagem("Erro ao salvar exercício.", "erro");
    console.error(error);
    return;
  }

  mostrarMensagem("Exercício salvo!");
}

async function carregarObservacoes() {
  elementos.listaObs.innerHTML = "";

  const { data, error } = await db
    .from(CONFIG.TABELA_OBSERVACOES)
    .select("*")
    .eq("dia", estado.diaAtual)
    .order("id", { ascending: false });

  if (error) {
    mostrarMensagem("Erro ao carregar observações.", "erro");
    console.error(error);
    return;
  }

  if (data.length === 0) {
    elementos.listaObs.innerHTML = "<li>Nenhuma observação para este dia.</li>";
    return;
  }

  data.forEach(obs => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = obs.texto;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.addEventListener("click", () => removerObservacao(obs.id));

    li.appendChild(span);
    li.appendChild(btnRemover);

    elementos.listaObs.appendChild(li);
  });
}

async function adicionarObservacao() {
  const texto = elementos.textareaObs.value.trim();

  if (texto === "") {
    mostrarMensagem("Digite uma observação antes de adicionar.", "erro");
    return;
  }

  const { error } = await db
    .from(CONFIG.TABELA_OBSERVACOES)
    .insert({
      dia: estado.diaAtual,
      texto: texto
    });

  if (error) {
    mostrarMensagem("Erro ao adicionar observação.", "erro");
    console.error(error);
    return;
  }

  elementos.textareaObs.value = "";
  mostrarMensagem("Observação adicionada!");
  carregarObservacoes();
}

async function removerObservacao(id) {
  const { error } = await db
    .from(CONFIG.TABELA_OBSERVACOES)
    .delete()
    .eq("id", id);

  if (error) {
    mostrarMensagem("Erro ao remover observação.", "erro");
    console.error(error);
    return;
  }

  mostrarMensagem("Observação removida!");
  carregarObservacoes();
}

function configurarEventos() {
  elementos.botoesDias.forEach(botao => {
    botao.addEventListener("click", () => {
      mostrarTreino(botao.dataset.dia);
    });
  });

  elementos.checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      salvarCheckbox(checkbox);
    });
  });

  elementos.btnAdicionarObs.addEventListener("click", adicionarObservacao);
}

async function iniciarSistema() {
  configurarEventos();

  await carregarCheckboxes();

  const hoje = obterDiaAtual();
  mostrarTreino(hoje);
}

iniciarSistema();
