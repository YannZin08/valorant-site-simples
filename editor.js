/* ============================================
   EDITOR DE MIRA
   ============================================
   Como funciona:
   - estado.secoes guarda o código "aberto" em partes (veja lerSecoes no reticula.js)
   - mexer num controle muda uma chave da mira primária (seção P)
   - escreverCodigo() junta tudo de volta no texto do código
   - colar um código no campo faz o caminho contrário: atualiza os controles

   Para adicionar/tirar um controle, mexa na lista GRUPOS abaixo.
*/

const form = document.getElementById('form-mira');
const tituloEditor = document.getElementById('editor-titulo');
const campoNome = document.getElementById('mira-nome');
const campoCodigo = document.getElementById('mira-codigo');
const textoErro = document.getElementById('mira-erro');
const canvasPrevia = document.getElementById('previa-mira');
const caixaControles = document.getElementById('editor-controles');
const botaoSalvar = document.getElementById('btn-salvar-mira');
const botaoCopiarCodigo = document.getElementById('btn-copiar-codigo');
const botaoNovaMira = document.getElementById('btn-nova-mira');
const botaoCancelar = document.getElementById('btn-cancelar');
const botaoPadrao = document.getElementById('btn-padrao');

const CODIGO_PADRAO = '0'; // "0" sozinho = mira padrão do jogo

const estado = {
    secoes: lerSecoes(CODIGO_PADRAO),
    editandoId: null,   // id da sua mira que está sendo editada (null = mira nova)
    codigoValido: true, // false enquanto o campo de código tem um texto inválido
};


/* ============================================
   CONTROLES
   tipo 'faixa' = slider; tipo 'opcao' = liga/desliga
   "so" = só aparece quando aquela chave está ligada
   ============================================ */

// Linhas internas (prefixo 0) e externas (prefixo 1) têm os mesmos controles;
// só mudam os limites (iguais aos do jogo)
function controlesDeLinhas(p, maxComprimento, maxDistancia) {
    return [
        { tipo: 'faixa', chave: p + 'a', rotulo: 'Opacidade', min: 0, max: 1, passo: 0.01 },
        { tipo: 'faixa', chave: p + 'l', rotulo: 'Comprimento', min: 0, max: maxComprimento, passo: 1 },
        { tipo: 'opcao', chave: p + 'g', rotulo: 'Vertical diferente' },
        { tipo: 'faixa', chave: p + 'v', rotulo: 'Vertical', min: 0, max: maxComprimento, passo: 1, so: p + 'g' },
        { tipo: 'faixa', chave: p + 't', rotulo: 'Espessura', min: 0, max: 10, passo: 1 },
        { tipo: 'faixa', chave: p + 'o', rotulo: 'Distância', min: 0, max: maxDistancia, passo: 1 },
        { tipo: 'opcao', chave: p + 'm', rotulo: 'Erro de movimento' },
        { tipo: 'opcao', chave: p + 'f', rotulo: 'Erro de disparo' },
    ];
}

const GRUPOS = [
    {
        titulo: 'Contorno', liga: 'h', controles: [
            { tipo: 'faixa', chave: 'o', rotulo: 'Opacidade', min: 0, max: 1, passo: 0.01 },
            { tipo: 'faixa', chave: 't', rotulo: 'Espessura', min: 1, max: 6, passo: 1 },
        ],
    },
    {
        titulo: 'Ponto central', liga: 'd', controles: [
            { tipo: 'faixa', chave: 'a', rotulo: 'Opacidade', min: 0, max: 1, passo: 0.01 },
            { tipo: 'faixa', chave: 'z', rotulo: 'Espessura', min: 1, max: 6, passo: 1 },
        ],
    },
    { titulo: 'Linhas internas', liga: '0b', controles: controlesDeLinhas('0', 20, 20) },
    { titulo: 'Linhas externas', liga: '1b', controles: controlesDeLinhas('1', 10, 40) },
];


/* ============================================
   MONTAR OS CONTROLES NA TELA
   ============================================ */

