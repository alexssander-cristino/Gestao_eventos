
(() => {
    'use strict';

    const paginas = [
        { id: 'painel', nome: 'Painel', url: '/painel', icone: '⌂' },
        { id: 'eventos', nome: 'Eventos', url: '/eventos', icone: '▦' },
        { id: 'clientes', nome: 'Clientes', url: '/clientes', icone: '♙' },
        { id: 'orcamentos', nome: 'Orçamentos', url: '/orcamentos', icone: '▤' },
        { id: 'financeiro', nome: 'Financeiro', url: '/financeiro', icone: 'R$' }
    ];

    function escapar(valor) {
        return String(valor).replace(/[&<>"']/g, caractere => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[caractere]);
    }

    function aplicarTema(tema) {
        const temaValido = tema === 'dark' ? 'dark' : 'light';

        document.documentElement.dataset.theme = temaValido;

        try {
            localStorage.setItem('nexvent.theme', temaValido);
        } catch {
            // O sistema continua funcionando se o armazenamento estiver indisponível.
        }

        const botao = document.querySelector('[data-theme-toggle]');

        if (botao) {
            botao.setAttribute(
                'aria-label',
                temaValido === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
            );

            botao.textContent = temaValido === 'dark' ? '☼' : '◐';
        }
    }

    function inicializar() {
        const conteudo = document.getElementById('page-content');

        if (!conteudo) {
            console.error('Elemento #page-content não encontrado.');
            return;
        }

        const paginaAtual = document.body.dataset.page || 'painel';
        const tituloAtual = paginas.find(p => p.id === paginaAtual)?.nome || 'NexVent';

        const conteudoOriginal = conteudo.innerHTML;

        let temaSalvo = 'light';

        try {
            temaSalvo = localStorage.getItem('nexvent.theme') || 'light';
        } catch {
            // Usa o tema claro como padrão.
        }

        document.documentElement.dataset.theme =
            temaSalvo === 'dark' ? 'dark' : 'light';

        const linksDesktop = paginas.map(pagina => `
            <a class="nav-link ${pagina.id === paginaAtual ? 'active' : ''}"
               href="${pagina.url}"
               ${pagina.id === paginaAtual ? 'aria-current="page"' : ''}>
                <span class="nav-icon" aria-hidden="true">${pagina.icone}</span>
                <span>${pagina.nome}</span>
            </a>
        `).join('');

        const linksMobile = paginas.map(pagina => `
            <a href="${pagina.url}"
               class="${pagina.id === paginaAtual ? 'active' : ''}"
               ${pagina.id === paginaAtual ? 'aria-current="page"' : ''}>
                <span class="nav-icon" aria-hidden="true">${pagina.icone}</span>
                <span>${pagina.nome}</span>
            </a>
        `).join('');

        const nomeEmpresa = (() => {
            try {
                return localStorage.getItem('nexvent.empresa') || 'Minha empresa';
            } catch {
                return 'Minha empresa';
            }
        })();

        document.body.innerHTML = `
            <div class="app-shell">
                <aside class="sidebar">
                    <a class="brand" href="/painel">
                        <span class="brand-mark">N</span>
                        <span>
                            <span class="brand-name">NexVent</span>
                            <span class="brand-subtitle">Gestão de eventos</span>
                        </span>
                    </a>

                    <p class="nav-label">Menu principal</p>

                    <nav class="nav-menu" aria-label="Menu principal">
                        ${linksDesktop}
                        <a class="nav-link ${paginaAtual === 'configuracoes' ? 'active' : ''}"
                           href="/configuracoes">
                            <span class="nav-icon" aria-hidden="true">⚙</span>
                            <span>Configurações</span>
                        </a>
                    </nav>

                    <div class="sidebar-bottom">
                        <div class="company-card">
                            <div class="company-name" data-company-name>
                                ${escapar(nomeEmpresa)}
                            </div>
                            <div class="company-caption">Área da empresa</div>
                        </div>
                    </div>
                </aside>

                <div class="main-area">
                    <header class="topbar">
                        <div>
                            <p class="topbar-title">${escapar(tituloAtual)}</p>
                        </div>

                        <div class="topbar-actions">
                            <button class="btn-icon"
                                    type="button"
                                    data-theme-toggle
                                    aria-label="Alternar tema">◐</button>
                            <button class="btn btn-secondary"
                                    type="button"
                                    data-logout>
                                Sair
                            </button>
                        </div>
                    </header>

                    <main class="page-container" id="page-container">
                        ${conteudoOriginal}
                    </main>
                </div>

                <nav class="mobile-nav" aria-label="Navegação mobile">
                    ${linksMobile}
                </nav>

                <div class="toast-container" id="toast-container"
                     aria-live="polite"></div>
            </div>
        `;

        document.querySelector('[data-theme-toggle]')
            ?.addEventListener('click', () => {
                const temaAtual = document.documentElement.dataset.theme;
                aplicarTema(temaAtual === 'dark' ? 'light' : 'dark');
            });

        document.querySelector('[data-logout]')
            ?.addEventListener('click', () => {
                if (typeof window.nexventLogout === 'function') {
                    window.nexventLogout();
                    return;
                }

                window.location.href = '/login';
            });

        aplicarTema(temaSalvo);

        document.dispatchEvent(new CustomEvent('nexvent:layout-ready', {
            detail: { pagina: paginaAtual }
        }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();