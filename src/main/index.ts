import fs from "fs";
import lodash from "lodash";
import { EventEmitter } from "events";

import { db_setting } from "../constant";
import { save } from "../Utils";

interface Settings {
  name?: string;
  folder?: string;
  minify?: boolean;
}

export type Input = string | object | symbol | number | null | boolean;

interface Events<Inp extends Input = Input> {
  set: [key: string, new_data: Inp | undefined];
  delete: [key: string];
  update: [key: string, old_data: Inp | undefined, new_data: Inp];
}

export default class Sagdb<I extends Input = Input> {
  readonly name: string;
  readonly minify: boolean;
  readonly folder: string;
  private readonly emitter: EventEmitter;

  constructor(setting: Settings = db_setting) {
    this.emitter = new EventEmitter();
    this.name = setting.name ?? db_setting.name;
    this.minify = setting.minify ?? db_setting.minify;

    const folderPathArr = (setting.folder ?? db_setting.folder)
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
  }

  private save(data: any) {
    return save(data, this.folder, this.minify);
  }

  all(): { [key: string]: any } {
    return JSON.parse(fs.readFileSync(`./${this.folder}.json`).toString());
  }

  set(key: string, new_data: I) {
    const json_data = lodash.set(this.all(), key, new_data);
    this.save(json_data);
    this.emit("set", key, new_data);
    return new_data;
  }

  update(key: string, cb: (old_data: I | undefined) => I) {
    const old_data = this.get(key);
    const new_data = cb(old_data);
    this.set(key, new_data);
    this.emit("update", key, old_data, new_data);

    return [old_data, new_data];
  }

  delete(key: string) {
    const old_data = this.all();
    lodash.unset(old_data, key);
    this.save(old_data);
    this.emit("delete", key);
    return old_data;
  }

  get(key: string) {
    return lodash.get(this.all(), key) as I | undefined;
  }

  add(key: string, data = 1) {
    const old_data = this.get(key);

    if (old_data === undefined) {
      this.set(key, data as any);
      return data;
    }

    if (typeof old_data === "number") {
      this.set(key, +(data + old_data) as any);
      return +(data + old_data);
    }

    return false;
  }

  // EventEmitter
  private emit<K extends keyof Events>(
    eventName: K,
    ...args: Events[K]
  ): boolean {
    return this.emitter.emit(eventName, ...args);
  }

  on<K extends keyof Events>(
    eventName: K,
    listener: (...args: Events[K]) => void
  ): EventEmitter {
    return this.emitter.on(eventName, listener as (...args: any[]) => void);
  }
}
