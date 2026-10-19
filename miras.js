/* ============================================
   PÁGINA DE MIRAS
   Monta os cards e guarda as suas miras no navegador (localStorage).
   O editor (nova mira, importar e editar) fica no editor.js.
   ============================================ */

const CHAVE_MINHAS_MIRAS = 'valorant-minhas-miras';
const CHAVE_VISUAL = 'valorant-miras-visual';

// Opções de visualização escolhidas nos botões "Fundo" e "Zoom"
const visual = { fundo: 'parede', zoom: 2 };
const ZOOMS = [2, 4];

const grid = document.getElementById('miras-grid');
const gridPros = document.getElementById('pros-grid');


/* ============================================
   SALVAR / CARREGAR NO NAVEGADOR
   (try/catch porque o localStorage pode estar bloqueado,
   ex.: aba anônima em alguns navegadores)
   ============================================ */

function carregarMinhasMiras() {
    try {
        const lista = JSON.parse(localStorage.getItem(CHAVE_MINHAS_MIRAS));
        return Array.isArray(lista) ? lista : [];
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

/** true se já existe uma mira com esse código (ignora a mira com o id informado) */
function miraJaExiste(codigo, ignorarId = null) {
    const procurado = codigoCanonico(codigo);
    return [...MIRAS_FIXAS, ...carregarMinhasMiras()]
        .some(mira => mira.id !== ignorarId && codigoCanonico(mira.codigo) === procurado);
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

// Miras de pros: mesmos cards, numa seção própria (dados no miras-data.js)
function renderizarPros() {
    gridPros.innerHTML = '';
    MIRAS_PROS.forEach(item => gridPros.appendChild(criarCard(item)));

    // Linha embaixo do título: quantas são e de onde vieram os códigos
    const fonte = document.getElementById('pros-fonte');
    const link = document.createElement('a');
    link.href = FONTE_PROS.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = FONTE_PROS.nome;
    fonte.textContent = `${MIRAS_PROS.length} jogadores profissionais. Códigos conferidos no `;
    fonte.append(link, ` (atualizado em ${FONTE_PROS.atualizadoEm}). Os pros trocam de mira com frequência.`);
}

const ICONE_LIXEIRA = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
    </svg>`;

// Ícone de "ajustes" (três controles deslizantes)
const ICONE_EDITAR = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
        <circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" />
    </svg>`;

function criarBotaoIcone(icone, titulo, aoClicar) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao botao-fantasma botao-pequeno botao-icone';
    botao.title = titulo;
    botao.setAttribute('aria-label', titulo);
    botao.innerHTML = icone;
    botao.addEventListener('click', aoClicar);
    return botao;
}

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
                <button type="button" class="botao botao-secundario botao-pequeno">Copiar</button>
            </div>
        </div>
    `;
    if (item.doNavegador) card.dataset.id = item.id;

    // textContent (e não innerHTML) para o nome: assim ninguém injeta HTML pelo formulário
    const nome = card.querySelector('.mira-nome');
    nome.textContent = item.nome;
    nome.title = item.nome; // nome completo aparece ao passar o mouse, se for cortado
    card.querySelector('canvas').dataset.codigo = item.codigo;

    const acoes = card.querySelector('.mira-acoes');
    const botaoCopiar = acoes.querySelector('button');
    botaoCopiar.addEventListener('click', () => copiarTexto(item.codigo, botaoCopiar));

    // Editar: abre o editor com essa mira (abrirEditor fica no editor.js)
    acoes.prepend(criarBotaoIcone(ICONE_EDITAR, `Editar ${item.nome}`, () => abrirEditor(item)));

    // Miras do navegador ganham selo e botão de excluir
    if (item.doNavegador) {
        const selo = document.createElement('span');
        selo.className = 'selo';
        selo.textContent = 'Sua';
        card.querySelector('.mira-info').appendChild(selo);

        acoes.prepend(criarBotaoIcone(ICONE_LIXEIRA, `Excluir ${item.nome}`, () => excluirMira(item.id, item.nome)));
    }

    return card;
}

function excluirMira(id, nome) {
    if (!confirm(`Excluir a mira "${nome}"?`)) return;
    const restantes = carregarMinhasMiras().filter(mira => mira.id !== id);
    salvarMinhasMiras(restantes);
    renderizarMiras();
}

// Dá um destaque rápido num card (depois de salvar)
function destacarMira(id) {
    const card = grid.querySelector(`[data-id="${id}"]`);
    if (!card) return;
    card.classList.add('mira-nova');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
   (Inclui a prévia do editor.)
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
renderizarPros();
renderizarMiras(); // esta já redesenha todas as prévias, inclusive as dos pros
