import Sags from "../src";

const db = new Sags();
db.set("a", "b");
console.log(db.get("a")); // "b"