function criarControles() {
    caixaControles.appendChild(criarGrupoCor());
    GRUPOS.forEach(grupo => caixaControles.appendChild(criarGrupo(grupo)));
}

function criarGrupo(grupo) {
    const secao = document.createElement('section');
    secao.className = 'editor-grupo';

    // Topo: título + liga/desliga do grupo inteiro
    const topo = document.createElement('div');
    topo.className = 'editor-grupo-topo';
    const titulo = document.createElement('h3');
    titulo.textContent = grupo.titulo;
    topo.append(titulo, criarOpcao(grupo.liga, `Mostrar ${grupo.titulo.toLowerCase()}`, true));

    // Corpo: some quando o grupo está desligado
    const corpo = document.createElement('div');
    corpo.className = 'editor-grupo-corpo';
    corpo.dataset.so = grupo.liga;

    let linhaDeOpcoes = null; // opções seguidas ficam na mesma linha
    grupo.controles.forEach(controle => {
        if (controle.tipo === 'faixa') {
            linhaDeOpcoes = null;
            corpo.appendChild(criarFaixa(controle));
            return;
        }
        if (!linhaDeOpcoes) {
            linhaDeOpcoes = document.createElement('div');
            linhaDeOpcoes.className = 'editor-opcoes';
            corpo.appendChild(linhaDeOpcoes);
        }
        linhaDeOpcoes.appendChild(criarOpcao(controle.chave, controle.rotulo));
    });

    secao.append(topo, corpo);
    return secao;
}

function criarFaixa({ chave, rotulo, min, max, passo, so }) {
    const linha = document.createElement('div');
    linha.className = 'ajuste';
    if (so) linha.dataset.so = so;

    const id = `aj-${chave}`;
    linha.innerHTML = `<label for="${id}"></label><input type="range" id="${id}"><output for="${id}"></output>`;
    linha.querySelector('label').textContent = rotulo;

    const faixa = linha.querySelector('input');
    faixa.min = min;
    faixa.max = max;
    faixa.step = passo;
    faixa.dataset.chave = chave;
    faixa.addEventListener('input', () => mudarValor(chave, Number(faixa.value)));
    return linha;
}

// Liga/desliga (checkbox com cara de interruptor)
function criarOpcao(chave, rotulo, esconderTexto = false) {
    const label = document.createElement('label');
    label.className = 'opcao';

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.setAttribute('role', 'switch');
    caixa.id = `aj-${chave}`;
    caixa.dataset.chave = chave;
    caixa.addEventListener('change', () => mudarValor(chave, caixa.checked ? 1 : 0));

    const texto = document.createElement('span');
    texto.textContent = rotulo;
    if (esconderTexto) texto.className = 'so-leitor'; // só leitores de tela "ouvem"

    label.append(caixa, texto);
    return label;
}

function criarGrupoCor() {
    const secao = document.createElement('section');
    secao.className = 'editor-grupo';
    secao.innerHTML = `
        <div class="editor-grupo-topo"><h3>Cor</h3></div>
        <div class="cores" role="group" aria-label="Cor da mira"></div>
        <label class="campo-hex">
            <span>Hex</span>
            <input type="text" id="aj-hex" maxlength="7" spellcheck="false" autocomplete="off">
        </label>`;

    // As 8 cores prontas do jogo
    const cores = secao.querySelector('.cores');
    CORES_JOGO.forEach((cor, indice) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'cor-opcao';
        botao.style.setProperty('--amostra', '#' + cor.hex);
        botao.title = cor.nome;
        botao.setAttribute('aria-label', cor.nome);
        botao.dataset.cor = indice;
        botao.addEventListener('click', () => mudarValor('c', indice));
        cores.appendChild(botao);
    });

    // Cor personalizada (abre o seletor de cor do navegador)
    const personalizada = document.createElement('input');
    personalizada.type = 'color';
    personalizada.id = 'aj-cor';
    personalizada.className = 'cor-opcao cor-personalizada';
    personalizada.title = 'Cor personalizada';
    personalizada.setAttribute('aria-label', 'Cor personalizada');
    personalizada.addEventListener('input', () => mudarCorPersonalizada(personalizada.value));
    cores.appendChild(personalizada);

    // Campo hex: digitar uma cor como #FF0000 também vira cor personalizada
    const hex = secao.querySelector('#aj-hex');
    hex.addEventListener('input', () => {
        const valor = hex.value.trim().replace(/^#/, '');
        if (/^[0-9a-f]{6}$/i.test(valor)) mudarCorPersonalizada(valor, hex);
    });

    return secao;
}


