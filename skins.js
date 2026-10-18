/* ============================================
   PÁGINA DE SKINS
   Monta os cards a partir do skins-data.js e faz o filtro
   ============================================ */

const gridSkins = document.getElementById('skins-grid');
const filtros = document.getElementById('filtros-skins');
const contagemSkins = document.getElementById('skins-contagem');

let filtroAtual = 'todas';

// 2475 -> "2.475"
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR');
}

// Sem vídeo próprio, o botão abre uma busca no YouTube pela skin
function linkGameplay(skin) {
    return skin.video || `https://www.youtube.com/results?search_query=${encodeURIComponent(`Valorant ${skin.nome} skin`)}`;
}

function criarCardSkin(skin) {
    const card = document.createElement('article');
    card.className = 'cartao skin-card';
    card.innerHTML = `
        <div class="skin-imagem">
            <img loading="lazy">
        </div>
        <div class="skin-corpo">
            <h3 class="skin-nome"></h3>
            <div class="skin-rodape">
                <span class="skin-preco"><strong></strong> VP</span>
                <a class="botao botao-secundario botao-pequeno" target="_blank" rel="noopener">Gameplay ↗</a>
            </div>
        </div>
    `;

    const img = card.querySelector('img');
    img.src = skin.imagem;
    img.alt = skin.nome;
    card.querySelector('.skin-nome').textContent = skin.nome;
    card.querySelector('.skin-preco strong').textContent = formatarPreco(skin.preco);

    const link = card.querySelector('a');
    link.href = linkGameplay(skin);
    link.setAttribute('aria-label', `Ver gameplay da ${skin.nome} (abre em nova aba)`);

    return card;
}

function renderizarSkins() {
    const lista = filtroAtual === 'todas'
        ? SKINS
        : SKINS.filter(skin => skin.categoria === filtroAtual);

    gridSkins.innerHTML = '';
    lista.forEach(skin => gridSkins.appendChild(criarCardSkin(skin)));

    contagemSkins.textContent = lista.length === 1 ? '1 skin' : `${lista.length} skins`;

    filtros.querySelectorAll('button').forEach(botao => {
        const ativo = botao.dataset.filtro === filtroAtual;
        botao.classList.toggle('active', ativo);
        botao.setAttribute('aria-pressed', ativo);
    });
}

// Botões de filtro: "Todas" + uma para cada categoria do skins-data.js
function criarFiltros() {
    const opcoes = { todas: 'Todas', ...CATEGORIAS_SKINS };
    Object.entries(opcoes).forEach(([valor, rotulo]) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.dataset.filtro = valor;
        botao.textContent = rotulo;
        botao.addEventListener('click', () => {
            filtroAtual = valor;
            renderizarSkins();
        });
        filtros.appendChild(botao);
    });
}

criarFiltros();
renderizarSkins();
