import fs from "fs";
export function save(data: any, folder: string, minify: boolean) {
  return fs.writeFileSync(
    `./${folder}.json`,
    minify ? JSON.stringify(data) : JSON.stringify(data, null, 2)
  );
}
