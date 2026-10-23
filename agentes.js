/* ============================================
   PÁGINA DE AGENTES
   Tudo é montado a partir do mapas-data.js:
   1) a conta: "% dos times que jogaram com o agente"
   2) Seleção: um mapa por vez, com os 5 que mais aparecem
      e os substitutos de cada um ("Se já pegaram")
   3) Quadro: todos os mapas lado a lado
   4) Seletor "Ranqueada | Profissional" (vale para as duas partes)
   ============================================ */

const CHAVE_META = 'valorant-meta-escolhido';
const CHAVE_MAPA = 'valorant-mapa-escolhido';
const MINIMO_NO_QUADRO = 15; // o quadro mostra quem passa disso em algum mapa

let metaAtual = 'ranqueada';
let mapaAtual = MAPAS[0];

const NOME_FUNCAO = {
    duelista: 'Duelista',
    iniciador: 'Iniciador',
    controlador: 'Controlador',
    sentinela: 'Sentinela',
};


/* ============================================
   1) A CONTA
   ============================================ */

/**
 * Lista os agentes do mapa com a % dos times que jogaram com cada um,
 * do maior para o menor. Devolve null se o mapa não tem dados nesse meta.
 * Ranqueada: o pick é % de todas as escolhas; cada time tem 5 agentes
 * diferentes, então % dos times = pick x 5.
 */
function presencaNoMapa(mapa, chave) {
    const dados = chave === 'ranqueada' ? mapa.ranqueada : mapa.pro;
    if (!dados) return null;
    const multiplicador = METAS[chave].formato === 'escolhas' ? 5 : 1;

    return Object.entries(dados.pick)
        .filter(([id]) => AGENTES[id])
        .map(([id, valor]) => ({ id, valor: Math.min(100, Math.round(valor * multiplicador)) }))
        .sort((a, b) => b.valor - a.valor); // empate: fica a ordem do arquivo
}

// Os próximos da mesma função que não estão entre os 5
function substitutos(lista, agente, time) {
    const noTime = new Set(time.map(a => a.id));
    const funcao = AGENTES[agente.id].funcao;
    return lista
        .filter(a => !noTime.has(a.id) && AGENTES[a.id].funcao === funcao && a.valor >= 1)
        .slice(0, 2);
}

function criar(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto != null) elemento.textContent = texto;
    return elemento;
}

// Rostinho do agente (recorte da arte); sem imagem, mostra a inicial
function criarRosto(id) {
    const agente = AGENTES[id];
    const rosto = criar('span', 'rosto');
    rosto.setAttribute('aria-hidden', 'true');
    if (agente.img) rosto.style.backgroundImage = `url(${agente.img})`;
    else rosto.textContent = agente.nome[0];
    return rosto;
}

// Marcas contadas: 20 risquinhos, cada um vale 5%
function criarContagem(valor) {
    const contagem = criar('span', 'contagem');
    contagem.setAttribute('aria-hidden', 'true');
    const cheias = Math.round(valor / 5);
    for (let i = 0; i < 20; i++) contagem.appendChild(criar('i', i < cheias ? 'cheia' : ''));
    return contagem;
}


/* ============================================
   2) SELEÇÃO (um mapa por vez)
   ============================================ */

function montarFaixaDeMapas() {
    const faixa = document.getElementById('faixa-mapas');
    MAPAS.forEach(mapa => {
        const botao = criar('button', 'faixa-mapa');
        botao.type = 'button';
        botao.dataset.mapa = mapa.nome;

        const imagem = criar('img');
        imagem.src = mapa.imagem;
        imagem.alt = '';
        imagem.loading = 'lazy';
        botao.append(imagem, criar('span', 'faixa-nome', mapa.nome));
        if (mapa.selo) botao.appendChild(criar('span', 'faixa-selo', mapa.selo));

        botao.addEventListener('click', () => escolherMapa(mapa));
        faixa.appendChild(botao);
    });
}

