/* ============================================
   RETÍCULA — lê e escreve o código de mira do Valorant
   e desenha a mira dentro de um <canvas>
   ============================================

   Como funciona um código de mira:

     0;P;c;5;h;0;0l;3;0o;2;0a;1;1b;0
     │ │ └┬┘ └┬┘ └─────────┬───────┘
     │ │  │   │            └─ linhas internas (prefixo 0) e externas (prefixo 1)
     │ │  │   └─ h = contorno, 0 = desligado
     │ │  └─ c = cor, 5 = ciano
     │ └─ "P" abre a seção da mira PRIMÁRIA ("A" = mira de ADS, "S" = sniper)
     └─ versão do código (sempre 0)

   Depois do "0" vem uma lista de pares chave;valor.
   Tudo que NÃO aparece no código usa o valor padrão do jogo.
*/

// Cores prontas do jogo — o número que vem em "c;N"
const CORES_JOGO = [
    { nome: 'Branco', hex: 'FFFFFF' },
    { nome: 'Verde', hex: '00FF00' },
    { nome: 'Verde-amarelado', hex: '7FFF00' },
    { nome: 'Amarelo-esverdeado', hex: 'DFFF00' },
    { nome: 'Amarelo', hex: 'FFFF00' },
    { nome: 'Ciano', hex: '00FFFF' },
    { nome: 'Rosa', hex: 'FF00FF' },
    { nome: 'Vermelho', hex: 'FF0000' },
];
const COR_PERSONALIZADA = 8; // "c;8" = usa a cor do "u;RRGGBBAA"

// Valor padrão de cada chave da mira primária (é a mira padrão do jogo).
// Chave que NÃO aparece no código = usa o valor daqui.
const PADROES_P = {
    c: 0, u: 'FFFFFFFF',                 // cor e cor personalizada
    h: 1, t: 1, o: 0.5,                  // contorno: ligado, espessura, opacidade
    d: 0, z: 2, a: 1,                    // ponto central: ligado, espessura, opacidade
    // linhas internas (0) e externas (1):
    // b = ligadas, a = opacidade, l = comprimento, v = vertical, g = vertical separado,
    // t = espessura, o = distância, m = erro de movimento, f = erro de disparo
    '0b': 1, '0a': 0.8, '0l': 6, '0v': 6, '0g': 0, '0t': 2, '0o': 3, '0m': 0, '0f': 1,
    '1b': 1, '1a': 0.35, '1l': 2, '1v': 2, '1g': 0, '1t': 2, '1o': 10, '1m': 1, '1f': 1,
};

// Ordem em que o jogo escreve as chaves (o editor segue a mesma)
const ORDEM_CHAVES = [
    'c', 'u', 'h', 't', 'o', 'd', 'b', 'z', 'a', 'f', 's', 'm',
    '0b', '0t', '0l', '0v', '0g', '0o', '0a', '0m', '0f', '0s', '0e',
    '1b', '1t', '1l', '1v', '1g', '1o', '1a', '1m', '1f', '1s', '1e',
];


/* ============================================
   1) LER O CÓDIGO
   ============================================ */

/**
 * Separa o código nas seções: geral, P (primária), A (ADS) e S (sniper).
 * Cada seção vira um objeto { chave: 'valor' }, com o valor em texto.
 * Retorna null se o código for inválido.
 */
function lerSecoes(codigo) {
    const partes = String(codigo).replace(/\s+/g, '').split(';');
    if (partes[partes.length - 1] === '') partes.pop(); // aceita ";" sobrando no final

    if (partes[0] !== '0') return null; // todo código começa com "0"

    const secoes = { geral: {}, P: {}, A: {}, S: {} };
    let secaoAtual = 'geral';

    for (let i = 1; i < partes.length; i++) {
        const parte = partes[i];

        // "P", "A" e "S" não têm valor: só mudam a seção atual
        if (parte === 'P' || parte === 'A' || parte === 'S') {
            secaoAtual = parte;
            continue;
        }

        const chave = parte;
        const valor = partes[i + 1];
        if (!chaveValida(chave) || !valorValido(chave, valor, secaoAtual)) return null;

        secoes[secaoAtual][chave] = valor;
        i++; // pula o valor, que já foi lido
    }

    return secoes;
}

