/* ============================================
   PÁGINA DE AGENTES
   Monta os cards dos mapas a partir do mapas-data.js
   ============================================ */

const gridMapas = document.getElementById('mapas-grid');

function criarCardMapa(mapa) {
    const card = document.createElement('div');
    card.className = 'card agent-map-card';
    card.innerHTML = `
        <div class="card-image" title="Clique para ver o minimapa">
            <img alt="">
            <span class="mapa-ver">Ver minimapa</span>
        </div>
        <div class="card-content">
            <h3></h3>
            <p class="mapa-fonte"></p>
            <div class="agents-list"></div>
        </div>
    `;

    const imagem = card.querySelector('.card-image img');
    imagem.src = mapa.imagem;
    imagem.alt = mapa.nome;
    // Se a imagem não carregar, mostra um fundo com o nome em vez de um ícone quebrado
    imagem.addEventListener('error', () => card.querySelector('.card-image').classList.add('sem-imagem'));

    card.querySelector('.card-image').addEventListener('click', () => openMap(mapa.nome, mapa.minimapa));
    card.querySelector('h3').textContent = mapa.nome.toUpperCase();
    card.querySelector('.mapa-fonte').textContent = `Base: ${mapa.fonte}`;

    if (mapa.selo) {
        const selo = document.createElement('span');
        selo.className = mapa.selo === 'Novo' ? 'badge badge-custom' : 'badge badge-classic';
        selo.textContent = mapa.selo;
        card.querySelector('.card-image').appendChild(selo);
    }

    const lista = card.querySelector('.agents-list');
    mapa.agentes.forEach(({ id, pick }) => lista.appendChild(criarAgente(id, pick)));

    return card;
}

function criarAgente(id, pick) {
    const agente = AGENTES[id];
    const item = document.createElement('div');
    item.className = 'agent';

    const img = document.createElement('img');
    img.src = agente.img;
    img.alt = agente.nome;

    const nome = document.createElement('span');
    nome.textContent = agente.nome;

    item.append(img, nome);

    if (pick !== undefined) {
        const porcentagem = document.createElement('small');
        porcentagem.className = 'agent-pick';
        porcentagem.textContent = `${pick}%`;
        item.appendChild(porcentagem);
    }

    return item;
}

// Cabeçalho com o patch e a lista de mapas fora da rotação
document.getElementById('rotacao-info').textContent =
    `Patch ${ROTACAO.patch} · ${ROTACAO.temporada} · atualizado em ${ROTACAO.atualizadoEm}`;

const listaFora = document.getElementById('fora-rotacao');
FORA_DA_ROTACAO.forEach(nome => {
    const tag = document.createElement('span');
    tag.className = 'mira-tag';
    tag.textContent = nome;
    listaFora.appendChild(tag);
});

MAPAS.forEach(mapa => gridMapas.appendChild(criarCardMapa(mapa)));

// Fecha o minimapa clicando fora da imagem ou apertando Esc
document.getElementById('mapModal').addEventListener('click', evento => {
    if (evento.target.id === 'mapModal') closeMap();
});
document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') closeMap();
});
