/* ============================================
   BACKUP DAS MIRAS
   Exportar: baixa um arquivo .json com as SUAS miras.
   Importar: lê esse arquivo (ou um .txt com um código por linha)
   e adiciona as miras que ainda não estão na lista.
   ============================================ */

const botaoExportar = document.getElementById('btn-exportar');
const botaoImportar = document.getElementById('btn-importar');
const arquivoBackup = document.getElementById('arquivo-backup');
const aviso = document.getElementById('aviso-miras');

const TAMANHO_MAXIMO = 1024 * 1024; // 1 MB: um backup de miras é bem menor que isso

// Mensagem embaixo da barra (some sozinha depois de alguns segundos)
let esperaAviso;
function mostrarAviso(texto, tipo = 'ok') {
    aviso.textContent = texto;
    aviso.classList.toggle('aviso-erro', tipo === 'erro');
    aviso.hidden = false;
    clearTimeout(esperaAviso);
    esperaAviso = setTimeout(() => { aviso.hidden = true; }, 8000);
}


/* ---------- Exportar ---------- */

function exportarMiras() {
    const minhas = carregarMinhasMiras();
    if (minhas.length === 0) {
        mostrarAviso('Você ainda não tem miras suas para exportar. Crie uma em "+ Nova mira" ou importe um backup.', 'erro');
        return;
    }

    const dados = {
        site: 'Valorant Hub',
        versao: 1,
        exportadoEm: new Date().toISOString(),
        miras: minhas.map(({ nome, codigo }) => ({ nome, codigo })),
    };

    // Cria o arquivo na memória e "clica" num link de download
    const arquivo = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(arquivo);
    link.download = `minhas-miras-valorant-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);

    const total = minhas.length === 1 ? '1 mira' : `${minhas.length} miras`;
    mostrarAviso(`Backup salvo: ${link.download} (${total}).`);
}


/* ---------- Importar ---------- */

/**
 * Lê o texto do arquivo e devolve uma lista de { nome, codigo }.
 * Aceita:
 *  - o .json exportado por este site
 *  - um .txt com um código por linha (pode ter um nome antes, ex.: "TenZ: 0;P;c;5...")
 */
function lerBackup(texto) {
    try {
        const dados = JSON.parse(texto);
        const lista = Array.isArray(dados) ? dados : dados.miras;
        if (!Array.isArray(lista)) return [];
        return lista.map(item => (typeof item === 'string' ? { codigo: item } : item));
    } catch {
        // Não é JSON: procura um código no fim de cada linha
        return texto.split(/\r?\n/).map(linha => {
            const achou = linha.trim().match(/^(.*?)[\s:–-]*(0(?:;\S*)?)$/);
            return achou ? { nome: achou[1].trim(), codigo: achou[2] } : null;
        }).filter(Boolean);
    }
}

async function importarArquivo(arquivo) {
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAXIMO) {
        mostrarAviso('Esse arquivo é grande demais para ser um backup de miras.', 'erro');
        return;
    }

    const itens = lerBackup(await arquivo.text());
    const minhas = carregarMinhasMiras();
    const jaTem = new Set([...MIRAS_FIXAS, ...minhas].map(mira => codigoCanonico(mira.codigo)));
    let adicionadas = 0;
    let repetidas = 0;

    itens.forEach((item, i) => {
        const codigo = item && typeof item.codigo === 'string' ? codigoCanonico(item.codigo) : null;
        if (!codigo) return; // código inválido: ignora
        if (jaTem.has(codigo)) { repetidas++; return; }

        const nome = typeof item.nome === 'string' && item.nome.trim()
            ? item.nome.trim().slice(0, 40)
            : `Mira ${MIRAS_FIXAS.length + minhas.length + 1}`;
        minhas.push({ id: Date.now() + i, nome, codigo });
        jaTem.add(codigo);
        adicionadas++;
    });

    if (adicionadas === 0 && repetidas === 0) {
        mostrarAviso('Nenhuma mira encontrada nesse arquivo. Use um backup exportado por este site ou um .txt com um código por linha.', 'erro');
        return;
    }
    if (adicionadas > 0 && !salvarMinhasMiras(minhas)) {
        mostrarAviso('Não foi possível salvar: o navegador está bloqueando o armazenamento.', 'erro');
        return;
    }

    const partes = [];
    if (adicionadas) partes.push(adicionadas === 1 ? '1 mira importada' : `${adicionadas} miras importadas`);
    if (repetidas) partes.push(repetidas === 1 ? '1 já estava na lista' : `${repetidas} já estavam na lista`);
    mostrarAviso(partes.join(' · ') + '.');

    if (adicionadas) {
        renderizarMiras();
        destacarMira(); // a mais nova fica no topo
    }
}


/* ---------- Botões ---------- */

botaoExportar.addEventListener('click', exportarMiras);
botaoImportar.addEventListener('click', () => arquivoBackup.click());
arquivoBackup.addEventListener('change', () => {
    importarArquivo(arquivoBackup.files[0]);
    arquivoBackup.value = ''; // permite importar o mesmo arquivo de novo
});