function escolherMapa(mapa, { rolar = false } = {}) {
    mapaAtual = mapa;
    try { localStorage.setItem(CHAVE_MAPA, mapa.nome); } catch { }
    // o endereço guarda o mapa (ex.: agentes.html#lotus), para mandar o link para alguém
    try { history.replaceState(null, '', '#' + mapa.nome.toLowerCase()); } catch { }

    document.querySelectorAll('.faixa-mapa').forEach(botao => {
        const ativo = botao.dataset.mapa === mapa.nome;
        botao.classList.toggle('ativo', ativo);
        botao.setAttribute('aria-pressed', ativo);
    });
    document.querySelectorAll('.quadro-mapa button').forEach(botao => {
        botao.classList.toggle('ativo', botao.dataset.mapa === mapa.nome);
    });

    const capa = document.getElementById('palco-capa');
    capa.style.setProperty('--arte', `url(${mapa.imagem})`);
    document.getElementById('palco-nome').textContent = mapa.nome;

    const selo = document.getElementById('palco-selo');
    selo.hidden = !mapa.selo;
    selo.textContent = mapa.selo || '';

    document.getElementById('palco-minimapa-img').src = mapa.minimapa;
    document.getElementById('palco-minimapa').setAttribute('aria-label', `Ampliar minimapa de ${mapa.nome}`);

    preencherPalco();
    if (rolar) document.getElementById('palco').scrollIntoView({ block: 'start' });
}

// Fonte, legenda e as 5 cartas do mapa escolhido, no meta escolhido
function preencherPalco() {
    const mapa = mapaAtual;
    const meta = METAS[metaAtual];
    const lista = presencaNoMapa(mapa, metaAtual);

    const info = document.getElementById('palco-info');
    info.textContent = '';
    const textoInfo = metaAtual === 'ranqueada'
        ? `${mapa.ranqueada.escolhas.toLocaleString('pt-BR')} escolhas na ranqueada · `
        : (mapa.pro ? `${mapa.pro.fonte} · ` : 'Sem dados de campeonato');
    info.append(textoInfo);
    if (lista) {
        const link = criar('a', '', meta.fonte);
        link.href = meta.url;
        link.target = '_blank';
        link.rel = 'noopener';
        info.append(link, ` · ${meta.atualizadoEm}`);
    }

    const fileira = document.getElementById('fileira');
    const exemplo = document.getElementById('palco-exemplo');
    fileira.innerHTML = '';

    if (!lista) {
        exemplo.textContent = '';
        fileira.appendChild(criar('li', 'fileira-vazia',
            `${mapa.nome} não esteve nos campeonatos de 2026 que têm dados. Veja a ranqueada.`));
        return;
    }

    const time = lista.slice(0, 5);
    const primeiro = time[0];
    exemplo.innerHTML = '<strong></strong> = <span></span>';
    exemplo.querySelector('strong').textContent = `${AGENTES[primeiro.id].nome} ${primeiro.valor}%`;
    exemplo.querySelector('span').textContent =
        `${primeiro.valor} de cada 100 times jogaram com ${AGENTES[primeiro.id].nome}`;

    time.forEach(agente => fileira.appendChild(criarCarta(agente, lista, time)));
}

