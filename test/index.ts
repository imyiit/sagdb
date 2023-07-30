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
const userId = "123123";
const table = new Table<{ exp: number; uid: string }>(db, "users", {
  exp: 123,
  uid: userId,
});

table.on("update", (old_data, new_data) => {
  console.log({ old_data, new_data });
});

table.add({ uid: "123", exp: 5 });
table.add({ uid: "323", exp: 2 });
table.update(["data", { uid: "123" }], { exp: 1, uid: "123" });
table.find(["data", { uid: "123" }]);
table.remove((data) => data.data.exp === 1);
table.filter((data) => data.data.exp === 1);
table.update(["data", { uid: "123" }], (old_data) => {
  console.log({ old_data });
  return { exp: 1, uid: "" };
});

table.on("update", (old_data, new_data) => {
  console.log({ old_data, new_data });
});

table.update(
  ["data", { uid: userId }],
  (old_data) => {
    return {
      exp: (old_data?.exp || 10) + 1,
      uid: old_data?.uid || userId,
    };
  },
  true
);

table.update(
  ["data", { uid: userId }],
  (old_data) => {
    return {
      exp: (old_data?.exp || 10) + 1,
    };
  },
  true
);

table.update(["data", { uid: "123" }], (old_data) => {
  return { ...old_data };
});

table.remove((res) => res.data.uid === "323" || res.data.uid === "123123");
