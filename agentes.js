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

// Coloca no card os agentes do meta escolhido (ranqueada ou pro), separados por função
function preencherAgentes(card, mapa) {
    const fonte = card.querySelector('.mapa-fonte');
    const lista = card.querySelector('.agentes-lista');
    lista.innerHTML = '';

    const dados = metaAtual === 'ranqueada' ? mapa.ranqueada : mapa.pro;

    // Profissional: alguns mapas não tiveram campeonato com dados
    if (!dados) {
        fonte.textContent = `${mapa.nome} não esteve nos campeonatos de 2026 com dados.`;
        return;
    }

    fonte.textContent = metaAtual === 'ranqueada'
        ? `Base: ${dados.escolhas.toLocaleString('pt-BR')} escolhas na ranqueada`
        : `Base: ${dados.fonte}`;

    const formatar = metaAtual === 'ranqueada' ? formatarDecimal : valor => `${valor}%`;
    const grupos = agentesPorFuncao(dados.agentes, METAS[metaAtual].minimo);

    Object.entries(grupos).forEach(([funcao, agentes]) => {
        const grupo = document.createElement('section');
        grupo.className = 'funcao-grupo';
        // Quantas das 6 colunas do card a função ocupa: 1 por agente, no mínimo 2 (pro título caber)
        grupo.style.setProperty('--colunas', Math.min(6, Math.max(2, agentes.length)));

        const titulo = document.createElement('h4');
        titulo.className = 'funcao-titulo';
        titulo.textContent = FUNCOES[funcao];

        const agentesDaFuncao = document.createElement('div');
        agentesDaFuncao.className = 'funcao-agentes';
        agentes.forEach(({ id, pick }) => agentesDaFuncao.appendChild(criarAgente(id, formatar(pick))));

        grupo.append(titulo, agentesDaFuncao);
        lista.appendChild(grupo);
    });
}

/**
 * Separa os agentes por função (na ordem de FUNCOES) e, em cada função,
 * deixa só os que têm pelo menos "minimo"%. O mais escolhido da função
 * sempre aparece, mesmo abaixo do mínimo. Função sem nenhum agente na lista fica de fora.
 */
function agentesPorFuncao(agentes, minimo) {
    const grupos = {};
    Object.keys(FUNCOES).forEach(funcao => {
        const daFuncao = agentes
            .filter(({ id }) => AGENTES[id].funcao === funcao)
            .sort((a, b) => b.pick - a.pick);
        if (daFuncao.length === 0) return;

        const acimaDoMinimo = daFuncao.filter(({ pick }) => pick >= minimo);
        grupos[funcao] = acimaDoMinimo.length > 0 ? acimaDoMinimo : [daFuncao[0]];
    });
    return grupos;
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
