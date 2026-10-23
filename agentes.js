/* ============================================
   PÁGINA DE AGENTES
   Monta os cards dos mapas a partir do mapas-data.js.
   O seletor "Meta" troca entre ranqueada (padrão) e profissional.
   ============================================ */

const gridMapas = document.getElementById('mapas-grid');
const CHAVE_META = 'valorant-meta-escolhido';

let metaAtual = 'ranqueada';


/* ============================================
   CARDS
   ============================================ */

function criarCardMapa(mapa) {
    const card = document.createElement('article');
    card.className = 'cartao mapa-card';
    card.innerHTML = `
        <button type="button" class="mapa-imagem">
            <img alt="" loading="lazy">
            <span class="mapa-nome"></span>
            <span class="mapa-ver">Ver minimapa</span>
        </button>
        <div class="mapa-corpo">
            <p class="mapa-fonte"></p>
            <div class="agentes-lista"></div>
        </div>
    `;

    const botaoImagem = card.querySelector('.mapa-imagem');
    const imagem = botaoImagem.querySelector('img');
    imagem.src = mapa.imagem;
    // Se a imagem não carregar, fica só o fundo com o nome (em vez de um ícone quebrado)
    imagem.addEventListener('error', () => botaoImagem.classList.add('sem-imagem'));

    botaoImagem.setAttribute('aria-label', `Ver minimapa de ${mapa.nome}`);
    botaoImagem.addEventListener('click', () => openMap(mapa.nome, mapa.minimapa));
    card.querySelector('.mapa-nome').textContent = mapa.nome;

    if (mapa.selo) {
        const selo = document.createElement('span');
        selo.className = mapa.selo === 'Novo' ? 'selo selo-cheio' : 'selo';
        selo.textContent = mapa.selo;
        botaoImagem.appendChild(selo);
    }

    preencherAgentes(card, mapa);
    return card;
}

// Coloca no card os agentes do meta escolhido (ranqueada ou pro)
function preencherAgentes(card, mapa) {
    const fonte = card.querySelector('.mapa-fonte');
    const lista = card.querySelector('.agentes-lista');
    lista.innerHTML = '';

    if (metaAtual === 'ranqueada') {
        const escolhas = mapa.ranqueada.escolhas.toLocaleString('pt-BR');
        fonte.textContent = `Base: ${escolhas} escolhas na ranqueada`;
        mapa.ranqueada.agentes.forEach(({ id, pick }) => lista.appendChild(criarAgente(id, formatarDecimal(pick))));
        return;
    }

    // Profissional: alguns mapas não tiveram campeonato com dados
    if (!mapa.pro) {
        fonte.textContent = `${mapa.nome} não esteve nos campeonatos de 2026 com dados.`;
        return;
    }
    fonte.textContent = `Base: ${mapa.pro.fonte}`;
    mapa.pro.agentes.forEach(({ id, pick }) => lista.appendChild(criarAgente(id, `${pick}%`)));
}

// 15.1 -> "15,1%" (sempre com uma casa decimal, no formato brasileiro)
function formatarDecimal(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function criarAgente(id, textoPick) {
    const agente = AGENTES[id];
    const item = document.createElement('div');
    item.className = 'agente';

    const img = document.createElement('img');
    img.src = agente.img;
    img.alt = '';
    img.loading = 'lazy';

    const nome = document.createElement('span');
    nome.className = 'agente-nome';
    nome.textContent = agente.nome;

    const porcentagem = document.createElement('span');
    porcentagem.className = 'agente-pick';
    porcentagem.textContent = textoPick;

    item.append(img, nome, porcentagem);
    return item;
}

function renderizarMapas() {
    gridMapas.innerHTML = '';
    MAPAS.forEach(mapa => gridMapas.appendChild(criarCardMapa(mapa)));
}


/* ============================================
   SELETOR "META" (RANQUEADA | PROFISSIONAL)
   ============================================ */

function criarSeletorMeta() {
    const grupo = document.getElementById('opcoes-meta');
    Object.entries(METAS).forEach(([chave, meta]) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.dataset.meta = chave;
        botao.textContent = meta.rotulo;
        botao.addEventListener('click', () => escolherMeta(chave));
        grupo.appendChild(botao);
    });
}

function escolherMeta(chave) {
    metaAtual = chave;
    try { localStorage.setItem(CHAVE_META, chave); } catch { }

    document.querySelectorAll('#opcoes-meta [data-meta]').forEach(botao => {
        const ativo = botao.dataset.meta === chave;
        botao.classList.toggle('active', ativo);
        botao.setAttribute('aria-pressed', ativo);
    });

    // Legenda: o que a porcentagem significa + fonte com link
    const meta = METAS[chave];
    const legenda = document.getElementById('meta-legenda');
    const link = document.createElement('a');
    link.href = meta.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = meta.fonte;
    legenda.textContent = `${meta.legenda} Fonte: `;
    legenda.append(link, ` (${meta.atualizadoEm}).`);

    // Só troca os agentes dentro dos cards (as imagens dos mapas não recarregam)
    gridMapas.querySelectorAll('.mapa-card').forEach((card, i) => preencherAgentes(card, MAPAS[i]));
}

function carregarMetaSalvo() {
    try {
        const salvo = localStorage.getItem(CHAVE_META);
        if (METAS[salvo]) metaAtual = salvo;
    } catch { }
}


/* ============================================
   INÍCIO
   ============================================ */

// Linha acima do título com o patch atual
document.getElementById('rotacao-info').textContent =
    `Patch ${ROTACAO.patch} · ${ROTACAO.temporada} · atualizado em ${ROTACAO.atualizadoEm}`;

// Mapas fora da rotação
const listaFora = document.getElementById('fora-rotacao');
FORA_DA_ROTACAO.forEach(nome => {
    const etiqueta = document.createElement('span');
    etiqueta.className = 'etiqueta';
    etiqueta.textContent = nome;
    listaFora.appendChild(etiqueta);
});

carregarMetaSalvo();
criarSeletorMeta();
renderizarMapas();
escolherMeta(metaAtual);

// Fecha o minimapa clicando fora da imagem ou apertando Esc
document.getElementById('mapModal').addEventListener('click', evento => {
    if (evento.target.id === 'mapModal') closeMap();
});
document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') closeMap();
});
