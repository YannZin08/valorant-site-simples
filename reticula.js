/* ============================================
   RETÍCULA — lê o código de mira do Valorant
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

// Valores padrão das linhas (são os da mira padrão do jogo)
const PADRAO_INTERNAS = { opacidade: 0.8, comprimento: 6, espessura: 2, distancia: 3 };
const PADRAO_EXTERNAS = { opacidade: 0.35, comprimento: 2, espessura: 2, distancia: 10 };


/* ============================================
   1) LER O CÓDIGO
   ============================================ */

/**
 * Transforma o texto do código em um objeto com as configurações da mira primária.
 * Retorna null se o código for inválido.
 */
function lerCodigoMira(codigo) {
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
        if (!chaveValida(chave) || !valorValido(chave, valor)) return null;

        secoes[secaoAtual][chave] = valor;
        i++; // pula o valor, que já foi lido
    }

    return montarMira(secoes.P);
}

// Chaves são uma letra minúscula, às vezes com 0 ou 1 na frente (ex.: "c", "0l", "1b")
function chaveValida(chave) {
    return /^[01]?[a-z]$/.test(chave);
}

// "u" é uma cor em hexadecimal; o resto são números
function valorValido(chave, valor) {
    if (valor === undefined || valor === '') return false;
    if (chave === 'u') return /^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(valor);
    return /^-?\d*\.?\d+$/.test(valor);
}

function montarMira(p) {
    // Helpers: pegam o valor do código ou usam o padrão
    const numero = (chave, padrao) => (p[chave] !== undefined ? Number(p[chave]) : padrao);
    const ligado = (chave, padrao) => (p[chave] !== undefined ? p[chave] === '1' : padrao);

    // Cor: "c;N" escolhe uma cor pronta; "c;8" usa a personalizada do "u"
    const indiceCor = numero('c', 0);
    let cor;
    if (indiceCor === COR_PERSONALIZADA && p.u) {
        cor = { nome: 'Personalizada', ...hexParaRgb(p.u) };
    } else {
        const corJogo = CORES_JOGO[indiceCor] || CORES_JOGO[0];
        cor = { nome: corJogo.nome, ...hexParaRgb(corJogo.hex) };
    }

    return {
        cor,
        contorno: {
            ligado: ligado('h', true),
            espessura: numero('t', 1),
            opacidade: numero('o', 0.5),
        },
        ponto: {
            ligado: ligado('d', false),
            tamanho: numero('z', 2),
            opacidade: numero('a', 1),
        },
        internas: lerLinhas(numero, ligado, '0', PADRAO_INTERNAS),
        externas: lerLinhas(numero, ligado, '1', PADRAO_EXTERNAS),
    };
}

// Linhas internas usam o prefixo "0" e externas o prefixo "1"
function lerLinhas(numero, ligado, prefixo, padrao) {
    const comprimento = numero(prefixo + 'l', padrao.comprimento);
    // "g;1" = comprimento vertical separado do horizontal (cadeado aberto no jogo)
    const verticalSeparado = ligado(prefixo + 'g', false);

    return {
        ligado: ligado(prefixo + 'b', true),
        opacidade: numero(prefixo + 'a', padrao.opacidade),
        comprimento,
        comprimentoVertical: verticalSeparado ? numero(prefixo + 'v', comprimento) : comprimento,
        espessura: numero(prefixo + 't', padrao.espessura),
        distancia: numero(prefixo + 'o', padrao.distancia),
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

/** Pequeno resumo para mostrar no card (ex.: ["Ponto", "Linhas internas"]) */
function resumoDaMira(mira) {
    const itens = [];
    if (mira.ponto.ligado && mira.ponto.opacidade > 0) itens.push('Ponto');
    if (mira.internas.ligado) itens.push('Linhas internas');
    if (mira.externas.ligado) itens.push('Linhas externas');
    if (mira.contorno.ligado) itens.push('Contorno');
    return itens;
}


/* ============================================
   2) TRANSFORMAR A MIRA EM RETÂNGULOS
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
   3) DESENHAR NO CANVAS
   ============================================ */

/**
 * Desenha o fundo e a mira no canvas.
 * opcoes.zoom: 1 = tamanho real (1 pixel do jogo = 1 pixel da tela)
 * opcoes.fundo: 'parede' | 'clara' | 'escura' | 'mapa'
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
   4) FUNDOS "DE JOGO"
   ============================================ */

const FUNDOS = {
    parede: { cor: [119, 115, 106], ruido: 16 }, // parecida com o Campo de Treino
    clara: { cor: [206, 200, 187], ruido: 12 },
    escura: { cor: [33, 37, 43], ruido: 10 },
    mapa: { imagem: 'assets/img-mapas/haven.png' },
};

const cacheFundos = {};

function desenharFundo(ctx, largura, altura, nome) {
    const fundo = FUNDOS[nome] || FUNDOS.parede;

    // Fundo com imagem de mapa: enquanto carrega, usa a parede
    if (fundo.imagem) {
        const img = carregarImagemFundo(fundo.imagem);
        if (img.complete && img.naturalWidth) {
            const escala = Math.max(largura / img.naturalWidth, altura / img.naturalHeight);
            const w = img.naturalWidth * escala;
            const h = img.naturalHeight * escala;
            ctx.drawImage(img, (largura - w) / 2, (altura - h) / 2, w, h);
            return;
        }
        return desenharFundo(ctx, largura, altura, 'parede');
    }

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

// Carrega a imagem do mapa uma vez; quando terminar, avisa a página para redesenhar
function carregarImagemFundo(src) {
    if (cacheFundos[src]) return cacheFundos[src];

    const img = new Image();
    img.onload = () => document.dispatchEvent(new Event('reticula:fundo-pronto'));
    img.src = src;
    cacheFundos[src] = img;
    return img;
}