/** Lê o código e devolve as configurações da mira primária (ou null se for inválido) */
function lerCodigoMira(codigo) {
    const secoes = lerSecoes(codigo);
    return secoes ? montarMira(secoes.P) : null;
}

// Chaves são uma letra minúscula, às vezes com 0 ou 1 na frente (ex.: "c", "0l", "1b")
function chaveValida(chave) {
    return /^[01]?[a-z]$/.test(chave);
}

// Valores são números, menos as cores em hexadecimal:
// "u" (cor personalizada) e, na mira de sniper (S), chaves como "t;000000FF"
function valorValido(chave, valor, secao) {
    if (valor === undefined || valor === '') return false;
    const ehNumero = /^-?\d*\.?\d+$/.test(valor);
    const ehCor = /^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(valor);
    if (chave === 'u') return ehCor;
    if (secao === 'S') return ehNumero || ehCor;
    return ehNumero;
}

// Valor de uma chave da seção P: o que está no código ou o padrão do jogo
function valorDaChave(p, chave) {
    return p[chave] !== undefined ? Number(p[chave]) : PADROES_P[chave];
}

function montarMira(p) {
    const numero = chave => valorDaChave(p, chave);
    const ligado = chave => numero(chave) === 1;

    // Cor: "c;N" escolhe uma cor pronta; "c;8" usa a personalizada do "u"
    const indiceCor = numero('c');
    let cor;
    if (indiceCor === COR_PERSONALIZADA) {
        cor = { nome: 'Personalizada', ...hexParaRgb(p.u || PADROES_P.u) };
    } else {
        const corJogo = CORES_JOGO[indiceCor] || CORES_JOGO[0];
        cor = { nome: corJogo.nome, ...hexParaRgb(corJogo.hex) };
    }

    return {
        cor,
        contorno: { ligado: ligado('h'), espessura: numero('t'), opacidade: numero('o') },
        ponto: { ligado: ligado('d'), tamanho: numero('z'), opacidade: numero('a') },
        internas: lerLinhas(numero, ligado, '0'),
        externas: lerLinhas(numero, ligado, '1'),
    };
}

// Linhas internas usam o prefixo "0" e externas o prefixo "1"
function lerLinhas(numero, ligado, prefixo) {
    const comprimento = numero(prefixo + 'l');
    // "g;1" = comprimento vertical separado do horizontal (cadeado aberto no jogo)
    const verticalSeparado = ligado(prefixo + 'g');

    return {
        ligado: ligado(prefixo + 'b'),
        opacidade: numero(prefixo + 'a'),
        comprimento,
        comprimentoVertical: verticalSeparado ? numero(prefixo + 'v') : comprimento,
        espessura: numero(prefixo + 't'),
        distancia: numero(prefixo + 'o'),
    };
}