/* ============================================
   MUDAR VALORES
   ============================================ */

function lerValor(chave) {
    return valorDaChave(estado.secoes.P, chave);
}

function mudarValor(chave, valor) {
    const p = estado.secoes.P;
    definirChave(p, chave, valor);

    const prefixo = chave[0]; // '0' = linhas internas, '1' = externas
    // Comprimento "travado": o vertical acompanha o horizontal (igual ao jogo)
    if (chave === prefixo + 'l' && lerValor(prefixo + 'g') !== 1) {
        definirChave(p, prefixo + 'v', valor);
    }
    // Ao ligar ou desligar o "vertical diferente", o vertical começa igual ao horizontal
    if (chave === prefixo + 'g') {
        definirChave(p, prefixo + 'v', lerValor(prefixo + 'l'));
    }

    depoisDeMudar();
}

function mudarCorPersonalizada(hex, origem) {
    const p = estado.secoes.P;
    const alfa = (p.u || PADROES_P.u).slice(6, 8) || 'FF'; // mantém a transparência que já tinha
    definirChave(p, 'u', hex.replace('#', '') + alfa);
    definirChave(p, 'c', COR_PERSONALIZADA);
    depoisDeMudar(origem);
}

// Depois de qualquer mudança nos controles: reescreve o código e redesenha
function depoisDeMudar(origem) {
    campoCodigo.value = escreverCodigo(estado.secoes);
    estado.codigoValido = true;
    textoErro.textContent = '';
    atualizarControles(origem);
    atualizarPreviaEditor();
}

// Colar/digitar no campo de código: se for válido, os controles seguem o código
function aoDigitarCodigo() {
    const texto = campoCodigo.value.trim();
    const secoes = texto ? lerSecoes(texto) : null;

    if (!secoes) {
        estado.codigoValido = false;
        textoErro.textContent = texto
            ? 'Esse código não parece ser de uma mira do Valorant.'
            : 'Cole um código ou ajuste a mira nos controles abaixo.';
        atualizarPreviaEditor(); // a prévia continua mostrando a última mira válida
        return;
    }

    estado.secoes = secoes;
    estado.codigoValido = true;
    textoErro.textContent = '';
    atualizarControles();
    atualizarPreviaEditor();
}


/* ============================================
   ATUALIZAR A TELA
   ============================================ */

// Coloca cada controle na posição do código atual
function atualizarControles(origem) {
    caixaControles.querySelectorAll('input[data-chave]').forEach(campo => {
        const valor = lerValor(campo.dataset.chave);
        if (campo.type === 'checkbox') {
            campo.checked = valor === 1;
        } else {
            campo.value = valor;
            campo.nextElementSibling.textContent = Number(campo.step) < 1 ? valor.toFixed(2) : String(valor);
        }
    });

    // Esconde o que depende de algo desligado (grupo desligado, vertical igual ao horizontal)
    caixaControles.querySelectorAll('[data-so]').forEach(elemento => {
        elemento.hidden = lerValor(elemento.dataset.so) !== 1;
    });

    // Cor
    const indiceCor = lerValor('c');
    caixaControles.querySelectorAll('[data-cor]').forEach(botao => {
        botao.setAttribute('aria-pressed', Number(botao.dataset.cor) === indiceCor);
    });
    const personalizada = document.getElementById('aj-cor');
    personalizada.classList.toggle('ativa', indiceCor === COR_PERSONALIZADA);
    personalizada.value = '#' + (estado.secoes.P.u || PADROES_P.u).slice(0, 6).toLowerCase();

    const hex = document.getElementById('aj-hex');
    if (origem !== hex) hex.value = montarMira(estado.secoes.P).cor.hex; // não atrapalha quem está digitando
}

