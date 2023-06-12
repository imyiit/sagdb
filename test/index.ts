import Sagdb from "../src";

const db = new Sagdb<string, false>();
db.on("set", (key, data) => {
  console.log(key, data);
});

db.on("delete", (key) => {
  console.log(key);
});

db.set("a", "b");
