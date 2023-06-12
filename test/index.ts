import Sagdb from "../src";

const db = new Sagdb<string, false>();
db.on("set", (a, b) => {
  console.log(a, b);
});

db.push("", "");

//db.emit("set", "naber mrq", "");
