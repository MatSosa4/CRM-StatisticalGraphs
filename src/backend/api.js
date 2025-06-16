import sql from './sql.js';

import express from 'express';
import cors from 'cors';
import moment from 'moment';
import { getISOWeekRange } from './utils.js';

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
  // estado = Base/Contacto/Inhabilitado
  // fecha = 2025-06-15 YYYY-MM-DD
  const { estado, fecha } = req.query;

  const weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);
  let query;

  if (estado || fecha) {
    query = await sql`
      SELECT * FROM BASE
      WHERE 
        ${estado ? sql`estado_empresa = ${estado}` : sql`TRUE`} AND 
        fecha_ultima_modif_empresa > ${weeks[weeks.length - 1]} AND 
        fecha_ultima_modif_empresa <= ${weeks[0]};
    `;
  } else {
    query = await sql`
      SELECT * FROM BASE;
    `
  }

  res.json(query);
});

app.get('/api/contactos', async (req, res) => {
  const query = await sql`
    SELECT b.*, u.nombre_usuario, u.cedula_usuario, u.correo_usuario FROM CONTACTOS c 
    JOIN BASE b ON c.ruc_empresa = b.ruc_empresa
    JOIN USUARIOS u ON u.id_usuario = c.id_usuario;
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

app.get('/api/empresas', async (req, res) => {
  const query = await sql`
    SELECT * FROM TIPO_EMPRESA;
  `;
  res.json(query);
});

app.get('/api/servicios', async (req, res) => {
  const query = await sql`
    SELECT * FROM TIPO_SERVICIO;
  `;
  res.json(query);
});

// Listen API
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
