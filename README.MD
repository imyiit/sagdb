# **Sagdb**

![Image](https://img.shields.io/npm/v/sagdb?color=%2351F9C0&label=sagdb)
![Image](https://img.shields.io/npm/dt/sagdb.svg?color=%2351FC0&maxAge=3600)

#

![Image](https://nodei.co/npm/sagdb.png?downloads=true&downloadRank=true&stars=true)
<br>

**Sagdb** is JSON database system.

<br><br>

# <i class="fa-solid fa-download"></i> **Installation**

```bash
$ npm install sagdb
```

<br>

# <i class="fa-solid fa-bookmark"></i> **Usage**

```js
//JavaScript version
const Sagdb = require("sagdb").default;
```

```ts
//TypeScript version
import Sagdb from "sagdb";
```

- Default database name is "**db**".

- Db name and folder name is must be **String**.

- Database folder name is optional.

- If you want readable database, set "**minify**" to false.

<br>

```js
const db = new Sagdb({ name: "database", folder: "foldername", minify: true });
```

```js
const db = new Sagdb({ name: "database", folder: "folder/database" });
```

```js
const db = new Sagdb({ name: "database" });
```

<br><br>

# <i class="fa-solid fa-terminal"></i> **COMMANDS**

<br>

## **set**

- Set any value with **key**.

```js
db.set("key", "apple"); // -> apple
```

<br>

> Can't set **Function**.

```js
function test() {}
db.set("key", test); // -> return Error
```

<br><br>

## **get**

- Get any value with **key**.

```js
db.set("key", "apple"); // -> apple

db.get("key"); // -> apple
```

<br><br>

## **update**

- Update get a **callback function**, give old data and return must be a same type **old data**.

```js
db.update("key", (old_data) => {
  const new_data = old_data.toUpperCase();
  return new_data;
});
```

<br><br>

## **delete**

- Delete any key from database.

```js
db.set("key", "apple"); // -> apple

db.delete("key"); // -> apple

db.get("key"); // -> undefined
```

<br><br>

## **add**

- Add number to **number** value.

- Value must be a **Number**.

- Default number is **1**.

```js
db.set("number", 1); // -> 1
db.get("number"); // -> 1

db.add("number", 3); // -> 4
db.get("number"); // -> 4

db.add("number"); // -> 5
db.get("number"); // 5

db.add("number", "asd"); // return false
```

<br>

## **Extra**

U can set object in object.

```js
db.set("key.value", "apple"); // -> apple
db.get("key"); // -> { value : "apple" }
```

<br>

<br>

# **Table**

```ts
import Sagdb, { Table } from "sagdb";

const db = new Sagdb({ name: "database" });

const table = new Table(db, "table_name");
```

## **add**

```ts
table.add(1); // -> {_id: "uuid", data: 1, createdAt: number, updatedAt: number}
```

<br>

## **find**

```ts
table.find(callback | data_object); // -> {_id: "uuid", data: 1, createdAt: number, updatedAt: number} | undefined
```

<br>

## **findById**

```ts
table.findById("uuid"); // -> {_id: "uuid", data: 1, createdAt: number, updatedAt: number} | undefined
```

<br>

## **update**

```ts
table.update(callback | data_object, new_data); // -> {_id: "uuid", data: 1, createdAt: number, updatedAt: number} | undefined
```

<br>

## **filter**

```ts
table.filter(callback | data_object, new_data); // -> old_data:  {_id: "uuid", data: 1, createdAt: number, updatedAt: number}[] | undefined
```

<br>

## **remove**

```ts
table.update(callback); // -> {_id: "uuid", data: 1, createdAt: number, updatedAt: number} | undefined
```

<br><br>

# **Listeneer's**

## **On**

```ts
table.on("event_name", callback()); // -> Listening.
```

<br>

> _Example_

```ts
table.on("add", callback(new_data));

table.on("update", callback(callback(new_data, old_data)));

table.on("delete", callback());
```

<br>

> ## License [MIT](https://choosealicense.com/licenses/mit/)

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