// "00FFFFFF" -> { r: 0, g: 255, b: 255, alfa: 1 }
function hexParaRgb(hex) {
    return {
        hex: '#' + hex.slice(0, 6).toUpperCase(),
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        alfa: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
}


/* ============================================
   2) ESCREVER O CÓDIGO (caminho inverso, usado pelo editor)
   ============================================ */

// 0.80000001 -> "0.8"; 6 -> "6"
function formatarNumero(valor) {
    return String(Number(Number(valor).toFixed(3)));
}

/**
 * Muda uma chave da mira primária (seção P).
 * Se o valor for o padrão do jogo, a chave sai do código — o jogo faz igual.
 */
function definirChave(p, chave, valor) {
    const texto = chave === 'u' ? String(valor).toUpperCase() : formatarNumero(valor);
    const ehPadrao = chave === 'u' ? texto === PADROES_P.u : Number(texto) === PADROES_P[chave];
    if (ehPadrao) delete p[chave];
    else p[chave] = texto;
}

/** Junta as seções de volta no texto do código, na ordem que o jogo usa */
function escreverCodigo(secoes) {
    const partes = ['0'];
    const posicao = chave => {
        const indice = ORDEM_CHAVES.indexOf(chave);
        return indice === -1 ? ORDEM_CHAVES.length : indice; // chave desconhecida vai pro fim
    };
    const adicionar = (secao, ordenar) => {
        const chaves = Object.keys(secao);
        if (ordenar) chaves.sort((x, y) => posicao(x) - posicao(y));
        chaves.forEach(chave => partes.push(chave, secao[chave]));
    };

    adicionar(secoes.geral, false);
    ['P', 'A', 'S'].forEach(nome => {
        if (Object.keys(secoes[nome]).length === 0) return; // seção vazia não aparece
        partes.push(nome);
        // Só a P (que o editor muda) é reordenada; A e S ficam como vieram
        adicionar(secoes[nome], nome === 'P');
    });
    return partes.join(';');
}

/**
 * Versão "arrumada" do código, para comparar duas miras
 * (ignora espaços e a ordem das chaves). Retorna null se for inválido.
 */
function codigoCanonico(codigo) {
    const secoes = lerSecoes(codigo);
    return secoes ? escreverCodigo(secoes) : null;
}


/* ============================================
   3) TRANSFORMAR A MIRA EM RETÂNGULOS
   ============================================
   Toda mira do Valorant é feita só de retângulos:
   4 braços internos, 4 externos e o ponto do meio.
   As medidas aqui estão em "pixels do jogo" (em 1080p),
   com o centro da tela no (0, 0).
*/
function montarPecas(mira) {
    const pecas = [];

    for (const linhas of [mira.internas, mira.externas]) {
        if (!linhas.ligado || linhas.espessura <= 0) continue;

        const esp = linhas.espessura;
        const dist = linhas.distancia;
        const horiz = linhas.comprimento;
        const vert = linhas.comprimentoVertical;
        const opacidade = linhas.opacidade;

        if (horiz > 0) {
            pecas.push({ x: dist, y: -esp / 2, larg: horiz, alt: esp, opacidade });          // direita
            pecas.push({ x: -dist - horiz, y: -esp / 2, larg: horiz, alt: esp, opacidade }); // esquerda
        }
        if (vert > 0) {
            pecas.push({ x: -esp / 2, y: -dist - vert, larg: esp, alt: vert, opacidade });   // cima
            pecas.push({ x: -esp / 2, y: dist, larg: esp, alt: vert, opacidade });           // baixo
        }
    }

    if (mira.ponto.ligado && mira.ponto.tamanho > 0) {
        const tam = mira.ponto.tamanho;
        pecas.push({ x: -tam / 2, y: -tam / 2, larg: tam, alt: tam, opacidade: mira.ponto.opacidade });
    }

    return pecas;
}


/* ============================================
   4) DESENHAR NO CANVAS
   ============================================ */

/**
 * Desenha o fundo e a mira no canvas.
 * opcoes.zoom: 1 = tamanho real (1 pixel do jogo = 1 pixel da tela)
 * opcoes.fundo: 'parede' | 'clara' | 'escura'
 */
function desenharMira(canvas, mira, opcoes = {}) {
    const zoom = opcoes.zoom || 2;
    const fundo = opcoes.fundo || 'parede';

    // O canvas precisa ter o tamanho real em pixels da tela (inclusive em tela retina)
    const dpr = window.devicePixelRatio || 1;
    const largura = Math.round(canvas.clientWidth * dpr);
    const altura = Math.round(canvas.clientHeight * dpr);
    if (!largura || !altura) return;
    if (canvas.width !== largura) canvas.width = largura;
    if (canvas.height !== altura) canvas.height = altura;

    const ctx = canvas.getContext('2d');
    desenharFundo(ctx, largura, altura, fundo);
    if (!mira) return;

    // Escala inteira = pixels nítidos. Com zoom, usamos escala par
    // para linhas de espessura ímpar ficarem bem centralizadas.
    let escala = Math.max(1, Math.round(zoom * dpr));
    if (zoom > 1 && escala % 2 === 1) escala++;

    const centroX = Math.floor(largura / 2);
    const centroY = Math.floor(altura / 2);

    // Converte um retângulo do jogo (+ uma borda extra) para pixels do canvas
    const paraTela = (peca, borda = 0) => {
        const x0 = Math.floor(centroX + (peca.x - borda) * escala);
        const y0 = Math.floor(centroY + (peca.y - borda) * escala);
        const x1 = Math.floor(centroX + (peca.x + peca.larg + borda) * escala);
        const y1 = Math.floor(centroY + (peca.y + peca.alt + borda) * escala);
        return [x0, y0, x1 - x0, y1 - y0];
    };

    const pecas = montarPecas(mira);

    // 1º: contorno preto (fica por baixo de tudo).
    // Desenhamos só a "moldura" em volta da peça, sem pintar embaixo dela.
    const { contorno } = mira;
    if (contorno.ligado && contorno.espessura > 0 && contorno.opacidade > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${contorno.opacidade})`;
        for (const peca of pecas) {
            ctx.beginPath();
            ctx.rect(...paraTela(peca, contorno.espessura));
            ctx.rect(...paraTela(peca));
            ctx.fill('evenodd'); // evenodd = pinta só a área entre os dois retângulos
        }
    }

    // 2º: as peças com a cor da mira
    const { r, g, b, alfa } = mira.cor;
    for (const peca of pecas) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${peca.opacidade * alfa})`;
        ctx.fillRect(...paraTela(peca));
    }
}


