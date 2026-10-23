/* ============================================
   MAPAS E MELHORES AGENTES
   ============================================
   Quando o meta mudar, é só mexer neste arquivo:
   - ROTACAO: dados da rotação competitiva atual
   - METAS: de onde vem cada tipo de meta (ranqueada e profissional)
   - MAPAS: os mapas que aparecem na página, na ordem
   - FORA_DA_ROTACAO: nomes dos mapas que saíram

   Em cada mapa:
   - "ranqueada": os 10 agentes mais escolhidos na ranqueada.
     "pick" = % de todas as escolhas de agente naquele mapa
     (ex.: 15 = de cada 100 agentes escolhidos, 15 foram esse).
     "escolhas" = quantas escolhas de agente entraram na conta.
   - "pro": agentes mais escolhidos em campeonato.
     "pick" = % dos times profissionais que escolheram o agente.
     Use null quando o mapa não teve partidas de campeonato.

   A página separa os agentes por função e mostra, em cada função,
   os que têm pelo menos "minimo"% (em METAS) — e sempre o 1º da função.
*/

const ROTACAO = {
    patch: '13.08',
    temporada: 'Temporada 26 · Ato 6',
    atualizadoEm: 'outubro de 2026',
};

// Textos e fontes de cada meta (aparecem embaixo do seletor "Ranqueada | Profissional")
const METAS = {
    ranqueada: {
        rotulo: 'Ranqueada',
        minimo: 5, // aparece quem tem pelo menos 5% das escolhas no mapa
        legenda: 'O que os jogadores mais estão escolhendo na ranqueada (todos os elos e regiões), separado por função. A porcentagem é a fatia de todas as escolhas de agente no mapa; aparecem os agentes com pelo menos 5% e sempre o mais escolhido de cada função.',
        fonte: 'MetaBot.gg',
        url: 'https://metabot.gg/en/valorant',
        atualizadoEm: '22 de outubro de 2026',
    },
    pro: {
        rotulo: 'Profissional',
        minimo: 25, // aparece quem foi escolhido por pelo menos 25% dos times
        legenda: 'O que os times profissionais escolheram nos campeonatos de 2026, separado por função. A porcentagem é quantos times escolheram o agente no mapa; aparecem os agentes com pelo menos 25% e sempre o mais escolhido de cada função.',
        fonte: 'VLR.gg',
        url: 'https://www.vlr.gg/event/agents/2766/valorant-champions-2026',
        atualizadoEm: 'outubro de 2026',
    },
};

