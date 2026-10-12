
(() => {
    'use strict';

    window.NexVent = window.NexVent || {};

    window.NexVent.api = async function (url, opcoes = {}) {
        const cabecalhos = {
            ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
            ...(opcoes.headers || {})
        };

        let resposta;

        try {
            resposta = await fetch(url, {
                ...opcoes,
                headers: cabecalhos,
                credentials: 'same-origin'
            });
        } catch {
            throw new Error('Não foi possível conectar ao servidor.');
        }

        const tipoConteudo = resposta.headers.get('content-type') || '';
        const dados = tipoConteudo.includes('application/json')
            ? await resposta.json()
            : null;

        if (!resposta.ok) {
            throw new Error(
                dados?.erro || dados?.mensagem ||
                `A solicitação falhou (${resposta.status}).`
            );
        }

        return dados;
    };
})();