/* ============================================
   5) FUNDOS "DE JOGO"
   ============================================ */

const FUNDOS = {
    parede: { cor: [119, 115, 106], ruido: 16 }, // parecida com o Campo de Treino
    clara: { cor: [206, 200, 187], ruido: 12 },
    escura: { cor: [33, 37, 43], ruido: 10 },
};

const cacheFundos = {};

function desenharFundo(ctx, largura, altura, nome) {
    if (!FUNDOS[nome]) nome = 'parede';
    const fundo = FUNDOS[nome];

    // Fundo liso com "granulado" para parecer uma superfície do jogo
    ctx.fillStyle = ctx.createPattern(criarTextura(nome, fundo), 'repeat');
    ctx.fillRect(0, 0, largura, altura);

    // Sombra leve nas bordas (dá profundidade)
    const sombra = ctx.createRadialGradient(
        largura / 2, altura / 2, Math.min(largura, altura) * 0.2,
        largura / 2, altura / 2, Math.max(largura, altura) * 0.75
    );
    sombra.addColorStop(0, 'rgba(0, 0, 0, 0)');
    sombra.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = sombra;
    ctx.fillRect(0, 0, largura, altura);
}

// Cria (uma vez só) um quadrado 256x256 com ruído, que é repetido no fundo
function criarTextura(nome, fundo) {
    if (cacheFundos[nome]) return cacheFundos[nome];

    const tamanho = 256;
    const textura = document.createElement('canvas');
    textura.width = textura.height = tamanho;
    const ctx = textura.getContext('2d');
    const pixels = ctx.createImageData(tamanho, tamanho);

    let semente = 42; // aleatório "fixo": a textura sai sempre igual
    const aleatorio = () => (semente = (semente * 16807) % 2147483647) / 2147483647;

    for (let i = 0; i < pixels.data.length; i += 4) {
        const variacao = (aleatorio() - 0.5) * fundo.ruido;
        pixels.data[i] = fundo.cor[0] + variacao;
        pixels.data[i + 1] = fundo.cor[1] + variacao;
        pixels.data[i + 2] = fundo.cor[2] + variacao;
        pixels.data[i + 3] = 255;
    }
    ctx.putImageData(pixels, 0, 0);

    cacheFundos[nome] = textura;
    return textura;
}
