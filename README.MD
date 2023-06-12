# **Sagdb**

![Image](https://img.shields.io/npm/v/sagdb?color=%2351F9C0&label=sagdb)
![Image](https://img.shields.io/npm/dt/sagdb.svg?color=%2351FC0&maxAge=3600)

#

![Image](https://nodei.co/npm/sagdb.png?downloads=true&downloadRank=true&stars=true)
<br>

**Sagdb** is JSON database system.

## <i class="fa-solid fa-download"></i> **Installation**

```bash
$ npm install sagdb
```

## <i class="fa-solid fa-bookmark"></i> **Usage**

```js
//JavaScript version

const Sagdb = require("sagdb").default;
```
<br>

```ts
//TypeScript version

import Sagdb from "sagdb";
```

Default database name is "**db**".

Db name and folder name is must be **String**.

Database folder name is optional.

If u dont wanna minify set "**minify**" to false.

```js
const db = new Sagdb({ name: "database", folder: "foldername", minify: true });
```

**or**

```js
const db = new Sagdb({ name: "database", folder: "folder/database" });
```

**or**

```js
const db = new Sagdb({ name: "database" });
```

<br>

## You can create multi database.

```js
const userdb = new sagsdb({ name: "userdb" });
const itemdb = new sagsdb({ name: "itemdb" });
```

<br><br>

### <i class="fa-solid fa-terminal"></i> **COMMANDS**

<br>

## **Set**

Key must be a **String**.

```js
db.set("key", "apple"); // -> db
```

Can't set **Function**.

```js
function test() {}
db.set("key", test); // -> return Error
```

<br><br>

## **Get**

Key must be a **String**.

```js
db.set("key", "apple"); // -> db

db.get("key"); // -> apple
```

<br><br>

## **Update**

Update get a callback function, give an old data and return mus be a same type old data.

```js
db.update("key", (old_data) => {
  const new_data = old_data.toUpperCase();

  return new_data;
});
```

<br><br>

## **Delete**

Delete item from database.

```js
db.set("key", "apple"); // -> db

db.delete("key"); // -> db

db.get("key"); // -> undefined
```

<br><br>

## **Push**

Push item in **Array**.

```js
db.push("array", "apple"); // -> db
db.get("array"); // -> ["apple"]

db.push("array", "banana"); // -> db
db.get("array"); // -> ["apple", "banana"]
```

<br><br>

## **Add**

Add number to **number** value.

Value must be a **Number**.

Default number is **1**.

```js
db.set("number", 1); // -> db
db.get("number"); // -> 1

db.add("number", 3); // -> db
db.get("number"); // -> 4

db.add("number"); // -> db
db.get("number"); // 5

db.add("number", "asd"); // return Error
```

<br><br>

## **All**

Return all **Database** object.

<br><br>

## **Extra**

U can set object in object.

```js
db.set("key.value", "apple"); // -> db
db.get("key"); // => {key: { value : "apple" } }
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
