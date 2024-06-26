import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "kiloflow",
  connectionLimit: 10,
});

export async function query(sql: string, values?: any[]) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, values);
    return rows;
  } finally {
    if (conn) conn.release(); // release to pool
  }
}
