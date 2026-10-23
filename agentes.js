/* ============================================
   PÁGINA DE AGENTES
   Monta os cards dos mapas a partir do mapas-data.js.
   O seletor "Meta" troca entre ranqueada (padrão) e profissional.
   ============================================ */

const gridMapas = document.getElementById('mapas-grid');
const CHAVE_META = 'valorant-meta-escolhido';

let metaAtual = 'ranqueada';


/* ============================================
   1) CALCULAR O META DE UM MAPA
   ============================================ */

/**
 * Recebe os números de um mapa ({ clove: 15.1, jett: 12.8, ... }) e devolve,
 * para cada função: os agentes do meta e a 2ª opção.
 * "barra" é o valor que vai na barra (0 a 100):
 *  - ranqueada: fatia do agente dentro da função
 *  - profissional: % dos times que escolheram o agente
 */
function calcularMeta(pick, meta) {
    return Object.keys(FUNCOES).map(funcao => {
        const agentes = Object.entries(pick)
            .filter(([id]) => AGENTES[id] && AGENTES[id].funcao === funcao)
            .map(([id, valor]) => ({ id, valor }))
            .sort((a, b) => b.valor - a.valor);

        if (meta.medida === 'funcao') {
            const totalDaFuncao = agentes.reduce((soma, a) => soma + a.valor, 0);
            agentes.forEach(a => { a.barra = totalDaFuncao ? (a.valor / totalDaFuncao) * 100 : 0; });
        } else {
            agentes.forEach(a => { a.barra = a.valor; });
        }

        // Meta: quem passa do mínimo (o 1º da função sempre entra)
        const acimaDoMinimo = agentes.filter(a => a.barra >= meta.minimo);
        const doMeta = acimaDoMinimo.length > 0 ? acimaDoMinimo : agentes.slice(0, 1);

        return {
            funcao,
            doMeta,
            segunda: agentes[doMeta.length] || null, // o próximo depois do meta
        };
    });
}


/* ============================================
   2) CARDS
   ============================================ */

