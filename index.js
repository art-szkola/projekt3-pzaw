import express from "express";
import db from "./database.js"
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import session from "express-session";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "extraordinarily_secret_string_noone_can_guess_123456789_jan_kasprzak_to_bardzo_mily_kolega", // Change to an actually secret string if the project is ever used
    resave: false,
    saveUninitialized: false
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).send("Database error");

    res.render("index", {
      messages: rows,
      currentUserId: req.session.userId || null,
      isAdmin: req.session.isAdmin || false,
    });
  });
});

// Make admin account

async function createAdmin() {
  const username = "admin";
  const displayName = "Administrator";
  const password = "admin123";
  const email = "admin@admin.admin";
  const hashedPass = await bcrypt.hash(password, 10);

  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, user) => {
      if (err) {
        console.log("DB error checking admin:", err);
        return;
      }

      if (!user) {
        db.run(
          "INSERT INTO users (username, displayname, password, email, admin) VALUES (?, ?, ?, ?, 1)",
          [username, displayName, hashedPass, email],
          (err) => {
            if (err) console.log("Error creating admin:", err);
            else console.log("Admin account created!");
          }
        );
      } else {
        console.log("Admin already exists, skipping creation.");
      }
    }
  );
}

createAdmin();

// Login

app.post("/login", async (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) return res.send("Missing Credentials");

  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, username],
    async (err,user) => {
      if (err) return res.send("Database error");
      if (!user) return res.send("Invalid user details");

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.send("Invalid password");

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.display_name = user.displayname
      req.session.isAdmin = user.admin === 1;

      res.redirect("/")
    }
  );
});

// Signup

app.post("/signup", async (req,res) => {
  const {username, display_name, password, rep_pass, email} = req.body;
  if (!username || !display_name || !password || !rep_pass || !email) {
    return res.send("Missing fields");
  };
  if (password != rep_pass) {
    return res.send("Repeated password is incorrect")
  };
  const hashedPass = await bcrypt.hash(password,10);

  db.run(
    "INSERT INTO users (username, displayname, password, email) VALUES (?,?,?,?)",
    [username, display_name, hashedPass, email],
    (err) => {
      if (err) {
        console.log(err)
        return res.send("User already exists");
      }
      res.redirect("/login");
    }
  );
});

// Sending messages

app.post("/submit", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const { message } = req.body;
  const userId = req.session.userId;
  const displayName = req.session.display_name; 

  if (message) {
    db.run(
      "INSERT INTO messages (user_id, name, message) VALUES (?, ?, ?)",
      [userId, displayName, message]
    );
  }
  res.redirect("/");
});

// Deleting messages
app.post("/delete/:id", (req, res) => {
  const msgId = req.params.id;

  db.get("SELECT * FROM messages WHERE id = ?", [msgId], (err, msg) => {
    if (!msg) return res.send("Message not found");
    if (msg.user_id !== req.session.userId && !req.session.isAdmin) return res.send("Forbidden");

    db.run("DELETE FROM messages WHERE id = ?", [msgId], () => {
      res.redirect("/");
    });
  });
});

// Editing messages

app.get("/edit/:id", (req, res) => {
  const msgId = req.params.id;
  db.get("SELECT * FROM messages WHERE id = ?", [msgId], (err, msg) => {
    if (!msg) return res.send("Message not found");
    if (msg.user_id !== req.session.userId && !req.session.isAdmin) return res.send("Forbidden");

    res.render("edit", { message: msg });
  });
});

app.post("/edit/:id", (req, res) => {
  const msgId = req.params.id;
  const { message } = req.body;

  db.get("SELECT * FROM messages WHERE id = ?", [msgId], (err, msg) => {
    if (!msg) return res.send("Message not found");
    if (msg.user_id !== req.session.userId && !req.session.isAdmin) return res.send("Forbidden");

    db.run("UPDATE messages SET message = ? WHERE id = ?", [message, msgId], () => {
      res.redirect("/");
    });
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.send("Error logging out");
    }
    res.redirect("/login");
  });
});

app.get("/about", (req, res) => {
  res.send("<h1>About project</h1><p>Message board using SQLITE and Express</p>");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
