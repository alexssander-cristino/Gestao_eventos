
(() => {
    'use strict';

    window.NexVent = window.NexVent || {};

    window.NexVent.toast = function (mensagem, tipo = 'success') {
        const container = document.getElementById('toast-container');

        if (!container) {
            console.log(mensagem);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${tipo === 'error' ? 'error' : 'success'}`;
        toast.textContent = mensagem;
        container.appendChild(toast);

        window.setTimeout(() => toast.remove(), 4000);
    };

    window.NexVent.moeda = function (valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(valor) || 0);
    };

    window.NexVent.data = function (valor) {
        if (!valor) return '—';

        const data = new Date(`${String(valor).slice(0, 10)}T12:00:00`);

        if (Number.isNaN(data.getTime())) return '—';

        return new Intl.DateTimeFormat('pt-BR').format(data);
    };

    window.NexVent.confirmar = function (mensagem) {
        return window.confirm(mensagem);
    };
})();
