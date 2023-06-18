const Sagdb = require("../dist/main").default;
const { Table } = require("../dist/main/table");
const db = new Sagdb({ name: "js" });

db.on("set", (key, new_data) => {
  console.log("set", { key, new_data });
});

db.on("update", (key, old_data, new_data) => {
  console.log("update", { key, old_data, new_data });
});

db.on("delete", (key) => {
  console.log("delete", { key });
});

db.set("fruit", "apple");
db.get("fruit"); // apple

db.update("fruit", (old_data) => {
  if (old_data === "apple") {
    return "banana";
  }
  return "orange";
});
// apple => banana

db.add("number", 1);
db.get("number"); // 1

db.all(); // {"array":0,"number":2,"fruit":"banana"}

const table = new Table(db, "users");

table.on("update", (old_data, new_data) => {
  console.log({ old_data, new_data });
});

table.add({ uid: "123", exp: 1 });
table.update(["data", { uid: "123" }], { exp: 15, uid: "123" }, true);
