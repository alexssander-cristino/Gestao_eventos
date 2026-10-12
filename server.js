
require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const PAGES_DIR = path.join(PUBLIC_DIR, 'pages');

app.disable('x-powered-by');

app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.APP_URL
        : true,
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use('/api', rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        erro: 'Muitas requisições. Aguarde um momento e tente novamente.'
    }
}));

// Arquivos públicos: CSS, JavaScript, imagens e demais recursos.
app.use(express.static(PUBLIC_DIR, {
    index: false,
    maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0
}));

// Páginas independentes.
const paginas = {
    '/': 'login.html',
    '/login': 'login.html',
    '/cadastro': 'cadastro.html',
    '/painel': 'painel.html',
    '/eventos': 'eventos.html',
    '/clientes': 'clientes.html',
    '/orcamentos': 'orcamentos.html',
    '/financeiro': 'financeiro.html',
    '/configuracoes': 'configuracoes.html'
};

for (const [rota, arquivo] of Object.entries(paginas)) {
    app.get(rota, (req, res) => {
        res.sendFile(path.join(PAGES_DIR, arquivo), (erro) => {
            if (erro && !res.headersSent) {
                res.status(500).send('Não foi possível carregar esta página.');
            }
        });
    });
}

// Verificação de disponibilidade do servidor.
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        sistema: 'NexVent',
        ambiente: process.env.NODE_ENV || 'development',
        horario: new Date().toISOString()
    });
});

// Resposta padrão para rotas de API inexistentes.
app.use('/api', (req, res) => {
    res.status(404).json({
        erro: 'Rota da API não encontrada.'
    });
});

// Página inexistente.
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Página não encontrada | NexVent</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f5f7fb;
                    color: #172033;
                    display: grid;
                    place-items: center;
                    min-height: 100vh;
                    margin: 0;
                }
                main { text-align: center; padding: 24px; }
                a { color: #6558e8; }
            </style>
        </head>
        <body>
            <main>
                <h1>404</h1>
                <p>Esta página não foi encontrada.</p>
                <a href="/login">Voltar ao início</a>
            </main>
        </body>
        </html>
    `);
});

// Tratamento centralizado de erros.
app.use((erro, req, res, next) => {
    console.error('Erro no servidor:', erro);

    if (res.headersSent) {
        return next(erro);
    }

    res.status(500).json({
        erro: 'Ocorreu um erro interno no servidor.'
    });
});

app.listen(PORT, () => {
    console.log(`NexVent disponível em http://localhost:${PORT}`);
});