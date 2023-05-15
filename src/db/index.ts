import fs from "node:fs";
import lodash from "lodash";

import { defaultDatabaseSettings } from "../constants";
import { allDb, saveDB } from "../utils";

export type Settings = {
  name?: string;
  folder?: string;
  minify?: boolean;
};

export type Input = string | number | object | symbol;

export default class Jdb<I = Input, O = Input> {
  readonly name;
  readonly minify;
  readonly folder;
  private readonly db: object;

  constructor(setting: Settings = defaultDatabaseSettings) {
    this.name = setting.name ?? defaultDatabaseSettings.name;
    this.minify = setting.minify ?? defaultDatabaseSettings.minify;

    const folderPathArr = (setting.folder ?? defaultDatabaseSettings.folder)
      .toLocaleLowerCase()
      .split("/")
      .filter((p) => p !== ".");

    this.folder = folderPathArr.join("/") + "/" + this.name;

    if (!fs.existsSync(`./${this.folder}.json`)) {
      folderPathArr.reduce((previus, current, i, a) => {
        previus += current + "/";
        if (!fs.existsSync(`.${previus}`)) {
          fs.mkdirSync(`.${previus}`);
        }
        if (i === a.length - 1) {
          fs.writeFileSync(`./${this.folder}.json`, "{}");
        }
        return previus;
      }, "/");
    }

    this.db = allDb(`${this.folder}`);
  }

  set(key: string, data: Input) {
    const json_data = lodash.set(this.db, key, data);
    saveDB(json_data, this.folder, this.minify);
    return this;
  }

  delete(key: string) {
    const newDb = { ...this.db };
    lodash.unset(newDb, key);
    saveDB(newDb, this.folder, this.minify);
    return this;
  }

  get(key: string): O | undefined {
    return lodash.get(this.db, key);
  }

  has(key: string) {
    return lodash.has(this.db, key);
  }

  type(key: string) {
    const type = this.get(key);
    return Array.isArray(type) ? "array" : typeof type;
  }

  push(key: string, data: I) {
    const item = this.get(key) as typeof Array | Omit<typeof Array, any>;
    if (!Array.isArray(item)) {
      this.set(key, [data]);
      return data;
    }
    item.push(data);
    this.set(key, item);
    return item as Input;
  }

  unpush(key: string, data: I) {
    const item = this.get(key);
    if (!Array.isArray(item)) {
      return false;
    }
    lodash.remove(item, function (x) {
      return x === data;
    });
    this.set(key, item);
    return item;
  }

  add(key: string, num: number = 1) {
    const data = this.get(key);

    if (typeof data === "number") {
      const Num = data + num;
      this.set(key, Num);
      return Num;
    }

    if (!data) {
      this.set(key, num);
      return num;
    }

    return false;
  }

  subtract(key: string, num: number = 1) {
    const data = this.get(key);

    if (typeof data === "number") {
      const Num = data - num;
      this.set(key, Num);
      return Num;
    }

    if (!data) {
      this.set(key, Number(num));
      return num;
    }

    return false;
  }

  all() {
    return allDb(this.folder);
  }

  deleteAll() {
    saveDB({}, this.folder, this.minify);
    return true;
  }

  dbSIZE() {
    return fs.statSync(`./${this.folder}.json`).size;
  }
}
