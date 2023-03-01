import fs from "fs";
import lodash from "lodash";

import { defaultDatabaseSettings } from "../constants/index";
import { db as allDb, saveDB } from "../utils";
import type { Input, Settings } from "../types";

export default class Jdb<D = Input> {
  readonly name;
  readonly minify;
  readonly folder;
  readonly hash;
  private readonly db: object;

  constructor(setting: Settings = defaultDatabaseSettings) {
    this.name = setting.name ?? defaultDatabaseSettings.name;
    this.minify = setting.minify ?? defaultDatabaseSettings.minify;

    this.hash = "";

    const folderPathArr = (setting.folder ?? defaultDatabaseSettings.folder)
      .toLocaleLowerCase()
      .split("/")
      .filter((p) => p !== ".");

    this.folder = folderPathArr.join("/") + "/" + this.name;

    if (!fs.existsSync(`./${this.folder}`)) {
      folderPathArr.reduce((pre, cur, i, a) => {
        pre += cur + "/";
        if (!fs.existsSync(`.${pre}`)) {
          fs.mkdirSync(`.${pre}`);
        }

        if (i === a.length - 1) {
          fs.writeFileSync(`./${this.folder}.json`, "{}");
        }
        return pre;
      }, "/");
    }

    this.db = allDb(`${this.folder}`);
  }

  set(key: string, data: Input) {
    const json_data = lodash.set(this.db, key, data ?? null);
    saveDB(json_data, this.folder, this.minify);
    return this;
  }

  delete(key: string) {
    const newDb = { ...this.db };
    lodash.unset(newDb, key);
    saveDB(newDb, this.folder, this.minify);
    return this;
  }

  get(key: string): D {
    return lodash.get(this.db, key);
  }

  has(key: string) {
    return lodash.has(this.db, key);
  }

  type(key: string) {
    const type = this.get(key);
    return Array.isArray(type) ? "array" : typeof type;
  }

  push(key: string, data: Input) {
    const item = this.get(key) as typeof Array | Omit<typeof Array, any>;
    if (!Array.isArray(item)) {
      this.set(key, [data]);
      return data;
    }
    item.push(data);
    this.set(key, item);
    return item as Input;
  }

  unpush(key: string, data: Input) {
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

  all() {
    return allDb(this.folder);
  }

  add(key: string, num = 1) {
    const data = this.get(key);

    if (typeof data === "number") {
      const Num = (data as number) + num;
      this.set(key, Num);
      return Num;
    }

    return false;
  }

  deleteAll() {
    saveDB({}, this.folder, this.minify);
    return true;
  }

  dbSIZE() {
    return fs.statSync(`./${this.folder}.json`).size;
  }
}
