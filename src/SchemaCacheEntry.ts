import * as v from "valibot";

export interface SchemaCacheEntry {
  schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
  fn: (...args: any[]) => any;
}
