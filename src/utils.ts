export const getArgsTip = (args: any[]) => args.map((a) => typeof a).join(", ");
export const createError = (args: any[]) => new Error(`No overload matched for arguments: [${getArgsTip(args)}]`);

export type TupleToIntersection<T extends any[]> = {
  [K in keyof T]: (x: T[K]) => void;
} extends {
  [K: number]: (x: infer I) => void;
}
  ? I
  : never;
