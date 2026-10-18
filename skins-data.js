/* ============================================
   SKINS
   ============================================
   Para adicionar uma skin, copie uma linha e troque os dados.
   - categoria: 'vandal', 'phantom' ou 'corpo' (corpo a corpo)
   - preco: em VP, só o número (2475 vira "2.475 VP" na tela)
   - video (opcional): link do gameplay. Sem ele, o botão abre
     uma busca no YouTube pelo nome da skin.
*/

const CATEGORIAS_SKINS = {
    vandal: 'Vandal',
    phantom: 'Phantom',
    corpo: 'Corpo a corpo',
};

const SKINS = [
    { nome: 'Vandal Ancifogo', categoria: 'vandal', preco: 2475, imagem: 'assets/img-skins/ancifogo.webp', video: 'https://youtu.be/DNeu4WIFAfw' },
    { nome: 'Phantom Oni', categoria: 'phantom', preco: 1775, imagem: 'assets/img-skins/phantom-oni.webp', video: 'https://youtu.be/SL1DIDZnFhg' },
    { nome: 'Karambit Sublime', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/karambit-sublime.webp', video: 'https://youtu.be/1W1q4TjQlB4' },
    { nome: 'Vandal CYRAX', categoria: 'vandal', preco: 2475, imagem: 'assets/img-skins/vandal-cyrax_valorant_full_skin_2099480.webp' },
    { nome: 'Vandal Floretérea', categoria: 'vandal', preco: 2475, imagem: 'assets/img-skins/vandal-floreterea_valorant_full_skin_2616718.webp' },
    { nome: 'Kuronami no Yaiba', categoria: 'corpo', preco: 5350, imagem: 'assets/img-skins/kuronami-faca.webp' },
    { nome: 'Vandal Kuronami', categoria: 'vandal', preco: 2375, imagem: 'assets/img-skins/vandal-kuronami.webp' },
    { nome: 'Conjuradora de Evori', categoria: 'corpo', preco: 4950, imagem: 'assets/img-skins/conjuradora-de-evori.webp' },
    { nome: 'Vandal Asas Oníricas de Evori', categoria: 'vandal', preco: 2475, imagem: 'assets/img-skins/vandal-asas-oniricas-de-evori.webp' },
    { nome: 'Phantom Prelúdio do Caos', categoria: 'phantom', preco: 1775, imagem: 'assets/img-skins/phantom-preludio-do-caos.webp' },
    { nome: 'Phantom Netuno', categoria: 'phantom', preco: 1775, imagem: 'assets/img-skins/phantom-netuno.webp' },
    { nome: 'Phantom Araxys', categoria: 'phantom', preco: 1775, imagem: 'assets/img-skins/phantom-araxys.webp' },
    { nome: 'Phantom Nocturnum', categoria: 'phantom', preco: 2175, imagem: 'assets/img-skins/phantom-nocturnum.webp' },
    { nome: 'Phantom Soberania', categoria: 'phantom', preco: 2175, imagem: 'assets/img-skins/phantom-soberania.webp' },
    { nome: 'Vaga-lume RGX 11z Pro', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/vaga-lume-rgx.webp' },
    { nome: 'Lâmina RGX 11z Pro', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/lamina-rgx-11z-pro.webp' },
    { nome: 'Karambit RGX 11z Pro', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/karambit-rgx-11z-pro.webp' },
    { nome: 'Faca Eletrizante', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/faca-eletrizante.webp' },
    { nome: 'Karambit Íon', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/karambit-ion.webp' },
    { nome: 'Karambit Saqueador', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/karambit-saqueador.webp' },
    { nome: 'Phantom RGX 11z Pro', categoria: 'phantom', preco: 2175, imagem: 'assets/img-skins/phantom-rgx-11z-pro.webp' },
    { nome: 'Leque Celestial', categoria: 'corpo', preco: 3550, imagem: 'assets/img-skins/leque-celestial.webp' },
    { nome: 'Faca Saqueador', categoria: 'corpo', preco: 3550, imagem: 'assets/img-skins/faca-saqueador.webp' },
    { nome: 'Faca Xenocaçador', categoria: 'corpo', preco: 3550, imagem: 'assets/img-skins/faca-xenocacador.webp' },
    { nome: 'Leque Laminado Floretérea', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/leque-laminado.webp' },
    { nome: 'Leque Laminado Cyrax', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/leque-laminado-cyrax.webp' },
    { nome: 'Karambit Minima', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/karambit-minima_valorant.webp' },
    { nome: 'Luvas Splash', categoria: 'corpo', preco: 4350, imagem: 'assets/img-skins/luvas-splashx.webp' },
    { nome: 'Vandal Proteção Fásica', categoria: 'vandal', preco: 2475, imagem: 'assets/img-skins/vandal-protecao-fasica.webp' },
    { nome: 'Vandal EX.O', categoria: 'vandal', preco: 2475, imagem: 'assets/img-skins/vandal-exo.webp' },
    { nome: 'Vandal Singularidade', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-singularidade.webp' },
    { nome: 'Vandal Primordium', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-primordium.webp' },
    { nome: 'Vandal ZERØFANG', categoria: 'vandal', preco: 1775, imagem: 'assets/img-skins/vandal-zerofang.webp' },
    { nome: 'Vandal Sobrecarga', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-sobrecarga.webp' },
    { nome: 'Vandal Herói Valoroso', categoria: 'vandal', preco: 1775, imagem: 'assets/img-skins/vandal-heroi-valoroso.webp' },
    { nome: 'Vandal Imperium', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-imperium.webp' },
    { nome: 'Vandal Oni', categoria: 'vandal', preco: 1775, imagem: 'assets/img-skins/vandal-oni.webp' },
    { nome: 'Vandal Araxys', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-araxys4.webp' },
    { nome: 'Vandal Íon', categoria: 'vandal', preco: 1775, imagem: 'assets/img-skins/vandal-ion.webp' },
    { nome: 'Vandal ChronoVoid', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-chronovoid.webp' },
    { nome: 'Vandal Prelúdio do Caos', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-preludio-do-caos.webp' },
    { nome: 'Vandal Netuno', categoria: 'vandal', preco: 1775, imagem: 'assets/img-skins/vandal-netuno.webp' },
    { nome: 'Vandal Vingança de Gaia', categoria: 'vandal', preco: 1775, imagem: 'assets/img-skins/vandal-vinganca-de-gaia.webp' },
    { nome: 'Vandal RGX 11z Pro', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-rgx-11z-pro.webp' },
    { nome: 'Vandal Sentinelas da Luz', categoria: 'vandal', preco: 2175, imagem: 'assets/img-skins/vandal-sentinelas-da-luz.webp' },
];
