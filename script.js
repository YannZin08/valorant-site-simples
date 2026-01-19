function copiarID(button) {
    // Pega o elemento <code> que está dentro do mesmo id-container
    const codeElement = button.previousElementSibling;
    const idText = codeElement.textContent;

    // Copia para a área de transferência
    navigator.clipboard.writeText(idText).then(() => {
        // Muda o texto do botão
        const originalText = button.textContent;
        button.textContent = '✓ Copiado!';
        button.classList.add('copied');

        // Volta ao normal após 2 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar ID');
    });
}