// Funções, na ordem em que aparecem nos cards
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
            agentes: [
                { id: 'clove', pick: 15.1 },
                { id: 'jett', pick: 12.8 },
                { id: 'fade', pick: 11.9 },
                { id: 'chamber', pick: 9.3 },
                { id: 'reyna', pick: 8.5 },
                { id: 'neon', pick: 7.4 },
                { id: 'cypher', pick: 5.7 },
                { id: 'phoenix', pick: 5.5 },
                { id: 'waylay', pick: 3.7 },
                { id: 'sage', pick: 2.8 },
            ],
        },
        pro: {
            fonte: 'Champions 2026',
            agentes: [
                { id: 'neon', pick: 82 },
                { id: 'fade', pick: 82 },
                { id: 'chamber', pick: 68 },
                { id: 'sage', pick: 53 },
                { id: 'harbor', pick: 44 },
                { id: 'omen', pick: 41 },
                { id: 'cypher', pick: 21 },
                { id: 'phoenix', pick: 18 },
            ],
        },
    },
    {
        nome: 'Corrode',
        selo: 'Voltou',
        imagem: 'assets/img-mapas/corroid.jpg',
        minimapa: 'assets/img-mapas/Corrode_minimap.webp',
        ranqueada: {
            escolhas: 27112,
            agentes: [
                { id: 'clove', pick: 17.4 },
                { id: 'fade', pick: 14.4 },
                { id: 'waylay', pick: 11.2 },
                { id: 'chamber', pick: 10.5 },
                { id: 'jett', pick: 7.5 },
                { id: 'reyna', pick: 7.0 },
                { id: 'neon', pick: 6.4 },
                { id: 'yoru', pick: 6.3 },
                { id: 'vyse', pick: 4.1 },
                { id: 'omen', pick: 2.5 },
            ],
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
            agentes: [
                { id: 'clove', pick: 15.8 },
                { id: 'chamber', pick: 11.8 },
                { id: 'raze', pick: 8.8 },
                { id: 'skye', pick: 8.6 },
                { id: 'jett', pick: 8.1 },
                { id: 'fade', pick: 6.9 },
                { id: 'yoru', pick: 6.4 },
                { id: 'reyna', pick: 6.3 },
                { id: 'waylay', pick: 5.8 },
                { id: 'neon', pick: 4.2 },
            ],
        },
        pro: {
            fonte: 'VCT Pacific Stage 1 2026 (poucas partidas)',
            agentes: [
                { id: 'neon', pick: 94 },
                { id: 'brimstone', pick: 94 },
                { id: 'viper', pick: 81 },
                { id: 'skye', pick: 81 },
                { id: 'waylay', pick: 44 },
                { id: 'raze', pick: 19 },
                { id: 'chamber', pick: 19 },
                { id: 'kayo', pick: 13 },
            ],
        },
    },
    {
        nome: 'Haven',
        imagem: 'assets/img-mapas/haven.png',
        minimapa: 'assets/img-mapas/Haven_minimap.webp',
        ranqueada: {
            escolhas: 67992,
            agentes: [
                { id: 'sova', pick: 16.6 },
                { id: 'jett', pick: 16.2 },
                { id: 'clove', pick: 15.2 },
                { id: 'chamber', pick: 7.5 },
                { id: 'reyna', pick: 7.2 },
                { id: 'neon', pick: 6.4 },
                { id: 'phoenix', pick: 6.0 },
                { id: 'cypher', pick: 5.1 },
                { id: 'killjoy', pick: 4.9 },
                { id: 'omen', pick: 3.8 },
            ],
        },
        pro: {
            fonte: 'Champions 2026',
            agentes: [
                { id: 'neon', pick: 83 },
                { id: 'sova', pick: 78 },
                { id: 'omen', pick: 72 },
                { id: 'chamber', pick: 56 },
                { id: 'phoenix', pick: 50 },
                { id: 'yoru', pick: 44 },
                { id: 'cypher', pick: 22 },
                { id: 'fade', pick: 22 },
            ],
        },
    },
    {
        nome: 'Sunset',
        imagem: 'assets/img-mapas/sunset.webp',
        minimapa: 'assets/img-mapas/Sunset_minimap.webp',
        ranqueada: {
            escolhas: 23181,
            agentes: [
                { id: 'clove', pick: 15.8 },
                { id: 'sova', pick: 13.6 },
                { id: 'jett', pick: 10.5 },
                { id: 'neon', pick: 9.5 },
                { id: 'chamber', pick: 8.7 },
                { id: 'reyna', pick: 7.3 },
                { id: 'cypher', pick: 6.1 },
                { id: 'phoenix', pick: 5.8 },
                { id: 'raze', pick: 3.9 },
                { id: 'omen', pick: 2.9 },
            ],
        },
        pro: {
            fonte: 'Champions 2026',
            agentes: [
                { id: 'omen', pick: 100 },
                { id: 'neon', pick: 77 },
                { id: 'fade', pick: 73 },
                { id: 'chamber', pick: 64 },
                { id: 'cypher', pick: 36 },
                { id: 'sage', pick: 32 },
                { id: 'yoru', pick: 32 },
                { id: 'sova', pick: 23 },
            ],
        },
    },
    {
        nome: 'Lotus',
        imagem: 'assets/img-mapas/lotus.webp',
        minimapa: 'assets/img-mapas/Lotus_minimap.webp',
        ranqueada: {
            escolhas: 43397,
            agentes: [
                { id: 'clove', pick: 14.0 },
                { id: 'fade', pick: 13.9 },
                { id: 'chamber', pick: 11.7 },
                { id: 'jett', pick: 11.5 },
                { id: 'raze', pick: 8.5 },
                { id: 'neon', pick: 7.4 },
                { id: 'reyna', pick: 6.5 },
                { id: 'omen', pick: 4.0 },
                { id: 'vyse', pick: 3.9 },
                { id: 'waylay', pick: 3.0 },
            ],
        },
        pro: {
            fonte: 'Champions 2026',
            agentes: [
                { id: 'omen', pick: 100 },
                { id: 'fade', pick: 82 },
                { id: 'viper', pick: 68 },
                { id: 'neon', pick: 50 },
                { id: 'chamber', pick: 50 },
                { id: 'raze', pick: 50 },
                { id: 'vyse', pick: 41 },
                { id: 'skye', pick: 25 },
            ],
        },
    },
    {
        nome: 'Abyss',
        imagem: 'assets/img-mapas/abyss.png',
        minimapa: 'assets/img-mapas/Abyss_minimap.webp',
        ranqueada: {
            escolhas: 37132,
            agentes: [
                { id: 'sova', pick: 16.5 },
                { id: 'jett', pick: 15.5 },
                { id: 'clove', pick: 14.1 },
                { id: 'chamber', pick: 13.5 },
                { id: 'waylay', pick: 7.5 },
                { id: 'yoru', pick: 6.5 },
                { id: 'reyna', pick: 6.4 },
                { id: 'astra', pick: 3.3 },
                { id: 'neon', pick: 3.1 },
                { id: 'iso', pick: 2.1 },
            ],
        },
        pro: {
            fonte: 'Champions 2026',
            agentes: [
                { id: 'sova', pick: 100 },
                { id: 'harbor', pick: 81 },
                { id: 'yoru', pick: 69 },
                { id: 'waylay', pick: 69 },
                { id: 'astra', pick: 56 },
                { id: 'omen', pick: 38 },
                { id: 'neon', pick: 31 },
                { id: 'jett', pick: 25 },
            ],
        },
    },
];

const FORA_DA_ROTACAO = ['Ascent', 'Split', 'Pearl', 'Breeze', 'Icebox', 'Fracture'];
