/* ============================================
   FUNÇÕES USADAS EM MAIS DE UMA PÁGINA
   ============================================ */

/**
 * Copia um texto e mostra "✓ Copiado!" no botão por 2 segundos.
 * Se não der para copiar, o botão avisa em vez de abrir um alert.
 */
function copiarTexto(texto, botao) {
    // Guarda o texto original só uma vez (evita "travar" em "Copiado!" com cliques rápidos)
    if (!botao.dataset.textoOriginal) botao.dataset.textoOriginal = botao.textContent;

    const mostrar = (mensagem, classe) => {
        botao.textContent = mensagem;
        botao.classList.add(classe);
        clearTimeout(botao._espera);
        botao._espera = setTimeout(() => {
            botao.textContent = botao.dataset.textoOriginal;
            botao.classList.remove(classe);
        }, 2000);
    };

    copiarParaAreaDeTransferencia(texto)
        .then(() => mostrar('✓ Copiado!', 'copied'))
        .catch(() => mostrar('Não deu para copiar', 'falhou'));
}

// Tenta o jeito moderno; se o navegador bloquear, usa o jeito antigo (textarea escondido)
function copiarParaAreaDeTransferencia(texto) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(texto).catch(() => copiarComTextarea(texto));
    }
    return copiarComTextarea(texto);
}

function copiarComTextarea(texto) {
    return new Promise((resolver, rejeitar) => {
        const area = document.createElement('textarea');
        area.value = texto;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const copiou = document.execCommand('copy');
        area.remove();
        copiou ? resolver() : rejeitar();
    });
}


/* ============================================
   MINIMAPA (página de agentes)
   ============================================ */

function openMap(name, image) {
    const imagem = document.getElementById('mapImage');
    const aviso = document.getElementById('mapAviso');

    document.getElementById('mapTitle').innerText = name;
    imagem.hidden = false;
    aviso.hidden = true;
    // Se o minimapa não carregar, mostra um aviso em vez da imagem quebrada
    imagem.onerror = () => {
        imagem.hidden = true;
        aviso.hidden = false;
    };
    imagem.alt = `Minimapa de ${name}`;
    imagem.src = image;
    document.getElementById('mapModal').classList.add('active');
}

function closeMap() {
    document.getElementById('mapModal').classList.remove('active');
}
