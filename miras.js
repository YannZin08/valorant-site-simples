/* ============================================
   PÁGINA DE MIRAS
   Monta os cards, a prévia do formulário e salva
   as miras adicionadas no navegador (localStorage).
   ============================================ */

const CHAVE_MINHAS_MIRAS = 'valorant-minhas-miras';
const CHAVE_VISUAL = 'valorant-miras-visual';

// Opções de visualização escolhidas nos botões "Fundo" e "Zoom"
const visual = { fundo: 'parede', zoom: 2 };
const ZOOMS = [2, 4];

const grid = document.getElementById('miras-grid');
const form = document.getElementById('form-mira');
const campoNome = document.getElementById('mira-nome');
const campoCodigo = document.getElementById('mira-codigo');
const textoErro = document.getElementById('mira-erro');
const botaoAdicionar = document.getElementById('btn-adicionar');
const canvasPrevia = document.getElementById('previa-mira');
const dicaPrevia = document.getElementById('previa-dica');
const botaoNovaMira = document.getElementById('btn-nova-mira');
const botaoCancelar = document.getElementById('btn-cancelar');


/* ============================================
   SALVAR / CARREGAR NO NAVEGADOR
   (try/catch porque o localStorage pode estar bloqueado,
   ex.: aba anônima em alguns navegadores)
   ============================================ */

function carregarMinhasMiras() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_MINHAS_MIRAS)) || [];
    } catch {
        return [];
    }
}

function salvarMinhasMiras(lista) {
    try {
        localStorage.setItem(CHAVE_MINHAS_MIRAS, JSON.stringify(lista));
        return true;
    } catch {
        return false;
    }
}


/* ============================================
   CARDS
   ============================================ */

function renderizarMiras() {
    // As suas aparecem primeiro (a mais nova no topo), depois as fixas do site
    const minhas = carregarMinhasMiras()
        .slice()
        .reverse()
        .map(mira => ({ ...mira, doNavegador: true }));

    const todas = [...minhas, ...MIRAS_FIXAS];

    grid.innerHTML = '';
    todas.forEach(item => grid.appendChild(criarCard(item)));

    document.getElementById('miras-contagem').textContent =
        todas.length === 1 ? '1 mira salva' : `${todas.length} miras salvas`;

    redesenharTudo();
}

const ICONE_LIXEIRA = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
    </svg>`;

function criarCard(item) {
    const card = document.createElement('div');
    card.className = 'cartao mira-card';
    card.innerHTML = `
        <div class="mira-preview">
            <canvas></canvas>
        </div>
        <div class="mira-rodape">
            <div class="mira-info">
                <h3 class="mira-nome"></h3>
            </div>
            <div class="mira-acoes">
                <code class="codigo-oculto"></code>
                <button type="button" class="botao botao-secundario botao-pequeno" onclick="copiarID(this)">Copiar</button>
            </div>
        </div>
    `;

    // textContent (e não innerHTML) para o nome: assim ninguém injeta HTML pelo formulário
    const nome = card.querySelector('.mira-nome');
    nome.textContent = item.nome;
    nome.title = item.nome; // nome completo aparece ao passar o mouse, se for cortado
    card.querySelector('code').textContent = item.codigo;
    card.querySelector('canvas').dataset.codigo = item.codigo;

    // Miras do navegador ganham selo e botão de excluir
    if (item.doNavegador) {
        const selo = document.createElement('span');
        selo.className = 'selo';
        selo.textContent = 'Sua';
        card.querySelector('.mira-info').appendChild(selo);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.className = 'botao botao-fantasma botao-pequeno botao-icone';
        botaoExcluir.title = 'Excluir mira';
        botaoExcluir.setAttribute('aria-label', `Excluir ${item.nome}`);
        botaoExcluir.innerHTML = ICONE_LIXEIRA;
        botaoExcluir.addEventListener('click', () => excluirMira(item.id, item.nome));
        card.querySelector('.mira-acoes').prepend(botaoExcluir);
    }

    return card;
}

function excluirMira(id, nome) {
    if (!confirm(`Excluir a mira "${nome}"?`)) return;
    const restantes = carregarMinhasMiras().filter(mira => mira.id !== id);
    salvarMinhasMiras(restantes);
    renderizarMiras();
}


/* ============================================
   FORMULÁRIO + PRÉVIA AO VIVO
   ============================================ */

// Tira espaços e quebras de linha que vêm junto quando a gente cola o código
function limparCodigo(codigo) {
    return codigo.replace(/\s+/g, '');
}

function atualizarPrevia() {
    const codigo = limparCodigo(campoCodigo.value);
    const mira = codigo ? lerCodigoMira(codigo) : null;

    canvasPrevia.dataset.codigo = mira ? codigo : '';
    desenharMira(canvasPrevia, mira, visual);

    dicaPrevia.hidden = Boolean(mira);
    canvasPrevia.parentElement.classList.toggle('travada', Boolean(mira)); // visor fecha na mira
    botaoAdicionar.disabled = !mira;
    textoErro.textContent = codigo && !mira
        ? 'Esse código não parece ser de uma mira do Valorant.'
        : '';
}

function adicionarMira(evento) {
    evento.preventDefault(); // não recarrega a página

    const codigo = limparCodigo(campoCodigo.value);
    if (!lerCodigoMira(codigo)) return;

    const minhas = carregarMinhasMiras();
    const jaExiste = [...MIRAS_FIXAS, ...minhas].some(mira => limparCodigo(mira.codigo) === codigo);
    if (jaExiste) {
        textoErro.textContent = 'Essa mira já está na lista.';
        return;
    }

    const nome = campoNome.value.trim() || `Mira ${MIRAS_FIXAS.length + minhas.length + 1}`;
    minhas.push({ id: Date.now(), nome, codigo });

    if (!salvarMinhasMiras(minhas)) {
        textoErro.textContent = 'Não consegui salvar no navegador (ele pode estar bloqueando o armazenamento).';
        return;
    }

    fecharFormulario();
    renderizarMiras();

    // Dá um destaque na mira nova (ela é a primeira do grid)
    const cardNovo = grid.firstElementChild;
    cardNovo.classList.add('mira-nova');
    cardNovo.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


// Abrir e fechar o painel "Nova mira"
function abrirFormulario() {
    form.hidden = false;
    botaoNovaMira.setAttribute('aria-expanded', 'true');
    atualizarPrevia(); // o canvas só tem tamanho depois que aparece
    campoCodigo.focus();
}

function fecharFormulario() {
    form.reset();
    form.hidden = true;
    botaoNovaMira.setAttribute('aria-expanded', 'false');
    atualizarPrevia();
}


/* ============================================
   BOTÕES DE FUNDO E ZOOM
   ============================================ */

function configurarOpcoes(idGrupo, atributo, aoEscolher) {
    const botoes = document.querySelectorAll(`#${idGrupo} [data-${atributo}]`);
    botoes.forEach(botao => {
        botao.addEventListener('click', () => aoEscolher(botao.dataset[atributo]));
    });
}

