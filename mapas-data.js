/* ============================================
   MAPAS E META DOS AGENTES
   ============================================
   Quando o meta mudar, é só mexer neste arquivo:
   - ROTACAO: dados da rotação competitiva atual
   - METAS: de onde vem cada meta (ranqueada e profissional)
   - MAPAS: os mapas que aparecem na página, na ordem
   - FORA_DA_ROTACAO: nomes dos mapas que saíram

   Em cada mapa:
   - "ranqueada.pick": % de TODAS as escolhas de agente no mapa, para
     cada agente (copie a tabela inteira da fonte). Como cada time tem
     5 agentes diferentes, a página multiplica por 5 para chegar em
     "% dos times que jogaram com o agente".
   - "pro.pick": % dos times profissionais que escolheram o agente
     (já vem nesse formato). Use pro: null quando o mapa não teve
     campeonato com dados.

   Na página:
   - os 5 com a maior % formam o time que mais aparece no mapa
   - "Se já pegaram" = os próximos da mesma função
*/

const ROTACAO = {
    patch: '13.08',
    temporada: 'Temporada 26 · Ato 6',
    atualizadoEm: 'outubro de 2026',
};

// Fonte de cada meta (o seletor "Ranqueada | Profissional" usa isto)
const METAS = {
    ranqueada: {
        rotulo: 'Ranqueada',
        formato: 'escolhas', // pick = % de todas as escolhas (a página faz x5)
        fonte: 'MetaBot.gg',
        url: 'https://metabot.gg/en/valorant',
        atualizadoEm: '22 de outubro de 2026',
    },
    pro: {
        rotulo: 'Profissional',
        formato: 'times',    // pick = % dos times (usa direto)
        fonte: 'VLR.gg',
        url: 'https://www.vlr.gg/event/agents/2766/valorant-champions-2026',
        atualizadoEm: 'outubro de 2026',
    },
};

// Funções, na ordem em que aparecem no quadro
const FUNCOES = {
    duelista: 'Duelistas',
    iniciador: 'Iniciadores',
    controlador: 'Controladores',
    sentinela: 'Sentinelas',
};

// Nome que aparece na tela, imagem e função de cada agente
const AGENTES = {
    astra: { nome: 'Astra', img: 'assets/img-agentes/astra.png', funcao: 'controlador' },
    breach: { nome: 'Breach', img: 'assets/img-agentes/breach.png', funcao: 'iniciador' },
    brimstone: { nome: 'Brimstone', img: 'assets/img-agentes/brimstone.png', funcao: 'controlador' },
    chamber: { nome: 'Chamber', img: 'assets/img-agentes/chamber.png', funcao: 'sentinela' },
    clove: { nome: 'Clove', img: 'assets/img-agentes/clove.png', funcao: 'controlador' },
    cypher: { nome: 'Cypher', img: 'assets/img-agentes/cypher.png', funcao: 'sentinela' },
    deadlock: { nome: 'Deadlock', img: 'assets/img-agentes/deadlock.png', funcao: 'sentinela' },
    fade: { nome: 'Fade', img: 'assets/img-agentes/fade.png', funcao: 'iniciador' },
    gekko: { nome: 'Gekko', img: 'assets/img-agentes/gekko.png', funcao: 'iniciador' },
    harbor: { nome: 'Harbor', img: 'assets/img-agentes/harbor.png', funcao: 'controlador' },
    iso: { nome: 'Iso', img: 'assets/img-agentes/iso.png', funcao: 'duelista' },
    jett: { nome: 'Jett', img: 'assets/img-agentes/jett.png', funcao: 'duelista' },
    kayo: { nome: 'KAY/O', img: 'assets/img-agentes/kayo.png', funcao: 'iniciador' },
    killjoy: { nome: 'Killjoy', img: 'assets/img-agentes/killjoy.png', funcao: 'sentinela' },
    neon: { nome: 'Neon', img: 'assets/img-agentes/neon.png', funcao: 'duelista' },
    omen: { nome: 'Omen', img: 'assets/img-agentes/omen.png', funcao: 'controlador' },
    phoenix: { nome: 'Phoenix', img: 'assets/img-agentes/phoenix.png', funcao: 'duelista' },
    raze: { nome: 'Raze', img: 'assets/img-agentes/raze.png', funcao: 'duelista' },
    reyna: { nome: 'Reyna', img: 'assets/img-agentes/reyna.png', funcao: 'duelista' },
    sage: { nome: 'Sage', img: 'assets/img-agentes/sage.png', funcao: 'sentinela' },
    skye: { nome: 'Skye', img: 'assets/img-agentes/skye.png', funcao: 'iniciador' },
    sova: { nome: 'Sova', img: 'assets/img-agentes/sova.png', funcao: 'iniciador' },
    tejo: { nome: 'Tejo', img: 'assets/img-agentes/tejo.jpg', funcao: 'iniciador' },
    veto: { nome: 'Veto', img: 'assets/img-agentes/veto.png', funcao: 'sentinela' },
    viper: { nome: 'Viper', img: 'assets/img-agentes/viper.png', funcao: 'controlador' },
    vyse: { nome: 'Vyse', img: 'assets/img-agentes/vyse.png', funcao: 'sentinela' },
    miks: { nome: 'Miks', img: null, funcao: 'controlador' }, // sem imagem ainda: aparece a inicial
    waylay: { nome: 'Waylay', img: 'assets/img-agentes/waylay.png', funcao: 'duelista' },
    yoru: { nome: 'Yoru', img: 'assets/img-agentes/yoru.png', funcao: 'duelista' },
};

