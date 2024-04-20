import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user : "postgres",
  database:"permalist",
  host:"localhost",
  password:"Lakshman@123",
  port:5432
});

db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  const result  =await db.query("select * from items");
  console.log(result.rows)
  items = result.rows
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("insert into items (title) values ($1);",[item]);
  items.push({ title: item });
  console.log({title: item})
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  console.log(req.body.updatedItemTitle)
  // update items set title = 'lakshman' where id = 2;
  db.query("update items set title = $1 where id = $2;",[req.body.updatedItemTitle,req.body.updatedItemId])
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  db.query("delete from items where id = $1 ;",[req.body.deleteItemId])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
