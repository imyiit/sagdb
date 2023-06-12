import Sagdb from "../src";

const db = new Sagdb<string, false>();

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
db.update("fruit", (old_data) => {
  if (old_data === "apple") {
    return "banana";
  }
  return "orange";
});

db.delete("fruit");
