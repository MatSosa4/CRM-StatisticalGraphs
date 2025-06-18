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
  const { estado, fecha, ingreso } = req.query;

  let weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);

  let query;

  query = await sql`
  SELECT b.*, ${ingreso == 'true' ? sql`b.fecha_ingreso_empresa` : sql `b.fecha_ultima_modif_empresa`} AS fecha_modif, u.nombre_usuario, u.cedula_usuario FROM BASE b
    JOIN USUARIOS u ON u.id_usuario = b.id_usuario
  WHERE 
    ${estado ? sql`estado_empresa = ${estado}` : sql`TRUE`} AND 
    ${ingreso == 'true' ?
      (fecha !== 'all' ? sql `fecha_ingreso_empresa > ${weeks[weeks.length - 1]} AND 
      fecha_ingreso_empresa <= ${weeks[0]}` : sql`TRUE`) :
      (fecha !== 'all' ? sql `fecha_ultima_modif_empresa > ${weeks[weeks.length - 1]} AND 
      fecha_ultima_modif_empresa <= ${weeks[0]}` : sql`TRUE`)
    }
  `;

  res.json(query);
});

app.get('/api/contactos', async (req, res) => {
  const { fecha, ingreso } = req.query;
  const weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);

  const query = await sql`
  SELECT b.*, ${ingreso == 'true' ? sql`b.fecha_ingreso_empresa` : sql `b.fecha_ultima_modif_empresa`} AS fecha_modif, u.nombre_usuario, u.cedula_usuario, u.correo_usuario FROM CONTACTOS c 
    JOIN BASE b ON c.ruc_empresa = b.ruc_empresa
    JOIN USUARIOS u ON u.id_usuario = c.id_usuario
  WHERE
    ${ingreso == 'true' ?
      (fecha !== 'all' ? sql `fecha_ingreso_empresa > ${weeks[weeks.length - 1]} AND 
      fecha_ingreso_empresa <= ${weeks[0]}` : sql`TRUE`) :
      (fecha !== 'all' ? sql `fecha_ultima_modif_empresa > ${weeks[weeks.length - 1]} AND 
      fecha_ultima_modif_empresa <= ${weeks[0]}` : sql`TRUE`)
    };`

  res.json(query);
});

app.get('/api/promociones', async (req, res) => {
  const { fecha } = req.query;
  const weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);

  const query = await sql`
  SELECT b.nombre_tipo AS tipo_empresa, p.*, p.fecha_ingreso_promocion AS fecha_modif, p.nombre_tipo AS tipo_servicio, u.nombre_usuario, u.cedula_usuario FROM PROMOCIONES p
    JOIN USUARIOS u ON u.id_usuario = p.id_usuario
    JOIN BASE b ON b.ruc_empresa = p.ruc_empresa
  WHERE
    fecha_ingreso_promocion > ${weeks[weeks.length - 1]} AND 
    fecha_ingreso_promocion <= ${weeks[0]};
  `
  res.json(query);
});

app.get('/api/leads', async (req, res) => {
  const { fecha } = req.query;
  const weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);
  
  const query = await sql`
  SELECT l.*, l.fecha_ingreso_lead AS fecha_modif, p.nombre_tipo, p.ruc_empresa, u.nombre_usuario, u.cedula_usuario FROM LEADS l
    JOIN USUARIOS u ON u.id_usuario = l.id_usuario
    JOIN PROMOCIONES p ON l.id_promocion = p.id_promocion
  WHERE
    fecha_ingreso_lead > ${weeks[weeks.length - 1]} AND 
    fecha_ingreso_lead <= ${weeks[0]};
    `
  res.json(query);
});

app.get('/api/propuestas', async (req, res) => {
  const { fecha } = req.query;
  const weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);
  
  const query = await sql`
  SELECT pr.*, pr.fecha_ingreso_propuesta AS fecha_modif, p.nombre_tipo, p.ruc_empresa, u.nombre_usuario, u.cedula_usuario FROM PROPUESTAS pr
    JOIN USUARIOS u ON u.id_usuario = pr.id_usuario
    JOIN LEADS l ON l.id_lead = pr.id_lead
    JOIN PROMOCIONES p ON l.id_promocion = p.id_promocion
  WHERE
    fecha_ingreso_propuesta > ${weeks[weeks.length - 1]} AND 
    fecha_ingreso_propuesta <= ${weeks[0]};
    `
  res.json(query);
});

app.get('/api/cierres', async (req, res) => {
  const { fecha } = req.query;
  const weeks = fecha ? getISOWeekRange(moment(fecha), 4) : getISOWeekRange(moment(), 4);
  
  const query = await sql`
  SELECT c.*, c.firma_contrato_cierre AS fecha_modif, p.nombre_tipo, p.ruc_empresa, u.nombre_usuario, u.cedula_usuario FROM CIERRES c
    JOIN USUARIOS u ON u.id_usuario = c.id_usuario
    JOIN PROPUESTAS pr ON pr.id_propuesta = c.id_propuesta
    JOIN LEADS l ON l.id_lead = pr.id_lead
    JOIN PROMOCIONES p ON l.id_promocion = p.id_promocion
  WHERE
    firma_contrato_cierre > ${weeks[weeks.length - 1]} AND 
    firma_contrato_cierre <= ${weeks[0]};
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