function atualizarPreviaEditor() {
    // O canvas guarda o código: assim ele também redesenha quando muda fundo/zoom (miras.js)
    canvasPrevia.dataset.codigo = escreverCodigo(estado.secoes);
    desenharMira(canvasPrevia, montarMira(estado.secoes.P), visual);

    canvasPrevia.parentElement.classList.toggle('travada', estado.codigoValido); // visor fecha na mira
    botaoSalvar.disabled = !estado.codigoValido;
    botaoCopiarCodigo.disabled = !estado.codigoValido;
}


/* ============================================
   ABRIR, FECHAR E SALVAR
   ============================================ */

/**
 * Abre o editor.
 * - sem item: mira nova, começando da mira padrão do jogo
 * - com uma mira sua: edita ela mesma
 * - com uma mira do site: cria uma cópia sua a partir dela
 */
function abrirEditor(item = null) {
    const ehSua = Boolean(item && item.doNavegador);
    estado.editandoId = ehSua ? item.id : null;
    estado.secoes = (item && lerSecoes(item.codigo)) || lerSecoes(CODIGO_PADRAO);

    campoNome.value = !item ? '' : ehSua ? item.nome : `${item.nome} (editada)`;
    tituloEditor.textContent = ehSua ? 'Editar mira' : 'Nova mira';
    botaoSalvar.textContent = ehSua ? 'Salvar alterações' : 'Salvar na lista';

    form.hidden = false; // primeiro aparece (o canvas só tem tamanho visível)...
    botaoNovaMira.setAttribute('aria-expanded', 'true');
    depoisDeMudar();     // ...depois escreve o código, posiciona os controles e desenha

    if (item) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fecharEditor() {
    form.hidden = true;
    botaoNovaMira.setAttribute('aria-expanded', 'false');
    estado.editandoId = null;
    textoErro.textContent = '';
}

function salvarMira(evento) {
    evento.preventDefault(); // não recarrega a página
    if (!estado.codigoValido) return;

    const codigo = escreverCodigo(estado.secoes);
    if (miraJaExiste(codigo, estado.editandoId)) {
        textoErro.textContent = 'Essa mira já está na lista.';
        return;
    }

    const minhas = carregarMinhasMiras();
    const nome = campoNome.value.trim();
    const editada = minhas.find(mira => mira.id === estado.editandoId);
    let id;

    if (editada) {
        editada.codigo = codigo;
        editada.nome = nome || editada.nome;
        id = editada.id;
    } else {
        id = Date.now();
        minhas.push({ id, nome: nome || `Mira ${MIRAS_FIXAS.length + minhas.length + 1}`, codigo });
    }

    if (!salvarMinhasMiras(minhas)) {
        textoErro.textContent = 'Não foi possível salvar: o navegador está bloqueando o armazenamento.';
        return;
    }

    fecharEditor();
    renderizarMiras();
    destacarMira(id);
}


/* ============================================
   INÍCIO
   ============================================ */

criarControles();

campoCodigo.addEventListener('input', aoDigitarCodigo);
form.addEventListener('submit', salvarMira);
botaoNovaMira.addEventListener('click', () => (form.hidden ? abrirEditor() : fecharEditor()));
botaoCancelar.addEventListener('click', fecharEditor);
botaoCopiarCodigo.addEventListener('click', () => copiarTexto(escreverCodigo(estado.secoes), botaoCopiarCodigo));

// "Voltar ao padrão" volta só a mira primária; configurações de ADS/sniper continuam
botaoPadrao.addEventListener('click', () => {
    estado.secoes.P = {};
    depoisDeMudar();
});
