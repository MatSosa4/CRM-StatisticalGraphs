import sql from './sql.js';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 8081;

app.use(cors());

app.get('/api/usuarios', async (req, res) => {
  const query = await sql`
    SELECT * FROM USUARIOS;
  `;
  res.json(query);
});

app.get('/api/bases', async (req, res) => {
  const query = await sql`
    SELECT * FROM BASE;
  `
  res.json(query);
});

app.get('/api/contactos', async (req, res) => {
  const query = await sql`
    SELECT * FROM CONTACTOS;
  `
  res.json(query);
});

app.get('/api/promociones', async (req, res) => {
  const query = await sql`
    SELECT * FROM PROMOCIONES;
  `
  res.json(query);
});

app.get('/api/leads', async (req, res) => {
  const query = await sql`
    SELECT * FROM LEADS;
  `
  res.json(query);
});

app.get('/api/propuestas', async (req, res) => {
  const query = await sql`
    SELECT * FROM PROPUESTAS;
  `
  res.json(query);
});

app.get('/api/cierres', async (req, res) => {
  const query = await sql`
    SELECT * FROM CIERRES;
  `
  res.json(query);
});

// Listen API
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
