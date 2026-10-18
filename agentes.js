/* ============================================
   PÁGINA DE AGENTES
   Monta os cards dos mapas a partir do mapas-data.js
   ============================================ */

const gridMapas = document.getElementById('mapas-grid');

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
    card.querySelector('.mapa-fonte').textContent = `Base: ${mapa.fonte}`;

    if (mapa.selo) {
        const selo = document.createElement('span');
        selo.className = mapa.selo === 'Novo' ? 'selo selo-cheio' : 'selo';
        selo.textContent = mapa.selo;
        botaoImagem.appendChild(selo);
    }

    const lista = card.querySelector('.agentes-lista');
    mapa.agentes.forEach(({ id, pick }) => lista.appendChild(criarAgente(id, pick)));

    return card;
}

function criarAgente(id, pick) {
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

    item.append(img, nome);

    if (pick !== undefined) {
        const porcentagem = document.createElement('span');
        porcentagem.className = 'agente-pick';
        porcentagem.textContent = `${pick}%`;
        item.appendChild(porcentagem);
    }

    return item;
}

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

MAPAS.forEach(mapa => gridMapas.appendChild(criarCardMapa(mapa)));

// Fecha o minimapa clicando fora da imagem ou apertando Esc
document.getElementById('mapModal').addEventListener('click', evento => {
    if (evento.target.id === 'mapModal') closeMap();
});
document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') closeMap();
});