const ICONE_MINIMAPA = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />
    </svg>`;

function criarCardMapa(mapa) {
    const card = document.createElement('article');
    card.className = 'cartao mapa-card';
    card.innerHTML = `
        <div class="mapa-capa">
            <img alt="" loading="lazy">
            <h3 class="mapa-nome"></h3>
            <button type="button" class="mapa-minimapa">${ICONE_MINIMAPA}<span>Minimapa</span></button>
        </div>
        <div class="mapa-corpo">
            <p class="mapa-fonte"></p>
            <div class="funcoes"></div>
        </div>
    `;

    const capa = card.querySelector('.mapa-capa');
    const imagem = capa.querySelector('img');
    imagem.src = mapa.imagem;
    // Se a imagem não carregar, fica só o fundo com o nome (em vez de um ícone quebrado)
    imagem.addEventListener('error', () => capa.classList.add('sem-imagem'));

    card.querySelector('.mapa-nome').textContent = mapa.nome;

    const botao = capa.querySelector('.mapa-minimapa');
    botao.setAttribute('aria-label', `Ver minimapa de ${mapa.nome}`);
    botao.addEventListener('click', () => openMap(mapa.nome, mapa.minimapa));

    if (mapa.selo) {
        const selo = document.createElement('span');
        selo.className = mapa.selo === 'Novo' ? 'selo selo-cheio' : 'selo';
        selo.textContent = mapa.selo;
        capa.appendChild(selo);
    }

    preencherFuncoes(card, mapa);
    return card;
}

// Coloca no card as 4 funções com o meta escolhido (ranqueada ou pro)
function preencherFuncoes(card, mapa) {
    const fonte = card.querySelector('.mapa-fonte');
    const caixa = card.querySelector('.funcoes');
    caixa.innerHTML = '';

    const dados = metaAtual === 'ranqueada' ? mapa.ranqueada : mapa.pro;
    if (!dados) {
        fonte.textContent = 'Sem dados de campeonato';
        const aviso = document.createElement('p');
        aviso.className = 'mapa-sem-dados';
        aviso.textContent = `${mapa.nome} não esteve nos campeonatos de 2026 que têm dados. Veja o meta da ranqueada.`;
        caixa.appendChild(aviso);
        return;
    }

    fonte.textContent = metaAtual === 'ranqueada'
        ? `${dados.escolhas.toLocaleString('pt-BR')} escolhas na ranqueada`
        : dados.fonte;

    calcularMeta(dados.pick, METAS[metaAtual]).forEach(grupo => {
        caixa.appendChild(criarBlocoFuncao(grupo, mapa));
    });
}

function criarBlocoFuncao({ funcao, doMeta, segunda }, mapa) {
    const bloco = document.createElement('section');
    bloco.className = 'funcao';

    const titulo = document.createElement('h4');
    titulo.className = 'funcao-nome';
    titulo.textContent = FUNCOES[funcao];
    bloco.appendChild(titulo);

    if (doMeta.length === 0) {
        const vazio = document.createElement('p');
        vazio.className = 'funcao-vazia';
        vazio.textContent = 'Nenhum agente desta função entre os mais escolhidos.';
        bloco.appendChild(vazio);
        return bloco;
    }

    const lista = document.createElement('ul');
    lista.className = 'funcao-lista';
    doMeta.forEach(agente => lista.appendChild(criarLinhaAgente(agente, funcao, mapa, false)));
    if (segunda) lista.appendChild(criarLinhaAgente(segunda, funcao, mapa, true));
    bloco.appendChild(lista);
    return bloco;
}

function criarLinhaAgente({ id, valor, barra }, funcao, mapa, ehSegunda) {
    const agente = AGENTES[id];
    const porcentagem = Math.round(barra);

    const linha = document.createElement('li');
    linha.className = ehSegunda ? 'agente-linha segunda' : 'agente-linha';
    linha.title = metaAtual === 'ranqueada'
        ? `${agente.nome}: ${porcentagem}% dos ${FUNCOES[funcao].toLowerCase()} escolhidos em ${mapa.nome} (${formatarDecimal(valor)} de todas as escolhas)`
        : `${agente.nome}: escolhido por ${porcentagem}% dos times em ${mapa.nome}`;

    // Foto (ou a inicial, para agente sem imagem no site)
    let foto;
    if (agente.img) {
        foto = document.createElement('img');
        foto.src = agente.img;
        foto.alt = '';
        foto.loading = 'lazy';
    } else {
        foto = document.createElement('span');
        foto.className = 'agente-sem-foto';
        foto.textContent = agente.nome[0];
    }
    foto.classList.add('agente-foto');

    const dadosAgente = document.createElement('div');
    dadosAgente.className = 'agente-dados';
    dadosAgente.innerHTML = `
        <div class="agente-topo">
            <span class="agente-nome"></span>
            <span class="agente-valor"></span>
        </div>
        <div class="carga"><span></span></div>
    `;
    dadosAgente.querySelector('.agente-nome').textContent = agente.nome;
    dadosAgente.querySelector('.agente-valor').textContent = `${porcentagem}%`;
    dadosAgente.querySelector('.carga').style.setProperty('--valor', porcentagem);

    if (ehSegunda) {
        const tag = document.createElement('span');
        tag.className = 'agente-tag';
        tag.textContent = '2ª opção';
        dadosAgente.querySelector('.agente-nome').after(tag);
    }

    linha.append(foto, dadosAgente);
    return linha;
}

// 15.1 -> "15,1%"
function formatarDecimal(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function renderizarMapas() {
    gridMapas.innerHTML = '';
    MAPAS.forEach(mapa => gridMapas.appendChild(criarCardMapa(mapa)));
}


/* ============================================
   3) LEGENDA (como ler as barras)
   ============================================ */

// Pega um exemplo real dos dados: o agente que mais domina uma função no 1º mapa
function exemploDaLegenda(chave) {
    const mapa = MAPAS.find(m => (chave === 'ranqueada' ? m.ranqueada : m.pro));
    const dados = chave === 'ranqueada' ? mapa.ranqueada : mapa.pro;
    const grupos = calcularMeta(dados.pick, METAS[chave]).filter(g => g.doMeta.length > 0);
    const maior = grupos.reduce((a, b) => (b.doMeta[0].barra > a.doMeta[0].barra ? b : a));
    const agente = maior.doMeta[0];
    const nome = AGENTES[agente.id].nome;

    return chave === 'ranqueada'
        ? `em ${mapa.nome}, ${Math.round(agente.barra)}% dos ${FUNCOES[maior.funcao].toLowerCase()} escolhidos são ${nome}.`
        : `em ${mapa.nome}, ${Math.round(agente.barra)}% dos times escolheram ${nome}.`;
}

function montarLegenda(chave) {
    const meta = METAS[chave];
    const legenda = document.getElementById('meta-legenda');
    const regra = chave === 'ranqueada' ? `${meta.minimo}% ou mais da função` : `${meta.minimo}% ou mais dos times`;
    const oQueMostra = chave === 'ranqueada'
        ? 'A barra mostra a fatia de cada agente dentro da sua função'
        : 'A barra mostra quantos times profissionais escolheram o agente';

    legenda.innerHTML = `
        <p><strong>${oQueMostra}.</strong> Exemplo: <span class="legenda-exemplo"></span></p>
        <div class="legenda-amostras">
            <span class="legenda-amostra"><span class="carga" style="--valor: 60"><span></span></span>Meta: ${regra}</span>
            <span class="legenda-amostra segunda"><span class="carga" style="--valor: 30"><span></span></span>2ª opção: o próximo mais escolhido</span>
        </div>
        <p class="legenda-fonte">Fonte: <a target="_blank" rel="noopener"></a> (${meta.atualizadoEm}).</p>
    `;
    legenda.querySelector('.legenda-exemplo').textContent = exemploDaLegenda(chave);
    const link = legenda.querySelector('a');
    link.href = meta.url;
    link.textContent = meta.fonte;
}


/* ============================================
   4) SELETOR "META" (RANQUEADA | PROFISSIONAL)
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

    montarLegenda(chave);
    // Só troca o conteúdo dos cards (as imagens dos mapas não recarregam)
    gridMapas.querySelectorAll('.mapa-card').forEach((card, i) => preencherFuncoes(card, MAPAS[i]));
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