function criarCarta(item, lista, time) {
    const agente = AGENTES[item.id];
    const carta = criar('li', 'carta');

    const retrato = criar('div', 'carta-retrato');
    if (agente.img) {
        const imagem = criar('img');
        imagem.src = agente.img;
        imagem.alt = '';
        retrato.appendChild(imagem);
    } else {
        retrato.appendChild(criar('span', 'carta-inicial', agente.nome[0]));
    }

    const placa = criar('div', 'carta-placa');
    placa.append(
        criar('span', 'carta-funcao', NOME_FUNCAO[agente.funcao]),
        criar('h4', 'carta-nome', agente.nome),
    );

    const medida = criar('div', 'carta-medida');
    const numero = criar('span', 'carta-num');
    numero.append(String(item.valor), criar('small', '', '%'));
    numero.title = `${item.valor} de cada 100 times jogaram com ${agente.nome}`;
    medida.append(numero, criarContagem(item.valor));

    const subs = criar('div', 'carta-subs');
    subs.appendChild(criar('span', 'subs-rotulo', 'Se já pegaram'));
    const opcoes = substitutos(lista, item, time);
    if (opcoes.length === 0) subs.appendChild(criar('span', 'subs-vazio', 'Sem outra opção nos dados'));
    opcoes.forEach(opcao => {
        const linha = criar('span', 'sub');
        linha.append(
            criarRosto(opcao.id),
            criar('span', 'sub-nome', AGENTES[opcao.id].nome),
            criar('span', 'sub-valor', `${opcao.valor}%`),
        );
        subs.appendChild(linha);
    });

    carta.append(retrato, placa, medida, subs);
    return carta;
}


/* ============================================
   3) QUADRO (todos os mapas lado a lado)
   ============================================ */

function montarQuadro() {
    const tabela = document.getElementById('quadro');
    tabela.innerHTML = '';

    // por mapa: { id: valor } e quem está entre os 5
    const porMapa = MAPAS.map(mapa => {
        const lista = presencaNoMapa(mapa, metaAtual);
        if (!lista) return null;
        return {
            valores: Object.fromEntries(lista.map(a => [a.id, a.valor])),
            top: new Set(lista.slice(0, 5).map(a => a.id)),
        };
    });
    const somaDoAgente = id => porMapa.reduce((soma, d) => soma + (d ? d.valores[id] || 0 : 0), 0);
    const aparece = id => porMapa.some(d => d && (d.valores[id] || 0) >= MINIMO_NO_QUADRO);

    // Cabeçalho: um botão por mapa
    const cabeca = criar('thead');
    const linhaCabeca = criar('tr');
    linhaCabeca.appendChild(criar('th', 'quadro-canto', 'Agente'));
    MAPAS.forEach(mapa => {
        const th = criar('th', 'quadro-mapa');
        th.scope = 'col';
        const botao = criar('button');
        botao.type = 'button';
        botao.dataset.mapa = mapa.nome;
        botao.classList.toggle('ativo', mapa === mapaAtual);
        botao.setAttribute('aria-label', `Abrir ${mapa.nome} na seleção`);
        const imagem = criar('img');
        imagem.src = mapa.imagem;
        imagem.alt = '';
        imagem.loading = 'lazy';
        botao.append(imagem, criar('span', '', mapa.nome));
        botao.addEventListener('click', () => escolherMapa(mapa, { rolar: true }));
        th.appendChild(botao);
        linhaCabeca.appendChild(th);
    });
    cabeca.appendChild(linhaCabeca);
    tabela.appendChild(cabeca);

    // Corpo: agentes agrupados por função, o mais jogado primeiro
    const corpo = criar('tbody');
    Object.entries(FUNCOES).forEach(([funcao, titulo]) => {
        const ids = Object.keys(AGENTES)
            .filter(id => AGENTES[id].funcao === funcao && aparece(id))
            .sort((a, b) => somaDoAgente(b) - somaDoAgente(a));
        if (ids.length === 0) return;

        const grupo = criar('tr', 'quadro-grupo');
        const celulaGrupo = criar('th');
        celulaGrupo.appendChild(criar('span', '', titulo)); // o span fica parado quando o quadro rola
        celulaGrupo.colSpan = MAPAS.length + 1;
        celulaGrupo.scope = 'colgroup';
        grupo.appendChild(celulaGrupo);
        corpo.appendChild(grupo);

        ids.forEach(id => {
            const linha = criar('tr');
            const nome = criar('th', 'quadro-agente');
            nome.scope = 'row';
            nome.append(criarRosto(id), criar('span', '', AGENTES[id].nome));
            linha.appendChild(nome);

            porMapa.forEach((dados, i) => {
                const celula = criar('td');
                if (!dados) {
                    celula.className = 'sem';
                    celula.textContent = '—';
                    celula.title = `${MAPAS[i].nome}: sem dados de campeonato`;
                } else {
                    const valor = dados.valores[id] || 0;
                    celula.style.setProperty('--v', valor);
                    if (dados.top.has(id)) celula.classList.add('top');
                    if (valor < 10) celula.classList.add('fraco');
                    celula.textContent = valor >= 1 ? valor : '·';
                    celula.title = `${AGENTES[id].nome} em ${MAPAS[i].nome}: ${valor}% dos times`;
                }
                linha.appendChild(celula);
            });
            corpo.appendChild(linha);
        });
    });
    tabela.appendChild(corpo);

    const meta = METAS[metaAtual];
    document.getElementById('quadro-fonte').textContent = metaAtual === 'ranqueada'
        ? `Fonte: ${meta.fonte}, ranqueada, ${meta.atualizadoEm}. Aparece quem passa de ${MINIMO_NO_QUADRO}% em algum mapa.`
        : `Fonte: ${meta.fonte} (${meta.atualizadoEm}). Mapas sem campeonato com dados ficam com "—".`;
}


