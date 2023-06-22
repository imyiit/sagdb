import Sagdb, { Table } from "../src";

const db = new Sagdb<string>({ name: "ts" });

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

//Table
const table = new Table<{ uid: string; exp: number }>(db, "users");

table.on("update", (old_data, new_data) => {
  console.log({ old_data, new_data });
});

table.add({ uid: "123", exp: 5 });
table.add({ uid: "323", exp: 2 });
table.update(["data", { uid: "123" }], { exp: 1, uid: "123" });
table.remove((data) => data.data.exp === 1);
