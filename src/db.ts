import fs from "fs";
import lodash from "lodash";

import { db_setting } from "./constant";
import { EventEmitter } from "events";

type Settings = {
  name?: string;
  folder?: string;
  minify?: boolean;
};

type _Input = string | object | symbol | number | null | boolean;

type Inputs<
  Inp extends _Input = _Input,
  isArray extends boolean = false
> = isArray extends true ? Inp[] : Inp;

interface Events<
  Inp extends _Input = _Input,
  isArray extends boolean = boolean
> {
  set: [key: string, new_data: Inputs<Inp, isArray> | undefined];
  delete: [key: string];
  update: [
    key: string,
    old_data: Inputs<Inp, isArray> | undefined,
    new_data: Inputs<Inp, isArray>
  ];
}

export default class Sagdb<
  Input extends Inputs = Inputs,
  isArray extends boolean = false
> {
  private readonly name: string;
  private readonly minify: boolean;
  private readonly folder: string;
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
    return fs.writeFileSync(
      `./${this.folder}.json`,
      this.minify ? JSON.stringify(data) : JSON.stringify(data, null, 2)
    );
  }

  all(): { [key: string]: any } {
    return JSON.parse(fs.readFileSync(`./${this.folder}.json`).toString());
  }

  set(key: string, new_data: Inputs<Input, isArray>) {
    const json_data = lodash.set(this.all(), key, new_data);
    this.save(json_data);
    this.emit("set", key, new_data);
    return this;
  }

  update(
    key: string,
    cb: (old_data: Inputs<Input, isArray> | undefined) => Inputs<Input, isArray>
  ) {
    const old_data = this.get(key);
    const new_data = cb(old_data);
    this.set(key, new_data);
    this.emit("update", key, old_data, new_data);
  }

  delete(key: string) {
    const old_data = this.all();
    lodash.unset(old_data, key);
    this.save(old_data);
    this.emit("delete", key);
    return this;
  }

  get(key: string) {
    return lodash.get(this.all(), key) as Inputs<Input, isArray> | undefined;
  }

  push(key: string, data: Inputs<Input, isArray>) {
    let old_data = this.get(key);

    if (old_data === undefined) {
      this.set(key, (Array.isArray(data) ? data : [data]) as any);
      return this;
    }

    if (Array.isArray(old_data)) {
      if (Array.isArray(data)) {
        this.set(key, old_data.concat(data) as any);
        return this;
      }

      old_data.push(data as any);
      this.set(key, old_data);
      return this;
    }
    return false;
  }

  add(key: string, data = 1) {
    const old_data = this.get(key);

    if (old_data === undefined) {
      this.set(key, data as any);
      return this;
    }

    if (typeof old_data === "number") {
      this.set(key, +(data + old_data) as any);
      return this;
    }

    return false;
  }

  // EventEmitter
  emit<K extends keyof Events<isArray>>(
    eventName: K,
    ...args: Events<Input, isArray>[K]
  ): boolean {
    return this.emitter.emit(eventName, ...args);
  }

  on<K extends keyof Events<isArray>>(
    eventName: K,
    listener: (...args: Events<Input, isArray>[K]) => void
  ): EventEmitter {
    return this.emitter.on(eventName, listener as (...args: any[]) => void);
  }
}