function marcarAtivos() {
    document.querySelectorAll('#opcoes-fundo [data-fundo]').forEach(botao => {
        const ativo = botao.dataset.fundo === visual.fundo;
        botao.classList.toggle('active', ativo);
        botao.setAttribute('aria-pressed', ativo);
    });
    document.querySelectorAll('#opcoes-zoom [data-zoom]').forEach(botao => {
        const ativo = Number(botao.dataset.zoom) === visual.zoom;
        botao.classList.toggle('active', ativo);
        botao.setAttribute('aria-pressed', ativo);
    });
}

function mudarVisual(mudanca) {
    Object.assign(visual, mudanca);
    try { localStorage.setItem(CHAVE_VISUAL, JSON.stringify(visual)); } catch { }
    marcarAtivos();
    redesenharTudo();
}

// Usa o que ficou salvo só se ainda for uma opção que existe
// (ex.: quem tinha "Mapa" ou zoom "Real" salvo volta para o padrão)
function carregarVisual() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_VISUAL)) || {};
        if (FUNDOS[salvo.fundo]) visual.fundo = salvo.fundo;
        if (ZOOMS.includes(salvo.zoom)) visual.zoom = salvo.zoom;
    } catch { }
}


/* ============================================
   REDESENHAR
   Cada <canvas> guarda o próprio código em data-codigo,
   então dá pra redesenhar tudo quando muda fundo, zoom ou tamanho da tela.
   ============================================ */

function redesenharTudo() {
    document.querySelectorAll('canvas[data-codigo]').forEach(canvas => {
        const codigo = canvas.dataset.codigo;
        desenharMira(canvas, codigo ? lerCodigoMira(codigo) : null, visual);
    });
}

let esperaResize;
window.addEventListener('resize', () => {
    clearTimeout(esperaResize);
    esperaResize = setTimeout(redesenharTudo, 100);
});


/* ============================================
   INÍCIO
   ============================================ */

carregarVisual();
marcarAtivos();
configurarOpcoes('opcoes-fundo', 'fundo', fundo => mudarVisual({ fundo }));
configurarOpcoes('opcoes-zoom', 'zoom', zoom => mudarVisual({ zoom: Number(zoom) }));

campoCodigo.addEventListener('input', atualizarPrevia);
form.addEventListener('submit', adicionarMira);
botaoNovaMira.addEventListener('click', () => (form.hidden ? abrirFormulario() : fecharFormulario()));
botaoCancelar.addEventListener('click', fecharFormulario);

canvasPrevia.dataset.codigo = '';
renderizarMiras();
atualizarPrevia();
