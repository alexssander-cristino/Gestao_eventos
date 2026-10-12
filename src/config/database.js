
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    throw new Error('A variável DATABASE_URL não foi configurada.');
}

const producao = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: producao
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on('error', (erro) => {
    console.error('Erro inesperado no pool PostgreSQL:', erro.message);
});

module.exports = pool;