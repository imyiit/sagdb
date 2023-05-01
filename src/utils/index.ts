import fs from "node:fs";
export function saveDB(data: object, folder: string, minify: boolean) {
  const json_data = minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  return fs.writeFileSync(`./${folder}.json`, json_data);
}

export function allDb(folder: string) {
  return JSON.parse(fs.readFileSync(`./${folder}.json`).toString());
}