// Todas as imagens ficam em assets/img-mapas (de onde veio cada uma: CREDITOS.md lá dentro)

const MAPAS = [
    {
        nome: 'Summit',
        selo: 'Novo',
        imagem: 'assets/img-mapas/summit.webp',
        minimapa: 'assets/img-mapas/Summit_minimap.webp',
        ranqueada: {
            escolhas: 23636,
            pick: {
                clove: 15.1, jett: 12.8, fade: 11.9, chamber: 9.3, reyna: 8.5, neon: 7.4,
                cypher: 5.7, phoenix: 5.5, waylay: 3.7, sage: 2.8, sova: 2.6, omen: 2.5,
                yoru: 1.7, raze: 1.3, vyse: 1.2, skye: 1.1, iso: 1.1, deadlock: 0.7,
                tejo: 0.7, astra: 0.6, veto: 0.6, harbor: 0.5, killjoy: 0.5, gekko: 0.4,
                miks: 0.4, kayo: 0.4, viper: 0.3, brimstone: 0.3, breach: 0.2,
            },
        },
        pro: {
            fonte: 'Champions 2026',
            pick: {
                neon: 82, fade: 82, chamber: 68, sage: 53,
                harbor: 44, omen: 41, cypher: 21, phoenix: 18,
            },
        },
    },
    {
        nome: 'Corrode',
        selo: 'Voltou',
        imagem: 'assets/img-mapas/corroid.jpg',
        minimapa: 'assets/img-mapas/Corrode_minimap.webp',
        ranqueada: {
            escolhas: 27112,
            pick: {
                clove: 17.4, fade: 14.4, waylay: 11.2, chamber: 10.5, jett: 7.5, reyna: 7,
                neon: 6.4, yoru: 6.3, vyse: 4.1, omen: 2.5, sova: 2, viper: 1.4,
                phoenix: 1.4, deadlock: 1.3, veto: 1.2, iso: 1, sage: 0.8, cypher: 0.8,
                raze: 0.6, tejo: 0.5, kayo: 0.5, skye: 0.4, astra: 0.3, breach: 0.2,
                harbor: 0.1, brimstone: 0.1, gekko: 0.1, killjoy: 0.1,
            },
        },
        pro: null, // não esteve no Champions 2026 nem nos VCTs com dados
    },
    {
        nome: 'Bind',
        selo: 'Voltou',
        imagem: 'assets/img-mapas/bind.png',
        minimapa: 'assets/img-mapas/Bind_minimap.webp',
        ranqueada: {
            escolhas: 32041,
            pick: {
                clove: 15.8, chamber: 11.8, raze: 8.8, skye: 8.6, jett: 8.1, fade: 6.9,
                yoru: 6.4, reyna: 6.3, waylay: 5.8, neon: 4.2, brimstone: 3.1, cypher: 2.8,
                viper: 2.3, deadlock: 2, phoenix: 1.3, miks: 1, tejo: 0.8, sova: 0.8,
                veto: 0.7, iso: 0.7, sage: 0.5, gekko: 0.3, omen: 0.3, vyse: 0.2,
                killjoy: 0.2, astra: 0.2, kayo: 0.1, breach: 0.1, harbor: 0.1,
            },
        },
        pro: {
            fonte: 'VCT Pacific Stage 1 2026 (poucas partidas)',
            pick: {
                neon: 94, brimstone: 94, viper: 81, skye: 81,
                waylay: 44, raze: 19, chamber: 19, kayo: 13,
            },
        },
    },
    {
        nome: 'Haven',
        imagem: 'assets/img-mapas/haven.png',
        minimapa: 'assets/img-mapas/Haven_minimap.webp',
        ranqueada: {
            escolhas: 67992,
            pick: {
                sova: 16.6, jett: 16.2, clove: 15.2, chamber: 7.5, reyna: 7.2, neon: 6.4,
                phoenix: 6, cypher: 5.1, killjoy: 4.9, omen: 3.8, yoru: 3.2, waylay: 1.9,
                iso: 1.3, miks: 0.8, raze: 0.6, skye: 0.5, sage: 0.5, breach: 0.4,
                fade: 0.3, viper: 0.3, veto: 0.3, brimstone: 0.2, deadlock: 0.2, tejo: 0.2,
                astra: 0.2, kayo: 0.2, vyse: 0.1, gekko: 0.1, harbor: 0.1,
            },
        },
        pro: {
            fonte: 'Champions 2026',
            pick: {
                neon: 83, sova: 78, omen: 72, chamber: 56,
                phoenix: 50, yoru: 44, cypher: 22, fade: 22,
            },
        },
    },
    {
        nome: 'Sunset',
        imagem: 'assets/img-mapas/sunset.webp',
        minimapa: 'assets/img-mapas/Sunset_minimap.webp',
        ranqueada: {
            escolhas: 23181,
            pick: {
                clove: 15.8, sova: 13.6, jett: 10.5, neon: 9.5, chamber: 8.7, reyna: 7.3,
                cypher: 6.1, phoenix: 5.8, raze: 3.9, omen: 2.9, waylay: 2.3, fade: 2.1,
                vyse: 1.9, yoru: 1.7, sage: 1.3, iso: 1.2, deadlock: 1.1, gekko: 0.8,
                veto: 0.7, skye: 0.6, miks: 0.5, breach: 0.5, tejo: 0.3, kayo: 0.3,
                brimstone: 0.2, killjoy: 0.1, viper: 0.1, harbor: 0.1, astra: 0.1,
            },
        },
        pro: {
            fonte: 'Champions 2026',
            pick: {
                omen: 100, neon: 77, fade: 73, chamber: 64,
                cypher: 36, sage: 32, yoru: 32, sova: 23,
            },
        },
    },
    {
        nome: 'Lotus',
        imagem: 'assets/img-mapas/lotus.webp',
        minimapa: 'assets/img-mapas/Lotus_minimap.webp',
        ranqueada: {
            escolhas: 43397,
            pick: {
                clove: 14, fade: 13.9, chamber: 11.7, jett: 11.5, raze: 8.5, neon: 7.4,
                reyna: 6.5, omen: 4, vyse: 3.9, waylay: 3, phoenix: 2.4, iso: 2.1,
                miks: 1.5, killjoy: 1.2, cypher: 1.1, yoru: 1.1, skye: 1, breach: 0.9,
                viper: 0.8, sage: 0.6, sova: 0.6, deadlock: 0.5, tejo: 0.5, veto: 0.4,
                gekko: 0.4, brimstone: 0.2, astra: 0.2, kayo: 0.2, harbor: 0.1,
            },
        },
        pro: {
            fonte: 'Champions 2026',
            pick: {
                omen: 100, fade: 82, viper: 68, neon: 50,
                chamber: 50, raze: 50, vyse: 41, skye: 25,
            },
        },
    },
    {
        nome: 'Abyss',
        imagem: 'assets/img-mapas/abyss.png',
        minimapa: 'assets/img-mapas/Abyss_minimap.webp',
        ranqueada: {
            escolhas: 37132,
            pick: {
                sova: 16.5, jett: 15.5, clove: 14.1, chamber: 13.5, waylay: 7.5, yoru: 6.5,
                reyna: 6.4, astra: 3.3, neon: 3.1, iso: 2.1, omen: 2.1, vyse: 1.9,
                cypher: 1.8, veto: 1.5, phoenix: 0.9, tejo: 0.6, kayo: 0.5, deadlock: 0.5,
                sage: 0.4, harbor: 0.3, raze: 0.3, gekko: 0.2, skye: 0.2, fade: 0.2,
                breach: 0.1, brimstone: 0.1, miks: 0.1, viper: 0.1, killjoy: 0,
            },
        },
        pro: {
            fonte: 'Champions 2026',
            pick: {
                sova: 100, harbor: 81, yoru: 69, waylay: 69,
                astra: 56, omen: 38, neon: 31, jett: 25,
            },
        },
    },
];

const FORA_DA_ROTACAO = ['Ascent', 'Split', 'Pearl', 'Breeze', 'Icebox', 'Fracture'];
