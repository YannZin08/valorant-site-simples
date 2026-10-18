/* ============================================
   MAPAS E MELHORES AGENTES
   ============================================
   Quando o meta mudar, é só mexer neste arquivo:
   - ROTACAO: dados da rotação competitiva atual
   - MAPAS: os mapas que aparecem na página, na ordem
   - FORA_DA_ROTACAO: nomes dos mapas que saíram

   Em cada mapa, "agentes" está em ordem de importância.
   "pick" = % de partidas pro em que o agente foi escolhido
   naquele mapa (deixe sem "pick" quando não tiver o número).
*/

const ROTACAO = {
    patch: '13.08',
    temporada: 'Temporada 26 · Ato 6',
    atualizadoEm: 'outubro de 2026',
};

// Nome que aparece na tela + caminho da imagem de cada agente
const AGENTES = {
    astra: { nome: 'Astra', img: 'assets/img-agentes/astra.png' },
    breach: { nome: 'Breach', img: 'assets/img-agentes/breach.png' },
    brimstone: { nome: 'Brimstone', img: 'assets/img-agentes/brimstone.png' },
    chamber: { nome: 'Chamber', img: 'assets/img-agentes/chamber.png' },
    clove: { nome: 'Clove', img: 'assets/img-agentes/clove.png' },
    cypher: { nome: 'Cypher', img: 'assets/img-agentes/cypher.png' },
    deadlock: { nome: 'Deadlock', img: 'assets/img-agentes/deadlock.png' },
    fade: { nome: 'Fade', img: 'assets/img-agentes/fade.png' },
    gekko: { nome: 'Gekko', img: 'assets/img-agentes/gekko.png' },
    harbor: { nome: 'Harbor', img: 'assets/img-agentes/harbor.png' },
    iso: { nome: 'Iso', img: 'assets/img-agentes/iso.png' },
    jett: { nome: 'Jett', img: 'assets/img-agentes/jett.png' },
    kayo: { nome: 'KAY/O', img: 'assets/img-agentes/kayo.png' },
    killjoy: { nome: 'Killjoy', img: 'assets/img-agentes/killjoy.png' },
    neon: { nome: 'Neon', img: 'assets/img-agentes/neon.png' },
    omen: { nome: 'Omen', img: 'assets/img-agentes/omen.png' },
    phoenix: { nome: 'Phoenix', img: 'assets/img-agentes/phoenix.png' },
    raze: { nome: 'Raze', img: 'assets/img-agentes/raze.png' },
    reyna: { nome: 'Reyna', img: 'assets/img-agentes/reyna.png' },
    sage: { nome: 'Sage', img: 'assets/img-agentes/sage.png' },
    skye: { nome: 'Skye', img: 'assets/img-agentes/skye.png' },
    sova: { nome: 'Sova', img: 'assets/img-agentes/sova.png' },
    tejo: { nome: 'Tejo', img: 'assets/img-agentes/tejo.jpg' },
    veto: { nome: 'Veto', img: 'assets/img-agentes/veto.png' },
    viper: { nome: 'Viper', img: 'assets/img-agentes/viper.png' },
    vyse: { nome: 'Vyse', img: 'assets/img-agentes/vyse.png' },
    waylay: { nome: 'Waylay', img: 'assets/img-agentes/waylay.png' },
    yoru: { nome: 'Yoru', img: 'assets/img-agentes/yoru.png' },
};

// Imagens do Summit ainda não estão na pasta assets: vêm do valorant-api.com
const SUMMIT_API = 'https://media.valorant-api.com/maps/756da597-416b-c0f2-f47b-afbdf28670bc';

const MAPAS = [
    {
        nome: 'Summit',
        selo: 'Novo',
        imagem: `${SUMMIT_API}/splash.png`,
        minimapa: `${SUMMIT_API}/displayicon.png`,
        fonte: 'Champions 2026 (pro)',
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
    {
        nome: 'Corrode',
        selo: 'Voltou',
        imagem: 'assets/img-mapas/corroid.jpg',
        minimapa: 'assets/img-mapas/corrode.jpg',
        fonte: 'Ranqueada (fora do campeonato de 2026)',
        agentes: [
            { id: 'neon' },
            { id: 'fade' },
            { id: 'omen' },
            { id: 'viper' },
            { id: 'clove' },
            { id: 'vyse' },
            { id: 'sova' },
            { id: 'yoru' },
        ],
    },
    {
        nome: 'Bind',
        selo: 'Voltou',
        imagem: 'assets/img-mapas/bind.png',
        minimapa: 'assets/img-mapas/Bind_minimap.webp',
        fonte: 'VCT Pacific Stage 1 2026 (pro, poucas partidas)',
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
    {
        nome: 'Haven',
        imagem: 'assets/img-mapas/haven.png',
        minimapa: 'assets/img-mapas/Haven_minimap.webp',
        fonte: 'Champions 2026 (pro)',
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
    {
        nome: 'Sunset',
        imagem: 'assets/img-mapas/sunset.png',
        minimapa: 'https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/displayicon.png',
        fonte: 'Champions 2026 (pro)',
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
    {
        nome: 'Lotus',
        imagem: 'assets/img-mapas/lotus.png',
        minimapa: 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/displayicon.png',
        fonte: 'Champions 2026 (pro)',
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
    {
        nome: 'Abyss',
        imagem: 'assets/img-mapas/abyss.png',
        minimapa: 'assets/img-mapas/Abyss_minimap.webp',
        fonte: 'Champions 2026 (pro)',
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
];

const FORA_DA_ROTACAO = ['Ascent', 'Split', 'Pearl', 'Breeze', 'Icebox', 'Fracture'];
