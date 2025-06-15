import postgres from "postgres";

const sql = postgres('postgres://root:root@localhost:5432/plus');

export default sql;
