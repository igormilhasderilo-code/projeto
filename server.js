import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let db;
(async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS logins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);
})();

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Campos obrigatórios");

  await db.run("INSERT INTO logins (username, password) VALUES (?, ?)", [username, password]);
  res.send("Login salvo com sucesso!");
});


app.get("/logins", async (req, res) => {
  const rows = await db.all("SELECT * FROM logins");
  res.json(rows);
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
