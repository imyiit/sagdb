import fs from "fs";
import lodash from "lodash";
import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Sagdb, { type Input } from "./index";
import { save } from "../Utils";

interface Data<I extends Input> {
  _id: string;
  data: I;
  createdAt: number;
  updatedAt: number;
}

type Callback<I extends Input, T extends keyof Data<I>> =
  | ((res: Data<I>) => boolean)
  | [key: T, value: Partial<Data<I>[T]>];

interface Events<I extends Input = Input> {
  add: [new_data: I | undefined];
  update: [old_data: I | undefined, new_data: I];
  remove: [old_data: I];
}

function Data<I extends Input>(data: I, old_data?: Data<I>): Data<I> {
  return {
    _id: old_data ? old_data._id : uuidv4(),
    data,
    updatedAt: Date.now(),
    createdAt: old_data ? old_data.createdAt : Date.now(),
  };
}

export class Table<I extends Input> {
  readonly name: string;
  readonly minify: boolean;
  readonly folder: string;

  private key: string;
  private data: Data<I>[];
  private readonly emitter: EventEmitter;

  constructor(Sagdb: Sagdb, key: string) {
    this.name = Sagdb.name;
    this.folder = Sagdb.folder;
    this.minify = Sagdb.minify;
    this.key = key;
    this.emitter = new EventEmitter();

    const res = lodash.get(this.all(), this.key) as Data<I>[] | undefined;
    this.data = res ? res : [];
  }

  private save(data: any) {
    return save(data, this.folder, this.minify);
  }

  private all(): { [key: string]: any } {
    return JSON.parse(fs.readFileSync(`./${this.folder}.json`).toString());
  }

  add(data: I) {
    const result = Data<I>(data);

    this.data.push(result);

    const json_data = lodash.set(this.all(), this.key, this.data);

    this.save(json_data);
    this.emit("add", result);

    return result;
  }

  findById(id: string) {
    return this.data.find((res) => res._id === id);
  }

  find<T extends keyof Data<I>>(callback: Callback<I, T>) {
    return lodash.find(this.data, callback);
  }

  update<T extends keyof Data<I>>(
    callback: Callback<I, T>,
    data: I,
    force?: boolean
  ) {
    const old_data_index = lodash.findIndex(this.data, callback);

    if (old_data_index < 0) {
      if (force) {
        return this.add(data);
      }

      return undefined;
    }

    const old_data = lodash.find(this.data, callback);
    const new_data = Data<I>(data, old_data);

    this.data.splice(old_data_index, 1, new_data);

    const json_data = lodash.set(this.all(), this.key, this.data);
    this.save(json_data);
    this.emit("update", old_data, new_data);

    return lodash.find(this.data, callback);
  }

  filter<T extends keyof Data<I>>(callback: Callback<I, T>) {
    return lodash.filter(this.data, callback);
  }

  remove(callback: (res: Data<I>) => boolean) {
    lodash.remove(this.data, callback);

    const old_data = lodash.filter(this.data, callback);
    const json_data = lodash.set(this.all(), this.key, this.data);

    this.save(json_data);
    this.emit("remove", old_data);

    return this.data;
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