/* ============================================
   4) SELETOR "META" (RANQUEADA | PROFISSIONAL)
   Há um na seleção e outro no quadro; os dois andam juntos.
   ============================================ */

function criarSeletoresMeta() {
    document.querySelectorAll('[data-grupo-meta]').forEach(grupo => {
        Object.entries(METAS).forEach(([chave, meta]) => {
            const botao = criar('button', '', meta.rotulo);
            botao.type = 'button';
            botao.dataset.meta = chave;
            botao.addEventListener('click', () => escolherMeta(chave));
            grupo.appendChild(botao);
        });
    });
}

function escolherMeta(chave) {
    metaAtual = chave;
    try { localStorage.setItem(CHAVE_META, chave); } catch { }

    document.querySelectorAll('[data-grupo-meta] [data-meta]').forEach(botao => {
        const ativo = botao.dataset.meta === chave;
        botao.classList.toggle('active', ativo);
        botao.setAttribute('aria-pressed', ativo);
    });

    preencherPalco();
    montarQuadro();
}


/* ============================================
   INÍCIO
   ============================================ */

// Qual mapa abrir: o do endereço (#lotus), senão o último visto, senão o 1º
function mapaInicial() {
    const doEndereco = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    let salvo = '';
    try { salvo = (localStorage.getItem(CHAVE_MAPA) || '').toLowerCase(); } catch { }
    return MAPAS.find(m => m.nome.toLowerCase() === doEndereco)
        || MAPAS.find(m => m.nome.toLowerCase() === salvo)
        || MAPAS[0];
}

function metaInicial() {
    try {
        const salvo = localStorage.getItem(CHAVE_META);
        if (METAS[salvo]) return salvo;
    } catch { }
    return 'ranqueada';
}

document.getElementById('rotacao-info').textContent =
    `Patch ${ROTACAO.patch} · ${ROTACAO.temporada} · atualizado em ${ROTACAO.atualizadoEm}`;

const listaFora = document.getElementById('fora-rotacao');
FORA_DA_ROTACAO.forEach(nome => listaFora.appendChild(criar('span', 'etiqueta', nome)));

montarFaixaDeMapas();
criarSeletoresMeta();
metaAtual = metaInicial();
escolherMapa(mapaInicial());
escolherMeta(metaAtual);

// Minimapa ampliado
document.getElementById('palco-minimapa').addEventListener('click', () => openMap(mapaAtual.nome, mapaAtual.minimapa));
document.getElementById('mapModal').addEventListener('click', evento => {
    if (evento.target.id === 'mapModal') closeMap();
});
document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') closeMap();
});
