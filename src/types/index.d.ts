export type Settings = {
  name?: string;
  folder?: string;
  minify?: boolean;
  secret?: string;
};

export type Input =
  | string
  | number
  | object
  | bigint
  | null
  | undefined
  | symbol
  | [];
