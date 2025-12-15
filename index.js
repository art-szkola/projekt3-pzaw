import express from "express";
import db from "./database.js"

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  db.all("SELECT name, message FROM messages ORDER BY id DESC", (err, rows) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.render("index", { messages: rows });
  });
});

app.post("/submit", (req, res) => {
  const { name, message } = req.body;

  if (name && message) {
    db.run(
      "INSERT INTO messages (name, message) VALUES (?, ?)",
      [name, message]
    );
  }

  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.send("<h1>O projekcie</h1><p>Ksiazka gosci uzywajaca Express + SQLite.</p>");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
