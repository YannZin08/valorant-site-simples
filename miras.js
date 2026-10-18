/* ============================================
   PÁGINA DE MIRAS
   Monta os cards, a prévia do formulário e salva
   as miras adicionadas no navegador (localStorage).
   ============================================ */

const CHAVE_MINHAS_MIRAS = 'valorant-minhas-miras';
const CHAVE_VISUAL = 'valorant-miras-visual';

// Opções de visualização escolhidas nos botões "Fundo" e "Zoom"
const visual = { fundo: 'parede', zoom: 2 };

const grid = document.getElementById('miras-grid');
const form = document.getElementById('form-mira');
const campoNome = document.getElementById('mira-nome');
const campoCodigo = document.getElementById('mira-codigo');
const textoErro = document.getElementById('mira-erro');
const botaoAdicionar = document.getElementById('btn-adicionar');
const canvasPrevia = document.getElementById('previa-mira');
const dicaPrevia = document.getElementById('previa-dica');


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
    redesenharTudo();
}

function criarCard(item) {
    const mira = lerCodigoMira(item.codigo);

    const card = document.createElement('div');
    card.className = 'card mira-card';
    card.innerHTML = `
        <div class="card-image mira-preview">
            <canvas></canvas>
        </div>
        <div class="card-content">
            <h3 class="mira-nome"></h3>
            <div class="mira-tags"></div>
            <div class="id-container">
                <code class="hidden-code"></code>
                <button class="btn-copy" onclick="copiarID(this)">📋 Copiar</button>
            </div>
        </div>
    `;

    // textContent (e não innerHTML) para o nome: assim ninguém injeta HTML pelo formulário
    card.querySelector('.mira-nome').textContent = item.nome;
    card.querySelector('code').textContent = item.codigo;
    card.querySelector('canvas').dataset.codigo = item.codigo;

    // Etiquetas: cor + o que a mira tem
    const tags = card.querySelector('.mira-tags');
    if (mira) {
        tags.appendChild(criarTag(mira.cor.nome, mira.cor.hex));
        resumoDaMira(mira).forEach(texto => tags.appendChild(criarTag(texto)));
    } else {
        tags.appendChild(criarTag('Código inválido'));
    }

    // Miras do navegador ganham selo e botão de excluir
    if (item.doNavegador) {
        const selo = document.createElement('span');
        selo.className = 'badge badge-custom';
        selo.textContent = 'Sua';
        card.querySelector('.mira-preview').appendChild(selo);

        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.className = 'btn-excluir';
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.addEventListener('click', () => excluirMira(item.id, item.nome));
        card.querySelector('.card-content').appendChild(botaoExcluir);
    }

    return card;
}

function criarTag(texto, corHex) {
    const tag = document.createElement('span');
    tag.className = 'mira-tag';
    if (corHex) {
        const bolinha = document.createElement('i');
        bolinha.className = 'mira-tag-cor';
        bolinha.style.background = corHex;
        tag.appendChild(bolinha);
    }
    tag.appendChild(document.createTextNode(texto));
    return tag;
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

    form.reset();
    atualizarPrevia();
    renderizarMiras();

    // Dá um destaque na mira nova (ela é a primeira do grid)
    const cardNovo = grid.firstElementChild;
    cardNovo.classList.add('mira-nova');
    cardNovo.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        botao.classList.toggle('active', botao.dataset.fundo === visual.fundo);
    });
    document.querySelectorAll('#opcoes-zoom [data-zoom]').forEach(botao => {
        botao.classList.toggle('active', Number(botao.dataset.zoom) === visual.zoom);
    });
}

function mudarVisual(mudanca) {
    Object.assign(visual, mudanca);
    try { localStorage.setItem(CHAVE_VISUAL, JSON.stringify(visual)); } catch { }
    marcarAtivos();
    redesenharTudo();
}

function carregarVisual() {
    try {
        Object.assign(visual, JSON.parse(localStorage.getItem(CHAVE_VISUAL)) || {});
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

// Quando a imagem do mapa termina de carregar, redesenha com ela
document.addEventListener('reticula:fundo-pronto', redesenharTudo);


/* ============================================
   INÍCIO
   ============================================ */

carregarVisual();
marcarAtivos();
configurarOpcoes('opcoes-fundo', 'fundo', fundo => mudarVisual({ fundo }));
configurarOpcoes('opcoes-zoom', 'zoom', zoom => mudarVisual({ zoom: Number(zoom) }));

campoCodigo.addEventListener('input', atualizarPrevia);
form.addEventListener('submit', adicionarMira);

canvasPrevia.dataset.codigo = '';
renderizarMiras();
atualizarPrevia();
